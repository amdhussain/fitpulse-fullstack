import { useState } from "react";
import { tools, calculateSteps } from "../../lib/fitnessTools";
import { FitnessLayout, ResultCard } from "../../components/fitness";
import { NumberInput } from "../../components/fitness/CalculatorForm";
import { Button } from "../../components/ui";

const tool = tools.find((t) => t.id === "steps");

function StepsPage() {
  const [distance, setDistance] = useState("");
  const [strideLength, setStrideLength] = useState("75");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!distance) return;
    setResult(calculateSteps(parseFloat(distance), parseFloat(strideLength) || 75));
  };

  return (
    <FitnessLayout tool={tool}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-5 text-lg">Enter Walking Details</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <NumberInput label="Distance (km)" value={distance} onChange={setDistance} placeholder="3" min={0.1} step={0.1} />
          <NumberInput label="Stride Length (cm)" value={strideLength} onChange={setStrideLength} placeholder="75" min={30} max={120} step={1} />
        </div>
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate Steps</Button>
      </div>
      {result && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <ResultCard value={result.steps.toLocaleString()} label="Total Steps" unit={result.unit} color="blue" />
          <ResultCard value={result.timeMin} label="Estimated Time" unit="minutes" color="emerald" />
        </div>
      )}
    </FitnessLayout>
  );
}

export default StepsPage;
