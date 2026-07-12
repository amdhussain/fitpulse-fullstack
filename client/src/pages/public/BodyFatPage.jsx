import { useState, useEffect } from "react";
import { FitnessLayout } from "../../components/fitness";
import { getToolConfig } from "../../lib/fitnessToolsData";
import { calculateBodyFat } from "../../lib/fitnessCalculations";

function BodyFatPage() {
  const config = getToolConfig("body-fat");
  const [result, setResult] = useState(null);
  const [resultDetails, setResultDetails] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculate = (values, unit) => {
    const gender = values.gender || "male";
    const age = parseFloat(values.age) || 25;
    const weight = parseFloat(values.weight) || 0;
    const height = unit === "imperial"
      ? (parseFloat(values.heightFeet) || 0) * 12 + (parseFloat(values.heightInches) || 0)
      : parseFloat(values.height) || 0;
    const neck = parseFloat(values.neck) || 0;
    const waist = parseFloat(values.waist) || 0;
    const res = calculateBodyFat(gender, age, weight, neck, waist, height, unit);
    setResult(res);
    setResultDetails([
      { label: "Gender", value: gender.charAt(0).toUpperCase() + gender.slice(1) },
      { label: "Age", value: `${age} years` },
      { label: "Weight", value: `${weight} ${unit === "imperial" ? "lbs" : "kg"}` },
      { label: "Waist", value: `${waist} ${unit === "imperial" ? "in" : "cm"}` },
      { label: "Neck", value: `${neck} ${unit === "imperial" ? "in" : "cm"}` },
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

export default BodyFatPage;
