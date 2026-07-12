import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCalendar, FiCreditCard, FiCheck } from "react-icons/fi";
import { Container } from "../ui";

function FitnessCTA({ accentColor = "cyan" }) {
  const gradientMap = {
    cyan: "from-cyan-950/60 via-base-100 to-teal-950/40",
    amber: "from-amber-950/60 via-base-100 to-orange-950/40",
    emerald: "from-emerald-950/60 via-base-100 to-green-950/40",
    purple: "from-purple-950/60 via-base-100 to-violet-950/40",
    blue: "from-blue-950/60 via-base-100 to-sky-950/40",
    rose: "from-rose-950/60 via-base-100 to-pink-950/40",
    orange: "from-orange-950/60 via-base-100 to-red-950/40",
  };
  const btnColors = {
    cyan: "from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 shadow-cyan-500/25",
    amber: "from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 shadow-amber-500/25",
    emerald: "from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 shadow-emerald-500/25",
    purple: "from-purple-500 to-violet-500 hover:from-purple-400 hover:to-violet-400 shadow-purple-500/25",
    blue: "from-blue-500 to-sky-500 hover:from-blue-400 hover:to-sky-400 shadow-blue-500/25",
    rose: "from-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 shadow-rose-500/25",
    orange: "from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 shadow-orange-500/25",
  };
  const borderColors = {
    cyan: "border-cyan-500/20",
    amber: "border-amber-500/20",
    emerald: "border-emerald-500/20",
    purple: "border-purple-500/20",
    blue: "border-blue-500/20",
    rose: "border-rose-500/20",
    orange: "border-orange-500/20",
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
  const badgeColors = {
    cyan: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400",
    amber: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    emerald: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400",
    purple: "bg-purple-500/10 border-purple-500/20 text-purple-400",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
    rose: "bg-rose-500/10 border-rose-500/20 text-rose-400",
    orange: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  };

  const bg = gradientMap[accentColor] || gradientMap.cyan;
  const btn = btnColors[accentColor] || btnColors.cyan;
  const border = borderColors[accentColor] || borderColors.cyan;
  const text = textColors[accentColor] || textColors.cyan;
  const badge = badgeColors[accentColor] || badgeColors.cyan;

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className={`absolute inset-0 bg-gradient-to-br ${bg}`} aria-hidden="true" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold backdrop-blur-sm mb-6 ${badge}`}>
            <FiCalendar className="w-4 h-4" />
            Ready to Start?
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-base-content leading-tight tracking-tight mb-6">
            Take Your Fitness to the{" "}
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${btn.replace("hover:", "").split(" ")[0].replace("from-", "from-")}`}>
              Next Level
            </span>
          </h2>

          <p className="text-lg text-base-content/50 leading-relaxed mb-10 max-w-xl mx-auto">
            Now that you know your numbers, let our expert trainers create a personalized plan to help you reach your goals faster.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/booking">
                <button className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r ${btn} text-white font-semibold text-base shadow-lg transition-all duration-300`}>
                  <FiCalendar className="w-5 h-5" />
                  Book a Trainer
                  <FiArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/membership">
                <button className={`inline-flex items-center gap-2 px-8 py-3.5 rounded-xl border-2 ${border} backdrop-blur-xl text-base-content/80 font-semibold text-base transition-all duration-300 hover:bg-white/5`}>
                  <FiCreditCard className="w-5 h-5" />
                  Join Membership
                </button>
              </Link>
            </motion.div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-base-content/40 flex-wrap">
            <div className="flex items-center gap-2">
              <FiCheck className={`w-4 h-4 ${text}`} />
              <span>Free consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className={`w-4 h-4 ${text}`} />
              <span>Expert trainers</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className={`w-4 h-4 ${text}`} />
              <span>Personalized plans</span>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

export default FitnessCTA;
