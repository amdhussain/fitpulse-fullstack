import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiGrid, FiImage, FiInfo, FiPackage, FiMapPin, FiUser,
  FiAward, FiCreditCard, FiMessageSquare, FiCamera, FiMail,
  FiSettings, FiBell, FiActivity, FiChevronRight,
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

function PageBanner({ pageKey, icon: Icon, subtitle, breadcrumbs }) {
  const theme = getTheme(pageKey);
  const BannerIcon = Icon || iconMap[pageKey] || FiGrid;

  const crumbs = breadcrumbs || [
    { label: "Dashboard", to: "/dashboard" },
    { label: theme.name },
  ];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={`${theme.bannerBg} rounded-2xl p-6 sm:p-8 border border-gray-200/60 dark:border-white/[0.06] relative overflow-hidden`}
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className={`absolute -top-16 -right-16 w-48 h-48 rounded-full blur-[80px] opacity-40`} style={{ backgroundColor: theme.accentHex }} />
        <div className={`absolute -bottom-10 -left-10 w-36 h-36 rounded-full blur-[60px] opacity-25`} style={{ backgroundColor: theme.accentHex }} />
        <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent dark:from-white/[0.02] dark:to-transparent" />
      </div>
      <div className="relative z-10">
        {crumbs.length > 0 && (
          <nav className="flex items-center gap-1.5 mb-3 text-[11px]" aria-label="Breadcrumb">
            {crumbs.map((crumb, i) => (
              <span key={i} className="flex items-center gap-1.5">
                {i > 0 && <FiChevronRight className="w-3 h-3 text-gray-400 dark:text-gray-500" />}
                {crumb.to ? (
                  <Link to={crumb.to} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 font-medium transition-colors">
                    {crumb.label}
                  </Link>
                ) : (
                  <span className="text-gray-800 dark:text-gray-100 font-semibold">{crumb.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <div className="flex items-center gap-4">
          <div className={`p-3 rounded-xl ${theme.iconBg} shadow-lg`}>
            <BannerIcon className={`w-6 h-6 ${theme.iconColor}`} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
              {theme.name}
            </h1>
            {subtitle && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default PageBanner;
