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
  "text-emerald-600 group-hover:text-white",
  "text-green-600 group-hover:text-white",
  "text-emerald-500 group-hover:text-white",
  "text-teal-600 group-hover:text-white",
  "text-green-500 group-hover:text-white",
  "text-emerald-700 group-hover:text-white",
];

function ServiceCard({ service, index }) {
  const Icon = service.icon;

  return (
    <motion.div variants={fadeUp} custom={index} className="h-full">
      <div className={`group h-full flex flex-col p-7 sm:p-8 rounded-3xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${cardGlows[index] || cardGlows[0]}`}>
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 shadow-lg ${iconBgs[index] || iconBgs[0]}`}>
          <Icon className={`w-6 h-6 transition-colors duration-300 ${iconColors[index] || iconColors[0]}`} />
        </div>

        <h3 className="text-xl font-bold text-base-content mb-3 tracking-tight">
          {service.title}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 leading-[1.7] mb-7 flex-1">
          {service.description}
        </p>

        <Link to={`/services/${service.id || 1}`} className="self-start">
          <Button variant="ghost" size="sm" className="-ml-2 group/btn text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50">
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
    setLoading(false);
  }, []);

  if (loading) return <ServicesSkeleton />;

  return (
    <section id="services" className="relative py-24 sm:py-32 lg:py-40 overflow-hidden bg-gradient-to-b from-white via-emerald-50/30 to-white dark:from-slate-900 dark:via-emerald-950/5 dark:to-slate-900">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] bg-emerald-200/30 dark:bg-emerald-500/5 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-green-200/20 dark:bg-green-500/5 rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center"
        >
          <motion.div variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-sm font-semibold tracking-wide">
              <span className="w-2 h-2 rounded-full bg-emerald-500" aria-hidden="true" />
              Our Services
            </span>
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <SectionTitle
              title="Explore Our Fitness Classes"
              description="From personal training to group sessions, find the perfect class to match your goals and schedule."
              accentColor="emerald"
              className="mt-7 mb-0"
            />
          </motion.div>
        </motion.div>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7"
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
