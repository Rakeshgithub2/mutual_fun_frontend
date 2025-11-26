// Quick test of AI responses without running server

const testQueries = [
  'explain sharpe ratio',
  'what is alpha and beta',
  'tell me about NAV',
  'what is expese ratio', // spelling mistake test
  'larg cap vs mid cap', // spelling mistake test
  'how to diversify portfolio',
  'SIP or lumpsum which is better',
  'what is ELSS',
  'index fund advantages',
];

console.log('🧪 Testing AI Response System\n');
console.log('='.repeat(60));

for (const query of testQueries) {
  console.log(`\n📝 Query: "${query}"`);
  console.log('-'.repeat(60));

  // Simulate what the backend does
  const lowerQuery = query.toLowerCase();

  let matched = false;

  // Check Sharpe
  if (lowerQuery.includes('sharpe')) {
    console.log('✅ MATCH: Sharpe Ratio');
    matched = true;
  }
  // Check Alpha/Beta
  else if (lowerQuery.includes('alpha') || lowerQuery.includes('beta')) {
    console.log('✅ MATCH: Alpha & Beta');
    matched = true;
  }
  // Check NAV
  else if (lowerQuery.includes('nav')) {
    console.log('✅ MATCH: NAV');
    matched = true;
  }
  // Check expense (with exclusion)
  else if (
    lowerQuery.includes('expense') ||
    (lowerQuery.includes('ratio') && !lowerQuery.includes('sharpe'))
  ) {
    console.log('✅ MATCH: Expense Ratio');
    matched = true;
  }
  // Check caps
  else if (lowerQuery.includes('cap')) {
    console.log('✅ MATCH: Cap Funds');
    matched = true;
  }
  // Check portfolio/diversify
  else if (
    lowerQuery.includes('portfolio') ||
    lowerQuery.includes('diversif')
  ) {
    console.log('✅ MATCH: Portfolio Diversification');
    matched = true;
  }
  // Check SIP/lumpsum
  else if (lowerQuery.includes('sip') || lowerQuery.includes('lumpsum')) {
    console.log('✅ MATCH: SIP/Lumpsum');
    matched = true;
  }
  // Check ELSS
  else if (lowerQuery.includes('elss')) {
    console.log('✅ MATCH: ELSS');
    matched = true;
  }
  // Check index
  else if (lowerQuery.includes('index')) {
    console.log('✅ MATCH: Index Funds');
    matched = true;
  }

  if (!matched) {
    console.log('⚠️  NO MATCH - Default response');
  }
}

console.log('\n' + '='.repeat(60));
console.log('✅ Test Complete!\n');
