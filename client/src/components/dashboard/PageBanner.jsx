import { motion } from "framer-motion";
import {
  FiGrid,
  FiImage,
  FiInfo,
  FiPackage,
  FiMapPin,
  FiUser,
  FiAward,
  FiCreditCard,
  FiMessageSquare,
  FiCamera,
  FiMail,
  FiSettings,
  FiBell,
  FiActivity,
} from "react-icons/fi";
import { fadeUp } from "../../lib/animations";
import { getTheme } from "../../lib/dashboardTheme";

const iconMap = {
  dashboard: FiGrid,
  profile: FiUser,
  hero: FiImage,
  about: FiInfo,
  services: FiPackage,
  trainers: FiAward,
  membership: FiCreditCard,
  testimonials: FiMessageSquare,
  gallery: FiCamera,
  contact: FiMail,
  footer: FiMapPin,
  settings: FiSettings,
  notifications: FiBell,
  fitnessTools: FiActivity,
};

function PageBanner({ pageKey, icon: Icon, subtitle }) {
  const theme = getTheme(pageKey);
  const BannerIcon = Icon || iconMap[pageKey] || FiGrid;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={`${theme.bannerBg} rounded-2xl p-6 sm:p-8 border border-white/5`}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${theme.iconBg}`}>
          <BannerIcon className={`w-6 h-6 ${theme.iconColor}`} />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-base-content">
            {theme.name}
          </h1>
          {subtitle && (
            <p className="text-sm text-base-content/50 mt-0.5">{subtitle}</p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default PageBanner;
