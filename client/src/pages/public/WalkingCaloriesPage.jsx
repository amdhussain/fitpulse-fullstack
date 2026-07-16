import { useState } from "react";
import { tools, calculateWalkingCalories } from "../../lib/fitnessTools";
import { FitnessLayout, ResultCard } from "../../components/fitness";
import { UnitToggle, NumberInput } from "../../components/fitness/CalculatorForm";
import { Button } from "../../components/ui";

const tool = tools.find((t) => t.id === "walking-calories");

function WalkingCaloriesPage() {
  const [unit, setUnit] = useState("metric");
  const [weight, setWeight] = useState("");
  const [pace, setPace] = useState("");
  const [minutes, setMinutes] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!weight || !pace || !minutes) return;
    setResult(calculateWalkingCalories(parseFloat(weight), parseFloat(pace), parseInt(minutes), unit));
  };

  return (
    <FitnessLayout tool={tool}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Enter Walking Details</h2>
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <NumberInput label={`Weight (${unit === "metric" ? "kg" : "lbs"})`} value={weight} onChange={setWeight} placeholder="70" />
          <NumberInput label="Walking Speed (km/h)" value={pace} onChange={setPace} placeholder="5" min={1} step={0.1} />
        </div>
        <div className="mb-4">
          <NumberInput label="Duration (minutes)" value={minutes} onChange={setMinutes} placeholder="30" min={1} step={1} />
        </div>
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate Walking Calories</Button>
      </div>
      {result && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          <ResultCard value={result.calories} label="Calories Burned" unit={result.unit} color="emerald" />
          <ResultCard value={result.distance} label="Distance" unit="km" color="blue" />
          <ResultCard value={result.met} label="MET Value" unit="" color="amber" />
        </div>
      )}
    </FitnessLayout>
  );
}

export default WalkingCaloriesPage;
