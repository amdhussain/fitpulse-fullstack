import PropTypes from "prop-types";

const variants = {
  primary: "bg-primary text-primary-content hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30",
  secondary: "bg-secondary text-secondary-content hover:bg-secondary/90 shadow-lg shadow-secondary/25",
  outline: "border-2 border-primary text-primary hover:bg-primary hover:text-primary-content",
  ghost: "text-base-content/60 hover:bg-base-300/50 hover:text-base-content",
  accent: "bg-accent text-base-100 hover:bg-accent/90 shadow-lg shadow-accent/25",
  blue: "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/30",
  orange: "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-500/25",
  purple: "bg-purple-500 text-white hover:bg-purple-600 shadow-lg shadow-purple-500/25",
  indigo: "bg-indigo-500 text-white hover:bg-indigo-600 shadow-lg shadow-indigo-500/25",
  emerald: "bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/25",
  green: "bg-green-500 text-white hover:bg-green-600 shadow-lg shadow-green-500/25",
  cyan: "bg-cyan-500 text-white hover:bg-cyan-600 shadow-lg shadow-cyan-500/25",
  royal: "bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/25",
  amber: "bg-amber-500 text-white hover:bg-amber-600 shadow-lg shadow-amber-500/25",
  violet: "bg-violet-500 text-white hover:bg-violet-600 shadow-lg shadow-violet-500/25",
  teal: "bg-teal-500 text-white hover:bg-teal-600 shadow-lg shadow-teal-500/25",
  yellow: "bg-yellow-500 text-black hover:bg-yellow-600 shadow-lg shadow-yellow-500/25",
  rose: "bg-rose-500 text-white hover:bg-rose-600 shadow-lg shadow-rose-500/25",
  sky: "bg-sky-500 text-white hover:bg-sky-600 shadow-lg shadow-sky-500/25",
  red: "bg-red-500 text-white hover:bg-red-600 shadow-lg shadow-red-500/25",
  pink: "bg-pink-500 text-white hover:bg-pink-600 shadow-lg shadow-pink-500/25",
  coral: "bg-orange-400 text-white hover:bg-orange-500 shadow-lg shadow-orange-400/25",
  slate: "bg-slate-500 text-white hover:bg-slate-600 shadow-lg shadow-slate-500/25",
};

const sizes = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-2.5 text-sm",
  lg: "px-8 py-3.5 text-base",
};

function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled = false,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold
        transition-all duration-300 ease-out cursor-pointer select-none
        active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100
        ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node.isRequired,
  variant: PropTypes.oneOf([
    "primary", "secondary", "outline", "ghost", "accent",
    "blue", "orange", "purple", "indigo", "emerald", "green", "cyan", "royal",
    "amber", "violet", "teal", "yellow", "rose", "sky", "red", "pink", "coral", "slate",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  className: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Button;
