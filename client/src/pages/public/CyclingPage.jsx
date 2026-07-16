import { useState } from "react";
import { tools, calculateCycling } from "../../lib/fitnessTools";
import { FitnessLayout, ResultCard } from "../../components/fitness";
import { NumberInput } from "../../components/fitness/CalculatorForm";
import { Button } from "../../components/ui";

const tool = tools.find((t) => t.id === "cycling");

function CyclingPage() {
  const [speed, setSpeed] = useState("");
  const [weight, setWeight] = useState("");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!speed || !weight || !minutes) return;
    setResult(calculateCycling(parseFloat(speed), parseFloat(weight), parseInt(hours) || 0, parseInt(minutes) || 0));
  };

  return (
    <FitnessLayout tool={tool}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-5 text-lg">Enter Cycling Details</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <NumberInput label="Speed (km/h)" value={speed} onChange={setSpeed} placeholder="20" min={1} />
          <NumberInput label="Weight (kg)" value={weight} onChange={setWeight} placeholder="70" min={1} />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <NumberInput label="Hours" value={hours} onChange={setHours} placeholder="0" min={0} step={1} />
          <NumberInput label="Minutes" value={minutes} onChange={setMinutes} placeholder="30" min={0} step={1} />
        </div>
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate Cycling</Button>
      </div>
      {result && (
        <div className="grid grid-cols-3 gap-3 mt-4">
          <ResultCard value={result.calories} label="Calories Burned" unit={result.unit} color="cyan" />
          <ResultCard value={result.distance} label="Distance" unit="km" color="blue" />
          <ResultCard value={result.met} label="MET Value" unit="" color="emerald" />
        </div>
      )}
    </FitnessLayout>
  );
}

export default CyclingPage;
