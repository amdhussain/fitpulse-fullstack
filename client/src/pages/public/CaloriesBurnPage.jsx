import { useState } from "react";
import { tools, calculateCaloriesBurn } from "../../lib/fitnessTools";
import { FitnessLayout, ResultCard } from "../../components/fitness";
import { UnitToggle, NumberInput, SelectInput } from "../../components/fitness/CalculatorForm";
import { Button } from "../../components/ui";

const tool = tools.find((t) => t.id === "calories-burn");

const metOptions = [
  { value: "1.5", label: "Sitting" },
  { value: "2.5", label: "Walking (slow)" },
  { value: "3.5", label: "Walking (moderate)" },
  { value: "5.0", label: "Hiking" },
  { value: "6.0", label: "Cycling (moderate)" },
  { value: "8.0", label: "Running" },
  { value: "10.0", label: "Running (fast)" },
  { value: "12.0", label: "Swimming" },
  { value: "9.0", label: "Jump Rope" },
  { value: "4.0", label: "Yoga" },
  { value: "5.5", label: "Dancing" },
  { value: "7.0", label: "Basketball" },
  { value: "8.5", label: "Soccer" },
  { value: "6.5", label: "Tennis" },
  { value: "3.0", label: "Stretching" },
];

function CaloriesBurnPage() {
  const [unit, setUnit] = useState("metric");
  const [weight, setWeight] = useState("");
  const [met, setMet] = useState("5.0");
  const [minutes, setMinutes] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!weight || !minutes) return;
    setResult(calculateCaloriesBurn(parseFloat(weight), parseFloat(met), parseInt(minutes), unit));
  };

  return (
    <FitnessLayout tool={tool}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Enter Exercise Details</h2>
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <NumberInput label={`Weight (${unit === "metric" ? "kg" : "lbs"})`} value={weight} onChange={setWeight} placeholder="70" />
          <SelectInput label="Activity Type" value={met} onChange={setMet} options={metOptions} />
        </div>
        <div className="mb-4">
          <NumberInput label="Duration (minutes)" value={minutes} onChange={setMinutes} placeholder="30" min={1} step={1} />
        </div>
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate Calories Burned</Button>
      </div>
      {result && (
        <div className="mt-4">
          <ResultCard value={result.value} label="Calories Burned" unit={result.unit} color="orange" />
        </div>
      )}
    </FitnessLayout>
  );
}

export default CaloriesBurnPage;
