import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiX, FiShield, FiCheck, FiLoader, FiRefreshCw } from "react-icons/fi";

const API_URL = import.meta.env.API_URL;

function getAuthToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAuthToken()}`,
  };
}

export default function OtpVerificationModal({
  isOpen,
  bookingId,
  otpHint,
  otpExpiresInMinutes,
  onClose,
  onVerified,
  onError,
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setOtp("");
      setError("");
      setSuccess(false);
      setOtpSent(!!otpHint);
      setResendCooldown(0);
      if (otpHint) {
        setTimeout(() => inputRef.current?.focus(), 300);
      }
    }
  }, [isOpen, otpHint]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const handleSendOtp = async () => {
    setSending(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/v1/otp/send`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setOtpSent(true);
      setResendCooldown(60);
      if (data.data?.hint) {
        setOtpSent(true);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  };

  const handleVerify = async () => {
    if (!otp.trim() || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${API_URL}/api/v1/otp/verify`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ bookingId, code: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");
      setSuccess(true);
      setTimeout(() => {
        onVerified?.();
        onClose?.();
      }, 1500);
    } catch (err) {
      setError(err.message);
      onError?.(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 6);
    setOtp(val);
    setError("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && otp.length === 6 && !loading) {
      handleVerify();
    }
  };

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
            aria-label="Verify OTP"
          >
            <div
              className="w-full max-w-md rounded-2xl bg-base-200/95 backdrop-blur-xl border border-base-300/50 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 py-5 border-b border-base-300/30 flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-base-content">
                    Verify OTP
                  </h3>
                  <p className="text-sm text-base-content/50 mt-0.5">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-base-300/50 text-base-content/40 hover:text-base-content transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                {success ? (
                  <div className="text-center py-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 20,
                      }}
                      className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-500 flex items-center justify-center mx-auto mb-4"
                    >
                      <FiCheck className="w-8 h-8 text-white" />
                    </motion.div>
                    <h4 className="text-lg font-bold text-base-content mb-2">
                      Booking Confirmed!
                    </h4>
                    <p className="text-sm text-base-content/50">
                      Your booking has been verified and confirmed.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-5">
                    {!otpSent ? (
                      <div className="text-center">
                        <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mx-auto mb-4">
                          <FiShield className="w-7 h-7 text-blue-400" />
                        </div>
                        <p className="text-sm text-base-content/50 mb-4">
                          Click below to send a verification OTP to your
                          registered email.
                        </p>
                        <button
                          onClick={handleSendOtp}
                          disabled={sending}
                          className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700 shadow-md shadow-blue-500/25 transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                          {sending ? (
                            <>
                              <FiLoader className="w-4 h-4 animate-spin" />
                              Sending OTP...
                            </>
                          ) : (
                            <>
                              <FiShield className="w-4 h-4" />
                              Send OTP
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <>
                        {otpHint && (
                          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                            <p className="text-xs text-emerald-400">
                              <span className="font-semibold">Dev Hint:</span>{" "}
                              Your OTP is{" "}
                              <span className="font-mono font-bold text-emerald-300">
                                {otpHint}
                              </span>
                            </p>
                          </div>
                        )}

                        <div>
                          <label className="block text-sm font-medium text-base-content/50 mb-2">
                            Enter 6-Digit OTP
                          </label>
                          <input
                            ref={inputRef}
                            type="text"
                            value={otp}
                            onChange={handleOtpChange}
                            onKeyDown={handleKeyDown}
                            placeholder="000000"
                            maxLength={6}
                            className="w-full px-4 py-3 rounded-xl bg-base-300/30 border border-base-300/50 text-center text-2xl font-mono font-bold tracking-[0.5em] text-base-content placeholder:text-base-content/20 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
                            autoFocus
                          />
                        </div>

                        {error && (
                          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2.5">
                            {error}
                          </p>
                        )}

                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => {
                              if (resendCooldown > 0) return;
                              handleSendOtp();
                            }}
                            disabled={loading || resendCooldown > 0}
                            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-base-content/60 hover:bg-base-300/30 border border-base-300/50 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {resendCooldown > 0 ? (
                              `Resend in ${resendCooldown}s`
                            ) : (
                              <>
                                <FiRefreshCw className="w-4 h-4" />
                                Resend OTP
                              </>
                            )}
                          </button>
                          <button
                            onClick={handleVerify}
                            disabled={loading || otp.length !== 6}
                            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-emerald-600 text-white hover:from-blue-700 hover:to-emerald-700 shadow-md shadow-blue-500/25 transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            {loading ? (
                              <>
                                <FiLoader className="w-4 h-4 animate-spin" />
                                Verifying...
                              </>
                            ) : (
                              "Verify OTP"
                            )}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
