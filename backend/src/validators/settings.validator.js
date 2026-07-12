const { validateRequest, validateParams } = require('./middlewares');
const rules = require('./helpers/rules.helper');

// ─── Settings Validators ──────────────────────────────────
// Uncomment and wire into routes as the settings module is built.

/*
const updateGeneral = [
  rules.optionalText('siteName', { max: 100 }),
  rules.optionalText('siteDescription', { max: 500 }),
  rules.optionalUrl('siteUrl'),
  rules.optionalUrl('logo'),
  rules.optionalUrl('favicon'),
];

const updateNotificationPreferences = [
  rules.boolean('emailNotifications'),
  rules.boolean('pushNotifications'),
  rules.boolean('smsNotifications'),
  rules.boolean('bookingReminders'),
  rules.boolean('promotionalEmails'),
];

const updatePrivacy = [
  rules.enumValue('profileVisibility', ['public', 'private', 'members-only']),
  rules.boolean('showEmail'),
  rules.boolean('showPhone'),
];

const updateSecurity = [
  rules.boolean('twoFactorEnabled'),
  rules.enumValue('sessionTimeout', ['15', '30', '60', '120', '240']),
];

const updateBilling = [
  rules.optionalText('billingName', { max: 200 }),
  rules.optionalText('billingAddress', { max: 500 }),
  rules.optionalText('billingCity', { max: 100 }),
  rules.optionalText('billingState', { max: 100 }),
  rules.optionalText('billingZip', { max: 20 }),
  rules.optionalText('billingCountry', { max: 100 }),
  rules.optionalText('taxId', { max: 50 }),
];

const getSettings = [
  rules.enumValue('section', ['general', 'notifications', 'privacy', 'security', 'billing']),
];
*/

module.exports = {
  // updateGeneral: validateRequest(updateGeneral),
  // updateNotificationPreferences: validateRequest(updateNotificationPreferences),
  // updatePrivacy: validateRequest(updatePrivacy),
  // updateSecurity: validateRequest(updateSecurity),
  // updateBilling: validateRequest(updateBilling),
  // getSettings: validateRequest(getSettings),
};
