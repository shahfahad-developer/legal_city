const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

async function testLogin() {
  try {
    console.log('Testing login with existing user...');
    
    // Try to login with a user that might exist
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: 'admin@legalcity.com',
      password: 'admin123'
    });
    
    console.log('✅ Login successful!');
    console.log('Token:', response.data.token.substring(0, 20) + '...');
    console.log('User ID:', response.data.user.id);
    console.log('User Type:', response.data.user.role);
    
    return response.data.token;
  } catch (error) {
    console.log('❌ Admin login failed, trying with test user...');
    
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email: 'test@example.com',
        password: 'password123'
      });
      
      console.log('✅ Test user login successful!');
      return response.data.token;
    } catch (error2) {
      console.log('❌ Login failed:', error2.response?.data?.message || error2.message);
      return null;
    }
  }
}

async function testChatWithToken(token) {
  const headers = { Authorization: `Bearer ${token}` };
  
  console.log('\n--- Testing Chat Endpoints ---');
  
  // Test 1: Get conversations
  try {
    console.log('\n1. Testing GET /api/chat/conversations');
    const response = await axios.get(`${BASE_URL}/chat/conversations`, { headers });
    console.log('✅ Success! Conversations:', response.data.length);
    if (response.data.length > 0) {
      console.log('Sample:', JSON.stringify(response.data[0], null, 2));
    }
  } catch (error) {
    console.log('❌ Failed:', error.response?.data || error.message);
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('   This might be an authentication issue. Check if userType is properly set in token.');
    }
  }
  
  // Test 2: Get messages - use correct endpoint format
  try {
    console.log('\n2. Testing GET /api/chat/messages/1/user');
    const response = await axios.get(`${BASE_URL}/chat/messages/1/user`, { headers });
    console.log('✅ Success! Messages:', response.data.length);
  } catch (error) {
    console.log('❌ Failed:', error.response?.data || error.message);
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('   This might be an authentication issue. Check if userType is properly set in token.');
    }
  }
  
  // Test 3: Mark as read - use correct endpoint format
  try {
    console.log('\n3. Testing PUT /api/chat/messages/read/1/user');
    const response = await axios.put(`${BASE_URL}/chat/messages/read/1/user`, {}, { headers });
    console.log('✅ Success! Mark as read:', response.data);
  } catch (error) {
    console.log('❌ Failed:', error.response?.data || error.message);
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('   This might be an authentication issue. Check if userType is properly set in token.');
    }
  }
  
  // Test 4: Send a test message via API (if endpoint exists)
  try {
    console.log('\n4. Testing POST message (if endpoint exists)');
    const response = await axios.post(`${BASE_URL}/chat/send`, {
      receiver_id: 2,
      receiver_type: 'lawyer',
      content: 'Test message from API'
    }, { headers });
    console.log('✅ Success! Message sent:', response.data);
  } catch (error) {
    if (error.response?.status === 404) {
      console.log('ℹ️  Send message endpoint not found (messages are sent via Socket.IO)');
    } else {
      console.log('❌ Failed:', error.response?.data || error.message);
    }
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
      console.log('Sample messages:', messages);
      
      // Check data types
      if (messages.length > 0) {
        const firstMessage = messages[0];
        console.log('read_status type:', typeof firstMessage.read_status, 'value:', firstMessage.read_status);
      }
    }
    
    // Check users table
    const users = await db('users').select('id', 'name', 'email').limit(3);
    console.log('Sample users:', users);
    
    // Check lawyers table
    const lawyers = await db('lawyers').select('id', 'name', 'email').limit(3);
    console.log('Sample lawyers:', lawyers);
    
  } catch (error) {
    console.log('❌ Database test failed:', error.message);
  }
}

async function testTokenDecoding(token) {
  if (!token) return;
  
  console.log('\n--- Testing Token Structure ---');
  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.decode(token);
    console.log('Token payload:', decoded);
    console.log('Has userType:', 'userType' in decoded);
    console.log('Has role:', 'role' in decoded);
  } catch (error) {
    console.log('❌ Token decode failed:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Chat System Tests...\n');
  
  // Test database first
  await testDatabase();
  
  // Test login and get token
  const token = await testLogin();
  
  if (token) {
    await testTokenDecoding(token);
    await testChatWithToken(token);
  }
  
  console.log('\n🎉 Tests completed!');
  console.log('\n📋 Summary of potential fixes needed:');
  console.log('1. Ensure userType is included in JWT tokens');
  console.log('2. Update middleware to set req.user.userType');
  console.log('3. Check database schema for read_status field type');
  console.log('4. Verify authentication middleware is working correctly');
}

runTests();