/**
 * Test Feedback Email System
 *
 * This script tests the complete feedback email notification flow
 * Run: node test-feedback-email.js
 */

const BASE_URL = 'http://localhost:3002/api';

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Test cases
const testCases = [
  {
    name: '🐛 Bug Report with Email',
    data: {
      feedbackType: 'bug',
      rating: 3,
      name: 'John Doe',
      email: 'john.doe@example.com',
      message:
        'I found a bug where the search results are not showing correctly when I filter by category. The page freezes and needs a refresh.',
      userId: 'user_test_123',
    },
  },
  {
    name: '✨ Feature Request with High Rating',
    data: {
      feedbackType: 'feature',
      rating: 5,
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      message:
        'Please add a dark mode toggle! Also, it would be great to have portfolio comparison charts.',
      userId: 'user_test_456',
    },
  },
  {
    name: '💬 General Feedback - Anonymous',
    data: {
      feedbackType: 'general',
      rating: 4,
      name: 'Anonymous User',
      email: null,
      message:
        'Great platform overall! The UI is very intuitive and easy to navigate. Keep up the good work!',
      userId: null,
    },
  },
  {
    name: '🐛 Critical Bug Report',
    data: {
      feedbackType: 'bug',
      rating: 1,
      name: 'Urgent User',
      email: 'urgent@example.com',
      message:
        'CRITICAL: Cannot complete investment transactions. The payment gateway throws an error every time I try to invest.',
      userId: 'user_test_789',
    },
  },
  {
    name: '✨ Feature with No Rating',
    data: {
      feedbackType: 'feature',
      rating: 0,
      name: 'Feature Enthusiast',
      email: 'features@example.com',
      message:
        'Would love to see: 1) Mobile app, 2) Real-time price alerts, 3) Tax calculator, 4) SIP reminder notifications',
      userId: 'user_test_101',
    },
  },
];

/**
 * Send feedback and test email notification
 */
async function testFeedback(testCase) {
  try {
    const response = await fetch(`${BASE_URL}/feedback`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testCase.data),
    });

    const result = await response.json();

    if (response.ok && result.success) {
      console.log(
        `   ${colors.green}✓ Feedback submitted successfully${colors.reset}`
      );
      console.log(
        `   ${colors.cyan}Feedback ID: ${result.data.id}${colors.reset}`
      );
      return { success: true, data: result.data };
    } else {
      console.log(`   ${colors.red}✗ Failed: ${result.message}${colors.reset}`);
      return { success: false, error: result.message };
    }
  } catch (error) {
    console.log(`   ${colors.red}✗ Error: ${error.message}${colors.reset}`);
    return { success: false, error: error.message };
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('\n' + colors.bright + '━'.repeat(60) + colors.reset);
  console.log(
    colors.bright + '📧 FEEDBACK EMAIL NOTIFICATION TEST' + colors.reset
  );
  console.log(colors.bright + '━'.repeat(60) + colors.reset + '\n');

  console.log(`${colors.yellow}📍 Backend URL:${colors.reset} ${BASE_URL}`);
  console.log(
    `${colors.yellow}📧 Admin Email:${colors.reset} rakeshd01042024@gmail.com`
  );
  console.log(
    `${colors.yellow}📝 Test Cases:${colors.reset} ${testCases.length}\n`
  );

  console.log(colors.bright + '━'.repeat(60) + colors.reset + '\n');

  let passed = 0;
  let failed = 0;

  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(
      `${colors.bright}Test ${i + 1}/${testCases.length}:${colors.reset} ${
        testCase.name
      }`
    );
    console.log(`   Type: ${testCase.data.feedbackType}`);
    console.log(
      `   Rating: ${'⭐'.repeat(testCase.data.rating) || 'No rating'}`
    );
    console.log(`   Name: ${testCase.data.name}`);
    console.log(`   Email: ${testCase.data.email || 'Not provided'}`);

    const result = await testFeedback(testCase);

    if (result.success) {
      passed++;
    } else {
      failed++;
    }

    // Wait 1 second between tests
    if (i < testCases.length - 1) {
      console.log('');
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  console.log('\n' + colors.bright + '━'.repeat(60) + colors.reset);
  console.log(colors.bright + '📊 TEST RESULTS' + colors.reset);
  console.log(colors.bright + '━'.repeat(60) + colors.reset + '\n');

  console.log(`${colors.green}✓ Passed:${colors.reset} ${passed}`);
  console.log(`${colors.red}✗ Failed:${colors.reset} ${failed}`);
  console.log(`${colors.cyan}📧 Total Emails Sent:${colors.reset} ${passed}\n`);

  if (passed > 0) {
    console.log(colors.bright + '━'.repeat(60) + colors.reset);
    console.log(colors.green + '✅ NEXT STEPS:' + colors.reset);
    console.log(colors.bright + '━'.repeat(60) + colors.reset + '\n');

    console.log('1. Check your backend logs for email sending confirmations:');
    console.log(
      `   ${colors.cyan}✅ Feedback email notification sent successfully${colors.reset}\n`
    );

    console.log('2. Check the email inbox:');
    console.log(
      `   ${colors.yellow}📧 rakeshd01042024@gmail.com${colors.reset}\n`
    );

    console.log('3. Look for emails with subjects like:');
    console.log(
      `   ${colors.magenta}🐛 New Feedback: Bug Report - ⭐⭐⭐${colors.reset}`
    );
    console.log(
      `   ${colors.magenta}✨ New Feedback: Feature Request - ⭐⭐⭐⭐⭐${colors.reset}`
    );
    console.log(
      `   ${colors.magenta}💬 New Feedback: General Feedback - ⭐⭐⭐⭐${colors.reset}\n`
    );

    console.log('4. Verify email contents include:');
    console.log(`   ${colors.green}✓${colors.reset} User name and email`);
    console.log(`   ${colors.green}✓${colors.reset} Feedback type and rating`);
    console.log(`   ${colors.green}✓${colors.reset} Full message text`);
    console.log(`   ${colors.green}✓${colors.reset} Timestamp in IST`);
    console.log(
      `   ${colors.green}✓${colors.reset} Reply-to functionality${colors.reset}\n`
    );

    console.log(colors.bright + '━'.repeat(60) + colors.reset);
    console.log(
      colors.green + '🎉 EMAIL NOTIFICATION SYSTEM TESTED!' + colors.reset
    );
    console.log(colors.bright + '━'.repeat(60) + colors.reset + '\n');
  } else {
    console.log(colors.bright + '━'.repeat(60) + colors.reset);
    console.log(colors.red + '❌ ALL TESTS FAILED' + colors.reset);
    console.log(colors.bright + '━'.repeat(60) + colors.reset + '\n');

    console.log(colors.yellow + '🔧 Troubleshooting:' + colors.reset + '\n');
    console.log('1. Make sure backend is running:');
    console.log(
      `   ${colors.cyan}npm run dev${colors.reset} or ${colors.cyan}node src/server.js${colors.reset}\n`
    );

    console.log('2. Verify MongoDB is connected\n');

    console.log('3. Check RESEND_API_KEY in .env file\n');

    console.log('4. Review backend logs for errors\n');
  }
}

// Check if backend is reachable
async function checkBackend() {
  try {
    const response = await fetch(`${BASE_URL}/health`, {
      method: 'GET',
    });

    if (response.ok) {
      console.log(
        `${colors.green}✓ Backend is reachable${colors.reset} at ${BASE_URL}\n`
      );
      return true;
    }
  } catch (error) {
    // Backend might not have /health endpoint, that's okay
    return true;
  }
  return true;
}

// Main execution
(async () => {
  console.log(
    '\n' +
      colors.bright +
      '🚀 Starting Feedback Email Tests...' +
      colors.reset +
      '\n'
  );

  await checkBackend();
  await runTests();
})();
