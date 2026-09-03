import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiTrendingUp, FiClock, FiZap, FiCreditCard,
  FiCalendar, FiCheckCircle, FiX, FiAlertCircle,
} from "react-icons/fi";
import { StatCard } from "../../components/dashboard";
import { DashboardSkeleton } from "../../components/ui/Skeleton";
import { fadeUp, staggerContainer } from "../../lib/animations";
import { getQuickActions } from "../../lib/dashboardData";
import { useAuth } from "../../context/AuthContext";
import { apiClient } from "../../lib/api";

const statusConfig = {
  PENDING: { label: "Pending", icon: FiClock, color: "amber" },
  CONFIRMED: { label: "Confirmed", icon: FiCheckCircle, color: "emerald" },
  COMPLETED: { label: "Completed", icon: FiCheckCircle, color: "blue" },
  CANCELLED: { label: "Cancelled", icon: FiX, color: "rose" },
};

const activityColors = {
  blue: "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-500/20 dark:to-indigo-500/10 text-blue-600 dark:text-blue-400",
  emerald: "bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/10 text-emerald-600 dark:text-emerald-400",
  cyan: "bg-gradient-to-br from-cyan-100 to-sky-100 dark:from-cyan-500/20 dark:to-sky-500/10 text-cyan-600 dark:text-cyan-400",
  amber: "bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-500/20 dark:to-yellow-500/10 text-amber-600 dark:text-amber-400",
  rose: "bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-500/20 dark:to-pink-500/10 text-rose-600 dark:text-rose-400",
};

const actionColors = {
  cyan: "bg-cyan-50 dark:bg-cyan-500/5 border-cyan-200/60 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-500/10 hover:border-cyan-300 dark:hover:border-cyan-500/30",
  emerald: "bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200/60 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 hover:border-emerald-300 dark:hover:border-emerald-500/30",
  blue: "bg-blue-50 dark:bg-blue-500/5 border-blue-200/60 dark:border-blue-500/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500/30",
  amber: "bg-amber-50 dark:bg-amber-500/5 border-amber-200/60 dark:border-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/10 hover:border-amber-300 dark:hover:border-amber-500/30",
};

function WelcomeBanner({ userName }) {
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
      </div>
      <div className="relative z-10 px-6 sm:px-8 py-7 sm:py-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50 animate-pulse" />
              Live
            </span>
            <span className="text-[11px] text-gray-400 dark:text-gray-400">Last updated: Just now</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
            Welcome back, {userName}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md">
            Here&apos;s what&apos;s happening with your fitness platform today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/booking" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-600/25">
            <FiZap className="w-4 h-4" />
            Book a Class
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function DashboardQuickActions() {
  return (
    <div className="flex flex-wrap items-center gap-4 my-4">
      <Link
        to="/booking"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-600/20 transition-all"
      >
        <FiClock className="w-4 h-4" /> Book Now
      </Link>
      <Link
        to="/services"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-base-200 hover:bg-base-300 text-base-content border border-base-300 font-bold text-sm transition-all dark:bg-white/5 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
      >
        <FiTrendingUp className="w-4 h-4" /> View Classes
      </Link>
      <Link
        to="/dashboard/my-bookings"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-sm transition-all dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
      >
        <FiCalendar className="w-4 h-4" /> My Bookings
      </Link>
    </div>
  );
}

function QuickActions() {
  const actions = getQuickActions();
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] p-6 sm:p-7 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.id} to={action.href} className={`flex flex-col items-center gap-2.5 p-5 rounded-xl border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${actionColors[action.color] || actionColors.blue}`}>
              <Icon className="w-5 h-5" />
              <span className="text-xs font-semibold">{action.label}</span>
            </Link>
          );
        })}
      </div>
    </motion.div>
  );
}

function RecentActivities({ bookings }) {
  if (!bookings || bookings.length === 0) {
    return (
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
        <div className="px-6 sm:px-7 py-4 border-b border-gray-100 dark:border-white/5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
        </div>
        <div className="px-6 sm:px-7 py-8 text-center text-sm text-gray-400 dark:text-gray-500">No recent activities</div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
      <div className="px-6 sm:px-7 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-white/5">
        {bookings.map((booking) => {
          const status = statusConfig[booking.status] || statusConfig.PENDING;
          const StatusIcon = status.icon;
          const className = booking.class?.name || "Session";
          const trainerName = booking.trainer?.user
            ? `${booking.trainer.user.firstName} ${booking.trainer.user.lastName}`
            : "Unknown Trainer";
          const timeAgo = getTimeAgo(booking.createdAt);
          return (
            <div key={booking._id || booking.id} className="px-6 sm:px-7 py-3.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
              <div className={`p-2.5 rounded-lg shrink-0 ${activityColors[status.color] || activityColors.blue}`}>
                <StatusIcon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{className}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">with {trainerName} - {status.label}</p>
              </div>
              <span className="text-[11px] text-gray-400 dark:text-gray-500 shrink-0">{timeAgo}</span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function UpcomingBookings({ bookings }) {
  if (!bookings || bookings.length === 0) {
    return (
      <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
        <div className="px-6 sm:px-7 py-4 border-b border-gray-100 dark:border-white/5">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Upcoming Bookings</h3>
        </div>
        <div className="px-6 sm:px-7 py-8 text-center text-sm text-gray-400 dark:text-gray-500">No upcoming bookings</div>
      </motion.div>
    );
  }

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
      <div className="px-6 sm:px-7 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Upcoming Bookings</h3>
        <Link to="/dashboard/my-bookings" className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">View all</Link>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-white/5">
        {bookings.map((booking) => {
          const className = booking.class?.name || "Session";
          const trainerName = booking.trainer?.user
            ? `${booking.trainer.user.firstName} ${booking.trainer.user.lastName}`
            : "Unknown";
          const dateStr = booking.bookingDate || "TBD";
          const timeStr = booking.bookingTime || "TBD";
          return (
            <div key={booking._id || booking.id} className="px-6 sm:px-7 py-3.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-500/15 dark:to-indigo-500/10 border border-blue-200/40 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0">
                <FiCalendar className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{className}</p>
                <p className="text-xs text-gray-500 dark:text-gray-300 mt-0.5">{trainerName} &middot; {dateStr} {timeStr}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function getTimeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return "1 day ago";
  return `${days} days ago`;
}

export default function Overview() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);
  const userName = user?.firstName || "User";

  const fetchStats = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.get("/api/v1/dashboard/member/overview");
      if (res.ok) {
        const data = await res.json();
        setStats(data.data);
      } else {
        setError("Failed to load dashboard data");
      }
    } catch {
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchStats();
  }, [fetchStats]);

  if (loading) return <DashboardSkeleton accent="blue" />;

  if (error) {
    return (
      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
        <div className="rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-8 text-center">
          <p className="text-red-600 dark:text-red-400 font-medium mb-4">{error}</p>
          <button onClick={fetchStats} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-sm font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">
            Retry
          </button>
        </div>
      </motion.div>
    );
  }

  const statCards = [
    {
      icon: FiCalendar,
      label: "Total Bookings",
      value: stats?.totalBookings ?? 0,
      change: stats?.thisMonthBookings > 0 ? `+${stats.thisMonthBookings} this month` : undefined,
      trend: "up",
      color: "orange",
      to: "/dashboard/my-bookings",
    },
    {
      icon: FiCheckCircle,
      label: "Confirmed",
      value: stats?.confirmedBookings ?? 0,
      color: "emerald",
      to: "/dashboard/my-bookings",
    },
    {
      icon: FiCreditCard,
      label: "Total Spent",
      value: `$${(stats?.totalSpent ?? 0).toLocaleString()}`,
      change: stats?.thisMonthSpent > 0 ? `$${stats.thisMonthSpent.toLocaleString()} this month` : undefined,
      trend: "up",
      color: "cyan",
      to: "/dashboard/my-bookings",
    },
    {
      icon: FiAlertCircle,
      label: "Pending",
      value: stats?.pendingBookings ?? 0,
      color: stats?.pendingBookings > 0 ? "amber" : "emerald",
      to: "/dashboard/my-bookings",
    },
  ];

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <WelcomeBanner userName={userName} />
      <DashboardQuickActions />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      <QuickActions />
      <RecentActivities bookings={stats?.recentBookings} />
      <UpcomingBookings bookings={stats?.upcomingBookings} />
    </motion.div>
  );
}
