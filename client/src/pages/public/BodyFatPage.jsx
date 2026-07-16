import { useState } from "react";
import { tools, calculateBodyFat } from "../../lib/fitnessTools";
import { FitnessLayout, ResultCard } from "../../components/fitness";
import { UnitToggle, NumberInput, SelectInput } from "../../components/fitness/CalculatorForm";
import { Button } from "../../components/ui";

const tool = tools.find((t) => t.id === "body-fat");

function BodyFatPage() {
  const [unit, setUnit] = useState("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [neck, setNeck] = useState("");
  const [waist, setWaist] = useState("");
  const [gender, setGender] = useState("male");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!weight || !height || !neck || !waist) return;
    setResult(calculateBodyFat(parseFloat(weight), parseFloat(height), parseFloat(neck), parseFloat(waist), gender, unit));
  };

  const unitLabel = unit === "metric" ? "cm" : "in";

  return (
    <FitnessLayout tool={tool}>
      <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-semibold text-gray-900 dark:text-white text-lg">Enter Your Details</h2>
          <UnitToggle unit={unit} onChange={setUnit} />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <NumberInput label={`Weight (${unit === "metric" ? "kg" : "lbs"})`} value={weight} onChange={setWeight} placeholder="70" />
          <NumberInput label={`Height (${unitLabel})`} value={height} onChange={setHeight} placeholder="175" />
        </div>
        <div className="grid grid-cols-2 gap-3 mb-3">
          <NumberInput label={`Neck (${unitLabel})`} value={neck} onChange={setNeck} placeholder="38" />
          <NumberInput label={`Waist (${unitLabel})`} value={waist} onChange={setWaist} placeholder="80" />
        </div>
        <div className="mb-4">
          <SelectInput label="Gender" value={gender} onChange={setGender} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
        </div>
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate Body Fat</Button>
      </div>
      {result && (
        <div className="mt-4">
          <ResultCard value={`${result.value}%`} label="Body Fat Percentage" unit="U.S. Navy Method" color="red" />
        </div>
      )}
    </FitnessLayout>
  );
}

export default BodyFatPage;
