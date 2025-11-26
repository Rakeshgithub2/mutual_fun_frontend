// Test frontend API integration after fix
console.log('🔍 Testing Frontend API Integration - POST FIX');
console.log('=' * 50);

// Test the exact URLs that the frontend uses
const tests = [
  {
    name: 'All Equity Funds',
    url: 'http://localhost:3002/api/funds?category=equity&limit=100',
  },
  {
    name: 'Large Cap Funds',
    url: 'http://localhost:3002/api/funds?category=equity&subCategory=Large%20Cap&limit=100',
  },
  {
    name: 'Mid Cap Funds',
    url: 'http://localhost:3002/api/funds?category=equity&subCategory=Mid%20Cap&limit=100',
  },
  {
    name: 'Small Cap Funds',
    url: 'http://localhost:3002/api/funds?category=equity&subCategory=Small%20Cap&limit=100',
  },
  {
    name: 'Multi Cap Funds',
    url: 'http://localhost:3002/api/funds?category=equity&subCategory=Multi%20Cap&limit=100',
  },
  {
    name: 'All Commodity Funds',
    url: 'http://localhost:3002/api/funds?category=commodity&limit=100',
  },
  {
    name: 'Gold Funds',
    url: 'http://localhost:3002/api/funds?category=commodity&subCategory=Gold&limit=100',
  },
  {
    name: 'Silver Funds',
    url: 'http://localhost:3002/api/funds?category=commodity&subCategory=Silver&limit=100',
  },
];

async function testAllEndpoints() {
  let totalFunds = 0;

  console.log('\n🧪 Testing all fund endpoints...\n');

  for (let i = 0; i < tests.length; i++) {
    const test = tests[i];
    console.log(`${i + 1}. Testing ${test.name}:`);

    try {
      const response = await fetch(test.url);

      if (!response.ok) {
        console.log(`   ❌ FAILED - HTTP ${response.status}`);
        continue;
      }

      const data = await response.json();
      const count = data.data?.length || 0;
      totalFunds += count;

      console.log(`   ✅ SUCCESS - Found ${count} funds`);

      if (count > 0) {
        console.log(`   📄 Sample: ${data.data[0]?.name}`);
      }
    } catch (error) {
      console.log(`   ❌ ERROR - ${error.message}`);
    }

    console.log('');
  }

  console.log('=' * 50);
  console.log(`🎯 TOTAL FUNDS AVAILABLE: ${totalFunds}`);

  if (totalFunds > 0) {
    console.log('✅ Frontend should now display fund counts correctly!');
    console.log('🌐 Open http://localhost:5001 to see the updated counts');
  } else {
    console.log('❌ No funds found - there may still be an issue');
  }
}

// Run the test using Node.js HTTP module since we don't have fetch
const https = require('http');
const { URL } = require('url');

async function fetchData(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: 'GET',
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          json: () => Promise.resolve(JSON.parse(data)),
        });
      });
    });

    req.on('error', reject);
    req.setTimeout(5000, () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });
    req.end();
  });
}

// Override fetch with our implementation
global.fetch = fetchData;

testAllEndpoints().catch(console.error);
