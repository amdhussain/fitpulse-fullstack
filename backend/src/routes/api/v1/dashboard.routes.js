const dashboardController = require('../../../controllers/dashboard.controller');
const protect = require('../../../middlewares/auth.middleware');
const authorize = require('../../../middlewares/role.middleware');
const dashboardValidator = require('../../../validators/dashboard.validator');

// ─── Dashboard Routes ──────────────────────────────────────
// Admin-only analytics endpoints.
// All routes require authentication + ADMIN role.

function dashboardRoutes(router) {
  // ─── Overview ──────────────────────────────────────────
  router.get('/dashboard/stats', protect, authorize('ADMIN'), dashboardController.getStats);

  // ─── Detailed Statistics ───────────────────────────────
  router.get('/dashboard/stats/users', protect, authorize('ADMIN'), dashboardController.getUserStats);
  router.get('/dashboard/stats/trainers', protect, authorize('ADMIN'), dashboardController.getTrainerStats);
  router.get('/dashboard/stats/bookings', protect, authorize('ADMIN'), dashboardValidator.bookingStats, dashboardController.getBookingStats);

  // ─── Recent Bookings ──────────────────────────────────
  router.get('/dashboard/bookings/recent', protect, authorize('ADMIN'), dashboardController.getRecentBookings);

  // ─── Revenue ──────────────────────────────────────────
  router.get('/dashboard/revenue', protect, authorize('ADMIN'), dashboardValidator.revenue, dashboardController.getRevenue);

  // ─── Activity ─────────────────────────────────────────
  router.get('/dashboard/activity', protect, authorize('ADMIN'), dashboardValidator.activity, dashboardController.getUserActivity);
}

module.exports = dashboardRoutes;
