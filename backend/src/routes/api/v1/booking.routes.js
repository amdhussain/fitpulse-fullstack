const bookingController = require('../../../controllers/booking.controller');
const protect = require('../../../middlewares/auth.middleware');
const authorize = require('../../../middlewares/role.middleware');
const bookingValidator = require('../../../validators/booking.validator');

// ─── Booking Routes ────────────────────────────────────────
// Three access tiers:
//   Admin:   full CRUD on all bookings
//   Member:  manage own bookings (create, view, update, cancel)
//   Trainer: view assigned bookings, update status
//
// Route ordering matters: specific paths (unread/count, read-all)
// must come before parameterized paths (:id).

function bookingRoutes(router) {
  // ─── Admin Routes ──────────────────────────────────────
  router.get('/bookings', protect, authorize('ADMIN'), bookingController.adminGetAll);
  router.get('/bookings/:id', protect, authorize('ADMIN'), bookingValidator.idParam, bookingController.adminGetById);
  router.post('/bookings', protect, authorize('ADMIN'), bookingValidator.create, bookingController.adminCreate);
  router.put('/bookings/:id', protect, authorize('ADMIN'), bookingValidator.idParam, bookingValidator.update, bookingController.adminUpdate);
  router.patch('/bookings/:id/status', protect, authorize('ADMIN'), bookingValidator.idParam, bookingValidator.updateStatus, bookingController.adminUpdateStatus);
  router.delete('/bookings/:id', protect, authorize('ADMIN'), bookingValidator.idParam, bookingController.adminRemove);

  // ─── Member Routes ─────────────────────────────────────
  router.get('/my-bookings', protect, authorize('MEMBER'), bookingController.memberGetAll);
  router.get('/my-bookings/:id', protect, authorize('MEMBER'), bookingValidator.idParam, bookingController.memberGetById);
  router.post('/my-bookings', protect, authorize('MEMBER'), bookingValidator.create, bookingController.memberCreate);
  router.put('/my-bookings/:id', protect, authorize('MEMBER'), bookingValidator.idParam, bookingValidator.update, bookingController.memberUpdate);
  router.patch('/my-bookings/:id/cancel', protect, authorize('MEMBER'), bookingValidator.idParam, bookingValidator.cancel, bookingController.memberCancel);

  // ─── Trainer Routes ────────────────────────────────────
  router.get('/trainer/bookings', protect, authorize('TRAINER'), bookingController.trainerGetAll);
  router.patch('/trainer/bookings/:id/status', protect, authorize('TRAINER'), bookingValidator.idParam, bookingValidator.updateStatus, bookingController.trainerUpdateStatus);
}

module.exports = bookingRoutes;
