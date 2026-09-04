import { useState, useEffect, useRef } from "react";
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
  FiCreditCard,
  FiSmartphone,
  FiCheck,
  FiArrowRight,
} from "react-icons/fi";
import OtpVerificationModal from "./OtpVerificationModal";
import { API_URL } from "../lib/api";

function getAuthToken() {
  return localStorage.getItem("token");
}

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getAuthToken()}`,
  };
}

const paymentMethods = [
  { id: "bkash", label: "bKash", icon: FiSmartphone, color: "from-pink-500 to-rose-500" },
  { id: "nagad", label: "Nagad", icon: FiSmartphone, color: "from-orange-500 to-amber-500" },
  { id: "rocket", label: "Rocket", icon: FiSmartphone, color: "from-violet-500 to-purple-500" },
  { id: "card", label: "Visa/Card", icon: FiCreditCard, color: "from-blue-500 to-indigo-500" },
];

function BookingModal({ isOpen, onClose, trainer, editingBooking, onBookingUpdated }) {
  const [step, setStep] = useState("booking");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [createdBookingId, setCreatedBookingId] = useState(null);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [otpHint, setOtpHint] = useState("");
  const [otpExpiresIn, setOtpExpiresIn] = useState(10);
  const closeTimerRef = useRef(null);

  const trainerName = trainer
    ? trainer.name || `${trainer.user?.firstName || ""} ${trainer.user?.lastName || ""}`.trim()
    : editingBooking?.trainer
    ? `${editingBooking.trainer.user?.firstName || ""} ${editingBooking.trainer.user?.lastName || ""}`.trim()
    : "";

  const trainerId = trainer?.id || editingBooking?.trainerId || editingBooking?.trainer?.id || "";
  const sessionPrice = trainer?.hourlyRate || editingBooking?.trainer?.hourlyRate || editingBooking?.class?.price || 0;
  const isEditing = !!editingBooking;

  const [form, setForm] = useState({
    bookingDate: "",
    bookingTime: "",
    sessionType: "",
    notes: "",
    paymentOption: "FULL",
  });

  const [paymentForm, setPaymentForm] = useState({
    transactionId: "",
    paymentMethod: "",
  });

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (editingBooking) {
        setForm({
          bookingDate: editingBooking.bookingDate ? new Date(editingBooking.bookingDate).toISOString().split("T")[0] : "",
          bookingTime: editingBooking.bookingTime || "",
          sessionType: editingBooking.sessionType || "",
          notes: editingBooking.notes || "",
          paymentOption: editingBooking.paymentOption || "FULL",
        });
      } else {
        setForm({ bookingDate: "", bookingTime: "", sessionType: "", notes: "", paymentOption: "FULL" });
      }
      setPaymentForm({ transactionId: "", paymentMethod: "" });
      setError("");
      setSuccess(false);
      setStep("booking");
      setCreatedBookingId(null);
      setShowOtpModal(false);
      setOtpHint("");
      setOtpExpiresIn(10);
    }
  }, [isOpen, editingBooking]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handlePaymentChange = (e) => {
    setPaymentForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const dueAmount = form.paymentOption === "HALF" ? sessionPrice / 2 : sessionPrice;
  const remainingAmount = form.paymentOption === "HALF" ? sessionPrice / 2 : 0;

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    if (!form.bookingDate) return setError("Please select a booking date.");
    if (!form.bookingTime) return setError("Please select a booking time.");
    if (!form.sessionType) return setError("Please select a session type.");

    setSubmitting(true);
    setError("");

    try {
      let res;
      if (isEditing) {
        const editId = editingBooking.id || editingBooking._id;
        res = await fetch(`${API_URL}/api/v1/booking/me/${editId}`, {
          method: "PATCH",
          headers: authHeaders(),
          body: JSON.stringify({
            bookingDate: new Date(form.bookingDate).toISOString(),
            bookingTime: form.bookingTime,
            sessionType: form.sessionType,
            notes: form.notes || undefined,
            paymentOption: form.paymentOption,
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
            paymentOption: form.paymentOption,
          }),
        });
      }

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid response from server");
      }
      if (!res.ok) throw new Error(data.message || "Booking failed.");

      if (isEditing) {
        setSuccess(true);
        if (onBookingUpdated) onBookingUpdated();
        closeTimerRef.current = setTimeout(() => onClose(), 2000);
      } else {
        const bookingId = data.data?.id || data.data?._id;
        setCreatedBookingId(bookingId);

        const hint = data.data?.otpHint;
        const expiresIn = data.data?.otpExpiresInMinutes || 10;
        setOtpHint(hint || "");
        setOtpExpiresIn(expiresIn);
        setShowOtpModal(true);
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!paymentForm.transactionId.trim()) return setError("Please enter the Transaction ID.");
    if (!paymentForm.paymentMethod) return setError("Please select a payment method.");

    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`${API_URL}/api/v1/booking/me/${createdBookingId}/submit-payment`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          transactionId: paymentForm.transactionId.trim(),
          paymentMethod: paymentForm.paymentMethod,
          paymentOption: form.paymentOption,
        }),
      });

      let data;
      try {
        data = await res.json();
      } catch {
        throw new Error("Invalid response from server");
      }
      if (!res.ok) throw new Error(data.message || "Payment submission failed.");

      setSuccess(true);
      if (onBookingUpdated) onBookingUpdated();
      closeTimerRef.current = setTimeout(() => onClose(), 2500);
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
            <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#1a2235] border border-gray-200/60 dark:border-white/[0.08] shadow-2xl shadow-gray-300/50 dark:shadow-black/60 overflow-hidden max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/[0.06] sticky top-0 bg-white dark:bg-[#1a2235] z-10">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                    {isEditing ? "Edit Booking" : step === "booking" ? "Book a Session" : "Complete Payment"}
                  </h3>
                  {trainerName && <p className="text-sm text-gray-500 dark:text-gray-400">with {trainerName}</p>}
                </div>
                <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 dark:text-gray-500 transition-colors">
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {step === "booking" && !success ? (
                <form onSubmit={handleBookingSubmit} className="p-6 space-y-4">
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
                        <input
                          type="time"
                          name="bookingTime"
                          value={form.bookingTime}
                          onChange={handleChange}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Session Type</label>
                    <div className="select-wrapper relative">
                      <FiTag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                      <select
                        name="sessionType"
                        value={form.sessionType}
                        onChange={handleChange}
                        className="w-full pl-10 py-2.5 rounded-xl bg-gray-50 dark:bg-white/[0.06] border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-white outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
                      >
                        <option value="">Select session type</option>
                        <option value="Personal Training">Personal Training</option>
                        <option value="Group Fitness">Group Fitness</option>
                        <option value="Cardio Session">Cardio Session</option>
                        <option value="Yoga & Stretching">Yoga & Stretching</option>
                        <option value="Strength Training">Strength Training</option>
                      </select>
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

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Payment Option</label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, paymentOption: "FULL" }))}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                          form.paymentOption === "FULL"
                            ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-500/10 shadow-md shadow-emerald-500/10"
                            : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/20"
                        }`}
                      >
                        {form.paymentOption === "FULL" && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                            <FiCheck className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <FiDollarSign className={`w-6 h-6 mb-2 ${form.paymentOption === "FULL" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"}`} />
                        <p className={`text-sm font-bold ${form.paymentOption === "FULL" ? "text-emerald-700 dark:text-emerald-300" : "text-gray-700 dark:text-gray-300"}`}>Full Payment</p>
                        <p className={`text-xs mt-1 ${form.paymentOption === "FULL" ? "text-emerald-600 dark:text-emerald-400" : "text-gray-500 dark:text-gray-400"}`}>Pay full amount now</p>
                        <p className={`text-lg font-bold mt-2 ${form.paymentOption === "FULL" ? "text-emerald-700 dark:text-emerald-300" : "text-gray-800 dark:text-gray-200"}`}>${sessionPrice}</p>
                      </button>

                      <button
                        type="button"
                        onClick={() => setForm((prev) => ({ ...prev, paymentOption: "HALF" }))}
                        className={`relative p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                          form.paymentOption === "HALF"
                            ? "border-violet-500 bg-violet-50 dark:bg-violet-500/10 shadow-md shadow-violet-500/10"
                            : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] hover:border-gray-300 dark:hover:border-white/20"
                        }`}
                      >
                        {form.paymentOption === "HALF" && (
                          <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                            <FiCheck className="w-3 h-3 text-white" />
                          </div>
                        )}
                        <FiDollarSign className={`w-6 h-6 mb-2 ${form.paymentOption === "HALF" ? "text-violet-600 dark:text-violet-400" : "text-gray-400 dark:text-gray-500"}`} />
                        <p className={`text-sm font-bold ${form.paymentOption === "HALF" ? "text-violet-700 dark:text-violet-300" : "text-gray-700 dark:text-gray-300"}`}>Half Payment</p>
                        <p className={`text-xs mt-1 ${form.paymentOption === "HALF" ? "text-violet-600 dark:text-violet-400" : "text-gray-500 dark:text-gray-400"}`}>Pay advance (50%)</p>
                        <p className={`text-lg font-bold mt-2 ${form.paymentOption === "HALF" ? "text-violet-700 dark:text-violet-300" : "text-gray-800 dark:text-gray-200"}`}>${sessionPrice / 2}</p>
                      </button>
                    </div>

                    <div className={`p-3 rounded-xl border ${form.paymentOption === "HALF" ? "bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20" : "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20"}`}>
                      <div className="flex items-center justify-between text-sm">
                        <span className={form.paymentOption === "HALF" ? "text-amber-700 dark:text-amber-300" : "text-emerald-700 dark:text-emerald-300"}>
                          {form.paymentOption === "HALF" ? "Due Now:" : "Total Amount:"}
                        </span>
                        <span className={`font-bold ${form.paymentOption === "HALF" ? "text-amber-800 dark:text-amber-200" : "text-emerald-800 dark:text-emerald-200"}`}>
                          ${dueAmount}
                        </span>
                      </div>
                      {form.paymentOption === "HALF" && (
                        <div className="flex items-center justify-between text-xs mt-1 text-amber-600 dark:text-amber-400">
                          <span>Remaining (due later):</span>
                          <span className="font-medium">${remainingAmount}</span>
                        </div>
                      )}
                    </div>
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
                          Booking...
                        </>
                      ) : (
                        <>
                          Continue to Payment
                          <FiArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              ) : step === "payment" && !success ? (
                <div className="p-6 space-y-4">
                  <div className="p-4 rounded-xl bg-gray-50 dark:bg-white/[0.03] border border-gray-200 dark:border-white/5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Session Price</span>
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-200">${sessionPrice}</span>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Payment Option</span>
                      <span className={`text-sm font-semibold ${form.paymentOption === "HALF" ? "text-violet-600 dark:text-violet-400" : "text-emerald-600 dark:text-emerald-400"}`}>
                        {form.paymentOption === "HALF" ? "Half Payment (50%)" : "Full Payment (100%)"}
                      </span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-white/5 pt-2 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-gray-700 dark:text-gray-200">Amount Due Now</span>
                        <span className="text-lg font-bold text-gray-900 dark:text-white">${dueAmount}</span>
                      </div>
                      {form.paymentOption === "HALF" && (
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-amber-600 dark:text-amber-400">Remaining due later</span>
                          <span className="text-xs font-medium text-amber-600 dark:text-amber-400">${remainingAmount}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Select Payment Method</label>
                    <div className="grid grid-cols-2 gap-2">
                      {paymentMethods.map((method) => {
                        const Icon = method.icon;
                        const selected = paymentForm.paymentMethod === method.id;
                        return (
                          <button
                            key={method.id}
                            type="button"
                            onClick={() => setPaymentForm((prev) => ({ ...prev, paymentMethod: method.id }))}
                            className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-medium transition-all duration-200 ${
                              selected
                                ? "border-blue-500 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 shadow-md shadow-blue-500/10"
                                : "border-gray-200 dark:border-white/10 bg-white dark:bg-white/[0.02] text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-white/20"
                            }`}
                          >
                            <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${method.color} flex items-center justify-center`}>
                              <Icon className="w-4 h-4 text-white" />
                            </div>
                            {method.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Transaction ID</label>
                    <input
                      type="text"
                      name="transactionId"
                      value={paymentForm.transactionId}
                      onChange={handlePaymentChange}
                      placeholder="Enter transaction ID from your payment app"
                      className="w-full px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 transition-all"
                    />
                    <p className="mt-1.5 text-xs text-gray-400 dark:text-gray-500">
                      After sending ${dueAmount} to the trainer's {paymentMethods.find((m) => m.id === paymentForm.paymentMethod)?.label || "payment"} account, enter the transaction ID here.
                    </p>
                  </div>

                  {error && (
                    <p className="text-sm text-red-500 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 rounded-xl px-4 py-2.5">{error}</p>
                  )}

                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => { setStep("booking"); setError(""); }}
                      disabled={submitting}
                      className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 transition-all disabled:opacity-50"
                    >
                      Back
                    </button>
                    <button
                      onClick={handlePaymentSubmit}
                      disabled={submitting || !paymentForm.transactionId.trim() || !paymentForm.paymentMethod}
                      className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:from-emerald-700 hover:to-green-600 shadow-md shadow-emerald-500/25 transition-all active:scale-[0.97] disabled:opacity-50 flex items-center gap-2"
                    >
                      {submitting ? (
                        <>
                          <FiLoader className="w-4 h-4 animate-spin" />
                          Submitting...
                        </>
                      ) : (
                        <>
                          <FiDollarSign className="w-4 h-4" />
                          Submit Payment (${dueAmount})
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-10 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 400, damping: 20 }} className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/10 flex items-center justify-center mx-auto mb-4 ring-4 ring-emerald-100 dark:ring-emerald-500/20">
                    <FiCheck className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />
                  </motion.div>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    {isEditing ? "Booking Updated!" : "Payment Submitted!"}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {isEditing
                      ? "Your booking has been updated successfully."
                      : "Your payment is pending verification. Please check your email for the OTP to confirm your booking."}
                  </p>
                  {form.paymentOption === "HALF" && !isEditing && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-2">
                      Remaining ${remainingAmount} is due before your session.
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}

      <OtpVerificationModal
        isOpen={showOtpModal}
        bookingId={createdBookingId}
        otpHint={otpHint}
        otpExpiresInMinutes={otpExpiresIn}
        onClose={() => setShowOtpModal(false)}
        onVerified={() => {
          setShowOtpModal(false);
          setSuccess(true);
          if (onBookingUpdated) onBookingUpdated();
          closeTimerRef.current = setTimeout(() => onClose(), 2000);
        }}
        purpose="booking-request"
      />
    </AnimatePresence>
  );
}

export default BookingModal;
