import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiArrowRight, FiCheck, FiKey } from "react-icons/fi";
import { Button, Logo } from "../components/ui";
import { fadeUp, staggerContainer } from "../lib/animations";
import { useSlowSubmit } from "../hooks/useSlowSubmit";

const API_URL = import.meta.env.API_URL;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function ForgotPasswordForm() {
  const navigate = useNavigate();
  const { slowMessage, start: startSlowTimer, stop: stopSlowTimer } = useSlowSubmit();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetInfo, setResetInfo] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);
    startSlowTimer();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${API_URL}/api/v1/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to process request");
      }

      setResetInfo(result.data || null);
      setSubmitted(true);
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Request timed out. The server may be starting up. Please try again.");
      } else if (err instanceof TypeError && err.message === "Failed to fetch") {
        setError("Cannot reach the server. It may be waking up — please try again in a moment.");
      } else {
        setError(err.message || "Something went wrong. Please try again.");
      }
    } finally {
      stopSlowTimer();
      setIsSubmitting(false);
    }
  };

  const inputBase =
    "w-full pl-11 pr-4 py-3.5 rounded-xl bg-white/5 border text-sm text-white placeholder:text-white/25 outline-none transition-all duration-300 backdrop-blur-sm";
  const inputNormal =
    "border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15 hover:border-white/20";
  const inputError =
    "border-red-500/50 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/15";

  if (submitted) {
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

        <motion.div
          variants={fadeUp}
          custom={1}
          className="flex flex-col items-center text-center"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30"
          >
            <FiCheck className="w-10 h-10 text-white" strokeWidth={3} />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Check Your Email
          </h2>
          <p className="text-white/40 text-sm leading-relaxed mb-6">
            We&apos;ve sent a password reset link to{" "}
            <span className="text-blue-400 font-medium">{email}</span>.
            Please check your inbox and follow the instructions.
          </p>

          {resetInfo?.resetUrl && (
            <motion.div
              variants={fadeUp}
              custom={2}
              className="w-full p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 mb-6"
            >
              <p className="text-xs text-blue-300/70 mb-2 font-medium">Development Mode - Direct Reset Link:</p>
              <a
                href={resetInfo.resetUrl}
                className="text-sm text-blue-400 hover:text-blue-300 break-all underline underline-offset-2"
              >
                {resetInfo.resetUrl}
              </a>
            </motion.div>
          )}

          <motion.div variants={fadeUp} custom={3} className="flex flex-col gap-3 w-full">
            <Button
              variant="blue"
              size="lg"
              className="w-full"
              onClick={() => navigate("/login")}
            >
              Back to Login
              <FiArrowRight className="w-4 h-4" />
            </Button>
            <button
              type="button"
              onClick={() => { setSubmitted(false); setEmail(""); setResetInfo(null); }}
              className="text-sm text-white/40 hover:text-white/60 transition-colors"
            >
              Try a different email
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  }

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
        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
          <FiKey className="w-3 h-3" />
          Password Recovery
        </span>
      </motion.div>

      <motion.div variants={fadeUp} custom={1} className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Forgot Password?
        </h2>
        <p className="text-white/40 text-sm leading-relaxed">
          Enter your email address and we&apos;ll send you a link to reset your
          password.
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-5"
        >
          {error}
        </motion.div>
      )}

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
              name="forgot_email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setError(""); }}
              className={`${inputBase} ${
                error ? inputError : inputNormal
              }`}
            />
          </div>
        </motion.div>

        <motion.div variants={fadeUp} custom={3}>
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
                  {slowMessage || "Sending reset link..."}
                </span>
              ) : (
                <>
                  Send Reset Link
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </motion.div>
        </motion.div>
      </form>

      <motion.p
        variants={fadeUp}
        custom={4}
        className="mt-8 text-center text-sm text-white/30"
      >
        Remember your password?{" "}
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

export default function ForgotPassword() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <section className="relative min-h-screen flex bg-gradient-to-br from-slate-950 via-base-100 to-slate-950 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-600/8 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px]" />
      </div>

      <div className="relative hidden lg:flex lg:w-1/2 xl:w-[55%] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-slate-900 to-cyan-600/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

        <div className="relative z-10 flex flex-col justify-between w-full p-10 xl:p-14">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Logo size="md" color="blue" showText />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex-1 flex flex-col justify-center max-w-lg py-12"
          >
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-[1.1] tracking-tight mb-5">
              Reset Your{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">
                Password
              </span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed">
              Don&apos;t worry, it happens to the best of us. Enter your email
              and we&apos;ll help you get back into your account.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/20 p-7 sm:p-9">
            <ForgotPasswordForm />
          </div>
        </div>
      </div>
    </section>
  );
}
