import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiChevronRight,
  FiHome,
  FiClock,
  FiDollarSign,
  FiUser,
  FiArrowRight,
  FiZap,
} from "react-icons/fi";
import { Container, Button, Skeleton } from "../../components/ui";
import { zoomFade, staggerContainer, fadeUp } from "../../lib/animations";
import { getServices } from "../../lib/servicesData";

function ServicesPageSkeleton() {
  return (
    <>
      <div className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-emerald-950/40 via-base-100 to-green-950/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/6 rounded-full blur-[120px]" />
        </div>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl space-y-6">
            <Skeleton variant="shimmer" className="h-5 w-32 rounded-lg" />
            <Skeleton variant="shimmer" className="h-8 w-44 rounded-full" />
            <Skeleton variant="shimmer" className="h-14 w-full" />
            <Skeleton variant="shimmer" className="h-14 w-3/4" />
            <Skeleton variant="shimmer" className="h-5 w-full" />
          </div>
        </div>
      </div>
      <div className="py-20 sm:py-28">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="rounded-2xl bg-base-200/40 border border-base-300/30 overflow-hidden">
                <Skeleton variant="shimmer" className="h-48 w-full rounded-none" />
                <div className="p-5 space-y-3">
                  <Skeleton variant="shimmer" className="h-5 w-32" />
                  <Skeleton variant="shimmer" className="h-3 w-full" />
                  <Skeleton variant="shimmer" className="h-3 w-4/5" />
                  <Skeleton variant="shimmer" className="h-10 w-full rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

const categoryColorClasses = {
  Training: {
    badge: "bg-emerald-500/15 border-emerald-500/20 text-emerald-400",
  },
  Wellness: {
    badge: "bg-teal-500/15 border-teal-500/20 text-teal-400",
  },
  Cardio: {
    badge: "bg-green-500/15 border-green-500/20 text-green-400",
  },
  Nutrition: {
    badge: "bg-emerald-500/15 border-emerald-500/20 text-emerald-400",
  },
  Recovery: {
    badge: "bg-teal-500/15 border-teal-500/20 text-teal-400",
  },
};

function ServiceCard({ service, index }) {
  const colorClasses = categoryColorClasses[service.category] || categoryColorClasses.Training;

  return (
    <motion.div variants={fadeUp} custom={index} className="h-full">
      <div className="group h-full flex flex-col rounded-2xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-emerald-500/10">
        <div className="relative h-48 overflow-hidden">
          <img
            src={service.image}
            alt={service.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-100/80 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className={`px-2.5 py-1 rounded-full border text-[11px] font-semibold backdrop-blur-sm ${colorClasses.badge}`}>
              {service.category}
            </span>
            {service.featured && (
              <span className="px-2.5 py-1 rounded-full bg-amber-500/15 border border-amber-500/20 text-amber-400 text-[11px] font-semibold backdrop-blur-sm">
                Featured
              </span>
            )}
          </div>
        </div>

        <div className="p-5 flex flex-col flex-1">
          <h3 className="text-lg font-bold text-base-content mb-2">{service.name}</h3>
          <p className="text-sm text-base-content/45 leading-relaxed mb-4 flex-1 line-clamp-2">{service.description}</p>

          <div className="flex items-center gap-4 text-xs text-base-content/50 mb-4">
            <div className="flex items-center gap-1">
              <FiClock className="w-3.5 h-3.5" />
              {service.duration}
            </div>
            <div className="flex items-center gap-1">
              <FiDollarSign className="w-3.5 h-3.5" />
              {service.price}
            </div>
            <div className="flex items-center gap-1">
              <FiUser className="w-3.5 h-3.5" />
              {service.trainer}
            </div>
          </div>

          <Link to={`/services/${service.id}`}>
            <Button variant="emerald" size="sm" className="w-full group/btn">
              View Details
              <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function ServicesPage() {
  const [loading, setLoading] = useState(true);
  const [services, setServices] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setServices(getServices().filter((s) => s.status === "active"));
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <ServicesPageSkeleton />;

  const categories = ["All", ...new Set(services.map((s) => s.category))];
  const filtered = filter === "All" ? services : services.filter((s) => s.category === filter);

  return (
    <>
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-emerald-950/40 via-base-100 to-green-950/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-500/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-green-500/6 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-emerald-400/4 rounded-full blur-[100px]" />
        </div>

        <Container className="relative z-10 py-20 sm:py-24">
          <motion.div initial="hidden" animate="visible" className="max-w-2xl">
            <motion.div variants={zoomFade} custom={0}>
              <nav className="flex items-center gap-2 text-sm text-base-content/50 mb-6">
                <Link to="/" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
                  <FiHome className="w-3.5 h-3.5" />
                  Home
                </Link>
                <FiChevronRight className="w-3.5 h-3.5" />
                <span className="text-emerald-400">Services</span>
              </nav>
            </motion.div>

            <motion.div variants={zoomFade} custom={1}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold backdrop-blur-sm">
                <FiZap className="w-4 h-4" />
                Our Services
              </span>
            </motion.div>

            <motion.h1
              variants={zoomFade}
              custom={2}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-base-content leading-[1.08] tracking-tight"
            >
              Explore Our
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-green-300 to-teal-400">
                Fitness Classes
              </span>
            </motion.h1>

            <motion.p
              variants={zoomFade}
              custom={3}
              className="mt-6 text-base-content/50 text-lg sm:text-xl leading-relaxed"
            >
              From personal training to group sessions, find the perfect class
              to match your goals and schedule.
            </motion.p>
          </motion.div>
        </Container>
      </section>

      <section className="py-20 sm:py-28 bg-base-100">
        <Container>
          <div className="flex flex-wrap gap-3 mb-10 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                  filter === cat
                    ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25"
                    : "bg-base-200/60 text-base-content/50 hover:bg-base-300/50 hover:text-base-content"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filtered.map((service, i) => (
              <ServiceCard key={service.id} service={service} index={i} />
            ))}
          </motion.div>
        </Container>
      </section>

      <section className="relative py-20 sm:py-28 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-950/60 via-base-100 to-green-950/40" aria-hidden="true" />
        <Container className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl sm:text-4xl font-black text-base-content leading-tight tracking-tight mb-6">
              Can&apos;t Find What You Need?
            </h2>
            <p className="text-lg text-base-content/50 leading-relaxed mb-10 max-w-xl mx-auto">
              Contact us for a custom training program tailored to your specific fitness goals.
            </p>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <Link to="/contact">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-white font-semibold shadow-lg shadow-emerald-500/25 hover:shadow-xl transition-all duration-300"
                >
                  Contact Us
                </motion.button>
              </Link>
              <Link to="/booking">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-3.5 rounded-xl border-2 border-emerald-500/20 backdrop-blur-xl text-base-content/80 font-semibold transition-all duration-300 hover:bg-white/5"
                >
                  Book a Session
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  );
}

export default ServicesPage;
