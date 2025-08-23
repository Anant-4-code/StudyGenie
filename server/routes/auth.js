const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticate, authorize } = require('../middleware/auth');
const {
  register,
  verifyEmail,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  updateDetails,
  updatePassword
} = require('../controllers/authController');

// Public routes
router.post(
  '/register',
  [
    body('name', 'Name is required').not().isEmpty(),
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  register
);

router.get('/verify-email/:token', verifyEmail);

router.post(
  '/login',
  [
    body('email', 'Please include a valid email').isEmail(),
    body('password', 'Password is required').exists()
  ],
  login
);

router.post(
  '/forgotpassword',
  [
    body('email', 'Please include a valid email').isEmail()
  ],
  forgotPassword
);

router.put(
  '/resetpassword/:resettoken',
  [
    body('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  resetPassword
);

// Protected routes (require authentication)
router.use(authenticate);

// All routes below this middleware require authentication
router.get('/me', getMe);
router.put('/updatedetails', updateDetails);
router.put('/updatepassword', updatePassword);

// Admin only routes
router.use(authorize('admin'));
// Add admin-only routes here

module.exports = router;
