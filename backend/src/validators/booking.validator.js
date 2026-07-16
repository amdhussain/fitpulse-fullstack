const { validateRequest, validateParams } = require('./middlewares');
const rules = require('./helpers/rules.helper');
const { body } = require('express-validator');
const bookingService = require('../services/booking.service');

// ─── Booking Validators ────────────────────────────────────
// Validation rules for booking CRUD and status endpoints.

const create = [
  body('bookingDate')
    .trim()
    .notEmpty().withMessage('Booking date is required')
    .isISO8601().withMessage('Booking date must be a valid date'),
  body('bookingTime')
    .trim()
    .notEmpty().withMessage('Booking time is required')
    .matches(/^\d{2}:\d{2}$/).withMessage('Booking time must be in HH:MM format'),
  rules.optionalText('serviceId', { max: 191 }),
  rules.optionalText('trainerId', { max: 191 }),
  rules.optionalText('notes', { max: 2000 }),
  body('userId')
    .optional()
    .trim()
    .notEmpty().withMessage('userId cannot be empty'),
];

const update = [
  body('bookingDate')
    .optional()
    .trim()
    .isISO8601().withMessage('Booking date must be a valid date'),
  body('bookingTime')
    .optional()
    .trim()
    .matches(/^\d{2}:\d{2}$/).withMessage('Booking time must be in HH:MM format'),
  rules.optionalText('serviceId', { max: 191 }),
  rules.optionalText('trainerId', { max: 191 }),
  rules.optionalText('notes', { max: 2000 }),
  body('userId')
    .optional()
    .trim()
    .notEmpty().withMessage('userId cannot be empty'),
];

const updateStatus = [
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(bookingService.VALID_STATUSES)
    .withMessage(`Status must be one of: ${bookingService.VALID_STATUSES.join(', ')}`),
];

const cancel = [
  rules.optionalText('cancelReason', { max: 500 }),
];

module.exports = {
  create: validateRequest(create),
  update: validateRequest(update),
  updateStatus: validateRequest(updateStatus),
  cancel: validateRequest(cancel),
  idParam: validateParams({ id: 'string' }),
};
