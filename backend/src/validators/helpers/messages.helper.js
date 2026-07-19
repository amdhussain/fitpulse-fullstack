// ─── Validation Messages ────────────────────────────────────
// Centralized, reusable validation messages.
// All messages use functions so field names are interpolated at runtime.

const messages = {
  // ─── General ──────────────────────────────────────────
  required: (field) => `${field} is required`,
  invalid: (field) => `${field} is invalid`,
  tooShort: (field, min) => `${field} must be at least ${min} characters`,
  tooLong: (field, max) => `${field} must be at most ${max} characters`,
  exactLength: (field, len) => `${field} must be exactly ${len} characters`,
  between: (field, min, max) => `${field} must be between ${min} and ${max}`,

  // ─── Authentication ───────────────────────────────────
  email: 'Please provide a valid email address',
  emailTaken: 'Email address is already in use',
  url: 'Please provide a valid URL',
  phone: 'Please provide a valid phone number',
  password: 'Password must contain at least one uppercase letter, one lowercase letter, one number, one special character, and be at least 8 characters long.',
  passwordMismatch: 'Passwords do not match',
  token: 'Token is required',
  tokenInvalid: 'Token is invalid or expired',

  // ─── Text & Alpha ─────────────────────────────────────
  alpha: (field) => `${field} must contain only letters`,
  alphanumeric: (field) => `${field} must contain only letters and numbers`,
  slug: 'Slug must contain only lowercase letters, numbers, and hyphens',

  // ─── Numbers ──────────────────────────────────────────
  number: (field) => `${field} must be a number`,
  positiveNumber: (field) => `${field} must be a positive number`,
  integer: (field) => `${field} must be a whole number`,

  // ─── Dates ────────────────────────────────────────────
  dateFormat: 'Please provide a valid date (ISO 8601 format)',
  pastDate: (field) => `${field} must be a past date`,
  futureDate: (field) => `${field} must be a future date`,

  // ─── Enums & Types ────────────────────────────────────
  enum: (field, values) => `${field} must be one of: ${values.join(', ')}`,

  // ─── IDs ──────────────────────────────────────────────
  objectId: (field) => `${field} must be a valid ID`,
  uuid: 'Must be a valid UUID',

  // ─── Arrays ───────────────────────────────────────────
  array: (field) => `${field} must be an array`,
  arrayMin: (field, min) => `${field} must contain at least ${min} items`,
  arrayMax: (field, max) => `${field} must contain at most ${max} items`,

  // ─── File Upload ──────────────────────────────────────
  file: (field) => `${field} is required`,
  fileType: (field, types) => `${field} must be one of: ${types.join(', ')}`,
  fileSize: (field, maxMB) => `${field} must be less than ${maxMB}MB`,

  // ─── Confirmation ─────────────────────────────────────
  confirmed: (field) => `${field} confirmation does not match`,

  // ─── Uniqueness ───────────────────────────────────────
  unique: (field) => `${field} is already taken`,
  notFound: (resource) => `${resource} not found`,

  // ─── Pagination & Sorting ─────────────────────────────
  page: 'Page must be a positive integer',
  limit: 'Limit must be a positive integer between 1 and 100',
  sort: 'Sort field is invalid',

  // ─── Geolocation ──────────────────────────────────────
  latitude: 'Latitude must be between -90 and 90',
  longitude: 'Longitude must be between -180 and 180',

  // ─── Colors & Networks ────────────────────────────────
  hex: (field) => `${field} must be a valid hexadecimal color`,
  ipv4: 'Must be a valid IPv4 address',
  ipv6: 'Must be a valid IPv6 address',
  ip: 'Must be a valid IP address',

  // ─── Conditionals ─────────────────────────────────────
  conditionalRequired: (field, condition) => `${field} is required when ${condition} is provided`,
};

module.exports = messages;
