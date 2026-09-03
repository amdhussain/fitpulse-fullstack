const bookingService = require('./service');
const paymentService = require('../payment/service');
const otpService = require('../../services/otpService');
const notificationService = require('../../services/notificationService');
const { successResponse, createdResponse, updatedResponse, deletedResponse, paginatedResponse } = require('../../helpers/apiResponse');
const asyncHandler = require('../../middlewares/asyncHandler');
const { UnauthorizedError, NotFoundError } = require('../../errors');

// ─── Member APIs ──────────────────────────────────────────

const bookClass = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const { classId, bookingDate, bookingTime, notes, paymentMethod, paymentOption } = req.body;
  const booking = await bookingService.bookClass(req.user.id, { classId, bookingDate, bookingTime, notes, paymentMethod, paymentOption });
  return createdResponse(res, booking, 'Class booked successfully');
});

const bookTrainer = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const { trainerId, bookingDate, bookingTime, sessionType, notes, paymentMethod, paymentOption } = req.body;
  const booking = await bookingService.bookTrainer(req.user.id, { trainerId, bookingDate, bookingTime, sessionType, notes, paymentMethod, paymentOption });
  return createdResponse(res, booking, 'Trainer booked successfully');
});

const cancelBooking = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const { cancelReason } = req.body;
  const booking = await bookingService.cancelBooking(req.user.id, req.params.id, cancelReason);
  return updatedResponse(res, booking, 'Booking cancelled successfully');
});

const getMyBookings = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const { page = 1, limit = 10, search, status, sortBy, sortOrder } = req.query;
  const result = await bookingService.getMyBookings(req.user.id, {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
    status,
    sortBy,
    sortOrder,
  });
  return paginatedResponse(res, result);
});

const getBookingDetails = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const booking = await bookingService.getBookingDetails(req.user.id, req.params.id);
  return successResponse(res, booking, 'Booking retrieved successfully');
});

const memberUpdateBooking = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const { bookingDate, bookingTime, sessionType, notes } = req.body;
  const booking = await bookingService.memberUpdateBooking(req.user.id, req.params.id, { bookingDate, bookingTime, sessionType, notes });
  return updatedResponse(res, booking, 'Booking updated successfully');
});

// ─── Trainer APIs ─────────────────────────────────────────

const getBookingsForMyClasses = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const { page = 1, limit = 10, search, status, classId, sortBy, sortOrder } = req.query;

  const result = await bookingService.getBookingsForMyClasses(req.user.id, {
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
    status,
    classId,
    sortBy,
    sortOrder,
  });

  return paginatedResponse(res, result);
});

const approveBooking = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const booking = await bookingService.approveBooking(req.user.id, req.params.id);

  return updatedResponse(res, booking, 'Booking approved successfully');
});

const rejectBooking = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const booking = await bookingService.rejectBooking(req.user.id, req.params.id);

  return updatedResponse(res, booking, 'Booking rejected successfully');
});

const markAttendance = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const { attended } = req.body;

  const booking = await bookingService.markAttendance(req.user.id, req.params.id, attended);

  return updatedResponse(res, booking, 'Attendance updated successfully');
});

const verifyPayment = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const bookingId = req.params.id;
  const { status } = req.body;

  const existingPayment = await paymentService.findByBookingId(bookingId);
  if (!existingPayment) {
    throw new NotFoundError('Payment not found for this booking');
  }

  const paymentStatus = status === 'VERIFIED' ? 'PAID' : status;
  const payment = await paymentService.updatePaymentStatus(existingPayment.id, paymentStatus);

  if (paymentStatus === 'PAID') {
    await bookingService.updateBookingStatus(bookingId, 'CONFIRMED');
  }

  return updatedResponse(res, payment, 'Payment verified successfully');
});

const rejectPayment = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const bookingId = req.params.id;

  const existingPayment = await paymentService.findByBookingId(bookingId);
  if (!existingPayment) {
    throw new NotFoundError('Payment not found for this booking');
  }

  await paymentService.updatePaymentStatus(existingPayment.id, 'FAILED');
  await bookingService.updateBookingStatus(bookingId, 'CANCELLED');

  return updatedResponse(res, { status: 'FAILED' }, 'Payment rejected successfully');
});

const submitPayment = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const { transactionId, paymentMethod, paymentOption } = req.body;
  const bookingId = req.params.id;

  const booking = await bookingService.getBookingDetails(req.user.id, bookingId);

  await bookingService.updateBookingPaymentStatus(req.user.id, bookingId, {
    transactionId,
    paymentMethod,
    paymentStatus: 'PENDING_VERIFICATION',
  });

  const existingPayment = await paymentService.findByBookingId(bookingId);

  let totalAmount = 0;
  if (booking.class && booking.class.price) {
    totalAmount = booking.class.price;
  } else if (booking.trainer && booking.trainer.hourlyRate) {
    totalAmount = booking.trainer.hourlyRate;
  } else if (existingPayment && existingPayment.amount) {
    totalAmount = existingPayment.amount;
  }

  const option = paymentOption || booking.paymentOption || 'FULL';
  const amount = option === 'HALF' ? totalAmount / 2 : totalAmount;

  let payment;
  if (existingPayment) {
    await paymentService.updatePaymentStatus(existingPayment.id, 'PENDING');
    payment = await paymentService.updatePayment(existingPayment.id, {
      amount,
      paymentMethod,
      notes: `Payment via ${paymentMethod} (${option} - ${option === 'HALF' ? '50% advance' : 'full amount'})`,
    });
  } else {
    payment = await paymentService.createPayment({
      bookingId,
      userId: req.user.id,
      amount,
      currency: 'BDT',
      paymentMethod,
      notes: `Payment via ${paymentMethod} (${option} - ${option === 'HALF' ? '50% advance' : 'full amount'})`,
    });
  }

  const serviceName = booking.class?.name || booking.trainer?.specialization || 'Session';
  const userName = booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : `User ${req.user.id}`;

  notificationService.paymentVerificationRequired(
    bookingId,
    userName,
    booking.user?.email || '',
    serviceName,
    payment.amount,
    paymentMethod,
    transactionId
  ).catch(() => {});

  const otp = await otpService.create({
    userId: req.user.id,
    purpose: 'BOOKING_VERIFICATION',
    metadata: { bookingId },
    email: booking.user?.email || req.user.email,
    userName: booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'User',
  });

  notificationService.create({
    type: 'booking',
    title: 'Booking Verification OTP',
    message: `Your OTP for booking verification is: ${otp.code}. This code expires in ${otp.expiresInMinutes} minutes.`,
    relatedId: bookingId,
    metadata: { userId: req.user.id, code: otp.code },
    userId: req.user.id,
  }).catch(() => {});

  return updatedResponse(res, {
    booking,
    payment: { ...payment, totalAmount, paymentOption: option, dueNow: amount, remaining: option === 'HALF' ? totalAmount / 2 : 0 },
    otpHint: process.env.NODE_ENV !== 'production' ? otp.code : undefined,
    otpExpiresInMinutes: otp.expiresInMinutes,
  }, 'Payment submitted. OTP sent for verification.');
});

const mockPayment = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const { paymentOption } = req.body;
  const bookingId = req.params.id;

  const booking = await bookingService.getBookingDetails(req.user.id, bookingId);

  const existingPayment = await paymentService.findByBookingId(bookingId);

  let totalAmount = 0;
  if (booking.class && booking.class.price) {
    totalAmount = booking.class.price;
  } else if (booking.trainer && booking.trainer.hourlyRate) {
    totalAmount = booking.trainer.hourlyRate;
  } else if (existingPayment && existingPayment.amount) {
    totalAmount = existingPayment.amount;
  }

  const option = paymentOption || booking.paymentOption || 'FULL';
  const amount = option === 'HALF' ? totalAmount / 2 : totalAmount;
  const mockTransactionId = `TEST-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

  let payment;
  if (existingPayment) {
    payment = await paymentService.updatePayment(existingPayment.id, {
      amount,
      paymentMethod: 'TEST_PAYMENT',
      transactionId: mockTransactionId,
      notes: `Test Payment (${option} - ${option === 'HALF' ? '50% advance' : 'full amount'}) [DEV MODE]`,
      status: 'PENDING',
    });
  } else {
    payment = await paymentService.createPayment({
      bookingId,
      userId: req.user.id,
      amount,
      currency: 'BDT',
      paymentMethod: 'TEST_PAYMENT',
      transactionId: mockTransactionId,
      notes: `Test Payment (${option} - ${option === 'HALF' ? '50% advance' : 'full amount'}) [DEV MODE]`,
    });
  }

  await bookingService.updateBookingPaymentStatus(req.user.id, bookingId, {
    transactionId: mockTransactionId,
    paymentMethod: 'TEST_PAYMENT',
    paymentStatus: 'PENDING_VERIFICATION',
  });

  const otp = await otpService.create({
    userId: req.user.id,
    purpose: 'BOOKING_VERIFICATION',
    metadata: { bookingId },
    email: booking.user?.email || req.user.email,
    userName: booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'User',
  });

  notificationService.create({
    type: 'booking',
    title: 'Test Payment Received - OTP Verification Required',
    message: `Test payment received. Please verify OTP to confirm booking. OTP: ${otp.code}`,
    relatedId: bookingId,
    metadata: { userId: req.user.id, code: otp.code },
    userId: req.user.id,
  }).catch(() => {});

  return updatedResponse(res, {
    booking,
    payment: { ...payment, totalAmount, paymentOption: option, dueNow: amount, remaining: option === 'HALF' ? totalAmount / 2 : 0 },
    otpHint: process.env.NODE_ENV !== 'production' ? otp.code : undefined,
    otpExpiresInMinutes: otp.expiresInMinutes,
  }, 'Test payment successful. Please verify OTP to confirm booking.');
});

// ─── Admin APIs ───────────────────────────────────────────

const getAllBookings = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const { page = 1, limit = 10, search, status, userId, classId, trainerId, sortBy, sortOrder } = req.query;

  const result = await bookingService.getAllBookings({
    page: parseInt(page, 10) || 1,
    limit: parseInt(limit, 10) || 10,
    search,
    status,
    userId,
    classId,
    trainerId,
    sortBy,
    sortOrder,
  });

  return paginatedResponse(res, result);
});

const updateBookingStatus = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const { status } = req.body;
  const booking = await bookingService.updateBookingStatus(req.params.id, status);
  return updatedResponse(res, booking, 'Booking status updated successfully');
});

const updateBooking = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const { bookingDate, bookingTime, sessionType, notes, trainerId, status } = req.body;
  const booking = await bookingService.updateBooking(req.params.id, { bookingDate, bookingTime, sessionType, notes, trainerId, status });
  return updatedResponse(res, booking, 'Booking updated successfully');
});

const deleteBooking = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const result = await bookingService.deleteBooking(req.params.id);
  return deletedResponse(res, result.message);
});

module.exports = {
  bookClass,
  bookTrainer,
  cancelBooking,
  getMyBookings,
  getBookingDetails,
  memberUpdateBooking,
  getBookingsForMyClasses,
  approveBooking,
  rejectBooking,
  markAttendance,
  getAllBookings,
  updateBookingStatus,
  updateBooking,
  deleteBooking,
  verifyPayment,
  rejectPayment,
  submitPayment,
  mockPayment,
};
