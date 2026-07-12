const { validateRequest, validateParams } = require('./middlewares');
const rules = require('./helpers/rules.helper');

// ─── Booking Validators ───────────────────────────────────
// Uncomment and wire into routes as the booking module is built.

/*
const createBooking = [
  rules.objectId('classId'),
  rules.enumValue('status', ['pending', 'confirmed', 'cancelled']),
];

const updateBooking = [
  validateParams({ id: 'mongoId' }),
  rules.optionalEnum('status', ['pending', 'confirmed', 'cancelled']),
];

const cancelBooking = [
  validateParams({ id: 'mongoId' }),
  rules.text('reason', { min: 10, max: 500 }),
];

const getBooking = [
  validateParams({ id: 'mongoId' }),
];

const listBookings = [
  rules.page(),
  rules.limit(),
  rules.sort(['createdAt', 'status']),
  rules.queryEnum('status', ['pending', 'confirmed', 'cancelled']),
  rules.queryDateRange('startDate', 'endDate'),
];
*/

module.exports = {
  // createBooking: validateRequest(createBooking),
  // updateBooking: validateRequest(updateBooking),
  // cancelBooking: validateRequest(cancelBooking),
  // getBooking: validateRequest(getBooking),
  // listBookings: validateRequest(listBookings),
};
