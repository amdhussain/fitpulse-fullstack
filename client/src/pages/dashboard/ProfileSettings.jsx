import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Navigate } from "react-router-dom";
import {
  FiSave, FiUser, FiMail, FiLock, FiShield,
  FiEye, FiEyeOff, FiCheck, FiAlertCircle,
} from "react-icons/fi";
import { Button, SavedBadge } from "../../components/ui";
import { staggerContainer, fadeUp } from "../../lib/animations";
import { PageBanner } from "../../components/dashboard";
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

function PasswordStrength({ value }) {
  if (!value) return null;
  let score = 0;
  if (value.length >= 8) score++;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score++;
  if (/\d/.test(value)) score++;
  if (/[@$!%*?&.#^()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) score++;

  const map = {
    1: { label: "Weak", width: "25%", color: "bg-red-500" },
    2: { label: "Fair", width: "50%", color: "bg-orange-500" },
    3: { label: "Good", width: "75%", color: "bg-yellow-500" },
    4: { label: "Strong", width: "100%", color: "bg-green-500" },
  };
  const s = map[score] || map[1];

  return (
    <div className="flex items-center gap-2 mt-2">
      <div className="flex-1 h-1.5 rounded-full bg-gray-200 dark:bg-gray-600 overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-300 ${s.color}`} style={{ width: s.width }} />
      </div>
      <span className="text-xs font-medium text-gray-400 dark:text-gray-500">{s.label}</span>
    </div>
  );
}

function PasswordInput({ label, name, value, onChange, placeholder, icon: Icon = FiLock, required, error }) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
        <Icon className="w-3.5 h-3.5 inline mr-1.5" />
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`${getInputClass(accent)} pr-10`}
          required={required}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          tabIndex={-1}
        >
          {show ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500 dark:text-red-400">{error}</p>}
    </div>
  );
}

function SectionCard({ title, subtitle, children }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
      <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
        {subtitle && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-6">{children}</div>
    </motion.div>
  );
}

function parseError(result) {
  if (result.errors && Array.isArray(result.errors) && result.errors.length > 0) {
    return result.errors.map((e) => e.message).join(". ");
  }
  return result.message || "Something went wrong";
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ProfileSettings() {
  const { user, updateUser, isAdmin } = useAuth();
  const inputClass = getInputClass(accent);

  if (!isAdmin) {
    return <Navigate to="/dashboard/profile" replace />;
  }

  const [profile, setProfile] = useState({ firstName: "", lastName: "" });
  const [emailForm, setEmailForm] = useState({ newEmail: "", password: "" });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });

  const [loading, setLoading] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingEmail, setSavingEmail] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);

  const [profileSaved, setProfileSaved] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const [profileError, setProfileError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`${API_URL}/api/v1/user/me`, { headers: getAuthHeaders() });
        if (res.ok) {
          const result = await res.json();
          const d = result.data;
          setProfile({ firstName: d.firstName || "", lastName: d.lastName || "" });
        }
      } catch {
        if (user) {
          setProfile({ firstName: user.firstName || "", lastName: user.lastName || "" });
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProfile();
  }, [user]);

  const handleProfileChange = (e) => {
    setProfile((p) => ({ ...p, [e.target.name]: e.target.value }));
    setProfileError("");
  };

  const handleEmailChange = (e) => {
    setEmailForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setEmailError("");
  };

  const handlePasswordChange = (e) => {
    setPasswordForm((p) => ({ ...p, [e.target.name]: e.target.value }));
    setPasswordError("");
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setProfileError("");
    setSavingProfile(true);
    try {
      const payload = {};
      if (profile.firstName.trim()) payload.firstName = profile.firstName.trim();
      if (profile.lastName.trim()) payload.lastName = profile.lastName.trim();

      if (Object.keys(payload).length === 0) {
        setProfileError("No fields to update");
        setSavingProfile(false);
        return;
      }

      const res = await fetch(`${API_URL}/api/v1/user/admin/settings`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(parseError(result));
      updateUser(result.data);
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 2000);
    } catch (err) {
      setProfileError(err.message);
    } finally {
      setSavingProfile(false);
    }
  };

  const handleSaveEmail = async (e) => {
    e.preventDefault();
    setEmailError("");
    if (!emailForm.newEmail.trim()) {
      setEmailError("New email is required");
      return;
    }
    if (!emailRegex.test(emailForm.newEmail.trim())) {
      setEmailError("Please enter a valid email address");
      return;
    }
    if (!emailForm.password) {
      setEmailError("Password is required to change email");
      return;
    }
    setSavingEmail(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/user/admin/email`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ newEmail: emailForm.newEmail.trim(), password: emailForm.password }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(parseError(result));
      updateUser(result.data);
      setEmailForm({ newEmail: "", password: "" });
      setEmailSaved(true);
      setTimeout(() => setEmailSaved(false), 2000);
    } catch (err) {
      setEmailError(err.message);
    } finally {
      setSavingEmail(false);
    }
  };

  const handleSavePassword = async (e) => {
    e.preventDefault();
    setPasswordError("");
    if (!passwordForm.currentPassword) {
      setPasswordError("Current password is required");
      return;
    }
    if (passwordForm.newPassword !== passwordForm.confirm) {
      setPasswordError("Passwords do not match");
      return;
    }
    if (!passwordRegex.test(passwordForm.newPassword)) {
      setPasswordError("Password must be at least 8 characters with uppercase, lowercase, number, and special character.");
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/user/admin/password`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ currentPassword: passwordForm.currentPassword, newPassword: passwordForm.newPassword }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(parseError(result));
      setPasswordForm({ currentPassword: "", newPassword: "", confirm: "" });
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 2000);
    } catch (err) {
      setPasswordError(err.message);
    } finally {
      setSavingPassword(false);
    }
  };

  const fullName = `${profile.firstName} ${profile.lastName}`.trim() || "User";
  const userInitial = profile.firstName?.charAt(0)?.toUpperCase() || "U";

  if (loading) {
    return (
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <div className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] p-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-white/5 animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-48 rounded-lg bg-gray-100 dark:bg-white/5 animate-pulse" />
              <div className="h-4 w-64 rounded-lg bg-gray-50 dark:bg-white/[0.03] animate-pulse" />
            </div>
          </div>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] p-6 space-y-4">
            <div className="h-5 w-40 rounded-lg bg-gray-100 dark:bg-white/5 animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              {[1, 2].map((j) => (
                <div key={j} className="space-y-2">
                  <div className="h-3 w-20 rounded bg-gray-50 dark:bg-white/[0.03] animate-pulse" />
                  <div className="h-11 w-full rounded-xl bg-gray-50 dark:bg-white/[0.03] animate-pulse" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </motion.div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <PageBanner pageKey="profile-settings" subtitle="Admin profile settings - update your profile, email, and password" />

      {/* Profile Summary */}
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] p-6">
        <div className="flex flex-col sm:flex-row items-center gap-5">
          <div className="shrink-0">
            <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-indigo-200 dark:border-indigo-500/30">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold">
                {userInitial}
              </div>
            </div>
          </div>
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{fullName}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
            <span className="inline-flex items-center gap-1 mt-1 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 text-xs font-semibold">
              <FiShield className="w-3 h-3" />
              Administrator
            </span>
          </div>
        </div>
      </motion.div>

      {/* Profile Information */}
      <SectionCard title="Profile Information" subtitle="Update your personal details">
        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                <FiUser className="w-3.5 h-3.5 inline mr-1.5" />
                First Name
              </label>
              <input type="text" name="firstName" value={profile.firstName} onChange={handleProfileChange} className={inputClass} required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                <FiUser className="w-3.5 h-3.5 inline mr-1.5" />
                Last Name
              </label>
              <input type="text" name="lastName" value={profile.lastName} onChange={handleProfileChange} className={inputClass} required />
            </div>
          </div>

          {profileError && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <FiAlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400">{profileError}</p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="indigo" size="md" disabled={savingProfile}>
              {savingProfile ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Saving...</span>
              ) : (
                <><FiSave className="w-4 h-4" /> Save Profile</>
              )}
            </Button>
            <SavedBadge show={profileSaved} />
          </div>
        </form>
      </SectionCard>

      {/* Email Settings */}
      <SectionCard title="Email Address" subtitle="Change your account email (requires password confirmation)">
        <form onSubmit={handleSaveEmail} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
              <FiMail className="w-3.5 h-3.5 inline mr-1.5" />
              Current Email
            </label>
            <input type="email" value={user?.email || ""} readOnly className={`${inputClass} cursor-not-allowed opacity-70`} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                <FiMail className="w-3.5 h-3.5 inline mr-1.5" />
                New Email
              </label>
              <input type="email" name="newEmail" value={emailForm.newEmail} onChange={handleEmailChange} placeholder="Enter new email" className={inputClass} required />
            </div>
            <div>
              <PasswordInput label="Confirm Password" name="password" value={emailForm.password} onChange={handleEmailChange} placeholder="Enter your password" required />
            </div>
          </div>

          {emailError && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <FiAlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400">{emailError}</p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="indigo" size="md" disabled={savingEmail}>
              {savingEmail ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</span>
              ) : (
                <><FiSave className="w-4 h-4" /> Update Email</>
              )}
            </Button>
            <SavedBadge show={emailSaved} />
          </div>
        </form>
      </SectionCard>

      {/* Password & Security */}
      <SectionCard title="Password & Security" subtitle="Change your account password">
        <form onSubmit={handleSavePassword} className="space-y-5">
          <div>
            <PasswordInput label="Current Password" name="currentPassword" value={passwordForm.currentPassword} onChange={handlePasswordChange} placeholder="Enter current password" required />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <PasswordInput label="New Password" name="newPassword" value={passwordForm.newPassword} onChange={handlePasswordChange} placeholder="Enter new password" required />
              <PasswordStrength value={passwordForm.newPassword} />
            </div>
            <div>
              <PasswordInput label="Confirm New Password" name="confirm" value={passwordForm.confirm} onChange={handlePasswordChange} placeholder="Confirm new password" required />
              {passwordForm.confirm && passwordForm.newPassword !== passwordForm.confirm && (
                <p className="mt-1 text-xs text-red-500 dark:text-red-400 flex items-center gap-1">
                  <FiAlertCircle className="w-3 h-3" /> Passwords do not match
                </p>
              )}
              {passwordForm.confirm && passwordForm.newPassword === passwordForm.confirm && passwordForm.confirm.length > 0 && (
                <p className="mt-1 text-xs text-green-600 dark:text-green-400 flex items-center gap-1">
                  <FiCheck className="w-3 h-3" /> Passwords match
                </p>
              )}
            </div>
          </div>

          {passwordError && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20">
              <FiAlertCircle className="w-4 h-4 text-red-500 dark:text-red-400 shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-400">{passwordError}</p>
            </div>
          )}

          <div className="flex items-center gap-3 pt-2">
            <Button type="submit" variant="indigo" size="md" disabled={savingPassword}>
              {savingPassword ? (
                <span className="flex items-center gap-2"><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Updating...</span>
              ) : (
                <><FiSave className="w-4 h-4" /> Change Password</>
              )}
            </Button>
            <SavedBadge show={passwordSaved} />
          </div>
        </form>
      </SectionCard>
    </motion.div>
  );
}

export default ProfileSettings;
