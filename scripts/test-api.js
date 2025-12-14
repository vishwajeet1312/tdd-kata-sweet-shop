// Test script for Sweet Shop API
// Run with: node scripts/test-api.js

const API_BASE_URL = 'http://localhost:3000/api';
let authToken = '';
let userId = '';
let sweetId = '';

// Helper function to make API requests
async function apiRequest(endpoint, method = 'GET', body = null, useAuth = false) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (useAuth && authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  const options = {
    method,
    headers,
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error('API Request Error:', error.message);
    return { status: 500, data: { error: error.message } };
  }
}

// Test functions
async function testRegister() {
  console.log('\n🔵 Testing User Registration...');
  const result = await apiRequest('/auth/register', 'POST', {
    username: 'testuser' + Date.now(),
    email: `test${Date.now()}@example.com`,
    password: 'password123',
    role: 'admin', // Create as admin for testing
  });

  if (result.status === 201) {
    authToken = result.data.token;
    userId = result.data.user.id;
    console.log('✅ Registration successful!');
    console.log('   Token:', authToken.substring(0, 20) + '...');
    console.log('   User ID:', userId);
  } else {
    console.error('❌ Registration failed:', result.data);
  }
  return result;
}

async function testLogin() {
  console.log('\n🔵 Testing User Login...');
  const result = await apiRequest('/auth/login', 'POST', {
    email: 'admin@example.com',
    password: 'admin123',
  });

  if (result.status === 200) {
    console.log('✅ Login successful!');
  } else {
    console.log('ℹ️  Login failed (expected if user doesn\'t exist)');
  }
  return result;
}

async function testCreateSweet() {
  console.log('\n🔵 Testing Create Sweet...');
  const result = await apiRequest('/sweets', 'POST', {
    name: 'Test Chocolate Bar',
    description: 'Delicious test chocolate',
    price: 2.99,
    category: 'chocolate',
    quantity: 50,
  }, true);

  if (result.status === 201) {
    sweetId = result.data.data._id;
    console.log('✅ Sweet created successfully!');
    console.log('   Sweet ID:', sweetId);
    console.log('   Name:', result.data.data.name);
  } else {
    console.error('❌ Create sweet failed:', result.data);
  }
  return result;
}

async function testGetAllSweets() {
  console.log('\n🔵 Testing Get All Sweets...');
  const result = await apiRequest('/sweets');

  if (result.status === 200) {
    console.log('✅ Fetched sweets successfully!');
    console.log(`   Total sweets: ${result.data.count}`);
  } else {
    console.error('❌ Get sweets failed:', result.data);
  }
  return result;
}

async function testSearchSweets() {
  console.log('\n🔵 Testing Search Sweets...');
  const result = await apiRequest('/sweets/search?name=chocolate&minPrice=1&maxPrice=5');

  if (result.status === 200) {
    console.log('✅ Search successful!');
    console.log(`   Found: ${result.data.count} sweets`);
  } else {
    console.error('❌ Search failed:', result.data);
  }
  return result;
}

async function testGetSingleSweet() {
  if (!sweetId) {
    console.log('\n⚠️  Skipping Get Single Sweet (no sweet ID)');
    return;
  }

  console.log('\n🔵 Testing Get Single Sweet...');
  const result = await apiRequest(`/sweets/${sweetId}`);

  if (result.status === 200) {
    console.log('✅ Fetched sweet successfully!');
    console.log('   Name:', result.data.data.name);
    console.log('   Price:', result.data.data.price);
  } else {
    console.error('❌ Get single sweet failed:', result.data);
  }
  return result;
}

async function testUpdateSweet() {
  if (!sweetId) {
    console.log('\n⚠️  Skipping Update Sweet (no sweet ID)');
    return;
  }

  console.log('\n🔵 Testing Update Sweet...');
  const result = await apiRequest(`/sweets/${sweetId}`, 'PUT', {
    price: 3.99,
    quantity: 75,
  }, true);

  if (result.status === 200) {
    console.log('✅ Sweet updated successfully!');
    console.log('   New price:', result.data.data.price);
    console.log('   New quantity:', result.data.data.quantity);
  } else {
    console.error('❌ Update sweet failed:', result.data);
  }
  return result;
}

async function testPurchaseSweet() {
  if (!sweetId) {
    console.log('\n⚠️  Skipping Purchase Sweet (no sweet ID)');
    return;
  }

  console.log('\n🔵 Testing Purchase Sweet...');
  const result = await apiRequest(`/sweets/${sweetId}/purchase`, 'POST', {
    quantity: 2,
  }, true);

  if (result.status === 200) {
    console.log('✅ Purchase successful!');
    console.log('   Purchased:', result.data.data.purchasedQuantity);
    console.log('   Total price:', result.data.data.totalPrice);
    console.log('   Remaining stock:', result.data.data.remainingStock);
  } else {
    console.error('❌ Purchase failed:', result.data);
  }
  return result;
}

async function testRestockSweet() {
  if (!sweetId) {
    console.log('\n⚠️  Skipping Restock Sweet (no sweet ID)');
    return;
  }

  console.log('\n🔵 Testing Restock Sweet...');
  const result = await apiRequest(`/sweets/${sweetId}/restock`, 'POST', {
    quantity: 25,
  }, true);

  if (result.status === 200) {
    console.log('✅ Restock successful!');
    console.log('   Restocked:', result.data.data.restockedQuantity);
    console.log('   New stock:', result.data.data.newStock);
  } else {
    console.error('❌ Restock failed:', result.data);
  }
  return result;
}

async function testDeleteSweet() {
  if (!sweetId) {
    console.log('\n⚠️  Skipping Delete Sweet (no sweet ID)');
    return;
  }

  console.log('\n🔵 Testing Delete Sweet...');
  const result = await apiRequest(`/sweets/${sweetId}`, 'DELETE', null, true);

  if (result.status === 200) {
    console.log('✅ Sweet deleted successfully!');
  } else {
    console.error('❌ Delete sweet failed:', result.data);
  }
  return result;
}

// Main test runner
async function runAllTests() {
  console.log('🚀 Starting Sweet Shop API Tests...');
  console.log('📍 API Base URL:', API_BASE_URL);

  try {
    await testRegister();
    await testLogin();
    await testCreateSweet();
    await testGetAllSweets();
    await testSearchSweets();
    await testGetSingleSweet();
    await testUpdateSweet();
    await testPurchaseSweet();
    await testRestockSweet();
    await testDeleteSweet();

    console.log('\n✅ All tests completed!');
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
  }
}

// Run tests
runAllTests();
