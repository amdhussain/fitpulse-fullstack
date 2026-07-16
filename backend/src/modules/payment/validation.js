const { validateRequest, validateParams, validateQuery } = require('../../validators/middlewares');
const rules = require('../../validators/helpers/rules.helper');
const { body } = require('express-validator');

// ─── Admin: Create Payment ────────────────────────────────

const createPayment = validateRequest([
  body('bookingId')
    .trim()
    .notEmpty().withMessage('Booking ID is required'),
  body('userId')
    .trim()
    .notEmpty().withMessage('User ID is required'),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  rules.optionalText('currency', { max: 3 }),
  rules.optionalText('paymentMethod', { max: 50 }),
  rules.optionalText('notes', { max: 1000 }),
]);

// ─── Admin: Update Payment Status ─────────────────────────

const updatePaymentStatus = validateRequest([
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['PENDING', 'PAID', 'FAILED', 'REFUNDED'])
    .withMessage('Status must be PENDING, PAID, FAILED, or REFUNDED'),
]);

// ─── Query / Params ───────────────────────────────────────

const getMyPayments = validateQuery([
  rules.page(),
  rules.limit(),
  rules.sort(['createdAt', 'amount', 'status']),
  rules.queryText('search'),
  rules.queryEnum('status', ['PENDING', 'PAID', 'FAILED', 'REFUNDED']),
]);

const getAllPayments = validateQuery([
  rules.page(),
  rules.limit(),
  rules.sort(['createdAt', 'amount', 'status', 'userId']),
  rules.queryText('search'),
  rules.queryEnum('status', ['PENDING', 'PAID', 'FAILED', 'REFUNDED']),
  rules.queryText('userId'),
  rules.queryText('bookingId'),
]);

const getRevenueStats = validateQuery([
  rules.queryText('startDate'),
  rules.queryText('endDate'),
]);

const getRevenueByMethod = validateQuery([
  rules.queryText('startDate'),
  rules.queryText('endDate'),
]);

const getDailyRevenue = validateQuery([
  rules.queryText('startDate'),
  rules.queryText('endDate'),
]);

const idParam = validateParams({ id: 'string' });

module.exports = {
  createPayment,
  updatePaymentStatus,
  getMyPayments,
  getAllPayments,
  getRevenueStats,
  getRevenueByMethod,
  getDailyRevenue,
  idParam,
};
