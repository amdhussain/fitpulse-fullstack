import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiSave,
  FiUser,
  FiMail,
  FiPhone,
  FiEdit2,
  FiLock,
  FiShield,
  FiActivity,
  FiCalendar,
  FiAward,
  FiCamera,
} from "react-icons/fi";
import { Button, SavedBadge } from "../../components/ui";
import { staggerContainer } from "../../lib/animations";
import { PageBanner, StatCard, CmsModal } from "../../components/dashboard";
import { getInputClass } from "../../lib/dashboardHelpers";
import { useAuth } from "../../context/AuthContext";

const accent = "indigo";
const API_URL = import.meta.env.API_URL;

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d@$!%*?&.#^()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

function ProfileManagement() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ firstName: "", lastName: "", phone: "", profileImage: "" });
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [saved, setSaved] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [passwordSaved, setPasswordSaved] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const inputClass = getInputClass(accent);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API_URL}/api/v1/user/me`, { headers: getAuthHeaders() });
        if (res.ok) {
          const result = await res.json();
          const data = result.data;
          setForm({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            phone: data.phone || "",
            profileImage: data.profileImage || "",
          });
        }
      } catch {
        // Use auth context data as fallback
        if (user) {
          setForm({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            phone: user.phone || "",
            profileImage: user.profileImage || "",
          });
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setProfileError("");
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setPasswordError("");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileError("");
    try {
      const res = await fetch(`${API_URL}/api/v1/user/me`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ firstName: form.firstName, lastName: form.lastName, phone: form.phone, profileImage: form.profileImage }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to update profile");
      }
      updateUser(result.data);
      setEditing(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setProfileError(err.message);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (passwordForm.newPass !== passwordForm.confirm) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (!passwordRegex.test(passwordForm.newPass)) {
      setPasswordError("Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.");
      return;
    }
    try {
      const res = await fetch(`${API_URL}/api/v1/user/me/password`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword: passwordForm.current, newPassword: passwordForm.newPass }),
      });
      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.message || "Failed to change password");
      }
      setPasswordSaved(true);
      setPasswordError("");
      setTimeout(() => {
        setPasswordSaved(false);
        setShowPasswordModal(false);
        setPasswordForm({ current: "", newPass: "", confirm: "" });
      }, 1500);
    } catch (err) {
      setPasswordError(err.message);
    }
  };

  const getPasswordStrength = () => {
    const pw = passwordForm.newPass;
    const len = pw.length;
    if (len === 0) return { label: "", width: "0%", color: "" };
    let score = 0;
    if (len >= 8) score++;
    if (/[a-z]/.test(pw) && /[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[@$!%*?&.#^()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pw)) score++;
    if (score <= 1) return { label: "Weak", width: "25%", color: "bg-red-500" };
    if (score <= 2) return { label: "Fair", width: "50%", color: "bg-orange-500" };
    if (score <= 3) return { label: "Good", width: "75%", color: "bg-yellow-500" };
    return { label: "Strong", width: "100%", color: "bg-green-500" };
  };

  const pwStrength = getPasswordStrength();
  const fullName = `${form.firstName} ${form.lastName}`.trim() || "User";
  const userInitial = form.firstName?.charAt(0)?.toUpperCase() || "U";
  const roleLabel = user?.role === "ADMIN" ? "Administrator" : user?.role === "TRAINER" ? "Trainer" : "Member";
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : "N/A";

  if (loading) {
    return (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6"
      >
        <div className="bg-gradient-to-r from-indigo-50 dark:from-indigo-950/30 to-blue-50 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-40 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 animate-pulse" />
              <div className="h-3 w-56 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 animate-pulse" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="p-5 rounded-2xl bg-white dark:bg-gray-800 border border-indigo-100/50 dark:border-indigo-800/30 space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 animate-pulse" />
                <div className="h-3 w-12 rounded-full bg-indigo-50 dark:bg-indigo-900/30 animate-pulse" />
              </div>
              <div className="space-y-2">
                <div className="h-6 w-16 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 animate-pulse" />
                <div className="h-3 w-20 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 animate-pulse" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-800/50 p-6 space-y-6">
              <div className="flex items-center gap-2">
                <div className="h-5 w-32 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 animate-pulse" />
              </div>
              <div className="flex items-center gap-6">
                <div className="w-28 h-28 rounded-2xl bg-indigo-50 dark:bg-indigo-900/30 animate-pulse shrink-0" />
                <div className="space-y-2">
                  <div className="h-5 w-36 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 animate-pulse" />
                  <div className="h-3 w-48 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 animate-pulse" />
                  <div className="h-3 w-24 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-3 w-20 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 animate-pulse" />
                    <div className="h-11 w-full rounded-xl bg-indigo-50 dark:bg-indigo-900/30 animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-2xl bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-800/50 p-6 space-y-3">
              <div className="h-5 w-28 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 animate-pulse" />
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-11 w-full rounded-xl bg-indigo-50 dark:bg-indigo-900/30 animate-pulse" />
              ))}
            </div>
            <div className="rounded-2xl bg-white dark:bg-gray-800 border border-indigo-100 dark:border-indigo-800/50 p-6 space-y-3">
              <div className="h-5 w-32 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 animate-pulse" />
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-100 dark:bg-indigo-900/50 animate-pulse" />
                  <div className="h-3 flex-1 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 animate-pulse" />
                  <div className="h-3 w-14 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageBanner pageKey="profile" subtitle="Manage your profile" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiAward} label="Total Logins" value={user?.lastLoginAt ? "Active" : "N/A"} pageKey="profile" index={0} />
        <StatCard icon={FiCalendar} label="Member Since" value={memberSince} pageKey="profile" index={1} />
        <StatCard icon={FiActivity} label="Last Active" value="Just now" pageKey="profile" index={2} />
        <StatCard icon={FiShield} label="Role" value={roleLabel} pageKey="profile" index={3} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="rounded-2xl bg-white dark:bg-gray-800 backdrop-blur-xl border border-indigo-100 dark:border-indigo-800/50 overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Profile Information</h2>
              <Button
                variant="indigo"
                size="sm"
                onClick={() => setEditing((prev) => !prev)}
              >
                <FiEdit2 className="w-4 h-4" />
                {editing ? "Cancel" : "Edit"}
              </Button>
            </div>

            <form onSubmit={handleSaveProfile} className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-100 dark:border-gray-700">
                <div className="relative shrink-0">
                  <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-indigo-200 dark:border-indigo-700">
                    {form.profileImage ? (
                      <img
                        src={form.profileImage}
                        alt={fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                        {userInitial}
                      </div>
                    )}
                  </div>
                  {editing && (
                    <button
                      type="button"
                      className="absolute -bottom-1 -right-1 p-2 rounded-xl bg-indigo-500 text-white shadow-lg shadow-indigo-500/30 hover:bg-indigo-600 transition-colors"
                      aria-label="Change photo"
                    >
                      <FiCamera className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{fullName}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                  <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                    <FiShield className="w-3 h-3" />
                    {roleLabel}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    <FiUser className="w-3.5 h-3.5 inline mr-1.5" />
                    First Name
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={form.firstName}
                    onChange={handleChange}
                    readOnly={!editing}
                    className={`${inputClass} ${!editing ? "cursor-not-allowed opacity-70" : ""}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    <FiUser className="w-3.5 h-3.5 inline mr-1.5" />
                    Last Name
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={form.lastName}
                    onChange={handleChange}
                    readOnly={!editing}
                    className={`${inputClass} ${!editing ? "cursor-not-allowed opacity-70" : ""}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    <FiMail className="w-3.5 h-3.5 inline mr-1.5" />
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={user?.email || ""}
                    readOnly
                    className={`${inputClass} cursor-not-allowed opacity-70`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    <FiPhone className="w-3.5 h-3.5 inline mr-1.5" />
                    Phone
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    readOnly={!editing}
                    placeholder="Add phone number"
                    className={`${inputClass} ${!editing ? "cursor-not-allowed opacity-70" : ""}`}
                  />
                </div>
              </div>

              {profileError && <p className="text-xs text-red-500">{profileError}</p>}

              <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                <Button type="submit" variant="indigo" size="md" disabled={!editing}>
                  <FiSave className="w-4 h-4" />
                  Save Profile
                </Button>
                <SavedBadge show={saved} />
              </div>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="rounded-2xl bg-white dark:bg-gray-800 backdrop-blur-xl border border-indigo-100 dark:border-indigo-800/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Quick Actions</h3>
            </div>
            <div className="p-4 space-y-3">
              <button
                type="button"
                onClick={() => setShowPasswordModal(true)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-gray-100 dark:border-gray-600 hover:border-indigo-200 dark:hover:border-indigo-700 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 text-sm font-medium"
              >
                <FiLock className="w-4 h-4" />
                Change Password
              </button>
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-gray-100 dark:border-gray-600 hover:border-indigo-200 dark:hover:border-indigo-700 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 text-sm font-medium"
              >
                <FiActivity className="w-4 h-4" />
                View Activity Log
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-gray-800 backdrop-blur-xl border border-indigo-100 dark:border-indigo-800/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Account Info</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                  <FiShield className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Role</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{roleLabel}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                  <FiMail className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center">
                  <FiUser className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Account Status</p>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <CmsModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false);
          setPasswordForm({ current: "", newPass: "", confirm: "" });
        }}
        title="Change Password"
        subtitle="Update your account password"
        size="md"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              <FiLock className="w-3.5 h-3.5 inline mr-1.5" />
              Current Password
            </label>
            <input
              type="password"
              name="current"
              value={passwordForm.current}
              onChange={handlePasswordChange}
              placeholder="Enter current password"
              className={inputClass}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              <FiLock className="w-3.5 h-3.5 inline mr-1.5" />
              New Password
            </label>
            <input
              type="password"
              name="newPass"
              value={passwordForm.newPass}
              onChange={handlePasswordChange}
              placeholder="Enter new password"
              className={inputClass}
              required
            />
          </div>
          {passwordForm.newPass && (
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${pwStrength.color}`}
                    style={{ width: pwStrength.width }}
                  />
                </div>
                <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{pwStrength.label}</span>
              </div>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              <FiLock className="w-3.5 h-3.5 inline mr-1.5" />
              Confirm Password
            </label>
            <input
              type="password"
              name="confirm"
              value={passwordForm.confirm}
              onChange={handlePasswordChange}
              placeholder="Confirm new password"
              className={inputClass}
              required
            />
            {passwordForm.confirm && passwordForm.newPass !== passwordForm.confirm && (
              <p className="mt-1.5 text-xs text-red-400">Passwords do not match</p>
            )}
          </div>

          {passwordError && (
            <p className="text-xs text-red-400">{passwordError}</p>
          )}

          <div className="flex items-center gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
            <Button type="submit" variant="indigo" size="md">
              <FiSave className="w-4 h-4" />
              Save Password
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="md"
              onClick={() => {
                setShowPasswordModal(false);
                setPasswordForm({ current: "", newPass: "", confirm: "" });
              }}
            >
              Cancel
            </Button>
            <SavedBadge show={passwordSaved} />
          </div>
        </form>
      </CmsModal>
    </motion.div>
  );
}

export default ProfileManagement;
