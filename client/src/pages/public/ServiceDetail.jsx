import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiHome,
  FiChevronRight,
  FiClock,
  FiDollarSign,
  FiUser,
  FiStar,
  FiCheck,
  FiCalendar,
  FiAward,
} from "react-icons/fi";
import { Container, Button, Skeleton } from "../../components/ui";
import { slideInLeft, slideInRight } from "../../lib/animations";
import { getServices } from "../../lib/servicesData";

function ServiceDetailSkeleton() {
  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Skeleton variant="shimmer" className="h-5 w-48 rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <Skeleton variant="shimmer" className="h-[400px] lg:h-[500px] rounded-3xl" />
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton variant="shimmer" className="h-5 w-40 rounded-full" />
              <Skeleton variant="shimmer" className="h-10 w-64" />
              <Skeleton variant="shimmer" className="h-5 w-48" />
            </div>
            <Skeleton variant="shimmer" className="h-4 w-full" />
            <Skeleton variant="shimmer" className="h-4 w-full" />
            <Skeleton variant="shimmer" className="h-4 w-3/4" />
            <div className="grid grid-cols-2 gap-4 pt-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="p-4 rounded-xl bg-base-200/40 border border-base-300/30 space-y-2">
                  <Skeleton variant="shimmer" className="h-4 w-20" />
                  <Skeleton variant="shimmer" className="h-3 w-full" />
                </div>
              ))}
            </div>
            <Skeleton variant="shimmer" className="h-12 w-48 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

function ServiceDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [service, setService] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      const all = getServices();
      setService(all.find((s) => String(s.id) === String(id)));
      setLoading(false);
    }, 600);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) return <ServiceDetailSkeleton />;

  if (!service) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-base-content">Service Not Found</h2>
          <p className="text-base-content/50">The service you are looking for does not exist.</p>
          <Link to="/services">
            <Button variant="emerald">Back to Services</Button>
          </Link>
        </div>
      </div>
    );
  }

  const benefits = service.benefits ? service.benefits.split(",").map((b) => b.trim()) : [];

  return (
    <div className="py-20 sm:py-28">
      <Container>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <nav className="flex items-center gap-2 text-sm text-base-content/50 mb-8">
            <Link to="/" className="hover:text-emerald-400 transition-colors flex items-center gap-1">
              <FiHome className="w-3.5 h-3.5" />
              Home
            </Link>
            <FiChevronRight className="w-3.5 h-3.5" />
            <Link to="/services" className="hover:text-emerald-400 transition-colors">
              Services
            </Link>
            <FiChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-400">{service.name}</span>
          </nav>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate="visible"
          >
            <div className="relative">
              <div className="absolute inset-0 m-4 rounded-3xl bg-emerald-500/5 backdrop-blur-xl border border-emerald-500/10 -rotate-2" aria-hidden="true" />
              <img
                src={service.image}
                alt={service.name}
                className="relative rounded-3xl overflow-hidden border border-emerald-500/15 shadow-2xl shadow-black/20 w-full h-[400px] lg:h-[500px] object-cover"
              />
            </div>
          </motion.div>

          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold backdrop-blur-sm">
                <FiAward className="w-4 h-4" />
                {service.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-base-content">{service.name}</h1>
              <p className="text-base-content/50 leading-relaxed">{service.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-base-200/40 border border-base-300/30">
                <FiDollarSign className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs text-base-content/40">Price</p>
                  <p className="text-sm font-semibold text-base-content">{service.price}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-base-200/40 border border-base-300/30">
                <FiClock className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs text-base-content/40">Duration</p>
                  <p className="text-sm font-semibold text-base-content">{service.duration}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-base-200/40 border border-base-300/30">
                <FiUser className="w-5 h-5 text-emerald-400" />
                <div>
                  <p className="text-xs text-base-content/40">Trainer</p>
                  <p className="text-sm font-semibold text-base-content">{service.trainer}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-base-200/40 border border-base-300/30">
                <FiStar className="w-5 h-5 text-emerald-400 fill-emerald-400" />
                <div>
                  <p className="text-xs text-base-content/40">Category</p>
                  <p className="text-sm font-semibold text-base-content">{service.category}</p>
                </div>
              </div>
            </div>

            {benefits.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Benefits</h3>
                <div className="space-y-2">
                  {benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3 text-sm text-base-content/60">
                      <FiCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-4 pt-4">
              <Link to="/booking">
                <Button variant="emerald" size="lg" className="group">
                  <FiCalendar className="w-5 h-5 mr-2" />
                  Book This Service
                </Button>
              </Link>
              <Link to="/services">
                <Button variant="ghost" size="lg" className="group">
                  <FiArrowLeft className="w-5 h-5 mr-2" />
                  All Services
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </Container>
    </div>
  );
}

export default ServiceDetail;
