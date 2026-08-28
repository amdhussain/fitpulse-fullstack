import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiSave,
  FiEdit2,
  FiX,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiAlertCircle,
  FiFacebook,
  FiInstagram,
  FiLinkedin,
  FiYoutube,
  FiMessageCircle,
  FiGlobe,
  FiExternalLink,
  FiCheck,
} from "react-icons/fi";
import { Button, SavedBadge } from "../../components/ui";
import { staggerContainer } from "../../lib/animations";
import PageBanner from "../../components/dashboard/PageBanner";
import { getInputClass, getTextareaClass } from "../../lib/dashboardHelpers";
import { useAuth } from "../../context/AuthContext";
import { getContactInfo, getSocialLinks } from "../../lib/contactData";

const accent = "blue";
const pageKey = "contact";

const defaultContactInfo = getContactInfo();
const defaultSocialLinks = getSocialLinks();

const socialPlatformIcons = {
  facebook: FiFacebook,
  instagram: FiInstagram,
  linkedin: FiLinkedin,
  youtube: FiYoutube,
  whatsapp: FiMessageCircle,
};

function ConnectInfo() {
  const { isAdmin } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [editData, setEditData] = useState({ contactInfo: [], socialLinks: [] });

  useEffect(() => {
    setContactInfo(defaultContactInfo);
    setSocialLinks(defaultSocialLinks);
    setEditData({
      contactInfo: JSON.parse(JSON.stringify(defaultContactInfo)),
      socialLinks: JSON.parse(JSON.stringify(defaultSocialLinks)),
    });
    setLoading(false);
  }, []);

  const handleEdit = () => {
    setEditData({
      contactInfo: JSON.parse(JSON.stringify(contactInfo)),
      socialLinks: JSON.parse(JSON.stringify(socialLinks)),
    });
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setContactInfo(editData.contactInfo);
    setSocialLinks(editData.socialLinks);
    setIsEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateContactField = (id, field, value) => {
    setEditData((prev) => ({
      ...prev,
      contactInfo: prev.contactInfo.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const updateSocialField = (id, field, value) => {
    setEditData((prev) => ({
      ...prev,
      socialLinks: prev.socialLinks.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    }));
  };

  const getIconBg = (color) => {
    const colorMap = {
      red: "bg-red-100 dark:bg-red-900/30 text-red-500 dark:text-red-400",
      blue: "bg-blue-100 dark:bg-blue-900/30 text-blue-500 dark:text-blue-400",
      emerald: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-500 dark:text-emerald-400",
      amber: "bg-amber-100 dark:bg-amber-900/30 text-amber-500 dark:text-amber-400",
      rose: "bg-rose-100 dark:bg-rose-900/30 text-rose-500 dark:text-rose-400",
    };
    return colorMap[color] || colorMap.blue;
  };

  const getSocialIcon = (platform) => {
    const Icon = socialPlatformIcons[platform.toLowerCase()];
    return Icon || FiGlobe;
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        <div className="h-96 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
      </div>
    );
  }

  const currentContactInfo = isEditing ? editData.contactInfo : contactInfo;
  const currentSocialLinks = isEditing ? editData.socialLinks : socialLinks;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageBanner
        pageKey={pageKey}
        subtitle="Manage contact information displayed on the public page"
      />

      {/* Main Connect Section - Single Card */}
      <div className="rounded-2xl bg-white dark:bg-gray-800 backdrop-blur-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Section Header */}
        <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center">
              <FiPhone className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Connect</h2>
              <p className="text-xs text-gray-400 dark:text-gray-500">Contact information and social links</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <SavedBadge show={saved} />
            {isAdmin && !isEditing && (
              <Button variant="blue" size="sm" onClick={handleEdit}>
                <FiEdit2 className="w-3.5 h-3.5 mr-1.5" />
                Edit
              </Button>
            )}
          </div>
        </div>

        {/* Contact Information */}
        <div className="p-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Contact Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentContactInfo.map((item) => {
              const IconMap = {
                phone: FiPhone,
                email: FiMail,
                location: FiMapPin,
                clock: FiClock,
                emergency: FiAlertCircle,
              };
              const Icon = IconMap[item.icon] || FiPhone;

              return (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${getIconBg(item.accentColor)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400">{item.title}</p>
                  </div>
                  {isEditing ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        value={item.value}
                        onChange={(e) => updateContactField(item.id, "value", e.target.value)}
                        className={getInputClass(accent)}
                        placeholder={item.title}
                      />
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateContactField(item.id, "description", e.target.value)}
                        className={getInputClass(accent)}
                        placeholder="Description"
                      />
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{item.value}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{item.description}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Divider */}
        <div className="px-6">
          <div className="border-t border-gray-100 dark:border-gray-700" />
        </div>

        {/* Social Media Links */}
        <div className="p-6">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            Social Media Links
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentSocialLinks.map((link) => {
              const SocialIcon = getSocialIcon(link.platform);
              return (
                <div
                  key={link.id}
                  className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-700"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-${link.color}-100 dark:bg-${link.color}-900/30`}>
                    <SocialIcon className={`w-5 h-5 text-${link.color}-500 dark:text-${link.color}-400`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      {link.platform}
                    </p>
                    {isEditing ? (
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateSocialField(link.id, "url", e.target.value)}
                        placeholder={`https://${link.platform.toLowerCase()}.com/...`}
                        className={getInputClass(accent)}
                      />
                    ) : (
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-700 dark:text-gray-200 hover:text-blue-500 dark:hover:text-blue-400 truncate flex items-center gap-1.5 transition-colors"
                      >
                        <span className="truncate">{link.url}</span>
                        <FiExternalLink className="w-3 h-3 shrink-0 opacity-50" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons - Inside the Connect Section */}
        {isAdmin && (
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-100 dark:border-gray-700">
            {isEditing ? (
              <div className="flex items-center justify-end gap-3">
                <Button variant="ghost" size="sm" onClick={handleCancel}>
                  <FiX className="w-4 h-4 mr-1.5" />
                  Cancel
                </Button>
                <Button variant="blue" size="sm" onClick={handleSave}>
                  <FiSave className="w-4 h-4 mr-1.5" />
                  Save
                </Button>
              </div>
            ) : (
              <p className="text-xs text-gray-400 dark:text-gray-500 text-right">
                Click Edit to modify contact information
              </p>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}

export default ConnectInfo;
