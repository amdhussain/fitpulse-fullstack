import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLock, FiEye, FiEyeOff, FiArrowRight, FiCheck, FiKey } from "react-icons/fi";
import { Button, Logo } from "../components/ui";
import { fadeUp, staggerContainer } from "../lib/animations";
import { useSlowSubmit } from "../hooks/useSlowSubmit";

const API_URL = import.meta.env.API_URL;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#^()_+\-=\[\]{};':"\\|,.<>\/?])[A-Za-z\d@$!%*?&.#^()_+\-=\[\]{};':"\\|,.<>\/?]{8,}$/;

function ResetPasswordForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const { slowMessage, start: startSlowTimer, stop: stopSlowTimer } = useSlowSubmit();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token. Please request a new reset link.");
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid or missing reset token.");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }
    if (!passwordRegex.test(password)) {
      setError("Password must be at least 8 characters with uppercase, lowercase, number, and special character.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setIsSubmitting(true);
    startSlowTimer();
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);

      const response = await fetch(`${API_URL}/api/v1/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to reset password");
      }

      setSuccess(true);
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
    "w-full pl-11 pr-11 py-3.5 rounded-xl bg-white/5 border text-sm text-white placeholder:text-white/25 outline-none transition-all duration-300 backdrop-blur-sm";
  const inputNormal =
    "border-white/10 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/15 hover:border-white/20";
  const inputError =
    "border-red-500/50 focus:border-red-500/50 focus:ring-2 focus:ring-red-500/15";

  if (success) {
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
            className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/30"
          >
            <FiCheck className="w-10 h-10 text-white" strokeWidth={3} />
          </motion.div>

          <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
            Password Reset!
          </h2>
          <p className="text-white/40 text-sm leading-relaxed mb-6">
            Your password has been successfully reset. You can now sign in with
            your new password.
          </p>

          <motion.div variants={fadeUp} custom={2} className="w-full">
            <Button
              variant="blue"
              size="lg"
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 shadow-lg shadow-blue-500/25 text-white border-0"
              onClick={() => navigate("/login")}
            >
              Sign In
              <FiArrowRight className="w-4 h-4" />
            </Button>
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
          New Password
        </span>
      </motion.div>

      <motion.div variants={fadeUp} custom={1} className="mb-8">
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-3">
          Set New Password
        </h2>
        <p className="text-white/40 text-sm leading-relaxed">
          Choose a strong password for your account. Make sure it&apos;s at least
          8 characters with a mix of letters, numbers, and symbols.
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

      {!token ? (
        <motion.div
          variants={fadeUp}
          custom={2}
          className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm"
        >
          Invalid or missing reset token. Please request a new password reset
          link from the{" "}
          <Link to="/forgot-password" className="underline font-medium">
            forgot password
          </Link>{" "}
          page.
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          <motion.div variants={fadeUp} custom={2}>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-white/60 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/25 pointer-events-none" />
              <input
                id="password"
                name="new_password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Min 8 characters"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className={`${inputBase} ${
                  error ? inputError : inputNormal
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/25 hover:text-white/50 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff className="w-4.5 h-4.5" /> : <FiEye className="w-4.5 h-4.5" />}
              </button>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={3}>
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-white/60 mb-2"
            >
              Confirm New Password
            </label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-white/25 pointer-events-none" />
              <input
                id="confirmPassword"
                name="confirm_password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Re-enter password"
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(""); }}
                className={`${inputBase} ${
                  error ? inputError : inputNormal
                }`}
              />
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={4}>
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
                    {slowMessage || "Resetting password..."}
                  </span>
                ) : (
                  <>
                    Reset Password
                    <FiArrowRight className="w-4 h-4" />
                  </>
                )}
              </Button>
            </motion.div>
          </motion.div>
        </form>
      )}

      <motion.p
        variants={fadeUp}
        custom={5}
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

export default function ResetPassword() {
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
              Create a{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500">
                Strong Password
              </span>
            </h1>
            <p className="text-white/50 text-lg leading-relaxed">
              Your new password should be unique and something you haven&apos;t
              used before. Keep your account secure.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl shadow-black/20 p-7 sm:p-9">
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </section>
  );
}
