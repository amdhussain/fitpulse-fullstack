const AppError = require('../errors/AppError');
const apiResponse = require('./apiResponse');

module.exports = {
  AppError,
  ...apiResponse,
};
