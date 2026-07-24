import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiClock,
  FiCheck,
  FiX,
  FiSearch,
  FiRefreshCw,
  FiEdit2,
} from "react-icons/fi";
import { staggerContainer } from "../../lib/animations";
import PageBanner from "../../components/dashboard/PageBanner";
import StatCard from "../../components/dashboard/StatCard";
import ConfirmModal from "../../components/dashboard/ConfirmModal";
import BookingModal from "../../components/BookingModal";

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
  };
  return map[status] || map.PENDING;
};

function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, completed: 0 });
  const [cancelModal, setCancelModal] = useState({ open: false, bookingId: null });
  const [cancelling, setCancelling] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, booking: null });

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/v1/booking/me`, { headers: authHeaders() });
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
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancel = async () => {
    if (!cancelModal.bookingId) return;
    setCancelling(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/booking/me/${cancelModal.bookingId}/cancel`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ cancelReason: "Cancelled by member" }),
      });
      if (res.ok) {
        setCancelModal({ open: false, bookingId: null });
        fetchBookings();
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
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
        >
          <option value="all">All Status</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="CANCELLED">Cancelled</option>
          <option value="COMPLETED">Completed</option>
        </select>
        <button
          onClick={fetchBookings}
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
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Trainer</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Session Type</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date & Time</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Notes</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                {filtered.map((booking) => {
                  const badge = statusBadge(booking.status);
                  const trainerName = booking.trainer?.user
                    ? `${booking.trainer.user.firstName || ""} ${booking.trainer.user.lastName || ""}`.trim()
                    : booking.class?.name || "N/A";
                  return (
                    <tr key={booking._id || booking.id} className="hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{trainerName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{booking.sessionType || "-"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                          <FiCalendar className="w-3.5 h-3.5 text-gray-400" />
                          {booking.bookingDate ? new Date(booking.bookingDate).toLocaleDateString() : "N/A"}
                          <FiClock className="w-3.5 h-3.5 text-gray-400 ml-2" />
                          {booking.bookingTime || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{booking.notes || "-"}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {booking.status === "PENDING" && (
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => setEditModal({ open: true, booking })}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all"
                            >
                              <FiEdit2 className="w-3.5 h-3.5" />
                              Edit
                            </button>
                            <button
                              onClick={() => setCancelModal({ open: true, bookingId: booking._id || booking.id })}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
                            >
                              <FiX className="w-3.5 h-3.5" />
                              Cancel
                            </button>
                          </div>
                        )}
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
          fetchBookings();
        }}
        editingBooking={editModal.booking}
        onBookingUpdated={fetchBookings}
      />
    </motion.div>
  );
}

export default MyBookings;
