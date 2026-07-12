import { motion } from "framer-motion";
import { FiChevronDown } from "react-icons/fi";
import { getActivityLevels, getProteinGoals } from "../../lib/fitnessToolsData";

const inputBase =
  "w-full px-4 py-3 rounded-xl bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] text-white placeholder:text-white/25 focus:outline-none focus:border-emerald-500/50 focus:ring-2 focus:ring-emerald-500/20 transition-all duration-300 text-sm";

function UnitToggle({ options, value, onChange, accentColor = "cyan" }) {
  const activeMap = {
    cyan: "bg-cyan-500 text-white shadow-lg shadow-cyan-500/25",
    amber: "bg-amber-500 text-white shadow-lg shadow-amber-500/25",
    emerald: "bg-emerald-500 text-white shadow-lg shadow-emerald-500/25",
    purple: "bg-purple-500 text-white shadow-lg shadow-purple-500/25",
    blue: "bg-blue-500 text-white shadow-lg shadow-blue-500/25",
    rose: "bg-rose-500 text-white shadow-lg shadow-rose-500/25",
    orange: "bg-orange-500 text-white shadow-lg shadow-orange-500/25",
  };
  return (
    <div className="flex rounded-xl bg-white/[0.04] border border-white/[0.08] p-1">
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 ${
            value === opt.value
              ? activeMap[accentColor] || activeMap.cyan
              : "text-white/40 hover:text-white/60"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function NumberInput({ field, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/60">{field.label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
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
  );
}

function SelectInput({ field, value, onChange }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/60">{field.label}</label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputBase} appearance-none cursor-pointer`}
        >
          <option value="">Select</option>
          {field.options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <FiChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none" />
      </div>
    </div>
  );
}

function ActivitySelect({ value, onChange }) {
  const levels = getActivityLevels();
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/60">Activity Level</label>
      <div className="grid grid-cols-1 gap-2">
        {levels.map((level) => {
          const LevelIcon = level.icon;
          return (
            <button
              key={level.value}
              type="button"
              onClick={() => onChange(level.value)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all duration-300 text-left ${
                value === level.value
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                  : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:border-white/15 hover:text-white/60"
              }`}
            >
              <LevelIcon className="w-4 h-4 shrink-0" />
              <div>
                <p className="text-sm font-medium">{level.label}</p>
                <p className="text-xs opacity-60">{level.description}</p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function GoalSelect({ value, onChange }) {
  const goals = getProteinGoals();
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-white/60">Fitness Goal</label>
      <div className="grid grid-cols-2 gap-2">
        {goals.map((goal) => (
          <button
            key={goal.value}
            type="button"
            onClick={() => onChange(goal.value)}
            className={`px-4 py-3 rounded-xl border transition-all duration-300 text-left ${
              value === goal.value
                ? "bg-rose-500/10 border-rose-500/30 text-rose-400"
                : "bg-white/[0.02] border-white/[0.06] text-white/40 hover:border-white/15 hover:text-white/60"
            }`}
          >
            <p className="text-sm font-medium">{goal.label}</p>
            <p className="text-xs opacity-60 mt-0.5">{goal.description}</p>
          </button>
        ))}
      </div>
    </div>
  );
}

function CalculatorForm({ fields, unit, onUnitChange, unitOptions, values, onChange, onCalculate, accentColor, calculateLabel = "Calculate" }) {
  const handleChange = (name, val) => {
    onChange((prev) => ({ ...prev, [name]: val }));
  };

  return (
    <div className="space-y-5">
      {unitOptions && unitOptions.length > 1 && (
        <UnitToggle options={unitOptions} value={unit} onChange={onUnitChange} accentColor={accentColor} />
      )}

      {fields.map((field) => {
        if (field.type === "select") {
          return <SelectInput key={field.name} field={field} value={values[field.name] || ""} onChange={(v) => handleChange(field.name, v)} />;
        }
        if (field.type === "activity") {
          return <ActivitySelect key={field.name} value={values[field.name] || ""} onChange={(v) => handleChange(field.name, v)} />;
        }
        if (field.type === "goal") {
          return <GoalSelect key={field.name} value={values[field.name] || ""} onChange={(v) => handleChange(field.name, v)} />;
        }
        return <NumberInput key={field.name} field={field} value={values[field.name] || ""} onChange={(v) => handleChange(field.name, v)} />;
      })}

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onCalculate}
        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300"
      >
        {calculateLabel}
      </motion.button>
    </div>
  );
}

export { UnitToggle, NumberInput, SelectInput, ActivitySelect, GoalSelect, CalculatorForm };
export default CalculatorForm;
