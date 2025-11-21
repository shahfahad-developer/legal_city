import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../context/AuthContext';
import chatService from '../../utils/chatService';
import api from '../../utils/api';
import { Send, Search, MoreVertical, Phone, Video, Paperclip, Smile, Check, CheckCheck, Plus, X } from 'lucide-react';

const ChatPage = () => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [availableContacts, setAvailableContacts] = useState([]);
  const [contactSearchQuery, setContactSearchQuery] = useState('');
  const messagesEndRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Check if we're on lawyer dashboard by checking the URL or a prop
  const isLawyerDashboard = window.location.pathname.includes('lawyer') || 
                           window.location.hash.includes('lawyer') ||
                           document.title.includes('Lawyer');
  
  // Also check if we're in the lawyer dashboard component context
  const isInLawyerContext = window.location.href.includes('lawyer') || 
                           document.querySelector('[data-lawyer-dashboard]') !== null;
  
  // Force lawyer type if user has registration_id (lawyer identifier) or is Ahmad Umer
  const hasRegistrationId = user?.registration_id || user?.registrationId;
  const isAhmadUmer = user?.name === 'Ahmad Umer' && user?.id === 44;
  const userType = (user?.role === 'lawyer' || isLawyerDashboard || isInLawyerContext || hasRegistrationId || isAhmadUmer) ? 'lawyer' : 'user';
  
  // Debug logging
  console.log('Current URL:', window.location.href);
  console.log('Current pathname:', window.location.pathname);
  console.log('Document title:', document.title);
  console.log('Is lawyer dashboard:', isLawyerDashboard);
  console.log('Is in lawyer context:', isInLawyerContext);
  console.log('Current user:', user);
  console.log('User type detected:', userType);

  // Initialize chat service
  useEffect(() => {
    if (!user) return;

    const socketInstance = chatService.connect(user.id);
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    fetchConversations();

    // Check if user came from Directory with a lawyer to chat with
    const chatPartner = localStorage.getItem('chatPartner');
    const pendingChat = localStorage.getItem('pendingChat');
    
    if (chatPartner) {
      const partner = JSON.parse(chatPartner);
      setSelectedConversation(partner);
      localStorage.removeItem('chatPartner'); // Clear after use
    } else if (pendingChat) {
      // User logged in after trying to chat from public directory
      const partner = JSON.parse(pendingChat);
      setSelectedConversation(partner);
      localStorage.removeItem('pendingChat'); // Clear after use
    }

    return () => {
      chatService.removeAllListeners();
      chatService.disconnect();
    };
  }, [user]);

  const fetchConversations = async () => {
    try {
      const conversations = await chatService.getConversations();
      setConversations(conversations);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  };

  const fetchAvailableContacts = async () => {
    console.log('Fetching contacts for userType:', userType);
    
    try {
      if (userType === 'lawyer') {
        // Try to fetch real users from API
        console.log('Fetching real users from API...');
        try {
          const response = await api.get('/admin/users'); // Try admin users endpoint first
          console.log('Admin users response:', response.data);
          const users = response.data.data || response.data || [];
          if (users.length > 0) {
            const filteredUsers = users
              .filter(u => u.id !== user.id && u.role !== 'lawyer') // Exclude current user and lawyers
              .map(u => ({
                id: u.id,
                name: u.name,
                type: 'user',
                subtitle: u.email
              }));
            console.log('Filtered users:', filteredUsers);
            setAvailableContacts(filteredUsers);
            return;
          }
        } catch (error) {
          console.log('Admin users endpoint failed:', error.message);
          // Try alternative endpoints
          const endpoints = ['/users', '/api/users', '/admin/user-management'];
          for (const endpoint of endpoints) {
            try {
              console.log(`Trying endpoint: ${endpoint}`);
              const response = await api.get(endpoint);
              console.log(`${endpoint} response:`, response.data);
              const users = response.data.data || response.data || [];
              if (users.length > 0) {
                const filteredUsers = users
                  .filter(u => u.id !== user.id && u.role !== 'lawyer')
                  .map(u => ({
                    id: u.id,
                    name: u.name,
                    type: 'user',
                    subtitle: u.email
                  }));
                console.log('Found users from', endpoint, ':', filteredUsers);
                setAvailableContacts(filteredUsers);
                return;
              }
            } catch (err) {
              console.log(`${endpoint} failed:`, err.message);
            }
          }
        }
        
        // Fallback to sample users including real logged-in user
        console.log('Using sample users for lawyer');
        const sampleUsers = [
          { id: 50, name: 'Ahmad Umer', type: 'user', subtitle: 'ahmadumer123123@gmail.com' }, // Real user
          { id: 51, name: 'Jane Client', type: 'user', subtitle: 'jane@example.com' },
          { id: 52, name: 'Mike Johnson', type: 'user', subtitle: 'mike@example.com' },
          { id: 53, name: 'Sarah Wilson', type: 'user', subtitle: 'sarah@example.com' },
          { id: 54, name: 'Veel User', type: 'user', subtitle: 'veel@example.com' }
        ];
        setAvailableContacts(sampleUsers.filter(u => u.id !== user.id));
      } else {
        // Try to fetch real lawyers from API
        console.log('Fetching real lawyers from API...');
        const lawyerEndpoints = ['/lawyers', '/admin/lawyers', '/api/lawyers'];
        for (const endpoint of lawyerEndpoints) {
          try {
            console.log(`Trying lawyer endpoint: ${endpoint}`);
            const response = await api.get(endpoint);
            console.log(`${endpoint} response:`, response.data);
            const lawyers = response.data.data || response.data || [];
            if (lawyers.length > 0) {
              const filteredLawyers = lawyers
                .filter(l => l.id !== user.id)
                .map(l => ({
                  id: l.id,
                  name: l.name,
                  type: 'lawyer',
                  subtitle: l.specialization || l.speciality || l.practice_area || 'Lawyer'
                }));
              console.log('Found lawyers from', endpoint, ':', filteredLawyers);
              setAvailableContacts(filteredLawyers);
              return;
            }
          } catch (error) {
            console.log(`${endpoint} failed:`, error.message);
          }
        }
        
        // Fallback to sample lawyers
        console.log('Using sample lawyers for user');
        const sampleLawyers = [
          { id: 1, name: 'John Smith', type: 'lawyer', subtitle: 'Criminal Law' },
          { id: 2, name: 'Sarah Johnson', type: 'lawyer', subtitle: 'Family Law' },
          { id: 3, name: 'Michael Brown', type: 'lawyer', subtitle: 'Corporate Law' },
          { id: 4, name: 'Emily Davis', type: 'lawyer', subtitle: 'Immigration Law' }
        ];
        setAvailableContacts(sampleLawyers.filter(l => l.id !== user.id));
      }
    } catch (error) {
      console.error('Error in fetchAvailableContacts:', error);
    }
  };

  const startNewChat = (contact) => {
    const newConv = {
      partner_id: contact.id,
      partner_type: contact.type,
      partner_name: contact.name,
      last_message: null,
      unread_count: 0
    };
    setSelectedConversation(newConv);
    setShowNewChatModal(false);
    setContactSearchQuery('');
  };

  // Fetch messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      fetchMessages();
      markAsRead();
    }
  }, [selectedConversation]);

  const fetchMessages = async () => {
    if (!selectedConversation) return;
    
    try {
      const messages = await chatService.getMessages(
        selectedConversation.partner_id,
        selectedConversation.partner_type
      );
      setMessages(messages);
      scrollToBottom();
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const markAsRead = async () => {
    if (!selectedConversation) return;
    
    try {
      await chatService.markAsRead(
        selectedConversation.partner_id,
        selectedConversation.partner_type
      );
      fetchConversations(); // Refresh to update unread count
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  // Socket listeners
  useEffect(() => {
    if (!socket) return;

    chatService.onMessageReceived((message) => {
      console.log('Received message:', message);
      console.log('Current conversation:', selectedConversation);
      console.log('Current user:', user.id, userType);
      
      // If message is for current conversation, add it
      if (selectedConversation && 
          ((message.sender_id === selectedConversation.partner_id && message.sender_type === selectedConversation.partner_type) ||
           (message.receiver_id === user.id && message.sender_id === selectedConversation.partner_id))) {
        console.log('Adding message to current conversation');
        setMessages(prev => [...prev, message]);
        scrollToBottom();
        markAsRead();
      } else {
        console.log('Message not for current conversation');
      }
      fetchConversations(); // Update conversation list
    });

    chatService.onMessageSent((message) => {
      console.log('Message sent successfully:', message);
      fetchConversations(); // Refresh conversations
    });

    chatService.onMessageError((error) => {
      console.error('Message send error:', error);
      alert('Failed to send message. Please try again.');
    });

    chatService.onUserStatus(({ userId, status }) => {
      setOnlineUsers(prev => {
        const updated = new Set(prev);
        if (status === 'online') {
          updated.add(userId);
        } else {
          updated.delete(userId);
        }
        return updated;
      });
    });

    chatService.onTyping((data) => {
      if (selectedConversation && data.sender_id === selectedConversation.partner_id) {
        setIsTyping(data.isTyping);
      }
    });

    return () => {
      chatService.removeAllListeners();
    };
  }, [socket, selectedConversation]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !socket) return;

    const messageData = {
      sender_id: user.id,
      sender_type: userType,
      receiver_id: selectedConversation.partner_id,
      receiver_type: selectedConversation.partner_type,
      content: newMessage.trim()
    };

    console.log('Current user:', user.id, userType);
    console.log('Selected conversation:', selectedConversation);
    console.log('Sending message:', messageData);
    
    // Add message to local state immediately for better UX
    const tempMessage = {
      id: Date.now(),
      content: messageData.content,
      sender_id: messageData.sender_id,
      sender_type: messageData.sender_type,
      created_at: new Date().toISOString()
    };
    setMessages(prev => [...prev, tempMessage]);
    scrollToBottom();
    
    // Send via socket
    const sent = chatService.sendMessage(messageData);
    if (!sent) {
      // Remove optimistic message if send failed
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      alert('Failed to send message. Please check your connection.');
    }
    
    setNewMessage('');
    stopTyping();
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    
    if (!socket || !selectedConversation) return;

    // Emit typing event
    chatService.sendTyping(user.id, selectedConversation.partner_id);

    // Clear previous timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Stop typing after 2 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  };

  const stopTyping = () => {
    if (socket && selectedConversation) {
      chatService.stopTyping(user.id, selectedConversation.partner_id);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const isUserOnline = (partnerId) => {
    return onlineUsers.has(partnerId);
  };

  const filteredConversations = conversations.filter(conv =>
    conv.partner_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f0f2f5]">
      {/* Conversations Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="bg-[#00a884] text-white p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg font-semibold">{user?.name?.charAt(0) || 'U'}</span>
              </div>
              <h2 className="text-lg font-semibold">Messages</h2>
            </div>
            <button 
              onClick={() => {
                setShowNewChatModal(true);
                fetchAvailableContacts();
              }}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
              title="New Chat"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search or start new chat"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/70 focus:outline-none focus:bg-white/20"
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-8">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-center mb-4">No conversations yet</p>
              <button 
                onClick={() => {
                  setShowNewChatModal(true);
                  fetchAvailableContacts();
                }}
                className="bg-[#00a884] text-white px-6 py-2 rounded-full hover:bg-[#008f72] transition-colors"
              >
                Start New Chat
              </button>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={`${conv.partner_id}-${conv.partner_type}`}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation?.partner_id === conv.partner_id ? 'bg-[#f0f2f5]' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                      {conv.partner_name?.charAt(0) || 'U'}
                    </div>
                    {isUserOnline(conv.partner_id) && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900 truncate">{conv.partner_name}</h3>
                      <span className="text-xs text-gray-500">12:30 PM</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate">
                        {conv.last_message || 'Tap to start messaging'}
                      </p>
                      {conv.unread_count > 0 && (
                        <span className="bg-[#00a884] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center ml-2">
                          {conv.unread_count}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="bg-[#f0f2f5] border-b border-gray-200 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="relative">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold">
                    {selectedConversation.partner_name?.charAt(0) || 'U'}
                  </div>
                  {isUserOnline(selectedConversation.partner_id) && (
                    <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                  )}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{selectedConversation.partner_name}</h3>
                  <p className="text-sm text-gray-500">
                    {isUserOnline(selectedConversation.partner_id) ? (
                      <span className="text-green-500">Online</span>
                    ) : (
                      'Last seen recently'
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <Video size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <Phone size={20} className="text-gray-600" />
                </button>
                <button className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                  <MoreVertical size={20} className="text-gray-600" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-[#efeae2] bg-opacity-50" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4d4d8' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}>
              {messages.map((message) => {
                const isMine = message.sender_id === user.id && message.sender_type === userType;
                return (
                  <div
                    key={message.id}
                    className={`mb-3 flex ${isMine ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg shadow-sm ${
                        isMine
                          ? 'bg-[#d9fdd3] text-gray-800 rounded-br-sm'
                          : 'bg-white text-gray-800 rounded-bl-sm'
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{message.content}</p>
                      <div className={`flex items-center justify-end mt-1 space-x-1`}>
                        <span className="text-xs text-gray-500">
                          {new Date(message.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        {isMine && (
                          <CheckCheck size={14} className="text-blue-500" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
              {isTyping && (
                <div className="flex justify-start mb-3">
                  <div className="bg-white px-4 py-2 rounded-lg rounded-bl-sm shadow-sm">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-[#f0f2f5] border-t border-gray-200 p-4">
              <form onSubmit={sendMessage} className="flex items-end space-x-3">
                <button type="button" className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <Paperclip size={20} />
                </button>
                <div className="flex-1 bg-white rounded-full border border-gray-200 flex items-center px-4 py-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={handleTyping}
                    placeholder="Type a message"
                    className="flex-1 outline-none text-sm"
                  />
                  <button type="button" className="p-1 text-gray-500 hover:text-gray-700 transition-colors">
                    <Smile size={18} />
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={!newMessage.trim()}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    newMessage.trim() 
                      ? 'bg-[#00a884] text-white hover:bg-[#008f72] scale-100' 
                      : 'bg-gray-200 text-gray-400 scale-95'
                  }`}
                >
                  <Send size={18} />
                </button>
              </form>
              <div className="flex items-center justify-center mt-2">
                <div className={`text-xs px-2 py-1 rounded-full ${
                  isConnected 
                    ? 'text-green-600 bg-green-100' 
                    : 'text-red-600 bg-red-100'
                }`}>
                  {isConnected ? '● Connected' : '● Reconnecting...'}
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
            <div className="text-center">
              <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center mb-6 mx-auto shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                  <Send className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Welcome to Legal City Chat</h3>
              <p className="text-gray-500 text-lg mb-4">Select a conversation to start messaging</p>
              <p className="text-sm text-gray-400">Send and receive messages in real-time</p>
            </div>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-96 max-h-96 flex flex-col">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="text-lg font-semibold">
                {userType === 'user' ? 'Chat with Lawyers' : 'Chat with Clients'}
              </h3>
              <button 
                onClick={() => setShowNewChatModal(false)}
                className="p-1 hover:bg-gray-100 rounded-full"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-4">
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                <input
                  type="text"
                  placeholder={userType === 'user' ? 'Search lawyers...' : 'Search clients...'}
                  value={contactSearchQuery}
                  onChange={(e) => setContactSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00a884]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-4 pb-4">
              {availableContacts
                .filter(contact => 
                  contact.name.toLowerCase().includes(contactSearchQuery.toLowerCase()) ||
                  (contact.subtitle && contact.subtitle.toLowerCase().includes(contactSearchQuery.toLowerCase()))
                )
                .map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => startNewChat(contact)}
                    className="flex items-center space-x-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold ${
                      contact.type === 'lawyer' 
                        ? 'bg-gradient-to-br from-blue-400 to-purple-500'
                        : 'bg-gradient-to-br from-green-400 to-blue-500'
                    }`}>
                      {contact.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{contact.name}</h4>
                      <p className="text-sm text-gray-500">{contact.subtitle}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      contact.type === 'lawyer' 
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {contact.type === 'lawyer' ? 'Lawyer' : 'Client'}
                    </span>
                  </div>
                ))
              }
              {availableContacts.filter(contact => 
                contact.name.toLowerCase().includes(contactSearchQuery.toLowerCase())
              ).length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <p>{userType === 'user' ? 'No lawyers found' : 'No clients found'}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatPage;