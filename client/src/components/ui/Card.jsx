import PropTypes from "prop-types";

function Card({ children, className = "", hover = true, glow = "" }) {
  return (
    <div
      className={`rounded-2xl bg-base-200/60 backdrop-blur-xl border border-base-300/50 overflow-hidden
        transition-all duration-300
        ${hover ? "hover:shadow-xl hover:-translate-y-0.5" : ""}
        ${glow ? `hover:shadow-lg hover:${glow}/10 hover:border-${glow}/20` : "hover:border-primary/20 hover:shadow-primary/5"}
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
