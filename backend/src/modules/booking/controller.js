const bookingService = require('./service');
const { successResponse, createdResponse, updatedResponse, deletedResponse, paginatedResponse } = require('../../helpers/apiResponse');
const asyncHandler = require('../../middlewares/asyncHandler');
const { UnauthorizedError } = require('../../errors');

// ─── Member APIs ──────────────────────────────────────────

const bookClass = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const { classId, bookingDate, bookingTime, notes, paymentMethod } = req.body;
  const booking = await bookingService.bookClass(req.user.id, { classId, bookingDate, bookingTime, notes, paymentMethod });
  return createdResponse(res, booking, 'Class booked successfully');
});

const bookTrainer = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const { trainerId, bookingDate, bookingTime, sessionType, notes, paymentMethod } = req.body;
  const booking = await bookingService.bookTrainer(req.user.id, { trainerId, bookingDate, bookingTime, sessionType, notes, paymentMethod });
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
  const { status, notes } = req.body;

  // Find payment associated with this booking
  const existingPayment = await paymentService.findByBookingId(bookingId);

  if (!existingPayment) {
    throw new NotFoundError('Payment not found for this booking');
  }

  const payment = await paymentService.updatePaymentStatus(existingPayment.id, status);

  // If payment is verified/paid, also confirm the linked booking
  if (status === 'PAID' || status === 'VERIFIED') {
    if (payment && payment.bookingId) {
      await bookingService.updateBookingStatus(payment.bookingId, 'CONFIRMED');
    }
  }

  return updatedResponse(res, payment, 'Payment ' + status + ' successfully');
});

const rejectPayment = asyncHandler(async (req, res) => {
  const bookingId = req.params.id;
  const { status, notes } = req.body;

  // Find payment associated with this booking
  const existingPayment = await paymentService.findByBookingId(bookingId);

  if (!existingPayment) {
    throw new NotFoundError('Payment not found for this booking');
  }

  // Update payment status
  await paymentService.updatePaymentStatus(existingPayment.id, status || 'REJECTED');

  // Also update the linked booking status
  const payment = await paymentService.getPaymentById(existingPayment.id);
  if (payment && payment.bookingId) {
    await bookingService.updateBookingStatus(payment.bookingId, 'REJECTED');
  }

  return updatedResponse(res, { status: status || 'REJECTED' }, 'Payment rejected successfully');
});

const submitPayment = asyncHandler(async (req, res) => {
  if (!req.user || !req.user.id) {
    throw new UnauthorizedError('User not authenticated');
  }
  const { transactionId, paymentMethod } = req.body;
  const bookingId = req.params.id;

  // Check if a payment already exists for this booking
  const existingPayment = await paymentService.findByBookingId(bookingId);

  // Update the booking payment status
  const booking = await bookingService.updateBookingPaymentStatus(req.user.id, bookingId, {
    transactionId,
    paymentMethod,
    paymentStatus: 'PENDING_VERIFICATION',
  });

  // Create or update payment record - reuse existing if it exists
  let payment;
  if (existingPayment) {
    // Update existing payment record
    payment = await paymentService.update(existingPayment.id, {
      transactionId,
      paymentMethod,
      paymentStatus: 'PENDING_VERIFICATION',
      notes: 'User submitted transaction ID for verification',
    });
  } else {
    // Get booking details to find the associated class/trainer amount
    const bookingDetails = await bookingService.getBookingDetails(req.user.id, bookingId);
    const cls = bookingDetails.class;
    const amount = cls ? cls.price || 0 : 0;

    // Create new payment record
    payment = await paymentService.createPayment({
      bookingId,
      userId: req.user.id,
      amount,
      currency: 'BDT',
      paymentMethod,
      notes: 'User submitted transaction ID for verification',
      transactionId,
    });
  }

  // Send admin notification
  const serviceName = cls?.name || bookingDetails.trainer?.specialization || 'Session';

  notificationService.paymentVerificationRequired(
    bookingId,
    bookingDetails.user?.firstName + ' ' + bookingDetails.user?.lastName,
    bookingDetails.user?.email,
    serviceName,
    payment.amount,
    paymentMethod,
    transactionId
  ).catch(() => {});

  return updatedResponse(res, booking, 'Payment submission received. Awaiting admin verification.');
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
};
