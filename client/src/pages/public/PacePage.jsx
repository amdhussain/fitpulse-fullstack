import { useState } from "react";
import { tools, calculatePace } from "../../lib/fitnessTools";
import { FitnessLayout, ResultCard } from "../../components/fitness";
import { NumberInput } from "../../components/fitness/CalculatorForm";
import { Button } from "../../components/ui";

const tool = tools.find((t) => t.id === "pace");

function PacePage() {
  const [distance, setDistance] = useState("");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("0");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!distance || !minutes) return;
    setResult(calculatePace(parseFloat(distance), parseInt(hours) || 0, parseInt(minutes) || 0, parseInt(seconds) || 0));
  };

  return (
    <FitnessLayout tool={tool}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <h2 className="font-semibold text-gray-900 dark:text-white mb-5 text-lg">Enter Race Details</h2>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <NumberInput label="Distance (km)" value={distance} onChange={setDistance} placeholder="5" min={0.1} />
          <NumberInput label="Hours" value={hours} onChange={setHours} placeholder="0" min={0} step={1} />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <NumberInput label="Minutes" value={minutes} onChange={setMinutes} placeholder="25" min={0} step={1} />
          <NumberInput label="Seconds" value={seconds} onChange={setSeconds} placeholder="0" min={0} max={59} step={1} />
        </div>
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate Pace</Button>
      </div>
      {result && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <ResultCard value={result.pace} label="Pace" unit="min/km" color="red" />
          <ResultCard value={result.speed} label="Speed" unit="km/h" color="red" />
        </div>
      )}
    </FitnessLayout>
  );
}

export default PacePage;
