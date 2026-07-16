import { useState } from "react";
import { tools, calculateRunningPace } from "../../lib/fitnessTools";
import { FitnessLayout, ResultCard } from "../../components/fitness";
import { NumberInput } from "../../components/fitness/CalculatorForm";
import { Button } from "../../components/ui";

const tool = tools.find((t) => t.id === "running-pace");

function RunningPacePage() {
  const [distance, setDistance] = useState("");
  const [hours, setHours] = useState("0");
  const [minutes, setMinutes] = useState("");
  const [seconds, setSeconds] = useState("0");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!distance || !minutes) return;
    setResult(calculateRunningPace(parseFloat(distance), parseInt(hours) || 0, parseInt(minutes) || 0, parseInt(seconds) || 0));
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
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate Running Pace</Button>
      </div>
      {result && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ResultCard value={result.pace} label="Pace" unit={result.unit} color="blue" />
            <ResultCard value={result.speed} label="Speed" unit="km/h" color="blue" />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">Estimated Finish Times</h3>
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-700 dark:text-gray-300">5K</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{result.fiveK}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-700 dark:text-gray-300">10K</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{result.tenK}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm text-gray-700 dark:text-gray-300">Half Marathon</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{result.halfMarathon}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-sm text-gray-700 dark:text-gray-300">Marathon</span>
                <span className="text-sm font-medium text-gray-900 dark:text-white">{result.marathon}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </FitnessLayout>
  );
}

export default RunningPacePage;
