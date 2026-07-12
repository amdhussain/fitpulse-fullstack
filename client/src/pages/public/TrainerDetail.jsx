import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiArrowLeft,
  FiStar,
  FiClock,
  FiAward,
  FiCalendar,
  FiCheckCircle,
  FiInstagram,
  FiTwitter,
  FiLinkedin,
  FiBookOpen,
  FiZap,
  FiTarget,
} from "react-icons/fi";
import { Container, Button, Skeleton } from "../../components/ui";
import { slideInLeft, slideInRight } from "../../lib/animations";
import { getTrainerById } from "../../lib/trainersData";

function TrainerDetailSkeleton() {
  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Skeleton variant="shimmer" className="h-5 w-32 rounded-lg mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          <Skeleton variant="shimmer" className="h-[500px] lg:h-[600px] rounded-3xl" />
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton variant="shimmer" className="h-5 w-40 rounded-full" />
              <Skeleton variant="shimmer" className="h-10 w-64" />
              <Skeleton variant="shimmer" className="h-5 w-48" />
            </div>
            <div className="flex gap-4">
              <Skeleton variant="shimmer" className="h-10 w-28 rounded-xl" />
              <Skeleton variant="shimmer" className="h-10 w-28 rounded-xl" />
              <Skeleton variant="shimmer" className="h-10 w-28 rounded-xl" />
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

function TrainerDetail() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [trainer, setTrainer] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setTrainer(getTrainerById(id));
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [id]);

  if (loading) return <TrainerDetailSkeleton />;

  if (!trainer) {
    return (
      <div className="py-32 text-center">
        <Container>
          <h1 className="text-2xl font-bold text-base-content mb-4">Trainer Not Found</h1>
          <p className="text-base-content/50 mb-8">The trainer you are looking for does not exist.</p>
          <Link to="/trainers">
            <Button variant="cyan">
              <FiArrowLeft className="w-4 h-4" />
              Back to Trainers
            </Button>
          </Link>
        </Container>
      </div>
    );
  }

  const socialIcons = [
    { icon: FiInstagram, href: trainer.social?.instagram || "#", label: "Instagram" },
    { icon: FiTwitter, href: trainer.social?.twitter || "#", label: "Twitter" },
    { icon: FiLinkedin, href: trainer.social?.linkedin || "#", label: "LinkedIn" },
  ];

  return (
    <section className="py-20 sm:py-28 bg-base-100">
      <Container>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Link
            to="/trainers"
            className="inline-flex items-center gap-2 text-sm text-base-content/50 hover:text-cyan-400 transition-colors mb-8"
          >
            <FiArrowLeft className="w-4 h-4" />
            Back to Trainers
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            animate="visible"
            className="relative"
          >
            <div className="absolute inset-0 m-4 rounded-3xl bg-cyan-500/5 backdrop-blur-xl border border-cyan-500/10 -rotate-2" aria-hidden="true" />
            <div className="relative rounded-3xl overflow-hidden border border-cyan-500/15 shadow-2xl shadow-black/20">
              {!imageLoaded && (
                <Skeleton variant="shimmer" className="absolute inset-0 h-full w-full rounded-none" />
              )}
              <img
                src={trainer.image}
                alt={`${trainer.name} - ${trainer.specialization}`}
                onLoad={() => setImageLoaded(true)}
                className={`w-full h-[400px] sm:h-[500px] lg:h-[600px] object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"}`}
                width="600"
                height="750"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-base-100/70 via-transparent to-transparent" />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-cyan-950/60 backdrop-blur-lg border border-cyan-500/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-500/20 flex items-center justify-center" aria-hidden="true">
                    <FiCalendar className="w-5 h-5 text-teal-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-base-content">Available Days</p>
                    <p className="text-xs text-cyan-300/50">{(trainer.availableDays || []).join(" · ")}</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            <div>
              <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-xs font-semibold backdrop-blur-sm mb-3">
                <FiAward className="w-3.5 h-3.5" />
                {trainer.specialization}
              </span>
              <h1 className="text-3xl sm:text-4xl font-bold text-base-content">{trainer.name}</h1>
              <p className="text-lg text-cyan-400 font-medium mt-1">{trainer.designation}</p>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20">
                <FiStar className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                <span className="text-sm font-bold text-base-content">{trainer.rating}</span>
                <span className="text-xs text-base-content/40">({trainer.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20">
                <FiClock className="w-4 h-4 text-teal-400" />
                <span className="text-sm font-medium text-base-content/70">{trainer.experience || "N/A"}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-base-300/50">
                <FiZap className="w-4 h-4 text-base-content/50" />
                <span className="text-sm font-medium text-base-content/70">{trainer.hours || "N/A"}</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wider mb-2">Biography</h3>
              <p className="text-base-content/60 leading-relaxed">{trainer.bio}</p>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wider mb-3">Skills & Expertise</h3>
              <div className="flex flex-wrap gap-2">
                {(trainer.skills || []).map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/15 text-cyan-400 text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-base-200/40 border border-base-300/30">
                <div className="flex items-center gap-2 mb-2">
                  <FiBookOpen className="w-4 h-4 text-cyan-400" />
                  <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">Programs</span>
                </div>
                <ul className="space-y-1.5">
                  {(trainer.programs || []).map((program) => (
                    <li key={program} className="flex items-center gap-2 text-sm text-base-content/70">
                      <FiCheckCircle className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                      {program}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-base-200/40 border border-base-300/30">
                <div className="flex items-center gap-2 mb-2">
                  <FiAward className="w-4 h-4 text-teal-400" />
                  <span className="text-xs font-semibold text-base-content/50 uppercase tracking-wider">Certifications</span>
                </div>
                <ul className="space-y-1.5">
                  {(Array.isArray(trainer.certificates)
                    ? trainer.certificates
                    : trainer.certificates.split(",").map((s) => s.trim())
                  ).map((cert, i) => (
                    <li key={i} className="text-sm text-base-content/70">
                      <span className="font-medium">{typeof cert === "string" ? cert : cert.name}</span>
                      {typeof cert === "object" && cert.year && (
                        <span className="text-base-content/40 ml-1">({cert.year})</span>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-base-content/70 uppercase tracking-wider mb-3">Achievements</h3>
              <ul className="space-y-2">
                {(trainer.achievements || []).map((achievement, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-base-content/60">
                    <FiTarget className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button variant="cyan" size="lg" className="group">
                Book Session
                <FiArrowLeft className="w-4 h-4 rotate-180 transition-transform duration-300 group-hover:translate-x-1" />
              </Button>
              <div className="flex items-center gap-2">
                {socialIcons.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={`${trainer.name} ${social.label}`}
                    className="w-10 h-10 rounded-xl bg-base-300/50 flex items-center justify-center text-base-content/40 hover:bg-cyan-500 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default TrainerDetail;
