import { useState, useEffect } from "react";
import { FitnessLayout } from "../../components/fitness";
import { getToolConfig } from "../../lib/fitnessToolsData";
import { calculateIdealWeight } from "../../lib/fitnessCalculations";

function IdealWeightPage() {
  const config = getToolConfig("ideal-weight");
  const [result, setResult] = useState(null);
  const [resultDetails, setResultDetails] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const calculate = (values, unit) => {
    const height = unit === "imperial"
      ? (parseFloat(values.heightFeet) || 0) * 12 + (parseFloat(values.heightInches) || 0)
      : parseFloat(values.height) || 0;
    const gender = values.gender || "male";
    const res = calculateIdealWeight(height, gender, unit);
    setResult(res);
    setResultDetails([
      { label: "Height", value: unit === "imperial" ? `${values.heightFeet || 0} ft ${values.heightInches || 0} in` : `${height} cm` },
      { label: "Gender", value: gender.charAt(0).toUpperCase() + gender.slice(1) },
      { label: "Ideal Range", value: res.range },
      { label: "Average", value: `${res.ideal} ${res.unit}` },
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

export default IdealWeightPage;
