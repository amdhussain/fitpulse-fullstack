import PropTypes from "prop-types";
import { NavLink } from "react-router-dom";
import { iconMap, colorMap } from "../../lib/fitnessTools";
import { Container, Button } from "../ui";

function FitnessLayout({ tool, children }) {
  const Icon = iconMap[tool.icon] || iconMap.FiActivity;
  const colors = colorMap[tool.color] || colorMap.blue;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20">
      <div className={`relative bg-gradient-to-br ${colors.gradient} text-white overflow-hidden`}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-40 h-40 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 w-60 h-60 rounded-full bg-white/10 blur-3xl" />
        </div>
        <Container className="relative py-12 sm:py-16">
          <NavLink to="/fitness-tools" className="inline-flex items-center gap-1.5 text-white/70 hover:text-white text-base mb-4 transition-colors">
            <span>&larr;</span> All Tools
          </NavLink>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Icon className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">{tool.name}</h1>
              <p className="text-white/80 text-base mt-1">{tool.description}</p>
            </div>
          </div>
        </Container>
      </div>
      <Container className="py-8 sm:py-12">
        <div className="max-w-2xl mx-auto">
          {children}
        </div>
      </Container>
      <Container className="pb-12">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">About This Calculator</h3>
            <p className="text-base text-gray-600 dark:text-gray-300 leading-relaxed">{tool.description}</p>
          </div>
        </div>
      </Container>
    </div>
  );
}

FitnessLayout.propTypes = {
  tool: PropTypes.object.isRequired,
  children: PropTypes.node.isRequired,
};

export default FitnessLayout;
