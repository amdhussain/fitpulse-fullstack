import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiChevronRight,
  FiHome,
  FiAward,
  FiSettings,
  FiClock,
  FiTarget,
  FiHeart,
  FiUsers,
  FiStar,
  FiZap,
} from "react-icons/fi";
import { Container, Skeleton } from "../../components/ui";
import { zoomFade, staggerContainer, fadeUp } from "../../lib/animations";
import { getAboutSections } from "../../lib/aboutData";

function AboutPageSkeleton() {
  return (
    <>
      <div className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-purple-950/40 via-base-100 to-indigo-950/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-purple-500/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/6 rounded-full blur-[120px]" />
        </div>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl space-y-6">
            <Skeleton variant="shimmer" className="h-5 w-32 rounded-lg" />
            <Skeleton variant="shimmer" className="h-8 w-44 rounded-full" />
            <Skeleton variant="shimmer" className="h-14 w-full" />
            <Skeleton variant="shimmer" className="h-14 w-3/4" />
            <Skeleton variant="shimmer" className="h-5 w-full" />
            <Skeleton variant="shimmer" className="h-5 w-4/5" />
          </div>
        </div>
      </div>
      <div className="py-20 sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {[1, 2].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton variant="shimmer" className="h-64 rounded-3xl" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function AboutPage() {
  const [loading, setLoading] = useState(true);
  const [sections, setSections] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setSections(getAboutSections().filter((s) => s.status === "active"));
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <AboutPageSkeleton />;

  return (
    <>
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-purple-950/40 via-base-100 to-indigo-950/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-purple-500/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/6 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-purple-400/4 rounded-full blur-[100px]" />
        </div>

        <Container className="relative z-10 py-20 sm:py-24">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.div variants={zoomFade} custom={0}>
              <nav className="flex items-center gap-2 text-sm text-base-content/50 mb-6">
                <Link to="/" className="hover:text-purple-400 transition-colors flex items-center gap-1">
                  <FiHome className="w-3.5 h-3.5" />
                  Home
                </Link>
                <FiChevronRight className="w-3.5 h-3.5" />
                <span className="text-purple-400">About Us</span>
              </nav>
            </motion.div>

            <motion.div variants={zoomFade} custom={1}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold backdrop-blur-sm">
                <FiHeart className="w-4 h-4" />
                About FitBookPro
              </span>
            </motion.div>

            <motion.h1
              variants={zoomFade}
              custom={2}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-base-content leading-[1.08] tracking-tight"
            >
              We Help You
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-300 to-purple-500">
                Achieve More
              </span>
            </motion.h1>

            <motion.p
              variants={zoomFade}
              custom={3}
              className="mt-6 text-base-content/50 text-lg sm:text-xl leading-relaxed"
            >
              FitBookPro is your all-in-one fitness platform designed to
              connect you with world-class trainers, premium classes, and a
              community that keeps you motivated.
            </motion.p>

            <motion.div
              variants={zoomFade}
              custom={4}
              className="mt-8 flex items-center gap-6 flex-wrap"
            >
              <div className="flex items-center gap-2 text-sm text-base-content/50">
                <FiUsers className="w-5 h-5 text-purple-400" />
                <span>10K+ Members</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-base-content/50">
                <FiAward className="w-5 h-5 text-indigo-400" />
                <span>50+ Trainers</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-base-content/50">
                <FiStar className="w-5 h-5 text-purple-400 fill-purple-400" />
                <span>4.9 Rating</span>
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
            className="space-y-24"
          >
            {sections.map((section, idx) => (
              <motion.div
                key={section.id}
                variants={fadeUp}
                custom={idx}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
              >
                {idx % 2 === 1 && (
                  <div className="order-2 lg:order-1">
                    <div className="relative">
                      <div className="absolute inset-0 m-4 rounded-3xl bg-purple-500/5 backdrop-blur-xl border border-purple-500/10 rotate-2" aria-hidden="true" />
                      <img
                        src={section.image}
                        alt={section.title}
                        className="relative rounded-3xl overflow-hidden border border-purple-500/15 shadow-2xl shadow-black/20 w-full h-[350px] sm:h-[420px] object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}

                <div className={`space-y-6 ${idx % 2 === 1 ? "order-1 lg:order-2" : ""}`}>
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm font-semibold backdrop-blur-sm">
                    {section.subtitle}
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-bold text-base-content leading-tight">
                    {section.title}
                  </h2>
                  <p className="text-base-content/50 text-lg leading-relaxed">
                    {section.description}
                  </p>
                  {section.mission && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wider">Mission</h3>
                      <p className="text-base-content/45 leading-relaxed">{section.mission}</p>
                    </div>
                  )}
                  {section.vision && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">Vision</h3>
                      <p className="text-base-content/45 leading-relaxed">{section.vision}</p>
                    </div>
                  )}
                </div>

                {idx % 2 === 0 && (
                  <div>
                    <div className="relative">
                      <div className="absolute inset-0 m-4 rounded-3xl bg-purple-500/5 backdrop-blur-xl border border-purple-500/10 -rotate-2" aria-hidden="true" />
                      <img
                        src={section.image}
                        alt={section.title}
                        className="relative rounded-3xl overflow-hidden border border-purple-500/15 shadow-2xl shadow-black/20 w-full h-[350px] sm:h-[420px] object-cover"
                        loading="lazy"
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      <section className="py-20 sm:py-28 bg-base-200/30">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="text-center mb-14"
          >
            <motion.div variants={fadeUp} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold backdrop-blur-sm">
                <FiZap className="w-4 h-4" />
                Why Choose Us
              </span>
            </motion.div>
            <motion.h2
              variants={fadeUp}
              custom={1}
              className="mt-6 text-3xl sm:text-4xl font-bold text-base-content leading-tight"
            >
              Built for{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-400">
                Your Success
              </span>
            </motion.h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: FiAward, title: "Certified Trainers", desc: "Expert-led sessions with nationally certified fitness professionals." },
              { icon: FiSettings, title: "Modern Equipment", desc: "State-of-the-art machines and tools for every workout style." },
              { icon: FiClock, title: "Flexible Schedule", desc: "Morning, afternoon, or evening — book classes that fit your life." },
              { icon: FiTarget, title: "Personalized Plans", desc: "Custom programs designed around your goals and fitness level." },
            ].map((item, i) => (
              <motion.div key={item.title} variants={fadeUp} custom={i}>
                <div className="h-full p-6 rounded-2xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-purple-400" />
                  </div>
                  <h3 className="text-lg font-bold text-base-content mb-2">{item.title}</h3>
                  <p className="text-sm text-base-content/45 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </Container>
      </section>

      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-950/60 via-base-100 to-indigo-950/40" aria-hidden="true" />
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-base-content leading-tight tracking-tight mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-base-content/50 leading-relaxed mb-10 max-w-xl mx-auto">
              Join our community and start your fitness journey with expert guidance and a supportive environment.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/booking">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white font-semibold shadow-lg shadow-purple-500/25 hover:shadow-xl transition-all duration-300"
                >
                  Book a Session
                </motion.button>
              </Link>
              <Link to="/membership">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 rounded-xl border-2 border-purple-500/20 backdrop-blur-xl text-base-content/80 font-semibold transition-all duration-300 hover:bg-white/5"
                >
                  View Membership
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  );
}

export default AboutPage;
