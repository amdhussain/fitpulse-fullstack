const { validateRequest } = require('./middlewares');
const rules = require('./helpers/rules.helper');

// ─── Dashboard Validators ──────────────────────────────────
// Validation rules for dashboard analytics endpoints.
// All routes are admin-only and read-only (GET).

const dateRange = [
  rules.queryDateRange('startDate', 'endDate'),
];

const bookingStats = [
  rules.queryDateRange('startDate', 'endDate'),
  rules.queryEnum('status', ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
];

const revenue = [
  rules.queryDateRange('startDate', 'endDate'),
];

const activity = [
  rules.queryDateRange('startDate', 'endDate'),
  rules.page(),
  rules.limit(),
];

module.exports = {
  dateRange: validateRequest(dateRange),
  bookingStats: validateRequest(bookingStats),
  revenue: validateRequest(revenue),
  activity: validateRequest(activity),
};
