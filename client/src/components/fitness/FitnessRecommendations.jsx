import { motion } from "framer-motion";
import { FiCheck, FiTarget, FiSun, FiCoffee, FiZap } from "react-icons/fi";

const sectionIcons = {
  workout: FiZap,
  nutrition: FiSun,
  dailyGoal: FiTarget,
  lifestyle: FiCoffee,
};

const accentBorders = {
  cyan: "border-cyan-500/15",
  amber: "border-amber-500/15",
  emerald: "border-emerald-500/15",
  purple: "border-purple-500/15",
  blue: "border-blue-500/15",
  rose: "border-rose-500/15",
  orange: "border-orange-500/15",
};

const accentTexts = {
  cyan: "text-cyan-400",
  amber: "text-amber-400",
  emerald: "text-emerald-400",
  purple: "text-purple-400",
  blue: "text-blue-400",
  rose: "text-rose-400",
  orange: "text-orange-400",
};

const accentBgs = {
  cyan: "bg-cyan-500/10",
  amber: "bg-amber-500/10",
  emerald: "bg-emerald-500/10",
  purple: "bg-purple-500/10",
  blue: "bg-blue-500/10",
  rose: "bg-rose-500/10",
  orange: "bg-orange-500/10",
};

function FitnessRecommendations({ recommendations, accentColor = "cyan" }) {
  if (!recommendations) return null;

  const sections = ["workout", "nutrition", "dailyGoal", "lifestyle"];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {sections.map((key, i) => {
        const section = recommendations[key];
        if (!section) return null;
        const Icon = sectionIcons[key] || FiTarget;

        return (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-xl bg-white/[0.03] backdrop-blur-xl border ${accentBorders[accentColor] || accentBorders.cyan} p-5`}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className={`p-2 rounded-lg ${accentBgs[accentColor] || accentBgs.cyan}`}>
                <Icon className={`w-4 h-4 ${accentTexts[accentColor] || accentTexts.cyan}`} />
              </div>
              <h4 className="text-sm font-bold text-white/80">{section.title}</h4>
            </div>

            {section.text && (
              <p className="text-sm text-white/50 leading-relaxed">{section.text}</p>
            )}

            {section.items && (
              <ul className="space-y-2">
                {section.items.map((item, j) => (
                  <li key={j} className="flex items-start gap-2.5">
                    <FiCheck className={`w-3.5 h-3.5 mt-1 shrink-0 ${accentTexts[accentColor] || accentTexts.cyan}`} />
                    <span className="text-sm text-white/50 leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default FitnessRecommendations;
