const { validateRequest, validateParams } = require('../../validators/middlewares');
const { body } = require('express-validator');

const sendOtp = validateRequest([
  body('bookingId')
    .trim()
    .notEmpty().withMessage('Booking ID is required'),
]);

const verifyOtp = validateRequest([
  body('bookingId')
    .trim()
    .notEmpty().withMessage('Booking ID is required'),
  body('code')
    .trim()
    .notEmpty().withMessage('OTP code is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
    .isNumeric().withMessage('OTP must be numeric'),
]);

const sendBookingRequestOtp = validateRequest([
  body('bookingId')
    .trim()
    .notEmpty().withMessage('Booking ID is required'),
]);

const verifyBookingRequestOtp = validateRequest([
  body('bookingId')
    .trim()
    .notEmpty().withMessage('Booking ID is required'),
  body('code')
    .trim()
    .notEmpty().withMessage('OTP code is required')
    .isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
    .isNumeric().withMessage('OTP must be numeric'),
]);

module.exports = {
  sendOtp,
  verifyOtp,
  sendBookingRequestOtp,
  verifyBookingRequestOtp,
};
