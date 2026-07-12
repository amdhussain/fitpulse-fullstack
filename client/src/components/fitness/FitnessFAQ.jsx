import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";

function FitnessFAQ({ items, accentColor = "cyan" }) {
  const [openIndex, setOpenIndex] = useState(null);
  const borderColors = {
    cyan: "border-cyan-500/20 hover:border-cyan-500/40",
    amber: "border-amber-500/20 hover:border-amber-500/40",
    emerald: "border-emerald-500/20 hover:border-emerald-500/40",
    purple: "border-purple-500/20 hover:border-purple-500/40",
    blue: "border-blue-500/20 hover:border-blue-500/40",
    rose: "border-rose-500/20 hover:border-rose-500/40",
    orange: "border-orange-500/20 hover:border-orange-500/40",
  };
  const textColors = {
    cyan: "text-cyan-400",
    amber: "text-amber-400",
    emerald: "text-emerald-400",
    purple: "text-purple-400",
    blue: "text-blue-400",
    rose: "text-rose-400",
    orange: "text-orange-400",
  };
  const border = borderColors[accentColor] || borderColors.cyan;
  const text = textColors[accentColor] || textColors.cyan;

  return (
    <div className="space-y-3">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`rounded-xl border bg-white/[0.02] backdrop-blur-xl transition-all duration-300 ${isOpen ? border : "border-white/[0.06] hover:border-white/15"}`}
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="w-full flex items-center justify-between px-5 py-4 text-left"
            >
              <span className="text-sm font-medium text-white/80 pr-4">{item.question}</span>
              <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <FiChevronDown className={`w-4 h-4 shrink-0 ${isOpen ? text : "text-white/30"}`} />
              </motion.div>
            </button>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="px-5 pb-4">
                    <p className="text-sm text-white/45 leading-relaxed">{item.answer}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

export default FitnessFAQ;
