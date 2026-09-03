const otpController = require('./controller');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const otpValidation = require('./validation');

function otpRoutes(router) {
  router.post('/send', protect, authorize('MEMBER'), otpValidation.sendOtp, otpController.sendOtp);
  router.post('/verify', protect, authorize('MEMBER'), otpValidation.verifyOtp, otpController.verifyOtp);
}

module.exports = otpRoutes;
