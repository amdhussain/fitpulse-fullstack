import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiPlay } from "react-icons/fi";
import { Container, Button } from "../ui";
import { zoomFade } from "../../lib/animations";
import { HeroSkeleton } from "../ui/Skeleton";

const stats = [
  { value: "500+", label: "Classes" },
  { value: "50+", label: "Trainers" },
  { value: "10K+", label: "Members" },
];

function Hero() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <HeroSkeleton />;

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-950/40 via-base-100 to-slate-900/60"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-500/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-500/6 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-blue-400/4 rounded-full blur-[100px]" />
      </div>

      <Container className="relative z-10 py-16 sm:py-20 lg:py-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left"
          >
            <motion.div variants={zoomFade} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" aria-hidden="true" />
                Transform Your Body
              </span>
            </motion.div>

            <motion.h1
              variants={zoomFade}
              custom={1}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-black text-base-content leading-[1.08] tracking-tight"
            >
              Train Smarter.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-300 to-orange-400">
                Live Stronger.
              </span>
            </motion.h1>

            <motion.p
              variants={zoomFade}
              custom={2}
              className="mt-6 text-base-content/50 text-lg sm:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0"
            >
              Book professional fitness classes, discover expert trainers,
              and start your healthy lifestyle today.
            </motion.p>

            <motion.div
              variants={zoomFade}
              custom={3}
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Link to="/booking">
                <Button variant="blue" size="lg" className="group">
                  Book Now
                  <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="outline" size="lg" className="group border-blue-400 text-blue-400 hover:bg-blue-500 hover:text-white hover:border-blue-500">
                  <FiPlay className="transition-transform duration-300 group-hover:scale-110" />
                  View Classes
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={zoomFade}
              custom={4}
              className="mt-12 flex items-center gap-8 justify-center lg:justify-start"
            >
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-3">
                  {i > 0 && <div className="w-px h-8 bg-blue-500/20" aria-hidden="true" />}
                  <div>
                    <p className="text-2xl sm:text-3xl font-bold text-base-content">{stat.value}</p>
                    <p className="text-sm text-blue-400/60">{stat.label}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            variants={zoomFade}
            custom={2}
            initial="hidden"
            animate="visible"
            className="relative mx-auto lg:mx-0 w-full max-w-lg lg:max-w-none"
          >
            <div className="absolute inset-0 m-4 rounded-3xl bg-blue-500/5 backdrop-blur-xl border border-blue-500/10 rotate-3" aria-hidden="true" />

            <div className="relative rounded-3xl overflow-hidden border border-blue-500/15 shadow-2xl shadow-black/20">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&h=800&fit=crop&auto=format&q=80"
                alt="Professional fitness training in a modern gym with advanced equipment"
                className="w-full h-[400px] sm:h-[480px] lg:h-[560px] object-cover"
                loading="eager"
                width="700"
                height="800"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-base-100/70 via-transparent to-transparent" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-blue-950/60 backdrop-blur-lg border border-blue-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center" aria-hidden="true">
                    <div className="w-3 h-3 rounded-full bg-orange-400 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-base-content">Next Session</p>
                    <p className="text-xs text-blue-300/50">HIIT Training — 6:00 PM Today</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default Hero;
