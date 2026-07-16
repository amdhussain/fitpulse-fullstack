import { useState } from "react";
import { tools, calculateWater } from "../../lib/fitnessTools";
import { FitnessLayout, ResultCard } from "../../components/fitness";
import { UnitToggle, NumberInput } from "../../components/fitness/CalculatorForm";
import { Button } from "../../components/ui";

const tool = tools.find((t) => t.id === "water");

function WaterPage() {
  const [unit, setUnit] = useState("metric");
  const [weight, setWeight] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!weight) return;
    setResult(calculateWater(parseFloat(weight), unit));
  };

  return (
    <FitnessLayout tool={tool}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Enter Your Weight</h2>
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
        <div className="mb-4">
          <NumberInput label={`Weight (${unit === "metric" ? "kg" : "lbs"})`} value={weight} onChange={setWeight} placeholder="70" />
        </div>
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate Water Intake</Button>
      </div>
      {result && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <ResultCard value={result.liters} label="Liters Per Day" unit="L" color="blue" />
          <ResultCard value={result.glasses} label="Glasses (250ml)" unit="glasses" color="blue" />
        </div>
      )}
    </FitnessLayout>
  );
}

export default WaterPage;
