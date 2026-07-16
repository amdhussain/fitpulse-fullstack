import { useState } from "react";
import PropTypes from "prop-types";

const variants = {
  primary: "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-md shadow-blue-600/25 hover:shadow-lg hover:shadow-blue-600/30 dark:shadow-blue-600/15 dark:hover:shadow-blue-600/25",
  secondary: "bg-gray-100 dark:bg-white/5 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10",
  outline: "border-2 border-gray-200 dark:border-white/10 text-gray-700 dark:text-gray-300 hover:border-blue-400 dark:hover:border-blue-500/40 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-500/5",
  ghost: "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/5 hover:text-gray-700 dark:hover:text-gray-200",
  accent: "bg-gradient-to-r from-emerald-500 to-green-500 text-white hover:from-emerald-600 hover:to-green-600 shadow-md shadow-emerald-500/25 dark:shadow-emerald-500/15",
  blue: "bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:from-blue-700 hover:to-blue-600 shadow-md shadow-blue-500/25 dark:shadow-blue-500/15",
  orange: "bg-gradient-to-r from-orange-500 to-amber-500 text-white hover:from-orange-600 hover:to-amber-600 shadow-md shadow-orange-500/25 dark:shadow-orange-500/15",
  purple: "bg-gradient-to-r from-purple-600 to-violet-500 text-white hover:from-purple-700 hover:to-violet-600 shadow-md shadow-purple-500/25 dark:shadow-purple-500/15",
  indigo: "bg-gradient-to-r from-indigo-600 to-blue-500 text-white hover:from-indigo-700 hover:to-blue-600 shadow-md shadow-indigo-500/25 dark:shadow-indigo-500/15",
  emerald: "bg-gradient-to-r from-emerald-600 to-green-500 text-white hover:from-emerald-700 hover:to-green-600 shadow-md shadow-emerald-500/25 dark:shadow-emerald-500/15",
  green: "bg-gradient-to-r from-green-600 to-emerald-500 text-white hover:from-green-700 hover:to-emerald-600 shadow-md shadow-green-500/25 dark:shadow-green-500/15",
  cyan: "bg-gradient-to-r from-cyan-500 to-sky-500 text-white hover:from-cyan-600 hover:to-sky-600 shadow-md shadow-cyan-500/25 dark:shadow-cyan-500/15",
  royal: "bg-gradient-to-r from-blue-700 to-indigo-600 text-white hover:from-blue-800 hover:to-indigo-700 shadow-md shadow-blue-600/25 dark:shadow-blue-600/15",
  amber: "bg-gradient-to-r from-amber-500 to-yellow-400 text-white hover:from-amber-600 hover:to-yellow-500 shadow-md shadow-amber-500/25 dark:shadow-amber-500/15",
  violet: "bg-gradient-to-r from-violet-600 to-purple-500 text-white hover:from-violet-700 hover:to-purple-600 shadow-md shadow-violet-500/25 dark:shadow-violet-500/15",
  teal: "bg-gradient-to-r from-teal-500 to-cyan-500 text-white hover:from-teal-600 hover:to-cyan-600 shadow-md shadow-teal-500/25 dark:shadow-teal-500/15",
  yellow: "bg-gradient-to-r from-yellow-400 to-amber-400 text-yellow-900 hover:from-yellow-500 hover:to-amber-500 shadow-md shadow-yellow-400/25 dark:shadow-yellow-400/15",
  rose: "bg-gradient-to-r from-rose-500 to-pink-500 text-white hover:from-rose-600 hover:to-pink-600 shadow-md shadow-rose-500/25 dark:shadow-rose-500/15",
  sky: "bg-gradient-to-r from-sky-500 to-blue-400 text-white hover:from-sky-600 hover:to-blue-500 shadow-md shadow-sky-500/25 dark:shadow-sky-500/15",
  red: "bg-gradient-to-r from-red-500 to-rose-500 text-white hover:from-red-600 hover:to-rose-600 shadow-md shadow-red-500/25 dark:shadow-red-500/15",
  pink: "bg-gradient-to-r from-pink-500 to-rose-400 text-white hover:from-pink-600 hover:to-rose-500 shadow-md shadow-pink-500/25 dark:shadow-pink-500/15",
  coral: "bg-gradient-to-r from-orange-400 to-rose-400 text-white hover:from-orange-500 hover:to-rose-500 shadow-md shadow-orange-400/25 dark:shadow-orange-400/15",
  slate: "bg-gradient-to-r from-slate-600 to-gray-600 text-white hover:from-slate-700 hover:to-gray-700 shadow-md shadow-slate-500/25 dark:shadow-slate-500/15",
};

const sizes = {
  sm: "px-3 py-1.5 text-xs gap-1.5",
  md: "px-4 py-2 text-sm gap-2",
  lg: "px-6 py-3 text-sm gap-2",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  loading = false,
  ...props
}) {
  const [ripples, setRipples] = useState([]);

  const handleClick = (e) => {
    if (disabled || loading) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now();
    setRipples((prev) => [...prev, { id, x, y }]);
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600);
    props.onClick?.(e);
  };

  return (
    <button
      className={`relative inline-flex items-center justify-center rounded-xl font-semibold
        transition-all duration-200 ease-out cursor-pointer select-none overflow-hidden
        active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || loading}
      onClick={handleClick}
      {...props}
    >
      {loading && (
        <svg className="animate-spin h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      )}
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute w-0 h-0 rounded-full bg-white/30 pointer-events-none toast-enter"
          style={{ left: ripple.x, top: ripple.y, width: 40, height: 40, marginLeft: -20, marginTop: -20 }}
        />
      ))}
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.string,
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
  loading: PropTypes.bool,
};

export default Button;
