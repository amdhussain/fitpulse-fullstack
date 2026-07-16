import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiSave,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiEdit2,
  FiLock,
  FiShield,
  FiActivity,
  FiCalendar,
  FiAward,
  FiCamera,
} from "react-icons/fi";
import { Button, SavedBadge, FileUpload } from "../../components/ui";
import { staggerContainer } from "../../lib/animations";
import { PageBanner, StatCard, CmsModal } from "../../components/dashboard";
import { getInputClass } from "../../lib/dashboardHelpers";

const accent = "indigo";

const initialData = {
  name: "Admin User",
  email: "admin@fitbookpro.com",
  phone: "+1 (555) 987-6543",
  role: "Super Admin",
  address: "123 Fitness Street, Wellness City, FC 12345",
  bio: "Platform administrator with 8+ years of experience managing fitness operations and digital platforms.",
  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&auto=format&q=80",
};

const activityItems = [
  { text: "Logged in from new device", time: "2 min ago", color: "bg-green-500" },
  { text: "Updated profile information", time: "1 hour ago", color: "bg-blue-500" },
  { text: "Changed password", time: "3 days ago", color: "bg-yellow-500" },
  { text: "Exported booking data", time: "1 week ago", color: "bg-blue-500" },
  { text: "Updated website settings", time: "2 weeks ago", color: "bg-yellow-500" },
];

function ProfileManagement() {
  const [form, setForm] = useState({ ...initialData });
  const [passwordForm, setPasswordForm] = useState({ current: "", newPass: "", confirm: "" });
  const [saved, setSaved] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);
  const inputClass = getInputClass(accent);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (passwordForm.newPass !== passwordForm.confirm) return;
    setPasswordSaved(true);
    setTimeout(() => {
      setPasswordSaved(false);
      setShowPasswordModal(false);
      setPasswordForm({ current: "", newPass: "", confirm: "" });
    }, 1500);
  };

  const getPasswordStrength = () => {
    const len = passwordForm.newPass.length;
    if (len === 0) return { label: "", width: "0%", color: "" };
    if (len < 6) return { label: "Weak", width: "33%", color: "bg-red-500" };
    if (len < 10) return { label: "Medium", width: "66%", color: "bg-yellow-500" };
    return { label: "Strong", width: "100%", color: "bg-green-500" };
  };

  const pwStrength = getPasswordStrength();

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
      <PageBanner pageKey="profile" subtitle="Manage your admin profile" />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiAward} label="Total Logins" value="1,247" pageKey="profile" index={0} />
        <StatCard icon={FiCalendar} label="Member Since" value="Jan 2023" pageKey="profile" index={1} />
        <StatCard icon={FiActivity} label="Last Active" value="Just now" pageKey="profile" index={2} />
        <StatCard icon={FiShield} label="Role" value="Super Admin" pageKey="profile" index={3} />
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
                    <img
                      src={form.image}
                      alt={form.name}
                      className="w-full h-full object-cover"
                    />
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
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">{form.name}</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{form.email}</p>
                  <span className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-medium">
                    <FiShield className="w-3 h-3" />
                    {form.role}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    <FiUser className="w-3.5 h-3.5 inline mr-1.5" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
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
                    value={form.email}
                    onChange={handleChange}
                    readOnly={!editing}
                    className={`${inputClass} ${!editing ? "cursor-not-allowed opacity-70" : ""}`}
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
                    className={`${inputClass} ${!editing ? "cursor-not-allowed opacity-70" : ""}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                    <FiShield className="w-3.5 h-3.5 inline mr-1.5" />
                    Role
                  </label>
                  <input
                    type="text"
                    name="role"
                    value={form.role}
                    readOnly
                    className={`${inputClass} cursor-not-allowed opacity-70`}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  <FiMapPin className="w-3.5 h-3.5 inline mr-1.5" />
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  readOnly={!editing}
                  className={`${inputClass} ${!editing ? "cursor-not-allowed opacity-70" : ""}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">Bio</label>
                <textarea
                  name="bio"
                  rows={3}
                  value={form.bio}
                  onChange={handleChange}
                  readOnly={!editing}
                  className={`${inputClass} resize-none ${!editing ? "cursor-not-allowed opacity-70" : ""}`}
                />
              </div>

              {editing && (
                <FileUpload label="Profile Photo" color="indigo" />
              )}

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
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 border border-gray-100 dark:border-gray-600 hover:border-indigo-200 dark:hover:border-indigo-700 text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all duration-200 text-sm font-medium"
              >
                <FiEdit2 className="w-4 h-4" />
                Download Data
              </button>
            </div>
          </div>

          <div className="rounded-2xl bg-white dark:bg-gray-800 backdrop-blur-xl border border-indigo-100 dark:border-indigo-800/50 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700">
              <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 uppercase tracking-wider">Recent Activity</h3>
            </div>
            <div className="divide-y divide-gray-50 dark:divide-gray-700">
              {activityItems.map((item, idx) => (
                <div key={idx} className="px-6 py-3.5 flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${item.color} shrink-0`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-600 dark:text-gray-300 truncate">{item.text}</p>
                  </div>
                  <span className="text-xs text-gray-400 dark:text-gray-500 shrink-0">{item.time}</span>
                </div>
              ))}
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
