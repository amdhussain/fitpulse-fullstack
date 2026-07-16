import { useState } from "react";
import { tools, calculateBMR } from "../../lib/fitnessTools";
import { FitnessLayout, ResultCard } from "../../components/fitness";
import { UnitToggle, NumberInput, SelectInput } from "../../components/fitness/CalculatorForm";
import { Button } from "../../components/ui";

const tool = tools.find((t) => t.id === "bmr");

function BMRPage() {
  const [unit, setUnit] = useState("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!weight || !height || !age) return;
    setResult(calculateBMR(parseFloat(weight), parseFloat(height), parseInt(age), gender, unit));
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
          <NumberInput label={`Height (${unit === "metric" ? "cm" : "in"})`} value={height} onChange={setHeight} placeholder="175" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <NumberInput label="Age" value={age} onChange={setAge} placeholder="25" min={1} max={120} step={1} />
          <SelectInput label="Gender" value={gender} onChange={setGender} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
        </div>
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate BMR</Button>
      </div>
      {result && (
        <div className="mt-4">
          <ResultCard value={result.value} label="Basal Metabolic Rate" unit={result.unit} color="amber" />
        </div>
      )}
    </FitnessLayout>
  );
}

export default BMRPage;
