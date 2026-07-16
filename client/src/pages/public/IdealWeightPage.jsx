import { useState } from "react";
import { tools, calculateIdealWeight } from "../../lib/fitnessTools";
import { FitnessLayout, ResultCard } from "../../components/fitness";
import { UnitToggle, NumberInput, SelectInput } from "../../components/fitness/CalculatorForm";
import { Button } from "../../components/ui";

const tool = tools.find((t) => t.id === "ideal-weight");

function IdealWeightPage() {
  const [unit, setUnit] = useState("metric");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!height) return;
    setResult(calculateIdealWeight(parseFloat(height), gender, unit));
  };

  return (
    <FitnessLayout tool={tool}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Enter Your Details</h2>
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <NumberInput label={`Height (${unit === "metric" ? "cm" : "in"})`} value={height} onChange={setHeight} placeholder="175" />
          <SelectInput label="Gender" value={gender} onChange={setGender} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
        </div>
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate Ideal Weight</Button>
      </div>
      {result && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <ResultCard value={result.low} label="Low End" unit={result.unit} color="purple" />
          <ResultCard value={result.high} label="High End" unit={result.unit} color="purple" />
        </div>
      )}
    </FitnessLayout>
  );
}

export default IdealWeightPage;
