import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiSave,
  FiPlus,
  FiTrash2,
  FiLink,
  FiGlobe,
  FiMail,
  FiPhone,
  FiMapPin,
  FiImage,
  FiType,
  FiMessageSquare,
} from "react-icons/fi";
import { Button, SavedBadge, FileUpload, Skeleton } from "../../components/ui";
import { staggerContainer } from "../../lib/animations";
import { PageBanner } from "../../components/dashboard";
import { getInputClass } from "../../lib/dashboardHelpers";

const accent = "slate";
const pageKey = "footer";

const initialData = {
  logo: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200&h=60&fit=crop&auto=format&q=80",
  description:
    "FitBookPro is your premier fitness booking platform. We connect fitness enthusiasts with world-class trainers and facilities.",
  copyright: "© 2025 FitBookPro. All rights reserved.",
  quickLinks: [
    { id: 1, label: "Home", url: "/" },
    { id: 2, label: "About Us", url: "/about" },
    { id: 3, label: "Services", url: "/services" },
    { id: 4, label: "Trainers", url: "/trainers" },
    { id: 5, label: "Membership", url: "/membership" },
    { id: 6, label: "Contact", url: "/contact" },
  ],
  usefulLinks: [
    { id: 1, label: "Privacy Policy", url: "/privacy" },
    { id: 2, label: "Terms of Service", url: "/terms" },
    { id: 3, label: "FAQ", url: "/faq" },
    { id: 4, label: "Support", url: "/support" },
  ],
  contactInfo: {
    address: "123 Fitness Street, Wellness City, FC 12345",
    phone: "+1 (555) 123-4567",
    email: "info@fitbookpro.com",
  },
  socialLinks: {
    facebook: "https://facebook.com/fitbookpro",
    instagram: "https://instagram.com/fitbookpro",
    linkedin: "https://linkedin.com/company/fitbookpro",
    twitter: "https://twitter.com/fitbookpro",
    youtube: "https://youtube.com/fitbookpro",
  },
  newsletter: {
    enabled: true,
    title: "Stay Updated",
    description:
      "Subscribe to our newsletter for the latest fitness tips and updates.",
  },
};

function SkeletonLoader() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-24 w-full rounded-2xl" />
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-80 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
        <div className="xl:col-span-1">
          <Skeleton className="h-[700px] w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

export default function FooterManagement() {
  const [form, setForm] = useState(initialData);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const updateField = (path, value) => {
    setForm((prev) => {
      const keys = path.split(".");
      const next = JSON.parse(JSON.stringify(prev));
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        obj = obj[keys[i]];
      }
      obj[keys[keys.length - 1]] = value;
      return next;
    });
    setSaved(false);
  };

  const addQuickLink = () => {
    setForm((prev) => ({
      ...prev,
      quickLinks: [
        ...prev.quickLinks,
        { id: Date.now(), label: "", url: "" },
      ],
    }));
  };

  const removeQuickLink = (id) => {
    setForm((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.filter((l) => l.id !== id),
    }));
  };

  const updateQuickLink = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.map((l) =>
        l.id === id ? { ...l, [field]: value } : l
      ),
    }));
  };

  const addUsefulLink = () => {
    setForm((prev) => ({
      ...prev,
      usefulLinks: [
        ...prev.usefulLinks,
        { id: Date.now(), label: "", url: "" },
      ],
    }));
  };

  const removeUsefulLink = (id) => {
    setForm((prev) => ({
      ...prev,
      usefulLinks: prev.usefulLinks.filter((l) => l.id !== id),
    }));
  };

  const updateUsefulLink = (id, field, value) => {
    setForm((prev) => ({
      ...prev,
      usefulLinks: prev.usefulLinks.map((l) =>
        l.id === id ? { ...l, [field]: value } : l
      ),
    }));
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <PageBanner pageKey={pageKey} subtitle="Manage footer content and social links" />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* LEFT COLUMN — Form */}
        <div className="xl:col-span-2 space-y-6">
          {/* Card 1: Logo & Brand */}
          <div className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-slate-500/10 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-slate-500/10 flex items-center justify-center">
                <FiImage className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="text-white font-semibold text-sm">Logo & Brand</h3>
            </div>
            <div className="space-y-4">
              <FileUpload
                label="Footer Logo"
                color="slate"
                value={form.logo}
                onChange={(val) => updateField("logo", val)}
              />
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={form.description}
                  onChange={(e) => updateField("description", e.target.value)}
                  className={getInputClass(accent)}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Quick Links */}
          <div className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-slate-500/10 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-slate-500/10 flex items-center justify-center">
                <FiLink className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="text-white font-semibold text-sm">Quick Links</h3>
            </div>
            <div className="space-y-3">
              {form.quickLinks.map((link) => (
                <div key={link.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => updateQuickLink(link.id, "label", e.target.value)}
                    className={`${getInputClass(accent)} flex-1`}
                  />
                  <input
                    type="text"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateQuickLink(link.id, "url", e.target.value)}
                    className={`${getInputClass(accent)} flex-1`}
                  />
                  <button
                    onClick={() => removeQuickLink(link.id)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors flex-shrink-0"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="slate" size="sm" onClick={addQuickLink}>
                <FiPlus className="w-3.5 h-3.5 mr-1.5" />
                Add Link
              </Button>
            </div>
          </div>

          {/* Card 3: Useful Links */}
          <div className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-slate-500/10 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-slate-500/10 flex items-center justify-center">
                <FiGlobe className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="text-white font-semibold text-sm">Useful Links</h3>
            </div>
            <div className="space-y-3">
              {form.usefulLinks.map((link) => (
                <div key={link.id} className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Label"
                    value={link.label}
                    onChange={(e) => updateUsefulLink(link.id, "label", e.target.value)}
                    className={`${getInputClass(accent)} flex-1`}
                  />
                  <input
                    type="text"
                    placeholder="URL"
                    value={link.url}
                    onChange={(e) => updateUsefulLink(link.id, "url", e.target.value)}
                    className={`${getInputClass(accent)} flex-1`}
                  />
                  <button
                    onClick={() => removeUsefulLink(link.id)}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:text-red-400 hover:bg-red-400/10 transition-colors flex-shrink-0"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="slate" size="sm" onClick={addUsefulLink}>
                <FiPlus className="w-3.5 h-3.5 mr-1.5" />
                Add Link
              </Button>
            </div>
          </div>

          {/* Card 4: Contact Information */}
          <div className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-slate-500/10 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-slate-500/10 flex items-center justify-center">
                <FiPhone className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="text-white font-semibold text-sm">Contact Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Address
                </label>
                <div className="relative">
                  <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Enter address"
                    value={form.contactInfo.address}
                    onChange={(e) => updateField("contactInfo.address", e.target.value)}
                    className={`${getInputClass(accent)} pl-10`}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Phone
                  </label>
                  <div className="relative">
                    <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Phone number"
                      value={form.contactInfo.phone}
                      onChange={(e) => updateField("contactInfo.phone", e.target.value)}
                      className={`${getInputClass(accent)} pl-10`}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    Email
                  </label>
                  <div className="relative">
                    <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder="Email address"
                      value={form.contactInfo.email}
                      onChange={(e) => updateField("contactInfo.email", e.target.value)}
                      className={`${getInputClass(accent)} pl-10`}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Social Media Links */}
          <div className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-slate-500/10 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-slate-500/10 flex items-center justify-center">
                <FiGlobe className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="text-white font-semibold text-sm">Social Media Links</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { key: "facebook", label: "Facebook", placeholder: "https://facebook.com/..." },
                { key: "instagram", label: "Instagram", placeholder: "https://instagram.com/..." },
                { key: "linkedin", label: "LinkedIn", placeholder: "https://linkedin.com/..." },
                { key: "twitter", label: "Twitter", placeholder: "https://twitter.com/..." },
                { key: "youtube", label: "YouTube", placeholder: "https://youtube.com/..." },
              ].map((s) => (
                <div key={s.key}>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">
                    {s.label}
                  </label>
                  <div className="relative">
                    <FiGlobe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="text"
                      placeholder={s.placeholder}
                      value={form.socialLinks[s.key]}
                      onChange={(e) => updateField(`socialLinks.${s.key}`, e.target.value)}
                      className={`${getInputClass(accent)} pl-10`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 6: Newsletter Section */}
          <div className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-slate-500/10 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-slate-500/10 flex items-center justify-center">
                <FiMessageSquare className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="text-white font-semibold text-sm">Newsletter Section</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-400">
                  Enable Newsletter
                </label>
                <button
                  onClick={() => updateField("newsletter.enabled", !form.newsletter.enabled)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    form.newsletter.enabled ? "bg-slate-500" : "bg-white/10"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white transition-transform duration-200 ${
                      form.newsletter.enabled ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Title
                </label>
                <div className="relative">
                  <FiType className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Newsletter title"
                    value={form.newsletter.title}
                    onChange={(e) => updateField("newsletter.title", e.target.value)}
                    className={`${getInputClass(accent)} pl-10`}
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Newsletter description"
                  value={form.newsletter.description}
                  onChange={(e) => updateField("newsletter.description", e.target.value)}
                  className={getInputClass(accent)}
                />
              </div>
            </div>
          </div>

          {/* Card 7: Footer Actions */}
          <div className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-slate-500/10 p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-slate-500/10 flex items-center justify-center">
                <FiSave className="w-4 h-4 text-slate-400" />
              </div>
              <h3 className="text-white font-semibold text-sm">Footer Settings</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">
                  Copyright Text
                </label>
                <input
                  type="text"
                  placeholder="© 2025 Company. All rights reserved."
                  value={form.copyright}
                  onChange={(e) => updateField("copyright", e.target.value)}
                  className={getInputClass(accent)}
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <Button variant="slate" onClick={handleSave}>
                  <FiSave className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
                <SavedBadge show={saved} />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Live Preview */}
        <div className="xl:col-span-1">
          <div className="sticky top-6 rounded-2xl bg-[#0a0a0f] border border-slate-500/10 overflow-hidden">
            <div className="px-5 py-4 border-b border-slate-500/10">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Live Preview
              </p>
            </div>

            {/* Logo */}
            <div className="px-5 pt-5">
              {form.logo ? (
                <img
                  src={form.logo}
                  alt="Footer logo"
                  className="h-8 object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              ) : (
                <div className="h-8 w-32 rounded-lg bg-white/5 flex items-center justify-center">
                  <span className="text-[10px] text-white/20">No logo</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="px-5 pt-3">
              <p className="text-xs text-white/40 leading-relaxed line-clamp-3">
                {form.description || "No description set."}
              </p>
            </div>

            {/* Quick Links */}
            <div className="px-5 pt-5">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                Quick Links
              </p>
              <ul className="space-y-1.5">
                {form.quickLinks.map((link) => (
                  <li key={link.id}>
                    <span className="text-[11px] text-white/50 hover:text-white/70 cursor-pointer transition-colors">
                      {link.label || "Untitled"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Useful Links */}
            <div className="px-5 pt-4">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                Useful Links
              </p>
              <ul className="space-y-1.5">
                {form.usefulLinks.map((link) => (
                  <li key={link.id}>
                    <span className="text-[11px] text-white/50 hover:text-white/70 cursor-pointer transition-colors">
                      {link.label || "Untitled"}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Info */}
            <div className="px-5 pt-4">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                Contact
              </p>
              <div className="space-y-2">
                {form.contactInfo.address && (
                  <div className="flex items-start gap-2">
                    <FiMapPin className="w-3 h-3 text-slate-500 mt-0.5 flex-shrink-0" />
                    <span className="text-[11px] text-white/50 leading-snug">
                      {form.contactInfo.address}
                    </span>
                  </div>
                )}
                {form.contactInfo.phone && (
                  <div className="flex items-center gap-2">
                    <FiPhone className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span className="text-[11px] text-white/50">
                      {form.contactInfo.phone}
                    </span>
                  </div>
                )}
                {form.contactInfo.email && (
                  <div className="flex items-center gap-2">
                    <FiMail className="w-3 h-3 text-slate-500 flex-shrink-0" />
                    <span className="text-[11px] text-white/50">
                      {form.contactInfo.email}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Social Icons */}
            <div className="px-5 pt-4">
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">
                Follow Us
              </p>
              <div className="flex items-center gap-2">
                {Object.entries(form.socialLinks).map(([platform, url]) => {
                  if (!url) return null;
                  return (
                    <div
                      key={platform}
                      className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer"
                      title={platform}
                    >
                      <FiGlobe className="w-3 h-3 text-white/40" />
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Newsletter */}
            {form.newsletter.enabled && (
              <div className="mx-5 mt-4 p-3 rounded-xl bg-white/5">
                <p className="text-[11px] font-semibold text-white/70 mb-1">
                  {form.newsletter.title || "Newsletter"}
                </p>
                <p className="text-[10px] text-white/30 leading-relaxed mb-2.5">
                  {form.newsletter.description || "Subscribe for updates."}
                </p>
                <div className="flex gap-1.5">
                  <div className="flex-1 h-7 rounded-lg bg-white/5 px-2.5 flex items-center">
                    <span className="text-[10px] text-white/20">Email address</span>
                  </div>
                  <div className="h-7 px-3 rounded-lg bg-slate-500/20 flex items-center">
                    <FiMail className="w-3 h-3 text-slate-400" />
                  </div>
                </div>
              </div>
            )}

            {/* Copyright */}
            <div className="mt-5 px-5 py-3 bg-white/5 border-t border-slate-500/10">
              <p className="text-[10px] text-white/30 text-center">
                {form.copyright || "© 2025 Company. All rights reserved."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
