const authController = require('./controller');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const authValidation = require('./validation');

function authRoutes(router) {
  router.post('/register', authValidation.register, authController.register);
  router.post('/login', authValidation.login, authController.login);
  router.post('/logout', protect, authController.logout);
  router.get('/me', protect, authController.getMe);
}

module.exports = authRoutes;
