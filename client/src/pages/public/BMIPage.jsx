import { useState } from "react";
import { tools, calculateBMI } from "../../lib/fitnessTools";
import { FitnessLayout, ResultCard } from "../../components/fitness";
import { UnitToggle, NumberInput } from "../../components/fitness/CalculatorForm";
import { Button } from "../../components/ui";

const tool = tools.find((t) => t.id === "bmi");

function BMIPage() {
  const [unit, setUnit] = useState("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!weight || !height) return;
    setResult(calculateBMI(parseFloat(weight), parseFloat(height), unit));
  };

  return (
    <FitnessLayout tool={tool}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Enter Your Details</h2>
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <NumberInput label={`Weight (${unit === "metric" ? "kg" : "lbs"})`} value={weight} onChange={setWeight} placeholder="70" />
          <NumberInput label={`Height (${unit === "metric" ? "cm" : "in"})`} value={height} onChange={setHeight} placeholder="175" />
        </div>
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate BMI</Button>
      </div>
      {result && (
        <div className="mt-4">
          <ResultCard value={result.value} label={result.category} unit={result.unit} color="emerald" />
        </div>
      )}
    </FitnessLayout>
  );
}

export default BMIPage;
