import PropTypes from "prop-types";

function Card({ children, className = "", hover = true, glow = "" }) {
  return (
    <div
      className={`rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden
        transition-all duration-300 shadow-sm
        ${hover ? "hover:shadow-md hover:-translate-y-0.5 hover:border-gray-300 dark:hover:border-gray-600" : ""}
        ${glow ? `hover:shadow-lg hover:${glow}/10 hover:border-${glow}/30` : "hover:border-blue-200 dark:hover:border-blue-800"}
        ${className}`}
    >
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  hover: PropTypes.bool,
  glow: PropTypes.string,
};

export default Card;
