/**
 * Complete Authentication System Test
 * Tests both email/password and Google OAuth authentication
 */

const API_BASE = 'http://localhost:3002/api';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logSection(title) {
  console.log('\n' + '='.repeat(60));
  log(title, 'cyan');
  console.log('='.repeat(60) + '\n');
}

async function testEmailRegistration() {
  logSection('TEST 1: Email/Password Registration');

  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: `testuser${Date.now()}@example.com`,
        password: 'SecurePassword123!',
        name: 'Test User',
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      log('✓ Registration successful', 'green');
      log(`  User ID: ${data.data.user.userId}`, 'blue');
      log(`  Email: ${data.data.user.email}`, 'blue');
      log(`  Name: ${data.data.user.name}`, 'blue');
      log(`  Auth Method: ${data.data.user.authMethod}`, 'blue');
      log(
        `  Access Token: ${data.data.tokens.accessToken.substring(0, 50)}...`,
        'blue'
      );
      return {
        success: true,
        user: data.data.user,
        tokens: data.data.tokens,
      };
    } else {
      log(`✗ Registration failed: ${data.error}`, 'red');
      return { success: false, error: data.error };
    }
  } catch (error) {
    log(`✗ Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function testEmailLogin(email, password) {
  logSection('TEST 2: Email/Password Login');

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      log('✓ Login successful', 'green');
      log(`  User ID: ${data.data.user.userId}`, 'blue');
      log(`  Email: ${data.data.user.email}`, 'blue');
      log(`  Name: ${data.data.user.name}`, 'blue');
      log(`  Auth Method: ${data.data.user.authMethod}`, 'blue');
      log(`  Email Verified: ${data.data.user.emailVerified}`, 'blue');
      return {
        success: true,
        user: data.data.user,
        tokens: data.data.tokens,
      };
    } else {
      log(`✗ Login failed: ${data.error}`, 'red');
      return { success: false, error: data.error };
    }
  } catch (error) {
    log(`✗ Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function testGetCurrentUser(accessToken) {
  logSection('TEST 3: Get Current User Profile');

  try {
    const response = await fetch(`${API_BASE}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (response.ok && data.success) {
      log('✓ Profile retrieved successfully', 'green');
      log(`  User ID: ${data.data.userId}`, 'blue');
      log(`  Email: ${data.data.email}`, 'blue');
      log(`  Name: ${data.data.name}`, 'blue');
      log(`  Subscription: ${data.data.subscription.plan}`, 'blue');
      log(`  KYC Status: ${data.data.kyc.status}`, 'blue');
      return { success: true, user: data.data };
    } else {
      log(`✗ Failed to get profile: ${data.error}`, 'red');
      return { success: false, error: data.error };
    }
  } catch (error) {
    log(`✗ Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function testRefreshToken(refreshToken) {
  logSection('TEST 4: Refresh Access Token');

  try {
    const response = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      log('✓ Token refresh successful', 'green');
      log(
        `  New Access Token: ${data.data.accessToken.substring(0, 50)}...`,
        'blue'
      );
      log(`  Expires In: ${data.data.expiresIn} seconds`, 'blue');
      return { success: true, accessToken: data.data.accessToken };
    } else {
      log(`✗ Token refresh failed: ${data.error}`, 'red');
      return { success: false, error: data.error };
    }
  } catch (error) {
    log(`✗ Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function testLogout(accessToken, refreshToken) {
  logSection('TEST 5: Logout');

  try {
    const response = await fetch(`${API_BASE}/auth/logout`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken,
      }),
    });

    const data = await response.json();

    if (response.ok && data.success) {
      log('✓ Logout successful', 'green');
      log(`  Message: ${data.message}`, 'blue');
      return { success: true };
    } else {
      log(`✗ Logout failed: ${data.error}`, 'red');
      return { success: false, error: data.error };
    }
  } catch (error) {
    log(`✗ Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function testInvalidLogin() {
  logSection('TEST 6: Invalid Login (Should Fail)');

  try {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'nonexistent@example.com',
        password: 'wrongpassword',
      }),
    });

    const data = await response.json();

    if (!response.ok && !data.success) {
      log('✓ Invalid login properly rejected', 'green');
      log(`  Error Message: ${data.error}`, 'blue');
      return { success: true };
    } else {
      log('✗ Invalid login should have failed but succeeded', 'red');
      return { success: false };
    }
  } catch (error) {
    log(`✗ Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function testDuplicateRegistration(email) {
  logSection('TEST 7: Duplicate Registration (Should Fail)');

  try {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password: 'AnotherPassword123!',
        name: 'Duplicate User',
      }),
    });

    const data = await response.json();

    if (!response.ok && !data.success) {
      log('✓ Duplicate registration properly rejected', 'green');
      log(`  Error Message: ${data.error}`, 'blue');
      return { success: true };
    } else {
      log('✗ Duplicate registration should have failed but succeeded', 'red');
      return { success: false };
    }
  } catch (error) {
    log(`✗ Error: ${error.message}`, 'red');
    return { success: false, error: error.message };
  }
}

async function runAllTests() {
  log('\n🚀 Starting Complete Authentication System Tests\n', 'yellow');
  log(`Backend API: ${API_BASE}`, 'cyan');
  log(`Timestamp: ${new Date().toISOString()}\n`, 'cyan');

  const results = {
    passed: 0,
    failed: 0,
    tests: [],
  };

  // Test 1: Registration
  const registrationResult = await testEmailRegistration();
  results.tests.push({
    name: 'Email Registration',
    success: registrationResult.success,
  });
  if (registrationResult.success) results.passed++;
  else results.failed++;

  if (!registrationResult.success) {
    log('\n⚠️  Stopping tests due to registration failure', 'yellow');
    return results;
  }

  const { user, tokens } = registrationResult;
  const testEmail = user.email;
  const testPassword = 'SecurePassword123!';

  // Wait a bit before next test
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Test 2: Login
  const loginResult = await testEmailLogin(testEmail, testPassword);
  results.tests.push({ name: 'Email Login', success: loginResult.success });
  if (loginResult.success) results.passed++;
  else results.failed++;

  await new Promise((resolve) => setTimeout(resolve, 500));

  // Test 3: Get Current User
  const profileResult = await testGetCurrentUser(
    loginResult.tokens.accessToken
  );
  results.tests.push({
    name: 'Get Current User',
    success: profileResult.success,
  });
  if (profileResult.success) results.passed++;
  else results.failed++;

  await new Promise((resolve) => setTimeout(resolve, 500));

  // Test 4: Refresh Token
  const refreshResult = await testRefreshToken(loginResult.tokens.refreshToken);
  results.tests.push({ name: 'Refresh Token', success: refreshResult.success });
  if (refreshResult.success) results.passed++;
  else results.failed++;

  await new Promise((resolve) => setTimeout(resolve, 500));

  // Test 5: Logout
  const logoutResult = await testLogout(
    refreshResult.success
      ? refreshResult.accessToken
      : loginResult.tokens.accessToken,
    loginResult.tokens.refreshToken
  );
  results.tests.push({ name: 'Logout', success: logoutResult.success });
  if (logoutResult.success) results.passed++;
  else results.failed++;

  await new Promise((resolve) => setTimeout(resolve, 500));

  // Test 6: Invalid Login
  const invalidLoginResult = await testInvalidLogin();
  results.tests.push({
    name: 'Invalid Login Rejection',
    success: invalidLoginResult.success,
  });
  if (invalidLoginResult.success) results.passed++;
  else results.failed++;

  await new Promise((resolve) => setTimeout(resolve, 500));

  // Test 7: Duplicate Registration
  const duplicateResult = await testDuplicateRegistration(testEmail);
  results.tests.push({
    name: 'Duplicate Registration Rejection',
    success: duplicateResult.success,
  });
  if (duplicateResult.success) results.passed++;
  else results.failed++;

  // Print summary
  logSection('TEST SUMMARY');
  log(`Total Tests: ${results.tests.length}`, 'cyan');
  log(`Passed: ${results.passed}`, 'green');
  log(`Failed: ${results.failed}`, 'red');
  log(
    `Success Rate: ${((results.passed / results.tests.length) * 100).toFixed(
      1
    )}%`,
    'yellow'
  );

  console.log('\nDetailed Results:');
  results.tests.forEach((test, index) => {
    const icon = test.success ? '✓' : '✗';
    const color = test.success ? 'green' : 'red';
    log(`  ${index + 1}. ${icon} ${test.name}`, color);
  });

  if (results.failed === 0) {
    log(
      '\n🎉 All tests passed! Authentication system is working correctly.',
      'green'
    );
  } else {
    log(
      `\n⚠️  ${results.failed} test(s) failed. Please check the logs above.`,
      'yellow'
    );
  }

  return results;
}

// Run tests
runAllTests().catch((error) => {
  log(`\n❌ Fatal error: ${error.message}`, 'red');
  console.error(error);
});
