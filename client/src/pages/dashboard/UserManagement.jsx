import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiUser,
  FiUserCheck,
  FiShield,
  FiMail,
  FiClock,
  FiRefreshCw,
  FiEdit2,
  FiTrash2,
  FiEye,
  FiEyeOff,
  FiCheck,
  FiPhone,
  FiCalendar,
  FiActivity,
  FiCreditCard,
  FiX,
} from "react-icons/fi";
import { staggerContainer } from "../../lib/animations";
import PageBanner from "../../components/dashboard/PageBanner";
import StatCard from "../../components/dashboard/StatCard";
import DataTable from "../../components/dashboard/DataTable";
import ConfirmModal from "../../components/dashboard/ConfirmModal";
import { useAuth } from "../../context/AuthContext";
import { isValidImageUrl } from "../../lib/imageUtils";
import { apiClient } from "../../lib/api";

const roleBadge = (role) => {
  const map = {
    ADMIN: {
      bg: "bg-royal-50 dark:bg-royal-500/10",
      text: "text-royal-600 dark:text-royal-400",
      border: "border-royal-200 dark:border-royal-500/20",
      label: "Admin",
    },
    TRAINER: {
      bg: "bg-cyan-50 dark:bg-cyan-500/10",
      text: "text-cyan-600 dark:text-cyan-400",
      border: "border-cyan-200 dark:border-cyan-500/20",
      label: "Trainer",
    },
    MEMBER: {
      bg: "bg-gray-50 dark:bg-gray-500/10",
      text: "text-gray-600 dark:text-gray-400",
      border: "border-gray-200 dark:border-gray-500/20",
      label: "Member",
    },
  };
  return map[role] || map.MEMBER;
};

function EditUserModal({ isOpen, user, onClose, onSave, saving }) {
  const [role, setRole] = useState("MEMBER");

  useEffect(() => {
    if (user) setRole(user.role);
  }, [user]);

  if (!isOpen || !user) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-md z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Edit User"
      >
        <div
          className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1a2235] border border-gray-200/60 dark:border-white/[0.08] shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit User</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Update role for <span className="font-medium text-gray-700 dark:text-gray-300">{user.name}</span>
            </p>
          </div>

          <div className="p-6 space-y-5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {user.firstName?.charAt(0)?.toUpperCase() || "U"}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{user.name}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{user.email}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                <FiShield className="w-3.5 h-3.5 inline mr-1.5" />
                Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["MEMBER", "TRAINER", "ADMIN"].map((r) => {
                  const badge = roleBadge(r);
                  const selected = role === r;
                  return (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                        selected
                          ? `${badge.bg} ${badge.text} ${badge.border} ring-2 ring-offset-1 ring-gray-200 dark:ring-gray-700`
                          : "bg-white dark:bg-white/[0.03] text-gray-400 dark:text-gray-500 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                      }`}
                    >
                      {badge.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="px-6 py-4 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(user.id, role)}
              disabled={saving || role === user.role}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-500 text-white hover:from-blue-700 hover:to-indigo-600 shadow-md shadow-blue-500/25 transition-all duration-200 active:scale-[0.97] disabled:opacity-50"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : (
                "Save Changes"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "Never";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function UserDetailModal({ isOpen, user, onClose, loading }) {
  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-md z-50"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-label="User Details"
      >
        <div
          className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#1a2235] border border-gray-200/60 dark:border-white/[0.08] shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">User Details</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Complete profile information
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
              aria-label="Close"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {loading ? (
            <div className="p-6 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-white/5 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-gray-100 dark:bg-white/5 rounded w-1/3 animate-pulse" />
                    <div className="h-2 bg-gray-100 dark:bg-white/5 rounded w-1/2 animate-pulse" />
                  </div>
                </div>
              ))}
            </div>
          ) : user ? (
            <div className="p-6">
              <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100 dark:border-white/5">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-blue-500/25 shrink-0">
                  {isValidImageUrl(user.profileImage) ? (
                    <img
                      src={user.profileImage}
                      alt={`${user.firstName} ${user.lastName}`}
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    user.firstName?.charAt(0)?.toUpperCase() || "U"
                  )}
                </div>
                <div className="min-w-0">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {user.firstName} {user.lastName}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border mt-1 ${
                    user.isActive
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
                      : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20"
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${user.isActive ? "bg-emerald-500" : "bg-red-500"}`} />
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <DetailItem icon={FiUser} label="Full Name" value={`${user.firstName} ${user.lastName}`} />
                <DetailItem icon={FiMail} label="Email" value={user.email} />
                <DetailItem icon={FiPhone} label="Phone" value={user.phone || "Not provided"} />
                <DetailItem
                  icon={FiShield}
                  label="Role"
                  value={roleBadge(user.role).label}
                  valueClass={`${roleBadge(user.role).text}`}
                />
                <DetailItem
                  icon={FiCreditCard}
                  label="Membership"
                  value={user.membership || "None"}
                />
                <DetailItem
                  icon={FiActivity}
                  label="Total Bookings"
                  value={user.totalBookings ?? 0}
                />
                <DetailItem icon={FiCalendar} label="Join Date" value={formatDate(user.createdAt)} />
                <DetailItem
                  icon={FiCheck}
                  label="Account Status"
                  value={user.isActive ? "Active" : "Blocked"}
                  valueClass={user.isActive ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}
                />
              </div>
            </div>
          ) : null}

          <div className="px-6 py-4 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex items-center justify-end">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function DetailItem({ icon: Icon, label, value, valueClass = "" }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-100 dark:border-white/5">
      <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-white/5 shrink-0">
        <Icon className="w-4 h-4 text-gray-400 dark:text-gray-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-0.5">
          {label}
        </p>
        <p className={`text-sm font-medium text-gray-700 dark:text-gray-200 truncate ${valueClass}`}>
          {value}
        </p>
      </div>
    </div>
  );
}

function UserManagement() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);

  const [confirmPromote, setConfirmPromote] = useState(null);
  const [promoting, setPromoting] = useState(null);

  const [editUser, setEditUser] = useState(null);
  const [savingEdit, setSavingEdit] = useState(false);

  const [confirmBlock, setConfirmBlock] = useState(null);
  const [blocking, setBlocking] = useState(null);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [viewUser, setViewUser] = useState(null);
  const [viewUserLoading, setViewUserLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await apiClient.get("/api/v1/admin/users?limit=100");
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch users");
      const mapped = (data.data || []).map((u) => ({
        id: u._id || u.id,
        name: `${u.firstName} ${u.lastName}`,
        firstName: u.firstName,
        lastName: u.lastName,
        email: u.email,
        role: u.role,
        isActive: u.isActive,
        lastLoginAt: u.lastLoginAt,
        createdAt: u.createdAt,
        profileImage: u.profileImage,
      }));
      setUsers(mapped);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (userId, newRole) => {
    setSavingEdit(true);
    try {
      const res = await apiClient.put(`/api/v1/admin/users/${userId}/role`, { role: newRole });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update role");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
      );
      setFeedback({ type: "success", message: `Role updated to ${roleBadge(newRole).label}` });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setSavingEdit(false);
      setEditUser(null);
    }
  };

  const handleToggleBlock = async (userId, currentActive) => {
    setBlocking(userId);
    const endpoint = currentActive
      ? `/api/v1/admin/users/${userId}/block`
      : `/api/v1/admin/users/${userId}/unblock`;
    try {
      const res = await apiClient.patch(endpoint);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update status");
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, isActive: !currentActive } : u))
      );
      setFeedback({
        type: "success",
        message: currentActive ? "User blocked" : "User unblocked",
      });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setBlocking(null);
      setConfirmBlock(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    setDeleting(true);
    try {
      const res = await apiClient.delete(`/api/v1/admin/users/${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete user");
      setUsers((prev) => prev.filter((u) => u.id !== userId));
      setFeedback({ type: "success", message: "User deleted successfully" });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  const handleViewUser = async (userId) => {
    setViewUserLoading(true);
    setViewUser(null);
    try {
      const res = await apiClient.get(`/api/v1/admin/users/${userId}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch user details");
      setViewUser(data.data);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setViewUserLoading(false);
    }
  };

  const stats = {
    total: users.length,
    admins: users.filter((u) => u.role === "ADMIN").length,
    members: users.filter((u) => u.role === "MEMBER").length,
    trainers: users.filter((u) => u.role === "TRAINER").length,
  };

  const columns = [
    {
      key: "profileImage",
      label: "Profile",
      render: (_, item) => (
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm shadow-blue-500/20">
          {isValidImageUrl(item.profileImage) ? (
            <img
              src={item.profileImage}
              alt={item.name}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            item.firstName?.charAt(0)?.toUpperCase() || "U"
          )}
        </div>
      ),
    },
    {
      key: "name",
      label: "Full Name",
      render: (_, item) => (
        <span className="font-medium text-gray-700 dark:text-gray-200 truncate">
          {item.name}
        </span>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (val) => (
        <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
          <FiMail className="w-3 h-3 shrink-0" />
          <span className="text-xs truncate">{val}</span>
        </div>
      ),
    },
    {
      key: "role",
      label: "Role",
      render: (val) => {
        const badge = roleBadge(val);
        return (
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${badge.bg} ${badge.text} ${badge.border}`}
          >
            <FiShield className="w-3 h-3" />
            {badge.label}
          </span>
        );
      },
    },
    {
      key: "isActive",
      label: "Status",
      render: (val) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
            val
              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
              : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20"
          }`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${val ? "bg-emerald-500" : "bg-red-500"}`}
          />
          {val ? "Active" : "Blocked"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Registration Date",
      render: (val) => (
        <div className="flex items-center gap-1.5 text-gray-400 dark:text-gray-500">
          <FiClock className="w-3 h-3 shrink-0" />
          <span className="text-xs">{formatDate(val)}</span>
        </div>
      ),
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageBanner
        pageKey="users"
        icon={FiUsers}
        subtitle="Manage user accounts and roles"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FiUsers}
          label="Total Users"
          value={stats.total}
          pageKey="users"
          index={0}
        />
        <StatCard
          icon={FiShield}
          label="Admins"
          value={stats.admins}
          pageKey="users"
          index={1}
        />
        <StatCard
          icon={FiUserCheck}
          label="Trainers"
          value={stats.trainers}
          pageKey="users"
          index={2}
        />
        <StatCard
          icon={FiUser}
          label="Members"
          value={stats.members}
          pageKey="users"
          index={3}
        />
      </div>

      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-3 rounded-xl text-sm font-medium border ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
          }`}
        >
          {feedback.message}
        </motion.div>
      )}

      <DataTable
        data={users}
        columns={columns}
        accent="royal"
        searchPlaceholder="Search users by name or email..."
        searchKey="name"
        filterOptions={[
          { value: "ADMIN", label: "Admins" },
          { value: "TRAINER", label: "Trainers" },
          { value: "MEMBER", label: "Members" },
        ]}
        filterKey="role"
        rowsPerPage={8}
        loading={loading}
        onRefresh={fetchUsers}
        actions={(item) => (
          <div className="flex items-center gap-1">
            {item.id === currentUser?.id ? (
              <span className="px-2 py-1 rounded-lg bg-gray-50 dark:bg-gray-500/10 text-[10px] font-semibold text-gray-400 dark:text-gray-500 border border-gray-200 dark:border-gray-500/20">
                You
              </span>
            ) : (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewUser(item.id);
                  }}
                  className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="View details"
                  aria-label={`View ${item.name}`}
                >
                  <FiEye className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditUser(item);
                  }}
                  className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                  title="Edit user"
                  aria-label={`Edit ${item.name}`}
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmBlock(item);
                  }}
                  disabled={blocking === item.id}
                  className={`p-2 rounded-lg transition-colors disabled:opacity-50 ${
                    item.isActive
                      ? "hover:bg-amber-50 dark:hover:bg-amber-500/10 text-gray-400 hover:text-amber-600 dark:hover:text-amber-400"
                      : "hover:bg-emerald-50 dark:hover:bg-emerald-500/10 text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
                  }`}
                  title={item.isActive ? "Block user" : "Unblock user"}
                  aria-label={item.isActive ? `Block ${item.name}` : `Unblock ${item.name}`}
                >
                  {blocking === item.id ? (
                    <FiRefreshCw className="w-4 h-4 animate-spin" />
                  ) : item.isActive ? (
                    <FiEyeOff className="w-4 h-4" />
                  ) : (
                    <FiEye className="w-4 h-4" />
                  )}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setConfirmDelete(item);
                  }}
                  className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                  title="Delete user"
                  aria-label={`Delete ${item.name}`}
                >
                  <FiTrash2 className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        )}
      />

      <EditUserModal
        isOpen={!!editUser}
        user={editUser}
        onClose={() => setEditUser(null)}
        onSave={handleRoleChange}
        saving={savingEdit}
      />

      <ConfirmModal
        isOpen={!!confirmBlock}
        onClose={() => setConfirmBlock(null)}
        onConfirm={() => handleToggleBlock(confirmBlock?.id, confirmBlock?.isActive)}
        title={confirmBlock?.isActive ? "Block User" : "Unblock User"}
        message={
          confirmBlock?.isActive
            ? `Are you sure you want to block "${confirmBlock?.name}"? They will not be able to log in until unblocked.`
            : `Are you sure you want to unblock "${confirmBlock?.name}"? They will regain access to their account.`
        }
        confirmText={confirmBlock?.isActive ? "Block User" : "Unblock User"}
        type={confirmBlock?.isActive ? "danger" : "success"}
        loading={blocking === confirmBlock?.id}
      />

      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDeleteUser(confirmDelete?.id)}
        title="Delete User"
        message={`Are you sure you want to permanently delete "${confirmDelete?.name}"? This action cannot be undone and all their data will be removed.`}
        confirmText="Delete User"
        type="danger"
        loading={deleting}
      />

      <AnimatePresence>
        {viewUser || viewUserLoading ? (
          <UserDetailModal
            isOpen={true}
            user={viewUser}
            onClose={() => { setViewUser(null); setViewUserLoading(false); }}
            loading={viewUserLoading}
          />
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
}

export default UserManagement;
