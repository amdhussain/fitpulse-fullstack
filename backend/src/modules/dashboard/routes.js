const dashboardController = require('./controller');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const dashboardValidation = require('./validation');

function dashboardRoutes(router) {
  // ─── Statistics ────────────────────────────────────────
  router.get('/stats', protect, authorize('ADMIN'), dashboardController.getOverviewStats);

  // ─── Analytics ─────────────────────────────────────────
  router.get('/analytics/bookings', protect, authorize('ADMIN'), dashboardValidation.analyticsQuery, dashboardController.getMonthlyBookings);
  router.get('/analytics/revenue', protect, authorize('ADMIN'), dashboardValidation.analyticsQuery, dashboardController.getMonthlyRevenue);
  router.get('/analytics/classes', protect, authorize('ADMIN'), dashboardValidation.analyticsQuery, dashboardController.getClassPopularity);
  router.get('/analytics/trainers', protect, authorize('ADMIN'), dashboardValidation.analyticsQuery, dashboardController.getTrainerPerformance);
  router.get('/analytics/registrations', protect, authorize('ADMIN'), dashboardValidation.limitQuery, dashboardController.getRecentRegistrations);
  router.get('/analytics/recent-bookings', protect, authorize('ADMIN'), dashboardValidation.limitQuery, dashboardController.getRecentBookings);

  // ─── Admin Dashboard ───────────────────────────────────
  router.get('/admin/latest-users', protect, authorize('ADMIN'), dashboardValidation.limitQuery, dashboardController.getLatestUsers);
  router.get('/admin/latest-trainers', protect, authorize('ADMIN'), dashboardValidation.limitQuery, dashboardController.getLatestTrainers);
  router.get('/admin/latest-bookings', protect, authorize('ADMIN'), dashboardValidation.limitQuery, dashboardController.getLatestBookings);
  router.get('/admin/overview', protect, authorize('ADMIN'), dashboardController.getSystemOverview);
  router.get('/admin/revenue-summary', protect, authorize('ADMIN'), dashboardValidation.dateRangeQuery, dashboardController.getRevenueSummary);
  router.get('/admin/booking-summary', protect, authorize('ADMIN'), dashboardValidation.dateRangeQuery, dashboardController.getBookingSummary);
  router.get('/admin/booking-status', protect, authorize('ADMIN'), dashboardValidation.dateRangeQuery, dashboardController.getBookingStatusBreakdown);
  router.get('/admin/top-classes', protect, authorize('ADMIN'), dashboardValidation.analyticsQuery, dashboardController.getTopClassesByBookings);
  router.get('/admin/top-trainers', protect, authorize('ADMIN'), dashboardValidation.analyticsQuery, dashboardController.getTopTrainersByBookings);
}

module.exports = dashboardRoutes;
