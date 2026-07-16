import { motion, AnimatePresence } from "framer-motion";
import { FiAlertTriangle, FiTrash2, FiInfo, FiCheckCircle } from "react-icons/fi";

const typeConfig = {
  danger: {
    icon: FiTrash2,
    iconBg: "bg-gradient-to-br from-red-100 to-rose-100 dark:from-red-500/20 dark:to-rose-500/10",
    iconColor: "text-red-600 dark:text-red-400",
    btnClass: "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 shadow-md shadow-red-500/25",
    ringColor: "ring-red-100 dark:ring-red-500/20",
  },
  warning: {
    icon: FiAlertTriangle,
    iconBg: "bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-500/20 dark:to-yellow-500/10",
    iconColor: "text-amber-600 dark:text-amber-400",
    btnClass: "bg-gradient-to-r from-amber-500 to-yellow-500 text-white hover:from-amber-600 hover:to-yellow-600 shadow-md shadow-amber-500/25",
    ringColor: "ring-amber-100 dark:ring-amber-500/20",
  },
  info: {
    icon: FiInfo,
    iconBg: "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-500/20 dark:to-indigo-500/10",
    iconColor: "text-blue-600 dark:text-blue-400",
    btnClass: "bg-gradient-to-r from-blue-600 to-indigo-500 text-white hover:from-blue-700 hover:to-indigo-600 shadow-md shadow-blue-500/25",
    ringColor: "ring-blue-100 dark:ring-blue-500/20",
  },
  success: {
    icon: FiCheckCircle,
    iconBg: "bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/10",
    iconColor: "text-emerald-600 dark:text-emerald-400",
    btnClass: "bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:from-emerald-700 hover:to-green-600 shadow-md shadow-emerald-500/25",
    ringColor: "ring-emerald-100 dark:ring-emerald-500/20",
  },
};

function ConfirmModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Delete", type = "danger", loading = false }) {
  const cfg = typeConfig[type] || typeConfig.danger;
  const Icon = cfg.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-md z-50"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div className="w-full max-w-md rounded-2xl bg-white dark:bg-[#0f1219] border border-gray-200/60 dark:border-white/[0.08] shadow-2xl shadow-gray-300/50 dark:shadow-black/60 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="p-6 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20, delay: 0.1 }}
                  className={`w-16 h-16 rounded-2xl ${cfg.iconBg} flex items-center justify-center mx-auto mb-4 ring-4 ${cfg.ringColor}`}
                >
                  <Icon className={`w-7 h-7 ${cfg.iconColor}`} />
                </motion.div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{message}</p>
              </div>
              <div className="px-6 py-4 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex items-center justify-end gap-3">
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 transition-all duration-200 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={loading}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.97] disabled:opacity-50 ${cfg.btnClass}`}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </span>
                  ) : (
                    confirmText
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default ConfirmModal;
