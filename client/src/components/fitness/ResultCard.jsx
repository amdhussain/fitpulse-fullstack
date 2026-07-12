import { motion, AnimatePresence } from "framer-motion";
import { FiCheck, FiInfo } from "react-icons/fi";
import { colorSchemes } from "../../lib/fitnessToolsData";

function ResultCard({ result, accentColor = "cyan", label, value, unit, category, description }) {
  const colors = colorSchemes[accentColor] || colorSchemes.cyan;
  if (!result) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 20, stiffness: 200 }}
        className={`rounded-2xl bg-gradient-to-br ${colors.bg} backdrop-blur-xl border ${colors.border} p-6 sm:p-8 shadow-xl ${colors.glow}`}
      >
        <div className="text-center space-y-4">
          {label && (
            <p className="text-sm font-medium text-white/50 uppercase tracking-wider">{label}</p>
          )}

          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
          >
            <span className={`text-5xl sm:text-6xl font-black ${colors.text}`}>
              {value}
            </span>
            {unit && (
              <span className="text-lg font-medium text-white/40 ml-2">{unit}</span>
            )}
          </motion.div>

          {category && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${colors.bg} border ${colors.border}`}
            >
              <FiCheck className={`w-4 h-4 ${colors.text}`} />
              <span className={`text-sm font-semibold ${colors.text}`}>{category}</span>
            </motion.div>
          )}

          {description && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-sm text-white/50 leading-relaxed max-w-md mx-auto"
            >
              {description}
            </motion.p>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ResultDetails({ details, accentColor = "cyan" }) {
  const colors = colorSchemes[accentColor] || colorSchemes.cyan;
  if (!details || details.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
    >
      {details.map((detail, i) => (
        <div
          key={i}
          className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]"
        >
          <FiInfo className={`w-4 h-4 ${colors.text} shrink-0`} />
          <div>
            <p className="text-xs text-white/40">{detail.label}</p>
            <p className="text-sm font-medium text-white/80">{detail.value}</p>
          </div>
        </div>
      ))}
    </motion.div>
  );
}

export { ResultCard, ResultDetails };
export default ResultCard;
