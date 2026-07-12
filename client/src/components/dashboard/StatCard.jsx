import { motion } from "framer-motion";
import { fadeUp } from "../../lib/animations";
import { getTheme } from "../../lib/dashboardTheme";

function StatCard({ icon: Icon, label, value, pageKey = "dashboard", index = 0 }) {
  const theme = getTheme(pageKey);

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      className={`p-5 sm:p-6 rounded-2xl bg-base-200/40 border ${theme.cardBorder} transition-all duration-300`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl ${theme.iconBg}`}>
          <Icon className={`w-5 h-5 ${theme.iconColor}`} />
        </div>
        <span className="text-xs text-base-content/40 font-medium uppercase tracking-wider">
          {label}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-base-content">{value}</p>
        <p className="text-sm text-base-content/50 mt-0.5">{label}</p>
      </div>
    </motion.div>
  );
}

export default StatCard;
