import PropTypes from "prop-types";

function SectionTitle({ subtitle, title, description, align = "center", className = "", accentColor = "primary" }) {
  const alignment = align === "center" ? "text-center" : "text-left";

  const colorMap = {
    primary: { badge: "bg-primary/10 border-primary/20 text-primary", dot: "bg-primary" },
    blue: { badge: "bg-blue-500/10 border-blue-500/20 text-blue-400", dot: "bg-blue-400" },
    orange: { badge: "bg-orange-500/10 border-orange-500/20 text-orange-400", dot: "bg-orange-400" },
    purple: { badge: "bg-purple-500/10 border-purple-500/20 text-purple-400", dot: "bg-purple-400" },
    indigo: { badge: "bg-indigo-500/10 border-indigo-500/20 text-indigo-400", dot: "bg-indigo-400" },
    emerald: { badge: "bg-emerald-500/10 border-emerald-500/20 text-emerald-400", dot: "bg-emerald-400" },
    green: { badge: "bg-green-500/10 border-green-500/20 text-green-400", dot: "bg-green-400" },
    cyan: { badge: "bg-cyan-500/10 border-cyan-500/20 text-cyan-400", dot: "bg-cyan-400" },
  };

  const colors = colorMap[accentColor] || colorMap.primary;

  return (
    <div className={`mb-12 ${alignment} ${className}`}>
      {subtitle && (
        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-semibold backdrop-blur-sm mb-4 ${colors.badge}`}>
          <span className={`w-2 h-2 rounded-full ${colors.dot}`} />
          {subtitle}
        </span>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-base-content leading-tight tracking-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-4 text-base-content/50 max-w-2xl text-lg leading-relaxed">
          {align === "center" ? (
            <span className="block mx-auto">{description}</span>
          ) : (
            description
          )}
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
