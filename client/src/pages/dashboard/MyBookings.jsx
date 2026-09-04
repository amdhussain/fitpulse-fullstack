import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiCheck,
  FiX,
  FiSearch,
  FiRefreshCw,
  FiEdit2,
  FiShield,
  FiLoader,
} from "react-icons/fi";
import { staggerContainer } from "../../lib/animations";
import PageBanner from "../../components/dashboard/PageBanner";
import StatCard from "../../components/dashboard/StatCard";
import ConfirmModal from "../../components/dashboard/ConfirmModal";
import BookingModal from "../../components/BookingModal";
import { apiClient } from "../../lib/api";

const statusBadge = (status) => {
  const map = {
    PENDING: {
      bg: "bg-amber-50 dark:bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-500/20",
      label: "Pending",
    },
    CONFIRMED: {
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-500/20",
      label: "Confirmed",
    },
    CANCELLED: {
      bg: "bg-red-50 dark:bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-200 dark:border-red-500/20",
      label: "Cancelled",
    },
    COMPLETED: {
      bg: "bg-blue-50 dark:bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-500/20",
      label: "Completed",
    },
    PENDING_PAYMENT: {
      bg: "bg-amber-50 dark:bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-500/20",
      label: "Payment Pending",
    },
    PENDING_VERIFICATION: {
      bg: "bg-violet-50 dark:bg-violet-500/10",
      text: "text-violet-600 dark:text-violet-400",
      border: "border-violet-200 dark:border-violet-500/20",
      label: "OTP Pending",
    },
  };
  return map[status] || map.PENDING;
};

const paymentStatusBadge = (status) => {
  const map = {
    PENDING_PAYMENT: {
      bg: "bg-gray-50 dark:bg-gray-500/10",
      text: "text-gray-500 dark:text-gray-400",
      border: "border-gray-200 dark:border-gray-500/20",
      label: "Unpaid",
    },
    PENDING_VERIFICATION: {
      bg: "bg-violet-50 dark:bg-violet-500/10",
      text: "text-violet-600 dark:text-violet-400",
      border: "border-violet-200 dark:border-violet-500/20",
      label: "Verifying",
    },
    CONFIRMED: {
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-500/20",
      label: "Paid",
    },
    TEST_PAYMENT: {
      bg: "bg-blue-50 dark:bg-blue-500/10",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-500/20",
      label: "Test Payment",
    },
  };
  return map[status] || map.PENDING_PAYMENT;
};

function OtpModal({ isOpen, bookingId, onClose, onVerified }) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [otpHint, setOtpHint] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setOtp("");
      setError("");
      setSuccess(false);
      setOtpHint("");
      setOtpSent(false);
    }
  }, [isOpen, bookingId]);

  const handleSendOtp = async () => {
    setSending(true);
    setError("");
    try {
      const res = await apiClient.post("/api/v1/otp/send", { bookingId });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");
      setOtpSent(true);
      if (data.data?.otpHint) setOtpHint(data.data.otpHint);
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
      const res = await apiClient.post("/api/v1/otp/verify", { bookingId, code: otp.trim() });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP verification failed");
      setSuccess(true);
      setTimeout(() => {
        onVerified();
        onClose();
      }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-gray-900/50 backdrop-blur-md z-50"
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
          className="w-full max-w-md rounded-2xl bg-white dark:bg-[#1a2235] border border-gray-200/60 dark:border-white/[0.08] shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Verify Booking OTP</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                Enter the 6-digit code sent to your email
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
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
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/10 flex items-center justify-center mx-auto mb-4 ring-4 ring-emerald-100 dark:ring-emerald-500/20"
                >
                  <FiCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                </motion.div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">Booking Confirmed!</h4>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your booking has been verified and confirmed.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {!otpSent ? (
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-500/20 dark:to-purple-500/10 flex items-center justify-center mx-auto mb-4 ring-4 ring-violet-100 dark:ring-violet-500/20">
                      <FiShield className="w-6 h-6 text-violet-600 dark:text-violet-400" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                      Click below to send a verification OTP to your registered email.
                    </p>
                    <button
                      onClick={handleSendOtp}
                      disabled={sending}
                      className="w-full px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-500 text-white hover:from-violet-700 hover:to-purple-600 shadow-md shadow-violet-500/25 transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2"
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
                      <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                        <p className="text-xs text-emerald-600 dark:text-emerald-400">
                          <span className="font-semibold">Dev Hint:</span> Your OTP is <span className="font-mono font-bold text-emerald-700 dark:text-emerald-300">{otpHint}</span>
                        </p>
                      </div>
                    )}

                    <div>
                      <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                        Enter 6-Digit OTP
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "").slice(0, 6);
                          setOtp(val);
                          setError("");
                        }}
                        placeholder="000000"
                        maxLength={6}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-white/10 text-center text-2xl font-mono font-bold tracking-[0.5em] bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white placeholder-gray-300 dark:placeholder-gray-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500"
                        autoFocus
                      />
                    </div>

                    {error && (
                      <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-2.5">
                        {error}
                      </p>
                    )}

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setOtpSent(false)}
                        disabled={loading}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 transition-all disabled:opacity-50"
                      >
                        Resend OTP
                      </button>
                      <button
                        onClick={handleVerify}
                        disabled={loading || otp.length !== 6}
                        className="flex-1 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-violet-600 to-purple-500 text-white hover:from-violet-700 hover:to-purple-600 shadow-md shadow-violet-500/25 transition-all active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2"
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
  );
}

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });
  const [cancelModal, setCancelModal] = useState({ open: false, bookingId: null });
  const [cancelling, setCancelling] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, booking: null });
  const [otpModal, setOtpModal] = useState({ open: false, bookingId: null });
  const [fetchError, setFetchError] = useState("");

  const fetchBookings = useCallback(async (statusFilter) => {
    try {
      setLoading(true);
      setFetchError("");
      const params = new URLSearchParams();
      if (statusFilter && statusFilter !== "all") {
        params.set("status", statusFilter);
      }
      const qs = params.toString();
      const url = `/api/v1/booking/me${qs ? `?${qs}` : ""}`;
      const res = await apiClient.get(url);
      if (res.ok) {
        const data = await res.json();
        const list = data.data?.bookings || data.data || [];
        setBookings(list);
        setStats({
          total: list.length,
          pending: list.filter((b) => b.status === "PENDING").length,
          confirmed: list.filter((b) => b.status === "CONFIRMED").length,
          completed: list.filter((b) => b.status === "COMPLETED").length,
        });
      } else {
        setFetchError("Failed to load bookings. Please try again.");
      }
    } catch {
      setFetchError("Failed to load bookings. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings(filterStatus);
  }, [fetchBookings, filterStatus]);

  const handleCancel = async () => {
    if (!cancelModal.bookingId) return;
    setCancelling(true);
    try {
      const res = await apiClient.patch(`/api/v1/booking/me/${cancelModal.bookingId}/cancel`, { cancelReason: "Cancelled by member" });
      if (res.ok) {
        setCancelModal({ open: false, bookingId: null });
        fetchBookings(filterStatus);
      }
    } catch {
      // silently fail
    } finally {
      setCancelling(false);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.class?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.trainer?.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.trainer?.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.sessionType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <PageBanner pageKey="my-bookings" icon={FiCalendar} subtitle="View and manage your bookings" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiCalendar} label="Total Bookings" value={stats.total} color="blue" />
        <StatCard icon={FiClock} label="Pending" value={stats.pending} color="amber" />
        <StatCard icon={FiCheck} label="Confirmed" value={stats.confirmed} color="emerald" />
        <StatCard icon={FiCheck} label="Completed" value={stats.completed} color="blue" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-400" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
          />
        </div>
        <div className="select-wrapper">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="!pr-10 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
          >
            <option value="all">All Status</option>
            <option value="PENDING">Pending</option>
            <option value="PENDING_PAYMENT">Payment Pending</option>
            <option value="PENDING_VERIFICATION">OTP Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="CANCELLED">Cancelled</option>
            <option value="COMPLETED">Completed</option>
          </select>
        </div>
        <button
          onClick={() => fetchBookings(filterStatus)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
        >
          <FiRefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : fetchError ? (
        <div className="text-center py-16">
          <FiCalendar className="w-12 h-12 text-red-300 dark:text-red-600 mx-auto mb-4" />
          <p className="text-red-500 dark:text-red-400 mb-4">{fetchError}</p>
          <button
            onClick={() => fetchBookings(filterStatus)}
            className="px-4 py-2 rounded-xl bg-blue-500 text-white text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <FiCalendar className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No bookings found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Trainer</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Session Type</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date & Time</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Notes</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                {filtered.map((booking) => {
                  const badge = statusBadge(booking.status);
                  const pBadge = paymentStatusBadge(booking.paymentStatus);
                  const trainerName = booking.trainer?.user
                    ? `${booking.trainer.user.firstName || ""} ${booking.trainer.user.lastName || ""}`.trim()
                    : booking.class?.name || "N/A";
                  const bookingId = booking._id || booking.id;
                  return (
                    <tr key={bookingId} className="hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{trainerName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{booking.sessionType || "-"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <FiCalendar className="w-3.5 h-3.5 text-gray-400 dark:text-gray-400" />
                          {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "N/A"}
                          <FiClock className="w-3.5 h-3.5 text-gray-400 dark:text-gray-400 ml-2" />
                          {booking.bookingTime || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${pBadge.bg} ${pBadge.text} ${pBadge.border}`}>
                          {pBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{booking.notes || "-"}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {booking.status === "PENDING" && (
                            <>
                              <button
                                onClick={() => setEditModal({ open: true, booking })}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all"
                              >
                                <FiEdit2 className="w-3.5 h-3.5" />
                                Edit
                              </button>
                              <button
                                onClick={() => setCancelModal({ open: true, bookingId })}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
                              >
                                <FiX className="w-3.5 h-3.5" />
                                Cancel
                              </button>
                            </>
                          )}
                          {booking.status === "PENDING_VERIFICATION" && (
                            <button
                              onClick={() => setOtpModal({ open: true, bookingId })}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-500/10 border border-violet-200 dark:border-violet-500/20 hover:bg-violet-100 dark:hover:bg-violet-500/20 transition-all"
                            >
                              <FiShield className="w-3.5 h-3.5" />
                              Verify OTP
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmModal
        isOpen={cancelModal.open}
        onClose={() => setCancelModal({ open: false, bookingId: null })}
        onConfirm={handleCancel}
        title="Cancel Booking"
        message="Are you sure you want to cancel this booking? This action cannot be undone."
        confirmText="Cancel Booking"
        type="warning"
        loading={cancelling}
      />

      <BookingModal
        isOpen={editModal.open}
        onClose={() => {
          setEditModal({ open: false, booking: null });
          fetchBookings(filterStatus);
        }}
        editingBooking={editModal.booking}
        onBookingUpdated={() => fetchBookings(filterStatus)}
      />

      <OtpModal
        isOpen={otpModal.open}
        bookingId={otpModal.bookingId}
        onClose={() => setOtpModal({ open: false, bookingId: null })}
        onVerified={() => fetchBookings(filterStatus)}
      />
    </motion.div>
  );
}

export default MyBookings;
