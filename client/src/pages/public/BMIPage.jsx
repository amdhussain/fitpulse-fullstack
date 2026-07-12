import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FiPieChart,
  FiZap,
  FiTarget,
  FiDroplet,
  FiHeart,
  FiShield,
  FiActivity,
  FiCheck,
  FiInfo,
} from "react-icons/fi";
import { Container } from "../../components/ui";
import CalculatorBanner from "../../components/fitness/CalculatorBanner";
import FitnessFAQ from "../../components/fitness/FitnessFAQ";
import FitnessCTA from "../../components/fitness/FitnessCTA";
import {
  calculateBMI,
  calculateCalories,
  calculateIdealWeight,
  calculateWaterIntake,
  calculateProtein,
  calculateBodyFat,
} from "../../lib/fitnessCalculations";
import { getToolConfig } from "../../lib/fitnessToolsData";
import { colorSchemes } from "../../lib/fitnessToolsData";
import { staggerContainer, fadeUp } from "../../lib/animations";

const metricCards = [
  { key: "bmi", label: "BMI", icon: FiPieChart, color: "cyan", unit: "", placeholder: "--" },
  { key: "calories", label: "Daily Calories", icon: FiZap, color: "emerald", unit: "kcal", placeholder: "--" },
  { key: "idealWeight", label: "Ideal Weight", icon: FiTarget, color: "purple", unit: "", placeholder: "--" },
  { key: "water", label: "Water Intake", icon: FiDroplet, color: "blue", unit: "L", placeholder: "--" },
  { key: "protein", label: "Protein Intake", icon: FiHeart, color: "rose", unit: "g", placeholder: "--" },
  { key: "bodyFat", label: "Body Fat %", icon: FiShield, color: "orange", unit: "%", placeholder: "--" },
  { key: "bmr", label: "BMR", icon: FiActivity, color: "amber", unit: "kcal", placeholder: "--" },
];

function MetricCard({ metric, value, category, description, animated }) {
  const colors = colorSchemes[metric.color] || colorSchemes.cyan;
  const Icon = metric.icon;
  const hasValue = value !== null && value !== undefined && value !== "--";

  return (
    <motion.div
      variants={fadeUp}
      className={`relative rounded-2xl bg-gradient-to-br ${colors.bg} backdrop-blur-xl border ${colors.border} p-5 sm:p-6 shadow-xl ${colors.glow} transition-all duration-300 hover:-translate-y-1`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-xl bg-white/[0.06] border border-white/[0.08]`}>
          <Icon className={`w-5 h-5 ${colors.text}`} />
        </div>
        {hasValue && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
            className="p-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/30"
          >
            <FiCheck className="w-3 h-3 text-emerald-400" />
          </motion.div>
        )}
      </div>

      <p className="text-xs font-medium text-white/40 uppercase tracking-wider mb-2">{metric.label}</p>

      <motion.div
        key={animated ? `val-${value}` : "empty"}
        initial={animated ? { opacity: 0, y: 10, scale: 0.95 } : false}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.4, type: "spring", stiffness: 150 }}
      >
        <div className="flex items-baseline gap-1.5">
          <span className={`text-3xl sm:text-4xl font-black ${hasValue ? colors.text : "text-white/15"}`}>
            {value ?? metric.placeholder}
          </span>
          {hasValue && metric.unit && (
            <span className="text-sm font-medium text-white/35">{metric.unit}</span>
          )}
        </div>
      </motion.div>

      {category && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-3"
        >
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${colors.bg} border ${colors.border} text-xs font-semibold ${colors.text}`}>
            <FiCheck className="w-3 h-3" />
            {category}
          </span>
        </motion.div>
      )}

      {description && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-3 text-xs text-white/35 leading-relaxed line-clamp-2"
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}

function DetailRow({ label, value, color = "cyan" }) {
  const colors = colorSchemes[color] || colorSchemes.cyan;
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
      <FiInfo className={`w-4 h-4 ${colors.text} shrink-0`} />
      <div>
        <p className="text-xs text-white/40">{label}</p>
        <p className="text-sm font-medium text-white/80">{value}</p>
      </div>
    </div>
  );
}

const inputBase =
  "w-full px-4 py-3 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 transition-all duration-300 text-sm";

const activityLevels = [
  { value: "sedentary", label: "Sedentary", description: "Little or no exercise" },
  { value: "light", label: "Lightly Active", description: "Light exercise 1-3 days/week" },
  { value: "moderate", label: "Moderately Active", description: "Moderate exercise 3-5 days/week" },
  { value: "active", label: "Very Active", description: "Hard exercise 6-7 days/week" },
  { value: "extra", label: "Extra Active", description: "Very hard exercise, physical job" },
];

function BMICalculatorPage() {
  const [loading, setLoading] = useState(true);
  const [unit, setUnit] = useState("metric");
  const [values, setValues] = useState({});
  const [calculated, setCalculated] = useState(false);
  const [results, setResults] = useState({});
  const [animKey, setAnimKey] = useState(0);
  const config = getToolConfig("bmi");

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    setValues({});
    setCalculated(false);
    setResults({});
  };

  const handleValuesChange = (updater) => {
    setValues((prev) => (typeof updater === "function" ? updater(prev) : { ...prev, ...updater }));
  };

  const metricFields = {
    metric: [
      { name: "weight", label: "Weight", placeholder: "70", unit: "kg", type: "number", min: 20, max: 300 },
      { name: "height", label: "Height", placeholder: "170", unit: "cm", type: "number", min: 100, max: 250 },
      { name: "age", label: "Age", placeholder: "28", unit: "yrs", type: "number", min: 10, max: 120 },
    ],
    imperial: [
      { name: "weight", label: "Weight", placeholder: "154", unit: "lbs", type: "number", min: 50, max: 600 },
      { name: "height", label: "Height", placeholder: "67", unit: "in", type: "number", min: 36, max: 96 },
      { name: "age", label: "Age", placeholder: "28", unit: "yrs", type: "number", min: 10, max: 120 },
    ],
  };

  const fields = metricFields[unit] || metricFields.metric;

  const handleCalculate = () => {
    const weight = parseFloat(values.weight) || 0;
    const heightVal = parseFloat(values.height) || 0;
    const age = parseFloat(values.age) || 28;
    const gender = values.gender || "male";
    const activity = values.activity || "moderate";

    if (!weight || !heightVal) return;

    const bmiRes = calculateBMI(weight, heightVal, unit);

    const bmrRes = calculateCalories(weight, heightVal, age, gender, activity, unit);

    const idealRes = calculateIdealWeight(heightVal, gender, unit);

    const waterRes = calculateWaterIntake(weight, activity, unit);

    const proteinRes = calculateProtein(weight, activity, "maintain", unit);

    let bodyFatRes = { bodyFat: null, category: "Need measurements", description: "Enter neck & waist for body fat %" };
    if (values.neck && values.waist) {
      const neck = parseFloat(values.neck) || 0;
      const waist = parseFloat(values.waist) || 0;
      if (neck > 0 && waist > 0) {
        bodyFatRes = calculateBodyFat(gender, age, weight, neck, waist, heightVal, unit);
      }
    }

    setResults({
      bmi: { value: bmiRes.bmi?.toFixed(1), category: bmiRes.category, description: bmiRes.description, color: bmiRes.color },
      bmr: { value: bmrRes.bmr, category: `BMR Level`, description: bmrRes.description, color: "amber" },
      calories: { value: bmrRes.maintenance, category: bmrRes.activityLabel, description: bmrRes.description, color: "emerald" },
      idealWeight: { value: idealRes.ideal, category: idealRes.range, description: idealRes.description, color: "purple" },
      water: { value: waterRes.liters, category: `${waterRes.glasses} glasses`, description: waterRes.description, color: "blue" },
      protein: { value: proteinRes.ideal, category: `${proteinRes.min}-${proteinRes.max}g range`, description: proteinRes.description, color: "rose" },
      bodyFat: { value: bodyFatRes.bodyFat, category: bodyFatRes.category, description: bodyFatRes.description, color: bodyFatRes.color || "orange" },
    });
    setCalculated(true);
    setAnimKey((k) => k + 1);
  };

  const getCardValue = (key) => {
    if (!calculated || !results[key]) return null;
    return results[key].value;
  };
  const getCardCategory = (key) => {
    if (!calculated || !results[key]) return null;
    return results[key].category;
  };
  const getCardDescription = (key) => {
    if (!calculated || !results[key]) return null;
    return results[key].description;
  };

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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <div key={i} className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-5 space-y-3">
                      <div className="h-10 w-10 rounded-xl bg-white/10 skeleton-shimmer" />
                      <div className="h-3 w-20 rounded bg-white/10 skeleton-shimmer" />
                      <div className="h-8 w-16 rounded bg-white/10 skeleton-shimmer" />
                    </div>
                  ))}
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
                    <FiPieChart className="w-5 h-5 text-cyan-400" />
                    Enter Your Details
                  </h3>

                  <div className="space-y-5">
                    <div className="flex rounded-xl bg-white/[0.04] border border-white/[0.08] p-1">
                      {config.unitOptions?.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => handleUnitChange(opt.value)}
                          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                            unit === opt.value
                              ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                              : "text-white/40 hover:text-white/60"
                          }`}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <label className="text-sm font-medium text-white/60">{field.label}</label>
                          <div className="relative">
                            <input
                              type="number"
                              value={values[field.name] || ""}
                              onChange={(e) => handleValuesChange({ [field.name]: e.target.value })}
                              placeholder={field.placeholder}
                              min={field.min}
                              max={field.max}
                              className={`${inputBase} pr-12`}
                            />
                            {field.unit && (
                              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-white/30 font-medium">
                                {field.unit}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">Gender</label>
                        <div className="flex rounded-xl bg-white/[0.04] border border-white/[0.08] p-1">
                          {["male", "female"].map((g) => (
                            <button
                              key={g}
                              onClick={() => handleValuesChange({ gender: g })}
                              className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
                                (values.gender || "male") === g
                                  ? "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25"
                                  : "text-white/40 hover:text-white/60"
                              }`}
                            >
                              {g.charAt(0).toUpperCase() + g.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium text-white/60">Activity Level</label>
                        <div className="relative">
                          <select
                            value={values.activity || "moderate"}
                            onChange={(e) => handleValuesChange({ activity: e.target.value })}
                            className={`${inputBase} appearance-none cursor-pointer`}
                          >
                            {activityLevels.map((level) => (
                              <option key={level.value} value={level.value}>{level.label}</option>
                            ))}
                          </select>
                          <FiActivity className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-white/[0.02] border border-white/[0.05] p-4">
                      <p className="text-xs text-white/30 mb-3 flex items-center gap-1.5">
                        <FiInfo className="w-3 h-3" />
                        Optional: For body fat estimation (U.S. Navy method)
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/60">
                            Neck circumference
                            <span className="text-white/25 ml-1">({unit === "imperial" ? "in" : "cm"})</span>
                          </label>
                          <input
                            type="number"
                            value={values.neck || ""}
                            onChange={(e) => handleValuesChange({ neck: e.target.value })}
                            placeholder={unit === "imperial" ? "15" : "38"}
                            className={inputBase}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-white/60">
                            Waist circumference
                            <span className="text-white/25 ml-1">({unit === "imperial" ? "in" : "cm"})</span>
                          </label>
                          <input
                            type="number"
                            value={values.waist || ""}
                            onChange={(e) => handleValuesChange({ waist: e.target.value })}
                            placeholder={unit === "imperial" ? "32" : "81"}
                            className={inputBase}
                          />
                        </div>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleCalculate}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-600 to-emerald-600 hover:from-cyan-500 hover:to-emerald-500 text-white font-semibold text-sm shadow-lg shadow-cyan-500/25 hover:shadow-xl hover:shadow-cyan-500/30 transition-all duration-300"
                    >
                      Calculate All Metrics
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <FiActivity className="w-5 h-5 text-cyan-400" />
                  </div>
                  <h3 className="text-lg font-bold text-white">
                    {calculated ? "Your Results" : "Results Will Appear Here"}
                  </h3>
                </div>

                <motion.div
                  key={animKey}
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                  {metricCards.map((metric) => (
                    <MetricCard
                      key={metric.key}
                      metric={metric}
                      value={getCardValue(metric.key)}
                      category={getCardCategory(metric.key)}
                      description={getCardDescription(metric.key)}
                      animated={calculated}
                    />
                  ))}
                </motion.div>

                {calculated && results.bmi && (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3"
                  >
                    <DetailRow label="Weight Used" value={`${values.weight} ${unit === "imperial" ? "lbs" : "kg"}`} color="cyan" />
                    <DetailRow label="Height Used" value={unit === "imperial" ? `${values.height} in` : `${values.height} cm`} color="cyan" />
                    <DetailRow label="Age" value={`${values.age || 28} years`} color="cyan" />
                    <DetailRow label="Gender" value={(values.gender || "male").charAt(0).toUpperCase() + (values.gender || "male").slice(1)} color="cyan" />
                  </motion.div>
                )}
              </div>
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
                    <div key={i} className="flex items-start gap-3 px-4 py-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                      <span className="text-cyan-400 font-bold text-sm shrink-0">{i + 1}.</span>
                      <p className="text-sm text-white/45 leading-relaxed">{tip}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              {calculated && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="rounded-2xl bg-gradient-to-br from-cyan-500/10 to-emerald-500/10 backdrop-blur-xl border border-cyan-500/20 p-6"
                >
                  <h3 className="text-sm font-bold text-cyan-400 uppercase tracking-wider mb-3">Quick Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">BMI</span>
                      <span className="text-white/80 font-medium">{results.bmi?.value} — {results.bmi?.category}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Calories</span>
                      <span className="text-white/80 font-medium">{results.calories?.value} kcal/day</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Water</span>
                      <span className="text-white/80 font-medium">{results.water?.value} L/day</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-white/50">Protein</span>
                      <span className="text-white/80 font-medium">{results.protein?.value} g/day</span>
                    </div>
                  </div>
                </motion.div>
              )}
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

export default BMICalculatorPage;
