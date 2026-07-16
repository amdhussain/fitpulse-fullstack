const { validateRequest, validateParams, validateQuery } = require('../../validators/middlewares');
const rules = require('../../validators/helpers/rules.helper');
const { body } = require('express-validator');

// ─── Member: Book Class ───────────────────────────────────

const bookClass = validateRequest([
  body('classId')
    .trim()
    .notEmpty().withMessage('Class ID is required'),
  body('bookingDate')
    .trim()
    .notEmpty().withMessage('Booking date is required')
    .isISO8601().withMessage('Booking date must be a valid date'),
  body('bookingTime')
    .trim()
    .notEmpty().withMessage('Booking time is required')
    .matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage('Booking time must be in HH:MM format'),
  rules.optionalText('notes', { max: 1000 }),
]);

// ─── Member: Cancel Booking ───────────────────────────────

const cancelBooking = validateRequest([
  rules.optionalText('cancelReason', { max: 500 }),
]);

// ─── Trainer: Mark Attendance ─────────────────────────────

const markAttendance = validateRequest([
  body('attended')
    .notEmpty().withMessage('Attended field is required')
    .isBoolean()
    .withMessage('Attended must be a boolean')
    .toBoolean(true),
]);

// ─── Admin: Update Booking Status ─────────────────────────

const updateBookingStatus = validateRequest([
  body('status')
    .trim()
    .notEmpty().withMessage('Status is required')
    .isIn(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'])
    .withMessage('Status must be PENDING, CONFIRMED, CANCELLED, or COMPLETED'),
]);

// ─── Query / Params ───────────────────────────────────────

const getMyBookings = validateQuery([
  rules.page(),
  rules.limit(),
  rules.sort(['createdAt', 'bookingDate', 'status']),
  rules.queryText('search'),
  rules.queryEnum('status', ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
]);

const getBookingsForMyClasses = validateQuery([
  rules.page(),
  rules.limit(),
  rules.sort(['createdAt', 'bookingDate', 'status']),
  rules.queryText('search'),
  rules.queryEnum('status', ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
  rules.queryText('classId'),
]);

const getAllBookings = validateQuery([
  rules.page(),
  rules.limit(),
  rules.sort(['createdAt', 'bookingDate', 'status', 'userId']),
  rules.queryText('search'),
  rules.queryEnum('status', ['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED']),
  rules.queryText('userId'),
  rules.queryText('classId'),
  rules.queryText('trainerId'),
]);

const idParam = validateParams({ id: 'string' });

module.exports = {
  bookClass,
  cancelBooking,
  markAttendance,
  updateBookingStatus,
  getMyBookings,
  getBookingsForMyClasses,
  getAllBookings,
  idParam,
};
