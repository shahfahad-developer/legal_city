const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../utils/middleware');
const {
  getDashboardStats,
  getAllUsers,
  getAllLawyers,
  getUnverifiedLawyers,
  verifyLawyer,
  rejectLawyer,
  deleteUser,
  deleteLawyer,
  getActivityLogs,
  makeUserAdmin,
  removeAdminAccess
} = require('../controllers/adminController');

// All routes require admin authentication
router.use(verifyAdmin);

// Dashboard statistics
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.delete('/users/:id', deleteUser);
router.put('/users/:id/make-admin', makeUserAdmin);
router.put('/users/:id/remove-admin', removeAdminAccess);

// Lawyer management
router.get('/lawyers', getAllLawyers);
router.get('/lawyers/unverified', getUnverifiedLawyers);
router.put('/verify-lawyer/:id', verifyLawyer);
router.put('/reject-lawyer/:id', rejectLawyer);
router.delete('/lawyers/:id', deleteLawyer);

// Activity logs
router.get('/activity-logs', getActivityLogs);

module.exports = router;
