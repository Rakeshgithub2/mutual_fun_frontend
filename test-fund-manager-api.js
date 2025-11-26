// Quick test to check fund manager API response
const API_URL = 'http://localhost:3002/api';

async function testFundManagerAPI() {
  try {
    console.log('🔍 Fetching fund managers...');

    // Get all fund managers
    const response = await fetch(`${API_URL}/fund-managers?limit=5`);
    const data = await response.json();

    console.log('\n📊 Total managers:', data.data?.length || 0);

    if (data.data && data.data.length > 0) {
      const firstManager = data.data[0];
      console.log('\n👤 First Manager:');
      console.log('  Name:', firstManager.name);
      console.log('  ID:', firstManager.id);
      console.log('  Manager ID:', firstManager.managerId);
      console.log('  Funds Managed:', firstManager.fundsManaged);
      console.log('  Funds List Length:', firstManager.fundsList?.length || 0);

      if (firstManager.fundsList && firstManager.fundsList.length > 0) {
        console.log('\n💼 Fund Details:');
        firstManager.fundsList.forEach((fund, idx) => {
          console.log(`  ${idx + 1}. ${fund.fundName}`);
          console.log(`     AUM: ₹${(fund.aum / 1000).toFixed(1)}K Cr`);
          console.log(
            `     Returns: 1Y=${fund.returns?.oneYear}%, 3Y=${fund.returns?.threeYear}%, 5Y=${fund.returns?.fiveYear}%`
          );
        });
      } else {
        console.log('\n⚠️  No funds list found for this manager');
      }

      // Now fetch this manager by ID
      console.log('\n\n🔍 Fetching manager by ID:', firstManager.id);
      const detailResponse = await fetch(
        `${API_URL}/fund-managers/${firstManager.id}`
      );
      const detailData = await detailResponse.json();

      console.log('\n📄 Manager Detail Response:');
      console.log('  Name:', detailData.data?.name);
      console.log('  Funds Managed:', detailData.data?.fundsManaged);
      console.log(
        '  Funds List Length:',
        detailData.data?.fundsList?.length || 0
      );

      if (detailData.data?.fundsList && detailData.data.fundsList.length > 0) {
        console.log('\n✅ Fund details ARE being returned!');
        console.log(
          'Sample fund:',
          JSON.stringify(detailData.data.fundsList[0], null, 2)
        );
      } else {
        console.log('\n❌ Fund details are NOT being returned!');
        console.log('Full response:', JSON.stringify(detailData.data, null, 2));
      }
    } else {
      console.log('\n❌ No managers found in database');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testFundManagerAPI();
