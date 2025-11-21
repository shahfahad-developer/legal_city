const express = require('express');
const passport = require('../config/passport');
const { authenticateToken, authenticateAdmin } = require('../utils/middleware');
const { authLimiter } = require('../utils/limiter');
const { getRedirectPath } = require('../utils/redirectLogic');
const {
  login,
  verifyEmail,
  forgotPasswordOtp,
  verifyForgotPasswordOtp,
  resetPassword,
  getProfile,
  updateProfile,
  deleteAccount,
  sendOtp,
  verifyOtp,
} = require('../controllers/authController');
const { registerUser, loginUser } = require('../controllers/userController');
const { registerLawyer, loginLawyer } = require('../controllers/lawyerController');

const router = express.Router();

// Registration
router.post('/register-user', authLimiter, registerUser);
router.post('/register-lawyer', authLimiter, registerLawyer);

// Unified register endpoint - intelligently routes to user or lawyer registration
router.post('/register', authLimiter, async (req, res) => {
  // Detect if this is a lawyer registration by checking for lawyer-specific fields
  const isLawyer = req.body.registration_id || req.body.law_firm || req.body.speciality;
  
  if (isLawyer) {
    console.log('🔵 Routing to lawyer registration');
    return registerLawyer(req, res);
  } else {
    console.log('🔵 Routing to user registration');
    return registerUser(req, res);
  }
});

// Login
router.post('/login', authLimiter, login);

// Email verification
router.post('/verify-email', verifyEmail);

// OTP endpoints
router.post('/send-otp', authLimiter, sendOtp);
router.post('/verify-otp', verifyOtp);

// Password reset with OTP
router.post('/forgot-password-otp', authLimiter, forgotPasswordOtp);
router.post('/verify-forgot-password-otp', verifyForgotPasswordOtp);

// Profile management
router.get('/me', authenticateToken, getProfile);
router.put('/me', authenticateToken, updateProfile);
router.post('/submit-later', authenticateToken, (req, res) => require('../controllers/authController').submitLater(req, res));
router.delete('/me', authenticateToken, deleteAccount);

// OAuth routes
router.get('/google', (req, res, next) => {
  // Store role in session for callback
  if (req.query.role) {
    req.session.oauthRole = req.query.role;
  }
  passport.authenticate('google', { scope: ['profile', 'email'] })(req, res, next);
});

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: `${process.env.FRONTEND_URL}/` }),
  (req, res) => {
    const { token, role, user: oauthUser } = req.user;

    // Check if profile is completed or if user is verified
    const completed = oauthUser && (oauthUser.profile_completed === 1 || oauthUser.profile_completed === true);
    const isVerified = oauthUser && (oauthUser.is_verified === 1 || oauthUser.is_verified === true);
    
    let redirectUrl;
    
    // After profile completion: Always redirect to /user-dashboard
    if (completed || isVerified) {
      // Prepare user data for redirect logic
      const userData = {
        role: role || 'user',
        is_admin: oauthUser.is_admin === 1 || oauthUser.is_admin === true || oauthUser.role === 'admin',
        registration_id: oauthUser.registration_id || null,
        redirect: oauthUser.redirect || null
      };
      
      const redirectPath = getRedirectPath(userData);
      redirectUrl = `${process.env.FRONTEND_URL}${redirectPath}?token=${token}`;
    } else {
      // Profile not completed - redirect to setup
      if (role === 'lawyer') {
        redirectUrl = `${process.env.FRONTEND_URL}/google-lawyer-setup?token=${token}`;
      } else {
        redirectUrl = `${process.env.FRONTEND_URL}/google-user-setup?token=${token}`;
      }
    }

    // Clear the stored role from session
    delete req.session.oauthRole;

    console.log(`Google OAuth success - Role: ${role}, Completed: ${completed}, Verified: ${isVerified}, Redirecting to: ${redirectUrl}`);
    res.redirect(redirectUrl);
  }
);

router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: `${process.env.FRONTEND_URL}/` }),
  (req, res) => {
    res.redirect(`${process.env.FRONTEND_URL}/?token=${req.user.token}`);
  }
);

module.exports = router;