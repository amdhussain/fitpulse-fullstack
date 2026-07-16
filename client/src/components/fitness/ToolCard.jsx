import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { iconMap, colorMap } from "../../lib/fitnessTools";

function ToolCard({ tool, index }) {
  const Icon = iconMap[tool.icon] || iconMap.FiActivity;
  const colors = colorMap[tool.color] || colorMap.blue;

  return (
    <NavLink
      to={`/fitness-tools/${tool.slug}`}
      className="group block"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={`relative h-full p-5 rounded-2xl border ${colors.border} ${colors.bg}
        transition-all duration-300 hover:shadow-lg hover:-translate-y-1
        opacity-0 animate-[fadeInUp_0.4s_ease-out_forwards]`}>
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${colors.gradient}
          flex items-center justify-center text-white shadow-md mb-3
          group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-5 h-5" />
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white text-base mb-1">{tool.name}</h3>
        <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{tool.description}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <span>{tool.monthlyUsers?.toLocaleString()} users/mo</span>
        </div>
      </div>
    </NavLink>
  );
}

ToolCard.propTypes = {
  tool: PropTypes.object.isRequired,
  index: PropTypes.number,
};

export default ToolCard;
