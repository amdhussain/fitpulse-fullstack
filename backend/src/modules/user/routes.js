const userController = require('./controller');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const userValidation = require('./validation');

function userRoutes(router) {
  // Profile routes (any authenticated user)
  router.get('/me', protect, userController.getMyProfile);
  router.put('/me', protect, userValidation.updateProfile, userController.updateMyProfile);
  router.put('/me/password', protect, userValidation.changePassword, userController.changePassword);
  router.put('/me/image', protect, userValidation.updateProfileImage, userController.updateProfileImage);
  router.delete('/me', protect, userController.deleteMyAccount);

  // Admin settings routes (admin only)
  router.put('/admin/settings', protect, authorize('ADMIN'), userValidation.updateAdminProfile, userController.updateAdminProfile);
  router.put('/admin/email', protect, authorize('ADMIN'), userValidation.updateAdminEmail, userController.updateAdminEmail);
  router.put('/admin/password', protect, authorize('ADMIN'), userValidation.changeAdminPassword, userController.changeAdminPassword);

  // Admin user management routes
  router.get('/', protect, authorize('ADMIN'), userValidation.getAllUsers, userController.getAllUsers);
  router.get('/:id', protect, authorize('ADMIN'), userValidation.idParam, userController.getUserById);
  router.put('/:id/role', protect, authorize('ADMIN'), userValidation.idParam, userValidation.updateRole, userController.updateUserRole);
  router.patch('/:id/block', protect, authorize('ADMIN'), userValidation.idParam, userController.blockUser);
  router.patch('/:id/unblock', protect, authorize('ADMIN'), userValidation.idParam, userController.unblockUser);
  router.delete('/:id', protect, authorize('ADMIN'), userValidation.idParam, userController.deleteUser);
}

module.exports = userRoutes;
