import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiUser,
  FiSearch,
  FiRefreshCw,
  FiCheck,
  FiX,
  FiCreditCard,
  FiEye,
  FiCalendar,
  FiClock,
  FiTrendingUp,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiDownload,
} from "react-icons/fi";
import { staggerContainer } from "../../lib/animations";
import { getInputClass, getSelectClass } from "../../lib/dashboardHelpers";
import PageBanner from "../../components/dashboard/PageBanner";
import StatCard from "../../components/dashboard/StatCard";
import DataTable from "../../components/dashboard/DataTable";
import CmsBadge from "../../components/dashboard/CmsBadge";
import CmsModal from "../../components/dashboard/CmsModal";
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

const statusOptions = ["PENDING", "PAID", "FAILED", "REFUNDED"];
const methodOptions = ["Cash", "Card", "bKash", "Nagad", "Bank Transfer", "Other"];

const statusBadge = (status) => {
  const map = {
    PAID: {
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-500/20",
      label: "Paid",
    },
    PENDING: {
      bg: "bg-amber-50 dark:bg-amber-500/10",
      text: "text-amber-600 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-500/20",
      label: "Pending",
    },
    FAILED: {
      bg: "bg-red-50 dark:bg-red-500/10",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-200 dark:border-red-500/20",
      label: "Failed",
    },
    REFUNDED: {
      bg: "bg-purple-50 dark:bg-purple-500/10",
      text: "text-purple-600 dark:text-purple-400",
      border: "border-purple-200 dark:border-purple-500/20",
      label: "Refunded",
    },
  };
  return map[status] || map.PENDING;
};

const emptyForm = {
  userId: "",
  amount: "",
  currency: "BDT",
  paymentMethod: "Cash",
  status: "PENDING",
  month: "",
  notes: "",
  transactionId: "",
  bookingId: "",
};

function PaymentForm({ form, setForm, errors, users }) {
  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">Member *</label>
        <div className="select-wrapper">
          <select
            value={form.userId}
            onChange={(e) => handleChange("userId", e.target.value)}
            className={getSelectClass("emerald")}
          >
            <option value="">Select member...</option>
            {users.map((u) => (
              <option key={u.id} value={u.id}>{u.firstName} {u.lastName} ({u.email})</option>
            ))}
          </select>
        </div>
        {errors.userId && <p className="text-xs text-red-500 mt-1">{errors.userId}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">Amount *</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            value={form.amount}
            onChange={(e) => handleChange("amount", e.target.value)}
            placeholder="0.00"
            className={getInputClass("emerald")}
          />
          {errors.amount && <p className="text-xs text-red-500 mt-1">{errors.amount}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">Currency</label>
          <div className="select-wrapper">
            <select
              value={form.currency}
              onChange={(e) => handleChange("currency", e.target.value)}
              className={getSelectClass("emerald")}
            >
              <option value="BDT">BDT</option>
              <option value="USD">USD</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">Payment Method</label>
          <div className="select-wrapper">
            <select
              value={form.paymentMethod}
              onChange={(e) => handleChange("paymentMethod", e.target.value)}
              className={getSelectClass("emerald")}
            >
              {methodOptions.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">Status</label>
          <div className="select-wrapper">
            <select
              value={form.status}
              onChange={(e) => handleChange("status", e.target.value)}
              className={getSelectClass("emerald")}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">Month</label>
          <input
            type="text"
            value={form.month}
            onChange={(e) => handleChange("month", e.target.value)}
            placeholder="e.g. September 2026"
            className={getInputClass("emerald")}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">Transaction ID</label>
          <input
            type="text"
            value={form.transactionId}
            onChange={(e) => handleChange("transactionId", e.target.value)}
            placeholder="Auto-generated if empty"
            className={getInputClass("emerald")}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">Notes</label>
        <textarea
          value={form.notes}
          onChange={(e) => handleChange("notes", e.target.value)}
          placeholder="Optional notes..."
          rows={3}
          className={`${getInputClass("emerald")} resize-none min-h-[80px]`}
        />
      </div>
    </div>
  );
}

function ReceiptModal({ isOpen, onClose, paymentId }) {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !paymentId) return;
    setLoading(true);
    fetch(`${API_URL}/api/v1/payment/${paymentId}/receipt`, { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => { if (data.success) setReceipt(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen, paymentId]);

  if (!isOpen) return null;

  return (
    <CmsModal isOpen={isOpen} onClose={onClose} title="Payment Receipt" size="md">
      <div className="p-6">
        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => <div key={i} className="h-12 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />)}
          </div>
        ) : receipt ? (
          <div className="space-y-4">
            <div className="text-center pb-4 border-b border-gray-100 dark:border-white/5">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Payment Receipt</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">#{receipt.receiptNumber}</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{receipt.currency} {receipt.amount?.toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400">{receipt.status}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400">Method</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{receipt.paymentMethod || "N/A"}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{receipt.date ? new Date(receipt.date).toLocaleDateString() : "N/A"}</p>
              </div>
              {receipt.month && (
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Month</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{receipt.month}</p>
                </div>
              )}
              {receipt.transactionId && (
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Transaction ID</p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white">{receipt.transactionId}</p>
                </div>
              )}
            </div>
            {receipt.member && (
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Member</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{receipt.member.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{receipt.member.email}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">Receipt not found</p>
        )}
      </div>
    </CmsModal>
  );
}

function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, revenue: 0 });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState({ open: false, payment: null });
  const [showReceipt, setShowReceipt] = useState({ open: false, id: null });
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/v1/payment/?limit=100`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const list = data.data || [];
        setPayments(list);
        const paid = list.filter((p) => p.status === "PAID");
        setStats({
          total: list.length,
          paid: paid.length,
          pending: list.filter((p) => p.status === "PENDING").length,
          revenue: paid.reduce((sum, p) => sum + (p.amount || 0), 0),
        });
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/user/?limit=200&role=MEMBER`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.data || []);
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchPayments();
    fetchUsers();
  }, [fetchPayments, fetchUsers]);

  const filtered = payments.filter((p) => {
    const matchSearch =
      p.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const validateForm = () => {
    const errs = {};
    if (!form.userId) errs.userId = "Member is required";
    if (!form.amount || parseFloat(form.amount) <= 0) errs.amount = "Amount must be greater than 0";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/payment/`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          userId: form.userId,
          amount: parseFloat(form.amount),
          currency: form.currency,
          paymentMethod: form.paymentMethod,
          status: form.status,
          month: form.month || undefined,
          notes: form.notes || undefined,
          transactionId: form.transactionId || undefined,
          bookingId: form.bookingId || undefined,
        }),
      });
      if (res.ok) {
        setShowAdd(false);
        setForm(emptyForm);
        fetchPayments();
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/payment/${selectedPayment.id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({
          amount: parseFloat(form.amount),
          currency: form.currency,
          paymentMethod: form.paymentMethod,
          status: form.status,
          month: form.month || undefined,
          notes: form.notes || undefined,
          transactionId: form.transactionId || undefined,
        }),
      });
      if (res.ok) {
        setShowEdit(false);
        setSelectedPayment(null);
        setForm(emptyForm);
        fetchPayments();
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!showDelete.payment) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/payment/${showDelete.payment.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        setShowDelete({ open: false, payment: null });
        fetchPayments();
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (payment) => {
    setSelectedPayment(payment);
    setForm({
      userId: payment.userId || "",
      amount: payment.amount || "",
      currency: payment.currency || "BDT",
      paymentMethod: payment.paymentMethod || "Cash",
      status: payment.status || "PENDING",
      month: payment.month || "",
      notes: payment.notes || "",
      transactionId: payment.transactionId || "",
      bookingId: payment.bookingId || "",
    });
    setFormErrors({});
    setShowEdit(true);
  };

  const openAdd = () => {
    setForm(emptyForm);
    setFormErrors({});
    setShowAdd(true);
  };

  const columns = [
    { key: "invoiceNumber", label: "Invoice", render: (v) => <span className="font-mono text-xs">{v || "N/A"}</span> },
    {
      key: "user",
      label: "Member",
      render: (v) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/10 flex items-center justify-center">
            <FiUser className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-sm">{v?.firstName} {v?.lastName}</span>
        </div>
      ),
    },
    { key: "month", label: "Month", render: (v) => <span className="text-sm text-gray-600 dark:text-gray-300">{v || "-"}</span> },
    { key: "amount", label: "Amount", render: (v, row) => <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{row.currency || "$"}{(v || 0).toFixed(2)}</span> },
    {
      key: "paymentMethod",
      label: "Method",
      render: (v) => (
        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
          <FiCreditCard className="w-3.5 h-3.5" />
          {v || "N/A"}
        </div>
      ),
    },
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
      render: (v) => <span className="text-sm text-gray-500 dark:text-gray-400">{v ? new Date(v).toLocaleDateString() : "N/A"}</span>,
    },
    {
      key: "actions",
      label: "",
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => { setSelectedPayment(row); setShowDetail(true); }}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            title="View"
          >
            <FiEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowReceipt({ open: true, id: row.id })}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            title="Receipt"
          >
            <FiDownload className="w-4 h-4" />
          </button>
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-400 hover:text-amber-600 dark:hover:text-amber-400"
            title="Edit"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDelete({ open: true, payment: row })}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-400 hover:text-red-600 dark:hover:text-red-400"
            title="Delete"
          >
            <FiTrash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <PageBanner pageKey="payments" icon={FiDollarSign} subtitle="Track and manage all payments" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiDollarSign} label="Total Payments" value={stats.total} color="emerald" />
        <StatCard icon={FiCheck} label="Paid" value={stats.paid} color="blue" />
        <StatCard icon={FiClock} label="Pending" value={stats.pending} color="amber" />
        <StatCard icon={FiTrendingUp} label="Revenue" value={`${stats.revenue.toFixed(2)}`} color="purple" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, invoice..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-all"
          />
        </div>
        <div className="select-wrapper">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="!pr-10 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-all"
          >
            <option value="all">All Status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <button
          onClick={fetchPayments}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
        >
          <FiRefreshCw className="w-4 h-4" /> Refresh
        </button>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:from-emerald-700 hover:to-green-600 shadow-md shadow-emerald-500/25 transition-all active:scale-[0.97]"
        >
          <FiPlus className="w-4 h-4" /> Add Payment
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} emptyMessage="No payments found" />
      )}

      {/* Detail Modal */}
      {showDetail && selectedPayment && (
        <CmsModal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Payment Details" size="md">
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Invoice</p>
                <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white">{selectedPayment.invoiceNumber || "N/A"}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">{selectedPayment.currency || "$"}{(selectedPayment.amount || 0).toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedPayment.status}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Method</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedPayment.paymentMethod || "N/A"}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Month</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedPayment.month || "N/A"}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedPayment.createdAt ? new Date(selectedPayment.createdAt).toLocaleDateString() : "N/A"}</p>
              </div>
            </div>
            {selectedPayment.transactionId && (
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Transaction ID</p>
                <p className="text-sm font-mono text-gray-900 dark:text-white">{selectedPayment.transactionId}</p>
              </div>
            )}
            {selectedPayment.user && (
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Member</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedPayment.user.firstName} {selectedPayment.user.lastName} ({selectedPayment.user.email})</p>
              </div>
            )}
            {selectedPayment.notes && (
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">{selectedPayment.notes}</p>
              </div>
            )}
          </div>
        </CmsModal>
      )}

      {/* Add Modal */}
      <CmsModal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Record Offline Payment" subtitle="Add a cash or manual payment" size="md">
        <div className="p-6">
          <PaymentForm form={form} setForm={setForm} errors={formErrors} users={users} />
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-white/5">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 transition-all">Cancel</button>
            <button onClick={handleAdd} disabled={submitting} className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:from-emerald-700 hover:to-green-600 shadow-md shadow-emerald-500/25 transition-all active:scale-[0.97] disabled:opacity-50">
              {submitting ? "Saving..." : "Record Payment"}
            </button>
          </div>
        </div>
      </CmsModal>

      {/* Edit Modal */}
      <CmsModal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Payment" size="md">
        <div className="p-6">
          <PaymentForm form={form} setForm={setForm} errors={formErrors} users={users} />
          <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-gray-100 dark:border-white/5">
            <button onClick={() => setShowEdit(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 transition-all">Cancel</button>
            <button onClick={handleEdit} disabled={submitting} className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-500 text-white hover:from-blue-700 hover:to-indigo-600 shadow-md shadow-blue-500/25 transition-all active:scale-[0.97] disabled:opacity-50">
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </CmsModal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={showDelete.open}
        onClose={() => setShowDelete({ open: false, payment: null })}
        onConfirm={handleDelete}
        title="Delete Payment"
        message={`Are you sure you want to delete this payment${showDelete.payment?.invoiceNumber ? ` (${showDelete.payment.invoiceNumber})` : ""}? This action cannot be undone.`}
        confirmText="Delete Payment"
        type="danger"
        loading={submitting}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={showReceipt.open}
        onClose={() => setShowReceipt({ open: false, id: null })}
        paymentId={showReceipt.id}
      />
    </motion.div>
  );
}

export default PaymentManagement;
