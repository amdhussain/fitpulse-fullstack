import PropTypes from "prop-types";

function SectionTitle({ subtitle, title, description, align = "center", className = "", accentColor = "primary" }) {
  const alignment = align === "center" ? "text-center" : "text-left";

  const colorMap = {
    primary: { badge: "bg-primary/10 border-primary/20 text-primary", dot: "bg-primary" },
    blue: { badge: "bg-blue-50 border-blue-200 text-blue-600", dot: "bg-blue-500" },
    orange: { badge: "bg-orange-50 border-orange-200 text-orange-600", dot: "bg-orange-500" },
    purple: { badge: "bg-purple-50 border-purple-200 text-purple-600", dot: "bg-purple-500" },
    indigo: { badge: "bg-indigo-50 border-indigo-200 text-indigo-600", dot: "bg-indigo-500" },
    emerald: { badge: "bg-emerald-50 border-emerald-200 text-emerald-600", dot: "bg-emerald-500" },
    green: { badge: "bg-green-50 border-green-200 text-green-600", dot: "bg-green-500" },
    cyan: { badge: "bg-cyan-50 border-cyan-200 text-cyan-600", dot: "bg-cyan-500" },
  };

  const colors = colorMap[accentColor] || colorMap.primary;

  return (
    <div className={`mb-14 ${alignment} ${className}`}>
      {subtitle && (
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold backdrop-blur-sm mb-4 ${colors.badge}`}>
          <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-base-content leading-[1.1] tracking-[-0.02em]">
        {title}
      </h2>
      {description && (
        <p className="mt-6 text-gray-500 text-base sm:text-lg lg:text-xl leading-[1.8] max-w-[700px] mx-auto">
          {description}
        </p>
      )}
    </div>
  );
}

SectionTitle.propTypes = {
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  align: PropTypes.oneOf(["center", "left"]),
  className: PropTypes.string,
  accentColor: PropTypes.string,
};

export default SectionTitle;
