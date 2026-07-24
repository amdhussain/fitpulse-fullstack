import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiCalendar,
  FiUser,
  FiClock,
  FiCheck,
  FiX,
  FiSearch,
  FiRefreshCw,
  FiCheckCircle,
  FiXCircle,
  FiEdit2,
} from "react-icons/fi";
import { staggerContainer } from "../../lib/animations";
import PageBanner from "../../components/dashboard/PageBanner";
import StatCard from "../../components/dashboard/StatCard";
import DataTable from "../../components/dashboard/DataTable";
import ConfirmModal from "../../components/dashboard/ConfirmModal";

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

function BookingSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0 });
  const [actionModal, setActionModal] = useState({ open: false, bookingId: null, action: null, title: "", message: "" });
  const [acting, setActing] = useState(false);
  const [editModal, setEditModal] = useState({ open: false, booking: null });
  const [editForm, setEditForm] = useState({
    bookingDate: "",
    bookingTime: "",
    sessionType: "",
    notes: "",
    status: "",
  });
  const [savingEdit, setSavingEdit] = useState(false);
  const [editError, setEditError] = useState("");

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/v1/booking/`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const list = data.data?.bookings || data.data || [];
        setBookings(list);
        setStats({
          total: list.length,
          pending: list.filter((b) => b.status === "PENDING").length,
          confirmed: list.filter((b) => b.status === "CONFIRMED").length,
          cancelled: list.filter((b) => b.status === "CANCELLED").length,
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

  const handleStatusUpdate = async () => {
    if (!actionModal.bookingId || !actionModal.action) return;
    setActing(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/booking/${actionModal.bookingId}/status`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ status: actionModal.action }),
      });
      if (res.ok) {
        setActionModal({ open: false, bookingId: null, action: null, title: "", message: "" });
        fetchBookings();
      }
    } catch {
      // silently fail
    } finally {
      setActing(false);
    }
  };

  const openActionModal = (bookingId, action, title, message) => {
    setActionModal({ open: true, bookingId, action, title, message });
  };

  const openEditModal = (booking) => {
    setEditForm({
      bookingDate: booking.bookingDate ? new Date(booking.bookingDate).toISOString().split("T")[0] : "",
      bookingTime: booking.bookingTime || "",
      sessionType: booking.sessionType || "",
      notes: booking.notes || "",
      status: booking.status || "PENDING",
    });
    setEditModal({ open: true, booking });
    setEditError("");
  };

  const handleEditChange = (e) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setEditError("");
  };

  const handleEditSubmit = async () => {
    if (!editModal.booking) return;
    setSavingEdit(true);
    setEditError("");
    try {
      const res = await fetch(`${API_URL}/api/v1/booking/${editModal.booking.id || editModal.booking._id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify({
          bookingDate: editForm.bookingDate ? new Date(editForm.bookingDate).toISOString() : undefined,
          bookingTime: editForm.bookingTime || undefined,
          sessionType: editForm.sessionType || undefined,
          notes: editForm.notes || undefined,
          status: editForm.status || undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed.");
      setEditModal({ open: false, booking: null });
      fetchBookings();
    } catch (err) {
      setEditError(err.message || "Something went wrong.");
    } finally {
      setSavingEdit(false);
    }
  };

  const filtered = bookings.filter((b) => {
    const matchSearch =
      b.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.class?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b._id?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || b.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const columns = [
    { key: "_id", label: "Booking ID", render: (v) => <span className="font-mono text-xs">{v?.slice(-8)}</span> },
    {
      key: "user",
      label: "User",
      render: (v) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-100 to-violet-100 dark:from-indigo-500/20 dark:to-violet-500/10 flex items-center justify-center">
            <FiUser className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          </div>
          <span className="text-sm">{v?.firstName} {v?.lastName}</span>
        </div>
      ),
    },
    { key: "class", label: "Class", render: (v) => <span className="text-sm">{v?.name || "N/A"}</span> },
    {
      key: "status",
      label: "Status",
      render: (v) => {
        const badge = statusBadge(v);
        return (
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.bg} ${badge.text} ${badge.border}`}>
            {badge.label}
          </span>
        );
      },
    },
    {
      key: "createdAt",
      label: "Date",
      render: (v) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {v ? new Date(v).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (_, row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => openEditModal(row)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all"
            title="Edit"
          >
            <FiEdit2 className="w-3.5 h-3.5" />
          </button>
          {row.status === "PENDING" && (
            <>
              <button
                onClick={() => openActionModal(row.id || row._id, "CONFIRMED", "Confirm Booking", "Are you sure you want to confirm this booking?")}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all"
                title="Confirm"
              >
                <FiCheckCircle className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => openActionModal(row.id || row._id, "CANCELLED", "Cancel Booking", "Are you sure you want to cancel this booking?")}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
                title="Cancel"
              >
                <FiXCircle className="w-3.5 h-3.5" />
              </button>
            </>
          )}
          {row.status === "CONFIRMED" && (
            <>
              <button
                onClick={() => openActionModal(row.id || row._id, "COMPLETED", "Complete Booking", "Mark this booking as completed?")}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all"
                title="Complete"
              >
                <FiCheck className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => openActionModal(row.id || row._id, "CANCELLED", "Cancel Booking", "Are you sure you want to cancel this booking?")}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-all"
                title="Cancel"
              >
                <FiXCircle className="w-3.5 h-3.5" />
              </button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <PageBanner pageKey="bookings" icon={FiCalendar} subtitle="Manage all class bookings" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiCalendar} label="Total Bookings" value={stats.total} color="blue" />
        <StatCard icon={FiClock} label="Pending" value={stats.pending} color="amber" />
        <StatCard icon={FiCheck} label="Confirmed" value={stats.confirmed} color="emerald" />
        <StatCard icon={FiX} label="Cancelled" value={stats.cancelled} color="red" />
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
        <BookingSkeleton />
      ) : (
        <DataTable columns={columns} data={filtered} emptyMessage="No bookings found" />
      )}

      <ConfirmModal
        isOpen={actionModal.open}
        onClose={() => setActionModal({ open: false, bookingId: null, action: null, title: "", message: "" })}
        onConfirm={handleStatusUpdate}
        title={actionModal.title}
        message={actionModal.message}
        confirmText={actionModal.action === "CONFIRMED" ? "Confirm" : actionModal.action === "COMPLETED" ? "Complete" : "Cancel"}
        type={actionModal.action === "CANCELLED" ? "danger" : actionModal.action === "CONFIRMED" ? "success" : "info"}
        loading={acting}
      />

      {editModal.open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-md z-50"
            onClick={() => setEditModal({ open: false, booking: null })}
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
            aria-label="Edit Booking"
          >
            <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0f1219] border border-gray-200/60 dark:border-white/[0.08] shadow-2xl shadow-gray-300/50 dark:shadow-black/60 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">Edit Booking</h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Update booking details</p>
                </div>
                <button onClick={() => setEditModal({ open: false, booking: null })} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 dark:text-gray-500 transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Date</label>
                    <input
                      type="date"
                      name="bookingDate"
                      value={editForm.bookingDate}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Time</label>
                    <input
                      type="time"
                      name="bookingTime"
                      value={editForm.bookingTime}
                      onChange={handleEditChange}
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Session Type</label>
                  <input
                    type="text"
                    name="sessionType"
                    value={editForm.sessionType}
                    onChange={handleEditChange}
                    placeholder="e.g., Personal Training"
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notes</label>
                  <textarea
                    name="notes"
                    value={editForm.notes}
                    onChange={handleEditChange}
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Status</label>
                  <select
                    name="status"
                    value={editForm.status}
                    onChange={handleEditChange}
                    className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
                  >
                    <option value="PENDING">Pending</option>
                    <option value="CONFIRMED">Confirmed</option>
                    <option value="CANCELLED">Cancelled</option>
                    <option value="COMPLETED">Completed</option>
                  </select>
                </div>

                {editError && (
                  <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-2.5">{editError}</p>
                )}

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button onClick={() => setEditModal({ open: false, booking: null })} disabled={savingEdit} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 transition-all disabled:opacity-50">
                    Cancel
                  </button>
                  <button onClick={handleEditSubmit} disabled={savingEdit} className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-500 text-white hover:from-blue-700 hover:to-indigo-600 shadow-md shadow-blue-500/25 transition-all active:scale-[0.97] disabled:opacity-50 flex items-center gap-2">
                    {savingEdit ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </motion.div>
  );
}

export default BookingManagement;
