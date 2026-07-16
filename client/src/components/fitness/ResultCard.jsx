import PropTypes from "prop-types";
import { colorMap } from "../../lib/fitnessTools";

function ResultCard({ value, label, unit, color = "emerald" }) {
  const colors = colorMap[color] || colorMap.emerald;

  return (
    <div className={`p-4 rounded-xl border ${colors.border} ${colors.bg} text-center`}>
      <p className={`text-3xl font-bold ${colors.text}`}>{value}</p>
      {unit && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{unit}</p>}
      {label && <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{label}</p>}
    </div>
  );
}

ResultCard.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string,
  unit: PropTypes.string,
  color: PropTypes.string,
};

export default ResultCard;
