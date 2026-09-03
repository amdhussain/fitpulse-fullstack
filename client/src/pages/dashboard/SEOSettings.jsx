import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiSearch,
  FiGlobe,
  FiSave,
  FiRefreshCw,
  FiCheck,
  FiAlertCircle,
  FiType,
  FiImage,
  FiTag,
} from "react-icons/fi";
import { staggerContainer } from "../../lib/animations";
import PageBanner from "../../components/dashboard/PageBanner";
import { getInputClass, getSelectClass } from "../../lib/dashboardHelpers";
import { useAuth } from "../../context/AuthContext";

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

const defaultSEO = {
  meta_title: "",
  meta_description: "",
  meta_keywords: "",
  og_title: "",
  og_description: "",
  og_image: "",
  canonical_url: "",
  robots: "index, follow",
};

function SEOSettingsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-24 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

function SEOSettings() {
  const { isAdmin } = useAuth();
  const [settings, setSettings] = useState(defaultSEO);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState(null);

  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/v1/settings/group/seo`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const groups = data.data || data.settings || data;
        if (groups && typeof groups === "object") {
          const seoData = { ...defaultSEO };
          if (Array.isArray(groups)) {
            groups.forEach((item) => {
              if (item.key && item.value !== undefined) {
                seoData[item.key] = item.value;
              }
            });
          } else if (groups.settings && Array.isArray(groups.settings)) {
            groups.settings.forEach((item) => {
              if (item.key && item.value !== undefined) {
                seoData[item.key] = item.value;
              }
            });
          } else {
            Object.keys(defaultSEO).forEach((key) => {
              if (groups[key] !== undefined) seoData[key] = groups[key];
            });
          }
          setSettings(seoData);
        }
      }
    } catch {
      // use defaults
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const handleSave = async () => {
    try {
      setSaving(true);
      setSaveMessage(null);
      const res = await fetch(`${API_URL}/api/v1/settings/group/seo`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        setSaveMessage({ type: "success", text: "SEO settings saved successfully!" });
      } else {
        setSaveMessage({ type: "error", text: "Failed to save SEO settings." });
      }
    } catch {
      setSaveMessage({ type: "error", text: "An error occurred while saving." });
    } finally {
      setSaving(false);
      setTimeout(() => setSaveMessage(null), 4000);
    }
  };

  const handleChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <PageBanner pageKey="seo" icon={FiSearch} subtitle="Configure SEO metadata for your website" />

      {saveMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`flex items-center gap-3 p-4 rounded-xl border ${
            saveMessage.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300"
              : "bg-red-50 dark:bg-red-500/10 border-red-200 dark:border-red-500/20 text-red-700 dark:text-red-300"
          }`}
        >
          {saveMessage.type === "success" ? <FiCheck className="w-5 h-5" /> : <FiAlertCircle className="w-5 h-5" />}
          <span className="text-sm font-medium">{saveMessage.text}</span>
        </motion.div>
      )}

      {loading ? (
        <SEOSettingsSkeleton />
      ) : (
        <div className="space-y-6">
          {/* General SEO */}
          <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-gray-200/80 dark:border-white/[0.06] p-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-500/20 dark:to-indigo-500/10">
                <FiGlobe className="w-5 h-5 text-violet-600 dark:text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">General SEO</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  <div className="flex items-center gap-2"><FiType className="w-3.5 h-3.5" /> Meta Title</div>
                </label>
                <input
                  type="text"
                  value={settings.meta_title}
                  onChange={(e) => handleChange("meta_title", e.target.value)}
                  placeholder="Page title for search engines (50-60 chars recommended)"
                  className={getInputClass("violet")}
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{settings.meta_title.length}/60 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  <div className="flex items-center gap-2"><FiType className="w-3.5 h-3.5" /> Meta Description</div>
                </label>
                <textarea
                  value={settings.meta_description}
                  onChange={(e) => handleChange("meta_description", e.target.value)}
                  placeholder="Page description for search engines (150-160 chars recommended)"
                  rows={3}
                  className={`${getInputClass("violet")} resize-none`}
                />
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">{settings.meta_description.length}/160 characters</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  <div className="flex items-center gap-2"><FiTag className="w-3.5 h-3.5" /> Meta Keywords</div>
                </label>
                <input
                  type="text"
                  value={settings.meta_keywords}
                  onChange={(e) => handleChange("meta_keywords", e.target.value)}
                  placeholder="Comma-separated keywords (e.g., fitness, gym, yoga)"
                  className={getInputClass("violet")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Robots Directive</label>
                <div className="select-wrapper">
                <select
                  value={settings.robots}
                  onChange={(e) => handleChange("robots", e.target.value)}
                  className={getSelectClass("violet")}
                >
                  <option value="index, follow">Index, Follow (Default)</option>
                  <option value="noindex, follow">No Index, Follow</option>
                  <option value="index, nofollow">Index, No Follow</option>
                  <option value="noindex, nofollow">No Index, No Follow</option>
                </select>
                </div>
              </div>
            </div>
          </div>

          {/* Open Graph */}
          <div className="bg-white dark:bg-white/[0.02] rounded-2xl border border-gray-200/80 dark:border-white/[0.06] p-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-500/20 dark:to-cyan-500/10">
                <FiImage className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Open Graph (Social Media)</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">OG Title</label>
                <input
                  type="text"
                  value={settings.og_title}
                  onChange={(e) => handleChange("og_title", e.target.value)}
                  placeholder="Title shown when shared on social media"
                  className={getInputClass("blue")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">OG Description</label>
                <textarea
                  value={settings.og_description}
                  onChange={(e) => handleChange("og_description", e.target.value)}
                  placeholder="Description shown when shared on social media"
                  rows={3}
                  className={`${getInputClass("blue")} resize-none`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">OG Image URL</label>
                <input
                  type="text"
                  value={settings.og_image}
                  onChange={(e) => handleChange("og_image", e.target.value)}
                  placeholder="https://example.com/image.jpg (1200x630 recommended)"
                  className={getInputClass("blue")}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Canonical URL</label>
                <input
                  type="text"
                  value={settings.canonical_url}
                  onChange={(e) => handleChange("canonical_url", e.target.value)}
                  placeholder="https://yoursite.com (leave blank for default)"
                  className={getInputClass("blue")}
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <button
              onClick={fetchSettings}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              <FiRefreshCw className="w-4 h-4" /> Reset
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-600 text-white text-sm font-medium hover:from-violet-600 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/25"
            >
              <FiSave className="w-4 h-4" />
              {saving ? "Saving..." : "Save SEO Settings"}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}

export default SEOSettings;
