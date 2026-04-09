import https from 'https';

const appId = 'cli_a9eed0d5dcb89ed3';
const appSecret = 'uwdb9LnnZbG66aPsP1hvReSGzNOzBZoZ';
const appToken = 'OfV2bEVkWaq3PVs9ppslgMiVglc';

function request(url, options, bodyData) {
  return new Promise((resolve, reject) => {
    const req = https.request(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(JSON.parse(data)));
    });
    req.on('error', reject);
    if (bodyData) {
      req.write(JSON.stringify(bodyData));
    }
    req.end();
  });
}

(async () => {
    // 1. Get Token
    const tokenRes = await request('https://open.larksuite.com/open-apis/auth/v3/tenant_access_token/internal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, { app_id: appId, app_secret: appSecret });
    
    console.log("Token response:", tokenRes);
    const token = tokenRes.tenant_access_token;
    
    if (!token) return;

    // 2. Get Tables
    const tablesRes = await request(`https://open.larksuite.com/open-apis/bitable/v1/apps/${appToken}/tables`, {
        method: 'GET',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    
    console.log("Tables:");
    console.log(JSON.stringify(tablesRes.data, null, 2));
    
    const tableId = tablesRes.data?.items?.[0]?.table_id;
    
    if (tableId) {
        console.log(`\nFetching fields for table: ${tableId}`);
        const fieldsRes = await request(`https://open.larksuite.com/open-apis/bitable/v1/apps/${appToken}/tables/${tableId}/fields`, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        console.log("Fields:");
        fieldsRes.data?.items?.forEach(f => {
            console.log(`- ${f.field_name} (ID: ${f.field_id}, Type: ${f.type})`);
        });
    }
})();
