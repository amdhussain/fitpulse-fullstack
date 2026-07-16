const dashboardService = require('./service');
const { successResponse } = require('../../helpers/apiResponse');
const asyncHandler = require('../../middlewares/asyncHandler');

// ─── Dashboard Statistics ────────────────────────────────

const getOverviewStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getOverviewStats();
  return successResponse(res, stats, 'Dashboard statistics retrieved successfully');
});

// ─── Analytics ───────────────────────────────────────────

const getMonthlyBookings = asyncHandler(async (req, res) => {
  const { startDate, endDate, months } = req.query;

  const data = await dashboardService.getMonthlyBookings({
    startDate,
    endDate,
    months: months ? parseInt(months, 10) : undefined,
  });

  return successResponse(res, data, 'Monthly bookings retrieved successfully');
});

const getMonthlyRevenue = asyncHandler(async (req, res) => {
  const { startDate, endDate, months } = req.query;

  const data = await dashboardService.getMonthlyRevenue({
    startDate,
    endDate,
    months: months ? parseInt(months, 10) : undefined,
  });

  return successResponse(res, data, 'Monthly revenue retrieved successfully');
});

const getClassPopularity = asyncHandler(async (req, res) => {
  const { startDate, endDate, limit } = req.query;

  const data = await dashboardService.getClassPopularity({
    startDate,
    endDate,
    limit: limit ? parseInt(limit, 10) : 10,
  });

  return successResponse(res, data, 'Class popularity retrieved successfully');
});

const getTrainerPerformance = asyncHandler(async (req, res) => {
  const { startDate, endDate, limit } = req.query;

  const data = await dashboardService.getTrainerPerformance({
    startDate,
    endDate,
    limit: limit ? parseInt(limit, 10) : 10,
  });

  return successResponse(res, data, 'Trainer performance retrieved successfully');
});

const getRecentRegistrations = asyncHandler(async (req, res) => {
  const { limit } = req.query;

  const data = await dashboardService.getRecentRegistrations({
    limit: limit ? parseInt(limit, 10) : 10,
  });

  return successResponse(res, data, 'Recent registrations retrieved successfully');
});

const getRecentBookings = asyncHandler(async (req, res) => {
  const { limit } = req.query;

  const data = await dashboardService.getRecentBookings({
    limit: limit ? parseInt(limit, 10) : 10,
  });

  return successResponse(res, data, 'Recent bookings retrieved successfully');
});

// ─── Admin Dashboard ─────────────────────────────────────

const getLatestUsers = asyncHandler(async (req, res) => {
  const { limit } = req.query;

  const data = await dashboardService.getLatestUsers({
    limit: limit ? parseInt(limit, 10) : 5,
  });

  return successResponse(res, data, 'Latest users retrieved successfully');
});

const getLatestTrainers = asyncHandler(async (req, res) => {
  const { limit } = req.query;

  const data = await dashboardService.getLatestTrainers({
    limit: limit ? parseInt(limit, 10) : 5,
  });

  return successResponse(res, data, 'Latest trainers retrieved successfully');
});

const getLatestBookings = asyncHandler(async (req, res) => {
  const { limit } = req.query;

  const data = await dashboardService.getLatestBookings({
    limit: limit ? parseInt(limit, 10) : 5,
  });

  return successResponse(res, data, 'Latest bookings retrieved successfully');
});

const getSystemOverview = asyncHandler(async (req, res) => {
  const data = await dashboardService.getSystemOverview();
  return successResponse(res, data, 'System overview retrieved successfully');
});

const getRevenueSummary = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const data = await dashboardService.getRevenueSummary({ startDate, endDate });
  return successResponse(res, data, 'Revenue summary retrieved successfully');
});

const getBookingSummary = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const data = await dashboardService.getBookingSummary({ startDate, endDate });
  return successResponse(res, data, 'Booking summary retrieved successfully');
});

const getBookingStatusBreakdown = asyncHandler(async (req, res) => {
  const { startDate, endDate } = req.query;

  const data = await dashboardService.getBookingStatusBreakdown({ startDate, endDate });
  return successResponse(res, data, 'Booking status breakdown retrieved successfully');
});

const getTopClassesByBookings = asyncHandler(async (req, res) => {
  const { limit, startDate, endDate } = req.query;

  const data = await dashboardService.getTopClassesByBookings({
    limit: limit ? parseInt(limit, 10) : 5,
    startDate,
    endDate,
  });

  return successResponse(res, data, 'Top classes by bookings retrieved successfully');
});

const getTopTrainersByBookings = asyncHandler(async (req, res) => {
  const { limit, startDate, endDate } = req.query;

  const data = await dashboardService.getTopTrainersByBookings({
    limit: limit ? parseInt(limit, 10) : 5,
    startDate,
    endDate,
  });

  return successResponse(res, data, 'Top trainers by bookings retrieved successfully');
});

module.exports = {
  getOverviewStats,
  getMonthlyBookings,
  getMonthlyRevenue,
  getClassPopularity,
  getTrainerPerformance,
  getRecentRegistrations,
  getRecentBookings,
  getLatestUsers,
  getLatestTrainers,
  getLatestBookings,
  getSystemOverview,
  getRevenueSummary,
  getBookingSummary,
  getBookingStatusBreakdown,
  getTopClassesByBookings,
  getTopTrainersByBookings,
};
