const axios = require('axios');

const BASE_URL = 'http://localhost:5001/api';

// Test data
const testUser = {
  email: 'test@example.com',
  password: 'password123'
};

let authToken = '';

async function testChatEndpoints() {
  try {
    console.log('🚀 Testing Chat System Endpoints...\n');

    // 1. Login to get auth token
    console.log('1. Testing login...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
      authToken = loginResponse.data.token;
      console.log('✅ Login successful');
      console.log('User:', loginResponse.data.user.name, '- Type:', loginResponse.data.user.userType);
    } catch (error) {
      console.log('❌ Login failed - creating test user first...');
      
      // Try to register first
      try {
        await axios.post(`${BASE_URL}/auth/register`, {
          name: 'Test User',
          email: testUser.email,
          password: testUser.password,
          userType: 'user'
        });
        console.log('✅ Test user created');
        
        // Login again
        const loginResponse = await axios.post(`${BASE_URL}/auth/login`, testUser);
        authToken = loginResponse.data.token;
        console.log('✅ Login successful after registration');
      } catch (regError) {
        console.log('❌ Registration also failed:', regError.response?.data?.message || regError.message);
        return;
      }
    }

    const headers = { Authorization: `Bearer ${authToken}` };

    // 2. Test get conversations
    console.log('\n2. Testing get conversations...');
    try {
      const conversationsResponse = await axios.get(`${BASE_URL}/chat/conversations`, { headers });
      console.log('✅ Get conversations successful');
      console.log('Conversations count:', conversationsResponse.data.length);
      if (conversationsResponse.data.length > 0) {
        console.log('Sample conversation:', conversationsResponse.data[0]);
      }
    } catch (error) {
      console.log('❌ Get conversations failed:', error.response?.data?.error || error.message);
    }

    // 3. Test get messages (with dummy partner)
    console.log('\n3. Testing get messages...');
    try {
      const messagesResponse = await axios.get(`${BASE_URL}/chat/messages/1/lawyer`, { headers });
      console.log('✅ Get messages successful');
      console.log('Messages count:', messagesResponse.data.length);
    } catch (error) {
      console.log('❌ Get messages failed:', error.response?.data?.error || error.message);
    }

    // 4. Test mark as read
    console.log('\n4. Testing mark messages as read...');
    try {
      const readResponse = await axios.put(`${BASE_URL}/chat/messages/read/1/lawyer`, {}, { headers });
      console.log('✅ Mark as read successful');
    } catch (error) {
      console.log('❌ Mark as read failed:', error.response?.data?.error || error.message);
    }

    console.log('\n🎉 Chat endpoint testing completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Test Socket.io connection
function testSocketConnection() {
  console.log('\n🔌 Testing Socket.io connection...');
  
  const io = require('socket.io-client');
  const socket = io('http://localhost:5001', {
    transports: ['websocket']
  });

  socket.on('connect', () => {
    console.log('✅ Socket.io connected:', socket.id);
    
    // Test user connection
    socket.emit('user_connected', 1);
    
    // Test sending a message
    socket.emit('send_message', {
      sender_id: 1,
      sender_type: 'user',
      receiver_id: 2,
      receiver_type: 'lawyer',
      content: 'Test message from automated test'
    });
  });

  socket.on('message_sent', (data) => {
    console.log('✅ Message sent successfully:', data.content);
    socket.disconnect();
  });

  socket.on('message_error', (error) => {
    console.log('❌ Message send failed:', error);
    socket.disconnect();
  });

  socket.on('connect_error', (error) => {
    console.log('❌ Socket connection failed:', error.message);
  });

  // Disconnect after 5 seconds if no response
  setTimeout(() => {
    if (socket.connected) {
      console.log('⏰ Socket test timeout - disconnecting');
      socket.disconnect();
    }
  }, 5000);
}

// Run tests
testChatEndpoints().then(() => {
  testSocketConnection();
});