const bookingService = require('./service');
const { successResponse, createdResponse, updatedResponse, deletedResponse, paginatedResponse } = require('../../helpers/apiResponse');
const asyncHandler = require('../../middlewares/asyncHandler');

// ─── Member APIs ──────────────────────────────────────────

const bookClass = asyncHandler(async (req, res) => {
  const { classId, bookingDate, bookingTime, notes } = req.body;

  const booking = await bookingService.bookClass(req.user.id, { classId, bookingDate, bookingTime, notes });

  return createdResponse(res, booking, 'Class booked successfully');
});

const cancelBooking = asyncHandler(async (req, res) => {
  const { cancelReason } = req.body;

  const booking = await bookingService.cancelBooking(req.user.id, req.params.id, cancelReason);

  return updatedResponse(res, booking, 'Booking cancelled successfully');
});

const getMyBookings = asyncHandler(async (req, res) => {
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
  const booking = await bookingService.getBookingDetails(req.user.id, req.params.id);

  return successResponse(res, booking, 'Booking retrieved successfully');
});

// ─── Trainer APIs ─────────────────────────────────────────

const getBookingsForMyClasses = asyncHandler(async (req, res) => {
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
  const booking = await bookingService.approveBooking(req.user.id, req.params.id);

  return updatedResponse(res, booking, 'Booking approved successfully');
});

const rejectBooking = asyncHandler(async (req, res) => {
  const booking = await bookingService.rejectBooking(req.user.id, req.params.id);

  return updatedResponse(res, booking, 'Booking rejected successfully');
});

const markAttendance = asyncHandler(async (req, res) => {
  const { attended } = req.body;

  const booking = await bookingService.markAttendance(req.user.id, req.params.id, attended);

  return updatedResponse(res, booking, 'Attendance updated successfully');
});

// ─── Admin APIs ───────────────────────────────────────────

const getAllBookings = asyncHandler(async (req, res) => {
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
  const { status } = req.body;

  const booking = await bookingService.updateBookingStatus(req.params.id, status);

  return updatedResponse(res, booking, 'Booking status updated successfully');
});

const deleteBooking = asyncHandler(async (req, res) => {
  const result = await bookingService.deleteBooking(req.params.id);

  return deletedResponse(res, result.message);
});

module.exports = {
  bookClass,
  cancelBooking,
  getMyBookings,
  getBookingDetails,
  getBookingsForMyClasses,
  approveBooking,
  rejectBooking,
  markAttendance,
  getAllBookings,
  updateBookingStatus,
  deleteBooking,
};
