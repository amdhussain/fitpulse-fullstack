import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { fadeUp } from "../../lib/animations";

const bgMap = {
  blue: "bg-gradient-to-br from-blue-50 to-indigo-50/50 dark:from-blue-500/10 dark:to-indigo-500/5",
  cyan: "bg-gradient-to-br from-cyan-50 to-sky-50/50 dark:from-cyan-500/10 dark:to-sky-500/5",
  emerald: "bg-gradient-to-br from-emerald-50 to-green-50/50 dark:from-emerald-500/10 dark:to-green-500/5",
  purple: "bg-gradient-to-br from-purple-50 to-violet-50/50 dark:from-purple-500/10 dark:to-violet-500/5",
  amber: "bg-gradient-to-br from-amber-50 to-yellow-50/50 dark:from-amber-500/10 dark:to-yellow-500/5",
  orange: "bg-gradient-to-br from-orange-50 to-red-50/50 dark:from-orange-500/10 dark:to-red-500/5",
  rose: "bg-gradient-to-br from-rose-50 to-pink-50/50 dark:from-rose-500/10 dark:to-pink-500/5",
};

const iconColorMap = {
  blue: "text-blue-600 dark:text-blue-400",
  cyan: "text-cyan-600 dark:text-cyan-400",
  emerald: "text-emerald-600 dark:text-emerald-400",
  purple: "text-purple-600 dark:text-purple-400",
  amber: "text-amber-600 dark:text-amber-400",
  orange: "text-orange-600 dark:text-orange-400",
  rose: "text-rose-600 dark:text-rose-400",
};

const borderHoverMap = {
  blue: "hover:border-blue-300 dark:hover:border-blue-500/30 hover:shadow-blue-100/60 dark:hover:shadow-blue-500/10",
  cyan: "hover:border-cyan-300 dark:hover:border-cyan-500/30 hover:shadow-cyan-100/60 dark:hover:shadow-cyan-500/10",
  emerald: "hover:border-emerald-300 dark:hover:border-emerald-500/30 hover:shadow-emerald-100/60 dark:hover:shadow-emerald-500/10",
  purple: "hover:border-purple-300 dark:hover:border-purple-500/30 hover:shadow-purple-100/60 dark:hover:shadow-purple-500/10",
  amber: "hover:border-amber-300 dark:hover:border-amber-500/30 hover:shadow-amber-100/60 dark:hover:shadow-amber-500/10",
  orange: "hover:border-orange-300 dark:hover:border-orange-500/30 hover:shadow-orange-100/60 dark:hover:shadow-orange-500/10",
  rose: "hover:border-rose-300 dark:hover:border-rose-500/30 hover:shadow-rose-100/60 dark:hover:shadow-rose-500/10",
};

const topAccentMap = {
  blue: "bg-gradient-to-r from-blue-500 via-blue-400 to-indigo-400",
  cyan: "bg-gradient-to-r from-cyan-500 via-cyan-400 to-sky-400",
  emerald: "bg-gradient-to-r from-emerald-500 via-emerald-400 to-green-400",
  purple: "bg-gradient-to-r from-purple-500 via-purple-400 to-violet-400",
  amber: "bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-400",
  orange: "bg-gradient-to-r from-orange-500 via-orange-400 to-red-400",
  rose: "bg-gradient-to-r from-rose-500 via-rose-400 to-pink-400",
};

const iconBgMap = {
  blue: "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-500/20 dark:to-indigo-500/10 shadow-blue-100/50 dark:shadow-blue-500/10",
  cyan: "bg-gradient-to-br from-cyan-100 to-sky-100 dark:from-cyan-500/20 dark:to-sky-500/10 shadow-cyan-100/50 dark:shadow-cyan-500/10",
  emerald: "bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/10 shadow-emerald-100/50 dark:shadow-emerald-500/10",
  purple: "bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-500/20 dark:to-violet-500/10 shadow-purple-100/50 dark:shadow-purple-500/10",
  amber: "bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-500/20 dark:to-yellow-500/10 shadow-amber-100/50 dark:shadow-amber-500/10",
  orange: "bg-gradient-to-br from-orange-100 to-red-100 dark:from-orange-500/20 dark:to-red-500/10 shadow-orange-100/50 dark:shadow-orange-500/10",
  rose: "bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-500/20 dark:to-pink-500/10 shadow-rose-100/50 dark:shadow-rose-500/10",
};

function StatCard({ icon: Icon, label, value, change, trend, color = "blue", to, index = 0 }) {
  const bg = bgMap[color] || bgMap.blue;
  const iconColor = iconColorMap[color] || iconColorMap.blue;
  const borderHover = borderHoverMap[color] || borderHoverMap.blue;
  const topAccent = topAccentMap[color] || topAccentMap.blue;
  const iconBg = iconBgMap[color] || iconBgMap.blue;
  const navigate = useNavigate();

  const handleClick = () => {
    if (to) navigate(to);
  };

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      initial="hidden"
      animate="visible"
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      onClick={handleClick}
      className={`relative p-5 rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] shadow-sm hover:shadow-xl dark:shadow-none transition-all duration-300 group overflow-hidden ${to ? "cursor-pointer" : ""} ${borderHover}`}
    >
      <div className={`absolute top-0 left-0 right-0 h-[3px] ${topAccent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-t-2xl`} />
      <div className="flex items-start justify-between">
        <motion.div
          className={`p-2.5 rounded-xl ${bg} shadow-sm group-hover:scale-110 transition-transform duration-300`}
          whileHover={{ rotate: [0, -5, 5, 0] }}
          transition={{ duration: 0.4 }}
        >
          <Icon className={`w-5 h-5 ${iconColor}`} />
        </motion.div>
        {change && (
          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
            trend === "up" ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400"
          }`}>
            {trend === "up" ? "↑" : "↓"} {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">{value}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{label}</p>
      </div>
      {to && (
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-1 group-hover:translate-x-0">
          <svg className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-400 dark:group-hover:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      )}
    </motion.div>
  );
}

export default StatCard;
