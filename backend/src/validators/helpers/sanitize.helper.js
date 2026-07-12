// ─── Sanitize Helpers ──────────────────────────────────────
// Reusable sanitization utilities for input cleaning.

function sanitizeString(value) {
  if (typeof value !== 'string') return value;
  return value
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

function sanitizeObject(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map((item) => sanitizeObject(item));

  const sanitized = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      sanitized[key] = sanitizeString(value);
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeObject(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

function sanitizeQuery(query) {
  if (!query || typeof query !== 'object') return query;
  const cleaned = {};
  for (const [key, value] of Object.entries(query)) {
    if (typeof value === 'string') {
      cleaned[key] = value.trim();
    } else {
      cleaned[key] = value;
    }
  }
  return cleaned;
}

function toLowerCase(value) {
  if (typeof value !== 'string') return value;
  return value.toLowerCase();
}

function toUpperCase(value) {
  if (typeof value !== 'string') return value;
  return value.toUpperCase();
}

function removeSpaces(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/\s+/g, '');
}

function normalizeEmail(value) {
  if (typeof value !== 'string') return value;
  return value.trim().toLowerCase();
}

function stripHtml(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/<[^>]*>/g, '').trim();
}

function trimAll(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map((item) => trimAll(item));

  const trimmed = {};
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'string') {
      trimmed[key] = value.trim();
    } else if (typeof value === 'object' && value !== null) {
      trimmed[key] = trimAll(value);
    } else {
      trimmed[key] = value;
    }
  }
  return trimmed;
}

function removeNullBytes(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/\0/g, '');
}

function collapseWhitespace(value) {
  if (typeof value !== 'string') return value;
  return value.replace(/\s+/g, ' ').trim();
}

module.exports = {
  sanitizeString,
  sanitizeObject,
  sanitizeQuery,
  toLowerCase,
  toUpperCase,
  removeSpaces,
  normalizeEmail,
  stripHtml,
  trimAll,
  removeNullBytes,
  collapseWhitespace,
};
