const paymentMethodController = require('./controller');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const paymentMethodValidation = require('./validation');

function paymentMethodRoutes(router) {
  // ─── Public Routes ─────────────────────────────────────
  router.get('/', paymentMethodValidation.getAllPaymentMethods, paymentMethodController.getAllPaymentMethods);
  router.get('/stats', protect, authorize('ADMIN'), paymentMethodController.getPaymentMethodStats);
  router.get('/:id', paymentMethodValidation.idParam, paymentMethodController.getPaymentMethodById);

  // ─── Admin Routes ──────────────────────────────────────
  router.post('/', protect, authorize('ADMIN'), paymentMethodValidation.createPaymentMethod, paymentMethodController.createPaymentMethod);
  router.put('/:id', protect, authorize('ADMIN'), paymentMethodValidation.idParam, paymentMethodValidation.updatePaymentMethod, paymentMethodController.updatePaymentMethod);
  router.delete('/:id', protect, authorize('ADMIN'), paymentMethodValidation.idParam, paymentMethodController.deletePaymentMethod);
}

module.exports = paymentMethodRoutes;
