const bookingController = require('./controller');
const protect = require('../../middlewares/auth.middleware');
const authorize = require('../../middlewares/role.middleware');
const bookingValidation = require('./validation');

function bookingRoutes(router) {
  // ─── Member Routes ─────────────────────────────────────
  router.post('/me/book', protect, authorize('MEMBER'), bookingValidation.bookClass, bookingController.bookClass);
  router.get('/me', protect, authorize('MEMBER'), bookingValidation.getMyBookings, bookingController.getMyBookings);
  router.get('/me/:id', protect, authorize('MEMBER'), bookingValidation.idParam, bookingController.getBookingDetails);
  router.patch('/me/:id/cancel', protect, authorize('MEMBER'), bookingValidation.idParam, bookingValidation.cancelBooking, bookingController.cancelBooking);

  // ─── Trainer Routes ────────────────────────────────────
  router.get('/trainer', protect, authorize('TRAINER'), bookingValidation.getBookingsForMyClasses, bookingController.getBookingsForMyClasses);
  router.patch('/trainer/:id/approve', protect, authorize('TRAINER'), bookingValidation.idParam, bookingController.approveBooking);
  router.patch('/trainer/:id/reject', protect, authorize('TRAINER'), bookingValidation.idParam, bookingController.rejectBooking);
  router.patch('/trainer/:id/attendance', protect, authorize('TRAINER'), bookingValidation.idParam, bookingValidation.markAttendance, bookingController.markAttendance);

  // ─── Admin Routes ──────────────────────────────────────
  router.get('/', protect, authorize('ADMIN'), bookingValidation.getAllBookings, bookingController.getAllBookings);
  router.patch('/:id/status', protect, authorize('ADMIN'), bookingValidation.idParam, bookingValidation.updateBookingStatus, bookingController.updateBookingStatus);
  router.delete('/:id', protect, authorize('ADMIN'), bookingValidation.idParam, bookingController.deleteBooking);
}

module.exports = bookingRoutes;
