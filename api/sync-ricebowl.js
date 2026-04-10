import crypto from 'crypto';

const APP_ID = process.env.LARK_APP_ID;
const APP_SECRET = process.env.LARK_APP_SECRET;
const APP_TOKEN = 'OfV2bEVkWaq3PVs9ppslgMiVglc';
const TABLE_ID = 'tblQDw5pIpOxJIof';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { name, email, phone, shareWithRicebowl, recommendationEmail, pdfBase64, pdfName } = req.body;

    // 1. Get Tenant Access Token
    const authReq = await fetch('https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: APP_ID, app_secret: APP_SECRET })
    });
    const authRes = await authReq.json();
    const token = authRes.tenant_access_token;
    if (!token) throw new Error('Failed to authenticate with Lark');

    // 2. Upload PDF to Lark using FormData
    const pdfBuffer = Buffer.from(pdfBase64.split(',').pop(), 'base64');
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    
    const formData = new FormData();
    formData.append('file_name', pdfName || 'Resume.pdf');
    formData.append('parent_type', 'bitable_file');
    formData.append('parent_node', APP_TOKEN);
    formData.append('size', pdfBuffer.length.toString());
    formData.append('file', blob, pdfName || 'Resume.pdf');

    const uploadReq = await fetch('https://open.larksuite.com/open-apis/drive/v1/medias/upload_all', {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}` },
      body: formData
    });
    const uploadRes = await uploadReq.json();
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

    const createReq = await fetch(`https://open.larksuite.com/open-apis/bitable/v1/apps/${APP_TOKEN}/tables/${TABLE_ID}/records`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: recordPayload
    });
    const createRes = await createReq.json();

    if (createRes.code !== 0) throw new Error('Failed to insert record: ' + JSON.stringify(createRes));

    return res.status(200).json({ success: true, record_id: createRes.data.record.id });
  } catch (error) {
    console.error('Lark Sync Error:', error.message);
    return res.status(500).json({ error: error.message });
  }
}
