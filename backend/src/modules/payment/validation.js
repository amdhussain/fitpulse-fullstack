const { validateRequest, validateParams, validateQuery } = require('../../validators/middlewares');
const rules = require('../../validators/helpers/rules.helper');
const { body } = require('express-validator');

// ─── Admin: Create Payment (supports offline/cash) ───────

const createPayment = validateRequest([
  body('userId')
    .trim()
    .notEmpty().withMessage('User ID is required'),
  body('amount')
    .notEmpty().withMessage('Amount is required')
    .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('bookingId')
    .optional()
    .trim()
    .isMongoId().withMessage('Booking ID must be a valid Mongo ID'),
  rules.optionalText('currency', { max: 3 }),
  rules.optionalText('paymentMethod', { max: 50 }),
  rules.optionalText('notes', { max: 1000 }),
  rules.optionalText('transactionId', { max: 100 }),
  rules.optionalText('month', { max: 20 }),
]);

// ─── Admin: Update Payment ───────────────────────────────

const updatePayment = validateRequest([
  body('amount')
    .optional()
    .isFloat({ min: 0.01 }).withMessage('Amount must be greater than 0'),
  body('status')
    .optional()
    .trim()
    .isIn(['PENDING', 'PAID', 'FAILED', 'REFUNDED'])
    .withMessage('Status must be PENDING, PAID, FAILED, or REFUNDED'),
  body('bookingId')
    .optional()
    .trim()
    .isMongoId().withMessage('Booking ID must be a valid Mongo ID'),
  rules.optionalText('currency', { max: 3 }),
  rules.optionalText('paymentMethod', { max: 50 }),
  rules.optionalText('notes', { max: 1000 }),
  rules.optionalText('transactionId', { max: 100 }),
  rules.optionalText('month', { max: 20 }),
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
  updatePayment,
  updatePaymentStatus,
  getMyPayments,
  getAllPayments,
  getRevenueStats,
  getRevenueByMethod,
  getDailyRevenue,
  idParam,
};
