// Final comprehensive integration test
console.log('🚀 COMPREHENSIVE SYSTEM TEST - Mutual Funds Application');
console.log('=' * 60);

const tests = [
  {
    name: 'Backend Health Check',
    test: async () => {
      const response = await fetch('http://localhost:3002/api/funds?limit=1');
      const data = await response.json();
      return {
        success: response.ok,
        status: response.status,
        message: data.message || 'Unknown',
        dataCount: data.data?.length || 0,
      };
    },
  },
  {
    name: 'Funds API - Equity Category',
    test: async () => {
      const response = await fetch(
        'http://localhost:3002/api/funds?category=equity&limit=3'
      );
      const data = await response.json();
      return {
        success: response.ok && data.data?.length > 0,
        status: response.status,
        count: data.data?.length || 0,
        firstFund: data.data?.[0]?.name || 'N/A',
      };
    },
  },
  {
    name: 'Funds API - Commodity Category',
    test: async () => {
      const response = await fetch(
        'http://localhost:3002/api/funds?category=commodity&limit=3'
      );
      const data = await response.json();
      return {
        success: response.ok && data.data?.length > 0,
        status: response.status,
        count: data.data?.length || 0,
        firstFund: data.data?.[0]?.name || 'N/A',
      };
    },
  },
  {
    name: 'Search/Autocomplete API',
    test: async () => {
      const response = await fetch(
        'http://localhost:3002/api/suggest?q=hdfc&limit=5'
      );
      const data = await response.json();
      return {
        success: response.ok && data.data?.suggestions?.length > 0,
        status: response.status,
        count: data.data?.suggestions?.length || 0,
        query: data.data?.query || 'N/A',
      };
    },
  },
  {
    name: 'Database Connection Test',
    test: async () => {
      const response = await fetch('http://localhost:3002/api/funds?limit=1');
      const data = await response.json();
      return {
        success: response.ok && data.data?.length > 0,
        hasData: data.data?.length > 0,
        fundId: data.data?.[0]?.fundId || 'N/A',
        fundName: data.data?.[0]?.name || 'N/A',
      };
    },
  },
];

async function runTests() {
  let passedTests = 0;
  let totalTests = tests.length;

  console.log(`\n📋 Running ${totalTests} integration tests...\n`);

  for (let i = 0; i < tests.length; i++) {
    const testCase = tests[i];
    console.log(`${i + 1}. ${testCase.name}:`);

    try {
      const result = await testCase.test();

      if (result.success) {
        console.log('   ✅ PASSED');
        console.log(`   📊 Details:`, JSON.stringify(result, null, 6));
        passedTests++;
      } else {
        console.log('   ❌ FAILED');
        console.log(`   📊 Details:`, JSON.stringify(result, null, 6));
      }
    } catch (error) {
      console.log('   ❌ ERROR');
      console.log(`   🚨 Error: ${error.message}`);
    }

    console.log('');
  }

  console.log('=' * 60);
  console.log('📈 TEST SUMMARY:');
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  console.log(
    `📊 Success Rate: ${Math.round((passedTests / totalTests) * 100)}%`
  );

  if (passedTests === totalTests) {
    console.log('\n🎉 ALL SYSTEMS OPERATIONAL!');
    console.log('✅ Backend API is working correctly');
    console.log('✅ Database connection is stable');
    console.log('✅ All endpoints are responding');
    console.log('✅ Data is flowing properly');
    console.log('\n🌐 Your application is ready for use!');
    console.log('🔗 Frontend: http://localhost:5001');
    console.log('🔗 Backend API: http://localhost:3002/api/funds');
  } else {
    console.log('\n⚠️  ISSUES DETECTED - Please check the failed tests above');
  }
}

// Run the tests
runTests().catch((error) => {
  console.error('🚨 Test runner failed:', error);
});
