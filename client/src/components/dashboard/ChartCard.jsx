import { motion } from "framer-motion";
import { fadeUp } from "../../lib/animations";

const colorConfig = {
  blue: { bar: "from-blue-500 to-blue-400", border: "border-gray-200", hoverBorder: "hover:border-blue-200", dot: "bg-blue-500", label: "text-blue-600", fill: "#3b82f6" },
  emerald: { bar: "from-emerald-500 to-emerald-400", border: "border-gray-200", hoverBorder: "hover:border-emerald-200", dot: "bg-emerald-500", label: "text-emerald-600", fill: "#10b981" },
  purple: { bar: "from-purple-500 to-purple-400", border: "border-gray-200", hoverBorder: "hover:border-purple-200", dot: "bg-purple-500", label: "text-purple-600", fill: "#a855f7" },
  cyan: { bar: "from-cyan-500 to-cyan-400", border: "border-gray-200", hoverBorder: "hover:border-cyan-200", dot: "bg-cyan-500", label: "text-cyan-600", fill: "#06b6d4" },
  amber: { bar: "from-amber-500 to-amber-400", border: "border-gray-200", hoverBorder: "hover:border-amber-200", dot: "bg-amber-500", label: "text-amber-600", fill: "#f59e0b" },
  rose: { bar: "from-rose-500 to-rose-400", border: "border-gray-200", hoverBorder: "hover:border-rose-200", dot: "bg-rose-500", label: "text-rose-600", fill: "#f43f5e" },
};

function BarChart({ data, maxValue, color = "blue" }) {
  const cfg = colorConfig[color] || colorConfig.blue;
  const max = maxValue || Math.max(...data, 1);

  return (
    <div className="flex items-end gap-1.5 h-44">
      {data.map((value, i) => {
        const height = max > 0 ? (value / max) * 100 : 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${Math.max(height, 3)}%` }}
              transition={{ delay: i * 0.04, duration: 0.5, ease: "easeOut" }}
              className={`w-full rounded-t-md bg-gradient-to-t ${cfg.bar} min-h-[3px] relative`}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded-md bg-gray-900 text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-lg">
                {typeof value === "number" && value > 999 ? `$${(value / 1000).toFixed(1)}k` : value}
              </div>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

function LineChart({ data, color = "blue" }) {
  const cfg = colorConfig[color] || colorConfig.blue;
  const max = Math.max(...data, 1);
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (v / max) * 80 - 10;
    return `${x},${y}`;
  }).join(" ");
  const areaPoints = `0,90 ${points} 100,90`;

  return (
    <div className="h-44 relative">
      <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
        <defs>
          <linearGradient id={`area-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={cfg.fill} stopOpacity="0.15" />
            <stop offset="100%" stopColor={cfg.fill} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={areaPoints} fill={`url(#area-${color})`} />
        <polyline points={points} fill="none" stroke={cfg.fill} strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
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
            return (
              <circle key={i} cx="18" cy="18" r="14" fill="none" stroke={segment.color} strokeWidth="3.5" strokeDasharray={dashArray} strokeDashoffset={-offset} strokeLinecap="round" style={{ opacity: 1 }} />
            );
          })}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-bold text-gray-900">{total}</span>
          <span className="text-[9px] text-gray-400">Total</span>
        </div>
      </div>
      <div className="space-y-2.5">
        {segments.map((segment, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: segment.color }} />
            <span className="text-xs text-gray-500">{segment.label}</span>
            <span className="text-xs font-semibold text-gray-700 ml-auto">{segment.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ChartCard({ title, subtitle, color = "blue", type = "bar", data, children, className = "" }) {
  const cfg = colorConfig[color] || colorConfig.blue;

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="visible"
      className={`rounded-2xl bg-white border ${cfg.border} ${cfg.hoverBorder} transition-all duration-300 overflow-hidden shadow-sm ${className}`}
    >
      <div className="px-5 sm:px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
          {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
        </div>
        <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
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
