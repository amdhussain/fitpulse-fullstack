const apiResponse = require('./apiResponse');
const logger = require('./logger');
const { extractPagination } = require('./pagination');

module.exports = {
  ...apiResponse,
  ...logger,
  apiResponse,
  extractPagination,
};
