import { useState } from "react";
import { tools, calculateMealPlanner } from "../../lib/fitnessTools";
import { FitnessLayout, ResultCard } from "../../components/fitness";
import { UnitToggle, NumberInput, SelectInput, ActivitySelect } from "../../components/fitness/CalculatorForm";
import { Button } from "../../components/ui";

const tool = tools.find((t) => t.id === "meal-planner");

function MealPlannerPage() {
  const [unit, setUnit] = useState("metric");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [activity, setActivity] = useState("1.55");
  const [goal, setGoal] = useState("maintain");
  const [result, setResult] = useState(null);

  const handleCalculate = () => {
    if (!weight || !height || !age) return;
    setResult(calculateMealPlanner(parseFloat(weight), parseFloat(height), parseInt(age), gender, parseFloat(activity), goal, unit));
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
        <div className="grid grid-cols-2 gap-3 mb-3">
          <ActivitySelect value={activity} onChange={setActivity} />
          <SelectInput label="Goal" value={goal} onChange={setGoal} options={[{ value: "lose", label: "Lose Weight" }, { value: "maintain", label: "Maintain" }, { value: "gain", label: "Gain Weight" }]} />
        </div>
        <Button onClick={handleCalculate} variant="primary" className="w-full">Generate Meal Plan</Button>
      </div>
      {result && (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <ResultCard value={result.maintenance} label="Daily Target" unit={result.unit} color="rose" />
            <ResultCard value={result.water} label="Water Intake" unit="L/day" color="blue" />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 text-lg">Meal Breakdown</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Breakfast (25%)</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{result.breakfast} cal</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Lunch (35%)</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{result.lunch} cal</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Dinner (30%)</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{result.dinner} cal</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Snacks (10%)</span>
                <span className="text-sm font-semibold text-gray-900 dark:text-white">{result.snacks} cal</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <ResultCard value={result.protein} label="Protein" unit="g/day" color="rose" />
            <ResultCard value={result.fat} label="Fat" unit="g/day" color="orange" />
            <ResultCard value={result.carbs} label="Carbs" unit="g/day" color="emerald" />
          </div>
        </div>
      )}
    </FitnessLayout>
  );
}

export default MealPlannerPage;
