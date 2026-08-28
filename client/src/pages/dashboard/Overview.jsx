import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiTrendingUp, FiClock, FiZap, FiCreditCard,
} from "react-icons/fi";
import { StatCard } from "../../components/dashboard";
import { DashboardSkeleton } from "../../components/ui/Skeleton";
import { fadeUp, staggerContainer } from "../../lib/animations";
import {
  getDashboardStats, getRecentActivities, getUpcomingBookings, getRecentMembers, getQuickActions,
} from "../../lib/dashboardData";
import { useAuth } from "../../context/AuthContext";

const activityColors = {
  blue: "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-500/20 dark:to-indigo-500/10 text-blue-600 dark:text-blue-400",
  emerald: "bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/10 text-emerald-600 dark:text-emerald-400",
  cyan: "bg-gradient-to-br from-cyan-100 to-sky-100 dark:from-cyan-500/20 dark:to-sky-500/10 text-cyan-600 dark:text-cyan-400",
  purple: "bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-500/20 dark:to-violet-500/10 text-purple-600 dark:text-purple-400",
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
            <span className="text-[11px] text-gray-400 dark:text-gray-500">Last updated: Just now</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
            Welcome back, {userName}
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
            Here&apos;s what&apos;s happening with your fitness platform today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/dashboard/trainers" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-600/25">
            <FiZap className="w-4 h-4" />
            Quick Setup
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
        to="/dashboard/membership"
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 font-bold text-sm transition-all dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-300 dark:hover:bg-emerald-500/20"
      >
        <FiCreditCard className="w-4 h-4" /> View Membership
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

function RecentActivities() {
  const activities = getRecentActivities();
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
      <div className="px-6 sm:px-7 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-white/5">
        {activities.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="px-6 sm:px-7 py-3.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
              <div className={`p-2.5 rounded-lg shrink-0 ${activityColors[item.color] || activityColors.blue}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.action}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{item.detail}</p>
              </div>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}

function UpcomingBookings() {
  const bookings = getUpcomingBookings();
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
      <div className="px-6 sm:px-7 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Upcoming Bookings</h3>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-white/5">
        {bookings.map((booking) => (
          <div key={booking.id} className="px-6 sm:px-7 py-3.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-500/15 dark:to-indigo-500/10 border border-blue-200/40 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0">
              {booking.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{booking.member}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{booking.session} with {booking.trainer}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function RecentMembers() {
  const members = getRecentMembers();
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
      <div className="px-6 sm:px-7 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Members</h3>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-white/5">
        {members.map((member) => (
          <div key={member.id} className="px-6 sm:px-7 py-3.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{member.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{member.email}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Overview() {
  const { user, isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const stats = getDashboardStats(isAdmin);
  const userName = user?.firstName || (isAdmin ? "Admin" : "User");

  useEffect(() => {
    window.scrollTo(0, 0);
    setLoading(false);
  }, []);

  if (loading) return <DashboardSkeleton accent="blue" />;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <WelcomeBanner userName={userName} />
      <DashboardQuickActions />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      <QuickActions />
      <RecentActivities />
      <UpcomingBookings />
      <RecentMembers />
    </motion.div>
  );
}
