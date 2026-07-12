const { PAGINATION, SORT_ORDER } = require('../config/constants');

function extractPagination(query) {
  const page = Math.max(1, parseInt(query.page, 10) || PAGINATION.DEFAULT_PAGE);
  const limit = Math.min(
    PAGINATION.MAX_LIMIT,
    Math.max(1, parseInt(query.limit, 10) || PAGINATION.DEFAULT_LIMIT)
  );
  const offset = (page - 1) * limit;
  const sortBy = query.sortBy || 'created_at';
  const sortOrder = Object.values(SORT_ORDER).includes(query.sortOrder?.toUpperCase())
    ? query.sortOrder.toUpperCase()
    : SORT_ORDER.DESC;

  return { page, limit, offset, sortBy, sortOrder };
}

module.exports = { extractPagination };
