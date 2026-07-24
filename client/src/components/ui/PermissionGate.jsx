import { useAuth } from "../../context/AuthContext";

/**
 * Conditionally renders children based on the user's role permissions.
 *
 * This component mirrors the backend `ROLE_PERMISSIONS` map so the UI can
 * hide/show elements without relying on role names alone.
 *
 * Usage:
 *   <PermissionGate permission="users.read">
 *     <UserTable />
 *   </PermissionGate>
 *
 *   <PermissionGate permission={["classes.create", "classes.update"]} requireAll={false}>
 *     <EditClassButton />
 *   </PermissionGate>
 */

const ROLE_PERMISSIONS = {
  ADMIN: [
    "users.read", "users.update", "users.block", "users.delete", "users.manage_roles",
    "classes.read", "classes.create", "classes.update", "classes.delete",
    "bookings.read", "bookings.create", "bookings.cancel", "bookings.manage",
    "trainers.read", "trainers.manage",
    "payments.read", "payments.manage",
    "reports.view",
    "settings.read", "settings.update",
  ],
  TRAINER: [
    "classes.read", "classes.create", "classes.update",
    "bookings.read", "bookings.manage",
    "trainers.read",
    "reports.view",
  ],
  MEMBER: [
    "classes.read",
    "bookings.read", "bookings.create", "bookings.cancel",
    "trainers.read",
  ],
};

/**
 * Check if a role (or array of roles) has a given permission.
 */
function checkPermission(roles, permission) {
  const roleList = Array.isArray(roles) ? roles : [roles];
  return roleList.some((role) => {
    const perms = ROLE_PERMISSIONS[role];
    return perms && perms.includes(permission);
  });
}

/**
 * Gate component.
 *
 * @param {string|string[]} permission   One or more permission strings.
 * @param {boolean}         requireAll   When true, ALL listed permissions are required (AND).
 *                                        Default false (OR — any one suffices).
 * @param {ReactNode}       children     Content to render when permitted.
 * @param {ReactNode}       fallback     Content to render when denied. Default null.
 */
export default function PermissionGate({
  permission,
  requireAll = false,
  children,
  fallback = null,
}) {
  const { user } = useAuth();
  const role = user?.role;

  if (!role) return fallback;

  const perms = Array.isArray(permission) ? permission : [permission];

  const granted = requireAll
    ? perms.every((p) => checkPermission(role, p))
    : perms.some((p) => checkPermission(role, p));

  return granted ? children : fallback;
}

export { ROLE_PERMISSIONS, checkPermission };
