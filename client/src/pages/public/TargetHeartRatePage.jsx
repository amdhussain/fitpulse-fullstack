import { useState } from "react";
import { tools, calculateTargetHeartRate } from "../../lib/fitnessTools";
import { FitnessLayout, ResultCard } from "../../components/fitness";
import { NumberInput } from "../../components/fitness/CalculatorForm";
import { Button } from "../../components/ui";

const tool = tools.find((t) => t.id === "target-heart-rate");

function TargetHeartRatePage() {
  const [age, setAge] = useState("");
  const [restingHR, setRestingHR] = useState("70");
  const [intensity, setIntensity] = useState("70");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!age) return;
    setResult(calculateTargetHeartRate(parseInt(age), parseInt(restingHR) || 70, parseInt(intensity) || 70));
  };

  return (
    <FitnessLayout tool={tool}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-5 text-lg">Enter Your Details</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <NumberInput label="Age" value={age} onChange={setAge} placeholder="25" min={1} max={120} step={1} />
          <NumberInput label="Resting Heart Rate (bpm)" value={restingHR} onChange={setRestingHR} placeholder="70" min={30} max={200} step={1} />
        </div>
        <div className="mb-4">
          <NumberInput label={`Intensity (${intensity}%)`} value={intensity} onChange={setIntensity} placeholder="70" min={50} max={100} step={1} />
        </div>
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate Target Heart Rate</Button>
      </div>
      {result && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <ResultCard value={result.value} label="Target Heart Rate" unit={result.unit} color="rose" />
          <ResultCard value={result.maxHR} label="Max Heart Rate" unit={result.unit} color="red" />
          <ResultCard value={result.min} label="Min Target" unit={result.unit} color="blue" />
          <ResultCard value={result.max} label="Max Target" unit={result.unit} color="purple" />
        </div>
      )}
    </FitnessLayout>
  );
}

export default TargetHeartRatePage;
