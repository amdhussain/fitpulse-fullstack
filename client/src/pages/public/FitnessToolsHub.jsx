import { useState, useMemo } from "react";
import PropTypes from "prop-types";
import { tools, categories } from "../../lib/fitnessTools";
import { ToolCard } from "../../components/fitness";
import { Container } from "../../components/ui";

function FitnessToolsHub({ embedded = false }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredTools = useMemo(() => {
    return tools.filter((tool) => {
      const matchesSearch =
        tool.name.toLowerCase().includes(search.toLowerCase()) ||
        tool.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === "all" || tool.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <div className={embedded ? "" : "min-h-screen bg-gray-50 dark:bg-gray-900 pt-20"}>
      <div className="bg-gradient-to-br from-cyan-500 to-blue-600 text-white">
        <Container className="py-12 sm:py-16">
          <h1 className="text-3xl sm:text-4xl font-bold">Fitness Tools</h1>
          <p className="text-white/80 mt-2 max-w-lg text-lg">
            Free calculators to help you track nutrition, fitness, and health metrics.
          </p>
          <div className="mt-6 max-w-md">
            <input
              type="text"
              placeholder="Search calculators..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20 text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 text-base"
            />
          </div>
        </Container>
      </div>
      <Container className="py-6 sm:py-8">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveCategory("all")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              activeCategory === "all"
                ? "bg-blue-600 text-white shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
            }`}
          >
            All ({tools.length})
          </button>
          {categories.map((cat) => {
            const count = tools.filter((t) => t.category === cat.value).length;
            return (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeCategory === cat.value
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600"
                }`}
              >
                {cat.label} ({count})
              </button>
            );
          })}
        </div>
      </Container>
      <Container className="pb-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTools.map((tool, i) => (
            <ToolCard key={tool.id} tool={tool} index={i} />
          ))}
        </div>
        {filteredTools.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No calculators found matching your search.</p>
          </div>
        )}
      </Container>
    </div>
  );
}

FitnessToolsHub.propTypes = {
  embedded: PropTypes.bool,
};

export default FitnessToolsHub;
