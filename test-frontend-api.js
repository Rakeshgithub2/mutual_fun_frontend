// Test frontend API connection
const fetch = require('node-fetch');

const testApiConnection = async () => {
  try {
    console.log('🔍 Testing API connection...');

    // Test health endpoint
    const healthUrl = 'http://localhost:3002/health';
    console.log(`Testing health endpoint: ${healthUrl}`);

    const healthResponse = await fetch(healthUrl);
    const healthData = await healthResponse.text();
    console.log('✅ Health endpoint response:', healthData);

    // Test funds API endpoint
    const fundsUrl = 'http://localhost:3002/api/funds';
    console.log(`Testing funds endpoint: ${fundsUrl}`);

    const fundsResponse = await fetch(fundsUrl);
    const fundsData = await fundsResponse.json();

    if (fundsData && fundsData.data) {
      console.log('✅ Funds API working!');
      console.log(`📊 Total funds returned: ${fundsData.data.length}`);
      console.log(
        `📄 Pagination: Page ${fundsData.pagination?.page || 1} of ${
          fundsData.pagination?.totalPages || 1
        }`
      );
      console.log(
        `🔢 Total available: ${fundsData.pagination?.total || 'Unknown'}`
      );

      // Show sample fund
      if (fundsData.data.length > 0) {
        const sampleFund = fundsData.data[0];
        console.log('📋 Sample fund:');
        console.log(`  Name: ${sampleFund.name}`);
        console.log(`  Category: ${sampleFund.category}`);
        console.log(`  SubCategory: ${sampleFund.subCategory || 'N/A'}`);
        console.log(`  NAV: ₹${sampleFund.currentNav}`);
      }
    } else {
      console.log('❌ Invalid API response structure');
    }
  } catch (error) {
    console.error('❌ API connection failed:', error.message);
  }
};

testApiConnection();
