require('dotenv').config();
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');
const db = require('./db');

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 5001;

// Socket.io setup with CORS
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trust proxy (needed if behind reverse proxy for correct secure cookies)
if (process.env.TRUST_PROXY === '1') {
  app.set('trust proxy', 1);
}

// Session for OAuth
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  },
}));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Static file serving for uploads
app.use('/uploads', express.static('uploads'));

// Routes
app.use('/api/auth', authRoutes);
const adminRoutes = require('./routes/admin');
app.use('/api/admin', adminRoutes);
const lawyerRoutes = require('./routes/lawyers');
app.use('/api/lawyers', lawyerRoutes);
const lawyerDashboardRoutes = require('./routes/lawyerDashboard');
app.use('/api/lawyer', lawyerDashboardRoutes);

// New dashboard routes
const dashboardRoutes = require('./routes/dashboard');
app.use('/api/dashboard', dashboardRoutes);
const casesRoutes = require('./routes/cases');
app.use('/api/cases', casesRoutes);
const clientsRoutes = require('./routes/clients');
app.use('/api/clients', clientsRoutes);
const eventsRoutes = require('./routes/events');
app.use('/api/events', eventsRoutes);
const tasksRoutes = require('./routes/tasks');
app.use('/api/tasks', tasksRoutes);
const documentsRoutes = require('./routes/documents');
app.use('/api/documents', documentsRoutes);
const invoicesRoutes = require('./routes/invoices');
app.use('/api/invoices', invoicesRoutes);
const timeEntriesRoutes = require('./routes/timeEntries');
app.use('/api/time-entries', timeEntriesRoutes);
const expensesRoutes = require('./routes/expenses');
app.use('/api/expenses', expensesRoutes);
const notesRoutes = require('./routes/notes');
app.use('/api/notes', notesRoutes);
const contactsRoutes = require('./routes/contacts');
app.use('/api/contacts', contactsRoutes);
const callsRoutes = require('./routes/calls');
app.use('/api/calls', callsRoutes);
const messagesRoutes = require('./routes/messages');
app.use('/api/messages', messagesRoutes);
const chatRoutes = require('./routes/chatRoutes');
app.use('/api/chat', chatRoutes);
const paymentsRoutes = require('./routes/payments');
app.use('/api/payments', paymentsRoutes);
const intakesRoutes = require('./routes/intakes');
app.use('/api/intakes', intakesRoutes);

// Store active users
const activeUsers = new Map();

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('user_connected', (userId) => {
    activeUsers.set(userId, socket.id);
    console.log(`User ${userId} connected with socket ${socket.id}`);
    io.emit('user_status', { userId, status: 'online' });
  });

  socket.on('send_message', async (data) => {
    try {
      const { sender_id, sender_type, receiver_id, receiver_type, content } = data;
      
      const [messageId] = await db('chat_messages').insert({
        sender_id,
        sender_type,
        receiver_id,
        receiver_type,
        content,
        read_status: false,
        created_at: new Date()
      });

      const message = await db('chat_messages').where('id', messageId).first();
      const receiverSocketId = activeUsers.get(receiver_id);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('receive_message', message);
      }
      socket.emit('message_sent', message);
    } catch (error) {
      console.error('Error sending message:', error);
      socket.emit('message_error', { error: 'Failed to send message' });
    }
  });

  socket.on('mark_as_read', async (data) => {
    try {
      const { messageIds } = data;
      await db('chat_messages').whereIn('id', messageIds).update({ read_status: true });
      socket.emit('messages_marked_read', { messageIds });
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  });

  socket.on('typing', (data) => {
    const { receiver_id } = data;
    const receiverSocketId = activeUsers.get(receiver_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_typing', {
        sender_id: data.sender_id,
        isTyping: true
      });
    }
  });

  socket.on('stop_typing', (data) => {
    const { receiver_id } = data;
    const receiverSocketId = activeUsers.get(receiver_id);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('user_typing', {
        sender_id: data.sender_id,
        isTyping: false
      });
    }
  });

  socket.on('disconnect', () => {
    for (let [userId, socketId] of activeUsers.entries()) {
      if (socketId === socket.id) {
        activeUsers.delete(userId);
        io.emit('user_status', { userId, status: 'offline' });
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Legal City API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  // Verify email transporter connection
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  transporter.verify((error, success) => {
    if (error) {
      console.log('❌ Email transporter verification failed:', error.message);
    } else {
      console.log('✅ Email transporter is ready to send emails');
    }
  });
});

module.exports = app;
