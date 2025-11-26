const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3002,
  path: '/api/funds?limit=100',
  method: 'GET',
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const parsed = JSON.parse(data);
      const funds = parsed.data || [];

      console.log(`Total funds loaded: ${funds.length}`);

      const categories = [...new Set(funds.map((f) => f.category))].sort();
      console.log(`\nAvailable categories (${categories.length}):`);
      categories.forEach((cat) => console.log(`  - ${cat}`));

      const commodityFunds = funds.filter(
        (f) =>
          f.category?.toLowerCase().includes('commodity') ||
          f.category?.toLowerCase().includes('gold') ||
          f.category?.toLowerCase().includes('silver') ||
          f.name?.toLowerCase().includes('gold') ||
          f.name?.toLowerCase().includes('silver')
      );

      console.log(`\nCommodity/Gold funds: ${commodityFunds.length}`);
      if (commodityFunds.length > 0) {
        console.log('Examples:');
        commodityFunds.slice(0, 5).forEach((f) => {
          console.log(`  - ${f.name} (${f.category})`);
        });
      }
    } catch (e) {
      console.error('Parse error:', e.message);
    }
  });
});

req.on('error', (e) => {
  console.error(`Error: ${e.message}`);
});

req.end();
