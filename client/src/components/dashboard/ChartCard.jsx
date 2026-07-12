import { motion } from "framer-motion";
import { fadeUp } from "../../lib/animations";

const colorMap = {
  blue: {
    bar: "from-blue-500/80 to-blue-400/60",
    barBg: "bg-blue-500/10",
    border: "border-blue-500/10",
    hoverBorder: "hover:border-blue-500/25",
    dot: "bg-blue-400",
    label: "text-blue-400",
  },
  emerald: {
    bar: "from-emerald-500/80 to-emerald-400/60",
    barBg: "bg-emerald-500/10",
    border: "border-emerald-500/10",
    hoverBorder: "hover:border-emerald-500/25",
    dot: "bg-emerald-400",
    label: "text-emerald-400",
  },
  purple: {
    bar: "from-purple-500/80 to-purple-400/60",
    barBg: "bg-purple-500/10",
    border: "border-purple-500/10",
    hoverBorder: "hover:border-purple-500/25",
    dot: "bg-purple-400",
    label: "text-purple-400",
  },
  cyan: {
    bar: "from-cyan-500/80 to-cyan-400/60",
    barBg: "bg-cyan-500/10",
    border: "border-cyan-500/10",
    hoverBorder: "hover:border-cyan-500/25",
    dot: "bg-cyan-400",
    label: "text-cyan-400",
  },
  amber: {
    bar: "from-amber-500/80 to-amber-400/60",
    barBg: "bg-amber-500/10",
    border: "border-amber-500/10",
    hoverBorder: "hover:border-amber-500/25",
    dot: "bg-amber-400",
    label: "text-amber-400",
  },
  rose: {
    bar: "from-rose-500/80 to-rose-400/60",
    barBg: "bg-rose-500/10",
    border: "border-rose-500/10",
    hoverBorder: "hover:border-rose-500/25",
    dot: "bg-rose-400",
    label: "text-rose-400",
  },
};

function BarChart({ data, maxValue, color = "blue" }) {
  const colors = colorMap[color] || colorMap.blue;
  const max = maxValue || Math.max(...data);

  return (
    <div className="flex items-end gap-1.5 h-32 sm:h-40">
      {data.map((value, i) => {
        const height = max > 0 ? (value / max) * 100 : 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(height, 4)}%` }}
              transition={{ delay: i * 0.05, duration: 0.5, ease: "easeOut" }}
              className={`w-full rounded-t-md bg-gradient-to-t ${colors.bar} min-h-[4px] relative group`}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-[#1a1a25] border border-white/10 text-[10px] text-white/70 font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                {typeof value === "number" && value > 999
                  ? `$${(value / 1000).toFixed(1)}k`
                  : value}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

function LineChart({ data, color = "blue" }) {
  const max = Math.max(...data);
  const points = data
    .map((v, i) => {
      const x = (i / (data.length - 1)) * 100;
      const y = max > 0 ? 100 - (v / max) * 80 - 10 : 50;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="h-32 sm:h-40 relative">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`gradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color === "blue" ? "#3b82f6" : "#10b981"} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color === "blue" ? "#3b82f6" : "#10b981"} stopOpacity="0" />
          </linearGradient>
        </defs>
        <motion.polyline
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          points={points}
          fill="none"
          stroke={color === "blue" ? "#3b82f6" : "#10b981"}
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
    </div>
  );
}

function DonutChart({ segments }) {
  const total = segments.reduce((sum, s) => sum + s.value, 0);

  return (
    <div className="flex items-center gap-6">
      <div className="relative w-28 h-28 sm:w-32 sm:h-32 shrink-0">
        <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
          {segments.map((segment, i) => {
            const pct = total > 0 ? (segment.value / total) * 100 : 0;
            const dashArray = `${pct} ${100 - pct}`;
            const offset = segments.slice(0, i).reduce((sum, s) => sum + (total > 0 ? (s.value / total) * 100 : 0), 0);
            const dashOffset = -offset;
            return (
              <motion.circle
                key={i}
                cx="18"
                cy="18"
                r="14"
                fill="none"
                stroke={segment.color}
                strokeWidth="3.5"
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.15, duration: 0.4 }}
                strokeLinecap="round"
              />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-white">{total}</span>
          <span className="text-[9px] text-white/30">Total</span>
        </div>
      </div>
      <div className="space-y-2.5">
        {segments.map((segment, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0"
              style={{ backgroundColor: segment.color }}
            />
            <span className="text-xs text-white/50">{segment.label}</span>
            <span className="text-xs font-semibold text-white/70 ml-auto">
              {segment.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, color = "blue", type = "bar", data, children, className = "" }) {
  const colors = colorMap[color] || colorMap.blue;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={`rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border ${colors.border} ${colors.hoverBorder} transition-all duration-300 overflow-hidden ${className}`}
    >
      <div className="px-5 sm:px-6 py-4 border-b border-white/5 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {subtitle && <p className="text-[11px] text-white/30 mt-0.5">{subtitle}</p>}
        </div>
        <div className={`w-2 h-2 rounded-full ${colors.dot}`} />
      </div>
      <div className="p-5 sm:p-6">
        {children || (
          <>
            {type === "bar" && data && <BarChart data={data} color={color} />}
            {type === "line" && data && <LineChart data={data} color={color} />}
          </>
        )}
      </div>
    </motion.div>
  );
}

export { BarChart, LineChart, DonutChart };
export default ChartCard;
