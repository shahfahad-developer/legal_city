const axios = require('axios');
const { generateToken, verifyToken } = require('./utils/token');
const db = require('./db');

const BASE_URL = 'http://localhost:5001/api';

async function debugTokenGeneration() {
  console.log('🔍 Debug: Testing token generation...');
  
  const testUser = {
    id: 46,
    email: 'test@example.com',
    role: 'user'
  };
  
  // Test token generation directly
  const token = generateToken(testUser, 'user');
  console.log('Generated token:', token.substring(0, 50) + '...');
  
  const decoded = verifyToken(token);
  console.log('Decoded token:', decoded);
  console.log('Has userType:', 'userType' in decoded);
  
  return token;
}

async function debugMiddleware(token) {
  console.log('\n🔍 Debug: Testing middleware...');
  
  try {
    // Make a simple authenticated request to test middleware
    const response = await axios.get(`${BASE_URL}/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log('✅ Middleware test successful');
    console.log('User from middleware:', response.data);
  } catch (error) {
    console.log('❌ Middleware test failed:', error.response?.data || error.message);
  }
}

async function debugChatRoutes(token) {
  console.log('\n🔍 Debug: Testing chat routes...');
  
  const headers = { Authorization: `Bearer ${token}` };
  
  // Test conversations endpoint
  try {
    console.log('Testing conversations endpoint...');
    const response = await axios.get(`${BASE_URL}/chat/conversations`, { headers });
    console.log('✅ Conversations endpoint works:', response.data.length, 'conversations');
  } catch (error) {
    console.log('❌ Conversations endpoint failed:');
    console.log('Status:', error.response?.status);
    console.log('Data:', error.response?.data);
    console.log('Headers sent:', headers);
    
    // If it's a 500 error, let's check the server logs
    if (error.response?.status === 500) {
      console.log('This is likely a server-side error. Check the server console for detailed error logs.');
    }
  }
}

async function debugDatabase() {
  console.log('\n🔍 Debug: Testing database...');
  
  try {
    // Check if user exists
    const user = await db('users').where({ email: 'test@example.com' }).first();
    console.log('Test user in database:', user ? 'Found' : 'Not found');
    
    if (user) {
      console.log('User details:', {
        id: user.id,
        email: user.email,
        role: user.role,
        email_verified: user.email_verified,
        is_verified: user.is_verified
      });
    }
    
    // Check chat messages
    const messageCount = await db('chat_messages').count('* as count').first();
    console.log('Chat messages in database:', messageCount.count);
    
    // Check if there are any messages involving our test user
    const userMessages = await db('chat_messages')
      .where(function() {
        this.where({ sender_id: user?.id, sender_type: 'user' })
          .orWhere({ receiver_id: user?.id, receiver_type: 'user' });
      })
      .limit(5);
    
    console.log('Messages involving test user:', userMessages.length);
    
  } catch (error) {
    console.log('❌ Database debug failed:', error.message);
  }
}

async function runDebugTests() {
  console.log('🚀 Starting Debug Tests...\n');
  
  // Test token generation
  const token = await debugTokenGeneration();
  
  // Test database
  await debugDatabase();
  
  // Test middleware
  await debugMiddleware(token);
  
  // Test chat routes
  await debugChatRoutes(token);
  
  console.log('\n🎉 Debug tests completed!');
}

runDebugTests();