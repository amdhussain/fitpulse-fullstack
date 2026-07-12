import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiActivity,
  FiDroplet,
  FiZap,
  FiHeart,
  FiShield,
  FiPieChart,
  FiRefreshCw,
} from "react-icons/fi";
import { Button, Skeleton } from "../../components/ui";
import { staggerContainer, fadeUp } from "../../lib/animations";
import PageBanner from "../../components/dashboard/PageBanner";
import { getInputClass } from "../../lib/dashboardHelpers";
import {
  calculateBMI,
  calculateCalories,
  calculateIdealWeight,
  calculateWaterIntake,
  calculateProtein,
  calculateBodyFat,
} from "../../lib/fitnessCalculations";

const tabs = [
  { id: "bmi", label: "BMI", icon: FiPieChart, color: "emerald" },
  { id: "calories", label: "Calories", icon: FiZap, color: "amber" },
  { id: "ideal", label: "Ideal Weight", icon: FiHeart, color: "purple" },
  { id: "water", label: "Water", icon: FiDroplet, color: "blue" },
  { id: "protein", label: "Protein", icon: FiActivity, color: "rose" },
  { id: "bodyFat", label: "Body Fat", icon: FiShield, color: "orange" },
];

const genderOptions = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const activityOptions = [
  { value: "sedentary", label: "Sedentary" },
  { value: "light", label: "Lightly Active" },
  { value: "moderate", label: "Moderately Active" },
  { value: "active", label: "Very Active" },
  { value: "extra", label: "Extra Active" },
];

const goalOptions = [
  { value: "maintain", label: "Maintenance" },
  { value: "lose", label: "Weight Loss" },
  { value: "gain", label: "Muscle Gain" },
];

const bmiCategories = [
  { label: "Underweight", min: 0, max: 18.5, color: "bg-cyan-400" },
  { label: "Normal", min: 18.5, max: 25, color: "bg-emerald-400" },
  { label: "Overweight", min: 25, max: 30, color: "bg-amber-400" },
  { label: "Obese", min: 30, max: 50, color: "bg-red-400" },
];

const categoryColorMap = {
  emerald: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", progress: "bg-emerald-400" },
  cyan: { bg: "bg-cyan-500/10", text: "text-cyan-400", border: "border-cyan-500/20", progress: "bg-cyan-400" },
  amber: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", progress: "bg-amber-400" },
  red: { bg: "bg-red-500/10", text: "text-red-400", border: "border-red-500/20", progress: "bg-red-400" },
  purple: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20", progress: "bg-purple-400" },
  blue: { bg: "bg-blue-500/10", text: "text-blue-400", border: "border-blue-500/20", progress: "bg-blue-400" },
  rose: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", progress: "bg-rose-400" },
  orange: { bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20", progress: "bg-orange-400" },
};

function ResultDisplay({ label, value, unit, category, color, description, accent }) {
  const colors = categoryColorMap[color] || categoryColorMap[accent] || categoryColorMap.emerald;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.97 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`rounded-2xl border ${colors.border} p-5 sm:p-6 ${colors.bg} backdrop-blur-xl`}
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-white/40 mb-1">{label}</p>
          <div className="flex items-baseline gap-1.5">
            <span className="text-3xl sm:text-4xl font-black text-white">{value}</span>
            {unit && <span className="text-sm font-medium text-white/40">{unit}</span>}
          </div>
        </div>
        {category && (
          <span className={`px-3 py-1 rounded-full text-xs font-bold ${colors.bg} ${colors.text} border ${colors.border}`}>
            {category}
          </span>
        )}
      </div>
      {description && (
        <p className="text-sm text-white/40 leading-relaxed">{description}</p>
      )}
    </motion.div>
  );
}

function BmiProgress({ bmi }) {
  const clampedBmi = Math.min(Math.max(bmi, 10), 45);
  const percentage = ((clampedBmi - 10) / 35) * 100;

  return (
    <div className="space-y-3">
      <div className="relative h-3 rounded-full bg-white/5 overflow-hidden">
        <div className="absolute inset-0 flex">
          {bmiCategories.map((cat) => {
            const start = ((cat.min - 10) / 35) * 100;
            const width = ((cat.max - cat.min) / 35) * 100;
            return (
              <div
                key={cat.label}
                className={`${cat.color} opacity-20`}
                style={{ left: `${start}%`, width: `${width}%`, position: "absolute", height: "100%" }}
              />
            );
          })}
        </div>
        <motion.div
          initial={{ left: "0%" }}
          animate={{ left: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute top-0 w-1 h-3 bg-white rounded-full shadow-lg shadow-white/30"
          style={{ marginLeft: "-2px" }}
        />
      </div>
      <div className="flex justify-between text-[10px] text-white/30">
        {bmiCategories.map((cat) => (
          <span key={cat.label}>{cat.label}</span>
        ))}
      </div>
    </div>
  );
}

function ToolCard({ title, icon: Icon, accent, children }) {
  const colors = categoryColorMap[accent] || categoryColorMap.emerald;

  return (
    <motion.div
      variants={fadeUp}
      className="rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-white/5 p-6 sm:p-8 space-y-5"
    >
      <div className="flex items-center gap-3">
        <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${colors.text}`} />
        </div>
        <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">{title}</h3>
      </div>
      {children}
    </motion.div>
  );
}

function FitnessToolsManagement() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("bmi");
  const inputClass = getInputClass("emerald");

  const [bmiForm, setBmiForm] = useState({ weight: "", height: "", age: "", gender: "male" });
  const [bmiResult, setBmiResult] = useState(null);

  const [calForm, setCalForm] = useState({ weight: "", height: "", age: "", gender: "male", activity: "moderate" });
  const [calResult, setCalResult] = useState(null);

  const [idealForm, setIdealForm] = useState({ height: "", gender: "male" });
  const [idealResult, setIdealResult] = useState(null);

  const [waterForm, setWaterForm] = useState({ weight: "" });
  const [waterResult, setWaterResult] = useState(null);

  const [proteinForm, setProteinForm] = useState({ weight: "", goal: "maintain" });
  const [proteinResult, setProteinResult] = useState(null);

  const [bodyFatForm, setBodyFatForm] = useState({ gender: "male", age: "", weight: "", height: "", waist: "" });
  const [bodyFatResult, setBodyFatResult] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  const calcBmi = useCallback(() => {
    const w = parseFloat(bmiForm.weight);
    const h = parseFloat(bmiForm.height);
    if (!w || !h) return;
    setBmiResult(calculateBMI(w, h, "metric"));
  }, [bmiForm]);

  const calcCalories = useCallback(() => {
    const w = parseFloat(calForm.weight);
    const h = parseFloat(calForm.height);
    const a = parseFloat(calForm.age);
    if (!w || !h || !a) return;
    setCalResult(calculateCalories(w, h, a, calForm.gender, calForm.activity, "metric"));
  }, [calForm]);

  const calcIdeal = useCallback(() => {
    const h = parseFloat(idealForm.height);
    if (!h) return;
    setIdealResult(calculateIdealWeight(h, idealForm.gender, "metric"));
  }, [idealForm]);

  const calcWater = useCallback(() => {
    const w = parseFloat(waterForm.weight);
    if (!w) return;
    setWaterResult(calculateWaterIntake(w, "moderate", "metric"));
  }, [waterForm]);

  const calcProtein = useCallback(() => {
    const w = parseFloat(proteinForm.weight);
    if (!w) return;
    setProteinResult(calculateProtein(w, "moderate", proteinForm.goal, "metric"));
  }, [proteinForm]);

  const calcBodyFat = useCallback(() => {
    const w = parseFloat(bodyFatForm.weight);
    const h = parseFloat(bodyFatForm.height);
    const a = parseFloat(bodyFatForm.age);
    const waist = parseFloat(bodyFatForm.waist);
    if (!w || !h || !a || !waist) return;
    setBodyFatResult(calculateBodyFat(bodyFatForm.gender, a, w, waist * 0.7, waist, h, "metric"));
  }, [bodyFatForm]);

  const resetAll = useCallback(() => {
    setBmiForm({ weight: "", height: "", age: "", gender: "male" });
    setBmiResult(null);
    setCalForm({ weight: "", height: "", age: "", gender: "male", activity: "moderate" });
    setCalResult(null);
    setIdealForm({ height: "", gender: "male" });
    setIdealResult(null);
    setWaterForm({ weight: "" });
    setWaterResult(null);
    setProteinForm({ weight: "", goal: "maintain" });
    setProteinResult(null);
    setBodyFatForm({ gender: "male", age: "", weight: "", height: "", waist: "" });
    setBodyFatResult(null);
  }, []);

  const stats = useMemo(() => [
    { label: "BMI Calculator", value: bmiResult ? bmiResult.bmi : "—", icon: FiPieChart },
    { label: "Daily Calories", value: calResult ? `${calResult.maintenance}` : "—", icon: FiZap },
    { label: "Ideal Weight", value: idealResult ? `${idealResult.ideal}` : "—", icon: FiHeart },
    { label: "Water Intake", value: waterResult ? `${waterResult.liters}L` : "—", icon: FiDroplet },
    { label: "Protein", value: proteinResult ? `${proteinResult.ideal}g` : "—", icon: FiActivity },
    { label: "Body Fat", value: bodyFatResult ? `${bodyFatResult.bodyFat}%` : "—", icon: FiShield },
  ], [bmiResult, calResult, idealResult, waterResult, proteinResult, bodyFatResult]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton variant="shimmer" className="h-28 rounded-2xl w-full" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Skeleton key={i} variant="shimmer" className="h-28 rounded-2xl" />
          ))}
        </div>
        <Skeleton variant="shimmer" className="h-12 rounded-xl w-96" />
        <div className="rounded-2xl bg-[#12121a]/80 border border-white/5 p-8 space-y-5">
          <Skeleton variant="shimmer" className="h-5 w-40 rounded-lg" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} variant="shimmer" className="h-11 rounded-xl" />
            ))}
          </div>
          <Skeleton variant="shimmer" className="h-11 w-full rounded-xl" />
          <Skeleton variant="shimmer" className="h-32 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <PageBanner
        pageKey="fitnessTools"
        subtitle="Interactive health calculators for your members"
      />

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            custom={i}
            initial="hidden"
            animate="visible"
            className="p-4 sm:p-5 rounded-2xl bg-[#12121a]/80 backdrop-blur-xl border border-emerald-500/10 transition-all duration-300 hover:border-emerald-500/25"
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <stat.icon className="w-4 h-4 text-emerald-400" />
              </div>
            </div>
            <p className="text-xl font-bold text-white">{stat.value}</p>
            <p className="text-[11px] text-white/30 mt-0.5">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <motion.div variants={fadeUp} className="flex items-center gap-2 flex-wrap">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border overflow-hidden ${
              activeTab === tab.id
                ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/25 shadow-lg shadow-emerald-500/5"
                : "bg-white/[0.03] border-white/5 text-white/40 hover:text-white/60 hover:bg-white/[0.05]"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
        <button
          onClick={resetAll}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white/30 hover:text-white/60 border border-white/5 hover:border-white/10 transition-all duration-200 ml-auto"
        >
          <FiRefreshCw className="w-4 h-4" />
          <span className="hidden sm:inline">Reset All</span>
        </button>
      </motion.div>

      <AnimatePresence mode="wait">
        {activeTab === "bmi" && (
          <motion.div key="bmi" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <ToolCard title="BMI Calculator" icon={FiPieChart} accent="emerald">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Weight (kg)</label>
                  <input type="number" min="20" max="300" placeholder="70" value={bmiForm.weight} onChange={(e) => setBmiForm((p) => ({ ...p, weight: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Height (cm)</label>
                  <input type="number" min="100" max="250" placeholder="170" value={bmiForm.height} onChange={(e) => setBmiForm((p) => ({ ...p, height: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Age</label>
                  <input type="number" min="14" max="100" placeholder="25" value={bmiForm.age} onChange={(e) => setBmiForm((p) => ({ ...p, age: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Gender</label>
                  <select value={bmiForm.gender} onChange={(e) => setBmiForm((p) => ({ ...p, gender: e.target.value }))} className={inputClass}>
                    {genderOptions.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                </div>
              </div>
              <Button variant="emerald" size="md" onClick={calcBmi} className="w-full sm:w-auto group mt-2">
                <FiPieChart className="w-4 h-4" />
                Calculate BMI
              </Button>
              <AnimatePresence>
                {bmiResult && (
                  <div className="space-y-4 pt-2">
                    <ResultDisplay label="Your BMI" value={bmiResult.bmi} category={bmiResult.category} color={bmiResult.color} description={bmiResult.description} accent="emerald" />
                    <BmiProgress bmi={bmiResult.bmi} />
                  </div>
                )}
              </AnimatePresence>
            </ToolCard>
          </motion.div>
        )}

        {activeTab === "calories" && (
          <motion.div key="calories" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <ToolCard title="Daily Calorie Calculator" icon={FiZap} accent="amber">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Weight (kg)</label>
                  <input type="number" min="20" max="300" placeholder="70" value={calForm.weight} onChange={(e) => setCalForm((p) => ({ ...p, weight: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Height (cm)</label>
                  <input type="number" min="100" max="250" placeholder="170" value={calForm.height} onChange={(e) => setCalForm((p) => ({ ...p, height: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Age</label>
                  <input type="number" min="14" max="100" placeholder="25" value={calForm.age} onChange={(e) => setCalForm((p) => ({ ...p, age: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Gender</label>
                  <select value={calForm.gender} onChange={(e) => setCalForm((p) => ({ ...p, gender: e.target.value }))} className={inputClass}>
                    {genderOptions.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-white/60 mb-1.5">Activity Level</label>
                <select value={calForm.activity} onChange={(e) => setCalForm((p) => ({ ...p, activity: e.target.value }))} className={inputClass}>
                  {activityOptions.map((a) => <option key={a.value} value={a.value}>{a.label}</option>)}
                </select>
              </div>
              <Button variant="emerald" size="md" onClick={calcCalories} className="w-full sm:w-auto group mt-2">
                <FiZap className="w-4 h-4" />
                Calculate Calories
              </Button>
              <AnimatePresence>
                {calResult && (
                  <div className="space-y-4 pt-2">
                    <ResultDisplay label="Maintenance Calories" value={calResult.maintenance} unit="cal/day" description={calResult.description} color="amber" accent="amber" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-4">
                        <p className="text-xs font-semibold text-amber-400/70 uppercase tracking-wider mb-1">Weight Loss</p>
                        <p className="text-2xl font-bold text-white">{calResult.lose}</p>
                        <p className="text-xs text-white/30 mt-0.5">cal/day</p>
                      </div>
                      <div className="rounded-xl bg-amber-500/5 border border-amber-500/10 p-4">
                        <p className="text-xs font-semibold text-amber-400/70 uppercase tracking-wider mb-1">Muscle Gain</p>
                        <p className="text-2xl font-bold text-white">{calResult.gain}</p>
                        <p className="text-xs text-white/30 mt-0.5">cal/day</p>
                      </div>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </ToolCard>
          </motion.div>
        )}

        {activeTab === "ideal" && (
          <motion.div key="ideal" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <ToolCard title="Ideal Weight Calculator" icon={FiHeart} accent="purple">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Height (cm)</label>
                  <input type="number" min="100" max="250" placeholder="170" value={idealForm.height} onChange={(e) => setIdealForm((p) => ({ ...p, height: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Gender</label>
                  <select value={idealForm.gender} onChange={(e) => setIdealForm((p) => ({ ...p, gender: e.target.value }))} className={inputClass}>
                    {genderOptions.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                </div>
              </div>
              <Button variant="emerald" size="md" onClick={calcIdeal} className="w-full sm:w-auto group mt-2">
                <FiHeart className="w-4 h-4" />
                Calculate Ideal Weight
              </Button>
              <AnimatePresence>
                {idealResult && (
                  <div className="space-y-4 pt-2">
                    <ResultDisplay label="Ideal Weight" value={idealResult.ideal} unit={idealResult.unit} description={idealResult.description} color="purple" accent="purple" />
                    <div className="rounded-xl bg-purple-500/5 border border-purple-500/10 p-4">
                      <p className="text-xs font-semibold text-purple-400/70 uppercase tracking-wider mb-2">Healthy Range</p>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-purple-500/60 to-purple-400/60" />
                        </div>
                        <span className="text-sm font-bold text-white">{idealResult.range}</span>
                      </div>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </ToolCard>
          </motion.div>
        )}

        {activeTab === "water" && (
          <motion.div key="water" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <ToolCard title="Water Intake Calculator" icon={FiDroplet} accent="blue">
              <div className="max-w-sm">
                <label className="block text-sm font-medium text-white/60 mb-1.5">Weight (kg)</label>
                <input type="number" min="20" max="300" placeholder="70" value={waterForm.weight} onChange={(e) => setWaterForm((p) => ({ ...p, weight: e.target.value }))} className={inputClass} />
              </div>
              <Button variant="emerald" size="md" onClick={calcWater} className="w-full sm:w-auto group mt-2">
                <FiDroplet className="w-4 h-4" />
                Calculate Water Intake
              </Button>
              <AnimatePresence>
                {waterResult && (
                  <div className="space-y-4 pt-2">
                    <ResultDisplay label="Daily Water Intake" value={waterResult.liters} unit="liters" description={waterResult.description} color="blue" accent="blue" />
                    <div className="grid grid-cols-3 gap-3">
                      <div className="rounded-xl bg-blue-500/5 border border-blue-500/10 p-3 text-center">
                        <p className="text-lg font-bold text-white">{waterResult.ounces}</p>
                        <p className="text-[10px] text-white/30 uppercase">Ounces</p>
                      </div>
                      <div className="rounded-xl bg-blue-500/5 border border-blue-500/10 p-3 text-center">
                        <p className="text-lg font-bold text-white">{waterResult.glasses}</p>
                        <p className="text-[10px] text-white/30 uppercase">Glasses</p>
                      </div>
                      <div className="rounded-xl bg-blue-500/5 border border-blue-500/10 p-3 text-center">
                        <p className="text-lg font-bold text-white">{waterResult.perHour}L</p>
                        <p className="text-[10px] text-white/30 uppercase">Per Hour</p>
                      </div>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </ToolCard>
          </motion.div>
        )}

        {activeTab === "protein" && (
          <motion.div key="protein" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <ToolCard title="Protein Intake Calculator" icon={FiActivity} accent="rose">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Weight (kg)</label>
                  <input type="number" min="20" max="300" placeholder="70" value={proteinForm.weight} onChange={(e) => setProteinForm((p) => ({ ...p, weight: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Fitness Goal</label>
                  <select value={proteinForm.goal} onChange={(e) => setProteinForm((p) => ({ ...p, goal: e.target.value }))} className={inputClass}>
                    {goalOptions.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                </div>
              </div>
              <Button variant="emerald" size="md" onClick={calcProtein} className="w-full sm:w-auto group mt-2">
                <FiActivity className="w-4 h-4" />
                Calculate Protein
              </Button>
              <AnimatePresence>
                {proteinResult && (
                  <div className="space-y-4 pt-2">
                    <ResultDisplay label="Daily Protein Intake" value={proteinResult.ideal} unit="grams" description={proteinResult.description} color="rose" accent="rose" />
                    <div className="rounded-xl bg-rose-500/5 border border-rose-500/10 p-4">
                      <p className="text-xs font-semibold text-rose-400/70 uppercase tracking-wider mb-2">Recommended Range</p>
                      <div className="flex items-center gap-3">
                        <span className="text-lg font-bold text-white">{proteinResult.min}g</span>
                        <div className="flex-1 h-2 rounded-full bg-white/5 overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 0.6 }} className="h-full rounded-full bg-gradient-to-r from-rose-500/60 to-rose-400/60" />
                        </div>
                        <span className="text-lg font-bold text-white">{proteinResult.max}g</span>
                      </div>
                      <p className="text-xs text-white/30 mt-2 text-center">{proteinResult.perKg}g per kg of body weight</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </ToolCard>
          </motion.div>
        )}

        {activeTab === "bodyFat" && (
          <motion.div key="bodyFat" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.25 }}>
            <ToolCard title="Body Fat Percentage Estimator" icon={FiShield} accent="orange">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Gender</label>
                  <select value={bodyFatForm.gender} onChange={(e) => setBodyFatForm((p) => ({ ...p, gender: e.target.value }))} className={inputClass}>
                    {genderOptions.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Age</label>
                  <input type="number" min="14" max="100" placeholder="25" value={bodyFatForm.age} onChange={(e) => setBodyFatForm((p) => ({ ...p, age: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Weight (kg)</label>
                  <input type="number" min="20" max="300" placeholder="70" value={bodyFatForm.weight} onChange={(e) => setBodyFatForm((p) => ({ ...p, weight: e.target.value }))} className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Height (cm)</label>
                  <input type="number" min="100" max="250" placeholder="170" value={bodyFatForm.height} onChange={(e) => setBodyFatForm((p) => ({ ...p, height: e.target.value }))} className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-white/60 mb-1.5">Waist Circumference (cm)</label>
                  <input type="number" min="40" max="200" placeholder="80" value={bodyFatForm.waist} onChange={(e) => setBodyFatForm((p) => ({ ...p, waist: e.target.value }))} className={inputClass} />
                </div>
              </div>
              <Button variant="emerald" size="md" onClick={calcBodyFat} className="w-full sm:w-auto group mt-2">
                <FiShield className="w-4 h-4" />
                Estimate Body Fat
              </Button>
              <AnimatePresence>
                {bodyFatResult && (
                  <div className="space-y-4 pt-2">
                    <ResultDisplay label="Body Fat Percentage" value={bodyFatResult.bodyFat} unit="%" category={bodyFatResult.category} color={bodyFatResult.color} description={bodyFatResult.description} accent="orange" />
                  </div>
                )}
              </AnimatePresence>
            </ToolCard>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default FitnessToolsManagement;
