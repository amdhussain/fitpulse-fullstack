import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Container } from "../../components/ui";
import { ToolCard, HubSkeleton } from "../../components/fitness";
import { staggerContainer, fadeUp, zoomFade } from "../../lib/animations";
import { getHubTools } from "../../lib/fitnessToolsData";

function FitnessToolsHub() {
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setTools(getHubTools());
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <HubSkeleton />;

  return (
    <>
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-cyan-950/40 via-base-100 to-emerald-950/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/6 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-blue-400/4 rounded-full blur-[100px]" />
        </div>

        <Container className="relative z-10 py-20 sm:py-24">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.div variants={zoomFade} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true" />
                Fitness Tools
              </span>
            </motion.div>

            <motion.h1
              variants={zoomFade}
              custom={1}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-base-content leading-[1.08] tracking-tight"
            >
              Your Health
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-emerald-300 to-teal-400">
                Calculated.
              </span>
            </motion.h1>

            <motion.p
              variants={zoomFade}
              custom={2}
              className="mt-6 text-base-content/50 text-lg sm:text-xl leading-relaxed"
            >
              Access our suite of professional fitness calculators. Get personalized insights
              for BMI, BMR, calorie needs, protein intake, and more — all backed by science.
            </motion.p>

            <motion.div
              variants={zoomFade}
              custom={3}
              className="mt-8 flex flex-wrap items-center gap-4"
            >
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/15 text-sm text-cyan-400">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                7 Professional Tools
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/15 text-sm text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Instant Results
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-500/10 border border-blue-500/15 text-sm text-blue-400">
                <span className="w-2 h-2 rounded-full bg-blue-400" />
                Science-Based
              </div>
            </motion.div>
          </motion.div>
        </Container>
      </section>

      <section className="py-20 sm:py-28 bg-base-100">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-14"
          >
            <motion.div variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
                Choose a Tool
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="mt-6 text-3xl sm:text-4xl lg:text-5xl font-bold text-base-content leading-tight tracking-tight"
            >
              Fitness{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                Calculators
              </span>
            </motion.h2>

            <motion.p
              variants={fadeUp}
              custom={2}
              className="mt-4 text-base-content/45 text-lg max-w-xl mx-auto"
            >
              Select a calculator below to get started. All calculations are instant and free.
            </motion.p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {tools.map((tool, i) => (
              <ToolCard key={tool.id} tool={tool} index={i} />
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="mt-16 text-center"
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-cyan-500/5 border border-cyan-500/10 text-base-content/50">
              <span className="text-sm">All calculators use scientifically validated formulas</span>
            </div>
          </motion.div>
        </Container>
      </section>

      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/60 via-base-100 to-emerald-950/40" aria-hidden="true" />
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[120px]" />
        </div>

        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-base-content leading-tight tracking-tight mb-6">
              Ready for Expert Guidance?
            </h2>
            <p className="text-lg text-base-content/50 leading-relaxed mb-10 max-w-xl mx-auto">
              Let our certified trainers create a personalized fitness plan based on your calculator results.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/booking">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-xl transition-all duration-300"
                >
                  Book a Trainer
                </motion.button>
              </Link>
              <Link to="/membership">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 rounded-xl border-2 border-cyan-500/20 backdrop-blur-xl text-base-content/80 font-semibold transition-all duration-300 hover:bg-white/5"
                >
                  View Membership Plans
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  );
}

export default FitnessToolsHub;
