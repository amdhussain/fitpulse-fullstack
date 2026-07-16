const databaseService = require('./databaseService');
const authService = require('./auth.service');
const cmsService = require('./cms.service');
const serviceService = require('./service.service');
const galleryService = require('./gallery.service');
const settingsService = require('./settings.service');
const contactService = require('./contact.service');
const bookingService = require('./booking.service');
const dashboardService = require('./dashboard.service');

module.exports = {
  databaseService,
  authService,
  cmsService,
  serviceService,
  galleryService,
  settingsService,
  contactService,
  bookingService,
  dashboardService,
};
