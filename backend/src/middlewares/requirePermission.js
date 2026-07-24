const { ForbiddenError } = require('../errors');
const { hasPermission } = require('../config/permissions');
const asyncHandler = require('./asyncHandler');

/**
 * Middleware factory that checks the authenticated user's role against
 * one or more required permissions.
 *
 * Must be placed **after** `protect` (or `verifyToken`) so that `req.user`
 * is populated.
 *
 * Usage:
 *   router.get('/admin/users', protect, requirePermission('users.read'), handler);
 *   router.post('/classes', protect, requirePermission('classes.create', 'classes.update'), handler);
 *
 * @param  {...string} permissions  One or more permission strings (OR logic).
 * @returns {Function} Express middleware
 */
function requirePermission(...permissions) {
  return asyncHandler(async (req, _res, next) => {
    if (!req.user) {
      throw new ForbiddenError('Authentication required');
    }

    const userRole = req.user.role;

    const granted = permissions.some((perm) => hasPermission(userRole, perm));

    if (!granted) {
      throw new ForbiddenError(
        `You do not have permission to perform this action. Required: ${permissions.join(' or ')}`
      );
    }

    next();
  });
}

module.exports = requirePermission;
