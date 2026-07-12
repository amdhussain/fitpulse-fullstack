import { useState, useEffect } from "react";
import { Container } from "../ui";
import CalculatorBanner from "./CalculatorBanner";
import { CalculatorForm } from "./CalculatorInput";
import ResultCard, { ResultDetails } from "./ResultCard";
import FitnessRecommendations from "./FitnessRecommendations";
import FitnessFAQ from "./FitnessFAQ";
import FitnessCTA from "./FitnessCTA";
import { getRecommendations } from "../../lib/fitnessToolsData";
import { motion } from "framer-motion";

function TipCard({ tip, index }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      <span className="text-emerald-400 font-bold text-sm shrink-0">{index + 1}.</span>
      <p className="text-sm text-white/45 leading-relaxed">{tip}</p>
    </div>
  );
}

function FitnessLayout({ config, onCalculate, children, result, resultDetails }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const [unit, setUnit] = useState(config?.unitOptions?.[0]?.value || "metric");
  const [values, setValues] = useState({});
  const [showResult, setShowResult] = useState(false);

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    setValues({});
    setShowResult(false);
  };

  const fields = config?.fields?.[unit] || [];

  const handleCalculate = () => {
    const res = onCalculate(values, unit);
    setShowResult(true);
    if (children) children(res);
  };

  const recommendations = result ? getRecommendations(config?.id || "bmi", result) : null;

  if (!config) return null;

  if (loading) {
    return (
      <>
        <div className="relative min-h-[50vh] flex items-center overflow-hidden bg-gradient-to-br from-cyan-950/40 via-base-100 to-teal-950/20">
          <Container className="relative z-10 py-20">
            <div className="max-w-2xl space-y-6">
              <div className="h-5 w-32 rounded-lg bg-white/10 skeleton-shimmer" />
              <div className="h-8 w-44 rounded-full bg-white/10 skeleton-shimmer" />
              <div className="h-14 w-full rounded-xl bg-white/10 skeleton-shimmer" />
              <div className="h-5 w-full rounded-lg bg-white/10 skeleton-shimmer" />
            </div>
          </Container>
        </div>
        <div className="py-16 sm:py-24">
          <Container>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 sm:p-8 space-y-5">
                  <div className="h-6 w-40 rounded-lg bg-white/10 skeleton-shimmer" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="space-y-2">
                        <div className="h-4 w-20 rounded bg-white/10 skeleton-shimmer" />
                        <div className="h-12 w-full rounded-xl bg-white/10 skeleton-shimmer" />
                      </div>
                    ))}
                  </div>
                  <div className="h-12 w-full rounded-xl bg-white/10 skeleton-shimmer" />
                </div>
              </div>
              <div className="space-y-6">
                <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-6 space-y-4">
                  <div className="h-6 w-32 rounded-lg bg-white/10 skeleton-shimmer" />
                  <div className="h-48 w-full rounded-xl bg-white/10 skeleton-shimmer" />
                </div>
              </div>
            </div>
          </Container>
        </div>
      </>
    );
  }

  return (
    <>
      <CalculatorBanner
        title={config.title}
        subtitle={config.subtitle}
        description={config.description}
        Icon={config.icon}
        accentColor={config.accentColor}
        gradient={config.bannerGradient}
      />

      <section className="py-16 sm:py-24 bg-base-100">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
              >
                <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-6 sm:p-8">
                  <h3 className="text-lg font-bold text-white flex items-center gap-2 mb-6">
                    <config.icon className={`w-5 h-5 text-${config.accentColor}-400`} />
                    Enter Your Details
                  </h3>
                  <CalculatorForm
                    fields={fields}
                    unit={unit}
                    onUnitChange={handleUnitChange}
                    unitOptions={config.unitOptions}
                    values={values}
                    onChange={setValues}
                    onCalculate={handleCalculate}
                    accentColor={config.accentColor}
                  />
                </div>
              </motion.div>

              {showResult && result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <ResultCard
                    result={result}
                    accentColor={result.color || config.accentColor}
                    label={result.label || config.subtitle}
                    value={result.value || result.bmi || result.bmr || result.maintenance || result.ideal || result.liters || result.bodyFat}
                    unit={result.unit || ""}
                    category={result.category || result.level || ""}
                    description={result.description}
                  />

                  {resultDetails && (
                    <ResultDetails details={resultDetails} accentColor={result.color || config.accentColor} />
                  )}

                  {recommendations && (
                    <div className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-6 sm:p-8">
                      <h3 className="text-lg font-bold text-white mb-6">Your Personalized Recommendations</h3>
                      <FitnessRecommendations recommendations={recommendations} accentColor={config.accentColor} />
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="rounded-2xl bg-white/[0.03] backdrop-blur-xl border border-white/[0.06] p-6"
              >
                <h3 className="text-sm font-bold text-white/70 uppercase tracking-wider mb-4">Health Tips</h3>
                <div className="space-y-3">
                  {config.tips?.map((tip, i) => (
                    <TipCard key={i} tip={tip} index={i} />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-16 sm:py-24 bg-base-200/30">
        <Container>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h3 className="text-xl font-bold text-white mb-6 text-center">Frequently Asked Questions</h3>
            <FitnessFAQ items={config.faq || []} accentColor={config.accentColor} />
          </motion.div>
        </Container>
      </section>

      <FitnessCTA accentColor={config.accentColor} />
    </>
  );
}

export default FitnessLayout;
