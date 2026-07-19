import { useState, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiUser,
} from "react-icons/fi";
import { Button, Logo } from "../components/ui";
import { fadeUp, staggerContainer } from "../lib/animations";
import { useAuth } from "../context/AuthContext";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d@$!%*?&.#^()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

function validate(values) {
  const errors = {};
  if (!values.firstName.trim()) errors.firstName = "First name is required";
  if (!values.lastName.trim()) errors.lastName = "Last name is required";
  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!emailRegex.test(values.email)) {
    errors.email = "Please enter a valid email address";
  }
  if (!values.password) {
    errors.password = "Password is required";
  } else if (!passwordRegex.test(values.password)) {
    errors.password = "Password must be at least 8 characters and include at least one uppercase letter, one lowercase letter, one number, and one special character.";
  }
  if (values.password !== values.passwordConfirm) {
    errors.passwordConfirm = "Passwords do not match";
  }
  return errors;
}

function RegisterForm() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const handleChange = useCallback((field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setServerError("");
    if (touched[field]) {
      const updated = { ...form, [field]: value };
      const fieldErrors = validate(updated);
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] || "" }));
    }
  }, [form, touched]);

  const handleBlur = useCallback(
    (field) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const fieldErrors = validate(form);
      setErrors((prev) => ({ ...prev, [field]: fieldErrors[field] || "" }));
    },
    [form]
  );

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      const fieldErrors = validate(form);
      setErrors(fieldErrors);
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        password: true,
        passwordConfirm: true,
      });

      if (Object.keys(fieldErrors).length > 0) return;

      setIsSubmitting(true);
      setServerError("");

      try {
        await register({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
          passwordConfirm: form.passwordConfirm,
        });
        navigate("/dashboard", { replace: true });
      } catch (err) {
        setServerError(err.message || "Registration failed. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [form, register, navigate]
  );

  const inputBase =
    "w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border text-sm text-white placeholder:text-white/25 outline-none transition-all duration-300 backdrop-blur-sm";
  const inputNormal =
    "border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15 hover:border-white/20";
  const inputError =
    "border-red-500/50 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/15";

  const fields = [
    { key: "firstName", label: "First Name", type: "text", icon: FiUser, placeholder: "John" },
    { key: "lastName", label: "Last Name", type: "text", icon: FiUser, placeholder: "Doe" },
    { key: "email", label: "Email Address", type: "email", icon: FiMail, placeholder: "you@example.com" },
    { key: "password", label: "Password", type: showPassword ? "text" : "password", icon: FiLock, placeholder: "Min 8 characters", toggle: true },
    { key: "passwordConfirm", label: "Confirm Password", type: showPassword ? "text" : "password", icon: FiLock, placeholder: "Re-enter password" },
  ];

  return (
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
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <FiUser className="w-3 h-3" />
          Create Account
        </span>
      </motion.div>

      <motion.div variants={fadeUp} custom={1} className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Join FitBookPro
        </h2>
        <p className="text-white/40 text-sm leading-relaxed">
          Create your account to start booking sessions, tracking progress, and
          achieving your fitness goals.
        </p>
      </motion.div>

      {serverError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm"
        >
          {serverError}
        </motion.div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {fields.map((field, idx) => (
          <motion.div key={field.key} variants={fadeUp} custom={idx + 2}>
            <label
              htmlFor={field.key}
              className="block text-sm font-medium text-white/60 mb-2"
            >
              {field.label}
            </label>
            <div className="relative">
              <field.icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/25 pointer-events-none" />
              <input
                id={field.key}
                name={field.key}
                type={field.type}
                autoComplete={field.key === "passwordConfirm" ? "new-password" : field.key === "password" ? "new-password" : field.key}
                placeholder={field.placeholder}
                value={form[field.key]}
                onChange={(e) => handleChange(field.key, e.target.value)}
                onBlur={() => handleBlur(field.key)}
                className={`${inputBase} ${
                  field.toggle ? "pr-11" : ""
                } ${
                  errors[field.key] && touched[field.key] ? inputError : inputNormal
                }`}
              />
              {field.toggle && (
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
              )}
            </div>
            <AnimatePresence>
              {errors[field.key] && touched[field.key] && (
                <motion.p
                  initial={{ opacity: 0, y: -5, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: "auto" }}
                  exit={{ opacity: 0, y: -5, height: 0 }}
                  className="mt-2 text-xs text-red-400 flex items-center gap-1.5"
                  role="alert"
                >
                  <span className="w-1 h-1 rounded-full bg-red-400 shrink-0" />
                  {errors[field.key]}
                </motion.p>
              )}
            </AnimatePresence>
          </motion.div>
        ))}

        <motion.div variants={fadeUp} custom={7} className="pt-2">
          <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
            <Button
              type="submit"
              variant="green"
              size="lg"
              className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-700 hover:to-emerald-600 shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 text-white border-0"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </span>
              ) : (
                <>
                  Create Account
                  <FiArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </form>

      <motion.p
        variants={fadeUp}
        custom={8}
        className="mt-8 text-center text-sm text-white/30"
      >
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200"
        >
          Sign In
        </Link>
      </motion.p>
    </motion.div>
  );
}

export default function Register() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-base-100 to-slate-950">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 blur-xl animate-pulse" />
            <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center shadow-lg shadow-emerald-500/25">
              <span className="text-white font-black text-xl">F</span>
            </div>
          </div>
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen flex bg-gradient-to-br from-slate-950 via-base-100 to-slate-950 overflow-hidden">
      <div
        className="absolute inset-0 overflow-hidden pointer-events-none"
        aria-hidden="true"
      >
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-600/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative hidden lg:flex lg:w-1/2 xl:w-[55%] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/20 via-slate-900 to-cyan-600/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col justify-between w-full p-10 xl:p-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Logo size="md" color="emerald" showText />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex-1 flex flex-col justify-center max-w-lg py-12"
          >
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-5">
              Start Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-emerald-500">
                Fitness Journey
              </span>{" "}
              Today
            </h1>
            <p className="text-white/50 text-lg leading-relaxed mb-10">
              Join thousands of fitness enthusiasts who trust FitBookPro for their
              workout and wellness goals. Your transformation begins here.
            </p>

            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[
                  "bg-emerald-500",
                  "bg-blue-500",
                  "bg-cyan-500",
                  "bg-purple-500",
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
            </div>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/20 p-7 sm:p-9">
            <RegisterForm />
          </div>
        </div>
      </div>
    </section>
  );
}
