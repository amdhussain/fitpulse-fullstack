import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiSearch,
  FiRefreshCw,
  FiCheck,
  FiClock,
  FiCreditCard,
  FiEye,
  FiCalendar,
  FiDownload,
  FiFileText,
} from "react-icons/fi";
import { staggerContainer } from "../../lib/animations";
import PageBanner from "../../components/dashboard/PageBanner";
import StatCard from "../../components/dashboard/StatCard";
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

function ReceiptModal({ isOpen, onClose, paymentId }) {
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen || !paymentId) return;
    setLoading(true);
    fetch(`${API_URL}/api/v1/payment/me/${paymentId}/receipt`, { headers: authHeaders() })
      .then((res) => res.json())
      .then((data) => { if (data.success) setReceipt(data.data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [isOpen, paymentId]);

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !receipt) return;
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Receipt #${receipt.receiptNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 40px; color: #1a1a2e; }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #e2e8f0; padding-bottom: 20px; }
          .header h1 { font-size: 24px; color: #0f172a; }
          .header p { color: #64748b; font-size: 14px; margin-top: 4px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
          .field { padding: 12px; background: #f8fafc; border-radius: 8px; }
          .field label { font-size: 11px; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; }
          .field p { font-size: 15px; font-weight: 600; margin-top: 4px; }
          .field.full { grid-column: 1 / -1; }
          .amount { font-size: 28px !important; color: #059669; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #94a3b8; font-size: 12px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Payment Receipt</h1>
          <p>${receipt.receiptNumber}</p>
        </div>
        <div class="grid">
          <div class="field">
            <label>Amount</label>
            <p class="amount">${receipt.currency} ${(receipt.amount || 0).toFixed(2)}</p>
          </div>
          <div class="field">
            <label>Status</label>
            <p style="color: #059669;">${receipt.status}</p>
          </div>
          <div class="field">
            <label>Payment Method</label>
            <p>${receipt.paymentMethod || "N/A"}</p>
          </div>
          <div class="field">
            <label>Date</label>
            <p>${receipt.date ? new Date(receipt.date).toLocaleDateString() : "N/A"}</p>
          </div>
          ${receipt.month ? `<div class="field"><label>Month</label><p>${receipt.month}</p></div>` : ""}
          ${receipt.transactionId ? `<div class="field"><label>Transaction ID</label><p style="font-family: monospace;">${receipt.transactionId}</p></div>` : ""}
          ${receipt.member ? `
            <div class="field full">
              <label>Member</label>
              <p>${receipt.member.name}</p>
              <p style="font-weight: 400; font-size: 13px; color: #64748b;">${receipt.member.email}</p>
            </div>
          ` : ""}
        </div>
        <div class="footer">
          <p>Thank you for your payment. This is a digitally generated receipt.</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

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
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/10 flex items-center justify-center mx-auto mb-3 ring-4 ring-emerald-100 dark:ring-emerald-500/20">
                <FiFileText className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Payment Receipt</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 font-mono">#{receipt.receiptNumber}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20">
                <p className="text-xs text-emerald-600 dark:text-emerald-400">Amount</p>
                <p className="text-xl font-bold text-emerald-700 dark:text-emerald-300">{receipt.currency} {(receipt.amount || 0).toFixed(2)}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                <p className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-1">{receipt.status}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400">Method</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{receipt.paymentMethod || "N/A"}</p>
              </div>
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{receipt.date ? new Date(receipt.date).toLocaleDateString() : "N/A"}</p>
              </div>
              {receipt.month && (
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Month</p>
                  <p className="text-sm font-medium text-gray-900 dark:text-white mt-1">{receipt.month}</p>
                </div>
              )}
              {receipt.transactionId && (
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                  <p className="text-xs text-gray-500 dark:text-gray-400">Transaction ID</p>
                  <p className="text-sm font-mono text-gray-900 dark:text-white mt-1">{receipt.transactionId}</p>
                </div>
              )}
            </div>

            {receipt.member && (
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Member Details</p>
                <p className="text-sm font-medium text-gray-900 dark:text-white">{receipt.member.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{receipt.member.email}</p>
                {receipt.member.phone && <p className="text-xs text-gray-500 dark:text-gray-400">{receipt.member.phone}</p>}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handlePrint}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:from-emerald-700 hover:to-green-600 shadow-md shadow-emerald-500/25 transition-all active:scale-[0.97]"
              >
                <FiDownload className="w-4 h-4" /> Print / Save PDF
              </button>
            </div>
          </div>
        ) : (
          <p className="text-center text-gray-500 dark:text-gray-400 py-4">Receipt not found</p>
        )}
      </div>
    </CmsModal>
  );
}

function MemberPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [stats, setStats] = useState({ total: 0, paid: 0, pending: 0, totalAmount: 0 });
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showReceipt, setShowReceipt] = useState({ open: false, id: null });

  const fetchPayments = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/v1/payment/me?limit=100`, { headers: authHeaders() });
      if (res.ok) {
        const data = await res.json();
        const list = data.data || [];
        setPayments(list);
        const paid = list.filter((p) => p.status === "PAID");
        setStats({
          total: list.length,
          paid: paid.length,
          pending: list.filter((p) => p.status === "PENDING").length,
          totalAmount: paid.reduce((sum, p) => sum + (p.amount || 0), 0),
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
      p.invoiceNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.transactionId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.month?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.paymentMethod?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <PageBanner pageKey="my-payments" icon={FiDollarSign} subtitle="View your payment history and receipts" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={FiDollarSign} label="Total Payments" value={stats.total} color="emerald" />
        <StatCard icon={FiCheck} label="Paid" value={stats.paid} color="blue" />
        <StatCard icon={FiClock} label="Pending" value={stats.pending} color="amber" />
        <StatCard icon={FiDollarSign} label="Total Paid" value={`${stats.totalAmount.toFixed(2)}`} color="purple" />
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by invoice, transaction, month..."
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
            <option value="PAID">Paid</option>
            <option value="PENDING">Pending</option>
            <option value="FAILED">Failed</option>
            <option value="REFUNDED">Refunded</option>
          </select>
        </div>
        <button
          onClick={fetchPayments}
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
          <FiDollarSign className="w-12 h-12 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400">No payments found</p>
        </div>
      ) : (
        <div className="bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-white/5">
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Invoice</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Month</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Method</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                  <th className="text-left px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                  <th className="text-right px-6 py-4 text-xs font-semibold text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-white/[0.03]">
                {filtered.map((payment) => {
                  const badge = statusBadge(payment.status);
                  const paymentId = payment.id || payment._id;
                  return (
                    <tr key={paymentId} className="hover:bg-blue-50/30 dark:hover:bg-blue-500/5 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-mono text-gray-900 dark:text-white">{payment.invoiceNumber || "N/A"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600 dark:text-gray-300">{payment.month || "-"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{payment.currency || "$"}{(payment.amount || 0).toFixed(2)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300">
                          <FiCreditCard className="w-3.5 h-3.5" />
                          {payment.paymentMethod || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.bg} ${badge.text} ${badge.border}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                          <FiCalendar className="w-3.5 h-3.5" />
                          {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => { setSelectedPayment(payment); setShowDetail(true); }}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20 transition-all"
                          >
                            <FiEye className="w-3.5 h-3.5" /> View
                          </button>
                          <button
                            onClick={() => setShowReceipt({ open: true, id: paymentId })}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-all"
                          >
                            <FiDownload className="w-3.5 h-3.5" /> Receipt
                          </button>
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
            {selectedPayment.notes && (
              <div className="p-3 rounded-xl bg-gray-50 dark:bg-white/5">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Notes</p>
                <p className="text-sm text-gray-900 dark:text-gray-100">{selectedPayment.notes}</p>
              </div>
            )}
          </div>
        </CmsModal>
      )}

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={showReceipt.open}
        onClose={() => setShowReceipt({ open: false, id: null })}
        paymentId={showReceipt.id}
      />
    </motion.div>
  );
}

export default MemberPayments;
