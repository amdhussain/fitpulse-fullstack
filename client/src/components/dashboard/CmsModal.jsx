import { motion, AnimatePresence } from "framer-motion";
import { FiX } from "react-icons/fi";

function CmsModal({ isOpen, onClose, title, subtitle, children, size = "md" }) {
  const sizes = { sm: "max-w-md", md: "max-w-2xl", lg: "max-w-4xl", xl: "max-w-6xl" };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-gray-900/50 backdrop-blur-md z-50" onClick={onClose} aria-hidden="true" />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-start justify-center p-4 pt-12 sm:pt-20 overflow-y-auto"
            role="dialog" aria-modal="true" aria-label={title}
          >
            <div className={`w-full ${sizes[size]} rounded-2xl bg-white dark:bg-[#0f1219] border border-gray-200/60 dark:border-white/[0.08] shadow-2xl shadow-gray-300/50 dark:shadow-black/60 overflow-hidden`} onClick={(e) => e.stopPropagation()}>
              <div className="relative px-6 py-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-[2px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-60" />
                <div>
                  <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
                  {subtitle && <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{subtitle}</p>}
                </div>
                <button onClick={onClose} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors" aria-label="Close">
                  <FiX className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">{children}</div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CmsModal;
