const axios = require('axios');

// Base URL for your API server (adjust as needed)
const BASE_URL = 'http://localhost:3000';  // Replace with your actual API URL

// Function to test setPumpStatus endpoint
async function testSetPumpStatus(device_id, status, interval = null) {
  try {
    const payload = {
      device_id,
      status,
    };

    // Add interval only if it's provided
    if (interval) {
      payload.interval = interval;
    }

    console.log(`Testing setPumpStatus with payload:`, payload);

    const response = await axios.post(`${BASE_URL}/set-pump-status`, payload);
    console.log('Response:', response.data);
  } catch (error) {
    console.error('Error testing setPumpStatus:', error.response ? error.response.data : error.message);
  }
}

// Test cases
async function runTests() {
  // Test 1: Simple status update to 'active'
  //await testSetPumpStatus(1, 'active');

  // Test 2: Simple status update to 'inactive'
  //await testSetPumpStatus(1, 'inactive');

  // Test 3: Manual pump activation with interval (e.g., 5 seconds)
  await testSetPumpStatus(1, 'active', 11);

  // Test 4: Invalid status test
 // await testSetPumpStatus(1, 'invalid_status');

  // Test 5: Missing device_id test
//   try {
//     await axios.post(`${BASE_URL}/set-pump-status`, { status: 'active' });
//   } catch (error) {
//     console.error('Error testing with missing device_id:', error.response ? error.response.data : error.message);
//   }
}

// Run all tests
runTests();
