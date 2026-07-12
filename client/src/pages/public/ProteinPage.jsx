import { useState, useEffect } from "react";
import { FitnessLayout } from "../../components/fitness";
import { getToolConfig } from "../../lib/fitnessToolsData";
import { calculateProtein } from "../../lib/fitnessCalculations";

function ProteinPage() {
  const config = getToolConfig("protein");
  const [result, setResult] = useState(null);
  const [resultDetails, setResultDetails] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculate = (values, unit) => {
    const weight = parseFloat(values.weight) || 0;
    const activity = values.activityLevel || "moderate";
    const goal = values.goal || "maintain";
    const res = calculateProtein(weight, activity, goal, unit);
    const perMeal = Math.round(res.ideal / 4);
    setResult(res);
    setResultDetails([
      { label: "Weight", value: `${weight} ${unit === "imperial" ? "lbs" : "kg"}` },
      { label: "Activity Level", value: activity.charAt(0).toUpperCase() + activity.slice(1) },
      { label: "Fitness Goal", value: goal.charAt(0).toUpperCase() + goal.slice(1) },
      { label: "Per Meal (4 meals)", value: `${perMeal}g protein` },
    ]);
    return res;
  };

  return (
    <FitnessLayout
      config={config}
      onCalculate={calculate}
      result={result}
      resultDetails={resultDetails}
    />
  );
}

export default ProteinPage;
