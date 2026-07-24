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
  FiArrowUpRight,
  FiArrowDownRight,
  FiEye,
  FiCalendar,
  FiClock,
  FiTrendingUp,
} from "react-icons/fi";
import { staggerContainer } from "../../lib/animations";
import PageBanner from "../../components/dashboard/PageBanner";
import StatCard from "../../components/dashboard/StatCard";
import DataTable from "../../components/dashboard/DataTable";
import CmsBadge from "../../components/dashboard/CmsBadge";
import CmsModal from "../../components/dashboard/CmsModal";

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
    COMPLETED: {
      bg: "bg-emerald-50 dark:bg-emerald-500/10",
      text: "text-emerald-600 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-500/20",
      label: "Completed",
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

function PaymentSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="h-16 bg-gray-100 dark:bg-white/5 rounded-xl animate-pulse" />
      ))}
    </div>
  );
}

function PaymentManagement() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, revenue: 0 });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/v1/payment/`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const list = data.data?.payments || data.data || [];
        setPayments(list);
        const completed = list.filter((p) => p.status === "COMPLETED");
        setStats({
          total: list.length,
          completed: completed.length,
          pending: list.filter((p) => p.status === "PENDING").length,
          revenue: completed.reduce((sum, p) => sum + (p.amount || 0), 0),
        });
      }
    } catch {
      // silently fail
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPayments();
  }, [fetchPayments]);

  const filtered = payments.filter((p) => {
    const matchSearch =
      p.user?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.user?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.method?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const columns = [
    { key: "_id", label: "Payment ID", render: (v) => <span className="font-mono text-xs">{v?.slice(-8)}</span> },
    {
      key: "user",
      label: "User",
      render: (v) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/10 flex items-center justify-center">
            <FiUser className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-sm">{v?.firstName} {v?.lastName}</span>
        </div>
      ),
    },
    {
      key: "amount",
      label: "Amount",
      render: (v) => <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">${v?.toFixed(2) || "0.00"}</span>,
    },
    {
      key: "method",
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
      render: (v) => (
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {v ? new Date(v).toLocaleDateString() : "N/A"}
        </span>
      ),
    },
    {
      key: "_id",
      label: "",
      render: (v, row) => (
        <button
          onClick={() => { setSelectedPayment(row); setShowDetail(true); }}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5 transition-colors text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
        >
          <FiEye className="w-4 h-4" />
        </button>
      ),
    },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <PageBanner pageKey="payments" icon={FiDollarSign} subtitle="Track and manage all payments" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiDollarSign} label="Total Payments" value={stats.total} color="emerald" />
        <StatCard icon={FiCheck} label="Completed" value={stats.completed} color="blue" />
        <StatCard icon={FiClock} label="Pending" value={stats.pending} color="amber" />
        <StatCard icon={FiTrendingUp} label="Revenue" value={`$${stats.revenue.toFixed(2)}`} color="purple" />
      </div>
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search payments..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-all"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 transition-all"
        >
          <option value="all">All Status</option>
          <option value="COMPLETED">Completed</option>
          <option value="PENDING">Pending</option>
          <option value="FAILED">Failed</option>
          <option value="REFUNDED">Refunded</option>
        </select>
        <button
          onClick={fetchPayments}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/10 transition-all"
        >
          <FiRefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>
      {loading ? (
        <PaymentSkeleton />
      ) : (
        <DataTable columns={columns} data={filtered} emptyMessage="No payments found" />
      )}

      {showDetail && selectedPayment && (
        <CmsModal isOpen={showDetail} onClose={() => setShowDetail(false)} title="Payment Details" size="md">
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Amount</p>
                <p className="text-lg font-bold text-gray-900 dark:text-white">${selectedPayment.amount?.toFixed(2) || "0.00"}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Status</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedPayment.status || "N/A"}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Method</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{selectedPayment.method || "N/A"}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {selectedPayment.createdAt ? new Date(selectedPayment.createdAt).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
            {selectedPayment.user && (
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">User</p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {selectedPayment.user.firstName} {selectedPayment.user.lastName} ({selectedPayment.user.email})
                </p>
              </div>
            )}
          </div>
        </CmsModal>
      )}
    </motion.div>
  );
}

export default PaymentManagement;
