const { validateRequest, validateParams } = require('./middlewares');
const rules = require('./helpers/rules.helper');

// ─── Payment Validators ───────────────────────────────────
// Uncomment and wire into routes as the payment module is built.

/*
const createPayment = [
  rules.objectId('bookingId'),
  rules.number('amount', { min: 0 }),
  rules.enumValue('method', ['credit_card', 'debit_card', 'paypal', 'stripe', 'cash']),
];

const processRefund = [
  validateParams({ id: 'mongoId' }),
  rules.number('amount', { min: 0 }),
  rules.text('reason', { min: 10, max: 500 }),
];

const getPayment = [
  validateParams({ id: 'mongoId' }),
];

const listPayments = [
  rules.page(),
  rules.limit(),
  rules.sort(['createdAt', 'amount', 'status']),
  rules.queryEnum('status', ['pending', 'completed', 'failed', 'refunded']),
  rules.queryEnum('method', ['credit_card', 'debit_card', 'paypal', 'stripe', 'cash']),
  rules.queryDateRange('startDate', 'endDate'),
];

const validateWebhook = [
  rules.text('event'),
  rules.objectId('paymentId'),
];
*/

module.exports = {
  // createPayment: validateRequest(createPayment),
  // processRefund: validateRequest(processRefund),
  // getPayment: validateRequest(getPayment),
  // listPayments: validateRequest(listPayments),
  // validateWebhook: validateRequest(validateWebhook),
};
