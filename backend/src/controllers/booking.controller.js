const bookingService = require('../services/booking.service');
const { successResponse, createdResponse, paginatedResponse } = require('../helpers/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

// ─── Booking Controller ────────────────────────────────────
// HTTP handlers for booking endpoints.
// Routes are split by role: admin, member, trainer.
// ───────────────────────────────────────────────────────────

// ─── Admin Handlers ────────────────────────────────────────

const adminGetAll = asyncHandler(async (req, res) => {
  const result = await bookingService.adminGetAll(req.query);
  return paginatedResponse(res, result);
});

const adminGetById = asyncHandler(async (req, res) => {
  const booking = await bookingService.adminGetById(req.params.id);
  return successResponse(res, booking, 'Booking retrieved successfully');
});

const adminCreate = asyncHandler(async (req, res) => {
  const booking = await bookingService.adminCreate(req.body);
  return createdResponse(res, booking, 'Booking created successfully');
});

const adminUpdate = asyncHandler(async (req, res) => {
  const booking = await bookingService.adminUpdate(req.params.id, req.body);
  return successResponse(res, booking, 'Booking updated successfully');
});

const adminUpdateStatus = asyncHandler(async (req, res) => {
  const booking = await bookingService.adminUpdateStatus(req.params.id, req.body.status);
  return successResponse(res, booking, 'Booking status updated successfully');
});

const adminRemove = asyncHandler(async (req, res) => {
  await bookingService.adminRemove(req.params.id);
  return successResponse(res, null, 'Booking deleted successfully');
});

// ─── Member Handlers ───────────────────────────────────────

const memberGetAll = asyncHandler(async (req, res) => {
  const result = await bookingService.memberGetAll(req.user.id, req.query);
  return paginatedResponse(res, result);
});

const memberGetById = asyncHandler(async (req, res) => {
  const booking = await bookingService.memberGetById(req.user.id, req.params.id);
  return successResponse(res, booking, 'Booking retrieved successfully');
});

const memberCreate = asyncHandler(async (req, res) => {
  const booking = await bookingService.memberCreate(req.user.id, req.body);
  return createdResponse(res, booking, 'Booking created successfully');
});

const memberUpdate = asyncHandler(async (req, res) => {
  const booking = await bookingService.memberUpdate(req.user.id, req.params.id, req.body);
  return successResponse(res, booking, 'Booking updated successfully');
});

const memberCancel = asyncHandler(async (req, res) => {
  const booking = await bookingService.memberCancel(req.user.id, req.params.id, req.body.cancelReason);
  return successResponse(res, booking, 'Booking cancelled successfully');
});

// ─── Trainer Handlers ──────────────────────────────────────

const trainerGetAll = asyncHandler(async (req, res) => {
  const trainerId = await bookingService.getTrainerIdForUser(req.user.id);
  if (!trainerId) {
    return successResponse(res, { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } }, 'No trainer profile found');
  }
  const result = await bookingService.trainerGetAll(trainerId, req.query);
  return paginatedResponse(res, result);
});

const trainerUpdateStatus = asyncHandler(async (req, res) => {
  const trainerId = await bookingService.getTrainerIdForUser(req.user.id);
  if (!trainerId) {
    return successResponse(res, null, 'No trainer profile found');
  }
  const booking = await bookingService.trainerUpdateStatus(trainerId, req.params.id, req.body.status);
  return successResponse(res, booking, 'Booking status updated successfully');
});

module.exports = {
  adminGetAll,
  adminGetById,
  adminCreate,
  adminUpdate,
  adminUpdateStatus,
  adminRemove,
  memberGetAll,
  memberGetById,
  memberCreate,
  memberUpdate,
  memberCancel,
  trainerGetAll,
  trainerUpdateStatus,
};
