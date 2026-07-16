import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBell,
  FiCheck,
  FiCheckCircle,
  FiCalendar,
  FiCreditCard,
  FiMessageSquare,
  FiSettings,
  FiEye,
  FiTrash2,
  FiClock,
  FiX,
  FiInfo,
} from "react-icons/fi";
import { Button, Skeleton } from "../../components/ui";
import { staggerContainer, fadeUp } from "../../lib/animations";
import { PageBanner, StatCard } from "../../components/dashboard";
import {
  getNotifications,
  getNotificationStats,
} from "../../lib/notificationsData";

const typeIcons = {
  booking: FiCalendar,
  membership: FiCreditCard,
  message: FiMessageSquare,
  system: FiSettings,
};

const typeColors = {
  booking: {
    bg: "bg-blue-50",
    text: "text-blue-600",
    border: "border-blue-200",
    dot: "bg-blue-500",
    glow: "shadow-blue-500/10",
  },
  membership: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    border: "border-amber-200",
    dot: "bg-amber-500",
    glow: "shadow-amber-500/10",
  },
  message: {
    bg: "bg-emerald-50",
    text: "text-emerald-600",
    border: "border-emerald-200",
    dot: "bg-emerald-500",
    glow: "shadow-emerald-500/10",
  },
  system: {
    bg: "bg-purple-50",
    text: "text-purple-600",
    border: "border-purple-200",
    dot: "bg-purple-500",
    glow: "shadow-purple-500/10",
  },
};

const typeLabels = {
  booking: "Booking",
  membership: "Membership",
  message: "Message",
  system: "System",
};

const tabs = [
  { key: "all", label: "All" },
  { key: "unread", label: "Unread" },
  { key: "booking", label: "Bookings" },
  { key: "membership", label: "Membership" },
  { key: "message", label: "Messages" },
  { key: "system", label: "System" },
];

function NotificationSkeleton({ index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="flex items-start gap-4 p-4 sm:p-5 border-b border-gray-50 last:border-b-0"
    >
      <Skeleton className="w-11 h-11 rounded-xl flex-shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-2/5 rounded-lg" />
          <Skeleton className="h-5 w-16 rounded-full" />
        </div>
        <Skeleton className="h-3.5 w-4/5 rounded-lg" />
        <div className="flex items-center gap-3 pt-1">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-3 w-24 rounded-lg" />
        </div>
      </div>
      <div className="flex-shrink-0 space-y-2 opacity-0">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-8 h-8 rounded-lg" />
      </div>
    </motion.div>
  );
}

function TypeBadge({ type }) {
  const colors = typeColors[type] || {
    bg: "bg-gray-50",
    text: "text-gray-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${colors.bg} ${colors.text}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${typeColors[type]?.dot || "bg-gray-400"}`}
      />
      {typeLabels[type] || type}
    </span>
  );
}

function EmptyState({ activeTab }) {
  const messages = {
    all: "Notifications will appear here when there's activity on your platform.",
    unread: "You're all caught up! No unread notifications remaining.",
    booking:
      "No booking notifications at the moment. They'll show up when members make or modify reservations.",
    membership:
      "No membership notifications yet. Updates about sign-ups, renewals, and plan changes will appear here.",
    message:
      "No message notifications right now. New messages from members and staff will be listed here.",
    system:
      "No system notifications. Platform alerts, maintenance notices, and updates will surface here.",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-24 gap-6"
    >
      <div className="relative">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-50 to-cyan-50/50 flex items-center justify-center border border-blue-100">
          <FiBell className="w-10 h-10 text-blue-500/20" />
        </div>
        <div className="absolute inset-0 w-24 h-24 rounded-full bg-blue-50/50 animate-ping" />
      </div>
      <div className="text-center space-y-3 max-w-md">
        <p className="text-gray-500 text-lg font-medium">No notifications found</p>
        <p className="text-gray-400 text-sm leading-relaxed">
          {messages[activeTab] || messages.all}
        </p>
      </div>
    </motion.div>
  );
}

function NotificationCard({ notification, onMarkAsRead, onDelete, index }) {
  const Icon = typeIcons[notification.type] || FiBell;
  const colors = typeColors[notification.type] || {
    bg: "bg-gray-50",
    text: "text-gray-400",
    border: "border-gray-200",
    dot: "bg-gray-400",
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: 0,
        x: -80,
        scale: 0.92,
        filter: "blur(4px)",
        transition: { duration: 0.3 },
      }}
      transition={{
        duration: 0.4,
        delay: index * 0.04,
        layout: { type: "spring", duration: 0.4, bounce: 0.15 },
      }}
      className={`group relative flex items-start gap-4 p-4 sm:p-5 border-b border-gray-50 last:border-b-0 transition-all duration-300 ${
        !notification.read
          ? "bg-gradient-to-r from-blue-50 to-transparent border-l-[3px] border-l-blue-500"
          : "border-l-[3px] border-l-transparent hover:bg-gray-50"
      }`}
    >
      <div
        className={`relative flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center ${colors.bg} border ${colors.border} transition-all duration-200 group-hover:scale-105 group-hover:shadow-lg ${colors.glow}`}
      >
        <Icon className={`w-[18px] h-[18px] ${colors.text}`} />
        {!notification.read && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.4, bounce: 0.5 }}
            className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-500 border-[2.5px] border-white"
          />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2.5 mb-1">
              <p
                className={`font-semibold text-[13px] leading-snug truncate transition-colors duration-200 ${
                  notification.read ? "text-gray-400" : "text-gray-900"
                }`}
              >
                {notification.title}
              </p>
              {!notification.read && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.4 }}
                  className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-blue-600"
                />
              )}
            </div>
            <p
              className={`text-sm leading-relaxed line-clamp-2 transition-colors duration-200 ${
                notification.read ? "text-gray-400" : "text-gray-500"
              }`}
            >
              {notification.message}
            </p>
            <div className="flex items-center gap-2.5 mt-3">
              <TypeBadge type={notification.type} />
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <FiClock className="w-3 h-3" />
                {notification.time}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-200 flex-shrink-0 pt-0.5">
            {!notification.read && (
              <motion.button
                whileHover={{ scale: 1.12 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => onMarkAsRead(notification.id)}
                className="p-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-200"
                title="Mark as read"
              >
                <FiEye className="w-3.5 h-3.5" />
              </motion.button>
            )}
            <motion.button
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => onDelete(notification.id)}
              className="p-2 rounded-lg bg-gray-50 border border-gray-100 text-gray-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 hover:shadow-lg hover:shadow-red-500/5 transition-all duration-200"
              title="Delete notification"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function TypeBreakdown({ stats }) {
  const breakdown = [
    { key: "booking", label: "Bookings", count: stats.booking, icon: FiCalendar, color: "text-blue-600" },
    { key: "membership", label: "Membership", count: stats.membership, icon: FiCreditCard, color: "text-amber-600" },
    { key: "message", label: "Messages", count: stats.message, icon: FiMessageSquare, color: "text-emerald-600" },
    { key: "system", label: "System", count: stats.system, icon: FiSettings, color: "text-purple-600" },
  ];

  return (
    <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
      {breakdown.map((item) => (
        <div key={item.key} className="flex items-center gap-2">
          <item.icon className={`w-3.5 h-3.5 ${item.color}`} />
          <span className="text-xs text-gray-400">
            <span className="font-medium text-gray-500">{item.count}</span>{" "}
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

function SummaryBar({ stats }) {
  const percentage =
    stats.total > 0 ? Math.round(((stats.total - stats.unread) / stats.total) * 100) : 0;

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl bg-white backdrop-blur-xl border border-blue-100 overflow-hidden"
    >
      <div className="p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <FiInfo className="w-4 h-4 text-blue-600" />
            </div>
            <p className="text-sm text-gray-500">
              You have{" "}
              <span className="font-semibold text-blue-600">{stats.unread}</span>{" "}
              unread notification{stats.unread !== 1 ? "s" : ""} out of{" "}
              <span className="font-medium text-gray-600">{stats.total}</span> total.
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:flex-none h-2 sm:w-32 rounded-full bg-gray-50 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                className="h-full rounded-full bg-gradient-to-r from-blue-600 to-cyan-500"
              />
            </div>
            <span className="text-xs font-medium text-gray-400 flex-shrink-0">
              {percentage}% read
            </span>
          </div>
        </div>
      </div>
      <div className="px-4 sm:px-5 py-3 border-t border-gray-50 bg-gray-50">
        <TypeBreakdown stats={stats} />
      </div>
    </motion.div>
  );
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const timer = setTimeout(() => {
      const data = getNotifications();
      setNotifications(data);
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const stats = useMemo(
    () => getNotificationStats(notifications),
    [notifications]
  );

  const markAsRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeTab === "all") return true;
      if (activeTab === "unread") return !n.read;
      return n.type === activeTab;
    });
  }, [notifications, activeTab]);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageBanner
        pageKey="notifications"
        subtitle="Stay updated with your platform activity"
      />

      <motion.div
        variants={fadeUp}
        className="grid grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <StatCard
          icon={FiBell}
          label="Total"
          value={stats.total}
          accent="royal"
        />
        <StatCard
          icon={FiCheckCircle}
          label="Unread"
          value={stats.unread}
          accent="royal"
        />
        <StatCard
          icon={FiCalendar}
          label="Bookings"
          value={stats.booking}
          accent="royal"
        />
        <StatCard
          icon={FiMessageSquare}
          label="Messages"
          value={stats.message}
          accent="royal"
        />
      </motion.div>

      {!loading && <SummaryBar stats={stats} notifications={notifications} />}

      <motion.div
        variants={fadeUp}
        className="rounded-2xl bg-white backdrop-blur-xl border border-blue-100 overflow-hidden shadow-xl shadow-gray-100"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 sm:p-5 border-b border-gray-100">
          <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border overflow-hidden ${
                    isActive
                      ? "bg-blue-100 text-blue-600 border-blue-200 shadow-lg shadow-blue-500/5"
                      : "bg-gray-50 border-gray-100 text-gray-400 hover:text-gray-500 hover:bg-gray-100 hover:border-gray-200"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-1.5">
                    {tab.label}
                    {tab.key === "unread" && stats.unread > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-bold rounded-full bg-blue-200 text-blue-700">
                        {stats.unread}
                      </span>
                    )}
                  </span>
                </button>
              );
            })}
          </div>
          <Button variant="royal" size="sm" onClick={markAllRead}>
            <FiCheck className="w-3.5 h-3.5 mr-1.5" />
            Mark All Read
          </Button>
        </div>

        {loading ? (
          <div>
            {Array.from({ length: 6 }).map((_, i) => (
              <NotificationSkeleton key={i} index={i} />
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <EmptyState activeTab={activeTab} />
        ) : (
          <div>
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredNotifications.map((notification, index) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onMarkAsRead={markAsRead}
                  onDelete={deleteNotification}
                  index={index}
                />
              ))}
            </AnimatePresence>
          </div>
        )}

        {!loading && filteredNotifications.length > 0 && (
          <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-t border-gray-50 bg-gray-50">
            <p className="text-xs text-gray-400">
              Showing{" "}
              <span className="text-gray-400 font-medium">
                {filteredNotifications.length}
              </span>{" "}
              of{" "}
              <span className="text-gray-400 font-medium">
                {notifications.length}
              </span>{" "}
              notifications
            </p>
            {activeTab !== "all" && (
              <button
                onClick={() => setActiveTab("all")}
                className="inline-flex items-center gap-1 text-xs text-blue-600/60 hover:text-blue-600 transition-colors duration-200"
              >
                <FiX className="w-3 h-3" />
                Clear filter
              </button>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
