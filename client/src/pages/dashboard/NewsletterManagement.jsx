import { useState } from "react";
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
  FiEye,
  FiDownload,
} from "react-icons/fi";
import { staggerContainer } from "../../lib/animations";
import PageBanner from "../../components/dashboard/PageBanner";
import StatCard from "../../components/dashboard/StatCard";
import DataTable from "../../components/dashboard/DataTable";
import CmsModal from "../../components/dashboard/CmsModal";
import CmsBadge from "../../components/dashboard/CmsBadge";
import { getInputClass } from "../../lib/dashboardHelpers";

const placeholderSubscribers = [
  { id: 1, email: "alice@example.com", name: "Alice Johnson", status: "active", subscribedAt: "2025-01-10", source: "Website" },
  { id: 2, email: "bob@example.com", name: "Bob Smith", status: "active", subscribedAt: "2025-01-12", source: "Popup" },
  { id: 3, email: "carol@example.com", name: "Carol Williams", status: "unsubscribed", subscribedAt: "2025-01-08", source: "Website" },
  { id: 4, email: "david@example.com", name: "David Brown", status: "active", subscribedAt: "2025-01-14", source: "Form" },
  { id: 5, email: "emma@example.com", name: "Emma Davis", status: "active", subscribedAt: "2025-01-15", source: "Website" },
];

function NewsletterManagement() {
  const [subscribers, setSubscribers] = useState(placeholderSubscribers);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCompose, setShowCompose] = useState(false);
  const [composeData, setComposeData] = useState({ subject: "", message: "" });
  const [sending, setSending] = useState(false);

  const stats = {
    total: subscribers.length,
    active: subscribers.filter((s) => s.status === "active").length,
    unsubscribed: subscribers.filter((s) => s.status === "unsubscribed").length,
  };

  const filtered = subscribers.filter(
    (s) =>
      s.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSend = async () => {
    setSending(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSending(false);
    setShowCompose(false);
    setComposeData({ subject: "", message: "" });
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
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{v}</p>
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
          v === "active"
            ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20"
            : "bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/20"
        }`}>
          {v === "active" ? "Active" : "Unsubscribed"}
        </span>
      ),
    },
    { key: "source", label: "Source", render: (v) => <span className="text-sm text-gray-600 dark:text-gray-300">{v}</span> },
    {
      key: "subscribedAt",
      label: "Subscribed",
      render: (v) => <span className="text-sm text-gray-500 dark:text-gray-400">{v}</span>,
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
            placeholder="Search subscribers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/15 transition-all"
          />
        </div>
        <button
          onClick={() => setShowCompose(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-medium hover:from-rose-600 hover:to-pink-700 transition-all shadow-lg shadow-rose-500/25"
        >
          <FiSend className="w-4 h-4" /> Compose Campaign
        </button>
      </div>
      <DataTable columns={columns} data={filtered} emptyMessage="No subscribers found" />

      {showCompose && (
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
                onClick={handleSend}
                disabled={sending || !composeData.subject || !composeData.message}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-sm font-medium hover:from-rose-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-rose-500/25"
              >
                <FiSend className="w-4 h-4" />
                {sending ? "Sending..." : "Send Campaign"}
              </button>
            </div>
          </div>
        </CmsModal>
      )}
    </motion.div>
  );
}

export default NewsletterManagement;
