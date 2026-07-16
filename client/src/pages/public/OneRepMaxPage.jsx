import { useState } from "react";
import { tools, calculateOneRepMax } from "../../lib/fitnessTools";
import { FitnessLayout, ResultCard } from "../../components/fitness";
import { UnitToggle, NumberInput } from "../../components/fitness/CalculatorForm";
import { Button } from "../../components/ui";

const tool = tools.find((t) => t.id === "one-rep-max");

function OneRepMaxPage() {
  const [unit, setUnit] = useState("metric");
  const [weight, setWeight] = useState("");
  const [reps, setReps] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!weight || !reps) return;
    setResult(calculateOneRepMax(parseFloat(weight), parseInt(reps), unit));
  };

  return (
    <FitnessLayout tool={tool}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Enter Lift Details</h2>
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <NumberInput label={`Weight (${unit === "metric" ? "kg" : "lbs"})`} value={weight} onChange={setWeight} placeholder="100" />
          <NumberInput label="Reps" value={reps} onChange={setReps} placeholder="5" min={1} max={36} step={1} />
        </div>
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate 1RM</Button>
      </div>
      {result && (
        <div className="space-y-3 mt-4">
          {Object.entries(result).map(([formula, values]) => (
            <div key={formula} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300 capitalize mb-2">{formula} Formula</p>
              <div className="grid grid-cols-2 gap-3">
                <ResultCard value={values.kg} label="Kilograms" unit="kg" color="purple" />
                <ResultCard value={values.lbs} label="Pounds" unit="lbs" color="purple" />
              </div>
            </div>
          ))}
        </div>
      )}
    </FitnessLayout>
  );
}

export default OneRepMaxPage;
