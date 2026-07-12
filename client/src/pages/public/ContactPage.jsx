import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronRight,
  FiCheck,
  FiHome,
  FiPhone,
  FiMail,
  FiMapPin,
  FiClock,
  FiAlertTriangle,
  FiSend,
  FiUser,
  FiMessageSquare,
  FiArrowRight,
  FiShield,
  FiHeart,
  FiStar,
  FiAward,
  FiUsers,
  FiZap,
  FiHeadphones,
  FiTool,
  FiMessageCircle,
} from "react-icons/fi";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaYoutube,
  FaWhatsapp,
} from "react-icons/fa";
import { Container, Button, SectionTitle, Skeleton } from "../../components/ui";
import { zoomFade, staggerContainer, fadeUp } from "../../lib/animations";
import {
  getContactInfo,
  getSocialLinks,
  getWhyContactData,
  getCtaData,
  getMapEmbedUrl,
} from "../../lib/contactData";

const inputBase =
  "w-full px-4 py-3 rounded-xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all duration-300 text-sm";

const contactIconMap = {
  phone: FiPhone,
  email: FiMail,
  location: FiMapPin,
  clock: FiClock,
  emergency: FiAlertTriangle,
};

const contactAccentMap = {
  red: {
    bg: "bg-red-500/10",
    border: "border-red-500/15",
    text: "text-red-400",
    hover: "hover:border-red-500/30 hover:shadow-red-500/5",
    iconBg: "bg-red-500/15",
  },
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/15",
    text: "text-blue-400",
    hover: "hover:border-blue-500/30 hover:shadow-blue-500/5",
    iconBg: "bg-blue-500/15",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/15",
    text: "text-emerald-400",
    hover: "hover:border-emerald-500/30 hover:shadow-emerald-500/5",
    iconBg: "bg-emerald-500/15",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/15",
    text: "text-amber-400",
    hover: "hover:border-amber-500/30 hover:shadow-amber-500/5",
    iconBg: "bg-amber-500/15",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/15",
    text: "text-rose-400",
    hover: "hover:border-rose-500/30 hover:shadow-rose-500/5",
    iconBg: "bg-rose-500/15",
  },
};

const whyIconMap = {
  trainers: FiAward,
  response: FiZap,
  support: FiHeadphones,
  guidance: FiTool,
};

const socialIconMap = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  youtube: FaYoutube,
  whatsapp: FaWhatsapp,
};

const socialColorMap = {
  blue: "hover:bg-blue-500 hover:border-blue-500 hover:shadow-blue-500/30",
  pink: "hover:bg-pink-500 hover:border-pink-500 hover:shadow-pink-500/30",
  red: "hover:bg-red-500 hover:border-red-500 hover:shadow-red-500/30",
  green: "hover:bg-green-500 hover:border-green-500 hover:shadow-green-500/30",
};

function ContactSkeleton() {
  return (
    <>
      <div className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-red-950/40 via-base-100 to-slate-950/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-red-500/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-500/6 rounded-full blur-[120px]" />
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
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 space-y-20">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="p-6 rounded-2xl bg-base-200/40 border border-base-300/30 space-y-4">
                <Skeleton variant="shimmer" className="w-14 h-14 rounded-2xl" />
                <Skeleton variant="shimmer" className="h-5 w-32" />
                <Skeleton variant="shimmer" className="h-4 w-48" />
                <Skeleton variant="shimmer" className="h-3 w-36" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="rounded-2xl bg-base-200/40 border border-base-300/30 p-6 sm:p-8 space-y-5">
              <Skeleton variant="shimmer" className="h-6 w-40" />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton variant="shimmer" className="h-4 w-20" />
                    <Skeleton variant="shimmer" className="h-12 w-full rounded-xl" />
                  </div>
                ))}
              </div>
              <div className="space-y-2">
                <Skeleton variant="shimmer" className="h-4 w-20" />
                <Skeleton variant="shimmer" className="h-24 w-full rounded-xl" />
              </div>
              <Skeleton variant="shimmer" className="h-12 w-full rounded-xl" />
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl bg-base-200/40 border border-base-300/30 p-6 space-y-4">
                <Skeleton variant="shimmer" className="h-6 w-32" />
                <Skeleton variant="shimmer" className="h-64 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ContactHero() {
  return (
    <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-red-950/40 via-base-100 to-slate-950/20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-red-500/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-500/6 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-red-400/4 rounded-full blur-[100px]" />
      </div>

      <Container className="relative z-10 py-20 sm:py-24">
        <motion.div initial="hidden" animate="visible" className="max-w-2xl">
          <motion.div variants={zoomFade} custom={0}>
            <nav className="flex items-center gap-2 text-sm text-base-content/50 mb-6">
              <Link
                to="/"
                className="hover:text-red-400 transition-colors flex items-center gap-1"
              >
                <FiHome className="w-3.5 h-3.5" />
                Home
              </Link>
              <FiChevronRight className="w-3.5 h-3.5" />
              <span className="text-red-400">Contact Us</span>
            </nav>
          </motion.div>

          <motion.div variants={zoomFade} custom={1}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold backdrop-blur-sm">
              <FiMail className="w-4 h-4" />
              Contact Us
            </span>
          </motion.div>

          <motion.h1
            variants={zoomFade}
            custom={2}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-base-content leading-[1.08] tracking-tight"
          >
            Get In
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 via-rose-300 to-red-500">
              Touch With Us
            </span>
          </motion.h1>

          <motion.p
            variants={zoomFade}
            custom={3}
            className="mt-6 text-base-content/50 text-lg sm:text-xl leading-relaxed"
          >
            Have questions about our programs, membership, or facilities?
            We are here to help. Reach out to us anytime and we will get
            back to you as soon as possible.
          </motion.p>

          <motion.div
            variants={zoomFade}
            custom={4}
            className="mt-8 flex items-center gap-6"
          >
            <div className="flex items-center gap-2 text-sm text-base-content/50">
              <FiAward className="w-5 h-5 text-red-400" />
              <span>Expert Support</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-base-content/50">
              <FiUsers className="w-5 h-5 text-rose-400" />
              <span>5000+ Happy Members</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-base-content/50">
              <FiStar className="w-5 h-5 text-red-400 fill-red-400" />
              <span>4.9 Rating</span>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function ContactInfoCard({ info, index }) {
  const Icon = contactIconMap[info.icon] || FiPhone;
  const colors = contactAccentMap[info.accentColor] || contactAccentMap.red;

  const Wrapper = info.href ? "a" : "div";
  const wrapperProps = info.href
    ? { href: info.href, target: info.href.startsWith("http") ? "_blank" : undefined, rel: info.href.startsWith("http") ? "noopener noreferrer" : undefined }
    : {};

  return (
    <motion.div variants={zoomFade} custom={index}>
      <Wrapper
        {...wrapperProps}
        className={`block group rounded-2xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${colors.hover} ${info.href ? "cursor-pointer" : ""}`}
      >
        <div className={`w-14 h-14 rounded-2xl ${colors.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${colors.text}`} />
        </div>
        <h3 className="text-base font-bold text-base-content mb-1">
          {info.title}
        </h3>
        <p className={`text-sm font-semibold ${colors.text} mb-1`}>
          {info.value}
        </p>
        <p className="text-xs text-base-content/40">{info.description}</p>
      </Wrapper>
    </motion.div>
  );
}

function ContactForm({ formData, setFormData, onSubmit }) {
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = "Please enter a valid email";
    if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    if (!formData.subject.trim()) newErrors.subject = "Subject is required";
    if (!formData.message.trim()) newErrors.message = "Message is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div className="space-y-2">
          <label className="text-sm font-medium text-base-content/70">
            Full Name *
          </label>
          <div className="relative">
            <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30" />
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className={`${inputBase} pl-10 ${errors.fullName ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20" : ""}`}
            />
          </div>
          {errors.fullName && (
            <p className="text-xs text-red-400 mt-1">{errors.fullName}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-base-content/70">
            Email Address *
          </label>
          <div className="relative">
            <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={`${inputBase} pl-10 ${errors.email ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20" : ""}`}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-400 mt-1">{errors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-base-content/70">
            Phone Number *
          </label>
          <div className="relative">
            <FiPhone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30" />
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+1 (555) 000-0000"
              className={`${inputBase} pl-10 ${errors.phone ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20" : ""}`}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-red-400 mt-1">{errors.phone}</p>
          )}
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-base-content/70">
            Subject *
          </label>
          <div className="relative">
            <FiMessageSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30" />
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="How can we help?"
              className={`${inputBase} pl-10 ${errors.subject ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20" : ""}`}
            />
          </div>
          {errors.subject && (
            <p className="text-xs text-red-400 mt-1">{errors.subject}</p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-base-content/70">
          Message *
        </label>
        <div className="relative">
          <FiMessageCircle className="absolute left-3.5 top-3.5 w-4 h-4 text-base-content/30" />
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us more about your inquiry..."
            rows={5}
            className={`${inputBase} pl-10 resize-none ${errors.message ? "border-red-500/50 focus:border-red-500/50 focus:ring-red-500/20" : ""}`}
          />
        </div>
        {errors.message && (
          <p className="text-xs text-red-400 mt-1">{errors.message}</p>
        )}
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Button
          type="submit"
          variant="red"
          size="lg"
          className="w-full bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 text-white"
        >
          <FiSend className="w-5 h-5" />
          Send Message
          <FiArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>
      </motion.div>
    </form>
  );
}

function GoogleMap({ mapUrl }) {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="rounded-2xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-red-600/10 to-slate-600/10 border-b border-base-300/30">
          <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
            <FiMapPin className="w-5 h-5 text-red-400" />
            Find Us On Map
          </h3>
        </div>
        <div className="relative aspect-video w-full">
          <iframe
            src={mapUrl}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Google Map - Our Location"
            className="absolute inset-0 w-full h-full"
          />
        </div>
      </div>
    </motion.div>
  );
}

function WhyContactCard({ item, index }) {
  const Icon = whyIconMap[item.icon] || FiStar;

  return (
    <motion.div variants={zoomFade} custom={index}>
      <div className="group rounded-2xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 p-6 sm:p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-red-500/20 hover:shadow-red-500/5 h-full">
        <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/15 flex items-center justify-center mb-5 group-hover:bg-red-500/20 group-hover:scale-110 transition-all duration-300">
          <Icon className="w-6 h-6 text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-base-content mb-2">
          {item.title}
        </h3>
        <p className="text-sm text-base-content/50 leading-relaxed">
          {item.description}
        </p>
      </div>
    </motion.div>
  );
}

function SocialLinks({ links }) {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="flex flex-wrap justify-center gap-4"
    >
      {links.map((link, i) => {
        const Icon = socialIconMap[link.icon] || FiStar;
        const hoverColor = socialColorMap[link.color] || socialColorMap.blue;

        return (
          <motion.a
            key={link.id}
            variants={zoomFade}
            custom={i}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.platform}
            whileHover={{ scale: 1.1, y: -4 }}
            whileTap={{ scale: 0.95 }}
            className={`w-14 h-14 rounded-2xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 flex items-center justify-center text-base-content/40 transition-all duration-300 shadow-lg hover:text-white ${hoverColor}`}
          >
            <Icon className="w-5 h-5" />
          </motion.a>
        );
      })}
    </motion.div>
  );
}

function CTASection({ data }) {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-red-950/60 via-base-100 to-slate-950/40" aria-hidden="true" />
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-rose-500/8 rounded-full blur-[120px]" />
      </div>

      <Container className="relative z-10">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-semibold backdrop-blur-sm mb-6">
            <FiHeart className="w-4 h-4" />
            100% Satisfaction Guaranteed
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-base-content leading-tight tracking-tight mb-6">
            {data.heading}
          </h2>

          <p className="text-lg text-base-content/50 leading-relaxed mb-10 max-w-xl mx-auto">
            {data.description}
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to={data.primaryButton.href}>
                <Button variant="red" size="lg" className="group bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/25 text-white">
                  {data.primaryButton.label}
                  <FiArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a href={data.secondaryButton.href}>
                <Button variant="outline" size="lg" className="border-red-500/30 text-red-400 hover:bg-red-500/10">
                  {data.secondaryButton.label}
                </Button>
              </a>
            </motion.div>
          </div>

          <div className="mt-10 flex items-center justify-center gap-8 text-sm text-base-content/40">
            <div className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-red-400" />
              <span>No contracts</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-red-400" />
              <span>Free consultation</span>
            </div>
            <div className="flex items-center gap-2">
              <FiCheck className="w-4 h-4 text-red-400" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}

function SuccessModal({ isOpen, onClose, formData }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
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
            aria-label="Message sent"
          >
            <div
              className="w-full max-w-md rounded-2xl bg-base-200/95 backdrop-blur-xl border border-base-300/50 shadow-2xl p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-rose-500 flex items-center justify-center mx-auto mb-6"
              >
                <FiCheck className="w-10 h-10 text-white" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-base-content mb-2">
                  Message Sent!
                </h2>
                <p className="text-base-content/50 mb-6">
                  Thank you for reaching out. We will get back to you within
                  24 hours.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-xl bg-base-300/30 p-4 mb-6 text-left space-y-2"
              >
                {formData.fullName && (
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/50">Name</span>
                    <span className="font-medium text-base-content">
                      {formData.fullName}
                    </span>
                  </div>
                )}
                {formData.email && (
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/50">Email</span>
                    <span className="font-medium text-base-content">
                      {formData.email}
                    </span>
                  </div>
                )}
                {formData.subject && (
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/50">Subject</span>
                    <span className="font-medium text-base-content">
                      {formData.subject}
                    </span>
                  </div>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-3"
              >
                <Button variant="red" size="lg" className="w-full bg-gradient-to-r from-red-600 to-rose-600 text-white" onClick={onClose}>
                  Done
                </Button>
                <Link to="/" className="w-full">
                  <Button variant="ghost" size="md" className="w-full">
                    Back to Home
                  </Button>
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function ContactPage() {
  const [loading, setLoading] = useState(true);
  const [contactInfo, setContactInfo] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [whyContact, setWhyContact] = useState([]);
  const [cta, setCta] = useState(null);
  const [mapUrl, setMapUrl] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setContactInfo(getContactInfo());
      setSocialLinks(getSocialLinks());
      setWhyContact(getWhyContactData());
      setCta(getCtaData());
      setMapUrl(getMapEmbedUrl());
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = () => {
    setShowSuccess(true);
  };

  if (loading) return <ContactSkeleton />;

  return (
    <>
      <ContactHero />

      <section className="py-20 sm:py-28 bg-base-100">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <SectionTitle
              subtitle="Get In Touch"
              title="Contact Information"
              description="Reach out to us through any of the following channels. We are always happy to help."
              accentColor="primary"
            />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {contactInfo.map((info, i) => (
              <ContactInfoCard key={info.id} info={info} index={i} />
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
          >
            <SectionTitle
              subtitle="Send a Message"
              title="Contact Form"
              description="Fill out the form below and we will get back to you as soon as possible."
              accentColor="primary"
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
            >
              <div className="rounded-2xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 p-6 sm:p-8">
                <h3 className="text-lg font-bold text-base-content flex items-center gap-2 mb-6">
                  <FiSend className="w-5 h-5 text-red-400" />
                  Send Us a Message
                </h3>
                <ContactForm
                  formData={formData}
                  setFormData={setFormData}
                  onSubmit={handleSubmit}
                />
              </div>
            </motion.div>

            <div className="space-y-6">
              <GoogleMap mapUrl={mapUrl} />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="rounded-2xl bg-gradient-to-br from-red-600/10 to-slate-600/10 border border-red-500/10 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
                    <FiShield className="w-5 h-5 text-red-400" />
                  </div>
                  <h4 className="text-sm font-bold text-base-content">
                    Your Privacy Matters
                  </h4>
                </div>
                <p className="text-xs text-base-content/40 leading-relaxed">
                  We respect your privacy. Your information will never be
                  shared with third parties and will only be used to
                  respond to your inquiry.
                </p>
              </motion.div>
            </div>
          </div>
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
              subtitle="Why Reach Out"
              title="Why Contact Us"
              description="We are committed to providing the best support for your fitness journey."
              accentColor="primary"
            />
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {whyContact.map((item, i) => (
              <WhyContactCard key={item.id} item={item} index={i} />
            ))}
          </motion.div>
        </Container>
      </section>

      <section className="py-16 bg-base-200/30">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
          >
            <SectionTitle
              subtitle="Follow Us"
              title="Stay Connected"
              description="Follow us on social media for the latest updates, tips, and community events."
              accentColor="primary"
            />
          </motion.div>

          <SocialLinks links={socialLinks} />
        </Container>
      </section>

      {cta && <CTASection data={cta} />}

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        formData={formData}
      />
    </>
  );
}

export default ContactPage;
