const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testLogin() {
  try {
    console.log('Testing login with test user...');
    
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'test@example.com',
      password: 'password123'
    });
    
    console.log('✅ Login successful!');
    console.log('User ID:', response.data.user.id);
    console.log('User Role:', response.data.user.role);
    
    return response.data.token;
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
    return null;
  }
}

async function testTokenStructure(token) {
  if (!token) return;
  
  console.log('\n--- Testing Token Structure ---');
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.decode(token);
    console.log('Token payload:', decoded);
    console.log('Has userType:', 'userType' in decoded);
    console.log('Has role:', 'role' in decoded);
    
    if (!('userType' in decoded)) {
      console.log('⚠️  WARNING: Token missing userType field!');
      console.log('   This will cause authentication issues with chat endpoints.');
    }
  } catch (error) {
    console.log('❌ Token decode failed:', error.message);
  }
}

async function testMiddleware(token) {
  if (!token) return;
  
  console.log('\n--- Testing Middleware ---');
  try {
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Middleware working correctly');
    console.log('User from middleware:', {
      id: response.data.id,
      email: response.data.email,
      role: response.data.role
    });
  } catch (error) {
    console.log('❌ Middleware test failed:', error.response?.data || error.message);
  }
}

async function testChatEndpoints(token) {
  if (!token) return;
  
  const headers = { Authorization: `Bearer ${token}` };
  
  console.log('\n--- Testing Chat Endpoints ---');
  
  // Test 1: Get conversations
  try {
    console.log('\n1. Testing GET /api/chat/conversations');
    const response = await axios.get(`${BASE_URL}/chat/conversations`, { headers });
    console.log('✅ Success! Conversations:', response.data.length);
    if (response.data.length > 0) {
      console.log('Sample conversation:', JSON.stringify(response.data[0], null, 2));
    } else {
      console.log('ℹ️  No conversations found (this is normal if no messages exist)');
    }
  } catch (error) {
    console.log('❌ Failed:', error.response?.data || error.message);
    if (error.response?.status === 500) {
      console.log('   Server error - check server logs for details');
    }
  }
  
  // Test 2: Get messages
  try {
    console.log('\n2. Testing GET /api/chat/messages/1/lawyer');
    const response = await axios.get(`${BASE_URL}/chat/messages/1/lawyer`, { headers });
    console.log('✅ Success! Messages:', response.data.length);
    if (response.data.length > 0) {
      console.log('Sample message:', response.data[0]);
    }
  } catch (error) {
    console.log('❌ Failed:', error.response?.data || error.message);
  }
  
  // Test 3: Mark as read
  try {
    console.log('\n3. Testing PUT /api/chat/messages/read/1/lawyer');
    const response = await axios.put(`${BASE_URL}/chat/messages/read/1/lawyer`, {}, { headers });
    console.log('✅ Success! Mark as read:', response.data);
  } catch (error) {
    console.log('❌ Failed:', error.response?.data || error.message);
  }
}

async function testDatabase() {
  console.log('\n--- Testing Database Connection ---');
  try {
    const db = require('./db');
    
    // Check if chat_messages table exists
    const tableExists = await db.schema.hasTable('chat_messages');
    console.log('Chat messages table exists:', tableExists);
    
    if (tableExists) {
      const count = await db('chat_messages').count('* as count').first();
      console.log('Total messages in database:', count.count);
      
      // Get sample messages
      const messages = await db('chat_messages').limit(3);
      console.log('Sample messages:', messages.length);
      
      if (messages.length > 0) {
        const firstMessage = messages[0];
        console.log('First message:', {
          id: firstMessage.id,
          sender_id: firstMessage.sender_id,
          sender_type: firstMessage.sender_type,
          receiver_id: firstMessage.receiver_id,
          receiver_type: firstMessage.receiver_type,
          read_status: firstMessage.read_status,
          read_status_type: typeof firstMessage.read_status
        });
      }
    }
    
    // Check test user
    const testUser = await db('users').where({ email: 'test@example.com' }).first();
    if (testUser) {
      console.log('Test user found:', {
        id: testUser.id,
        name: testUser.name,
        email: testUser.email,
        email_verified: testUser.email_verified,
        is_verified: testUser.is_verified
      });
    } else {
      console.log('⚠️  Test user not found! Run: node create_test_user.js');
    }
    
  } catch (error) {
    console.log('❌ Database test failed:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Comprehensive Chat System Tests...\n');
  
  // Test database first
  await testDatabase();
  
  // Test login and get token
  const token = await testLogin();
  
  if (token) {
    await testTokenStructure(token);
    await testMiddleware(token);
    await testChatEndpoints(token);
  } else {
    console.log('\n❌ Cannot proceed with chat tests - login failed');
    console.log('Make sure to run: node create_test_user.js first');
  }
  
  console.log('\n🎉 Tests completed!');
  
  if (token) {
    console.log('\n📋 Next steps if tests still fail:');
    console.log('1. Restart the server to ensure all changes are loaded');
    console.log('2. Check server console for detailed error messages');
    console.log('3. Verify the middleware is correctly setting req.user.userType');
  }
}

runTests();