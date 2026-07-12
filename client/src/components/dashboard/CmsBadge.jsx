import { motion } from "framer-motion";

const statusStyles = {
  active: {
    bg: "bg-emerald-500/15",
    text: "text-emerald-400",
    border: "border-emerald-500/20",
    dot: "bg-emerald-400",
  },
  draft: {
    bg: "bg-amber-500/15",
    text: "text-amber-400",
    border: "border-amber-500/20",
    dot: "bg-amber-400",
  },
  inactive: {
    bg: "bg-white/5",
    text: "text-white/40",
    border: "border-white/10",
    dot: "bg-white/40",
  },
  featured: {
    bg: "bg-blue-500/15",
    text: "text-blue-400",
    border: "border-blue-500/20",
    dot: "bg-blue-400",
  },
};

function CmsBadge({ status = "active", onToggle, label }) {
  const styles = statusStyles[status] || statusStyles.active;

  if (onToggle) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles.bg} ${styles.text} ${styles.border} transition-all duration-200 hover:opacity-80`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
        {label || status}
      </button>
    );
  }

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${styles.bg} ${styles.text} ${styles.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
      {label || status}
    </motion.span>
  );
}

export default CmsBadge;
