/**
 * Granular permissions system.
 *
 * Each role maps to an array of dot‑notion permission strings.
 * Use `requirePermission(...)` middleware to gate individual routes.
 *
 * Naming convention: `<resource>.<action>`
 *   e.g. "users.read", "classes.create", "bookings.manage"
 */

const PERMISSIONS = {
  // ── Users ────────────────────────────────────────────────
  'users.read':      'View user list and profiles',
  'users.update':    'Edit any user profile',
  'users.block':     'Block / unblock users',
  'users.delete':    'Delete users',
  'users.manage_roles': 'Assign or change user roles',

  // ── Classes ──────────────────────────────────────────────
  'classes.read':    'View class schedule',
  'classes.create':  'Create new classes',
  'classes.update':  'Edit class details',
  'classes.delete':  'Remove classes',

  // ── Bookings ─────────────────────────────────────────────
  'bookings.read':   'View bookings',
  'bookings.create': 'Make a booking',
  'bookings.cancel': 'Cancel a booking',
  'bookings.manage': 'Manage all bookings (admin)',

  // ── Trainers ─────────────────────────────────────────────
  'trainers.read':   'View trainer list',
  'trainers.manage': 'Manage trainer profiles',

  // ── Payments ─────────────────────────────────────────────
  'payments.read':   'View payment records',
  'payments.manage': 'Process refunds / manage payments',

  // ── Reports ──────────────────────────────────────────────
  'reports.view':    'View dashboard and analytics',

  // ── Settings ─────────────────────────────────────────────
  'settings.read':   'View system settings',
  'settings.update': 'Modify system settings',
};

/** Default permissions per built‑in role. */
const ROLE_PERMISSIONS = {
  ADMIN: Object.keys(PERMISSIONS), // full access

  TRAINER: [
    'classes.read',
    'classes.create',
    'classes.update',
    'bookings.read',
    'bookings.manage',
    'trainers.read',
    'reports.view',
  ],

  MEMBER: [
    'classes.read',
    'bookings.read',
    'bookings.create',
    'bookings.cancel',
    'trainers.read',
  ],
};

/**
 * Check whether a role (or array of roles) holds a specific permission.
 * @param {string|string[]} roles
 * @param {string} permission  Dot‑notion string e.g. "users.read"
 * @returns {boolean}
 */
function hasPermission(roles, permission) {
  const roleList = Array.isArray(roles) ? roles : [roles];
  return roleList.some((role) => {
    const perms = ROLE_PERMISSIONS[role];
    return perms && perms.includes(permission);
  });
}

module.exports = { PERMISSIONS, ROLE_PERMISSIONS, hasPermission };
