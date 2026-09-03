import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiSave,
  FiGlobe,
  FiImage,
  FiSearch,
  FiMail,
  FiPhone,
  FiMapPin,
  FiClock,
  FiAlertTriangle,
  FiMonitor,
} from "react-icons/fi";
import { Button, SavedBadge, FileUpload, Skeleton } from "../../components/ui";
import { staggerContainer, fadeUp } from "../../lib/animations";
import PageBanner from "../../components/dashboard/PageBanner";
import { getSelectClass } from "../../lib/dashboardHelpers";

const API_URL = import.meta.env.API_URL;

function getAuthToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAuthToken()}`,
  };
}

const inputClass =
  "w-full px-4 py-2.5 rounded-xl bg-white/[0.03] dark:bg-white/[0.03] border border-white/[0.08] dark:border-white/[0.08] text-sm text-gray-100 placeholder:text-gray-500 outline-none transition-all duration-200 hover:border-white/[0.15] focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

const fonts = [
  "Inter",
  "Poppins",
  "Roboto",
  "Montserrat",
  "Raleway",
  "Playfair Display",
];

const cardBase =
  "rounded-2xl bg-gradient-to-br from-slate-900/80 via-slate-800/60 to-blue-950/40 backdrop-blur-xl border border-white/[0.06] hover:border-white/[0.1] shadow-lg shadow-black/20 transition-all duration-300";

const sectionIconBg = "w-9 h-9 rounded-xl flex items-center justify-center";

const sectionTitle =
  "text-sm font-semibold text-gray-300 uppercase tracking-wider";

function Toggle({ enabled, onChange, label, description }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <div>
        <p className="text-sm font-medium text-gray-200">{label}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
      <div
        className={`relative w-11 h-6 rounded-full transition-colors ${
          enabled
            ? "bg-gradient-to-r from-blue-500 to-indigo-500"
            : "bg-white/10"
        }`}
        onClick={onChange}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            enabled ? "translate-x-5" : ""
          }`}
        />
      </div>
    </label>
  );
}

const initialData = {
  siteName: "",
  siteTagline: "",
  siteDescription: "",
  siteLogo: "",
  favicon: "",
  primaryColor: "",
  secondaryColor: "",
  fontFamily: "Inter",
  seoTitle: "",
  seoDescription: "",
  metaKeywords: "",
  businessEmail: "",
  businessPhone: "",
  businessAddress: "",
  workingHours: "",
  googleMapUrl: "",
  maintenanceMode: false,
  darkMode: true,
};

function WebsiteSettings() {
  const [form, setForm] = useState(initialData);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/v1/settings/`, {
        headers: authHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        const settings = data.data || [];
        const settingsMap = {};
        if (Array.isArray(settings)) {
          settings.forEach((item) => {
            if (item.key && item.value !== undefined) {
              settingsMap[item.key] = item.value;
            }
          });
        } else if (data.grouped) {
          const allGrouped = Object.values(data.grouped).reduce(
            (acc, group) => ({ ...acc, ...group }),
            {}
          );
          Object.assign(settingsMap, allGrouped);
        }

        setForm((prev) => ({
          ...prev,
          siteName: settingsMap.site_name || "",
          siteTagline: settingsMap.site_tagline || "",
          siteDescription: settingsMap.site_description || "",
          siteLogo: settingsMap.logo || "",
          favicon: settingsMap.favicon || "",
          primaryColor: settingsMap.primary_color || "",
          secondaryColor: settingsMap.secondary_color || "",
          fontFamily: settingsMap.font_family || "Inter",
          seoTitle: settingsMap.meta_title || "",
          seoDescription: settingsMap.meta_description || "",
          metaKeywords: settingsMap.meta_keywords || "",
          businessEmail: settingsMap.contact_email || "",
          businessPhone: settingsMap.contact_phone || "",
          businessAddress: settingsMap.address || "",
          workingHours: settingsMap.business_hours || "",
          googleMapUrl: settingsMap.google_map_url || "",
          maintenanceMode:
            settingsMap.maintenance_mode === "true" ||
            settingsMap.maintenance_mode === true
              ? true
              : false,
          darkMode:
            settingsMap.dark_mode === "false" ||
            settingsMap.dark_mode === false
              ? false
              : true,
        }));
      }
    } catch {
      // use empty defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSaved(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const settingsPayload = [
        { key: "site_name", value: form.siteName },
        { key: "site_tagline", value: form.siteTagline },
        { key: "site_description", value: form.siteDescription },
        { key: "logo", value: form.siteLogo },
        { key: "favicon", value: form.favicon },
        { key: "primary_color", value: form.primaryColor },
        { key: "secondary_color", value: form.secondaryColor },
        { key: "font_family", value: form.fontFamily },
        { key: "meta_title", value: form.seoTitle },
        { key: "meta_description", value: form.seoDescription },
        { key: "meta_keywords", value: form.metaKeywords },
        { key: "contact_email", value: form.businessEmail },
        { key: "contact_phone", value: form.businessPhone },
        { key: "address", value: form.businessAddress },
        { key: "business_hours", value: form.workingHours },
        { key: "google_map_url", value: form.googleMapUrl },
        { key: "maintenance_mode", value: String(form.maintenanceMode) },
        { key: "dark_mode", value: String(form.darkMode) },
      ];

      const res = await fetch(`${API_URL}/api/v1/settings/`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({ settings: settingsPayload }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch {
      // silently fail
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="shimmer" className="h-28 rounded-2xl w-full" />
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-6 sm:p-8 space-y-5"
            >
              <Skeleton variant="shimmer" className="h-5 w-40 rounded-lg" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Skeleton variant="shimmer" className="h-11 w-full rounded-xl" />
                <Skeleton variant="shimmer" className="h-11 w-full rounded-xl" />
              </div>
              {i === 1 && (
                <Skeleton variant="shimmer" className="h-24 w-full rounded-xl" />
              )}
              {i === 2 && (
                <>
                  <Skeleton variant="shimmer" className="h-32 w-full rounded-xl" />
                  <Skeleton variant="shimmer" className="h-11 w-full rounded-xl" />
                </>
              )}
              {i === 3 && (
                <Skeleton variant="shimmer" className="h-20 w-full rounded-xl" />
              )}
              {i === 5 && (
                <div className="space-y-4">
                  <Skeleton variant="shimmer" className="h-14 w-full rounded-xl" />
                  <Skeleton variant="shimmer" className="h-14 w-full rounded-xl" />
                </div>
              )}
            </div>
          ))}
          <div className="flex items-center gap-3 pt-2">
            <Skeleton variant="shimmer" className="h-11 w-40 rounded-xl" />
            <Skeleton variant="shimmer" className="h-6 w-32 rounded-lg" />
          </div>
        </div>
      </div>
    );
  }

  const hasColors = form.primaryColor && form.secondaryColor;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageBanner
        pageKey="settings"
        subtitle="Configure your website settings"
      />

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* Section 1: General Settings */}
        <motion.div variants={fadeUp} className={`${cardBase} p-6 sm:p-8 space-y-5`}>
          <div className="flex items-center gap-3">
            <div className={`${sectionIconBg} bg-gradient-to-br from-blue-500/20 to-indigo-500/10 border border-blue-500/20`}>
              <FiGlobe className="w-4 h-4 text-blue-400" />
            </div>
            <h3 className={sectionTitle}>General Settings</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                value={form.siteName}
                onChange={handleChange}
                placeholder="Enter your site name"
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Site Tagline
              </label>
              <input
                type="text"
                name="siteTagline"
                value={form.siteTagline}
                onChange={handleChange}
                placeholder="Enter your site tagline"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Site Description
            </label>
            <textarea
              name="siteDescription"
              value={form.siteDescription}
              onChange={handleChange}
              rows={3}
              placeholder="Describe your website"
              className={`${inputClass} resize-none`}
            />
          </div>
        </motion.div>

        {/* Section 2: Branding */}
        <motion.div variants={fadeUp} className={`${cardBase} p-6 sm:p-8 space-y-5`}>
          <div className="flex items-center gap-3">
            <div className={`${sectionIconBg} bg-gradient-to-br from-purple-500/20 to-violet-500/10 border border-purple-500/20`}>
              <FiImage className="w-4 h-4 text-purple-400" />
            </div>
            <h3 className={sectionTitle}>Branding</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FileUpload
              label="Website Logo"
              value={form.siteLogo}
              onChange={() => {}}
              color="violet"
            />
            <FileUpload
              label="Favicon"
              value={form.favicon}
              onChange={() => {}}
              color="violet"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Primary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="primaryColor"
                  value={form.primaryColor || "#6366f1"}
                  onChange={handleChange}
                  className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  name="primaryColor"
                  value={form.primaryColor}
                  onChange={handleChange}
                  placeholder="#000000"
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Secondary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="secondaryColor"
                  value={form.secondaryColor || "#8b5cf6"}
                  onChange={handleChange}
                  className="w-10 h-10 rounded-lg border border-white/10 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  name="secondaryColor"
                  value={form.secondaryColor}
                  onChange={handleChange}
                  placeholder="#000000"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Font Family
            </label>
            <div className="select-wrapper">
            <select
              name="fontFamily"
              value={form.fontFamily}
              onChange={handleChange}
              className={getSelectClass("indigo")}
            >
              {fonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
            </div>
          </div>

          {hasColors && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3">
                Color Preview
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg border border-white/10 shadow-lg"
                    style={{ backgroundColor: form.primaryColor }}
                  />
                  <span className="text-xs text-gray-400">
                    {form.primaryColor}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded-lg border border-white/10 shadow-lg"
                    style={{ backgroundColor: form.secondaryColor }}
                  />
                  <span className="text-xs text-gray-400">
                    {form.secondaryColor}
                  </span>
                </div>
                <div className="flex-1 h-8 rounded-lg overflow-hidden flex">
                  <div
                    className="flex-1"
                    style={{ backgroundColor: form.primaryColor }}
                  />
                  <div
                    className="flex-1"
                    style={{ backgroundColor: form.secondaryColor }}
                  />
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Section 3: SEO Settings */}
        <motion.div variants={fadeUp} className={`${cardBase} p-6 sm:p-8 space-y-5`}>
          <div className="flex items-center gap-3">
            <div className={`${sectionIconBg} bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border border-cyan-500/20`}>
              <FiSearch className="w-4 h-4 text-cyan-400" />
            </div>
            <h3 className={sectionTitle}>SEO Settings</h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              SEO Title
            </label>
            <input
              type="text"
              name="seoTitle"
              value={form.seoTitle}
              onChange={handleChange}
              placeholder="Page title for search engines"
              className={inputClass}
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-gray-500">
                Recommended: 50-60 characters for optimal search display
              </p>
              <p
                className={`text-xs ${
                  form.seoTitle.length > 60
                    ? "text-amber-400"
                    : "text-gray-500"
                }`}
              >
                {form.seoTitle.length}/60
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              SEO Description
            </label>
            <textarea
              name="seoDescription"
              value={form.seoDescription}
              onChange={handleChange}
              rows={3}
              placeholder="Page description for search engines"
              className={`${inputClass} resize-none`}
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-gray-500">
                Recommended: 150-160 characters for search engine snippets
              </p>
              <p
                className={`text-xs ${
                  form.seoDescription.length > 160
                    ? "text-amber-400"
                    : "text-gray-500"
                }`}
              >
                {form.seoDescription.length}/160
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Meta Keywords
            </label>
            <input
              type="text"
              name="metaKeywords"
              value={form.metaKeywords}
              onChange={handleChange}
              placeholder="Comma-separated keywords for search engine optimization"
              className={inputClass}
            />
          </div>
        </motion.div>

        {/* Section 4: Business Information */}
        <motion.div variants={fadeUp} className={`${cardBase} p-6 sm:p-8 space-y-5`}>
          <div className="flex items-center gap-3">
            <div className={`${sectionIconBg} bg-gradient-to-br from-emerald-500/20 to-green-500/10 border border-emerald-500/20`}>
              <FiMail className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className={sectionTitle}>Business Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Business Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="email"
                  name="businessEmail"
                  value={form.businessEmail}
                  onChange={handleChange}
                  placeholder="you@company.com"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1.5">
                Business Phone
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="tel"
                  name="businessPhone"
                  value={form.businessPhone}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Business Address
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-3.5 top-4 w-4 h-4 text-gray-500" />
              <input
                type="text"
                name="businessAddress"
                value={form.businessAddress}
                onChange={handleChange}
                placeholder="123 Street, City, State, ZIP"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Working Hours
            </label>
            <div className="relative">
              <FiClock className="absolute left-3.5 top-4 w-4 h-4 text-gray-500" />
              <input
                type="text"
                name="workingHours"
                value={form.workingHours}
                onChange={handleChange}
                placeholder="Mon-Fri: 9:00 AM - 6:00 PM"
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1.5">
              Google Map URL
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="url"
                name="googleMapUrl"
                value={form.googleMapUrl}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>
        </motion.div>

        {/* Section 5: Advanced */}
        <motion.div variants={fadeUp} className={`${cardBase} p-6 sm:p-8 space-y-5`}>
          <div className="flex items-center gap-3">
            <div className={`${sectionIconBg} bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20`}>
              <FiAlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <h3 className={sectionTitle}>Advanced</h3>
          </div>

          <div className="space-y-4">
            <Toggle
              enabled={form.maintenanceMode}
              onChange={() =>
                setForm((prev) => ({
                  ...prev,
                  maintenanceMode: !prev.maintenanceMode,
                }))
              }
              label="Maintenance Mode"
              description="Temporarily disable public access to the site for maintenance"
            />

            {form.maintenanceMode && (
              <div className="rounded-xl bg-amber-500/10 border border-amber-500/20 px-4 py-3 flex items-start gap-3">
                <FiAlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-amber-400">
                    Maintenance Mode is Active
                  </p>
                  <p className="text-xs text-amber-300/70 mt-0.5">
                    Your site is currently in maintenance mode. Only admins can
                    access the frontend. Remember to disable it when maintenance
                    is complete.
                  </p>
                </div>
              </div>
            )}

            <div className="border-t border-white/[0.06]" />

            <Toggle
              enabled={form.darkMode}
              onChange={() =>
                setForm((prev) => ({
                  ...prev,
                  darkMode: !prev.darkMode,
                }))
              }
              label="Dark Mode"
              description="Enable dark mode as the default theme for your website"
            />

            <div className="border-t border-white/[0.06]" />

            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiMonitor className="w-3.5 h-3.5 text-gray-500" />
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current Status
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      form.maintenanceMode ? "bg-amber-400" : "bg-emerald-400"
                    }`}
                  />
                  <span className="text-xs text-gray-400">
                    {form.maintenanceMode ? "Maintenance" : "Live"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      form.darkMode ? "bg-blue-400" : "bg-sky-400"
                    }`}
                  />
                  <span className="text-xs text-gray-400">
                    {form.darkMode ? "Dark Theme" : "Light Theme"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Section 6: Footer / Save */}
        <motion.div
          variants={fadeUp}
          className="flex items-center gap-3 pt-2"
        >
          <Button
            type="submit"
            variant="purple"
            size="md"
            className="group"
            disabled={saving}
          >
            <FiSave className="w-4 h-4" />
            {saving ? "Saving..." : "Save Settings"}
          </Button>
          <SavedBadge show={saved} />
        </motion.div>
      </form>
    </motion.div>
  );
}

export default WebsiteSettings;
