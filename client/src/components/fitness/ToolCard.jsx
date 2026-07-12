import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { fadeUp } from "../../lib/animations";

function ToolCard({ tool, index }) {
  const Icon = tool.icon;

  return (
    <motion.div variants={fadeUp} custom={index} className="group relative h-full">
      <div className={`h-full flex flex-col rounded-2xl bg-gradient-to-br ${tool.gradient} backdrop-blur-xl border border-white/[0.08] overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/20 hover:border-white/[0.15]`}>
        <div className="p-6 sm:p-7 flex flex-col flex-1">
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} border ${tool.borderGradient} flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg`}>
            <Icon className={`w-6 h-6 text-${tool.accentColor}-400`} />
          </div>

          <h3 className="text-lg font-bold text-white mb-2">{tool.title}</h3>
          <p className="text-sm text-white/45 leading-relaxed mb-6 flex-1">
            {tool.shortDescription}
          </p>

          <Link to={tool.route} className="mt-auto">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/[0.06] border border-white/[0.1] text-white/70 text-sm font-medium transition-all duration-300 group-hover:bg-white/[0.1] group-hover:border-white/[0.2] group-hover:text-white"
            >
              Open Calculator
              <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

export default ToolCard;
