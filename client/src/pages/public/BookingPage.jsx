import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronRight,
  FiCheck,
  FiHome,
  FiCalendar,
  FiClock,
  FiUser,
  FiMail,
  FiPhone,
  FiHeart,
  FiTarget,
  FiArrowRight,
  FiMapPin,
  FiStar,
  FiAward,
  FiUsers,
  FiShield,
  FiZap,
} from "react-icons/fi";
import { Container, Button, SectionTitle, Skeleton } from "../../components/ui";
import { zoomFade, staggerContainer, fadeUp } from "../../lib/animations";
import { getTrainers } from "../../lib/trainersData";
import { getMembershipPlans } from "../../lib/membershipData";
import {
  getTrainingGoals,
  getGenderOptions,
  getTimeSlots,
} from "../../lib/bookingData";

const inputBase =
  "w-full px-4 py-3 rounded-xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm";

function BookingSkeleton() {
  return (
    <>
      <div className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-950/40 via-base-100 to-emerald-950/20">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-500/8 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/6 rounded-full blur-[120px]" />
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
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="rounded-2xl bg-base-200/40 border border-base-300/30 p-6 sm:p-8 space-y-5">
                <Skeleton variant="shimmer" className="h-6 w-40" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-2">
                      <Skeleton variant="shimmer" className="h-4 w-20" />
                      <Skeleton variant="shimmer" className="h-12 w-full rounded-xl" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-2xl bg-base-200/40 border border-base-300/30 p-6 sm:p-8 space-y-5">
                <Skeleton variant="shimmer" className="h-6 w-40" />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="p-4 rounded-xl bg-base-300/30 space-y-3">
                      <Skeleton variant="shimmer" className="h-16 w-16 rounded-xl" />
                      <Skeleton variant="shimmer" className="h-4 w-24" />
                      <Skeleton variant="shimmer" className="h-3 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-2xl bg-base-200/40 border border-base-300/30 p-6 space-y-4">
                <Skeleton variant="shimmer" className="h-6 w-32" />
                <Skeleton variant="shimmer" className="h-4 w-full" />
                <Skeleton variant="shimmer" className="h-4 w-3/4" />
                <Skeleton variant="shimmer" className="h-12 w-full rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function BookingHero() {
  return (
    <section className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-950/40 via-base-100 to-emerald-950/20">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-500/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/6 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-blue-400/4 rounded-full blur-[100px]" />
      </div>

      <Container className="relative z-10 py-20 sm:py-24">
        <motion.div initial="hidden" animate="visible" className="max-w-2xl">
          <motion.div variants={zoomFade} custom={0}>
            <nav className="flex items-center gap-2 text-sm text-base-content/50 mb-6">
              <Link
                to="/"
                className="hover:text-blue-400 transition-colors flex items-center gap-1"
              >
                <FiHome className="w-3.5 h-3.5" />
                Home
              </Link>
              <FiChevronRight className="w-3.5 h-3.5" />
              <span className="text-blue-400">Book a Session</span>
            </nav>
          </motion.div>

          <motion.div variants={zoomFade} custom={1}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold backdrop-blur-sm">
              <FiCalendar className="w-4 h-4" />
              Book Now
            </span>
          </motion.div>

          <motion.h1
            variants={zoomFade}
            custom={2}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-black text-base-content leading-[1.08] tracking-tight"
          >
            Book Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-emerald-300 to-blue-500">
              Fitness Session
            </span>
          </motion.h1>

          <motion.p
            variants={zoomFade}
            custom={3}
            className="mt-6 text-base-content/50 text-lg sm:text-xl leading-relaxed"
          >
            Schedule your personalized fitness session with our expert
            trainers. Choose your goals, pick your trainer, and start your
            transformation today.
          </motion.p>

          <motion.div
            variants={zoomFade}
            custom={4}
            className="mt-8 flex items-center gap-6"
          >
            <div className="flex items-center gap-2 text-sm text-base-content/50">
              <FiAward className="w-5 h-5 text-blue-400" />
              <span>Expert Trainers</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-base-content/50">
              <FiUsers className="w-5 h-5 text-emerald-400" />
              <span>5000+ Bookings</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-base-content/50">
              <FiStar className="w-5 h-5 text-blue-400 fill-blue-400" />
              <span>4.9 Rating</span>
            </div>
          </motion.div>
        </motion.div>
      </Container>
    </section>
  );
}

function TrainerSelectCard({ trainer, selected, onSelect, index }) {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <motion.div
      variants={zoomFade}
      custom={index}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(trainer)}
      className={`cursor-pointer group relative rounded-xl overflow-hidden border transition-all duration-300 ${
        selected
          ? "border-blue-500/50 bg-blue-500/10 shadow-lg shadow-blue-500/10"
          : "border-base-300/50 bg-base-200/40 hover:border-blue-500/20 hover:bg-blue-500/5"
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 z-10">
          <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
            <FiCheck className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 p-4">
        <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0">
          {!imageLoaded && (
            <Skeleton variant="shimmer" className="absolute inset-0 h-full w-full rounded-none" />
          )}
          <img
            src={trainer.image}
            alt={trainer.name}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            className={`w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
        <div className="min-w-0">
          <h4 className="text-sm font-bold text-base-content truncate">
            {trainer.name}
          </h4>
          <p className="text-xs text-blue-400 font-medium truncate">
            {trainer.specialization}
          </p>
          <div className="flex items-center gap-1.5 mt-1">
            <FiStar className="w-3 h-3 text-blue-400 fill-blue-400" />
            <span className="text-xs text-base-content/50">
              {trainer.rating}
            </span>
            <span className="text-xs text-base-content/30">
              ({trainer.reviews})
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MembershipSelectCard({ plan, selected, onSelect, index }) {
  return (
    <motion.div
      variants={zoomFade}
      custom={index}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(plan)}
      className={`cursor-pointer group relative rounded-xl overflow-hidden border transition-all duration-300 ${
        selected
          ? "border-emerald-500/50 bg-emerald-500/10 shadow-lg shadow-emerald-500/10"
          : "border-base-300/50 bg-base-200/40 hover:border-emerald-500/20 hover:bg-emerald-500/5"
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 z-10">
          <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
            <FiCheck className="w-3.5 h-3.5 text-white" />
          </div>
        </div>
      )}

      {plan.popular && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
            <FiStar className="w-2.5 h-2.5 fill-current" />
            Popular
          </span>
        </div>
      )}

      <div className="p-4">
        <h4 className="text-sm font-bold text-base-content">{plan.name}</h4>
        <div className="flex items-baseline gap-1 mt-1">
          <span className="text-xl font-black text-emerald-400">
            ${plan.monthlyPrice}
          </span>
          <span className="text-xs text-base-content/40">/mo</span>
        </div>
        <p className="text-xs text-base-content/40 mt-2 line-clamp-2">
          {plan.description}
        </p>
      </div>
    </motion.div>
  );
}

function BookingSummary({ selectedTrainer, selectedMembership, preferredDate, preferredTime }) {
  const estimatedPrice = selectedMembership ? selectedMembership.monthlyPrice : 0;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className="sticky top-24"
    >
      <div className="rounded-2xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 overflow-hidden">
        <div className="p-5 bg-gradient-to-r from-blue-600/10 to-emerald-600/10 border-b border-base-300/30">
          <h3 className="text-lg font-bold text-base-content flex items-center gap-2">
            <FiMapPin className="w-5 h-5 text-blue-400" />
            Booking Summary
          </h3>
        </div>

        <div className="p-5 space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-base-content/50">Trainer</span>
              <span className="text-sm font-medium text-base-content">
                {selectedTrainer ? selectedTrainer.name : "Not selected"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-base-content/50">Membership</span>
              <span className="text-sm font-medium text-base-content">
                {selectedMembership ? selectedMembership.name : "Not selected"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-base-content/50">Date</span>
              <span className="text-sm font-medium text-base-content">
                {preferredDate || "Not selected"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-base-content/50">Time</span>
              <span className="text-sm font-medium text-base-content">
                {preferredTime || "Not selected"}
              </span>
            </div>
          </div>

          <div className="border-t border-base-300/30 pt-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-base-content">
                Estimated Price
              </span>
              <div className="text-right">
                <span className="text-2xl font-black text-emerald-400">
                  ${estimatedPrice}
                </span>
                <span className="text-xs text-base-content/40 block">/month</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-emerald-500/10 border border-emerald-500/15">
            <FiShield className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="text-xs text-emerald-400">
              Free cancellation within 24 hours
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SuccessModal({ isOpen, onClose, bookingData }) {
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
            aria-label="Booking confirmed"
          >
            <div
              className="w-full max-w-md rounded-2xl bg-base-200/95 backdrop-blur-xl border border-base-300/50 shadow-2xl p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center mx-auto mb-6"
              >
                <FiCheck className="w-10 h-10 text-white" />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="text-2xl font-bold text-base-content mb-2">
                  Booking Confirmed!
                </h2>
                <p className="text-base-content/50 mb-6">
                  Your session has been successfully booked. We will send you a
                  confirmation email shortly.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-xl bg-base-300/30 p-4 mb-6 text-left space-y-2"
              >
                {bookingData.trainer && (
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/50">Trainer</span>
                    <span className="font-medium text-base-content">
                      {bookingData.trainer.name}
                    </span>
                  </div>
                )}
                {bookingData.membership && (
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/50">Plan</span>
                    <span className="font-medium text-base-content">
                      {bookingData.membership.name}
                    </span>
                  </div>
                )}
                {bookingData.date && (
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/50">Date</span>
                    <span className="font-medium text-base-content">
                      {bookingData.date}
                    </span>
                  </div>
                )}
                {bookingData.time && (
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/50">Time</span>
                    <span className="font-medium text-base-content">
                      {bookingData.time}
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
                <Button variant="royal" size="lg" className="w-full" onClick={onClose}>
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

function BookingForm({
  formData,
  setFormData,
  trainers,
  memberships,
  goals,
  genders,
  timeSlots,
  selectedTrainer,
  setSelectedTrainer,
  selectedMembership,
  setSelectedMembership,
  onSubmit,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const inputClass = `${inputBase}`;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      className="space-y-8"
    >
      <motion.div variants={fadeUp}>
        <div className="rounded-2xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-base-content flex items-center gap-2 mb-6">
            <FiUser className="w-5 h-5 text-blue-400" />
            Personal Information
          </h3>

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
                  className={`${inputClass} pl-10`}
                  required
                />
              </div>
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
                  className={`${inputClass} pl-10`}
                  required
                />
              </div>
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
                  className={`${inputClass} pl-10`}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/70">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={inputClass}
                required
              >
                <option value="">Select gender</option>
                {genders.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/70">
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                placeholder="25"
                min="14"
                max="100"
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/70">
                Height (cm) *
              </label>
              <input
                type="number"
                name="height"
                value={formData.height}
                onChange={handleChange}
                placeholder="175"
                min="100"
                max="250"
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/70">
                Weight (kg) *
              </label>
              <input
                type="number"
                name="weight"
                value={formData.weight}
                onChange={handleChange}
                placeholder="70"
                min="30"
                max="300"
                className={inputClass}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/70">
                Training Goal *
              </label>
              <div className="relative">
                <FiTarget className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30" />
                <select
                  name="trainingGoal"
                  value={formData.trainingGoal}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                  required
                >
                  <option value="">Select your goal</option>
                  {goals.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/70">
                Preferred Time *
              </label>
              <div className="relative">
                <FiClock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30" />
                <select
                  name="preferredTime"
                  value={formData.preferredTime}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                  required
                >
                  <option value="">Select time slot</option>
                  {timeSlots.map((t) => (
                    <option key={t.id} value={t.label}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-base-content/70">
                Preferred Date *
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-base-content/30" />
                <input
                  type="date"
                  name="preferredDate"
                  value={formData.preferredDate}
                  onChange={handleChange}
                  className={`${inputClass} pl-10`}
                  required
                />
              </div>
            </div>
          </div>

          <div className="mt-5 space-y-2">
            <label className="text-sm font-medium text-base-content/70">
              Medical Conditions (Optional)
            </label>
            <textarea
              name="medicalConditions"
              value={formData.medicalConditions}
              onChange={handleChange}
              placeholder="Any injuries, allergies, or medical conditions we should know about..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="mt-5 space-y-2">
            <label className="text-sm font-medium text-base-content/70">
              Message (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Any additional notes or requests..."
              rows={3}
              className={`${inputClass} resize-none`}
            />
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <div className="rounded-2xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-base-content flex items-center gap-2 mb-2">
            <FiUsers className="w-5 h-5 text-blue-400" />
            Select Your Trainer
          </h3>
          <p className="text-sm text-base-content/40 mb-5">
            Choose a trainer that matches your fitness goals
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {trainers.map((trainer, i) => (
              <TrainerSelectCard
                key={trainer.id}
                trainer={trainer}
                selected={selectedTrainer?.id === trainer.id}
                onSelect={setSelectedTrainer}
                index={i}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <div className="rounded-2xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-base-content flex items-center gap-2 mb-2">
            <FiZap className="w-5 h-5 text-emerald-400" />
            Choose Membership Plan
          </h3>
          <p className="text-sm text-base-content/40 mb-5">
            Select the membership that fits your lifestyle
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {memberships.map((plan, i) => (
              <MembershipSelectCard
                key={plan.id}
                plan={plan}
                selected={selectedMembership?.id === plan.id}
                onSelect={setSelectedMembership}
                index={i}
              />
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeUp}>
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            variant="royal"
            size="lg"
            className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-700 hover:to-emerald-700 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 text-white"
            onClick={onSubmit}
          >
            <FiCalendar className="w-5 h-5" />
            Book Now
            <FiArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function BookingPage() {
  const [loading, setLoading] = useState(true);
  const [trainers, setTrainers] = useState([]);
  const [memberships, setMemberships] = useState([]);
  const [goals, setGoals] = useState([]);
  const [genders, setGenders] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedMembership, setSelectedMembership] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    gender: "",
    age: "",
    height: "",
    weight: "",
    trainingGoal: "",
    preferredTime: "",
    preferredDate: "",
    medicalConditions: "",
    message: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => {
      setTrainers(getTrainers());
      setMemberships(getMembershipPlans());
      setGoals(getTrainingGoals());
      setGenders(getGenderOptions());
      setTimeSlots(getTimeSlots());
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const bookingData = useMemo(
    () => ({
      trainer: selectedTrainer,
      membership: selectedMembership,
      date: formData.preferredDate,
      time: formData.preferredTime,
    }),
    [selectedTrainer, selectedMembership, formData.preferredDate, formData.preferredTime]
  );

  const handleSubmit = () => {
    setShowSuccess(true);
  };

  if (loading) return <BookingSkeleton />;

  return (
    <>
      <BookingHero />

      <section className="py-20 sm:py-28 bg-base-100">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
          >
            <SectionTitle
              subtitle="Schedule Your Session"
              title="Complete Your Booking"
              description="Fill in your details below and select your preferred trainer and membership plan to get started."
              accentColor="blue"
            />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <BookingForm
                formData={formData}
                setFormData={setFormData}
                trainers={trainers}
                memberships={memberships}
                goals={goals}
                genders={genders}
                timeSlots={timeSlots}
                selectedTrainer={selectedTrainer}
                setSelectedTrainer={setSelectedTrainer}
                selectedMembership={selectedMembership}
                setSelectedMembership={setSelectedMembership}
                onSubmit={handleSubmit}
              />
            </div>

            <div>
              <BookingSummary
                selectedTrainer={selectedTrainer}
                selectedMembership={selectedMembership}
                preferredDate={formData.preferredDate}
                preferredTime={formData.preferredTime}
              />

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 }}
                className="mt-6 rounded-2xl bg-gradient-to-br from-blue-600/10 to-emerald-600/10 border border-blue-500/10 p-6"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
                    <FiHeart className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="text-sm font-bold text-base-content">
                    Need Help?
                  </h4>
                </div>
                <p className="text-xs text-base-content/40 leading-relaxed mb-3">
                  Our team is available 24/7 to help you choose the right plan
                  and trainer for your fitness goals.
                </p>
                <Button variant="outline" size="sm" className="w-full border-blue-500/20 text-blue-400 hover:bg-blue-500/10">
                  <FiPhone className="w-4 h-4" />
                  Contact Support
                </Button>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        bookingData={bookingData}
      />
    </>
  );
}

export default BookingPage;
