import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiMail,
  FiSend,
  FiUsers,
  FiClock,
  FiSearch,
  FiTrash2,
  FiPlus,
  FiCheck,
  FiAlertCircle,
  FiRefreshCw,
  FiToggleLeft,
  FiToggleRight,
  FiEdit2,
} from "react-icons/fi";
import { staggerContainer } from "../../lib/animations";
import { getInputClass, getSelectClass } from "../../lib/dashboardHelpers";
import PageBanner from "../../components/dashboard/PageBanner";
import StatCard from "../../components/dashboard/StatCard";
import DataTable from "../../components/dashboard/DataTable";
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

const emptyForm = { email: "", name: "", source: "Manual" };

function NewsletterManagement() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({ total: 0, active: 0, unsubscribed: 0 });
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState({ open: false, subscriber: null });
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({ subject: "", message: "" });
  const [form, setForm] = useState(emptyForm);
  const [formErrors, setFormErrors] = useState({});
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchSubscribers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/v1/newsletter/?limit=100`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setSubscribers(data.data || []);
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/newsletter/stats`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        setStats(data.data || { total: 0, active: 0, unsubscribed: 0 });
      }
    } catch {
      // silently fail
    }
  }, []);

  useEffect(() => {
    fetchSubscribers();
    fetchStats();
  }, [fetchSubscribers, fetchStats]);

  const filtered = subscribers.filter((s) => {
    const matchSearch =
      s.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || s.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const validateForm = () => {
    const errs = {};
    if (!form.email.trim()) errs.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) errs.email = "Invalid email format";
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleAdd = async () => {
    if (!validateForm()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/newsletter/`, {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({ email: form.email.trim(), name: form.name.trim() || undefined, source: form.source }),
      });
      if (res.ok) {
        setShowAdd(false);
        setForm(emptyForm);
        fetchSubscribers();
        fetchStats();
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/newsletter/${selected.id}`, {
        method: "PATCH",
        headers: authHeaders(),
        body: JSON.stringify({ email: form.email.trim(), name: form.name.trim() || undefined }),
      });
      if (res.ok) {
        setShowEdit(false);
        setSelected(null);
        setForm(emptyForm);
        fetchSubscribers();
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggle = async (subscriber) => {
    try {
      const res = await fetch(`${API_URL}/api/v1/newsletter/${subscriber.id}/toggle`, {
        method: "PATCH",
        headers: authHeaders(),
      });
      if (res.ok) {
        fetchSubscribers();
        fetchStats();
      }
    } catch {
      // silently fail
    }
  };

  const handleDelete = async () => {
    if (!showDelete.subscriber) return;
    setSubmitting(true);
    try {
      const res = await fetch(`${API_URL}/api/v1/newsletter/${showDelete.subscriber.id}`, {
        method: "DELETE",
        headers: authHeaders(),
      });
      if (res.ok) {
        setShowDelete({ open: false, subscriber: null });
        fetchSubscribers();
        fetchStats();
      }
    } catch {
      // silently fail
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (subscriber) => {
    setSelected(subscriber);
    setForm({ email: subscriber.email, name: subscriber.name || "", source: subscriber.source || "Manual" });
    setFormErrors({});
    setShowEdit(true);
  };

  const openAdd = () => {
    setForm(emptyForm);
    setFormErrors({});
    setShowAdd(true);
  };

  const columns = [
    {
      key: "name",
      label: "Subscriber",
      render: (v, row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-500/20 dark:to-pink-500/10 flex items-center justify-center">
            <FiMail className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{v || "No Name"}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (v) => (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
          v === "ACTIVE"
            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
            : "bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/20"
        }`}>
          {v === "ACTIVE" ? "Active" : "Unsubscribed"}
        </span>
      ),
    },
    { key: "source", label: "Source", render: (v) => <span className="text-sm text-gray-600 dark:text-gray-300">{v || "-"}</span> },
    {
      key: "subscribedAt",
      label: "Subscribed",
      render: (v) => <span className="text-sm text-gray-500 dark:text-gray-400">{v ? new Date(v).toLocaleDateString() : "-"}</span>,
    },
    {
      key: "actions",
      label: "",
      render: (_, row) => (
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleToggle(row)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400"
            title={row.status === "ACTIVE" ? "Unsubscribe" : "Resubscribe"}
          >
            {row.status === "ACTIVE" ? <FiToggleRight className="w-5 h-5 text-emerald-500" /> : <FiToggleLeft className="w-5 h-5" />}
          </button>
          <button
            onClick={() => openEdit(row)}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-400 hover:text-amber-600 dark:hover:text-amber-400"
            title="Edit"
          >
            <FiEdit2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowDelete({ open: true, subscriber: row })}
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
      <PageBanner pageKey="newsletter" icon={FiMail} subtitle="Manage newsletter subscribers and campaigns" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard icon={FiUsers} label="Total Subscribers" value={stats.total} color="rose" />
        <StatCard icon={FiCheck} label="Active" value={stats.active} color="emerald" />
        <StatCard icon={FiAlertCircle} label="Unsubscribed" value={stats.unsubscribed} color="gray" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 transition-all"
          />
        </div>
        <div className="select-wrapper">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="!pr-10 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 transition-all"
          >
            <option value="all">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="UNSUBSCRIBED">Unsubscribed</option>
          </select>
        </div>
        <button
          onClick={() => { fetchSubscribers(); fetchStats(); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
        >
          <FiRefreshCw className="w-4 h-4" /> Refresh
        </button>
        <button
          onClick={openAdd}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 shadow-md shadow-rose-500/25 transition-all active:scale-[0.97]"
        >
          <FiPlus className="w-4 h-4" /> Add Subscriber
        </button>
        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 shadow-md shadow-rose-500/25 transition-all active:scale-[0.97]"
        >
          <FiSend className="w-4 h-4" /> Compose
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <DataTable columns={columns} data={filtered} emptyMessage="No subscribers found" />
      )}

      {/* Add Modal */}
      <CmsModal isOpen={showAdd} onClose={() => setShowAdd(false)} title="Add Subscriber" size="md">
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="subscriber@example.com"
              className={getInputClass("rose")}
            />
            {formErrors.email && <p className="text-xs text-red-500 mt-1">{formErrors.email}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Optional name"
              className={getInputClass("rose")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">Source</label>
            <div className="select-wrapper">
              <select
                value={form.source}
                onChange={(e) => setForm({ ...form, source: e.target.value })}
                className={getSelectClass("rose")}
              >
                <option value="Manual">Manual</option>
                <option value="Website">Website</option>
                <option value="Popup">Popup</option>
                <option value="Form">Form</option>
                <option value="Import">Import</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
            <button onClick={() => setShowAdd(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 transition-all">Cancel</button>
            <button onClick={handleAdd} disabled={submitting} className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 shadow-md shadow-rose-500/25 transition-all active:scale-[0.97] disabled:opacity-50">
              {submitting ? "Adding..." : "Add Subscriber"}
            </button>
          </div>
        </div>
      </CmsModal>

      {/* Edit Modal */}
      <CmsModal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Subscriber" size="md">
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">Email *</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={getInputClass("rose")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1.5">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Optional name"
              className={getInputClass("rose")}
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-white/5">
            <button onClick={() => setShowEdit(false)} className="px-4 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-white/5 border border-gray-200 dark:border-white/10 transition-all">Cancel</button>
            <button onClick={handleEdit} disabled={submitting} className="px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-rose-500 to-pink-600 text-white hover:from-rose-600 hover:to-pink-700 shadow-md shadow-rose-500/25 transition-all active:scale-[0.97] disabled:opacity-50">
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </CmsModal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={showDelete.open}
        onClose={() => setShowDelete({ open: false, subscriber: null })}
        onConfirm={handleDelete}
        title="Delete Subscriber"
        message={`Are you sure you want to permanently remove ${showDelete.subscriber?.email || "this subscriber"}? This action cannot be undone.`}
        confirmText="Delete Subscriber"
        type="danger"
        loading={submitting}
      />

      {/* Compose Campaign Modal */}
      <CmsModal isOpen={showCompose} onClose={() => setShowCompose(false)} title="Compose Newsletter Campaign" size="lg">
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Subject</label>
            <input
              type="text"
              value={composeData.subject}
              onChange={(e) => setComposeData({ ...composeData, subject: e.target.value })}
              placeholder="Enter campaign subject..."
              className={getInputClass("rose")}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Message</label>
            <textarea
              value={composeData.message}
              onChange={(e) => setComposeData({ ...composeData, message: e.target.value })}
              placeholder="Write your newsletter content..."
              rows={8}
              className={`${getInputClass("rose")} resize-none`}
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              onClick={() => setShowCompose(false)}
              className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 transition-all"
            >
              Cancel
            </button>
            <button
              disabled={!composeData.subject || !composeData.message}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-medium hover:from-rose-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-rose-500/25"
            >
              <FiSend className="w-4 h-4" /> Send Campaign
            </button>
          </div>
        </div>
      </CmsModal>
    </motion.div>
  );
}

export default NewsletterManagement;
