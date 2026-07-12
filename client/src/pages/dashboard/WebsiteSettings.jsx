import { useState, useEffect } from "react";
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
import { getInputClass } from "../../lib/dashboardHelpers";

const fonts = [
  "Inter",
  "Poppins",
  "Roboto",
  "Montserrat",
  "Raleway",
  "Playfair Display",
];

function Toggle({ enabled, onChange, label, description }) {
  return (
    <label className="flex items-center justify-between cursor-pointer group">
      <div>
        <p className="text-sm font-medium text-white/80">{label}</p>
        <p className="text-xs text-white/40">{description}</p>
      </div>
      <div
        className={`relative w-11 h-6 rounded-full transition-colors ${
          enabled ? "bg-violet-500" : "bg-white/10"
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
  siteName: "FitBookPro",
  siteTagline: "Train Smarter. Live Stronger.",
  siteDescription:
    "Your premier fitness booking platform connecting enthusiasts with world-class trainers.",

  siteLogo:
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=60&fit=crop&auto=format&q=80",
  favicon: "",
  primaryColor: "#6366f1",
  secondaryColor: "#8b5cf6",
  fontFamily: "Inter",

  seoTitle: "FitBookPro - Premium Fitness Booking Platform",
  seoDescription:
    "Book professional fitness classes, discover expert trainers, and transform your fitness journey with FitBookPro.",
  metaKeywords:
    "fitness, gym, booking, personal training, yoga, crossfit, wellness",

  businessEmail: "info@fitbookpro.com",
  businessPhone: "+1 (555) 123-4567",
  businessAddress: "123 Fitness Street, Wellness City, FC 12345",
  workingHours:
    "Mon-Fri: 5:00 AM - 10:00 PM, Sat-Sun: 6:00 AM - 8:00 PM",
  googleMapUrl: "",

  maintenanceMode: false,
  darkMode: true,
};

function WebsiteSettings() {
  const [form, setForm] = useState(initialData);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const inputClass = getInputClass("violet");

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setSaved(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="shimmer" className="h-28 rounded-2xl w-full" />
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/10 p-6 sm:p-8 space-y-5"
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
        <motion.div
          variants={fadeUp}
          className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/10 p-6 sm:p-8 space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <FiGlobe className="w-4 h-4 text-violet-400" />
            </div>
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
              General Settings
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">
                Site Name
              </label>
              <input
                type="text"
                name="siteName"
                value={form.siteName}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">
                Site Tagline
              </label>
              <input
                type="text"
                name="siteTagline"
                value={form.siteTagline}
                onChange={handleChange}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">
              Site Description
            </label>
            <textarea
              name="siteDescription"
              value={form.siteDescription}
              onChange={handleChange}
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
        </motion.div>

        {/* Section 2: Branding */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/10 p-6 sm:p-8 space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <FiImage className="w-4 h-4 text-violet-400" />
            </div>
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
              Branding
            </h3>
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
              <label className="block text-sm font-medium text-white/60 mb-1.5">
                Primary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="primaryColor"
                  value={form.primaryColor}
                  onChange={handleChange}
                  className="w-10 h-10 rounded-lg border border-gray-800/60 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  name="primaryColor"
                  value={form.primaryColor}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">
                Secondary Color
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  name="secondaryColor"
                  value={form.secondaryColor}
                  onChange={handleChange}
                  className="w-10 h-10 rounded-lg border border-gray-800/60 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  name="secondaryColor"
                  value={form.secondaryColor}
                  onChange={handleChange}
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">
              Font Family
            </label>
            <select
              name="fontFamily"
              value={form.fontFamily}
              onChange={handleChange}
              className={inputClass}
            >
              {fonts.map((font) => (
                <option key={font} value={font}>
                  {font}
                </option>
              ))}
            </select>
          </div>

          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
            <p className="text-xs font-medium text-white/30 uppercase tracking-wider mb-3">
              Color Preview
            </p>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg border border-white/10 shadow-lg"
                  style={{ backgroundColor: form.primaryColor }}
                />
                <span className="text-xs text-white/50">
                  {form.primaryColor}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 rounded-lg border border-white/10 shadow-lg"
                  style={{ backgroundColor: form.secondaryColor }}
                />
                <span className="text-xs text-white/50">
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
            <p className="text-xs text-white/20 mt-2" style={{ fontFamily: form.fontFamily }}>
              Sample text in {form.fontFamily} — {form.siteTagline}
            </p>
          </div>
        </motion.div>

        {/* Section 3: SEO Settings */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/10 p-6 sm:p-8 space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <FiSearch className="w-4 h-4 text-violet-400" />
            </div>
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
              SEO Settings
            </h3>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">
              SEO Title
            </label>
            <input
              type="text"
              name="seoTitle"
              value={form.seoTitle}
              onChange={handleChange}
              className={inputClass}
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-white/30">
                Recommended: 50-60 characters for optimal search display
              </p>
              <p
                className={`text-xs ${
                  form.seoTitle.length > 60
                    ? "text-amber-400"
                    : "text-white/30"
                }`}
              >
                {form.seoTitle.length}/60
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">
              SEO Description
            </label>
            <textarea
              name="seoDescription"
              value={form.seoDescription}
              onChange={handleChange}
              rows={3}
              className={`${inputClass} resize-none`}
            />
            <div className="flex items-center justify-between mt-1.5">
              <p className="text-xs text-white/30">
                Recommended: 150-160 characters for search engine snippets
              </p>
              <p
                className={`text-xs ${
                  form.seoDescription.length > 160
                    ? "text-amber-400"
                    : "text-white/30"
                }`}
              >
                {form.seoDescription.length}/160
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">
              Meta Keywords
            </label>
            <input
              type="text"
              name="metaKeywords"
              value={form.metaKeywords}
              onChange={handleChange}
              placeholder="fitness, gym, booking, personal training, yoga, crossfit"
              className={inputClass}
            />
            <p className="text-xs text-white/30 mt-1.5">
              Comma-separated keywords for search engine optimization
            </p>
          </div>
        </motion.div>

        {/* Section 4: Business Information */}
        <motion.div
          variants={fadeUp}
          className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/10 p-6 sm:p-8 space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <FiMail className="w-4 h-4 text-violet-400" />
            </div>
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
              Business Information
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">
                Business Email
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="email"
                  name="businessEmail"
                  value={form.businessEmail}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-white/60 mb-1.5">
                Business Phone
              </label>
              <div className="relative">
                <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                <input
                  type="tel"
                  name="businessPhone"
                  value={form.businessPhone}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">
              Business Address
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-3.5 top-4 w-4 h-4 text-white/20" />
              <input
                type="text"
                name="businessAddress"
                value={form.businessAddress}
                onChange={handleChange}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">
              Working Hours
            </label>
            <div className="relative">
              <FiClock className="absolute left-3.5 top-4 w-4 h-4 text-white/20" />
              <input
                type="text"
                name="workingHours"
                value={form.workingHours}
                onChange={handleChange}
                className={`${inputClass} pl-10`}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-white/60 mb-1.5">
              Google Map URL
            </label>
            <div className="relative">
              <FiMapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
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
        <motion.div
          variants={fadeUp}
          className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-purple-500/10 p-6 sm:p-8 space-y-5"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center">
              <FiAlertTriangle className="w-4 h-4 text-violet-400" />
            </div>
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">
              Advanced
            </h3>
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
              <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 px-4 py-3 flex items-start gap-3">
                <FiAlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs font-medium text-amber-400">
                    Maintenance Mode is Active
                  </p>
                  <p className="text-xs text-amber-400/50 mt-0.5">
                    Your site is currently in maintenance mode. Only admins can
                    access the frontend. Remember to disable it when maintenance
                    is complete.
                  </p>
                </div>
              </div>
            )}

            <div className="border-t border-white/5" />

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

            <div className="border-t border-white/5" />

            <div className="rounded-xl border border-white/5 bg-white/[0.02] p-4">
              <div className="flex items-center gap-2 mb-2">
                <FiMonitor className="w-3.5 h-3.5 text-white/30" />
                <p className="text-xs font-medium text-white/30 uppercase tracking-wider">
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
                  <span className="text-xs text-white/50">
                    {form.maintenanceMode ? "Maintenance" : "Live"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      form.darkMode ? "bg-violet-400" : "bg-sky-400"
                    }`}
                  />
                  <span className="text-xs text-white/50">
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
          <Button type="submit" variant="purple" size="md" className="group">
            <FiSave className="w-4 h-4" />
            Save Settings
          </Button>
          <SavedBadge show={saved} />
        </motion.div>
      </form>
    </motion.div>
  );
}

export default WebsiteSettings;
