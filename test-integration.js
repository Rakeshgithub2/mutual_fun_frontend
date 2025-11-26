// Test frontend-backend integration
const https = require('http');

console.log('🔍 Testing Frontend-Backend Integration...\n');

// Test 1: Backend API directly
function testBackendAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3002,
      path: '/api/funds?limit=3',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          console.log('✅ Backend API Test: SUCCESS');
          console.log(`   Status: ${response.statusCode}`);
          console.log(`   Message: ${response.message}`);
          console.log(`   Data count: ${response.data?.length || 0}`);
          console.log(`   First fund: ${response.data?.[0]?.name || 'N/A'}\n`);
          resolve(response);
        } catch (error) {
          console.log('❌ Backend API Test: FAILED - Invalid JSON');
          console.log(`   Raw response: ${data.substring(0, 200)}...\n`);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ Backend API Test: FAILED - Connection error');
      console.log(`   Error: ${error.message}\n`);
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.log('❌ Backend API Test: FAILED - Timeout\n');
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Test 2: Frontend server accessibility
function testFrontendServer() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 5001,
      path: '/',
      method: 'GET',
    };

    const req = https.request(options, (res) => {
      console.log('✅ Frontend Server Test: SUCCESS');
      console.log(`   Status: ${res.statusCode}`);
      console.log(`   Content-Type: ${res.headers['content-type'] || 'N/A'}\n`);
      resolve(res.statusCode);
    });

    req.on('error', (error) => {
      console.log('❌ Frontend Server Test: FAILED');
      console.log(`   Error: ${error.message}\n`);
      reject(error);
    });

    req.setTimeout(5000, () => {
      req.destroy();
      console.log('❌ Frontend Server Test: FAILED - Timeout\n');
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Test 3: Environment configuration
function testEnvironmentConfig() {
  console.log('🔧 Environment Configuration:');
  console.log(
    `   NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}`
  );
  console.log(`   NODE_ENV: ${process.env.NODE_ENV || 'NOT SET'}`);

  const expectedAPI = 'http://localhost:3002';
  const actualAPI = process.env.NEXT_PUBLIC_API_URL;

  if (actualAPI === expectedAPI) {
    console.log('✅ Environment Config: CORRECT\n');
    return true;
  } else {
    console.log('❌ Environment Config: INCORRECT');
    console.log(`   Expected: ${expectedAPI}`);
    console.log(`   Actual: ${actualAPI}\n`);
    return false;
  }
}

// Run all tests
async function runTests() {
  console.log('🚀 Starting Integration Tests...\n');

  let allPassed = true;

  try {
    // Test environment
    const configOk = testEnvironmentConfig();
    if (!configOk) allPassed = false;

    // Test backend
    await testBackendAPI();

    // Test frontend
    await testFrontendServer();

    console.log('🎉 Integration Tests Summary:');
    if (allPassed) {
      console.log('✅ All systems are working correctly!');
      console.log('✅ Backend API is responsive');
      console.log('✅ Frontend server is running');
      console.log('✅ Environment configuration is correct');
      console.log('\n🌐 Access your app at: http://localhost:5001');
      console.log(
        '🔗 API documentation at: http://localhost:3002/api/funds?limit=1'
      );
    } else {
      console.log('❌ Some issues detected - check above for details');
    }
  } catch (error) {
    console.log('❌ Integration Tests FAILED');
    console.log(`   Error: ${error.message}`);
    allPassed = false;
  }
}

runTests().catch(console.error);
