/**
 * API Connection Test Script
 * Tests all major endpoints to ensure frontend can connect to backend
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

console.log('🧪 Testing API Connection...');
console.log('📍 API Base URL:', API_BASE);
console.log('');

async function testConnection() {
  let passedTests = 0;
  let failedTests = 0;

  try {
    // Test 1: Health Check
    console.log('1️⃣  Testing Health Check...');
    try {
      const health = await fetch(`${API_BASE}/health`);
      const healthData = await health.json();
      console.log(`   ✅ Status: ${health.status}`);
      console.log(`   📊 Data:`, healthData);
      passedTests++;
    } catch (error) {
      console.error(`   ❌ Failed:`, error.message);
      failedTests++;
    }
    console.log('');

    // Test 2: Funds List
    console.log('2️⃣  Testing Funds List (GET /api/funds)...');
    try {
      const funds = await fetch(`${API_BASE}/api/funds?limit=2`);
      const fundsData = await funds.json();
      console.log(`   ✅ Status: ${funds.status}`);
      console.log(`   📊 Found: ${fundsData.data?.length || 0} funds`);
      if (fundsData.data?.length > 0) {
        console.log(`   📝 Sample fund: ${fundsData.data[0].name}`);
      }
      passedTests++;
    } catch (error) {
      console.error(`   ❌ Failed:`, error.message);
      failedTests++;
    }
    console.log('');

    // Test 3: Market Indices
    console.log('3️⃣  Testing Market Indices (GET /api/market-indices)...');
    try {
      const indices = await fetch(`${API_BASE}/api/market-indices`);
      const indicesData = await indices.json();
      console.log(`   ✅ Status: ${indices.status}`);
      console.log(`   📊 Success:`, indicesData.success);
      passedTests++;
    } catch (error) {
      console.error(`   ❌ Failed:`, error.message);
      failedTests++;
    }
    console.log('');

    // Test 4: Search/Suggestions
    console.log('4️⃣  Testing Search/Suggestions (GET /api/suggest)...');
    try {
      const suggest = await fetch(`${API_BASE}/api/suggest?q=hdfc`);
      const suggestData = await suggest.json();
      console.log(`   ✅ Status: ${suggest.status}`);
      console.log(`   📊 Suggestions:`, suggestData.data?.count || 0);
      passedTests++;
    } catch (error) {
      console.error(`   ❌ Failed:`, error.message);
      failedTests++;
    }
    console.log('');

    // Test 5: Fund Details (if we have a fundId)
    console.log('5️⃣  Testing Fund Details (GET /api/funds/:id)...');
    try {
      // First get a fund ID
      const fundsResponse = await fetch(`${API_BASE}/api/funds?limit=1`);
      const fundsData = await fundsResponse.json();

      if (fundsData.data?.length > 0) {
        const fundId = fundsData.data[0].id || fundsData.data[0].fundId;
        const fundDetail = await fetch(`${API_BASE}/api/funds/${fundId}`);
        const fundDetailData = await fundDetail.json();
        console.log(`   ✅ Status: ${fundDetail.status}`);
        console.log(`   📊 Fund: ${fundDetailData.data?.name || 'N/A'}`);
        passedTests++;
      } else {
        console.log(`   ⚠️  Skipped: No funds available`);
      }
    } catch (error) {
      console.error(`   ❌ Failed:`, error.message);
      failedTests++;
    }
    console.log('');

    // Summary
    console.log('═'.repeat(50));
    console.log('📊 Test Summary');
    console.log('═'.repeat(50));
    console.log(`✅ Passed: ${passedTests}`);
    console.log(`❌ Failed: ${failedTests}`);
    console.log(
      `📈 Success Rate: ${(
        (passedTests / (passedTests + failedTests)) *
        100
      ).toFixed(1)}%`
    );
    console.log('');

    if (failedTests === 0) {
      console.log('🎉 All tests passed! API is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Please check:');
      console.log('   1. Backend server is running on port 3002');
      console.log('   2. Environment variables are set correctly');
      console.log('   3. CORS is configured properly');
    }
  } catch (error) {
    console.error('\n❌ Fatal Error:', error.message);
    console.log('\n🔍 Troubleshooting:');
    console.log(
      '   • Make sure backend is running: npm run dev (in backend folder)'
    );
    console.log(
      '   • Check .env.local has: NEXT_PUBLIC_API_URL=http://localhost:3002'
    );
    console.log('   • Verify no firewall is blocking port 3002');
  }
}

// Run the tests
testConnection();
