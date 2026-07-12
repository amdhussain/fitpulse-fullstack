import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiEye,
  FiTrash2,
  FiMail,
  FiUser,
  FiMessageSquare,
  FiClock,
  FiSend,
  FiPhone,
  FiCalendar,
  FiCheck,
  FiArrowRight,
  FiAlertCircle,
  FiCheckCircle,
  FiArchive,
} from "react-icons/fi";
import { Button, SavedBadge } from "../../components/ui";
import { staggerContainer } from "../../lib/animations";
import PageBanner from "../../components/dashboard/PageBanner";
import StatCard from "../../components/dashboard/StatCard";
import DataTable from "../../components/dashboard/DataTable";
import CmsModal from "../../components/dashboard/CmsModal";
import CmsBadge from "../../components/dashboard/CmsBadge";
import { getInputClass } from "../../lib/dashboardHelpers";

const getMessages = () => [
  {
    id: 1,
    name: "Robert Wilson",
    email: "robert@email.com",
    phone: "+1 (555) 111-2222",
    subject: "Membership Inquiry",
    message:
      "Hi, I'd like to know more about your premium membership plan and the benefits included. I've been looking for a gym that offers comprehensive membership options with added perks like personal training consultations and nutrition guidance. Could you please share the details of your premium tier? Specifically, I'm interested in the monthly cost, cancellation policy, and any current promotions you might have running.",
    date: "2025-01-15",
    status: "unread",
    updatedAt: "2 min ago",
  },
  {
    id: 2,
    name: "Maria Garcia",
    email: "maria@email.com",
    phone: "+1 (555) 222-3333",
    subject: "Class Schedule",
    message:
      "Could you send me the updated yoga class schedule for this month? I'm particularly interested in beginner-level classes on weekday evenings. Also, do you offer any introductory packages for new students?",
    date: "2025-01-15",
    status: "unread",
    updatedAt: "1 hour ago",
  },
  {
    id: 3,
    name: "James Lee",
    email: "james@email.com",
    phone: "+1 (555) 333-4444",
    subject: "Personal Training",
    message:
      "I'm interested in personal training sessions. What are the rates and available time slots? I'm looking for a certified trainer who specializes in strength training and mobility work. I have about 3 years of gym experience and want to take my training to the next level.",
    date: "2025-01-14",
    status: "read",
    updatedAt: "3 hours ago",
  },
  {
    id: 4,
    name: "Sarah Johnson",
    email: "sarah@email.com",
    phone: "+1 (555) 444-5555",
    subject: "Facility Tour",
    message:
      "I'd love to schedule a tour of your facility before signing up. When are you available? I work nearby and can visit during lunch hours on weekdays. I'm especially interested in seeing the group fitness studio and the recovery zone.",
    date: "2025-01-13",
    status: "replied",
    updatedAt: "1 day ago",
  },
  {
    id: 5,
    name: "Mike Chen",
    email: "mike@email.com",
    phone: "+1 (555) 555-6666",
    subject: "Group Classes",
    message:
      "Do you offer group classes for beginners? I'm new to fitness and looking for a supportive environment. I've never been to a gym before and I'm a bit nervous about starting. Are there any orientation sessions or welcome programs for first-timers?",
    date: "2025-01-12",
    status: "read",
    updatedAt: "2 days ago",
  },
  {
    id: 6,
    name: "Emily Davis",
    email: "emily@email.com",
    phone: "+1 (555) 666-7777",
    subject: "Nutrition Program",
    message:
      "I'm interested in your nutrition coaching program. Do you offer meal planning? I have some dietary restrictions (gluten-free) and would love to work with a nutritionist who can help me create a balanced plan that complements my workout routine.",
    date: "2025-01-11",
    status: "replied",
    updatedAt: "3 days ago",
  },
  {
    id: 7,
    name: "David Brown",
    email: "david@email.com",
    phone: "+1 (555) 777-8888",
    subject: "Corporate Membership",
    message:
      "We're looking for corporate membership options for our team of 15 employees. We'd like to promote workplace wellness and are interested in group rates, dedicated class bookings, and any wellness challenges your gym organizes. Could you send over a corporate proposal?",
    date: "2025-01-10",
    status: "unread",
    updatedAt: "5 days ago",
  },
  {
    id: 8,
    name: "Lisa Anderson",
    email: "lisa@email.com",
    phone: "+1 (555) 888-9999",
    subject: "Equipment Inquiry",
    message:
      "What brand of equipment do you use? I'm particularly interested in the cardio section. I'm coming from another gym that had mostly Technogym machines and I want to make sure the transition will be smooth. Also, how often do you maintain and update your equipment?",
    date: "2025-01-09",
    status: "archived",
    updatedAt: "1 week ago",
  },
];

const getStats = (msgs) => ({
  total: msgs.length,
  unread: msgs.filter((m) => m.status === "unread").length,
  replied: msgs.filter((m) => m.status === "replied").length,
  pending: msgs.filter((m) => m.status === "read").length,
});

const statusBadgeProps = (status) => {
  const map = {
    unread: { status: "draft", label: "Unread" },
    read: { status: "active", label: "Read" },
    replied: { status: "featured", label: "Replied" },
    archived: { status: "inactive", label: "Archived" },
  };
  return map[status] || { status: "active", label: status };
};

const statusOptions = [
  { value: "unread", label: "Unread", icon: FiAlertCircle },
  { value: "read", label: "Mark as Read", icon: FiCheckCircle },
  { value: "replied", label: "Mark as Replied", icon: FiCheck },
  { value: "archived", label: "Archive", icon: FiArchive },
];

function ContactManagement() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ reply: "" });
  const [saved, setSaved] = useState(false);
  const [viewItem, setViewItem] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const inputClass = getInputClass("red");
  const stats = getStats(messages);

  useEffect(() => {
    const timer = setTimeout(() => {
      setMessages(getMessages());
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = (id) => {
    setMessages((prev) => prev.filter((m) => m.id !== id));
    setConfirmDelete(null);
    if (viewItem?.id === id) {
      setViewItem(null);
    }
  };

  const handleMarkAsRead = (id) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id && m.status === "unread" ? { ...m, status: "read" } : m
      )
    );
  };

  const handleStatusChange = (id, newStatus) => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === id ? { ...m, status: newStatus, updatedAt: "Just now" } : m
      )
    );
    setViewItem((prev) =>
      prev
        ? { ...prev, status: newStatus, updatedAt: "Just now" }
        : null
    );
  };

  const handleReply = (e) => {
    e.preventDefault();
    if (!form.reply.trim() || !viewItem) return;
    setMessages((prev) =>
      prev.map((m) =>
        m.id === viewItem.id
          ? { ...m, status: "replied", updatedAt: "Just now" }
          : m
      )
    );
    setViewItem((prev) =>
      prev ? { ...prev, status: "replied", updatedAt: "Just now" } : null
    );
    setForm({ reply: "" });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleMarkAllRead = () => {
    setMessages((prev) =>
      prev.map((m) =>
        m.status === "unread" ? { ...m, status: "read" } : m
      )
    );
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const columns = [
    {
      key: "name",
      label: "Contact",
      render: (_, item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
            <FiUser className="w-4 h-4 text-red-400/60" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="font-medium text-white/80">{item.name}</p>
              {item.status === "unread" && (
                <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
              )}
            </div>
            <p className="text-xs text-white/30 truncate">{item.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "subject",
      label: "Subject",
      render: (_, item) => (
        <div className="min-w-0">
          <p className="font-medium text-white/70">{item.subject}</p>
          <p className="text-xs text-white/30 truncate max-w-[200px]">
            {item.message}
          </p>
        </div>
      ),
    },
    {
      key: "date",
      label: "Date",
      render: (val) => (
        <div className="flex items-center gap-1.5 text-white/40">
          <FiClock className="w-3 h-3 shrink-0" />
          <span className="text-xs">{formatDate(val)}</span>
        </div>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (val) => {
        const badge = statusBadgeProps(val);
        return <CmsBadge status={badge.status} label={badge.label} />;
      },
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
        pageKey="contact"
        subtitle="Manage contact form submissions"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={FiMail}
          label="Total Messages"
          value={stats.total}
          pageKey="contact"
          index={0}
        />
        <StatCard
          icon={FiMessageSquare}
          label="Unread Messages"
          value={stats.unread}
          pageKey="contact"
          index={1}
        />
        <StatCard
          icon={FiSend}
          label="Replied"
          value={stats.replied}
          pageKey="contact"
          index={2}
        />
        <StatCard
          icon={FiClock}
          label="Pending"
          value={stats.pending}
          pageKey="contact"
          index={3}
        />
      </div>

      <div className="flex items-center justify-between">
        {stats.unread > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/15 transition-colors"
          >
            <FiCheck className="w-3.5 h-3.5" />
            Mark All as Read ({stats.unread})
          </button>
        )}
      </div>

      <DataTable
        data={messages}
        columns={columns}
        accent="red"
        searchPlaceholder="Search messages..."
        searchKey="name"
        filterOptions={[
          { value: "unread", label: "Unread" },
          { value: "read", label: "Read" },
          { value: "replied", label: "Replied" },
          { value: "archived", label: "Archived" },
        ]}
        filterKey="status"
        rowsPerPage={5}
        loading={loading}
        actions={(item) => (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleMarkAsRead(item.id);
                setViewItem(item);
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-red-400 transition-colors"
              aria-label={`View message from ${item.name}`}
            >
              <FiEye className="w-4 h-4" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setConfirmDelete(item);
              }}
              className="p-2 rounded-lg hover:bg-white/5 text-white/30 hover:text-red-400 transition-colors"
              aria-label={`Delete message from ${item.name}`}
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </>
        )}
      />

      <CmsModal
        isOpen={!!viewItem}
        onClose={() => {
          setViewItem(null);
          setForm({ reply: "" });
        }}
        title="Message Details"
        subtitle={viewItem?.subject}
        size="lg"
      >
        {viewItem && (
          <div className="space-y-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
              <div className="w-14 h-14 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                <FiUser className="w-6 h-6 text-red-400/60" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-bold text-white">
                    {viewItem.name}
                  </h3>
                  <CmsBadge
                    status={statusBadgeProps(viewItem.status).status}
                    label={statusBadgeProps(viewItem.status).label}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-2">
                  <div className="flex items-center gap-1.5 text-sm text-white/40">
                    <FiMail className="w-3.5 h-3.5 text-red-400/50" />
                    <span>{viewItem.email}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-white/40">
                    <FiPhone className="w-3.5 h-3.5 text-red-400/50" />
                    <span>{viewItem.phone}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-white/40">
                    <FiCalendar className="w-3.5 h-3.5 text-red-400/50" />
                    <span>{formatDate(viewItem.date)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {statusOptions.map((opt) => {
                const Icon = opt.icon;
                const isActive = viewItem.status === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() =>
                      handleStatusChange(viewItem.id, opt.value)
                    }
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border text-xs font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-red-500/15 border-red-500/30 text-red-400"
                        : "bg-white/[0.02] border-white/5 text-white/40 hover:border-red-500/20 hover:text-white/60"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiMessageSquare className="w-4 h-4 text-red-400/60" />
                  <h4 className="text-sm font-semibold text-white/70">
                    {viewItem.subject}
                  </h4>
                </div>
                <span className="text-xs text-white/25">
                  {viewItem.updatedAt}
                </span>
              </div>
              <div className="rounded-xl border border-red-500/10 bg-[#0f0f15] p-5">
                <p className="text-sm text-white/50 leading-relaxed whitespace-pre-line">
                  {viewItem.message}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <FiSend className="w-4 h-4 text-red-400/60" />
                <h4 className="text-sm font-semibold text-white/70">
                  Quick Reply
                </h4>
              </div>
              <form onSubmit={handleReply} className="space-y-3">
                <textarea
                  value={form.reply}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, reply: e.target.value }))
                  }
                  rows={4}
                  placeholder="Type your reply here..."
                  className={`${inputClass} resize-none`}
                />
                <div className="flex items-center gap-3">
                  <Button type="submit" variant="red" size="sm">
                    <FiSend className="w-3.5 h-3.5" />
                    Send Reply
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setForm({ reply: "" })}
                  >
                    Clear
                  </Button>
                  <SavedBadge show={saved} />
                </div>
              </form>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="flex items-center gap-2 text-xs text-white/20">
                <FiArrowRight className="w-3 h-3" />
                <span>
                  Replying as admin · Response will be sent to{" "}
                  {viewItem.email}
                </span>
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  setViewItem(null);
                  setForm({ reply: "" });
                }}
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </CmsModal>

      <CmsModal
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        title="Delete Message"
        subtitle="This action cannot be undone"
        size="sm"
      >
        {confirmDelete && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <FiTrash2 className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-sm font-medium text-white/80">
                  Delete message from {confirmDelete.name}?
                </p>
                <p className="text-xs text-white/40 mt-0.5">
                  Subject: {confirmDelete.subject}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                variant="red"
                size="sm"
                onClick={() => handleDelete(confirmDelete.id)}
              >
                <FiTrash2 className="w-3.5 h-3.5" />
                Delete
              </Button>
            </div>
          </div>
        )}
      </CmsModal>
    </motion.div>
  );
}

export default ContactManagement;
