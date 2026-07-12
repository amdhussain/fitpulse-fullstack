// ─── Validators ────────────────────────────────────────────
// Central barrel export for the entire validation system.
// Provides access to middlewares, helpers, and module validators.

const middlewares = require('./middlewares');
const helpers = require('./helpers');

// ─── Module Validators (uncomment as modules are built) ───
// const authValidator = require('./auth.validator');
// const userValidator = require('./user.validator');
// const trainerValidator = require('./trainer.validator');
// const classValidator = require('./class.validator');
// const bookingValidator = require('./booking.validator');
// const paymentValidator = require('./payment.validator');
// const communityValidator = require('./community.validator');
// const cmsValidator = require('./cms.validator');
// const dashboardValidator = require('./dashboard.validator');
// const settingsValidator = require('./settings.validator');

module.exports = {
  // ─── Middleware ────────────────────────────────────────
  ...middlewares,

  // ─── Helpers ──────────────────────────────────────────
  rules: helpers.rules,
  messages: helpers.messages,
  sanitize: helpers.sanitize,

  // ─── Module Validators ────────────────────────────────
  // auth: authValidator,
  // user: userValidator,
  // trainer: trainerValidator,
  // class: classValidator,
  // booking: bookingValidator,
  // payment: paymentValidator,
  // community: communityValidator,
  // cms: cmsValidator,
  // dashboard: dashboardValidator,
  // settings: settingsValidator,
};
