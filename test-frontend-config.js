// Test to verify the API client configuration
console.log('🔍 Testing API client configuration...');

// Simulate the API client behavior
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002/api';

console.log('✅ Environment variables:');
console.log(
  `NEXT_PUBLIC_API_URL: ${process.env.NEXT_PUBLIC_API_URL || 'NOT SET'}`
);
console.log(`API_BASE_URL (resolved): ${API_BASE_URL}`);

// Test URL construction
const testEndpoint = '/api/funds?limit=5';
const fullUrl = `${API_BASE_URL}${testEndpoint}`;
console.log(`Full API URL would be: ${fullUrl}`);

if (API_BASE_URL.includes('3002')) {
  console.log('✅ API client will use correct port 3002');
} else {
  console.log('❌ API client will use wrong port');
}
