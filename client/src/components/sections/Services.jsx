import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { Container, Button, SectionTitle } from "../ui";
import { staggerContainer, fadeUp } from "../../lib/animations";
import services from "./servicesData";
import { ServicesSkeleton } from "../ui/Skeleton";

const cardGlows = [
  "hover:shadow-emerald-500/10 hover:border-emerald-500/20",
  "hover:shadow-green-500/10 hover:border-green-500/20",
  "hover:shadow-emerald-400/10 hover:border-emerald-400/20",
  "hover:shadow-teal-500/10 hover:border-teal-500/20",
  "hover:shadow-green-400/10 hover:border-green-400/20",
  "hover:shadow-emerald-600/10 hover:border-emerald-600/20",
];

const iconBgs = [
  "bg-emerald-500/10 group-hover:bg-emerald-500 group-hover:shadow-emerald-500/25",
  "bg-green-500/10 group-hover:bg-green-500 group-hover:shadow-green-500/25",
  "bg-emerald-400/10 group-hover:bg-emerald-400 group-hover:shadow-emerald-400/25",
  "bg-teal-500/10 group-hover:bg-teal-500 group-hover:shadow-teal-500/25",
  "bg-green-400/10 group-hover:bg-green-400 group-hover:shadow-green-400/25",
  "bg-emerald-600/10 group-hover:bg-emerald-600 group-hover:shadow-emerald-600/25",
];

const iconColors = [
  "text-emerald-400 group-hover:text-white",
  "text-green-400 group-hover:text-white",
  "text-emerald-300 group-hover:text-white",
  "text-teal-400 group-hover:text-white",
  "text-green-300 group-hover:text-white",
  "text-emerald-500 group-hover:text-white",
];

function ServiceCard({ service, index }) {
  const Icon = service.icon;

  return (
    <motion.div variants={fadeUp} custom={index} className="h-full">
      <div className={`group h-full flex flex-col p-6 sm:p-7 rounded-2xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${cardGlows[index] || cardGlows[0]}`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-5 transition-all duration-300 shadow-lg ${iconBgs[index] || iconBgs[0]}`}>
          <Icon className={`w-6 h-6 transition-colors duration-300 ${iconColors[index] || iconColors[0]}`} />
        </div>

        <h3 className="text-lg font-bold text-base-content mb-2">
          {service.title}
        </h3>

        <p className="text-sm text-base-content/45 leading-relaxed mb-6 flex-1">
          {service.description}
        </p>

        <Link to={`/services/${service.id || 1}`} className="self-start">
          <Button variant="ghost" size="sm" className="-ml-2 group/btn text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10">
            Learn More
            <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

function Services() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <ServicesSkeleton />;

  return (
    <section id="services" className="relative py-20 sm:py-28 overflow-hidden bg-gradient-to-b from-base-100 via-emerald-950/8 to-base-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-500/4 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-green-500/3 rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center"
        >
          <motion.div variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-semibold backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-400" aria-hidden="true" />
              Our Services
            </span>
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <SectionTitle
              title="Explore Our Fitness Classes"
              description="From personal training to group sessions, find the perfect class to match your goals and schedule."
              accentColor="emerald"
              className="mt-6 mb-0"
            />
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {services.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </motion.div>
      </Container>
    </section>
  );
}

export default Services;
