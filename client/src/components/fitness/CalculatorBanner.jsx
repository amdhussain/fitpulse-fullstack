import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiChevronRight, FiHome } from "react-icons/fi";
import { Container } from "../ui";
import { zoomFade } from "../../lib/animations";

function CalculatorBanner({ title, subtitle, description, Icon, accentColor = "cyan", gradient }) {
  const colorMap = {
    cyan: "from-cyan-500/10 to-teal-500/10 border-cyan-500/20 text-cyan-400",
    amber: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-400",
    emerald: "from-emerald-500/10 to-green-500/10 border-emerald-500/20 text-emerald-400",
    purple: "from-purple-500/10 to-violet-500/10 border-purple-500/20 text-purple-400",
    blue: "from-blue-500/10 to-sky-500/10 border-blue-500/20 text-blue-400",
    rose: "from-rose-500/10 to-pink-500/10 border-rose-500/20 text-rose-400",
    orange: "from-orange-500/10 to-red-500/10 border-orange-500/20 text-orange-400",
  };
  const badgeColor = colorMap[accentColor] || colorMap.cyan;
  const textColors = {
    cyan: "from-cyan-400 via-teal-300 to-cyan-500",
    amber: "from-amber-400 via-yellow-300 to-amber-500",
    emerald: "from-emerald-400 via-green-300 to-emerald-500",
    purple: "from-purple-400 via-violet-300 to-purple-500",
    blue: "from-blue-400 via-sky-300 to-blue-500",
    rose: "from-rose-400 via-pink-300 to-rose-500",
    orange: "from-orange-400 via-red-300 to-orange-500",
  };
  const gradientText = textColors[accentColor] || textColors.cyan;

  return (
    <section className={`relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br ${gradient || "from-cyan-950/40 via-base-100 to-teal-950/20"}`}>
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/6 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-blue-400/4 rounded-full blur-[100px]" />
      </div>

      <Container className="relative z-10 py-20 sm:py-24">
        <motion.div initial="hidden" animate="visible" className="max-w-2xl">
          <motion.div variants={zoomFade} custom={0}>
            <nav className="flex items-center gap-2 text-sm text-base-content/50 mb-6">
              <Link to="/" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
                <FiHome className="w-3.5 h-3.5" />
                Home
              </Link>
              <FiChevronRight className="w-3.5 h-3.5" />
              <Link to="/fitness-tools" className="hover:text-cyan-400 transition-colors">
                Fitness Tools
              </Link>
              <FiChevronRight className="w-3.5 h-3.5" />
              <span className="text-cyan-400">{subtitle}</span>
            </nav>
          </motion.div>

          <motion.div variants={zoomFade} custom={1}>
            <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${badgeColor} border text-sm font-semibold backdrop-blur-sm`}>
              {Icon && <Icon className="w-4 h-4" />}
              {subtitle}
            </span>
          </motion.div>

          <motion.h1
            variants={zoomFade}
            custom={2}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-base-content leading-[1.08] tracking-tight"
          >
            {title.split(" ").slice(0, Math.ceil(title.split(" ").length / 2)).join(" ")}
            <br />
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${gradientText}`}>
              {title.split(" ").slice(Math.ceil(title.split(" ").length / 2)).join(" ")}
            </span>
          </motion.h1>

          <motion.p
            variants={zoomFade}
            custom={3}
            className="mt-6 text-base-content/50 text-lg sm:text-xl leading-relaxed"
          >
            {description}
          </motion.p>
        </motion.div>
      </Container>
    </section>
  );
}

export default CalculatorBanner;
