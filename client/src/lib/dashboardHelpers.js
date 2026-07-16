const accentFocusMap = {
  blue: "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/15 dark:focus:ring-blue-500/20 dark:focus:border-blue-400",
  orange: "focus:border-orange-500 focus:ring-2 focus:ring-orange-500/15 dark:focus:ring-orange-500/20 dark:focus:border-orange-400",
  purple: "focus:border-purple-500 focus:ring-2 focus:ring-purple-500/15 dark:focus:ring-purple-500/20 dark:focus:border-purple-400",
  indigo: "focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 dark:focus:ring-indigo-500/20 dark:focus:border-indigo-400",
  emerald: "focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/15 dark:focus:ring-emerald-500/20 dark:focus:border-emerald-400",
  cyan: "focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/15 dark:focus:ring-cyan-500/20 dark:focus:border-cyan-400",
  yellow: "focus:border-yellow-500 focus:ring-2 focus:ring-yellow-500/15 dark:focus:ring-yellow-500/20 dark:focus:border-yellow-400",
  pink: "focus:border-pink-500 focus:ring-2 focus:ring-pink-500/15 dark:focus:ring-pink-500/20 dark:focus:border-pink-400",
  sky: "focus:border-sky-500 focus:ring-2 focus:ring-sky-500/15 dark:focus:ring-sky-500/20 dark:focus:border-sky-400",
  red: "focus:border-red-500 focus:ring-2 focus:ring-red-500/15 dark:focus:ring-red-500/20 dark:focus:border-red-400",
  slate: "focus:border-slate-500 focus:ring-2 focus:ring-slate-500/15 dark:focus:ring-slate-500/20 dark:focus:border-slate-400",
  violet: "focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15 dark:focus:ring-violet-500/20 dark:focus:border-violet-400",
  coral: "focus:border-orange-400 focus:ring-2 focus:ring-orange-400/15 dark:focus:ring-orange-400/20 dark:focus:border-orange-300",
  royal: "focus:border-blue-600 focus:ring-2 focus:ring-blue-600/15 dark:focus:ring-blue-600/20 dark:focus:border-blue-500",
};

export function getInputClass(accent = "blue") {
  return `w-full px-4 py-2.5 rounded-xl bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 outline-none transition-all duration-200 hover:border-gray-300 dark:hover:border-white/20 ${accentFocusMap[accent] || accentFocusMap.blue}`;
}

export function getTextareaClass(accent = "blue") {
  return `${getInputClass(accent)} resize-none min-h-[100px]`;
}
