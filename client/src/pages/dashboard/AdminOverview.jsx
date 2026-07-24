import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUsers, FiAward, FiCalendar, FiDollarSign, FiTrendingUp,
  FiUserCheck, FiUserX, FiClock, FiMail, FiBookOpen,
  FiActivity, FiShield, FiRefreshCw, FiArrowRight,
} from "react-icons/fi";
import { StatCard } from "../../components/dashboard";
import { DashboardSkeleton } from "../../components/ui/Skeleton";
import { fadeUp, staggerContainer } from "../../lib/animations";

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

const activityColors = {
  blue: "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-500/20 dark:to-indigo-500/10 text-blue-600 dark:text-blue-400",
  emerald: "bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/10 text-emerald-600 dark:text-emerald-400",
  cyan: "bg-gradient-to-br from-cyan-100 to-sky-100 dark:from-cyan-500/20 dark:to-sky-500/10 text-cyan-600 dark:text-cyan-400",
  purple: "bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-500/20 dark:to-violet-500/10 text-purple-600 dark:text-purple-400",
  amber: "bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-500/20 dark:to-yellow-500/10 text-amber-600 dark:text-amber-400",
  rose: "bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-500/20 dark:to-pink-500/10 text-rose-600 dark:text-rose-400",
};

const statusStyles = {
  CONFIRMED: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-500/20",
  PENDING: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-500/20",
  CANCELLED: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-300 border-red-200/60 dark:border-red-500/20",
  COMPLETED: "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 border-blue-200/60 dark:border-blue-500/20",
};

function WelcomeBanner({ stats }) {
  const totalUsers = stats?.users?.total || 0;
  const todayBookings = stats?.bookings?.today || 0;
  const unreadMessages = stats?.contactMessages?.unread || 0;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="relative rounded-2xl bg-gradient-to-r from-blue-50 via-indigo-50/50 to-blue-100/30 dark:from-blue-500/10 dark:via-indigo-500/5 dark:to-blue-500/10 border border-blue-200/40 dark:border-blue-500/15 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-200 dark:bg-blue-500/15 rounded-full blur-[80px] opacity-60" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-200 dark:bg-indigo-500/15 rounded-full blur-[60px] opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent dark:from-white/[0.02] dark:to-transparent" />
      </div>
      <div className="relative z-10 px-6 sm:px-8 py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50 animate-pulse" />
              Live
            </span>
            <span className="text-[11px] text-gray-400 dark:text-gray-500">Platform Overview</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
            Admin Dashboard
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
            You have{" "}
            <span className="text-blue-600 dark:text-blue-400 font-semibold">{todayBookings} bookings today</span>,{" "}
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{totalUsers} total users</span>
            {unreadMessages > 0 && (
              <> and <span className="text-amber-600 dark:text-amber-400 font-semibold">{unreadMessages} unread messages</span></>
            )}.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/dashboard/users" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.97]">
            <FiUsers className="w-4 h-4" />
            Manage Users
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function LatestUsers({ users }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Latest Users</h3>
        <Link to="/dashboard/users" className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">View all</Link>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-white/5">
        {users.length === 0 && (
          <div className="px-5 sm:px-6 py-8 text-center text-sm text-gray-400 dark:text-gray-500">No users yet</div>
        )}
        {users.map((user) => (
          <div key={user._id || user.id} className="px-5 sm:px-6 py-3.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-500/15 dark:to-indigo-500/10 border border-blue-200/40 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0">
              {user.firstName?.charAt(0)}{user.lastName?.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{user.firstName} {user.lastName}</p>
              <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                <FiMail className="w-3 h-3 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
            </div>
            <div className="text-right shrink-0">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                user.role === "ADMIN"
                  ? "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-500/20"
                  : user.role === "TRAINER"
                  ? "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-200 dark:border-cyan-500/20"
                  : "bg-gray-50 dark:bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-500/20"
              }`}>
                {user.role}
              </span>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">
                {user.createdAt ? new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function LatestBookings({ bookings }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Latest Bookings</h3>
        <Link to="/dashboard/contact" className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">View all</Link>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-white/5">
        {bookings.length === 0 && (
          <div className="px-5 sm:px-6 py-8 text-center text-sm text-gray-400 dark:text-gray-500">No bookings yet</div>
        )}
        {bookings.map((booking, i) => {
          const userName = booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : "Unknown";
          const className = booking.class?.name || "N/A";
          const status = booking.status || "PENDING";
          return (
            <div key={booking._id || booking.id || i} className="px-5 sm:px-6 py-3.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/15 dark:to-green-500/10 border border-emerald-200/40 dark:border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-xs font-bold shrink-0">
                <FiCalendar className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{userName}</p>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusStyles[status] || statusStyles.PENDING}`}>{status}</span>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{className}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-[11px] text-gray-400 dark:text-gray-500">
                  {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }) : "—"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function LatestTrainers({ trainers }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Latest Trainers</h3>
        <Link to="/dashboard/trainers" className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">View all</Link>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-white/5">
        {trainers.length === 0 && (
          <div className="px-5 sm:px-6 py-8 text-center text-sm text-gray-400 dark:text-gray-500">No trainers yet</div>
        )}
        {trainers.map((trainer) => {
          const name = trainer.user ? `${trainer.user.firstName} ${trainer.user.lastName}` : "Unknown";
          return (
            <div key={trainer._id || trainer.id} className="px-5 sm:px-6 py-3.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-100 to-sky-100 dark:from-cyan-500/15 dark:to-sky-500/10 border border-cyan-200/40 dark:border-cyan-500/20 flex items-center justify-center text-cyan-600 dark:text-cyan-400 text-xs font-bold shrink-0">
                <FiAward className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{trainer.specialization || "General"}</p>
              </div>
              {trainer.rating != null && (
                <div className="flex items-center gap-1 shrink-0">
                  <FiTrendingUp className="w-3 h-3 text-amber-400" />
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">{trainer.rating}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function QuickActions() {
  const actions = [
    { label: "Manage Users", href: "/dashboard/users", icon: FiUsers, color: "blue" },
    { label: "Trainers", href: "/dashboard/trainers", icon: FiAward, color: "cyan" },
    { label: "Settings", href: "/dashboard/settings", icon: FiShield, color: "purple" },
    { label: "Messages", href: "/dashboard/contact", icon: FiMail, color: "amber" },
  ];

  const colorMap = {
    blue: "bg-blue-50 dark:bg-blue-500/5 border-blue-200/60 dark:border-blue-500/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500/30",
    cyan: "bg-cyan-50 dark:bg-cyan-500/5 border-cyan-200/60 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-500/10 hover:border-cyan-300 dark:hover:border-cyan-500/30",
    purple: "bg-purple-50 dark:bg-purple-500/5 border-purple-200/60 dark:border-purple-500/20 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-500/10 hover:border-purple-300 dark:hover:border-purple-500/30",
    amber: "bg-amber-50 dark:bg-amber-500/5 border-amber-200/60 dark:border-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/10 hover:border-amber-300 dark:hover:border-amber-500/30",
  };

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] p-5 sm:p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.label} to={action.href} className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${colorMap[action.color]}`}>
              <Icon className="w-5 h-5" />
              <span className="text-xs font-semibold">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

function SystemStats({ overview }) {
  if (!overview) return null;

  const items = [
    { label: "Total Users", value: overview.users?.total ?? 0, icon: FiUsers, color: "blue" },
    { label: "Trainers", value: overview.users?.totalTrainers ?? 0, icon: FiAward, color: "cyan" },
    { label: "Active Classes", value: overview.classes?.active ?? 0, icon: FiBookOpen, color: "emerald" },
    { label: "Total Bookings", value: overview.bookings?.total ?? 0, icon: FiCalendar, color: "amber" },
    { label: "Today's Bookings", value: overview.bookings?.today ?? 0, icon: FiClock, color: "purple" },
    { label: "Pending Payments", value: overview.payments?.pending ?? 0, icon: FiDollarSign, color: "rose" },
  ];

  const colorMap = {
    blue: "bg-blue-50 dark:bg-blue-500/5 border-blue-200/40 dark:border-blue-500/15 text-blue-600 dark:text-blue-400",
    cyan: "bg-cyan-50 dark:bg-cyan-500/5 border-cyan-200/40 dark:border-cyan-500/15 text-cyan-600 dark:text-cyan-400",
    emerald: "bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200/40 dark:border-emerald-500/15 text-emerald-600 dark:text-emerald-400",
    amber: "bg-amber-50 dark:bg-amber-500/5 border-amber-200/40 dark:border-amber-500/15 text-amber-600 dark:text-amber-400",
    purple: "bg-purple-50 dark:bg-purple-500/5 border-purple-200/40 dark:border-purple-500/15 text-purple-600 dark:text-purple-400",
    rose: "bg-rose-50 dark:bg-rose-500/5 border-rose-200/40 dark:border-rose-500/15 text-rose-600 dark:text-rose-400",
  };

  const iconBg = {
    blue: "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-500/20 dark:to-indigo-500/10",
    cyan: "bg-gradient-to-br from-cyan-100 to-sky-100 dark:from-cyan-500/20 dark:to-sky-500/10",
    emerald: "bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/10",
    amber: "bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-500/20 dark:to-yellow-500/10",
    purple: "bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-500/20 dark:to-violet-500/10",
    rose: "bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-500/20 dark:to-pink-500/10",
  };

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-white/5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Platform Overview</h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">System-wide statistics</p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-gray-100 dark:divide-white/5">
        {items.map((item, i) => {
          const Icon = item.icon;
          const colors = colorMap[item.color] || colorMap.blue;
          const bg = iconBg[item.color] || iconBg.blue;
          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              className="p-4 flex flex-col items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer"
            >
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center shadow-sm`}>
                <Icon className={`w-4.5 h-4.5 ${colors}`} />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{item.value}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{item.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function AdminOverview() {
  const [stats, setStats] = useState(null);
  const [overview, setOverview] = useState(null);
  const [latestUsers, setLatestUsers] = useState([]);
  const [latestBookings, setLatestBookings] = useState([]);
  const [latestTrainers, setLatestTrainers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [statsRes, overviewRes, usersRes, bookingsRes, trainersRes] = await Promise.allSettled([
        fetch(`${API_URL}/api/v1/dashboard/stats`, { headers: authHeaders() }),
        fetch(`${API_URL}/api/v1/dashboard/admin/overview`, { headers: authHeaders() }),
        fetch(`${API_URL}/api/v1/dashboard/admin/latest-users?limit=5`, { headers: authHeaders() }),
        fetch(`${API_URL}/api/v1/dashboard/admin/latest-bookings?limit=5`, { headers: authHeaders() }),
        fetch(`${API_URL}/api/v1/dashboard/admin/latest-trainers?limit=5`, { headers: authHeaders() }),
      ]);

      if (statsRes.status === "fulfilled" && statsRes.value.ok) {
        const d = await statsRes.value.json();
        setStats(d.data);
      }
      if (overviewRes.status === "fulfilled" && overviewRes.value.ok) {
        const d = await overviewRes.value.json();
        setOverview(d.data);
      }
      if (usersRes.status === "fulfilled" && usersRes.value.ok) {
        const d = await usersRes.value.json();
        setLatestUsers(d.data || []);
      }
      if (bookingsRes.status === "fulfilled" && bookingsRes.value.ok) {
        const d = await bookingsRes.value.json();
        setLatestBookings(d.data || []);
      }
      if (trainersRes.status === "fulfilled" && trainersRes.value.ok) {
        const d = await trainersRes.value.json();
        setLatestTrainers(d.data || []);
      }
    } catch {
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchAll();
  }, [fetchAll]);

  if (loading) return <DashboardSkeleton accent="blue" />;

  if (error) {
    return (
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-8 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium mb-4">{error}</p>
          <button
            onClick={fetchAll}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            <FiRefreshCw className="w-4 h-4" />
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  const statCards = [
    { icon: FiUsers, label: "Total Users", value: stats?.totalUsers ?? overview?.users?.total ?? 0, pageKey: "dashboard", index: 0 },
    { icon: FiAward, label: "Total Trainers", value: stats?.totalTrainers ?? overview?.users?.totalTrainers ?? 0, pageKey: "dashboard", index: 1 },
    { icon: FiBookOpen, label: "Total Classes", value: stats?.totalClasses ?? overview?.classes?.total ?? 0, pageKey: "dashboard", index: 2 },
    { icon: FiCalendar, label: "Total Bookings", value: stats?.totalBookings ?? overview?.bookings?.total ?? 0, pageKey: "dashboard", index: 3 },
    { icon: FiDollarSign, label: "Total Revenue", value: stats?.totalRevenue ? `$${stats.totalRevenue.toLocaleString()}` : "$0", pageKey: "dashboard", index: 4 },
    { icon: FiTrendingUp, label: "Monthly Revenue", value: stats?.monthlyRevenue ? `$${stats.monthlyRevenue.toLocaleString()}` : "$0", pageKey: "dashboard", index: 5 },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <WelcomeBanner stats={overview} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      <QuickActions />
      <SystemStats overview={overview} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <LatestUsers users={latestUsers} />
        <LatestBookings bookings={latestBookings} />
        <LatestTrainers trainers={latestTrainers} />
      </div>
    </motion.div>
  );
}

export default AdminOverview;
