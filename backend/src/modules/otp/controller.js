const otpService = require('../../services/otpService');
const bookingService = require('../booking/service');
const paymentService = require('../payment/service');
const notificationService = require('../../services/notificationService');
const { successResponse, updatedResponse } = require('../../helpers/apiResponse');
const asyncHandler = require('../../middlewares/asyncHandler');
const { UnauthorizedError, NotFoundError, BadRequestError } = require('../../errors');
const logger = require('../../utils/logger');

const sendOtp = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { bookingId } = req.body;

  const booking = await bookingService.getBookingDetails(req.user.id, bookingId);

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.paymentStatus !== 'PENDING_VERIFICATION') {
    throw new BadRequestError('Booking is not awaiting OTP verification');
  }

  const otp = await otpService.create({
    userId: req.user.id,
    purpose: 'BOOKING_VERIFICATION',
    metadata: { bookingId },
    email: booking.user?.email || req.user.email,
    userName: booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'User',
  });

  const userName = booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'User';

  notificationService.create({
    type: 'booking',
    title: 'Booking Verification OTP',
    message: `Your OTP for booking verification is: ${otp.code}. This code expires in ${otp.expiresInMinutes} minutes.`,
    relatedId: bookingId,
    metadata: { userId: req.user.id, code: otp.code },
    userId: req.user.id,
  }).catch(() => {});

  logger.info('OTP sent for booking verification', {
    userId: req.user.id,
    bookingId,
    email: booking.user?.email,
    otp: otp.code,
  });

  return successResponse(res, {
    message: 'OTP sent to your email',
    expiresInMinutes: otp.expiresInMinutes,
    hint: process.env.NODE_ENV !== 'production' ? `OTP: ${otp.code}` : undefined,
  }, 'OTP sent successfully');
});

const verifyOtp = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { bookingId, code } = req.body;

  const booking = await bookingService.getBookingDetails(req.user.id, bookingId);

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.paymentStatus !== 'PENDING_VERIFICATION') {
    throw new BadRequestError('Booking is not awaiting OTP verification');
  }

  const result = await otpService.verify({
    userId: req.user.id,
    purpose: 'BOOKING_VERIFICATION',
    code,
  });

  if (!result.success) {
    throw new BadRequestError(result.message);
  }

  await bookingService.updateBookingStatus(bookingId, 'CONFIRMED');
  await bookingService.updateBookingPaymentStatus(req.user.id, bookingId, {
    paymentStatus: 'CONFIRMED',
  });

  const existingPayment = await paymentService.findByBookingId(bookingId);
  if (existingPayment && existingPayment.status === 'PENDING') {
    await paymentService.updatePaymentStatus(existingPayment.id, 'PAID');
  }

  const updatedBooking = await bookingService.getBookingDetails(req.user.id, bookingId);

  notificationService.create({
    type: 'booking',
    title: 'Booking Confirmed',
    message: `Your booking has been confirmed after OTP verification.`,
    relatedId: bookingId,
    metadata: { userId: req.user.id },
    userId: req.user.id,
  }).catch(() => {});

  return updatedResponse(res, updatedBooking, 'Booking confirmed successfully');
});

const sendBookingRequestOtp = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { bookingId } = req.body;

  const booking = await bookingService.getBookingDetails(req.user.id, bookingId);

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.status !== 'PENDING') {
    throw new BadRequestError('Booking is not awaiting verification');
  }

  const otp = await otpService.create({
    userId: req.user.id,
    purpose: 'BOOKING_REQUEST_VERIFICATION',
    metadata: { bookingId },
    email: booking.user?.email || req.user.email,
    userName: booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'User',
  });

  const userName = booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'User';

  notificationService.create({
    type: 'booking',
    title: 'Booking Verification OTP',
    message: `Your OTP for booking verification is: ${otp.code}. This code expires in ${otp.expiresInMinutes} minutes.`,
    relatedId: bookingId,
    metadata: { userId: req.user.id, code: otp.code },
    userId: req.user.id,
  }).catch(() => {});

  logger.info('OTP sent for booking request verification', {
    userId: req.user.id,
    bookingId,
    email: booking.user?.email,
    otp: otp.code,
  });

  return successResponse(res, {
    message: 'OTP sent to your email',
    expiresInMinutes: otp.expiresInMinutes,
    hint: process.env.NODE_ENV !== 'production' ? otp.code : undefined,
  }, 'OTP sent successfully');
});

const verifyBookingRequestOtp = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }

  const { bookingId, code } = req.body;

  const booking = await bookingService.getBookingDetails(req.user.id, bookingId);

  if (!booking) {
    throw new NotFoundError('Booking not found');
  }

  if (booking.status !== 'PENDING') {
    throw new BadRequestError('Booking is not awaiting verification');
  }

  const result = await otpService.verify({
    userId: req.user.id,
    purpose: 'BOOKING_REQUEST_VERIFICATION',
    code,
  });

  if (!result.success) {
    throw new BadRequestError(result.message);
  }

  await bookingService.updateBookingStatus(bookingId, 'CONFIRMED');

  const updatedBooking = await bookingService.getBookingDetails(req.user.id, bookingId);

  notificationService.create({
    type: 'booking',
    title: 'Booking Confirmed',
    message: `Your booking has been confirmed after OTP verification.`,
    relatedId: bookingId,
    metadata: { userId: req.user.id },
    userId: req.user.id,
  }).catch(() => {});

  return updatedResponse(res, updatedBooking, 'Booking confirmed successfully');
});

module.exports = {
  sendOtp,
  verifyOtp,
  sendBookingRequestOtp,
  verifyBookingRequestOtp,
};
