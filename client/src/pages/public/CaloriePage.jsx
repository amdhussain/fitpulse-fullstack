import { useState, useEffect } from "react";
import { FitnessLayout } from "../../components/fitness";
import { getToolConfig } from "../../lib/fitnessToolsData";
import { calculateCalories } from "../../lib/fitnessCalculations";

function CaloriePage() {
  const config = getToolConfig("calories");
  const [result, setResult] = useState(null);
  const [resultDetails, setResultDetails] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculate = (values, unit) => {
    const weight = parseFloat(values.weight) || 0;
    const height = unit === "imperial"
      ? (parseFloat(values.heightFeet) || 0) * 12 + (parseFloat(values.heightInches) || 0)
      : parseFloat(values.height) || 0;
    const age = parseFloat(values.age) || 0;
    const gender = values.gender || "male";
    const activity = values.activityLevel || "moderate";
    const res = calculateCalories(weight, height, age, gender, activity, unit);
    setResult(res);
    setResultDetails([
      { label: "Weight", value: `${weight} ${unit === "imperial" ? "lbs" : "kg"}` },
      { label: "Height", value: unit === "imperial" ? `${values.heightFeet || 0} ft ${values.heightInches || 0} in` : `${height} cm` },
      { label: "Activity Level", value: res.activityLabel || activity },
      { label: "BMR", value: `${res.bmr} cal/day` },
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

export default CaloriePage;
