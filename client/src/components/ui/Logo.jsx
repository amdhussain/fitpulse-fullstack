import { Link } from "react-router-dom";

const colorMap = {
  primary: "bg-primary",
  blue: "bg-blue-500",
  purple: "bg-purple-500",
  emerald: "bg-emerald-500",
  cyan: "bg-cyan-500",
  royal: "bg-blue-600",
};

const textMap = {
  primary: "text-primary",
  blue: "text-blue-500",
  purple: "text-purple-500",
  emerald: "text-emerald-500",
  cyan: "text-cyan-500",
  royal: "text-blue-600",
};

function Logo({ size = "md", showText = true, className = "", color = "primary" }) {
  const sizes = {
    sm: { box: "w-8 h-8", text: "text-base", brand: "text-sm" },
    md: { box: "w-9 h-9", text: "text-lg", brand: "text-lg" },
    lg: { box: "w-11 h-11", text: "text-xl", brand: "text-xl" },
  };

  const s = sizes[size];
  const bgColor = colorMap[color] || colorMap.primary;
  const txtColor = textMap[color] || textMap.primary;

  return (
    <Link to="/" className={`flex items-center gap-2 group shrink-0 ${className}`}>
      <div
        className={`${s.box} rounded-xl ${bgColor} flex items-center justify-center transition-transform duration-300 group-hover:scale-110`}
      >
        <span className="text-white font-black leading-none">F</span>
      </div>
      {showText && (
        <span className={`${s.brand} font-bold text-gray-900`}>
          FitBook<span className={txtColor}>Pro</span>
        </span>
      )}
    </Link>
  );
}

export default Logo;
