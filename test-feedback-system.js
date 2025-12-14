/**
 * Feedback System Test Script
 *
 * This script tests the feedback API endpoint with different scenarios
 * Run: node test-feedback-system.js
 */

const BASE_URL = process.env.API_URL || 'http://localhost:3002/api';
const FEEDBACK_URL = `${BASE_URL}/feedback`;

// Test data
const testCases = [
  {
    name: 'Valid Bug Report (Logged-in User)',
    data: {
      feedbackType: 'bug',
      rating: 4,
      name: 'Test User',
      email: 'testuser@example.com',
      message:
        'Found a bug in the search functionality. When I search for funds, the results are not loading properly.',
      userId: 'test-user-123',
    },
    expected: 201,
  },
  {
    name: 'Valid Feature Request (Anonymous User)',
    data: {
      feedbackType: 'feature',
      rating: 5,
      name: 'Anonymous User',
      email: null,
      message: 'Would love to see a comparison feature for mutual funds!',
      userId: null,
    },
    expected: 201,
  },
  {
    name: 'Valid General Feedback',
    data: {
      feedbackType: 'general',
      rating: 3,
      name: 'John Doe',
      email: 'john@example.com',
      message: 'Great platform! Just some minor UI improvements needed.',
      userId: null,
    },
    expected: 201,
  },
  {
    name: 'Missing Name (Should Fail)',
    data: {
      feedbackType: 'general',
      rating: 3,
      name: '',
      email: 'test@example.com',
      message: 'This should fail',
      userId: null,
    },
    expected: 400,
  },
  {
    name: 'Invalid Email Format (Should Fail)',
    data: {
      feedbackType: 'general',
      rating: 3,
      name: 'Test User',
      email: 'invalid-email',
      message: 'This should fail',
      userId: null,
    },
    expected: 400,
  },
  {
    name: 'Missing Message (Should Fail)',
    data: {
      feedbackType: 'general',
      rating: 3,
      name: 'Test User',
      email: 'test@example.com',
      message: '',
      userId: null,
    },
    expected: 400,
  },
  {
    name: 'Rating Out of Range (Should Fail)',
    data: {
      feedbackType: 'general',
      rating: 10,
      name: 'Test User',
      email: 'test@example.com',
      message: 'This should fail',
      userId: null,
    },
    expected: 400,
  },
  {
    name: 'Zero Stars (Valid)',
    data: {
      feedbackType: 'general',
      rating: 0,
      name: 'Test User',
      email: 'test@example.com',
      message: 'Testing zero star rating',
      userId: null,
    },
    expected: 201,
  },
];

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
  gray: '\x1b[90m',
};

async function testFeedbackAPI() {
  console.log(`\n${colors.blue}========================================`);
  console.log('🧪 Feedback System API Tests');
  console.log(`========================================${colors.reset}\n`);
  console.log(
    `📍 Testing endpoint: ${colors.yellow}${FEEDBACK_URL}${colors.reset}\n`
  );

  let passed = 0;
  let failed = 0;

  for (const testCase of testCases) {
    try {
      console.log(`${colors.gray}Testing: ${testCase.name}${colors.reset}`);

      const response = await fetch(FEEDBACK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.data),
      });

      const data = await response.json();
      const statusMatch = response.status === testCase.expected;

      if (statusMatch) {
        console.log(
          `${colors.green}✅ PASSED${colors.reset} - Status: ${response.status}`
        );
        if (data.feedbackId) {
          console.log(`   Feedback ID: ${data.feedbackId}`);
        }
        passed++;
      } else {
        console.log(
          `${colors.red}❌ FAILED${colors.reset} - Expected: ${testCase.expected}, Got: ${response.status}`
        );
        console.log(`   Response: ${JSON.stringify(data)}`);
        failed++;
      }
    } catch (error) {
      console.log(`${colors.red}❌ ERROR${colors.reset} - ${error.message}`);
      failed++;
    }

    console.log(''); // Empty line for spacing
  }

  console.log(`${colors.blue}========================================`);
  console.log('📊 Test Summary');
  console.log(`========================================${colors.reset}`);
  console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
  console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
  console.log(`📝 Total:  ${testCases.length}\n`);

  if (failed === 0) {
    console.log(`${colors.green}🎉 All tests passed!${colors.reset}\n`);
  } else {
    console.log(
      `${colors.red}⚠️  Some tests failed. Please check the implementation.${colors.reset}\n`
    );
  }
}

// Test rate limiting
async function testRateLimiting() {
  console.log(`\n${colors.blue}========================================`);
  console.log('🔒 Testing Rate Limiting (5 per hour)');
  console.log(`========================================${colors.reset}\n`);

  const testData = {
    feedbackType: 'general',
    rating: 3,
    name: 'Rate Limit Test',
    email: 'ratelimit@example.com',
    message: 'Testing rate limiting',
    userId: null,
  };

  for (let i = 1; i <= 6; i++) {
    try {
      const response = await fetch(FEEDBACK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const data = await response.json();

      if (i <= 5) {
        if (response.status === 201) {
          console.log(
            `${colors.green}✅ Submission ${i}/6: Success${colors.reset}`
          );
        } else {
          console.log(
            `${colors.red}❌ Submission ${i}/6: Unexpected status ${response.status}${colors.reset}`
          );
        }
      } else {
        // 6th submission should be rate limited
        if (response.status === 429) {
          console.log(
            `${colors.green}✅ Submission ${i}/6: Rate limit working! (429)${colors.reset}`
          );
        } else {
          console.log(
            `${colors.red}❌ Submission ${i}/6: Expected 429, got ${response.status}${colors.reset}`
          );
        }
      }

      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 200));
    } catch (error) {
      console.log(
        `${colors.red}❌ Submission ${i}/6: Error - ${error.message}${colors.reset}`
      );
    }
  }

  console.log('');
}

// Run all tests
async function runAllTests() {
  console.log(
    `${colors.yellow}Starting Feedback System Tests...${colors.reset}`
  );
  console.log(
    `${colors.gray}Make sure the backend is running on http://localhost:3002${colors.reset}\n`
  );

  try {
    await testFeedbackAPI();

    // Uncomment to test rate limiting (will submit 6 feedbacks)
    // console.log(`${colors.yellow}⚠️  Rate limit test will submit 6 feedbacks. Continue? (Ctrl+C to cancel)${colors.reset}`);
    // await new Promise(resolve => setTimeout(resolve, 2000));
    // await testRateLimiting();
  } catch (error) {
    console.error(`${colors.red}Fatal error: ${error.message}${colors.reset}`);
  }
}

runAllTests();
