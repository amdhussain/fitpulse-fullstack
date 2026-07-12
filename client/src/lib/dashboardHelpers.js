const accentFocusMap = {
  blue: "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20",
  orange: "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20",
  purple: "focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20",
  indigo: "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20",
  emerald: "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20",
  cyan: "focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20",
  yellow: "focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/20",
  pink: "focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20",
  sky: "focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20",
  red: "focus:border-red-500 focus:ring-2 focus:ring-red-500/20",
  slate: "focus:border-slate-500 focus:ring-2 focus:ring-slate-500/20",
  violet: "focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20",
  coral: "focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20",
  royal: "focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20",
};

export function getInputClass(accent = "blue") {
  return `w-full px-4 py-3 rounded-xl bg-gray-900/60 border border-gray-800/60 text-sm text-base-content placeholder:text-base-content/30 outline-none transition-all duration-200 ${accentFocusMap[accent] || accentFocusMap.blue}`;
}
