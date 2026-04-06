const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middleware/auth');
const adminController = require('../controllers/adminController');

// Public route - anyone can access
router.get('/public', (req, res) => {
  res.json({ message: 'Welcome! This is a public route.' });
});

// User dashboard - accessible by both simple 'user' and 'admin' roles
router.get('/user-dashboard', verifyToken, authorizeRoles('user', 'admin'), (req, res) => {
  res.json({ 
    message: `Hello, ${req.user.username}! Welcome to the user dashboard.`,
    role: req.user.role
  });
});

// Admin panel - accessible ONLY by 'admin' role
router.get('/admin-panel', verifyToken, authorizeRoles('admin'), (req, res) => {
  res.json({ 
    message: `Hello, ${req.user.username}! Welcome to the restricted admin panel.`,
    role: req.user.role
  });
});

/**
 * NEW ADMIN FEATURES
 */

// List all users - admin only
router.get('/admin/users', verifyToken, authorizeRoles('admin'), adminController.getAllUsers);

// View audit logs - admin only
router.get('/admin/audit-logs', verifyToken, authorizeRoles('admin'), adminController.getAuditLogs);

// Update user role - admin only
router.patch('/admin/update-role', verifyToken, authorizeRoles('admin'), adminController.updateUserRole);

module.exports = router;
