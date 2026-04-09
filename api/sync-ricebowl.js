import https from 'https';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const APP_ID = process.env.LARK_APP_ID;
const APP_SECRET = process.env.LARK_APP_SECRET;
const APP_TOKEN = 'OfV2bEVkWaq3PVs9ppslgMiVglc';
const TABLE_ID = 'tblQDw5pIpOxJIof';

function request(url, options, bodyData) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    if (bodyData) {
      req.write(bodyData);
    }
    req.end();
  });
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, phone, shareWithRicebowl, recommendationEmail, pdfBase64, pdfName } = req.body;

    // 1. Get Tenant Access Token
    const authRes = await request('https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET }));
    
    const token = authRes.tenant_access_token;
    if (!token) throw new Error('Failed to authenticate with Lark');

    // 2. Upload PDF to Lark (Multipart)
    const boundary = '----WebKitFormBoundary' + crypto.randomBytes(16).toString('hex');
    const pdfBuffer = Buffer.from(pdfBase64.split(',').pop(), 'base64');
    
    let parts = [];
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="file_name"\r\n\r\n${pdfName}\r\n`);
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="parent_type"\r\n\r\nbitable_file\r\n`);
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="parent_node"\r\n\r\n${APP_TOKEN}\r\n`);
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="size"\r\n\r\n${pdfBuffer.length}\r\n`);
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="${pdfName}"\r\nContent-Type: application/pdf\r\n\r\n`);

    const part1 = Buffer.from(parts.join(''));
    const part2 = pdfBuffer;
    const part3 = Buffer.from(`\r\n--${boundary}--\r\n`);
    const uploadBuffer = Buffer.concat([part1, part2, part3]);

    const uploadRes = await request('https://open.larksuite.com/open-apis/drive/v1/medias/upload_all', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': uploadBuffer.length
      }
    }, uploadBuffer);

    const fileToken = uploadRes.data?.file_token;
    if (!fileToken) throw new Error('Failed to upload file to Lark: ' + JSON.stringify(uploadRes));

    // 3. Create Bitable Record
    const recordPayload = JSON.stringify({
      fields: {
        "Name": name || "Unknown User",
        "Email": email || "",
        "Phone Number": phone || "",
        "Resume": [{ file_token: fileToken }],
        "Share with Ricebowl": shareWithRicebowl ? "Yes" : "No",
        "Recommendation Email": recommendationEmail ? "Yes" : "No"
      }
    });

    const createRes = await request(`https://open.larksuite.com/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
    }, recordPayload);

    if (createRes.code !== 0) throw new Error('Failed to insert record: ' + JSON.stringify(createRes));

    // For Vite fallback response (if express/vercel res helpers aren't available)
    if (typeof res.json === 'function') {
      res.status(200).json({ success: true, record_id: createRes.data.record.id });
    } else {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true }));
    }
  } catch (error) {
    console.error('Lark Sync Error:', error.message);
    if (typeof res.status === 'function') {
      res.status(500).json({ error: error.message });
    } else {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: error.message }));
    }
  }
}
