import { useState } from "react";
import { tools, calculateCalories, activityLevels } from "../../lib/fitnessTools";
import { FitnessLayout, ResultCard } from "../../components/fitness";
import { UnitToggle, NumberInput, SelectInput, ActivitySelect } from "../../components/fitness/CalculatorForm";
import { Button } from "../../components/ui";

const tool = tools.find((t) => t.id === "calories");

function CaloriePage() {
  const [unit, setUnit] = useState("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("1.55");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!weight || !height || !age) return;
    setResult(calculateCalories(parseFloat(weight), parseFloat(height), parseInt(age), gender, parseFloat(activity), unit));
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
        <div className="grid grid-cols-2 gap-3 mb-3">
          <NumberInput label="Age" value={age} onChange={setAge} placeholder="25" min={1} max={120} step={1} />
          <SelectInput label="Gender" value={gender} onChange={setGender} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }]} />
        </div>
        <div className="mb-4">
          <ActivitySelect value={activity} onChange={setActivity} />
        </div>
        <Button onClick={handleCalculate} variant="primary" className="w-full">Calculate Calories</Button>
      </div>
      {result && (
        <div className="grid grid-cols-2 gap-3 mt-4">
          <ResultCard value={result.bmr} label="BMR" unit={result.unit} color="orange" />
          <ResultCard value={result.maintenance} label="Maintenance" unit={result.unit} color="emerald" />
          <ResultCard value={result.lose} label="To Lose Weight" unit={result.unit} color="red" />
          <ResultCard value={result.gain} label="To Gain Weight" unit={result.unit} color="blue" />
        </div>
      )}
    </FitnessLayout>
  );
}

export default CaloriePage;
