require('dotenv').config();
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const passport = require('./config/passport');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5001;

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
const paymentsRoutes = require('./routes/payments');
app.use('/api/payments', paymentsRoutes);
const intakesRoutes = require('./routes/intakes');
app.use('/api/intakes', intakesRoutes);
const blogsRoutes = require('./routes/blogs');
app.use('/api/blogs', blogsRoutes);

// Legacy blog endpoints for compatibility
const blogController = require('./controllers/blogController');
const { requireAuth, requireLawyer } = require('./utils/middleware');
app.get('/api/blog-categories', blogController.getBlogCategories);
app.get('/api/blog-tags', blogController.getBlogTags);
app.get('/api/blog-authors', blogController.getTopAuthors);
app.get('/api/popular-blogs', blogController.getPopularPosts);

// Lawyer blog management route
app.get('/api/lawyer/blogs', requireAuth, requireLawyer, blogController.getLawyerBlogs);

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

app.listen(PORT, () => {
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
