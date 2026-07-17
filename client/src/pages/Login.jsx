import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheck,
  FiUser,
} from "react-icons/fi";
import { Button, Logo } from "../components/ui";
import { fadeUp, staggerContainer } from "../lib/animations";
import {
  loginBranding,
  getWelcomeFeatures,
  getSocialLinks,
  getFormPlaceholders,
  getValidationMessages,
} from "../lib/loginData";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values, messages) {
  const errors = {};
  if (!values.email.trim()) {
    errors.email = messages.emailRequired;
  } else if (!emailRegex.test(values.email)) {
    errors.email = messages.emailInvalid;
  }
  if (!values.password) {
    errors.password = messages.passwordRequired;
  } else if (values.password.length < 6) {
    errors.password = messages.passwordMinLength;
  }
  return errors;
}

const featureColors = {
  blue: {
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: "text-blue-400",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/20",
    icon: "text-cyan-400",
  },
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: "text-emerald-400",
  },
  purple: {
    bg: "bg-purple-500/10",
    border: "border-purple-500/20",
    icon: "text-purple-400",
  },
};

function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 5, 0],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-20 left-16 w-20 h-20 rounded-2xl bg-blue-500/10 border border-blue-500/15 backdrop-blur-sm"
      />
      <motion.div
        animate={{
          y: [0, 15, 0],
          rotate: [0, -8, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute top-40 right-20 w-14 h-14 rounded-full bg-cyan-500/10 border border-cyan-500/15 backdrop-blur-sm"
      />
      <motion.div
        animate={{
          y: [0, -12, 0],
          x: [0, 8, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-32 left-24 w-16 h-16 rounded-xl bg-purple-500/10 border border-purple-500/15 backdrop-blur-sm rotate-12"
      />
      <motion.div
        animate={{
          y: [0, 18, 0],
          rotate: [0, 10, 0],
        }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
        className="absolute bottom-48 right-16 w-12 h-12 rounded-lg bg-emerald-500/10 border border-emerald-500/15 backdrop-blur-sm -rotate-6"
      />
      <motion.div
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
        className="absolute top-1/3 left-1/3 w-3 h-3 rounded-full bg-blue-400/40"
      />
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
        className="absolute top-2/3 right-1/3 w-2 h-2 rounded-full bg-cyan-400/40"
      />
    </div>
  );
}

function WelcomeFeature({ feature, index }) {
  const colors = featureColors[feature.color] || featureColors.blue;
  const Icon = feature.icon;

  return (
    <motion.div
      variants={fadeUp}
      custom={index}
      className="flex items-center gap-3"
    >
      <div
        className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center shrink-0`}
      >
        <Icon className={`w-5 h-5 ${colors.icon}`} />
      </div>
      <div>
        <h4 className="text-sm font-semibold text-white">{feature.title}</h4>
        <p className="text-xs text-white/40">{feature.description}</p>
      </div>
    </motion.div>
  );
}

function LeftPanel() {
  const features = getWelcomeFeatures();
  const socialLinks = getSocialLinks();

  return (
    <div className="relative hidden lg:flex lg:w-1/2 xl:w-[55%] overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900 to-cyan-600/10" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-20 -left-20 w-[400px] h-[400px] bg-blue-600/15 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-[350px] h-[350px] bg-cyan-600/10 rounded-full blur-[80px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-purple-600/8 rounded-full blur-[90px]" />
      </div>

      <FloatingShapes />

      <div className="relative z-10 flex flex-col justify-between w-full p-10 xl:p-14">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Logo size="md" color="blue" showText />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="flex-1 flex flex-col justify-center max-w-lg py-12"
        >
          <motion.div variants={fadeUp} custom={0}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold backdrop-blur-sm mb-6">
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              Welcome to FitBookPro
            </span>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-5"
          >
            Start Your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">
              Fitness Journey
            </span>{" "}
            Today
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="text-white/50 text-lg leading-relaxed mb-10"
          >
            {loginBranding.description}
          </motion.p>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10"
          >
            {features.map((feature, i) => (
              <WelcomeFeature key={feature.id} feature={feature} index={i} />
            ))}
          </motion.div>

          <motion.div variants={fadeUp} custom={6} className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[
                "bg-blue-500",
                "bg-cyan-500",
                "bg-purple-500",
                "bg-emerald-500",
              ].map((bg, i) => (
                <div
                  key={i}
                  className={`w-9 h-9 rounded-full ${bg} border-2 border-slate-900 flex items-center justify-center`}
                >
                  <FiUser className="w-4 h-4 text-white" />
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                10,000+ Members
              </p>
              <p className="text-xs text-white/40">
                Join the community today
              </p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="flex items-center gap-4"
        >
          <span className="text-xs text-white/30">Follow us</span>
          <div className="flex items-center gap-3">
            {socialLinks.map((social) => {
              const Icon = social.icon;
              return (
                <a
                  key={social.id}
                  href={social.href}
                  aria-label={social.label}
                  className="w-9 h-9 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <Icon className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function SuccessModal({ isOpen, onClose, email }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            role="dialog"
            aria-modal="true"
            aria-label="Login successful"
          >
            <div
              className="w-full max-w-sm rounded-3xl bg-slate-900/95 backdrop-blur-2xl border border-slate-700/50 shadow-2xl shadow-black/50 p-8 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 0.2,
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30"
              >
                <FiCheck className="w-10 h-10 text-white" strokeWidth={3} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35 }}
              >
                <h2 className="text-2xl font-bold text-white mb-2">
                  Login Successful!
                </h2>
                <p className="text-white/50 text-sm mb-1">
                  Welcome back to FitBookPro.
                </p>
                <p className="text-blue-400 text-sm font-medium">{email}</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="mt-6 rounded-xl bg-slate-800/50 border border-slate-700/50 p-4 mb-6"
              >
                <p className="text-xs text-white/40 leading-relaxed">
                  This is a demo. In production, you would be redirected to your
                  dashboard with full access to your bookings and profile.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="flex flex-col gap-3"
              >
                <Button
                  variant="blue"
                  size="lg"
                  className="w-full"
                  onClick={onClose}
                >
                  Continue to Dashboard
                  <FiArrowRight className="w-4 h-4" />
                </Button>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-sm text-white/40 hover:text-white/60 transition-colors"
                >
                  Back to Login
                </button>
              </motion.div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const placeholders = getFormPlaceholders();
  const validationMessages = getValidationMessages();

  const handleBlur = useCallback(
    (field) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const fieldErrors = validate({ email, password }, validationMessages);
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] || "" }));
    },
    [email, password, validationMessages]
  );

  // const handleSubmit = useCallback(
  //   (e) => {
  //     e.preventDefault();
  //     const fieldErrors = validate({ email, password }, validationMessages);
  //     setErrors(fieldErrors);
  //     setTouched({ email: true, password: true });

  //     if (Object.keys(fieldErrors).length === 0) {
  //       setIsSubmitting(true);
  //       setTimeout(() => {
  //         setIsSubmitting(false);
  //         setShowSuccess(true);
  //       }, 1200);
  //     }
  //   },
  //   [email, password, validationMessages]
  // );


  const handleSubmit = useCallback(
    async (e) => { // এখানে async যোগ করুন
      e.preventDefault();
      const fieldErrors = validate({ email, password }, validationMessages);
      setErrors(fieldErrors);
      setTouched({ email: true, password: true });

      if (Object.keys(fieldErrors).length === 0) {
        setIsSubmitting(true);
        
        try {
          // আপনার API কলটি এখানে দিন (axios বা fetch)
          const API_BASE = import.meta.env.VITE_API_URL || "https://fitpulse-fullstack.onrender.com";
          const response = await fetch(`${API_BASE}/api/v1/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          const data = await response.json();

          if (response.ok) {
            // ডাটাগুলো ব্রাউজারে সেভ করার জন্য এই লাইনগুলো দিন:
            localStorage.setItem("user", JSON.stringify(data.user)); // ইউজার ডাটা সেভ
            localStorage.setItem("token", data.token);               // টোকেন সেভ
            
            setTimeout(() => {
              setIsSubmitting(false);
              setShowSuccess(true);
            }, 1200);
          } else {
            setIsSubmitting(false);
            // এখানে এরর হ্যান্ডেলিং করতে পারেন
            alert("Login failed: " + data.message);
          }
        } catch (error) {
          setIsSubmitting(false);
          console.error("Error:", error);
        }
      }
    },
    [email, password, validationMessages]
  );

  const inputBase =
    "w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border text-sm text-white placeholder:text-white/25 outline-none transition-all duration-300 backdrop-blur-sm";
  const inputNormal =
    "border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15 hover:border-white/20";
  const inputError =
    "border-red-500/50 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/15";

  return (
    <>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={staggerContainer}
        className="w-full max-w-md mx-auto lg:mx-0"
      >
        <motion.div variants={fadeUp} custom={0} className="mb-8 lg:hidden">
          <Logo size="md" color="blue" showText />
        </motion.div>

        <motion.div variants={fadeUp} custom={0} className="mb-2">
          <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
            <FiLock className="w-3 h-3" />
            Secure Login
          </span>
        </motion.div>

        <motion.div variants={fadeUp} custom={1} className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Welcome Back
          </h2>
          <p className="text-white/40 text-sm leading-relaxed">
            Sign in to access your dashboard, manage bookings, and track your
            fitness progress.
          </p>
        </motion.div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <motion.div variants={fadeUp} custom={2}>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-white/60 mb-2"
            >
              Email Address
            </label>
            <div className="relative">
              <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/25 pointer-events-none" />
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder={placeholders.email}
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (touched.email) {
                    const fieldErrors = validate(
                      { email: e.target.value, password },
                      validationMessages
                    );
                    setErrors((prev) => ({
                      ...prev,
                      email: fieldErrors.email || "",
                    }));
                  }
                }}
                onBlur={() => handleBlur("email")}
                className={`${inputBase} ${
                  errors.email && touched.email ? inputError : inputNormal
                }`}
              />
            </div>
            <AnimatePresence>
              {errors.email && touched.email && (
                <motion.p
                  initial={{ opacity: 0, y: -5, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -5, height: 0 }}
                  className="mt-2 text-xs text-red-400 flex items-center gap-1.5"
                  role="alert"
                >
                  <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div variants={fadeUp} custom={3}>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/60 mb-2"
            >
              Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/25 pointer-events-none" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder={placeholders.password}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (touched.password) {
                    const fieldErrors = validate(
                      { email, password: e.target.value },
                      validationMessages
                    );
                    setErrors((prev) => ({
                      ...prev,
                      password: fieldErrors.password || "",
                    }));
                  }
                }}
                onBlur={() => handleBlur("password")}
                className={`${inputBase} pr-11 ${
                  errors.password && touched.password ? inputError : inputNormal
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors duration-200"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FiEyeOff className="w-4.5 h-4.5" />
                ) : (
                  <FiEye className="w-4.5 h-4.5" />
                )}
              </button>
            </div>
            <AnimatePresence>
              {errors.password && touched.password && (
                <motion.p
                  initial={{ opacity: 0, y: -5, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -5, height: 0 }}
                  className="mt-2 text-xs text-red-400 flex items-center gap-1.5"
                  role="alert"
                >
                  <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div
            variants={fadeUp}
            custom={4}
            className="flex items-center justify-between"
          >
            <label className="flex items-center gap-2.5 cursor-pointer group">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                className="w-4 h-4 rounded-md border border-white/20 bg-white/5 checked:bg-blue-500 checked:border-blue-500 transition-all duration-200 cursor-pointer accent-blue-500"
              />
              <span className="text-sm text-white/40 group-hover:text-white/60 transition-colors duration-200">
                Remember me
              </span>
            </label>
            <button
              type="button"
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium"
            >
              Forgot password?
            </button>
          </motion.div>

          <motion.div variants={fadeUp} custom={5}>
            <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <Button
                type="submit"
                variant="blue"
                size="lg"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30 text-white border-0"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <>
                    Sign In
                    <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </form>

        <motion.div variants={fadeUp} custom={6} className="mt-8">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="px-3 bg-transparent text-white/30">
                or continue with
              </span>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-center gap-3">
            {getSocialLinks().map((social) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={social.id}
                  href={social.href}
                  aria-label={social.label}
                  whileHover={{ scale: 1.08, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-11 h-11 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  <Icon className="w-5 h-5" />
                </motion.a>
              );
            })}
          </div>
        </motion.div>

        <motion.p
          variants={fadeUp}
          custom={7}
          className="mt-8 text-center text-sm text-white/30"
        >
          Don&apos;t have an account?{" "}
          <span className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200 cursor-pointer">
            Coming Soon
          </span>
        </motion.p>
      </motion.div>

      <SuccessModal
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        email={email}
      />
    </>
  );
}

function Login() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoginSkeleton />;

  return (
    <section className="relative min-h-screen flex bg-gradient-to-br from-slate-950 via-base-100 to-slate-950 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px]" />
      </div>

      <LeftPanel />

      <div className="relative z-10 w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/20 p-7 sm:p-9">
            <LoginForm />
          </div>
        </div>
      </div>
    </section>
  );
}

export function LoginSkeleton() {
  const features = getWelcomeFeatures();

  return (
    <div className="relative min-h-screen flex bg-gradient-to-br from-slate-950 via-base-100 to-slate-950 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative hidden lg:flex lg:w-1/2 xl:w-[55%] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900 to-cyan-600/10" />
        <div className="relative z-10 flex flex-col justify-between w-full p-10 xl:p-14">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/10 skeleton-shimmer" />
            <div className="h-5 w-24 rounded-lg bg-white/10 skeleton-shimmer" />
          </div>

          <div className="flex-1 flex flex-col justify-center max-w-lg py-12 space-y-6">
            <div className="h-8 w-40 rounded-full bg-white/10 skeleton-shimmer" />
            <div className="space-y-3">
              <div className="h-12 w-full rounded-xl bg-white/10 skeleton-shimmer" />
              <div className="h-12 w-3/4 rounded-xl bg-white/10 skeleton-shimmer" />
            </div>
            <div className="space-y-2">
              <div className="h-5 w-full rounded-lg bg-white/10 skeleton-shimmer" />
              <div className="h-5 w-4/5 rounded-lg bg-white/10 skeleton-shimmer" />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-4">
              {features.map((f) => (
                <div key={f.id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-white/10 skeleton-shimmer shrink-0" />
                  <div className="space-y-2 flex-1">
                    <div className="h-4 w-24 rounded bg-white/10 skeleton-shimmer" />
                    <div className="h-3 w-32 rounded bg-white/10 skeleton-shimmer" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 pt-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-9 h-9 rounded-full bg-white/10 skeleton-shimmer border-2 border-slate-950"
                  />
                ))}
              </div>
              <div className="space-y-2">
                <div className="h-4 w-28 rounded bg-white/10 skeleton-shimmer" />
                <div className="h-3 w-36 rounded bg-white/10 skeleton-shimmer" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-9 h-9 rounded-xl bg-white/10 skeleton-shimmer"
              />
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10 w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="lg:hidden mb-8">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/10 skeleton-shimmer" />
              <div className="h-5 w-24 rounded-lg bg-white/10 skeleton-shimmer" />
            </div>
          </div>

          <div className="rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 p-7 sm:p-9 space-y-7">
            <div className="h-7 w-28 rounded-full bg-white/10 skeleton-shimmer" />
            <div className="space-y-3">
              <div className="h-9 w-48 rounded-xl bg-white/10 skeleton-shimmer" />
              <div className="h-4 w-64 rounded-lg bg-white/10 skeleton-shimmer" />
            </div>
            <div className="space-y-5">
              <div className="space-y-2">
                <div className="h-4 w-24 rounded bg-white/10 skeleton-shimmer" />
                <div className="h-12 w-full rounded-xl bg-white/10 skeleton-shimmer" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-20 rounded bg-white/10 skeleton-shimmer" />
                <div className="h-12 w-full rounded-xl bg-white/10 skeleton-shimmer" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 w-28 rounded bg-white/10 skeleton-shimmer" />
                <div className="h-4 w-28 rounded bg-white/10 skeleton-shimmer" />
              </div>
              <div className="h-13 w-full rounded-xl bg-white/10 skeleton-shimmer" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-white/10" />
              <div className="h-3 w-28 rounded bg-white/10 skeleton-shimmer" />
              <div className="h-px flex-1 bg-white/10" />
            </div>
            <div className="flex justify-center gap-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-11 h-11 rounded-xl bg-white/10 skeleton-shimmer"
                />
              ))}
            </div>
            <div className="h-4 w-48 rounded-lg bg-white/10 skeleton-shimmer mx-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;





