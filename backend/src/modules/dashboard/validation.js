const { validateQuery } = require('../../validators/middlewares');
const rules = require('../../validators/helpers/rules.helper');

// ─── Date Range Queries ──────────────────────────────────

const dateRangeQuery = validateQuery([
  rules.queryText('startDate'),
  rules.queryText('endDate'),
]);

const dateRangeWithLimit = validateQuery([
  rules.queryText('startDate'),
  rules.queryText('endDate'),
  rules.queryText('limit'),
  rules.queryText('months'),
]);

const limitQuery = validateQuery([
  rules.queryText('limit'),
]);

const analyticsQuery = validateQuery([
  rules.queryText('startDate'),
  rules.queryText('endDate'),
  rules.queryText('limit'),
  rules.queryText('months'),
]);

module.exports = {
  dateRangeQuery,
  dateRangeWithLimit,
  limitQuery,
  analyticsQuery,
};
