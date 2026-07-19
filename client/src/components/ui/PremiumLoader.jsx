import { motion } from "framer-motion";

export default function PremiumLoader({ variant = "default" }) {
  const isDashboard = variant === "dashboard";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: isDashboard
          ? "linear-gradient(135deg, #0a0f1e 0%, #0d1321 50%, #0a0f1e 100%)"
          : "linear-gradient(135deg, #0f0f12 0%, #1a1a22 50%, #0f0f12 100%)",
      }}
    >
      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -20, 30, 0],
          scale: [1, 1.2, 0.9, 1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-96 h-96 rounded-full opacity-20 blur-[60px]"
        style={{
          background: isDashboard
            ? "radial-gradient(circle, rgba(59,130,246,0.4), transparent 70%)"
            : "radial-gradient(circle, rgba(6,182,212,0.4), transparent 70%)",
        }}
      />

      <motion.div
        animate={{
          x: [0, -30, 20, 0],
          y: [0, 20, -30, 0],
          scale: [1, 0.9, 1.2, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-80 h-80 rounded-full opacity-15 blur-[60px]"
        style={{
          background: isDashboard
            ? "radial-gradient(circle, rgba(139,92,246,0.35), transparent 70%)"
            : "radial-gradient(circle, rgba(230,57,70,0.25), transparent 70%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 flex flex-col items-center gap-8"
      >
        <div className="relative">
          <motion.div
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.1, 0.25, 0.1],
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute inset-0 rounded-3xl blur-2xl ${
              isDashboard ? "bg-blue-500/30" : "bg-cyan-500/25"
            }`}
          />

          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className={`absolute -inset-4 rounded-3xl border border-dashed ${
              isDashboard ? "border-blue-400/15" : "border-cyan-400/10"
            }`}
          />

          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              y: [0, -4, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={`relative w-20 h-20 rounded-2xl flex items-center justify-center ${
              isDashboard
                ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"
                : "bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/30"
            }`}
          >
            <motion.span
              animate={{ opacity: [1, 0.65, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="text-white font-black text-3xl leading-none"
            >
              F
            </motion.span>
          </motion.div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <div className="flex gap-2">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.2,
                }}
                className={`w-2 h-2 rounded-full ${
                  isDashboard ? "bg-blue-400" : "bg-cyan-400"
                }`}
              />
            ))}
          </div>

          <motion.p
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="text-sm font-medium text-base-content/60"
          >
            Loading your experience...
          </motion.p>

          <motion.p
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.3,
            }}
            className="text-xs text-base-content/30"
          >
            Preparing your personalized dashboard...
          </motion.p>
        </div>
      </motion.div>
    </motion.div>
  );
}
