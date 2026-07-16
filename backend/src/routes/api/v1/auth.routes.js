const authController = require('../../../controllers/auth.controller');
const protect = require('../../../middlewares/auth.middleware');
const authValidator = require('../../../validators/auth.validator');

// ─── Auth Routes ───────────────────────────────────────────

function authRoutes(router) {
  router.post('/auth/register', authValidator.register, authController.register);
  router.post('/auth/login', authValidator.login, authController.login);
  router.post('/auth/logout', protect, authController.logout);
  router.get('/auth/me', protect, authController.getMe);
}

module.exports = authRoutes;
