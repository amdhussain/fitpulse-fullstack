const userController = require('../user/controller');
const userValidation = require('../user/validation');
const verifyToken = require('../../middlewares/verifyToken');
const verifyAdmin = require('../../middlewares/verifyAdmin');
const requirePermission = require('../../middlewares/requirePermission');

function adminRoutes(router) {
  // ─── User Management ────────────────────────────────────
  // All routes use verifyToken + verifyAdmin + granular permissions

  // GET /api/v1/admin/users - Get all users (paginated)
  router.get('/users', verifyToken, verifyAdmin(), requirePermission('users.read'), userValidation.getAllUsers, userController.getAllUsers);

  // GET /api/v1/admin/users/:id - Get user by ID
  router.get('/users/:id', verifyToken, verifyAdmin(), requirePermission('users.read'), userValidation.idParam, userController.getUserById);

  // PUT /api/v1/admin/users/:id/role - Update user role
  router.put('/users/:id/role', verifyToken, verifyAdmin(), requirePermission('users.manage_roles'), userValidation.idParam, userValidation.updateRole, userController.updateUserRole);

  // PATCH /api/v1/admin/users/:id/block - Block user
  router.patch('/users/:id/block', verifyToken, verifyAdmin(), requirePermission('users.block'), userValidation.idParam, userController.blockUser);

  // PATCH /api/v1/admin/users/:id/unblock - Unblock user
  router.patch('/users/:id/unblock', verifyToken, verifyAdmin(), requirePermission('users.block'), userValidation.idParam, userController.unblockUser);

  // DELETE /api/v1/admin/users/:id - Delete user
  router.delete('/users/:id', verifyToken, verifyAdmin(), requirePermission('users.delete'), userValidation.idParam, userController.deleteUser);
}

module.exports = adminRoutes;
