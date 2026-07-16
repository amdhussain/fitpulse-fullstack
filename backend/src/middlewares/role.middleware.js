const { ForbiddenError } = require('../errors');

// ─── Role Middleware ────────────────────────────────────────
// Restricts route access to specific user roles.
// Must be used AFTER the `protect` middleware.
//
// Usage:
//   router.get('/admin', protect, authorize('ADMIN'), handler);
//   router.post('/trainers', protect, authorize('ADMIN', 'TRAINER'), handler);
// ───────────────────────────────────────────────────────────

function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      throw new ForbiddenError('You must be logged in to access this resource.');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        `Role '${req.user.role}' is not authorized to access this resource.`
      );
    }

    next();
  };
}

module.exports = authorize;
