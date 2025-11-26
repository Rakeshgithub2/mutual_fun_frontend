const http = require('http');

console.log('Testing backend API connection...');

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/funds?limit=2',
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
  },
};

const req = http.request(options, (res) => {
  console.log(`✅ Status Code: ${res.statusCode}`);

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      console.log(`✅ API Response:`, {
        message: parsed.message,
        dataCount: parsed.data?.length,
        firstFund: parsed.data?.[0]?.name,
      });
    } catch (e) {
      console.error('❌ Failed to parse response:', e.message);
      console.log('Raw response:', data.substring(0, 200));
    }
  });
});

req.on('error', (e) => {
  console.error(`❌ Connection Error: ${e.message}`);
  console.error(`Make sure the backend server is running on port 3002`);
});

req.on('timeout', () => {
  console.error('❌ Request timed out');
  req.destroy();
});

req.setTimeout(5000);
req.end();
