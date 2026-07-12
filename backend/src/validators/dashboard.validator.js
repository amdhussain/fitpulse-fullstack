const { validateRequest, validateParams } = require('./middlewares');
const rules = require('./helpers/rules.helper');

// ─── Dashboard Validators ─────────────────────────────────
// Uncomment and wire into routes as the dashboard module is built.

/*
const getStats = [
  rules.queryDateRange('startDate', 'endDate'),
];

const getRevenue = [
  rules.queryDateRange('startDate', 'endDate'),
  rules.queryEnum('interval', ['daily', 'weekly', 'monthly', 'yearly']),
];

const getBookings = [
  rules.queryDateRange('startDate', 'endDate'),
  rules.queryEnum('status', ['pending', 'confirmed', 'cancelled']),
];

const getUserActivity = [
  rules.queryDateRange('startDate', 'endDate'),
  rules.page(),
  rules.limit(),
];

const getTrainerPerformance = [
  validateParams({ id: 'mongoId' }),
  rules.queryDateRange('startDate', 'endDate'),
];

const exportReport = [
  rules.enumValue('type', ['revenue', 'bookings', 'users', 'trainers']),
  rules.queryDateRange('startDate', 'endDate'),
  rules.enumValue('format', ['csv', 'pdf']),
];
*/

module.exports = {
  // getStats: validateRequest(getStats),
  // getRevenue: validateRequest(getRevenue),
  // getBookings: validateRequest(getBookings),
  // getUserActivity: validateRequest(getUserActivity),
  // getTrainerPerformance: validateRequest(getTrainerPerformance),
  // exportReport: validateRequest(exportReport),
};
