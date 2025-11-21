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
    console.log('User Type:', response.data.user.userType);
    
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
  }
  
  // Test 2: Get messages
  try {
    console.log('\n2. Testing GET /api/chat/messages/1/user');
    const response = await axios.get(`${BASE_URL}/chat/messages/1/user`, { headers });
    console.log('✅ Success! Messages:', response.data.length);
  } catch (error) {
    console.log('❌ Failed:', error.response?.data || error.message);
  }
  
  // Test 3: Mark as read
  try {
    console.log('\n3. Testing PUT /api/chat/messages/read/1/user');
    const response = await axios.put(`${BASE_URL}/chat/messages/read/1/user`, {}, { headers });
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
      console.log('Sample messages:', messages);
    }
    
    // Check users table
    const users = await db('users').select('id', 'name', 'email').limit(3);
    console.log('Sample users:', users);
    
  } catch (error) {
    console.log('❌ Database test failed:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Chat System Tests...\n');
  
  // Test database first
  await testDatabase();
  
  // Test login and get token
  const token = await testLogin();
  
  if (token) {
    await testChatWithToken(token);
  }
  
  console.log('\n🎉 Tests completed!');
}

runTests();