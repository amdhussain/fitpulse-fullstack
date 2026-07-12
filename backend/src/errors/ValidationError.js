const AppError = require('./AppError');

class ValidationError extends AppError {
  constructor(errors = [], message = 'Validation failed') {
    super(message, 422, errors);
    this.name = 'ValidationError';
  }
}

module.exports = ValidationError;
