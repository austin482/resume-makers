import https from 'https';
import crypto from 'crypto';

const appId = 'cli_a9eed0d5dcb89ed3';
const appSecret = 'uwdb9LnnZbG66aPsP1hvReSGzNOzBZoZ';
const appToken = 'OfV2bEVkWaq3PVs9ppslgMiVglc';
const tableId = 'tblQDw5pIpOxJIof';

function requestData(url, method, headers, buffer) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, { method, headers }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    req.write(buffer);
    req.end();
  });
}

(async () => {
    // 1. Get Token
    const authRes = await new Promise((resolve) => {
        const req = https.request('https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal', {
            method: 'POST', headers: { 'Content-Type': 'application/json' }
        }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d))); });
        req.write(JSON.stringify({ app_id: appId, app_secret: appSecret })); req.end();
    });
    const token = authRes.tenant_access_token;
    
    // 2. Upload File (Multipart)
    const boundary = '----WebKitFormBoundary' + crypto.randomBytes(16).toString('hex');
    const fileContent = 'Hello World Resume Content';
    
    let parts = [];
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="file_name"\r\n\r\ntest_resume.txt\r\n`);
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="parent_type"\r\n\r\nbitable_file\r\n`);
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="parent_node"\r\n\r\n${appToken}\r\n`);
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="size"\r\n\r\n${fileContent.length}\r\n`);
    parts.push(`--${boundary}\r\nContent-Disposition: form-data; name="file"; filename="test_resume.txt"\r\nContent-Type: text/plain\r\n\r\n${fileContent}\r\n`);
    parts.push(`--${boundary}--\r\n`);

    const buffer = Buffer.from(parts.join(''));
    
    const uploadRes = await requestData('https://open.larksuite.com/open-apis/drive/v1/medias/upload_all', 'POST', {
        'Authorization': `Bearer ${token}`,
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': buffer.length
    }, buffer);
    
    console.log("Upload response:", uploadRes);
    const fileToken = uploadRes.data?.file_token;
    
    // 3. Create Record
    const recordPayload = JSON.stringify({
        fields: {
            "Name": "Test API User",
            "Resume": fileToken ? [{ file_token: fileToken }] : null,
        }
    });

    const createRes = await new Promise((resolve) => {
        const req = https.request(`https://open.larksuite.com/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/records`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        }, res => { let d = ''; res.on('data', c => d += c); res.on('end', () => resolve(JSON.parse(d))); });
        req.write(recordPayload); req.end();
    });
    
    console.log("Create Record response:", createRes);
})();
