import { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { FiAward, FiCalendar, FiTarget, FiDollarSign, FiCpu, FiHeadphones } from "react-icons/fi";
import { Container, SectionTitle, Skeleton } from "../ui";
import { staggerContainer, fadeUp } from "../../lib/animations";

const features = [
  {
    icon: FiAward,
    title: "Certified Professional Trainers",
    description: "Work with nationally certified experts who design programs tailored to your goals.",
    color: "blue",
  },
  {
    icon: FiCalendar,
    title: "Flexible Booking System",
    description: "Book classes anytime, anywhere. Reschedule or cancel with ease — full control in your hands.",
    color: "indigo",
  },
  {
    icon: FiTarget,
    title: "Personalized Workout Plans",
    description: "Custom routines built around your fitness level, schedule, and personal objectives.",
    color: "violet",
  },
  {
    icon: FiDollarSign,
    title: "Affordable Membership Plans",
    description: "Premium fitness access at prices that work for every budget. No hidden fees.",
    color: "blue",
  },
  {
    icon: FiCpu,
    title: "Modern Equipment",
    description: "Train with state-of-the-art machines, free weights, and the latest fitness technology.",
    color: "indigo",
  },
  {
    icon: FiHeadphones,
    title: "Friendly Support",
    description: "Our team is here to help — whether you need booking assistance or training advice.",
    color: "violet",
  },
];

const colorMap = {
  blue: {
    iconBg: "bg-blue-500/10 group-hover:bg-blue-500 group-hover:shadow-blue-500/25",
    iconColor: "text-blue-400 group-hover:text-white",
    glow: "hover:shadow-blue-500/10 hover:border-blue-500/20",
  },
  indigo: {
    iconBg: "bg-indigo-500/10 group-hover:bg-indigo-500 group-hover:shadow-indigo-500/25",
    iconColor: "text-indigo-400 group-hover:text-white",
    glow: "hover:shadow-indigo-500/10 hover:border-indigo-500/20",
  },
  violet: {
    iconBg: "bg-violet-500/10 group-hover:bg-violet-500 group-hover:shadow-violet-500/25",
    iconColor: "text-violet-400 group-hover:text-white",
    glow: "hover:shadow-violet-500/10 hover:border-violet-500/20",
  },
};

function WhyChooseUs() {
  const [loading, setLoading] = useState(true);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <section className="relative py-24 sm:py-32 lg:py-40 overflow-hidden bg-gradient-to-b from-base-100 via-blue-950/5 to-base-100">
        <Container>
          <div className="text-center space-y-3 mb-16">
            <Skeleton variant="shimmer" className="h-8 w-32 rounded-full mx-auto" />
            <Skeleton variant="shimmer" className="h-10 w-80 mx-auto" />
            <Skeleton variant="shimmer" className="h-5 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="p-7 rounded-3xl bg-base-200/40 border border-base-300/30 space-y-4">
                <Skeleton variant="shimmer" className="w-14 h-14 rounded-2xl" />
                <Skeleton variant="shimmer" className="h-5 w-40" />
                <div className="space-y-2">
                  <Skeleton variant="shimmer" className="h-3 w-full" />
                  <Skeleton variant="shimmer" className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative py-24 sm:py-32 lg:py-40 overflow-hidden bg-gradient-to-b from-base-100 via-blue-950/5 to-base-100">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-1/2 -right-40 w-[600px] h-[600px] bg-blue-500/4 rounded-full blur-[160px]" />
        <div className="absolute bottom-0 -left-40 w-[400px] h-[400px] bg-indigo-500/3 rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="text-center"
        >
          <motion.div variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold backdrop-blur-sm tracking-wide">
              <span className="w-2 h-2 rounded-full bg-blue-400" aria-hidden="true" />
              Why Choose Us
            </span>
          </motion.div>

          <motion.div variants={fadeUp} custom={1}>
            <SectionTitle
              title="Built for Your Success"
              description="Everything you need to start, sustain, and elevate your fitness journey — all in one platform."
              accentColor="blue"
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
          {features.map((feature, i) => {
            const colors = colorMap[feature.color];
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} variants={fadeUp} custom={i} className="h-full">
                <div className={`group h-full flex flex-col p-7 sm:p-8 rounded-3xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl ${colors.glow}`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-all duration-300 shadow-lg ${colors.iconBg}`}>
                    <Icon className={`w-6 h-6 transition-colors duration-300 ${colors.iconColor}`} />
                  </div>

                  <h3 className="text-xl font-bold text-base-content mb-3 tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="text-sm text-base-content/45 leading-[1.7] flex-1">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </Container>
    </section>
  );
}

export default WhyChooseUs;
