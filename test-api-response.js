async function testAPI() {
  try {
    const response = await fetch('http://localhost:3002/api/funds?limit=3');
    const data = await response.json();

    console.log('API Response Structure:\n');
    console.log('Total funds returned:', data.data.length);
    console.log('\nFirst fund sample:');
    const fund = data.data[0];
    console.log('  Name:', fund.name);
    console.log(
      '  Current NAV:',
      fund.currentNav,
      '(type:',
      typeof fund.currentNav,
      ')'
    );
    console.log(
      '  Expense Ratio:',
      fund.expenseRatio,
      '(type:',
      typeof fund.expenseRatio,
      ')'
    );
    console.log('  AUM:', fund.aum, '(type:', typeof fund.aum, ')');
    console.log('  Category:', fund.category);
    console.log('  SubCategory:', fund.subCategory);
    console.log('  Returns:', fund.returns);
    console.log('  Ratings:', fund.ratings);

    console.log('\nChecking for undefined/null values:');
    data.data.slice(0, 5).forEach((f, idx) => {
      const issues = [];
      if (
        f.currentNav === undefined ||
        f.currentNav === null ||
        isNaN(f.currentNav)
      )
        issues.push('NAV');
      if (
        f.expenseRatio === undefined ||
        f.expenseRatio === null ||
        isNaN(f.expenseRatio)
      )
        issues.push('expenseRatio');
      if (f.aum === undefined || f.aum === null || isNaN(f.aum))
        issues.push('aum');
      if (
        f.returns?.oneYear === undefined ||
        f.returns?.oneYear === null ||
        isNaN(f.returns?.oneYear)
      )
        issues.push('returns.oneYear');

      if (issues.length > 0) {
        console.log(
          `  Fund ${idx + 1} (${f.name.substring(
            0,
            40
          )}...): Issues with ${issues.join(', ')}`
        );
      }
    });
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testAPI();
