const dashboardService = require('../services/dashboard.service');
const { successResponse, paginatedResponse } = require('../helpers/apiResponse');
const asyncHandler = require('../middlewares/asyncHandler');

// ─── Dashboard Controller ──────────────────────────────────
// HTTP handlers for admin dashboard analytics endpoints.
// All routes are admin-only (protected + authorize('ADMIN')).
// ───────────────────────────────────────────────────────────

// @desc    Get dashboard overview statistics
// @route   GET /api/v1/dashboard/stats
// @access  Admin
const getStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getStats();
  return successResponse(res, stats, 'Dashboard statistics retrieved successfully');
});

// @desc    Get user statistics
// @route   GET /api/v1/dashboard/stats/users
// @access  Admin
const getUserStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getUserStats();
  return successResponse(res, stats, 'User statistics retrieved successfully');
});

// @desc    Get trainer statistics
// @route   GET /api/v1/dashboard/stats/trainers
// @access  Admin
const getTrainerStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getTrainerStats();
  return successResponse(res, stats, 'Trainer statistics retrieved successfully');
});

// @desc    Get booking statistics
// @route   GET /api/v1/dashboard/stats/bookings
// @access  Admin
const getBookingStats = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getBookingStats(req.query);
  return successResponse(res, stats, 'Booking statistics retrieved successfully');
});

// @desc    Get recent bookings
// @route   GET /api/v1/dashboard/bookings/recent
// @access  Admin
const getRecentBookings = asyncHandler(async (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  const bookings = await dashboardService.getRecentBookings(limit);
  return successResponse(res, bookings, 'Recent bookings retrieved successfully');
});

// @desc    Get revenue summary
// @route   GET /api/v1/dashboard/revenue
// @access  Admin
const getRevenue = asyncHandler(async (req, res) => {
  const revenue = await dashboardService.getRevenue(req.query);
  return successResponse(res, revenue, 'Revenue summary retrieved successfully');
});

// @desc    Get user activity feed
// @route   GET /api/v1/dashboard/activity
// @access  Admin
const getUserActivity = asyncHandler(async (req, res) => {
  const result = await dashboardService.getUserActivity(req.query);
  return paginatedResponse(res, result);
});

module.exports = {
  getStats,
  getUserStats,
  getTrainerStats,
  getBookingStats,
  getRecentBookings,
  getRevenue,
  getUserActivity,
};
