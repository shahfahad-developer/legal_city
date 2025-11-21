# Legal City 2.0 - Complete Project Documentation

## Project Overview

Legal City is a comprehensive legal services platform that connects users with legal professionals. The application features a full-stack architecture with user authentication, lawyer verification, admin management, and dashboard systems for different user types.

### Technology Stack

**Backend:**
- Node.js with Express.js v5.1.0
- MySQL database with Knex.js ORM
- JWT authentication with Passport.js OAuth
- Nodemailer for email services
- bcryptjs for password hashing
- Multer for file uploads

**Frontend:**
- React 19.2.0 with React Router v7.9.4
- Tailwind CSS v3.4.18 for styling
- Axios for HTTP requests
- Lucide React for icons
- Sonner for notifications

**Database:**
- MySQL with comprehensive migration system
- Knex.js for query building and migrations

## Project Structure

```
Legal-City-2.0-main/
├── backend/
│   ├── config/
│   │   └── passport.js              # OAuth configuration
│   ├── controllers/
│   │   ├── adminController.js       # Admin management
│   │   ├── authController.js        # Authentication logic
│   │   ├── callController.js        # Call management
│   │   ├── caseController.js        # Case management
│   │   ├── clientController.js      # Client management
│   │   ├── contactController.js     # Contact management
│   │   ├── dashboardController.js   # Dashboard data
│   │   ├── documentController.js    # Document management
│   │   ├── eventController.js       # Event management
│   │   ├── expenseController.js     # Expense tracking
│   │   ├── intakeController.js      # Client intake
│   │   ├── invoiceController.js     # Invoice management
│   │   ├── lawyerController.js      # Lawyer management
│   │   ├── lawyerDashboardController.js # Lawyer dashboard
│   │   ├── messageController.js     # Messaging system
│   │   ├── noteController.js        # Note management
│   │   ├── paymentController.js     # Payment processing
│   │   ├── taskController.js        # Task management
│   │   ├── timeEntryController.js   # Time tracking
│   │   └── userController.js        # User management
│   ├── migrations/                  # Database migrations
│   ├── routes/                      # API route definitions
│   ├── uploads/                     # File storage
│   ├── utils/                       # Utility functions
│   ├── server.js                    # Main server file
│   ├── db.js                        # Database connection
│   └── knexfile.js                  # Database configuration
├── Frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                # Authentication components
│   │   │   ├── layout/              # Layout components
│   │   │   └── modals/              # Modal components
│   │   ├── context/
│   │   │   └── AuthContext.js       # Authentication state
│   │   ├── pages/
│   │   │   ├── admin/               # Admin pages
│   │   │   ├── auth/                # Authentication pages
│   │   │   ├── lawyer/              # Lawyer dashboard pages
│   │   │   ├── public/              # Public pages
│   │   │   └── userdashboard/       # User dashboard pages
│   │   ├── utils/                   # Utility functions
│   │   ├── App.js                   # Main app component
│   │   └── LegalCityAuth.jsx        # Authentication wrapper
└── Documentation files
```

## Database Schema

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  username VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email_verification_code VARCHAR(255),
  email_verified INT DEFAULT 0,
  reset_token VARCHAR(255),
  reset_token_expiry TIMESTAMP,
  otp_expiry TIMESTAMP,
  address VARCHAR(255),
  zip_code VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(255),
  country VARCHAR(255),
  mobile_number VARCHAR(20),
  role VARCHAR(255) NOT NULL DEFAULT 'user',
  google_id VARCHAR(255) UNIQUE,
  avatar VARCHAR(255),
  is_active INT NOT NULL DEFAULT 1,
  is_admin BOOLEAN DEFAULT FALSE,
  is_verified INT DEFAULT 0,
  profile_completed INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### Lawyers Table
```sql
CREATE TABLE lawyers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  username VARCHAR(255),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  registration_id VARCHAR(255),
  law_firm VARCHAR(255),
  speciality VARCHAR(255),
  email_verification_code VARCHAR(255),
  email_verified INT DEFAULT 0,
  reset_token VARCHAR(255),
  reset_token_expiry TIMESTAMP,
  otp_expiry TIMESTAMP,
  address VARCHAR(255),
  zip_code VARCHAR(255),
  city VARCHAR(255),
  state VARCHAR(255),
  country VARCHAR(255),
  mobile_number VARCHAR(20),
  lawyer_verified INT DEFAULT 0,
  rating DECIMAL(3,1) DEFAULT 0.0,
  phone VARCHAR(20),
  experience VARCHAR(50),
  description TEXT,
  profile_image VARCHAR(500),
  is_verified INT DEFAULT 0,
  languages JSON,
  hourly_rate INT,
  profile_completed INT DEFAULT 0,
  google_id VARCHAR(255) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Practice Areas System
```sql
CREATE TABLE practice_areas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lawyer_practice_areas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lawyer_id INT,
  practice_area_id INT,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,
  FOREIGN KEY (practice_area_id) REFERENCES practice_areas(id) ON DELETE CASCADE
);
```

### Lawyer Dashboard Tables
```sql
CREATE TABLE cases (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lawyer_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  type ENUM('civil', 'criminal', 'family', 'corporate', 'immigration', 'personal_injury', 'real_estate', 'other') DEFAULT 'civil',
  status ENUM('active', 'pending', 'closed', 'on_hold') DEFAULT 'active',
  filing_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE
);

CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lawyer_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE
);

CREATE TABLE events (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lawyer_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  event_date DATETIME NOT NULL,
  location VARCHAR(255),
  type ENUM('meeting', 'hearing', 'deadline', 'consultation', 'other') DEFAULT 'meeting',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE
);

CREATE TABLE tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lawyer_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  due_date DATE,
  priority ENUM('low', 'medium', 'high') DEFAULT 'medium',
  status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE
);

CREATE TABLE documents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lawyer_id INT NOT NULL,
  case_id INT,
  title VARCHAR(255) NOT NULL,
  file_path VARCHAR(500),
  file_type VARCHAR(50),
  file_size INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL
);

CREATE TABLE invoices (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lawyer_id INT NOT NULL,
  client_id INT,
  case_id INT,
  amount DECIMAL(10,2) NOT NULL,
  description TEXT,
  status ENUM('draft', 'sent', 'paid', 'overdue', 'cancelled') DEFAULT 'draft',
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL
);

CREATE TABLE time_entries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lawyer_id INT NOT NULL,
  case_id INT,
  description TEXT NOT NULL,
  hours DECIMAL(4,2) NOT NULL,
  hourly_rate DECIMAL(8,2),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL
);

CREATE TABLE expenses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lawyer_id INT NOT NULL,
  case_id INT,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  category VARCHAR(100),
  receipt_path VARCHAR(500),
  date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL
);

CREATE TABLE notes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lawyer_id INT NOT NULL,
  case_id INT,
  client_id INT,
  title VARCHAR(255),
  content TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,
  FOREIGN KEY (case_id) REFERENCES cases(id) ON DELETE SET NULL,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
);

CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lawyer_id INT NOT NULL,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  company VARCHAR(255),
  type ENUM('client', 'colleague', 'vendor', 'other') DEFAULT 'other',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE
);

CREATE TABLE calls (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lawyer_id INT NOT NULL,
  contact_id INT,
  client_id INT,
  duration INT,
  notes TEXT,
  call_date DATETIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,
  FOREIGN KEY (contact_id) REFERENCES contacts(id) ON DELETE SET NULL,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
);

CREATE TABLE messages (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lawyer_id INT NOT NULL,
  client_id INT,
  subject VARCHAR(255),
  content TEXT NOT NULL,
  direction ENUM('sent', 'received') NOT NULL,
  read_status BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,
  FOREIGN KEY (client_id) REFERENCES clients(id) ON DELETE SET NULL
);

CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lawyer_id INT NOT NULL,
  invoice_id INT,
  amount DECIMAL(10,2) NOT NULL,
  payment_method VARCHAR(50),
  transaction_id VARCHAR(255),
  status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
  payment_date DATETIME,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE,
  FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE SET NULL
);

CREATE TABLE intakes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  lawyer_id INT NOT NULL,
  client_name VARCHAR(255) NOT NULL,
  client_email VARCHAR(255),
  client_phone VARCHAR(20),
  case_type VARCHAR(100),
  description TEXT,
  status ENUM('new', 'reviewed', 'accepted', 'rejected') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (lawyer_id) REFERENCES lawyers(id) ON DELETE CASCADE
);
```

### Admin System Tables
```sql
CREATE TABLE activity_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  admin_id INT NOT NULL,
  action VARCHAR(100) NOT NULL,
  target_type VARCHAR(50),
  target_id INT,
  details JSON,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (admin_id) REFERENCES users(id) ON DELETE CASCADE
);
```

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Unified user/lawyer registration
- `POST /login` - Unified login for users and lawyers
- `POST /verify-email` - Email verification with code
- `POST /send-otp` - Send OTP for verification
- `POST /verify-otp` - Verify OTP
- `POST /forgot-password-otp` - Send password reset OTP
- `POST /verify-forgot-password-otp` - Reset password with OTP
- `GET /me` - Get current user profile
- `PUT /me` - Update user profile
- `DELETE /me` - Delete account
- `POST /submit-later` - Mark profile as verified for later completion
- `GET /google` - Google OAuth initiation
- `GET /google/callback` - Google OAuth callback
- `GET /facebook` - Facebook OAuth initiation
- `GET /facebook/callback` - Facebook OAuth callback

### Admin Routes (`/api/admin`) - Requires Admin JWT
- `GET /stats` - Dashboard statistics
- `GET /users` - User management with pagination and search
- `GET /lawyers` - Lawyer management with pagination and filters
- `GET /lawyers/unverified` - Get unverified lawyers
- `PUT /verify-lawyer/:id` - Verify lawyer
- `PUT /reject-lawyer/:id` - Reject lawyer verification
- `DELETE /users/:id` - Delete user
- `DELETE /lawyers/:id` - Delete lawyer
- `PUT /users/:id/make-admin` - Grant admin access
- `PUT /users/:id/remove-admin` - Remove admin access
- `GET /activity-logs` - Activity logs with pagination

### Lawyer Directory Routes (`/api/lawyers`)
- `GET /` - Public lawyer directory with filters and pagination

### Lawyer Dashboard Routes (`/api/lawyer`)
- `GET /dashboard/overview` - Dashboard statistics
- `GET /cases` - Get lawyer's cases with pagination
- `POST /cases` - Create new case
- `PUT /cases/:id` - Update case
- `DELETE /cases/:id` - Delete case
- `GET /clients` - Get lawyer's clients
- `POST /clients` - Create new client
- `PUT /clients/:id` - Update client
- `DELETE /clients/:id` - Delete client
- `GET /events` - Get lawyer's events
- `POST /events` - Create new event
- `PUT /events/:id` - Update event
- `DELETE /events/:id` - Delete event
- `GET /tasks` - Get lawyer's tasks
- `POST /tasks` - Create new task
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `GET /documents` - Get lawyer's documents
- `POST /documents` - Upload new document
- `DELETE /documents/:id` - Delete document
- `GET /invoices` - Get lawyer's invoices
- `POST /invoices` - Create new invoice
- `PUT /invoices/:id` - Update invoice
- `DELETE /invoices/:id` - Delete invoice
- `GET /time-entries` - Get time entries
- `POST /time-entries` - Create time entry
- `PUT /time-entries/:id` - Update time entry
- `DELETE /time-entries/:id` - Delete time entry
- `GET /expenses` - Get expenses
- `POST /expenses` - Create expense
- `PUT /expenses/:id` - Update expense
- `DELETE /expenses/:id` - Delete expense
- `GET /notes` - Get notes
- `POST /notes` - Create note
- `PUT /notes/:id` - Update note
- `DELETE /notes/:id` - Delete note
- `GET /contacts` - Get contacts
- `POST /contacts` - Create contact
- `PUT /contacts/:id` - Update contact
- `DELETE /contacts/:id` - Delete contact
- `GET /calls` - Get calls
- `POST /calls` - Create call record
- `PUT /calls/:id` - Update call
- `DELETE /calls/:id` - Delete call
- `GET /messages` - Get messages
- `POST /messages` - Send message
- `PUT /messages/:id/read` - Mark message as read
- `DELETE /messages/:id` - Delete message
- `GET /payments` - Get payments
- `POST /payments` - Record payment
- `PUT /payments/:id` - Update payment
- `GET /intakes` - Get client intakes
- `POST /intakes` - Create intake
- `PUT /intakes/:id` - Update intake status
- `DELETE /intakes/:id` - Delete intake

### User Dashboard Routes (`/api/dashboard`)
- `GET /overview` - User dashboard statistics

## Complete Frontend Architecture

### Application Routing (App.js)
The main App.js defines all application routes:
- **Public Routes:** `/` (UserInterface), `/lawyers` (LawyerDirectory), `/lawyer/:id` (LawyerProfile)
- **Authentication Routes:** `/login`, `/register`, `/forgot-password`, `/reset-password`, `/verify-email`
- **OAuth Setup Routes:** `/google-user-setup`, `/google-lawyer-setup`
- **Dashboard Routes:** `/user-dashboard`, `/lawyer-dashboard`, `/admin-dashboard`
- **Sidebar Routes (SharedLayout):** 15 user dashboard pages with shared navigation
- **Utility Routes:** `/logout` (outside SharedLayout)
- **Catch-all:** Redirects to home page

### Context Management
- **AuthContext.js** - Global authentication state management with login/logout functions and user data persistence

## Frontend Pages and Components

### Public Pages
1. **UserInterface.js** - Multi-language landing page
   - **Header:** Legal City logo, lawyer directory link, language selector (EN/ES/FR/DE), login/signup buttons
   - **Hero Section:** Background image with search overlay
     * "Find Lawyer" heading with translations
     * 3-field search form: Practice name/Lawyer, Specialty, City/State/ZIP
     * "Search Lawyers" button with gradient styling
     * Enter key support for search
   - **Featured Lawyers Carousel:**
     * Responsive carousel (1/2/3 cards per slide based on screen size)
     * Lawyer cards with photos, names, ratings (5-star system), locations
     * Practice areas and success stories
     * Navigation arrows and dot indicators
     * Sample lawyers: Nedime Acikli, Melek Arican, Nika Monhart, Ronald Richards, Darlene Robertson
   - **Multi-language Support:** Complete translations for English, Spanish, French, German
   - **Responsive Design:** Mobile-first approach with breakpoint optimization

2. **LawyerDirectory.js** - Public lawyer search and discovery
   - **Advanced Search Interface:**
     * Multiple filter options (name, specialty, location, rating)
     * Real-time search with query parameters
     * URL-based search state management
   - **Lawyer Profile Cards:**
     * Professional photos and ratings
     * Practice area specializations
     * Location and contact information
     * "View Profile" and contact buttons
   - **Filtering System:**
     * Practice area filtering
     * Location-based search with radius
     * Rating and experience filters
     * Availability status filtering
   - **Pagination:** Efficient loading of large lawyer datasets

### Authentication System
1. **LegalCityAuth.jsx** - Main authentication wrapper
   - **Mode Switching:** Dynamic switching between login, register, forgot password, verify email, reset password
   - **OAuth Integration:** Google and Facebook OAuth with secure callbacks
   - **Redirect Logic:** Intelligent routing based on user type and role:
     * Custom redirect paths
     * Admin dashboard for admin users
     * Lawyer dashboard for lawyers (checks role, registration_id, user_type)
     * User dashboard as default
   - **Layout:** Blue sidebar with Legal City branding + main form area

2. **Authentication Pages:**
   - **Login.js** - Unified login system
     * Email/password for regular users
     * Registration ID/password for lawyers
     * Google OAuth button integration
     * "Switch to Register" and "Forgot Password" links
     * Form validation and error handling
   
   - **Register.js** - Registration with auto-detection
     * Unified registration form for users and lawyers
     * Automatic user type detection based on input
     * Email verification requirement
     * Password strength validation
     * Terms acceptance and form validation
   
   - **VerifyEmail.js** - Email verification system
     * 6-digit OTP input component
     * Resend verification code functionality
     * Auto-redirect after successful verification
     * Email parameter handling
   
   - **ForgotPassword.js** - Password reset flow
     * OTP-based password reset (6-digit code)
     * Email validation and OTP sending
     * New password setting with confirmation
     * 10-minute OTP expiry handling
   
   - **ResetPassword.js** - Token-based password reset
     * URL token validation
     * New password setting
     * Password strength requirements
   
   - **GoogleUserSetup.jsx** - Google OAuth user profile completion
   - **GoogleLawyerSetup.jsx** - Google OAuth lawyer profile completion
   - **Logout.jsx** - Logout confirmation and cleanup

### User Dashboard System
1. **UserDashboard.jsx** - Main user dashboard
   - Collapsible sidebar navigation (16px collapsed, 256px expanded)
   - Global search functionality in header
   - Profile card with background image and user info
   - Messages widget with chat interface
   - Hero section with "Find a lawyer" and "Get Started" tabs
   - Search form for practice area/lawyer name and location
   - Responsive layout with sidebar toggle for mobile
   - Footer with comprehensive legal links

2. **User Dashboard Pages (15 Total Pages):**
   - **Blog.jsx** - Blog management and legal content
   - **Messages.jsx** - Messaging system with lawyers
   - **Directory.jsx** - Internal lawyer directory access
   - **Forms.jsx** - Legal forms and document templates
   - **SocialMedia.jsx** - Social media integration and sharing
   - **Tasks.jsx** - Personal task management
   - **Cases.jsx** - Case tracking and status updates
   - **Dashboard.jsx** - Main dashboard overview
   - **Accounting.jsx** - Financial management and billing
   - **Profile.jsx** - User profile management
   - **Calendar.jsx** - Calendar and appointment scheduling
   - **QA.jsx** - Q&A system for legal questions
   - **FindLawyer.jsx** - Advanced lawyer search and filtering
   - **Refer.jsx** - Referral system for recommending lawyers
   - **Settings.jsx** - User account settings and preferences

### Lawyer Dashboard System
1. **LawyerDashboard.js** - Comprehensive lawyer management interface
   - **Header Navigation:** Search bar, 6 main navigation tabs (Home, Contacts, Calendar, Reports, Tasks, Documents)
   - **User Profile Dropdown:** Profile settings, account management, logout functionality
   - **Overview Statistics Dashboard:**
     * Active Cases (blue card with count)
     * Total Clients (green card with count) 
     * Monthly Revenue (red card with dollar amount)
     * Upcoming Hearings (yellow card with count)
   - **Quick Actions Grid:** 13 action buttons for all major functions
   - **Interactive Calendar Widget:** June 2023 calendar with navigation and today highlighting
   - **Cases Management Section:**
     * Add new case functionality with form (title, client, case type)
     * Case type options: civil, criminal, family, corporate, immigration, personal_injury, real_estate, other
     * Case listing with status badges (active, pending, closed, on_hold)
     * Status color coding: active (green), pending (yellow), closed (red), on_hold (gray)
   - **Recent Clients Panel:** Client cards with profile icons, names, emails, and view buttons
   - **Recent Invoices Panel:** Invoice listings with status badges and amounts
   - **Invoice Status Types:** draft, sent, paid, overdue, cancelled with color coding

2. **Lawyer Dashboard Pages (5 Specialized Pages):**
   - **ContactsPage.js** - Professional contact management system
   - **CalendarPage.js** - Advanced calendar with event scheduling
   - **ReportsPage.js** - Analytics, reports, and business insights
   - **TasksPage.js** - Task management with priorities and deadlines
   - **DocumentsPage.js** - Document storage and case file management

### Admin Dashboard System
1. **AdminDashboard.js** - Comprehensive admin management interface
   - **Platform Statistics:**
     * Total Users count
     * Total Lawyers count  
     * Verified Lawyers count
     * Unverified Lawyers count
   - **User Management:**
     * Paginated user listing with search functionality
     * User details: name, email, username, verification status, mobile number
     * Delete user functionality (with admin protection)
     * Grant/revoke admin access
   - **Lawyer Management:**
     * Paginated lawyer listing with advanced filtering
     * Filter by verification status (verified/unverified)
     * Search by name, email, registration ID, specialty
     * Lawyer verification/rejection system
     * Complete lawyer profiles with registration details
   - **Lawyer Verification System:**
     * Review unverified lawyer applications
     * Verify or reject lawyer accounts
     * Update lawyer verification status
   - **Activity Logging:**
     * Comprehensive admin action logs
     * IP address tracking
     * Action details with JSON metadata
     * Paginated activity history
   - **Role Management:**
     * Grant admin privileges to users
     * Remove admin access (with self-protection)
     * Role-based access control

### Shared Components
1. **Layout Components:**
   - **Header.jsx** - Application header
   - **Sidebar.jsx** - Navigation sidebar
   - **Footer.jsx** - Application footer
   - **SharedLayout.jsx** - Layout wrapper

2. **Modal Components (13 Total Modals):**
   - **CreateClientModal.js** - Client creation with full contact details (name, email, username, address, city, state, zip, country, mobile)
   - **CreateContactModal.js** - Contact management for colleagues, vendors, other professionals
   - **CreateMatterModal.js** - Matter/case creation with case type selection and client assignment
   - **CreateEventModal.js** - Event creation for meetings, hearings, deadlines, consultations
   - **CreateTaskModal.js** - Task creation with priority levels and due dates
   - **CreateNoteModal.js** - Note creation linked to cases or clients
   - **CreateCallModal.js** - Call logging with duration, notes, and contact/client linking
   - **SendMessageModal.js** - Message sending to clients with subject and content
   - **TrackTimeModal.js** - Time tracking for billable hours with case association
   - **AddExpenseModal.js** - Expense tracking with receipt upload and categorization
   - **CreateInvoiceModal.js** - Invoice generation with client and case linking
   - **CreatePaymentModal.js** - Payment recording with transaction details
   - **CreateIntakeModal.js** - Client intake form for new potential clients

3. **Utility Components:**
   - **OtpInput.jsx** - OTP input field with 6-digit verification
   - **PasswordStrengthIndicator.jsx** - Real-time password strength validation
   - **Toast.jsx** - Basic notification system
   - **ModernToast.jsx** - Enhanced notifications with Sonner integration
   - **QuickActions.js** - Comprehensive quick action grid with 13 action buttons:
     * New Client (blue) - Users icon
     * New Contact (green) - UserPlus icon  
     * New Matter (purple) - FileText icon
     * New Event (orange) - Calendar icon
     * New Task (red) - CheckSquare icon
     * New Note (yellow) - StickyNote icon
     * Log Call (indigo) - Phone icon
     * Send Message (pink) - MessageSquare icon
     * Track Time (teal) - Clock icon
     * Add Expense (emerald) - DollarSign icon
     * New Invoice (cyan) - Receipt icon
     * Record Payment (violet) - CreditCard icon
     * New Intake (rose) - Plus icon

## Authentication and Authorization

### User Types and Roles
1. **Regular Users** - Basic platform access
2. **Lawyers** - Professional dashboard access
3. **Admins** - Full platform management

### Authentication Flow
1. **Registration:**
   - Unified registration form
   - Automatic user type detection
   - Email verification required
   - Profile completion flow

2. **Login:**
   - Email/password for users
   - Registration ID/password for lawyers
   - Google OAuth integration
   - Role-based redirects

3. **Verification:**
   - Email verification with OTP
   - Lawyer verification by admin
   - Profile completion tracking

### Security Features
- JWT token authentication (7-day expiration)
- Password hashing with bcrypt (10 rounds)
- Rate limiting on authentication endpoints
- Input validation and sanitization
- CORS protection
- OAuth integration with secure callbacks

## Key Features

### User Features
- Multi-language support (English, Spanish, French, German)
- Advanced lawyer search with filters
- Profile management
- Case tracking
- Messaging system
- Document management
- Calendar integration
- Task management
- Financial tracking

### Lawyer Features
- Comprehensive dashboard
- Case management system
- Client management
- Time tracking and billing
- Invoice generation
- Document storage
- Calendar and scheduling
- Task management
- Expense tracking
- Contact management
- Call logging
- Message handling
- Payment tracking
- Client intake system

### Admin Features
- User and lawyer management
- Lawyer verification system
- Platform statistics
- Activity logging
- Role management
- Bulk operations

## File Upload System
- Document upload for cases
- Receipt upload for expenses
- Profile image upload
- Secure file storage in `/uploads` directory
- File type and size validation

## Email System
- Email verification with OTP
- Password reset functionality
- Welcome messages
- Admin notifications
- Gmail SMTP integration

## Development Setup

### Environment Variables
```env
# Backend (.env)
NODE_ENV=development
PORT=5001
FRONTEND_URL=http://localhost:3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=legal_city
JWT_SECRET=your_secret_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_gmail_app_password
TRUST_PROXY=0
```

### Installation and Setup
1. **Backend Setup:**
   ```bash
   cd backend
   npm install
   npx knex migrate:latest
   npm start
   ```

2. **Frontend Setup:**
   ```bash
   cd Frontend
   npm install
   npm start
   ```

### Database Migrations
The project includes comprehensive database migrations that create all necessary tables and seed initial data including practice areas and sample lawyers.

## Error Handling and Logging
- Comprehensive error handling in all controllers
- Activity logging for admin actions
- Console logging for development
- Graceful error responses with appropriate HTTP status codes

## Performance Considerations
- Database indexing on frequently queried fields
- Pagination for large data sets
- Efficient query optimization with Knex.js
- Image optimization and compression
- Lazy loading for components

## Security Considerations
- SQL injection prevention with parameterized queries
- XSS protection with input sanitization
- CSRF protection
- Secure file upload validation
- Rate limiting on sensitive endpoints
- Secure session management

## Future Features and Planned Enhancements

### Social Media Integration System
Based on the current SocialMedia.jsx page structure, planned features include:
- **Social Media Dashboard:** Centralized management of social media presence
- **Content Sharing:** Share legal insights and case studies across platforms
- **Professional Networking:** Connect with other legal professionals
- **Client Testimonial Sharing:** Automated sharing of client reviews and success stories
- **Legal Content Publishing:** Blog post distribution to social platforms
- **Social Media Analytics:** Track engagement and reach metrics
- **Platform Integration:** Facebook, LinkedIn, Twitter, Instagram connectivity

### Advanced Chat and Messaging System
Current MessagesWidget shows foundation for expanded features:
- **Real-time Chat:** WebSocket-based instant messaging between users and lawyers
- **Multi-participant Conversations:** Group chats for complex cases
- **File Sharing:** Document and image sharing within chat
- **Video Call Integration:** In-chat video consultation booking
- **Message Threading:** Organized conversation threads by topic/case
- **Chat History:** Searchable message archives
- **Notification System:** Real-time push notifications for new messages
- **Typing Indicators:** Live typing status display
- **Message Status:** Read receipts and delivery confirmations
- **Chat Encryption:** End-to-end encryption for sensitive legal communications

### Blog and Content Management System
Blog.jsx foundation supports:
- **Legal Blog Platform:** Lawyer-authored articles and insights
- **Content Categories:** Practice area-specific content organization
- **SEO Optimization:** Search engine optimized legal content
- **Comment System:** Client and peer engagement on posts
- **Content Scheduling:** Automated blog post publishing
- **Rich Text Editor:** Advanced formatting and media embedding
- **Content Analytics:** View counts, engagement metrics
- **Guest Posting:** Client success story submissions

### Q&A Community Platform
QA.jsx structure enables:
- **Legal Q&A Forum:** Community-driven legal question platform
- **Expert Answers:** Verified lawyer responses to legal questions
- **Question Categories:** Practice area-specific question organization
- **Voting System:** Community voting on answer quality
- **Best Answer Selection:** Question asker can mark best responses
- **Reputation System:** Lawyer credibility scoring based on helpful answers
- **Anonymous Questions:** Privacy protection for sensitive legal queries
- **Question Moderation:** Admin oversight of content quality

### Legal Forms and Document System
Forms.jsx framework supports:
- **Legal Document Library:** Comprehensive legal form collection
- **Form Customization:** Client-specific document generation
- **E-signature Integration:** Digital document signing workflow
- **Form Templates:** Lawyer-created custom form templates
- **Document Automation:** Auto-population from client data
- **Version Control:** Document revision tracking
- **Compliance Checking:** Automated legal requirement validation
- **Form Analytics:** Usage statistics and completion rates

### Referral and Rewards System
Refer.jsx foundation enables:
- **Lawyer Referral Network:** Cross-referral system between lawyers
- **Client Referral Rewards:** Incentive program for client referrals
- **Referral Tracking:** Complete referral lifecycle management
- **Commission Management:** Automated referral fee calculations
- **Referral Analytics:** Performance metrics and conversion tracking
- **Partner Network:** Strategic partnerships with other legal services
- **Loyalty Program:** Client retention and reward system

### Advanced Calendar and Scheduling
Building on existing calendar widget:
- **Multi-calendar Support:** Personal, court, client calendars
- **Appointment Booking:** Client self-service appointment scheduling
- **Calendar Sync:** Integration with Google Calendar, Outlook
- **Automated Reminders:** Email and SMS appointment notifications
- **Conflict Detection:** Automatic scheduling conflict prevention
- **Recurring Events:** Automated recurring appointment creation
- **Calendar Sharing:** Selective calendar sharing with clients/staff

### Enhanced Financial Management
Expanding on current accounting features:
- **Advanced Reporting:** Comprehensive financial analytics
- **Tax Integration:** Automated tax calculation and reporting
- **Expense Categories:** Detailed expense categorization and tracking
- **Profit/Loss Analysis:** Business performance metrics
- **Client Billing Analytics:** Billing efficiency and collection rates
- **Payment Gateway Integration:** Multiple payment processor support
- **Subscription Management:** Recurring billing for retainer clients

### Mobile Application
Planned mobile app features:
- **Native iOS/Android Apps:** Full-featured mobile applications
- **Offline Functionality:** Core features available without internet
- **Push Notifications:** Real-time alerts for important events
- **Mobile Document Scanning:** Camera-based document capture
- **GPS Integration:** Location-based lawyer discovery
- **Biometric Authentication:** Fingerprint/Face ID security

### AI and Machine Learning Integration
- **Legal Research Assistant:** AI-powered case law research
- **Document Analysis:** Automated contract and document review
- **Predictive Analytics:** Case outcome prediction based on historical data
- **Smart Matching:** AI-driven lawyer-client matching algorithm
- **Chatbot Support:** 24/7 automated customer support
- **Voice Recognition:** Voice-to-text for note-taking and documentation

### Advanced Security Features
- **Two-Factor Authentication:** Enhanced account security
- **Audit Trails:** Comprehensive activity logging
- **Data Encryption:** Advanced encryption for all sensitive data
- **Compliance Monitoring:** Automated regulatory compliance checking
- **Backup and Recovery:** Automated data backup and disaster recovery

### Integration Capabilities
- **Court System Integration:** Electronic filing and case status updates
- **Legal Database APIs:** Integration with legal research databases
- **CRM Integration:** Connection with popular CRM systems
- **Accounting Software Sync:** QuickBooks, Xero integration
- **Email Platform Integration:** Seamless email client connectivity

This documentation provides a complete overview of the Legal City 2.0 project, covering all backend APIs, frontend components, database structure, system architecture, and planned future enhancements. The project is designed to be scalable, secure, and user-friendly for all stakeholders in the legal services ecosystem.