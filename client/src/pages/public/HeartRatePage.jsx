import { useState } from "react";
import { tools, calculateHeartRate } from "../../lib/fitnessTools";
import { FitnessLayout, ResultCard } from "../../components/fitness";
import { NumberInput } from "../../components/fitness/CalculatorForm";
import { Button } from "../../components/ui";

const tool = tools.find((t) => t.id === "heart-rate");

function HeartRatePage() {
  const [age, setAge] = useState("");
  const [restingHR, setRestingHR] = useState("70");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!age) return;
    setResult(calculateHeartRate(parseInt(age), parseInt(restingHR) || 70));
  };

  return (
    <FitnessLayout tool={tool}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-5 text-lg">Enter Your Details</h2>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <NumberInput label="Age" value={age} onChange={setAge} placeholder="25" min={1} max={120} step={1} />
          <NumberInput label="Resting Heart Rate (bpm)" value={restingHR} onChange={setRestingHR} placeholder="70" min={30} max={200} step={1} />
        </div>
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate Heart Rate</Button>
      </div>
      {result && (
        <div className="mt-4 space-y-3">
          <ResultCard value={result.maxHR} label="Maximum Heart Rate" unit={result.unit} color="red" />
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">Training Zones</h3>
            <div className="space-y-2">
              {result.zones.map((z) => (
                <div key={z.zone} className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{z.zone}</span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">{z.min} - {z.max} bpm</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </FitnessLayout>
  );
}

export default HeartRatePage;
