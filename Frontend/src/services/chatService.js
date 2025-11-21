import io from 'socket.io-client';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5001/api';
const SOCKET_URL = 'http://localhost:5001';

class ChatService {
  constructor() {
    this.socket = null;
    this.token = localStorage.getItem('token');
  }

  // Initialize socket connection
  connect(userId) {
    this.socket = io(SOCKET_URL, {
      withCredentials: true
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server');
      this.socket.emit('user_connected', userId);
    });

    return this.socket;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // API calls with authentication
  getAuthHeaders() {
    this.token = localStorage.getItem('token'); // Refresh token
    return {
      headers: { Authorization: `Bearer ${this.token}` }
    };
  }

  // Get all conversations
  async getConversations() {
    const response = await axios.get(`${API_BASE_URL}/chat/conversations`, this.getAuthHeaders());
    return response.data;
  }

  // Get messages with specific partner
  async getMessages(partnerId, partnerType, limit = 50, offset = 0) {
    const response = await axios.get(
      `${API_BASE_URL}/chat/messages/${partnerId}/${partnerType}?limit=${limit}&offset=${offset}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Mark conversation as read
  async markAsRead(partnerId, partnerType) {
    const response = await axios.put(
      `${API_BASE_URL}/chat/messages/read/${partnerId}/${partnerType}`,
      {},
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Delete conversation
  async deleteConversation(partnerId, partnerType) {
    const response = await axios.delete(
      `${API_BASE_URL}/chat/conversation/${partnerId}/${partnerType}`,
      this.getAuthHeaders()
    );
    return response.data;
  }

  // Socket event handlers
  sendMessage(messageData) {
    if (this.socket) {
      this.socket.emit('send_message', messageData);
    }
  }

  onMessageReceived(callback) {
    if (this.socket) {
      this.socket.on('receive_message', callback);
    }
  }

  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on('message_sent', callback);
    }
  }

  onUserStatus(callback) {
    if (this.socket) {
      this.socket.on('user_status', callback);
    }
  }

  onTyping(callback) {
    if (this.socket) {
      this.socket.on('user_typing', callback);
    }
  }

  sendTyping(receiverId) {
    if (this.socket) {
      this.socket.emit('typing', { receiver_id: receiverId });
    }
  }

  stopTyping(receiverId) {
    if (this.socket) {
      this.socket.emit('stop_typing', { receiver_id: receiverId });
    }
  }
}

export default new ChatService();