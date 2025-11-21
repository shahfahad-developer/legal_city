import io from 'socket.io-client';
import api from './api';

const SOCKET_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5001';

class ChatService {
  constructor() {
    this.socket = null;
    this.currentUserId = null;
  }

  // Initialize socket connection
  connect(userId) {
    this.currentUserId = userId;
    
    this.socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('Connected to chat server:', this.socket.id);
      this.socket.emit('user_connected', userId);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    return this.socket;
  }

  // Disconnect socket
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  // Get all conversations
  async getConversations() {
    try {
      const response = await api.get('/chat/conversations');
      return response.data;
    } catch (error) {
      console.error('Error fetching conversations:', error);
      throw error;
    }
  }

  // Get messages with specific partner
  async getMessages(partnerId, partnerType, limit = 50, offset = 0) {
    try {
      const response = await api.get(
        `/chat/messages/${partnerId}/${partnerType}?limit=${limit}&offset=${offset}`
      );
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }

  // Mark conversation as read
  async markAsRead(partnerId, partnerType) {
    try {
      const response = await api.put(
        `/chat/messages/read/${partnerId}/${partnerType}`
      );
      return response.data;
    } catch (error) {
      console.error('Error marking as read:', error);
      throw error;
    }
  }

  // Delete conversation
  async deleteConversation(partnerId, partnerType) {
    const response = await api.delete(
      `/chat/conversation/${partnerId}/${partnerType}`
    );
    return response.data;
  }

  // Socket event handlers
  sendMessage(messageData) {
    if (this.socket && this.socket.connected) {
      console.log('Sending message via socket:', messageData);
      this.socket.emit('send_message', messageData);
      return true;
    } else {
      console.error('Socket not connected');
      return false;
    }
  }

  onMessageReceived(callback) {
    if (this.socket) {
      this.socket.on('receive_message', (message) => {
        console.log('Message received:', message);
        callback(message);
      });
    }
  }

  onMessageSent(callback) {
    if (this.socket) {
      this.socket.on('message_sent', (message) => {
        console.log('Message sent confirmation:', message);
        callback(message);
      });
    }
  }

  onMessageError(callback) {
    if (this.socket) {
      this.socket.on('message_error', (error) => {
        console.error('Message error:', error);
        callback(error);
      });
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

  sendTyping(senderId, receiverId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('typing', { sender_id: senderId, receiver_id: receiverId });
    }
  }

  stopTyping(senderId, receiverId) {
    if (this.socket && this.socket.connected) {
      this.socket.emit('stop_typing', { sender_id: senderId, receiver_id: receiverId });
    }
  }

  // Remove all listeners
  removeAllListeners() {
    if (this.socket) {
      this.socket.off('receive_message');
      this.socket.off('message_sent');
      this.socket.off('message_error');
      this.socket.off('user_status');
      this.socket.off('user_typing');
    }
  }
}

export default new ChatService();