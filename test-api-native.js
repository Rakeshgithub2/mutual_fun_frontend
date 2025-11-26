// Test frontend API connection using Node.js built-in modules
const http = require('http');

const testApiConnection = async () => {
  try {
    console.log('🔍 Testing API connection...');

    // Test funds API endpoint using native Node.js
    const options = {
      hostname: 'localhost',
      port: 3003,
      path: '/api/funds',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    return new Promise((resolve, reject) => {
      const req = http.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const fundsData = JSON.parse(data);

            if (fundsData && fundsData.data) {
              console.log('✅ Funds API working!');
              console.log(`📊 Total funds returned: ${fundsData.data.length}`);
              console.log(
                `📄 Pagination: Page ${fundsData.pagination?.page || 1} of ${
                  fundsData.pagination?.totalPages || 1
                }`
              );
              console.log(
                `🔢 Total available: ${
                  fundsData.pagination?.total || 'Unknown'
                }`
              );

              // Show sample fund
              if (fundsData.data.length > 0) {
                const sampleFund = fundsData.data[0];
                console.log('📋 Sample fund:');
                console.log(`  Name: ${sampleFund.name}`);
                console.log(`  Category: ${sampleFund.category}`);
                console.log(
                  `  SubCategory: ${sampleFund.subCategory || 'N/A'}`
                );
                console.log(`  NAV: ₹${sampleFund.currentNav}`);
              }

              // Check for equity subcategories
              const equity = fundsData.data.filter(
                (f) => f.category === 'Equity'
              );
              const largeCap = equity.filter(
                (f) => f.subCategory === 'Large Cap'
              );
              const midCap = equity.filter((f) => f.subCategory === 'Mid Cap');
              const smallCap = equity.filter(
                (f) => f.subCategory === 'Small Cap'
              );
              const multiCap = equity.filter(
                (f) => f.subCategory === 'Multi Cap'
              );

              console.log('\n📊 Equity Fund Distribution:');
              console.log(`  Large Cap: ${largeCap.length} funds`);
              console.log(`  Mid Cap: ${midCap.length} funds`);
              console.log(`  Small Cap: ${smallCap.length} funds`);
              console.log(`  Multi Cap: ${multiCap.length} funds`);

              // Check for commodity subcategories
              const commodity = fundsData.data.filter(
                (f) => f.category === 'Commodity'
              );
              const gold = commodity.filter((f) => f.subCategory === 'Gold');
              const silver = commodity.filter(
                (f) => f.subCategory === 'Silver'
              );

              console.log('\n🥇 Commodity Fund Distribution:');
              console.log(`  Gold: ${gold.length} funds`);
              console.log(`  Silver: ${silver.length} funds`);
              console.log(`  Total Commodity: ${commodity.length} funds`);
            } else {
              console.log('❌ Invalid API response structure');
            }

            resolve();
          } catch (parseError) {
            console.error(
              '❌ Failed to parse API response:',
              parseError.message
            );
            reject(parseError);
          }
        });
      });

      req.on('error', (error) => {
        console.error('❌ API connection failed:', error.message);
        reject(error);
      });

      req.end();
    });
  } catch (error) {
    console.error('❌ API test failed:', error.message);
  }
};

testApiConnection();
