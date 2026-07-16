const paymentController = require('./controller');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const paymentValidation = require('./validation');

function paymentRoutes(router) {
  // ─── Member Routes ─────────────────────────────────────
  router.get('/me', protect, authorize('MEMBER'), paymentValidation.getMyPayments, paymentController.getMyPayments);
  router.get('/me/:id', protect, authorize('MEMBER'), paymentValidation.idParam, paymentController.getPaymentDetails);

  // ─── Admin Routes ──────────────────────────────────────
  router.get('/', protect, authorize('ADMIN'), paymentValidation.getAllPayments, paymentController.getAllPayments);
  router.get('/revenue/stats', protect, authorize('ADMIN'), paymentValidation.getRevenueStats, paymentController.getRevenueStats);
  router.get('/revenue/method', protect, authorize('ADMIN'), paymentValidation.getRevenueByMethod, paymentController.getRevenueByMethod);
  router.get('/revenue/daily', protect, authorize('ADMIN'), paymentValidation.getDailyRevenue, paymentController.getDailyRevenue);
  router.get('/:id', protect, authorize('ADMIN'), paymentValidation.idParam, paymentController.getPaymentById);
  router.post('/', protect, authorize('ADMIN'), paymentValidation.createPayment, paymentController.createPayment);
  router.patch('/:id/status', protect, authorize('ADMIN'), paymentValidation.idParam, paymentValidation.updatePaymentStatus, paymentController.updatePaymentStatus);
  router.patch('/:id/process', protect, authorize('ADMIN'), paymentValidation.idParam, paymentController.processPayment);
  router.patch('/:id/refund', protect, authorize('ADMIN'), paymentValidation.idParam, paymentController.refundPayment);
  router.delete('/:id', protect, authorize('ADMIN'), paymentValidation.idParam, paymentController.deletePayment);
}

module.exports = paymentRoutes;
