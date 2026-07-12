import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiStar,
  FiClock,
  FiAward,
  FiArrowRight,
  FiChevronRight,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
} from "react-icons/fi";
import { Container, Button, SectionTitle, Skeleton } from "../../components/ui";
import { zoomFade, staggerContainer } from "../../lib/animations";
import { getTrainers } from "../../lib/trainersData";

function TrainersSkeleton() {
  return (
    <>
      <div className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-cyan-950/40 via-base-100 to-teal-950/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/6 rounded-full blur-[120px]" />
        </div>
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-20">
          <div className="max-w-2xl space-y-6">
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
          <div className="text-center mb-14 space-y-3">
            <Skeleton variant="shimmer" className="h-8 w-36 rounded-full mx-auto" />
            <Skeleton variant="shimmer" className="h-10 w-72 mx-auto" />
            <Skeleton variant="shimmer" className="h-5 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="rounded-2xl bg-base-200/40 border border-base-300/30 overflow-hidden space-y-0">
                <Skeleton variant="shimmer" className="h-72 w-full rounded-none" />
                <div className="p-5 space-y-3">
                  <Skeleton variant="shimmer" className="h-5 w-32" />
                  <Skeleton variant="shimmer" className="h-4 w-24" />
                  <Skeleton variant="shimmer" className="h-3 w-full" />
                  <Skeleton variant="shimmer" className="h-3 w-4/5" />
                  <div className="flex gap-2 pt-2">
                    <Skeleton variant="shimmer" className="h-8 w-20 rounded-lg" />
                    <Skeleton variant="shimmer" className="h-8 w-8 rounded-lg" />
                    <Skeleton variant="shimmer" className="h-8 w-8 rounded-lg" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

function TrainerCard({ trainer, index }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const socialIcons = [
    { icon: FiInstagram, href: trainer.social?.instagram || "#", label: "Instagram" },
    { icon: FiTwitter, href: trainer.social?.twitter || "#", label: "Twitter" },
    { icon: FiLinkedin, href: trainer.social?.linkedin || "#", label: "LinkedIn" },
  ];

  return (
    <motion.div
      variants={zoomFade}
      custom={index}
      className="group relative"
    >
      <div className="relative rounded-2xl overflow-hidden bg-base-200/60 backdrop-blur-xl border border-base-300/50 shadow-lg shadow-black/10 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-500 hover:-translate-y-2">
        <div className="relative h-72 overflow-hidden">
          {!imageLoaded && (
            <Skeleton variant="shimmer" className="absolute inset-0 h-full w-full rounded-none" />
          )}
          <img
            src={trainer.image}
            alt={`${trainer.name} - ${trainer.specialization}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
            width="600"
            height="750"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-base-100/90 via-base-100/20 to-transparent" />

          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
            <div className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-cyan-500 text-white text-xs font-bold shadow-lg shadow-cyan-500/30">
              <FiStar className="w-3.5 h-3.5 fill-current" />
              {trainer.rating}
            </div>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/20 text-cyan-400 text-[11px] font-semibold backdrop-blur-sm">
                {trainer.specialization}
              </span>
              <span className="px-2.5 py-1 rounded-full bg-teal-500/15 border border-teal-500/20 text-teal-400 text-[11px] font-semibold backdrop-blur-sm">
                {trainer.experience || "N/A"}
              </span>
            </div>
            <h3 className="text-xl font-bold text-base-content">{trainer.name}</h3>
            <p className="text-sm text-cyan-400 font-medium">{trainer.designation}</p>
          </div>
        </div>

        <div className="p-5 pt-4">
          <p className="text-sm text-base-content/50 leading-relaxed line-clamp-2 mb-4">
            {trainer.bio}
          </p>

          <div className="flex items-center gap-1.5 mb-4">
            {(trainer.availableDays || []).map((day) => (
              <span
                key={day}
                className="px-2 py-1 rounded-md bg-base-300/50 text-[10px] font-medium text-base-content/50"
              >
                {day}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Link to={`/trainers/${trainer.id}`} className="flex-1">
              <Button variant="cyan" size="sm" className="w-full group/btn">
                View Details
                <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Button>
            </Link>
            {socialIcons.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={`${trainer.name} ${social.label}`}
                className="w-9 h-9 rounded-lg bg-base-300/50 flex items-center justify-center text-base-content/40 hover:bg-cyan-500 hover:text-white transition-all duration-300 hover:scale-110 shrink-0"
              >
                <social.icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TrainersPage() {
  const [loading, setLoading] = useState(true);
  const [trainers, setTrainers] = useState([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setTrainers(getTrainers());
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <TrainersSkeleton />;

  return (
    <>
      <section className="relative min-h-[60vh] flex items-center overflow-hidden bg-gradient-to-br from-cyan-950/40 via-base-100 to-teal-950/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-cyan-500/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/6 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-cyan-400/4 rounded-full blur-[100px]" />
        </div>

        <Container className="relative z-10 py-20 sm:py-24">
          <motion.div
            initial="hidden"
            animate="visible"
            className="max-w-2xl"
          >
            <motion.div variants={zoomFade} custom={0}>
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-semibold backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true" />
                Expert Trainers
              </span>
            </motion.div>

            <motion.h1
              variants={zoomFade}
              custom={1}
              className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-base-content leading-[1.08] tracking-tight"
            >
              Meet Our
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-500">
                Elite Trainers
              </span>
            </motion.h1>

            <motion.p
              variants={zoomFade}
              custom={2}
              className="mt-6 text-base-content/50 text-lg sm:text-xl leading-relaxed"
            >
              World-class fitness professionals dedicated to helping you
              achieve your goals through personalized training and expert guidance.
            </motion.p>

            <motion.div
              variants={zoomFade}
              custom={3}
              className="mt-8 flex items-center gap-6"
            >
              <div className="flex items-center gap-2 text-sm text-base-content/50">
                <FiAward className="w-5 h-5 text-cyan-400" />
                <span>Certified Experts</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-base-content/50">
                <FiClock className="w-5 h-5 text-teal-400" />
                <span>Flexible Scheduling</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-base-content/50">
                <FiStar className="w-5 h-5 text-cyan-400 fill-cyan-400" />
                <span>4.8+ Average Rating</span>
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
          >
            <SectionTitle
              subtitle="Our Team"
              title="World-Class Fitness Experts"
              description="Each trainer brings unique expertise, certifications, and a passion for helping you succeed. Find the perfect match for your fitness journey."
              accentColor="cyan"
            />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {trainers.map((trainer, i) => (
              <TrainerCard key={trainer.id} trainer={trainer} index={i} />
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
              <span className="text-sm">All trainers are background-checked and certified</span>
              <FiChevronRight className="w-4 h-4 text-cyan-400" />
            </div>
          </motion.div>
        </Container>
      </section>
    </>
  );
}

export default TrainersPage;
