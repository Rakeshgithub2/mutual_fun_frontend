const http = require('http');

console.log('🧪 Testing Feedback and Welcome Email Systems\n');

// Test 1: Health Check
function testHealth() {
  return new Promise((resolve, reject) => {
    console.log('1️⃣ Testing Health Endpoint...');
    const req = http.get('http://127.0.0.1:3002/health', (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        if (res.statusCode === 200) {
          console.log('   ✅ Health check passed');
          console.log('   Response:', data);
          resolve(true);
        } else {
          console.log('   ❌ Health check failed');
          reject(new Error(`Status ${res.statusCode}`));
        }
      });
    });
    req.on('error', (err) => {
      console.log('   ❌ Connection failed:', err.message);
      reject(err);
    });
    req.setTimeout(5000);
  });
}

// Test 2: Feedback Endpoint
function testFeedback() {
  return new Promise((resolve, reject) => {
    console.log('\n2️⃣ Testing Feedback Endpoint...');

    const postData = JSON.stringify({
      feedback:
        'This is a test feedback message to verify the system works correctly.',
      userEmail: 'test@example.com',
      timestamp: new Date().toISOString(),
    });

    const options = {
      hostname: '127.0.0.1',
      port: 3002,
      path: '/api/feedback',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
      },
      timeout: 10000,
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (res.statusCode === 200) {
            console.log('   ✅ Feedback endpoint working');
            console.log('   Response:', JSON.stringify(response, null, 2));
            if (response.warning) {
              console.log('   ⚠️  Warning:', response.warning);
            }
            resolve(true);
          } else {
            console.log('   ❌ Feedback endpoint failed');
            console.log('   Status:', res.statusCode);
            console.log('   Response:', data);
            reject(new Error(`Status ${res.statusCode}`));
          }
        } catch (err) {
          console.log('   ❌ Failed to parse response:', data);
          reject(err);
        }
      });
    });

    req.on('error', (err) => {
      console.log('   ❌ Request failed:', err.message);
      reject(err);
    });

    req.on('timeout', () => {
      console.log('   ❌ Request timed out');
      req.destroy();
      reject(new Error('Timeout'));
    });

    req.write(postData);
    req.end();
  });
}

// Test 3: Check Email Configuration
function checkEmailConfig() {
  console.log('\n3️⃣ Checking Email Configuration...');
  const emailUser = process.env.EMAIL_USER;
  const emailPassword = process.env.EMAIL_PASSWORD;
  const resendKey = process.env.RESEND_API_KEY;

  console.log('   📧 Gmail Configuration:');
  console.log('      EMAIL_USER:', emailUser ? '✅ Set' : '❌ Not set');
  console.log('      EMAIL_PASSWORD:', emailPassword ? '✅ Set' : '❌ Not set');

  console.log('   📧 Resend Configuration:');
  console.log('      RESEND_API_KEY:', resendKey ? '✅ Set' : '❌ Not set');

  return Promise.resolve(true);
}

// Run all tests
async function runTests() {
  try {
    // Load environment variables (skip if dotenv not available)
    try {
      require('dotenv').config({ path: './mutual-funds-backend/.env' });
    } catch (e) {
      // Dotenv not available, continue without it
    }

    await testHealth();
    await testFeedback();
    await checkEmailConfig();

    console.log('\n' + '='.repeat(70));
    console.log('✅ ALL TESTS COMPLETED SUCCESSFULLY');
    console.log('='.repeat(70));
    console.log('\n📋 Summary:');
    console.log('   ✅ Backend server is running');
    console.log('   ✅ Health endpoint is accessible');
    console.log('   ✅ Feedback endpoint is working');
    console.log('   ℹ️  Check email configuration above for welcome emails');
    console.log('\n💡 Next Steps:');
    console.log('   1. Test from frontend: Click feedback button');
    console.log('   2. Test welcome email: Register a new user');
    console.log('   3. Check your email inbox at rakeshd01042024@gmail.com');
  } catch (error) {
    console.log('\n' + '='.repeat(70));
    console.log('❌ TESTS FAILED');
    console.log('='.repeat(70));
    console.log('Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('   1. Make sure backend server is running: npm run dev');
    console.log('   2. Check if MongoDB is running');
    console.log('   3. Verify port 3002 is not blocked by firewall');
    process.exit(1);
  }
}

runTests();
