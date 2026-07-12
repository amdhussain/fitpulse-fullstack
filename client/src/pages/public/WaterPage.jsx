import { useState, useEffect } from "react";
import { FitnessLayout } from "../../components/fitness";
import { getToolConfig } from "../../lib/fitnessToolsData";
import { calculateWaterIntake } from "../../lib/fitnessCalculations";

function WaterPage() {
  const config = getToolConfig("water");
  const [result, setResult] = useState(null);
  const [resultDetails, setResultDetails] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculate = (values, unit) => {
    const weight = parseFloat(values.weight) || 0;
    const activity = values.activityLevel || "moderate";
    const res = calculateWaterIntake(weight, activity, unit);
    setResult(res);
    setResultDetails([
      { label: "Weight", value: `${weight} ${unit === "imperial" ? "lbs" : "kg"}` },
      { label: "Activity Level", value: activity.charAt(0).toUpperCase() + activity.slice(1) },
      { label: "Daily Goal", value: `${res.liters} liters` },
      { label: "In Glasses", value: `${res.glasses} glasses (8oz each)` },
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

export default WaterPage;
