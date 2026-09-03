import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiChevronRight,
  FiCheck,
  FiHome,
  FiCalendar,
  FiUser,
  FiArrowRight,
  FiMapPin,
  FiUsers,
  FiShield,
  FiZap,
  FiCreditCard,
  FiLoader,
  FiAlertCircle,
} from "react-icons/fi";
import { Container, Button, SectionTitle, Skeleton } from "../../components/ui";
import { zoomFade, fadeUp } from "../../lib/animations";
import { getTrainers } from "../../lib/trainersData";
import { getGenderOptions } from "../../lib/bookingData";
import { useAuth } from "../../context/AuthContext";
import { API_URL } from "../../lib/api";
import OtpVerificationModal from "../../components/OtpVerificationModal";

const FALLBACK_CLASSES = [
  { _id: "000000000000000000000001", id: "000000000000000000000001", name: "Yoga Flow", description: "A gentle yoga session for all levels", category: "Yoga", difficulty: "BEGINNER", price: 25, duration: 60, capacity: 20 },
  { _id: "000000000000000000000002", id: "000000000000000000000002", name: "HIIT Burn", description: "High-intensity interval training to burn calories", category: "HIIT", difficulty: "INTERMEDIATE", price: 35, duration: 45, capacity: 15 },
  { _id: "000000000000000000000003", id: "000000000000000000000003", name: "Strength Training", description: "Build muscle with guided weight training", category: "Strength", difficulty: "ADVANCED", price: 40, duration: 60, capacity: 12 },
  { _id: "000000000000000000000004", id: "000000000000000000000004", name: "Cardio Dance", description: "Fun dance-based cardio workout", category: "Dance", difficulty: "BEGINNER", price: 20, duration: 50, capacity: 25 },
];

const inputBase =
  "w-full px-4 py-3 rounded-xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 text-base-content placeholder:text-base-content/30 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 text-sm";

function formatPrice(amount) {
  const num = typeof amount === "string" ? parseFloat(amount.replace(/[^0-9.-]/g, "")) : amount;
  if (isNaN(num) || num === null || num === undefined) return "$0";
  return `$${num.toLocaleString("en-US")}`;
}

function parsePrice(value) {
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = parseFloat(value.replace(/[^0-9.-]/g, ""));
    return isNaN(parsed) ? 0 : parsed;
  }
  return 0;
}

function getAuthToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAuthToken()}`,
  };
}

function BookingSkeleton() {
  return (
    <div className="py-20 sm:py-28">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="space-y-6">
          <Skeleton variant="shimmer" className="h-10 w-1/2" />
          <Skeleton variant="shimmer" className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  );
}

function BookingHero() {
  return (
    <section className="relative min-h-[40vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-950/40 via-base-100 to-emerald-950/20">
      <Container className="relative z-10 py-16">
        <motion.div initial="hidden" animate="visible" className="max-w-2xl">
          <nav className="flex items-center gap-2 text-sm text-base-content/50 mb-4">
            <Link
              to="/"
              className="hover:text-blue-400 transition-colors flex items-center gap-1"
            >
              <FiHome className="w-3.5 h-3.5" /> Home
            </Link>
            <FiChevronRight className="w-3.5 h-3.5" />
            <span className="text-blue-400">Book a Session</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-black text-base-content tracking-tight">
            Book Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">
              Fitness Session
            </span>
          </h1>
        </motion.div>
      </Container>
    </section>
  );
}

function TrainerSelectCard({ trainer, selected, onSelect, index }) {
  return (
    <motion.div
      variants={zoomFade}
      custom={index}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(trainer)}
      className={`cursor-pointer group relative rounded-xl overflow-hidden border p-4 transition-all duration-300 ${
        selected
          ? "border-blue-500 bg-blue-500/10 shadow-lg"
          : "border-base-300 bg-base-200/40 hover:border-blue-500/30"
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
          <FiCheck className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div className="flex items-center gap-4">
        <img
          src={trainer.image}
          alt={trainer.name}
          className="w-14 h-14 rounded-xl object-cover"
        />
        <div>
          <h4 className="text-sm font-bold text-base-content">{trainer.name}</h4>
          <p className="text-xs text-blue-400 font-medium">
            {trainer.specialization}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

function ClassSelectCard({ cls, selected, onSelect, index }) {
  const price = parsePrice(cls.price);
  return (
    <motion.div
      variants={zoomFade}
      custom={index}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(cls)}
      className={`cursor-pointer group relative rounded-xl overflow-hidden border p-4 transition-all duration-300 ${
        selected
          ? "border-emerald-500 bg-emerald-500/10 shadow-lg"
          : "border-base-300 bg-base-200/40 hover:border-emerald-500/30"
      }`}
    >
      {selected && (
        <div className="absolute top-3 right-3 z-10 w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
          <FiCheck className="w-3.5 h-3.5 text-white" />
        </div>
      )}
      <div>
        <h4 className="text-sm font-bold text-base-content">{cls.name}</h4>
        <p className="text-xs text-emerald-400 font-medium mt-1">
          {formatPrice(price)}
        </p>
        <p className="text-xs text-base-content/40 mt-1">
          {cls.category || "General"} • {cls.difficulty || "All Levels"}
        </p>
      </div>
    </motion.div>
  );
}

function PaymentOptionSelector({ selectedOption, setSelectedOption, price }) {
  const numericPrice = parsePrice(price);
  const halfPrice = Math.round(numericPrice / 2);

  return (
    <div className="rounded-2xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 p-6 sm:p-8">
      <h3 className="text-lg font-bold text-base-content flex items-center gap-2 mb-2">
        <FiCreditCard className="w-5 h-5 text-emerald-400" />
        Payment Option *
      </h3>
      <p className="text-sm text-base-content/40 mb-5">
        Choose how you want to pay for your session
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div
          onClick={() => setSelectedOption("FULL")}
          className={`cursor-pointer p-5 rounded-xl border transition-all ${
            selectedOption === "FULL"
              ? "border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/20"
              : "border-base-300 bg-base-200/40 hover:border-emerald-500/30"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-sm text-base-content">
              Full Payment
            </span>
            {selectedOption === "FULL" && (
              <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                <FiCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {formatPrice(numericPrice)}
          </div>
          <p className="text-xs text-base-content/40 mt-1">
            Pay full amount upfront
          </p>
        </div>

        <div
          onClick={() => setSelectedOption("HALF")}
          className={`cursor-pointer p-5 rounded-xl border transition-all ${
            selectedOption === "HALF"
              ? "border-blue-500 bg-blue-500/10 ring-2 ring-blue-500/20"
              : "border-base-300 bg-base-200/40 hover:border-blue-500/30"
          }`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-sm text-base-content">
              Half Payment
            </span>
            {selectedOption === "HALF" && (
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
                <FiCheck className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
          <div className="text-2xl font-black text-blue-400">
            {formatPrice(halfPrice)}
          </div>
          <p className="text-xs text-base-content/40 mt-1">
            Pay 50% advance now, 50% later
          </p>
        </div>
      </div>
    </div>
  );
}

function BookingSummary({
  selectedTrainer,
  selectedClass,
  paymentOption,
  price,
  preferredDate,
  preferredTime,
}) {
  const numericPrice = parsePrice(price);
  const dueNow = paymentOption === "HALF" ? Math.round(numericPrice / 2) : numericPrice;
  const remaining = paymentOption === "HALF" ? Math.round(numericPrice / 2) : 0;

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
              <span className="text-sm text-base-content/50">Class</span>
              <span className="text-sm font-medium text-base-content">
                {selectedClass ? selectedClass.name : "Not selected"}
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

          <div className="border-t border-base-300/30 pt-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-base-content/50">Total Price</span>
              <span className="text-sm font-medium text-base-content">
                {formatPrice(numericPrice)}
              </span>
            </div>
            {paymentOption && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-base-content">
                    Due Now
                  </span>
                  <span className="text-lg font-black text-emerald-400">
                    {formatPrice(dueNow)}
                  </span>
                </div>
                {remaining > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-base-content/40">
                      Remaining (pay later)
                    </span>
                    <span className="text-xs text-base-content/40">
                      {formatPrice(remaining)}
                    </span>
                  </div>
                )}
              </>
            )}
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
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
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
                  Your session has been successfully booked. You will receive a
                  confirmation email shortly.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="rounded-xl bg-base-300/30 p-4 mb-6 text-left space-y-2"
              >
                {bookingData.service && (
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/50">Service</span>
                    <span className="font-medium text-base-content">
                      {bookingData.service}
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
                {bookingData.amount && (
                  <div className="flex justify-between text-sm">
                    <span className="text-base-content/50">Amount Paid</span>
                    <span className="font-medium text-emerald-400">
                      {formatPrice(bookingData.amount)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-base-content/50">Status</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Pending Approval
                  </span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col gap-3"
              >
                <Link to="/dashboard/my-bookings" className="w-full">
                  <Button variant="royal" size="lg" className="w-full">
                    View My Bookings
                  </Button>
                </Link>
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
  classes,
  genders,
  selectedTrainer,
  setSelectedTrainer,
  selectedClass,
  setSelectedClass,
  paymentOption,
  setPaymentOption,
  bookingPrice,
  onSubmit,
  submitting,
}) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="space-y-8">
      <div className="rounded-2xl bg-base-200/60 border border-base-300/50 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-base-content flex items-center gap-2 mb-6">
          <FiUser className="w-5 h-5 text-blue-400" /> Personal Information
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="space-y-2">
            <label className="text-sm font-medium text-base-content/70">
              Preferred Time *
            </label>
            <input
              type="time"
              name="preferredTime"
              value={formData.preferredTime}
              onChange={handleChange}
              className={inputBase}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-base-content/70">
              Preferred Date *
            </label>
            <input
              type="date"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              className={inputBase}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-base-content/70">
              Email Address *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              className={inputBase}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-base-content/70">
              Phone Number *
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+8801XXXXXXXXX"
              className={inputBase}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-base-content/70">
              Gender *
            </label>
            <div className="select-wrapper">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`${inputBase} !pr-10`}
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
              className={inputBase}
              required
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl bg-base-200/60 border border-base-300/50 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-base-content flex items-center gap-2 mb-4">
          <FiUsers className="w-5 h-5 text-blue-400" /> Select Your Trainer *
        </h3>
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

      <div className="rounded-2xl bg-base-200/60 border border-base-300/50 p-6 sm:p-8">
        <h3 className="text-lg font-bold text-base-content flex items-center gap-2 mb-4">
          <FiZap className="w-5 h-5 text-emerald-400" /> Choose a Class *
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {classes.map((cls, i) => (
            <ClassSelectCard
              key={cls._id || cls.id}
              cls={cls}
              selected={selectedClass?._id === cls._id || selectedClass?.id === cls.id}
              onSelect={setSelectedClass}
              index={i}
            />
          ))}
        </div>
      </div>

      <PaymentOptionSelector
        selectedOption={paymentOption}
        setSelectedOption={setPaymentOption}
        price={bookingPrice}
      />

      <Button
        variant="royal"
        size="lg"
        className="w-full bg-gradient-to-r from-blue-600 to-emerald-600 text-white py-4 text-base font-bold shadow-lg"
        onClick={onSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <>
            <FiLoader className="w-5 h-5 animate-spin" /> Processing...
          </>
        ) : (
          <>
            <FiCalendar className="w-5 h-5" /> Pay & Confirm Booking{" "}
            <FiArrowRight className="w-5 h-5" />
          </>
        )}
      </Button>
    </div>
  );
}

// export default function BookingPage() {
//   const { user } = useAuth();
//   const navigate = useNavigate();
//   const [loading, setLoading] = useState(true);
//   const [trainers, setTrainers] = useState([]);
//   const [classes, setClasses] = useState([]);
//   const [genders, setGenders] = useState([]);
//   const [timeSlots, setTimeSlots] = useState([]);
//   const [selectedTrainer, setSelectedTrainer] = useState(null);
//   const [selectedClass, setSelectedClass] = useState(null);
//   const [paymentOption, setPaymentOption] = useState("FULL");
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [showOtpModal, setShowOtpModal] = useState(false);
//   const [otpHint, setOtpHint] = useState("");
//   const [otpExpiresIn, setOtpExpiresIn] = useState(10);
//   const [bookingId, setBookingId] = useState(null);
//   const [bookingData, setBookingData] = useState({});
//   const [submitting, setSubmitting] = useState(false);
//   const [error, setError] = useState("");
 
  

//   const [formData, setFormData] = useState({
//     email: "",
//     phone: "",
//     gender: "",
//     age: "",
//     preferredTime: "",
//     preferredDate: "",
//   });


export default function BookingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [trainers, setTrainers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [genders, setGenders] = useState([]);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [selectedClass, setSelectedClass] = useState(null);
  const [paymentOption, setPaymentOption] = useState("FULL");
  const [showSuccess, setShowSuccess] = useState(false); // এটি একবারে থাকবে
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpHint, setOtpHint] = useState("");
  const [otpExpiresIn, setOtpExpiresIn] = useState(10);
  const [bookingId, setBookingId] = useState(null);
  const [bookingData, setBookingData] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    phone: "",
    gender: "",
    age: "",
    preferredTime: "",
    preferredDate: "",
  });

  // বাকী কোড যেমন আছে তেমনই থাকবে...

  useEffect(() => {
    window.scrollTo(0, 0);
    setTrainers(getTrainers());
    setGenders(getGenderOptions());

    const fetchClasses = async () => {
      try {
        const res = await fetch(`${API_URL}/api/v1/class/public?limit=100`);
        const data = await res.json();
        if (data.success && data.data && data.data.length > 0) {
          setClasses(data.data);
        } else {
          setClasses(FALLBACK_CLASSES);
        }
      } catch {
        setClasses(FALLBACK_CLASSES);
      }
    };
    fetchClasses();

    setLoading(false);
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const bookingPrice = useMemo(() => {
    if (!selectedClass) return 0;
    return parsePrice(selectedClass.price) || 0;
  }, [selectedClass]);

  const handleSubmit = async () => {
    setError("");

    if (!selectedTrainer) {
      setError("Please select a trainer.");
      return;
    }
    if (!selectedClass) {
      setError("Please select a class.");
      return;
    }
    if (!formData.preferredTime) {
      setError("Please select a preferred time.");
      return;
    }
    if (!formData.preferredDate) {
      setError("Please select a preferred date.");
      return;
    }

    setSubmitting(true);

    try {
      const classId = selectedClass._id || selectedClass.id;
      const bookingPayload = {
        classId: classId,
        bookingDate: formData.preferredDate,
        bookingTime: formData.preferredTime,
        notes: `Trainer: ${selectedTrainer.name}`,
        paymentOption: paymentOption,
      };

      console.log("Booking payload:", bookingPayload);

      const bookingRes = await fetch(`${API_URL}/api/v1/booking/me/book`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(bookingPayload),
      });

      if (!bookingRes.ok) {
        const errData = await bookingRes.json();
        console.error("Booking error:", errData);
        const errorMessage = errData.message || "Failed to create booking";
        if (errorMessage.includes("schedule") || errorMessage.includes("Invalid schedule")) {
          setError(`Booking error: ${errorMessage}. Please select a time that matches the class schedule.`);
        } else {
          setError(`Booking error: ${errorMessage}`);
        }
        throw new Error(errorMessage);
      }

      const bookingResult = await bookingRes.json();
      const newBookingId = bookingResult.data?.id || bookingResult.data?._id;

      if (!newBookingId) {
        throw new Error("Booking created but ID not found");
      }

      setBookingId(newBookingId);

      const mockPayRes = await fetch(
        `${API_URL}/api/v1/booking/me/${newBookingId}/mock-payment`,
        {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ paymentOption }),
        }
      );

      if (!mockPayRes.ok) {
        const errData = await mockPayRes.json();
        throw new Error(errData.message || "Mock payment failed");
      }

      const mockPayResult = await mockPayRes.json();
      const hint = mockPayResult.data?.otpHint;
      const expiresIn = mockPayResult.data?.otpExpiresInMinutes || 10;

      setOtpHint(hint || "");
      setOtpExpiresIn(expiresIn);

      setBookingData({
        service: selectedClass.name,
        date: formData.preferredDate,
        time: formData.preferredTime,
        amount: paymentOption === "HALF" ? Math.round(bookingPrice / 2) : bookingPrice,
      });

      setShowOtpModal(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleOtpVerified = () => {
    setShowOtpModal(false);
    setShowSuccess(true);
  };

  if (loading) return <BookingSkeleton />;

  return (
    <>
      <BookingHero />
      <section className="py-16 bg-base-100">
        <Container>
          <SectionTitle
            subtitle="Schedule Your Session"
            title="Complete Your Booking"
            accentColor="blue"
          />
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2">
              {error && (
                <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                  <FiAlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                  <p className="text-sm text-red-400">{error}</p>
                </div>
              )}

              <BookingForm
                formData={formData}
                setFormData={setFormData}
                trainers={trainers}
                classes={classes}
                genders={genders}
                selectedTrainer={selectedTrainer}
                setSelectedTrainer={setSelectedTrainer}
                selectedClass={selectedClass}
                setSelectedClass={setSelectedClass}
                paymentOption={paymentOption}
                setPaymentOption={setPaymentOption}
                bookingPrice={bookingPrice}
                onSubmit={handleSubmit}
                submitting={submitting}
              />
            </div>

            <div className="hidden lg:block">
              <BookingSummary
                selectedTrainer={selectedTrainer}
                selectedClass={selectedClass}
                paymentOption={paymentOption}
                price={bookingPrice}
                preferredDate={formData.preferredDate}
                preferredTime={formData.preferredTime}
              />
            </div>
          </div>
        </Container>
      </section>

      <OtpVerificationModal
        isOpen={showOtpModal}
        bookingId={bookingId}
        otpHint={otpHint}
        otpExpiresInMinutes={otpExpiresIn}
        onClose={() => setShowOtpModal(false)}
        onVerified={handleOtpVerified}
      />

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => {
          setShowSuccess(false);
          navigate("/dashboard/my-bookings");
        }}
        bookingData={bookingData}
      />
    </>
  );
}
