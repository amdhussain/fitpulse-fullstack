// ─── Validators ────────────────────────────────────────────
// Central barrel export for the entire validation system.
// Provides access to middlewares, helpers, and module validators.

const middlewares = require('./middlewares');
const helpers = require('./helpers');
const authValidator = require('./auth.validator');
const cmsValidator = require('./cms.validator');
const serviceValidator = require('./service.validator');
const galleryValidator = require('./gallery.validator');
const settingsValidator = require('./settings.validator');
const contactValidator = require('./contact.validator');
const bookingValidator = require('./booking.validator');
const dashboardValidator = require('./dashboard.validator');

module.exports = {
  // ─── Middleware ────────────────────────────────────────
  ...middlewares,

  // ─── Helpers ──────────────────────────────────────────
  rules: helpers.rules,
  messages: helpers.messages,
  sanitize: helpers.sanitize,

  // ─── Module Validators ────────────────────────────────
  auth: authValidator,
  cms: cmsValidator,
  service: serviceValidator,
  gallery: galleryValidator,
  settings: settingsValidator,
  contact: contactValidator,
  booking: bookingValidator,
  dashboard: dashboardValidator,
};
