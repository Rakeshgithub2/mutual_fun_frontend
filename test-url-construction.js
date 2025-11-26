// Test URL construction and API calls
console.log('🔧 Testing URL Construction and API Calls');

// Test 1: URL Construction
const testParams = [
  { category: 'equity' },
  { category: 'equity', subCategory: 'Large Cap' },
  { category: 'equity', subCategory: 'Large Cap', limit: 100 },
  { category: 'commodity' },
  { category: 'commodity', subCategory: 'Gold' },
];

console.log('\n📝 URL Construction Test:');
testParams.forEach((options, index) => {
  const params = new URLSearchParams();
  if (options.category) params.append('category', options.category);
  if (options.subCategory) params.append('subCategory', options.subCategory);
  if (options.limit) params.append('limit', options.limit.toString());
  else params.append('limit', '100');

  const apiUrl = `http://localhost:3002/api/funds?${params.toString()}`;
  console.log(`${index + 1}. ${JSON.stringify(options)}`);
  console.log(`   URL: ${apiUrl}\n`);
});

// Test 2: HTTP Module Test
const http = require('http');
const { URL } = require('url');

async function testAPICall(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'User-Agent': 'Node.js Test',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          status: res.statusCode,
          headers: res.headers,
          data: data,
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(10000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

async function testAllURLs() {
  console.log('🚀 Testing API Calls:\n');

  for (let i = 0; i < testParams.length; i++) {
    const options = testParams[i];
    const params = new URLSearchParams();
    if (options.category) params.append('category', options.category);
    if (options.subCategory) params.append('subCategory', options.subCategory);
    if (options.limit) params.append('limit', options.limit.toString());
    else params.append('limit', '100');

    const apiUrl = `http://localhost:3002/api/funds?${params.toString()}`;

    try {
      console.log(`${i + 1}. Testing: ${JSON.stringify(options)}`);
      console.log(`   URL: ${apiUrl}`);

      const result = await testAPICall(apiUrl);

      if (result.status === 200) {
        const response = JSON.parse(result.data);
        console.log(`   ✅ SUCCESS - Status: ${result.status}`);
        console.log(`   📊 Found: ${response.data?.length || 0} funds`);
        if (response.data?.length > 0) {
          console.log(`   📄 Sample: ${response.data[0]?.name}`);
        }
      } else {
        console.log(`   ❌ ERROR - Status: ${result.status}`);
        console.log(`   📝 Response: ${result.data.substring(0, 200)}`);
      }
    } catch (error) {
      console.log(`   ❌ NETWORK ERROR: ${error.message}`);
    }

    console.log('');
  }
}

testAllURLs().catch(console.error);
