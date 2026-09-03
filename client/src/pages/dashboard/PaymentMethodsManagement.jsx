import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiCreditCard,
  FiSmartphone,
  FiDollarSign,
  FiActivity,
  FiEdit2,
  FiTrash2,
  FiPlus,
  FiX,
  FiRefreshCw,
  FiCheck,
  FiClock,
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

const typeConfig = {
  MOBILE_BANKING: {
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    text: "text-emerald-600 dark:text-emerald-400",
    border: "border-emerald-200 dark:border-emerald-500/20",
    icon: FiSmartphone,
    label: "Mobile Banking",
  },
  CARD: {
    bg: "bg-blue-50 dark:bg-blue-500/10",
    text: "text-blue-600 dark:text-blue-400",
    border: "border-blue-200 dark:border-blue-500/20",
    icon: FiCreditCard,
    label: "Card",
  },
  BANK_TRANSFER: {
    bg: "bg-purple-50 dark:bg-purple-500/10",
    text: "text-purple-600 dark:text-purple-400",
    border: "border-purple-200 dark:border-purple-500/20",
    icon: FiDollarSign,
    label: "Bank Transfer",
  },
  CASH: {
    bg: "bg-amber-50 dark:bg-amber-500/10",
    text: "text-amber-600 dark:text-amber-400",
    border: "border-amber-200 dark:border-amber-500/20",
    icon: FiDollarSign,
    label: "Cash",
  },
  OTHER: {
    bg: "bg-gray-50 dark:bg-gray-500/10",
    text: "text-gray-600 dark:text-gray-400",
    border: "border-gray-200 dark:border-gray-500/20",
    icon: FiDollarSign,
    label: "Other",
  },
};

const typeOptions = [
  { value: "MOBILE_BANKING", label: "Mobile Banking" },
  { value: "CARD", label: "Card" },
  { value: "BANK_TRANSFER", label: "Bank Transfer" },
  { value: "CASH", label: "Cash" },
  { value: "OTHER", label: "Other" },
];

function PaymentMethodFormModal({ isOpen, paymentMethod, onClose, onSave, saving }) {
  const [name, setName] = useState("");
  const [nameBn, setNameBn] = useState("");
  const [type, setType] = useState("MOBILE_BANKING");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [sortOrder, setSortOrder] = useState(0);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (paymentMethod) {
      setName(paymentMethod.name || "");
      setNameBn(paymentMethod.nameBn || "");
      setType(paymentMethod.type || "MOBILE_BANKING");
      setDescription(paymentMethod.description || "");
      setIsActive(paymentMethod.isActive !== undefined ? paymentMethod.isActive : true);
      setSortOrder(paymentMethod.sortOrder || 0);
    } else {
      setName("");
      setNameBn("");
      setType("MOBILE_BANKING");
      setDescription("");
      setIsActive(true);
      setSortOrder(0);
    }
    setErrors({});
  }, [paymentMethod, isOpen]);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (name.length > 100) e.name = "Name must be under 100 characters";
    if (description.length > 500) e.description = "Description must be under 500 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave({ name: name.trim(), nameBn: nameBn.trim(), type, description: description.trim(), isActive, sortOrder });
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
        aria-label={paymentMethod ? "Edit Payment Method" : "Add Payment Method"}
      >
        <div
          className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#1a2235] border border-gray-200/60 dark:border-white/[0.08] shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="px-6 py-5 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {paymentMethod ? "Edit Payment Method" : "Add Payment Method"}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {paymentMethod ? "Update payment method details" : "Create a new payment method"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bkash, Nagad, Visa"
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                  errors.name
                    ? "border-red-300 dark:border-red-500/30 focus:border-red-500"
                    : "border-gray-200 dark:border-white/10 focus:border-blue-500"
                }`}
              />
              {errors.name && (
                <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Name (Bangla)
              </label>
              <input
                type="text"
                value={nameBn}
                onChange={(e) => setNameBn(e.target.value)}
                placeholder="e.g. বিকাশ, নগদ, রকেট"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Type <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {typeOptions.map((opt) => {
                  const cfg = typeConfig[opt.value];
                  const Icon = cfg.icon;
                  const selected = type === opt.value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setType(opt.value)}
                      className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                        selected
                          ? `${cfg.bg} ${cfg.text} ${cfg.border} ring-2 ring-offset-1 ring-gray-200 dark:ring-gray-700`
                          : "bg-white dark:bg-white/[0.03] text-gray-400 dark:text-gray-500 border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20"
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{cfg.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description for this payment method"
                rows={3}
                className={`w-full px-4 py-2.5 rounded-xl border text-sm bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 resize-none ${
                  errors.description
                    ? "border-red-300 dark:border-red-500/30 focus:border-red-500"
                    : "border-gray-200 dark:border-white/10 focus:border-blue-500"
                }`}
              />
              {errors.description && (
                <p className="mt-1.5 text-xs text-red-500 dark:text-red-400">{errors.description}</p>
              )}
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                <button
                  type="button"
                  onClick={() => setIsActive(!isActive)}
                  className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
                    isActive ? "bg-emerald-500" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                      isActive ? "translate-x-5" : ""
                    }`}
                  />
                </button>
                <span className={`text-sm font-medium ${isActive ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400 dark:text-gray-500"}`}>
                  {isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={sortOrder}
                  onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                  className="w-20 px-3 py-2 rounded-xl border border-gray-200 dark:border-white/10 text-sm bg-white dark:bg-white/[0.03] text-gray-900 dark:text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
              </div>
            </div>
          </form>

          <div className="px-6 py-4 bg-gray-50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5 flex items-center justify-end gap-3">
            <button
              onClick={onClose}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 transition-all duration-200 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-500 text-white hover:from-blue-700 hover:to-indigo-600 shadow-md shadow-blue-500/25 transition-all duration-200 active:scale-[0.97] disabled:opacity-50"
            >
              {saving ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Saving...
                </span>
              ) : paymentMethod ? (
                "Save Changes"
              ) : (
                "Create Method"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </>
  );
}

function PaymentMethodsManagement() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState(null);
  const [stats, setStats] = useState({ total: 0, active: 0, inactive: 0 });

  const [showForm, setShowForm] = useState(false);
  const [editMethod, setEditMethod] = useState(null);
  const [saving, setSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchPaymentMethods = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/payment-methods?limit=100`, {
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to fetch payment methods");
      const methods = (data.data || []).map((m) => ({
        id: m.id,
        name: m.name,
        nameBn: m.nameBn,
        type: m.type,
        description: m.description,
        icon: m.icon,
        isActive: m.isActive,
        sortOrder: m.sortOrder,
        createdAt: m.createdAt,
        updatedAt: m.updatedAt,
      }));
      setPaymentMethods(methods);
      setStats({
        total: methods.length,
        active: methods.filter((m) => m.isActive).length,
        inactive: methods.filter((m) => !m.isActive).length,
      });
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  const handleCreate = async (formData) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/payment-methods`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to create payment method");
      await fetchPaymentMethods();
      setFeedback({ type: "success", message: "Payment method created successfully" });
      setTimeout(() => setFeedback(null), 3000);
      setShowForm(false);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (formData) => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/payment-methods/${editMethod.id}`, {
        method: "PUT",
        headers: authHeaders(),
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update payment method");
      await fetchPaymentMethods();
      setFeedback({ type: "success", message: "Payment method updated successfully" });
      setTimeout(() => setFeedback(null), 3000);
      setEditMethod(null);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    setDeleting(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/payment-methods/${id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete payment method");
      await fetchPaymentMethods();
      setFeedback({ type: "success", message: "Payment method deleted successfully" });
      setTimeout(() => setFeedback(null), 3000);
    } catch (err) {
      setFeedback({ type: "error", message: err.message });
      setTimeout(() => setFeedback(null), 4000);
    } finally {
      setDeleting(false);
      setConfirmDelete(null);
    }
  };

  const columns = [
    {
      key: "name",
      label: "Payment Method",
      render: (_, item) => (
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${typeConfig[item.type]?.bg || typeConfig.OTHER.bg}`}>
            {(() => {
              const Icon = typeConfig[item.type]?.icon || FiDollarSign;
              return <Icon className={`w-5 h-5 ${typeConfig[item.type]?.text || typeConfig.OTHER.text}`} />;
            })()}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-100 truncate">{item.name}</p>
            {item.nameBn && (
              <p className="text-xs text-gray-400 dark:text-gray-500 truncate">{item.nameBn}</p>
            )}
          </div>
        </div>
      ),
    },
    {
      key: "type",
      label: "Type",
      render: (val) => {
        const cfg = typeConfig[val] || typeConfig.OTHER;
        const Icon = cfg.icon;
        return (
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
            <Icon className="w-3 h-3" />
            {cfg.label}
          </span>
        );
      },
    },
    {
      key: "description",
      label: "Description",
      render: (val) => (
        <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px] block">
          {val || "No description"}
        </span>
      ),
    },
    {
      key: "isActive",
      label: "Status",
      render: (val) => (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${
            val
              ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
              : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20"
          }`}
        >
          {val ? <FiCheck className="w-3 h-3" /> : <FiClock className="w-3 h-3" />}
          {val ? "Active" : "Inactive"}
        </span>
      ),
    },
    {
      key: "sortOrder",
      label: "Order",
      render: (val) => (
        <span className="text-xs text-gray-500 dark:text-gray-400 font-mono">#{val}</span>
      ),
    },
  ];

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageBanner
        pageKey="payment-methods"
        icon={FiCreditCard}
        subtitle="Manage available payment methods for customers"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FiCreditCard}
          label="Total Methods"
          value={stats.total}
          pageKey="payment-methods"
          index={0}
        />
        <StatCard
          icon={FiCheck}
          label="Active"
          value={stats.active}
          pageKey="payment-methods"
          index={1}
        />
        <StatCard
          icon={FiClock}
          label="Inactive"
          value={stats.inactive}
          pageKey="payment-methods"
          index={2}
        />
        <StatCard
          icon={FiActivity}
          label="Categories"
          value={new Set(paymentMethods.map((m) => m.type)).size}
          pageKey="payment-methods"
          index={3}
        />
      </div>

      {feedback && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`p-3 rounded-xl text-sm font-medium border ${
            feedback.type === "success"
              ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400"
          }`}
        >
          {feedback.message}
        </motion.div>
      )}

      <DataTable
        data={paymentMethods}
        columns={columns}
        accent="emerald"
        searchPlaceholder="Search payment methods..."
        searchKey="name"
        filterOptions={typeOptions.map((o) => ({ value: o.value, label: o.label }))}
        filterKey="type"
        rowsPerPage={8}
        loading={loading}
        onRefresh={fetchPaymentMethods}
        addAction={() => setShowForm(true)}
        addLabel="Add Method"
        actions={(item) => (
          <div className="flex items-center gap-1">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setEditMethod(item);
              }}
              className="p-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-500/10 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Edit payment method"
              aria-label={`Edit ${item.name}`}
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(item);
              }}
              className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              title="Delete payment method"
              aria-label={`Delete ${item.name}`}
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />

      <PaymentMethodFormModal
        isOpen={showForm || !!editMethod}
        paymentMethod={editMethod}
        onClose={() => {
          setShowForm(false);
          setEditMethod(null);
        }}
        onSave={editMethod ? handleUpdate : handleCreate}
        saving={saving}
      />

      <ConfirmModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={() => handleDelete(confirmDelete?.id)}
        title="Delete Payment Method"
        message={`Are you sure you want to delete "${confirmDelete?.name}"? This action cannot be undone.`}
        confirmText="Delete Method"
        type="danger"
        loading={deleting}
      />
    </motion.div>
  );
}

export default PaymentMethodsManagement;
