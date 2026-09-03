import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { FiArrowRight, FiPlay } from "react-icons/fi";
import { Container, Button } from "../ui";
import { useAuth } from "../../context/AuthContext";
import { zoomFade } from "../../lib/animations";
import { HeroSkeleton } from "../ui/Skeleton";

const API_URL = import.meta.env.API_URL;

function CountUp({ target, suffix = "", duration = 1.5 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const step = target / (duration * 60);
    let raf;

    const animate = () => {
      start += step;
      if (start >= target) {
        setCount(target);
        return;
      }
      setCount(Math.floor(start));
      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(raf);
  }, [isInView, target, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
}

function Hero() {
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [stats, setStats] = useState([
    { value: 0, suffix: "+", label: "Classes" },
    { value: 0, suffix: "+", label: "Trainers" },
    { value: 0, suffix: "+", label: "Members" },
  ]);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/v1/dashboard/stats/public`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats([
            { value: data.data.classes, suffix: "+", label: "Classes" },
            { value: data.data.trainers, suffix: "+", label: "Trainers" },
            { value: data.data.members, suffix: "+", label: "Members" },
          ]);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    navigate("/booking");
  };

  if (loading) return <HeroSkeleton />;

  return (
    <section
      id="home"
      className="relative min-h-[90vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-50/60 via-white to-slate-50/80 dark:from-slate-900 dark:via-gray-900 dark:to-slate-900"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-200/40 dark:bg-blue-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-orange-200/30 dark:bg-orange-500/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-blue-100/50 dark:bg-blue-400/5 rounded-full blur-[100px]" />
      </div>

      <Container className="relative z-10 pt-24 sm:pt-28 lg:pt-32 pb-0">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-xl mx-auto lg:mx-0 text-center lg:text-left"
          >
            <motion.div variants={zoomFade} custom={0}>
              <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 text-blue-600 dark:text-blue-400 text-sm font-semibold tracking-wide">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" aria-hidden="true" />
                Transform Your Body
              </span>
            </motion.div>

            <motion.h1
              variants={zoomFade}
              custom={1}
              className="mt-8 text-5xl sm:text-6xl lg:text-7xl xl:text-[5.25rem] font-black text-base-content leading-[1.05] tracking-[-0.03em]"
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
              className="mt-7 text-base-content/50 text-lg sm:text-xl leading-[1.7] max-w-lg mx-auto lg:mx-0"
            >
              Book professional fitness classes, discover expert trainers,
              and start your healthy lifestyle today.
            </motion.p>

            <motion.div
              variants={zoomFade}
              custom={3}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button variant="blue" size="lg" className="group" onClick={handleBookNow}>
                Book Now
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <Link to="/services">
                <Button variant="blue" size="lg" className="group">
                  <FiPlay className="transition-transform duration-300 group-hover:scale-110" />
                  View Classes
                </Button>
              </Link>
            </motion.div>

            <motion.div
              variants={zoomFade}
              custom={4}
              className="mt-14 flex items-center gap-10 justify-center lg:justify-start"
            >
              {stats.map((stat, i) => (
                <div key={stat.label} className="flex items-center gap-4">
                  {i > 0 && <div className="w-px h-10 bg-blue-200 dark:bg-blue-500/20" aria-hidden="true" />}
                  <div>
                    <p className="text-3xl sm:text-4xl font-extrabold text-base-content tracking-tight">
                      <CountUp target={stat.value} suffix={stat.suffix} />
                    </p>
                    <p className="text-sm text-blue-600 mt-1 font-medium">{stat.label}</p>
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
            <div className="absolute inset-0 m-4 rounded-3xl bg-blue-100/50 backdrop-blur-xl border border-blue-200/50 rotate-3" aria-hidden="true" />

            <div className="relative rounded-3xl overflow-hidden border border-gray-200 dark:border-white/10 shadow-2xl shadow-gray-300/30 dark:shadow-black/40">
              <img
                src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&h=800&fit=crop&auto=format&q=80"
                alt="Professional fitness training in a modern gym with advanced equipment"
                className="w-full h-[400px] sm:h-[480px] lg:h-[560px] object-cover"
                loading="eager"
                width="700"
                height="800"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/70 via-transparent to-transparent" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-white/90 dark:bg-slate-800/90 backdrop-blur-lg border border-gray-200 dark:border-white/10 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center" aria-hidden="true">
                    <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-base-content">Next Session</p>
                    <p className="text-xs text-blue-600">HIIT Training — 6:00 PM Today</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>

      <AnimatePresence>
        {showAuthModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-gray-900/50 backdrop-blur-md z-50"
              onClick={() => setShowAuthModal(false)}
              aria-hidden="true"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-label="Login required"
            >
              <div
                className="w-full max-w-md rounded-2xl bg-white dark:bg-slate-800 border border-gray-200 dark:border-white/10 shadow-2xl shadow-gray-300/50 dark:shadow-black/40 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 text-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mx-auto mb-4 ring-4 ring-blue-100">
                    <FiArrowRight className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    Login Required
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
                    Please register or login first before booking a class.
                  </p>
                </div>
                <div className="px-6 py-4 bg-gray-50 dark:bg-slate-900 border-t border-gray-100 dark:border-white/10 flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowAuthModal(false)}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 transition-all duration-200"
                  >
                    Cancel
                  </button>
                  <Link to="/register">
                    <button className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.97] bg-gradient-to-r from-gray-600 to-gray-500 text-white hover:from-gray-700 hover:to-gray-600 shadow-md shadow-gray-500/25">
                      Register
                    </button>
                  </Link>
                  <Link to="/login">
                    <button className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 active:scale-[0.97] bg-gradient-to-r from-blue-600 to-indigo-500 text-white hover:from-blue-700 hover:to-indigo-600 shadow-md shadow-blue-500/25">
                      Login
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </section>
  );
}

export default Hero;
