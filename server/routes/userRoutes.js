const express = require('express');
const userController = require('../controllers/userController.js');
const { authenticate, authorize } = require('../middleware/auth');

const router = express.Router();

// Protect all routes after this middleware
router.use(authenticate);

// User profile routes
router.get('/me', userController.getMe, userController.getUser);
router.patch('/update-me', userController.updateMe);
router.delete('/delete-me', userController.deleteMe);

// Admin-only routes
router.use(authorize('admin'));
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
