import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiClock,
  FiZap,
  FiPieChart,
  FiActivity,
  FiDroplet,
  FiHeart,
  FiShield,
  FiTarget,
  FiSun,
} from "react-icons/fi";
import { StatCard } from "../../components/dashboard";
import ChartCard, { DonutChart } from "../../components/dashboard/ChartCard";
import { DashboardSkeleton } from "../../components/ui/Skeleton";
import { fadeUp, staggerContainer } from "../../lib/animations";
import {
  getDashboardStats,
  getRecentActivities,
  getUpcomingBookings,
  getRecentMembers,
  getRevenueData,
  getQuickActions,
} from "../../lib/dashboardData";

const activityColors = {
  blue: "bg-blue-500/15 text-blue-400",
  emerald: "bg-emerald-500/15 text-emerald-400",
  cyan: "bg-cyan-500/15 text-cyan-400",
  purple: "bg-purple-500/15 text-purple-400",
  amber: "bg-amber-500/15 text-amber-400",
  rose: "bg-rose-500/15 text-rose-400",
};

const statusStyles = {
  confirmed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/20",
  pending: "bg-amber-500/15 text-amber-400 border-amber-500/20",
};

const actionColors = {
  cyan: "bg-cyan-500/10 border-cyan-500/15 text-cyan-400 hover:bg-cyan-500/15 hover:border-cyan-500/25",
  emerald: "bg-emerald-500/10 border-emerald-500/15 text-emerald-400 hover:bg-emerald-500/15 hover:border-emerald-500/25",
  blue: "bg-blue-500/10 border-blue-500/15 text-blue-400 hover:bg-blue-500/15 hover:border-blue-500/25",
  amber: "bg-amber-500/10 border-amber-500/15 text-amber-400 hover:bg-amber-500/15 hover:border-amber-500/25",
};

function WelcomeBanner() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="relative rounded-2xl bg-gradient-to-r from-blue-600/15 via-[#12121a] to-blue-500/10 border border-blue-500/10 overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-blue-500/10 rounded-full blur-[80px]" />
        <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-400/5 rounded-full blur-[60px]" />
      </div>
      <div className="relative z-10 px-6 sm:px-8 py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              Live
            </span>
            <span className="text-[11px] text-white/25">Last updated: Just now</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1">
            Welcome back, Admin
          </h2>
          <p className="text-sm text-white/40 max-w-md">
            Here&apos;s what&apos;s happening with your fitness platform today. You have{" "}
            <span className="text-blue-400 font-medium">3 new bookings</span> and{" "}
            <span className="text-emerald-400 font-medium">2 new members</span> since
            yesterday.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to="/dashboard/trainers"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-all duration-200 shadow-lg shadow-blue-500/20"
          >
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
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-white/5 p-5 sm:p-6"
    >
      <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.id}
              to={action.href}
              className={`flex flex-col items-center gap-2.5 p-4 rounded-xl border transition-all duration-200 ${
                actionColors[action.color] || actionColors.blue
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{action.label}</span>
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
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-white/5 overflow-hidden"
    >
      <div className="px-5 sm:px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Recent Activities</h3>
        <button className="text-[11px] text-blue-400 hover:text-blue-300 font-medium transition-colors">
          View all
        </button>
      </div>
      <div className="divide-y divide-white/[0.03]">
        {activities.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="px-5 sm:px-6 py-3.5 flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
            >
              <div
                className={`p-2 rounded-lg shrink-0 ${
                  activityColors[item.color] || activityColors.blue
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-white/80">{item.action}</p>
                <p className="text-xs text-white/30 mt-0.5 truncate">{item.detail}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <FiClock className="w-3 h-3 text-white/20" />
                <span className="text-[11px] text-white/25">{item.time}</span>
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
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-white/5 overflow-hidden"
    >
      <div className="px-5 sm:px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Upcoming Bookings</h3>
        <button className="text-[11px] text-blue-400 hover:text-blue-300 font-medium transition-colors">
          View all
        </button>
      </div>
      <div className="divide-y divide-white/[0.03]">
        {bookings.map((booking) => (
          <div
            key={booking.id}
            className="px-5 sm:px-6 py-3.5 flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/15 flex items-center justify-center text-blue-400 text-xs font-bold shrink-0">
              {booking.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white/80 truncate">
                  {booking.member}
                </p>
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold border ${
                    statusStyles[booking.status] || statusStyles.pending
                  }`}
                >
                  {booking.status}
                </span>
              </div>
              <p className="text-xs text-white/30 mt-0.5">
                {booking.session} with {booking.trainer}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xs font-medium text-white/60">{booking.date}</p>
              <p className="text-[11px] text-white/25">{booking.time}</p>
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
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-white/5 overflow-hidden"
    >
      <div className="px-5 sm:px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Recent Members</h3>
        <button className="text-[11px] text-blue-400 hover:text-blue-300 font-medium transition-colors">
          View all
        </button>
      </div>
      <div className="divide-y divide-white/[0.03]">
        {members.map((member) => (
          <div
            key={member.id}
            className="px-5 sm:px-6 py-3.5 flex items-center gap-3 hover:bg-white/[0.02] transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/5 flex items-center justify-center text-white/60 text-xs font-bold shrink-0">
              {member.avatar}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-white/80 truncate">{member.name}</p>
              <p className="text-xs text-white/30 mt-0.5">{member.email}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 text-[10px] font-bold border border-blue-500/15">
                {member.plan}
              </span>
              <p className="text-[11px] text-white/20 mt-1">{member.joined}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function RevenueOverview() {
  const data = getRevenueData();

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-blue-500/10 overflow-hidden"
    >
      <div className="px-5 sm:px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Revenue Overview</h3>
          <p className="text-[11px] text-white/30 mt-0.5">Monthly revenue trend</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/15">
          <FiTrendingUp className="w-3 h-3 text-emerald-400" />
          <span className="text-[11px] font-bold text-emerald-400">+8.1%</span>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-end gap-1.5 h-36 sm:h-44">
          {data.revenue.map((value, i) => {
            const max = Math.max(...data.revenue);
            const height = max > 0 ? (value / max) * 100 : 0;
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 4)}%` }}
                  transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
                  className="w-full rounded-t-md bg-gradient-to-t from-blue-500/80 to-blue-400/50 min-h-[4px] relative"
                >
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-[#1a1a25] border border-white/10 text-[10px] text-white/70 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    ${value > 0 ? (value / 1000).toFixed(1) + "k" : "—"}
                  </div>
                </motion.div>
                <span className="text-[10px] text-white/25">{data.months?.[i] || ""}</span>
              </div>
            );
          })}
        </div>
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
          <div>
            <p className="text-[11px] text-white/30">This Month</p>
            <p className="text-lg font-bold text-white">$48,295</p>
          </div>
          <div className="text-right">
            <p className="text-[11px] text-white/30">Last Month</p>
            <p className="text-lg font-bold text-white/60">$45,000</p>
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
  emerald: { bg: "bg-emerald-500/10", border: "border-emerald-500/15", text: "text-emerald-400", iconBg: "bg-emerald-500/15" },
  blue: { bg: "bg-blue-500/10", border: "border-blue-500/15", text: "text-blue-400", iconBg: "bg-blue-500/15" },
  cyan: { bg: "bg-cyan-500/10", border: "border-cyan-500/15", text: "text-cyan-400", iconBg: "bg-cyan-500/15" },
  rose: { bg: "bg-rose-500/10", border: "border-rose-500/15", text: "text-rose-400", iconBg: "bg-rose-500/15" },
  amber: { bg: "bg-amber-500/10", border: "border-amber-500/15", text: "text-amber-400", iconBg: "bg-amber-500/15" },
  purple: { bg: "bg-purple-500/10", border: "border-purple-500/15", text: "text-purple-400", iconBg: "bg-purple-500/15" },
};

function HealthOverview() {
  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-blue-500/10 overflow-hidden"
    >
      <div className="px-5 sm:px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Health Overview</h3>
          <p className="text-[11px] text-white/30 mt-0.5">Your fitness metrics at a glance</p>
        </div>
        <Link
          to="/fitness-tools"
          className="text-[11px] text-blue-400 hover:text-blue-300 font-medium transition-colors"
        >
          All Tools
        </Link>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-white/[0.03]">
        {healthMetrics.map((metric, i) => {
          const Icon = metric.icon;
          const colors = healthColorMap[metric.color] || healthColorMap.blue;
          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05, duration: 0.4 }}
              className="p-4 flex flex-col items-center gap-2.5 hover:bg-white/[0.02] transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl ${colors.iconBg} border ${colors.border} flex items-center justify-center`}>
                <Icon className={`w-4.5 h-4.5 ${colors.text}`} />
              </div>
              <div className="text-center">
                <p className="text-lg font-bold text-white">{metric.value}</p>
                <p className="text-[10px] text-white/30 mt-0.5">{metric.label}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${colors.bg} ${colors.text}`}>
                  {metric.status}
                </span>
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
  const maxCal = Math.max(...calories);

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-blue-500/10 overflow-hidden"
    >
      <div className="px-5 sm:px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Weekly Progress</h3>
          <p className="text-[11px] text-white/30 mt-0.5">Workout completion & calorie trend</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-white/30">Workout</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-blue-400" />
            <span className="text-[10px] text-white/30">Calories</span>
          </div>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        <div className="flex items-end gap-2 h-32 sm:h-40">
          {days.map((day, i) => {
            const height = maxCal > 0 ? (calories[i] / maxCal) * 100 : 0;
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(height, 8)}%` }}
                  transition={{ delay: 0.2 + i * 0.05, duration: 0.5, ease: "easeOut" }}
                  className={`w-full rounded-t-md min-h-[8px] ${
                    workouts[i] ? "bg-gradient-to-t from-emerald-500/80 to-emerald-400/50" : "bg-white/5"
                  }`}
                />
                <span className={`text-[10px] font-medium ${workouts[i] ? "text-white/50" : "text-white/20"}`}>{day}</span>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

function TodaysWorkout() {
  const exercises = [
    { name: "Bench Press", sets: "4 × 8", status: "done" },
    { name: "Squats", sets: "4 × 10", status: "done" },
    { name: "Deadlift", sets: "3 × 6", status: "current" },
    { name: "Pull-ups", sets: "3 × 12", status: "upcoming" },
    { name: "Shoulder Press", sets: "3 × 10", status: "upcoming" },
  ];

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-blue-500/10 overflow-hidden"
    >
      <div className="px-5 sm:px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Today&apos;s Workout</h3>
          <p className="text-[11px] text-white/30 mt-0.5">Push Day - Upper Body</p>
        </div>
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/15">
          <FiTarget className="w-3 h-3 text-emerald-400" />
          <span className="text-[11px] font-bold text-emerald-400">2/5 Done</span>
        </div>
      </div>
      <div className="divide-y divide-white/[0.03]">
        {exercises.map((ex, i) => (
          <div key={i} className="px-5 sm:px-6 py-3 flex items-center gap-3">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              ex.status === "done"
                ? "bg-emerald-500/15"
                : ex.status === "current"
                ? "bg-blue-500/15 border border-blue-500/25"
                : "bg-white/5"
            }`}>
              {ex.status === "done" ? (
                <FiTarget className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <span className="text-[10px] font-bold text-white/30">{i + 1}</span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className={`text-sm font-medium ${
                ex.status === "done" ? "text-white/40 line-through" : ex.status === "current" ? "text-white" : "text-white/60"
              }`}>
                {ex.name}
              </p>
              <p className="text-[11px] text-white/25 mt-0.5">{ex.sets}</p>
            </div>
            {ex.status === "done" && (
              <FiSun className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            {ex.status === "current" && (
              <div className="w-4 h-4 rounded-full border-2 border-blue-400 border-t-transparent animate-spin shrink-0" />
            )}
          </div>
        ))}
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

  return (
    <ChartCard
      title="Membership Breakdown"
      subtitle="Active plans distribution"
      color="purple"
    >
      <DonutChart segments={segments} color="purple" />
    </ChartCard>
  );
}

function BookingsChart() {
  const data = getRevenueData();

  return (
    <ChartCard
      title="Bookings Trend"
      subtitle="Monthly booking count"
      color="emerald"
      type="bar"
      data={data.bookings}
    />
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
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <WelcomeBanner />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} {...stat} pageKey="dashboard" index={i} />
        ))}
      </div>

      <QuickActions />

      <HealthOverview />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <RevenueOverview />
          <BookingsChart />
        </div>
        <div className="space-y-6">
          <MembershipBreakdown />
          <RecentActivities />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <WeeklyProgress />
        <TodaysWorkout />
        <div className="space-y-6">
          <UpcomingBookings />
        </div>
      </div>

      <RecentMembers />
    </motion.div>
  );
}

export default Overview;
