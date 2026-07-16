import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AreaChart, Area, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";
import {
  FiTrendingUp, FiClock, FiZap, FiPieChart, FiActivity, FiDroplet, FiHeart, FiShield,
} from "react-icons/fi";
import { StatCard } from "../../components/dashboard";
import { DashboardSkeleton } from "../../components/ui/Skeleton";
import { fadeUp, staggerContainer } from "../../lib/animations";
import {
  getDashboardStats, getRecentActivities, getUpcomingBookings, getRecentMembers, getRevenueData, getQuickActions,
} from "../../lib/dashboardData";

const activityColors = {
  blue: "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-500/20 dark:to-indigo-500/10 text-blue-600 dark:text-blue-400",
  emerald: "bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/10 text-emerald-600 dark:text-emerald-400",
  cyan: "bg-gradient-to-br from-cyan-100 to-sky-100 dark:from-cyan-500/20 dark:to-sky-500/10 text-cyan-600 dark:text-cyan-400",
  purple: "bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-500/20 dark:to-violet-500/10 text-purple-600 dark:text-purple-400",
  amber: "bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-500/20 dark:to-yellow-500/10 text-amber-600 dark:text-amber-400",
  rose: "bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-500/20 dark:to-pink-500/10 text-rose-600 dark:text-rose-400",
};

const statusStyles = {
  confirmed: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-200/60 dark:border-emerald-500/20",
  pending: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-200/60 dark:border-amber-500/20",
};

const actionColors = {
  cyan: "bg-cyan-50 dark:bg-cyan-500/5 border-cyan-200/60 dark:border-cyan-500/20 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-500/10 hover:border-cyan-300 dark:hover:border-cyan-500/30",
  emerald: "bg-emerald-50 dark:bg-emerald-500/5 border-emerald-200/60 dark:border-emerald-500/20 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-500/10 hover:border-emerald-300 dark:hover:border-emerald-500/30",
  blue: "bg-blue-50 dark:bg-blue-500/5 border-blue-200/60 dark:border-blue-500/20 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-500/10 hover:border-blue-300 dark:hover:border-blue-500/30",
  amber: "bg-amber-50 dark:bg-amber-500/5 border-amber-200/60 dark:border-amber-500/20 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-500/10 hover:border-amber-300 dark:hover:border-amber-500/30",
};

const chartTooltipStyle = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
  fontSize: "12px",
};

function WelcomeBanner() {
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
            <span className="text-[11px] text-gray-400 dark:text-gray-500">Last updated: Just now</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-1 tracking-tight">
            Welcome back, Admin
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 max-w-md">
            Here&apos;s what&apos;s happening with your fitness platform today. You have{" "}
            <span className="text-blue-600 dark:text-blue-400 font-semibold">3 new bookings</span> and{" "}
            <span className="text-emerald-600 dark:text-emerald-400 font-semibold">2 new members</span> since yesterday.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link to="/dashboard/trainers" className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-500 hover:from-blue-700 hover:to-indigo-600 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 active:scale-[0.97]">
            <FiZap className="w-4 h-4" />
            Quick Setup
          </Link>
        </div>
      </div>
    </motion.div>
  );
}

function QuickActions() {
  const actions = getQuickActions();
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] p-5 sm:p-6 shadow-sm">
      <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.id} to={action.href} className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${actionColors[action.color] || actionColors.blue}`}>
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
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Activities</h3>
        <button className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">View all</button>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-white/5">
        {activities.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.id} className="px-5 sm:px-6 py-3.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
              <div className={`p-2 rounded-lg shrink-0 ${activityColors[item.color] || activityColors.blue}`}>
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200">{item.action}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">{item.detail}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <FiClock className="w-3 h-3 text-gray-300 dark:text-gray-600" />
                <span className="text-[11px] text-gray-400 dark:text-gray-500">{item.time}</span>
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
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Upcoming Bookings</h3>
        <button className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">View all</button>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-white/5">
        {bookings.map((booking) => (
          <div key={booking.id} className="px-5 sm:px-6 py-3.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-500/15 dark:to-indigo-500/10 border border-blue-200/40 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0">
              {booking.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{booking.member}</p>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${statusStyles[booking.status] || statusStyles.pending}`}>{booking.status}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{booking.session} with {booking.trainer}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{booking.date}</p>
              <p className="text-[11px] text-gray-400 dark:text-gray-500">{booking.time}</p>
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
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Members</h3>
        <button className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">View all</button>
      </div>
      <div className="divide-y divide-gray-50 dark:divide-white/5">
        {members.map((member) => (
          <div key={member.id} className="px-5 sm:px-6 py-3.5 flex items-center gap-3 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-500/15 dark:to-indigo-500/10 border border-blue-200/40 dark:border-blue-500/20 flex items-center justify-center text-blue-600 dark:text-blue-400 text-xs font-bold shrink-0">
              {member.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">{member.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{member.email}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-500/10 dark:to-indigo-500/5 text-blue-600 dark:text-blue-400 text-[10px] font-bold border border-blue-200/40 dark:border-blue-500/20">{member.plan}</span>
              <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1">{member.joined}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function RevenueOverview() {
  const data = getRevenueData();
  const chartData = data.months.map((m, i) => ({ name: m, revenue: data.revenue[i] || 0 }));

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Revenue Overview</h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Monthly revenue trend</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200/60 dark:border-emerald-500/20">
          <FiTrendingUp className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
          <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">+8.1%</span>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
            <Tooltip
              contentStyle={chartTooltipStyle}
              formatter={(value) => [`$${(value / 1000).toFixed(1)}k`, "Revenue"]}
            />
            <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={2.5} fill="url(#revenueGrad)" />
          </AreaChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100 dark:border-white/5">
          <div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400">This Month</p>
            <p className="text-lg font-bold text-gray-900 dark:text-white">$48,295</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-gray-500 dark:text-gray-400">Last Month</p>
            <p className="text-lg font-bold text-gray-400 dark:text-gray-500">$45,000</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const healthMetrics = [
  { label: "BMI", value: "22.4", status: "Normal", icon: FiPieChart, color: "emerald" },
  { label: "Daily Calories", value: "2,150", status: "Maintenance", icon: FiActivity, color: "blue" },
  { label: "Water Intake", value: "2.8L", status: "On Track", icon: FiDroplet, color: "cyan" },
  { label: "Protein", value: "145g", status: "Target", icon: FiHeart, color: "rose" },
  { label: "Body Fat", value: "18.2%", status: "Athletic", icon: FiShield, color: "amber" },
  { label: "BMR", value: "1,680", status: "Average", icon: FiZap, color: "purple" },
];

const healthColorMap = {
  emerald: { bg: "bg-emerald-50 dark:bg-emerald-500/5", border: "border-emerald-200/40 dark:border-emerald-500/15", text: "text-emerald-600 dark:text-emerald-400", iconBg: "bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-500/20 dark:to-green-500/10", badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  blue: { bg: "bg-blue-50 dark:bg-blue-500/5", border: "border-blue-200/40 dark:border-blue-500/15", text: "text-blue-600 dark:text-blue-400", iconBg: "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-500/20 dark:to-indigo-500/10", badge: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400" },
  cyan: { bg: "bg-cyan-50 dark:bg-cyan-500/5", border: "border-cyan-200/40 dark:border-cyan-500/15", text: "text-cyan-600 dark:text-cyan-400", iconBg: "bg-gradient-to-br from-cyan-100 to-sky-100 dark:from-cyan-500/20 dark:to-sky-500/10", badge: "bg-cyan-50 dark:bg-cyan-500/10 text-cyan-600 dark:text-cyan-400" },
  rose: { bg: "bg-rose-50 dark:bg-rose-500/5", border: "border-rose-200/40 dark:border-rose-500/15", text: "text-rose-600 dark:text-rose-400", iconBg: "bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-500/20 dark:to-pink-500/10", badge: "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400" },
  amber: { bg: "bg-amber-50 dark:bg-amber-500/5", border: "border-amber-200/40 dark:border-amber-500/15", text: "text-amber-600 dark:text-amber-400", iconBg: "bg-gradient-to-br from-amber-100 to-yellow-100 dark:from-amber-500/20 dark:to-yellow-500/10", badge: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400" },
  purple: { bg: "bg-purple-50 dark:bg-purple-500/5", border: "border-purple-200/40 dark:border-purple-500/15", text: "text-purple-600 dark:text-purple-400", iconBg: "bg-gradient-to-br from-purple-100 to-violet-100 dark:from-purple-500/20 dark:to-violet-500/10", badge: "bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400" },
};

function HealthOverview() {
  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Health Overview</h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Your fitness metrics at a glance</p>
        </div>
        <Link to="/fitness-tools" className="text-[11px] text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium transition-colors">All Tools</Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-gray-100 dark:divide-white/5">
        {healthMetrics.map((metric, i) => {
          const Icon = metric.icon;
          const colors = healthColorMap[metric.color] || healthColorMap.blue;
          return (
            <motion.div key={metric.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }} className="p-4 flex flex-col items-center gap-2.5 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors cursor-pointer">
              <div className={`w-10 h-10 rounded-xl ${colors.iconBg} flex items-center justify-center shadow-sm`}>
                <Icon className={`w-4.5 h-4.5 ${colors.text}`} />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-gray-900 dark:text-white">{metric.value}</p>
                <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5 font-medium">{metric.label}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${colors.badge}`}>{metric.status}</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function WeeklyProgress() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const workouts = [1, 1, 0, 1, 1, 0, 0];
  const calories = [2100, 2250, 1950, 2300, 2150, 1800, 1900];
  const chartData = days.map((d, i) => ({ name: d, calories: calories[i], workout: workouts[i] }));

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Weekly Progress</h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Calorie intake trend</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-gray-500 dark:text-gray-400">Workout</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-[10px] text-gray-500 dark:text-gray-400">Calories</span>
          </div>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <ResponsiveContainer width="100%" height={180}>
          <RechartsBarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={chartTooltipStyle}
              formatter={(value, name) => [name === "calories" ? `${value} cal` : value ? "Yes" : "No", name]}
            />
            <Bar dataKey="calories" fill="#2563eb" radius={[4, 4, 0, 0]} barSize={20} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function MembershipBreakdown() {
  const segments = [
    { label: "Basic", value: 420, color: "#3b82f6" },
    { label: "Standard", value: 680, color: "#10b981" },
    { label: "Premium", value: 510, color: "#a855f7" },
    { label: "VIP Elite", value: 282, color: "#f59e0b" },
  ];
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-white/5">
        <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Membership Breakdown</h3>
        <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Active plans distribution</p>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-center gap-6">
          <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={segments} dataKey="value" cx="50%" cy="50%" innerRadius={35} outerRadius={55} strokeWidth={0}>
                  {segments.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-lg font-bold text-gray-900 dark:text-white">{total}</span>
              <span className="text-[9px] text-gray-500 dark:text-gray-400">Total</span>
            </div>
          </div>
          <div className="space-y-2.5">
            {segments.map((segment, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <span className="w-2.5 h-2.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: segment.color }} />
                <span className="text-xs text-gray-500 dark:text-gray-400">{segment.label}</span>
                <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 ml-auto">{segment.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function BookingsChart() {
  const data = getRevenueData();
  const chartData = data.months.map((m, i) => ({ name: m, bookings: data.bookings[i] || 0 }));

  return (
    <motion.div variants={fadeUp} initial="hidden" animate="visible" className="rounded-2xl bg-white dark:bg-white/[0.03] border border-gray-200/80 dark:border-white/[0.06] overflow-hidden shadow-sm">
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 dark:border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Bookings Trend</h3>
          <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Monthly booking count</p>
        </div>
        <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50" />
      </div>
      <div className="p-5 sm:p-6">
        <ResponsiveContainer width="100%" height={220}>
          <RechartsBarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={chartTooltipStyle}
              formatter={(value) => [value, "Bookings"]}
            />
            <Bar dataKey="bookings" fill="#10b981" radius={[4, 4, 0, 0]} barSize={20} />
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

function Overview() {
  const [loading, setLoading] = useState(true);
  const stats = getDashboardStats();

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <DashboardSkeleton accent="blue" />;

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="space-y-6">
      <WelcomeBanner />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} index={i} />
        ))}
      </div>

      <QuickActions />
      <HealthOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RevenueOverview />
        </div>
        <MembershipBreakdown />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BookingsChart />
        </div>
        <RecentActivities />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WeeklyProgress />
        <UpcomingBookings />
        <RecentMembers />
      </div>
    </motion.div>
  );
}

export default Overview;
