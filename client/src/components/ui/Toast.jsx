import { useState, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiCheckCircle, FiAlertCircle, FiAlertTriangle, FiInfo, FiX } from "react-icons/fi";

const ToastContext = createContext(null);

const toastConfig = {
  success: { icon: FiCheckCircle, bg: "bg-emerald-50 border-emerald-200", text: "text-emerald-800", iconColor: "text-emerald-500", bar: "bg-emerald-500" },
  error: { icon: FiAlertCircle, bg: "bg-red-50 border-red-200", text: "text-red-800", iconColor: "text-red-500", bar: "bg-red-500" },
  warning: { icon: FiAlertTriangle, bg: "bg-amber-50 border-amber-200", text: "text-amber-800", iconColor: "text-amber-500", bar: "bg-amber-500" },
  info: { icon: FiInfo, bg: "bg-blue-50 border-blue-200", text: "text-blue-800", iconColor: "text-blue-500", bar: "bg-blue-500" },
  loading: { icon: null, bg: "bg-gray-50 border-gray-200", text: "text-gray-800", iconColor: "text-gray-500", bar: "bg-gray-400" },
};

let toastId = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 4000) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, message, type, visible: true }]);
    if (type !== "loading" && duration > 0) {
      setTimeout(() => {
        setToasts((prev) => prev.map((t) => t.id === id ? { ...t, visible: false } : t));
        setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 300);
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, visible: false } : prev));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 300);
  }, []);

  const toast = {
    success: (msg, dur) => addToast(msg, "success", dur),
    error: (msg, dur) => addToast(msg, "error", dur),
    warning: (msg, dur) => addToast(msg, "warning", dur),
    info: (msg, dur) => addToast(msg, "info", dur),
    loading: (msg) => addToast(msg, "loading", 0),
    dismiss: removeToast,
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((t) => {
            if (!t.visible && t.type !== "loading") return null;
            const config = toastConfig[t.type] || toastConfig.info;
            const Icon = config.icon;
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, x: 50, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 50, scale: 0.95 }}
                transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className={`pointer-events-auto w-80 rounded-xl border ${config.bg} shadow-lg shadow-gray-200/50 overflow-hidden`}
              >
                <div className={`h-0.5 ${config.bar} w-full`} />
                <div className="flex items-start gap-3 p-4">
                  {Icon ? (
                    <Icon className={`w-5 h-5 ${config.iconColor} shrink-0 mt-0.5`} />
                  ) : (
                    <div className="w-5 h-5 shrink-0 mt-0.5">
                      <div className={`w-5 h-5 rounded-full border-2 ${config.iconColor} border-t-transparent animate-spin`} />
                    </div>
                  )}
                  <p className={`text-sm font-medium ${config.text} flex-1`}>{t.message}</p>
                  {t.type !== "loading" && (
                    <button
                      onClick={() => removeToast(t.id)}
                      className={`${config.iconColor} hover:opacity-60 transition-opacity shrink-0`}
                    >
                      <FiX className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
