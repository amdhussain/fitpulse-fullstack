import PropTypes from "prop-types";

export function UnitToggle({ unit, onChange }) {
  return (
    <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-0.5">
      {["metric", "imperial"].map((u) => (
        <button
          key={u}
          type="button"
          onClick={() => onChange(u)}
          className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all duration-200 capitalize
            ${unit === u ? "bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm" : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"}`}
        >
          {u}
        </button>
      ))}
    </div>
  );
}

UnitToggle.propTypes = { unit: PropTypes.string.isRequired, onChange: PropTypes.func.isRequired };

export function NumberInput({ label, value, onChange, placeholder, min, max, step }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step || 0.1}
        className="w-full px-3 py-2.5 text-base rounded-lg border border-gray-200 dark:border-gray-600
          bg-white dark:bg-gray-700 text-gray-900 dark:text-white
          placeholder-gray-400 dark:placeholder-gray-500
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
          transition-all duration-200"
      />
    </div>
  );
}

NumberInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  placeholder: PropTypes.string,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
};

export function SelectInput({ label, value, onChange, options }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-3 py-2.5 text-base rounded-lg border border-gray-200 dark:border-gray-600
          bg-white dark:bg-gray-700 text-gray-900 dark:text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400
          transition-all duration-200"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );
}

SelectInput.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
};

export function ActivitySelect({ value, onChange }) {
  const levels = [
    { value: "1.2", label: "Sedentary" },
    { value: "1.375", label: "Lightly Active" },
    { value: "1.55", label: "Moderately Active" },
    { value: "1.725", label: "Very Active" },
    { value: "1.9", label: "Extra Active" },
  ];
  return <SelectInput label="Activity Level" value={value} onChange={onChange} options={levels} />;
}

ActivitySelect.propTypes = { value: PropTypes.string, onChange: PropTypes.func.isRequired };
