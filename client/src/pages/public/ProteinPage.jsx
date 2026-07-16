import { useState } from "react";
import { tools, calculateProtein } from "../../lib/fitnessTools";
import { FitnessLayout, ResultCard } from "../../components/fitness";
import { UnitToggle, NumberInput, ActivitySelect } from "../../components/fitness/CalculatorForm";
import { Button } from "../../components/ui";

const tool = tools.find((t) => t.id === "protein");

function ProteinPage() {
  const [unit, setUnit] = useState("metric");
  const [weight, setWeight] = useState("");
  const [activity, setActivity] = useState("1.55");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!weight) return;
    setResult(calculateProtein(parseFloat(weight), parseFloat(activity), unit));
  };

  return (
    <FitnessLayout tool={tool}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Enter Your Details</h2>
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <NumberInput label={`Weight (${unit === "metric" ? "kg" : "lbs"})`} value={weight} onChange={setWeight} placeholder="70" />
          <ActivitySelect value={activity} onChange={setActivity} />
        </div>
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate Protein</Button>
      </div>
      {result && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <ResultCard value={result.min} label="Minimum" unit={result.unit} color="cyan" />
          <ResultCard value={result.max} label="Maximum" unit={result.unit} color="cyan" />
        </div>
      )}
    </FitnessLayout>
  );
}

export default ProteinPage;
