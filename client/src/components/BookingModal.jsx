import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiX,
  FiCalendar,
  FiClock,
  FiUser,
  FiDollarSign,
  FiTag,
  FiFileText,
  FiLoader,
} from "react-icons/fi";

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

function BookingModal({ isOpen, onClose, trainer, editingBooking, onBookingUpdated }) {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const trainerName = trainer
    ? trainer.name || `${trainer.user?.firstName || ""} ${trainer.user?.lastName || ""}`.trim()
    : editingBooking?.trainer
    ? `${editingBooking.trainer.user?.firstName || ""} ${editingBooking.trainer.user?.lastName || ""}`.trim()
    : "";

  const trainerId = trainer?.id || editingBooking?.trainerId || editingBooking?.trainer?.id || "";
  const sessionPrice = trainer?.hourlyRate || editingBooking?.trainer?.hourlyRate || 0;
  const availableTimeSlots = trainer?.availableTimeSlots || [];
  const sessionTypes = trainer?.sessionTypes || editingBooking?.trainer?.sessionTypes || [];
  const isEditing = !!editingBooking;

  const [form, setForm] = useState({
    bookingDate: "",
    bookingTime: "",
    sessionType: "",
    notes: "",
  });

  useEffect(() => {
    if (isOpen) {
      if (editingBooking) {
        setForm({
          bookingDate: editingBooking.bookingDate ? new Date(editingBooking.bookingDate).toISOString().split("T")[0] : "",
          bookingTime: editingBooking.bookingTime || "",
          sessionType: editingBooking.sessionType || "",
          notes: editingBooking.notes || "",
        });
      } else {
        setForm({ bookingDate: "", bookingTime: "", sessionType: "", notes: "" });
      }
      setError("");
      setSuccess(false);
    }
  }, [isOpen, editingBooking]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.bookingDate) return setError("Please select a booking date.");
    if (!form.bookingTime) return setError("Please select a booking time.");
    if (!form.sessionType) return setError("Please select a session type.");

    setSubmitting(true);
    setError("");

    try {
      let res;
      if (isEditing) {
        res = await fetch(`${API_URL}/api/v1/booking/me/${editingBooking.id}`, {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify({
            bookingDate: new Date(form.bookingDate).toISOString(),
            bookingTime: form.bookingTime,
            sessionType: form.sessionType,
            notes: form.notes || undefined,
          }),
        });
      } else {
        res = await fetch(`${API_URL}/api/v1/booking/me/book-trainer`, {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({
            trainerId,
            bookingDate: new Date(form.bookingDate).toISOString(),
            bookingTime: form.bookingTime,
            sessionType: form.sessionType,
            notes: form.notes || undefined,
          }),
        });
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Booking failed.");
      setSuccess(true);
      if (onBookingUpdated) onBookingUpdated();
      setTimeout(() => onClose(), 2000);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/50 backdrop-blur-md z-50"
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
            aria-label={isEditing ? "Edit Booking" : "Book a Session"}
          >
            <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#0f1219] border border-gray-200/60 dark:border-white/[0.08] shadow-2xl shadow-gray-300/50 dark:shadow-black/60 overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/5">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">{isEditing ? "Edit Booking" : "Book a Session"}</h3>
                  {trainerName && <p className="text-sm text-gray-500 dark:text-gray-400">with {trainerName}</p>}
                </div>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 dark:text-gray-500 transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {success ? (
                <div className="p-10 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }} className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/10 flex items-center justify-center mx-auto mb-4 ring-4 ring-emerald-100 dark:ring-emerald-500/20">
                    <FiCalendar className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                  </motion.div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{isEditing ? "Booking Updated!" : "Booking Confirmed!"}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isEditing ? "Your booking has been updated successfully." : "Your session has been booked successfully. Status: Pending"}
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Trainer Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={trainerName}
                        readOnly
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/[0.03] border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 cursor-not-allowed"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Session Date</label>
                      <div className="relative">
                        <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                          type="date"
                          name="bookingDate"
                          value={form.bookingDate}
                          onChange={handleChange}
                          min={minDate}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Available Time Slot</label>
                      <div className="relative">
                        <FiClock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        {availableTimeSlots.length > 0 ? (
                          <select
                            name="bookingTime"
                            value={form.bookingTime}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
                          >
                            <option value="">Select time</option>
                            {availableTimeSlots.map((slot) => (
                              <option key={slot} value={slot}>{slot}</option>
                            ))}
                          </select>
                        ) : (
                          <input
                            type="time"
                            name="bookingTime"
                            value={form.bookingTime}
                            onChange={handleChange}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
                          />
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Session Type</label>
                    <div className="relative">
                      <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      {sessionTypes.length > 0 ? (
                        <select
                          name="sessionType"
                          value={form.sessionType}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
                        >
                          <option value="">Select session type</option>
                          {sessionTypes.map((type) => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type="text"
                          name="sessionType"
                          value={form.sessionType}
                          onChange={handleChange}
                          placeholder="e.g., Personal Training"
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
                        />
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Notes (optional)</label>
                    <div className="relative">
                      <FiFileText className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <textarea
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        rows={3}
                        placeholder="Any special requirements..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-3 rounded-xl bg-cyan-50 dark:bg-cyan-500/10 border border-cyan-200 dark:border-cyan-500/20">
                    <FiDollarSign className="w-5 h-5 text-cyan-600 dark:text-cyan-400" />
                    <span className="text-sm font-medium text-cyan-700 dark:text-cyan-300">Session Price:</span>
                    <span className="text-lg font-bold text-cyan-800 dark:text-cyan-200">${sessionPrice}</span>
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-2.5">{error}</p>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button type="button" onClick={onClose} disabled={submitting} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 transition-all disabled:opacity-50">
                      Cancel
                    </button>
                    <button type="submit" disabled={submitting} className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-500 text-white hover:from-blue-700 hover:to-indigo-600 shadow-md shadow-blue-500/25 transition-all active:scale-[0.97] disabled:opacity-50 flex items-center gap-2">
                      {submitting ? (
                        <>
                          <FiLoader className="w-4 h-4 animate-spin" />
                          {isEditing ? "Updating..." : "Booking..."}
                        </>
                      ) : (
                        isEditing ? "Update Booking" : "Confirm Booking"
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default BookingModal;
