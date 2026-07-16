import { motion } from "framer-motion";

const statusStyles = {
  active: { bg: "bg-gradient-to-r from-emerald-50 to-green-50/50 dark:from-emerald-500/10 dark:to-green-500/5", text: "text-emerald-700 dark:text-emerald-300", border: "border-emerald-200/60 dark:border-emerald-500/20", dot: "bg-emerald-500 shadow-sm shadow-emerald-500/50" },
  draft: { bg: "bg-gradient-to-r from-amber-50 to-yellow-50/50 dark:from-amber-500/10 dark:to-yellow-500/5", text: "text-amber-700 dark:text-amber-300", border: "border-amber-200/60 dark:border-amber-500/20", dot: "bg-amber-500 shadow-sm shadow-amber-500/50" },
  inactive: { bg: "bg-gray-50 dark:bg-white/5", text: "text-gray-500 dark:text-gray-400", border: "border-gray-200/60 dark:border-white/10", dot: "bg-gray-400" },
  featured: { bg: "bg-gradient-to-r from-blue-50 to-indigo-50/50 dark:from-blue-500/10 dark:to-indigo-500/5", text: "text-blue-700 dark:text-blue-300", border: "border-blue-200/60 dark:border-blue-500/20", dot: "bg-blue-500 shadow-sm shadow-blue-500/50" },
};

function CmsBadge({ status = "active", onToggle, label }) {
  const styles = statusStyles[status] || statusStyles.active;

  if (onToggle) {
    return (
      <button onClick={(e) => { e.stopPropagation(); onToggle(); }} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles.bg} ${styles.text} ${styles.border} transition-all duration-200 hover:opacity-80`}>
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
        {label || status}
      </button>
    );
  }

  return (
    <motion.span initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles.bg} ${styles.text} ${styles.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {label || status}
    </motion.span>
  );
}

export default CmsBadge;
