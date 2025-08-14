export interface RiskLevel {
  level: "very-low" | "low" | "moderate" | "high" | "very-high";
  label: string;
  description: string;
  color: string;
}

export function getRiskLevel(score: number): RiskLevel {
  if (score <= 20) {
    return {
      level: "very-low",
      label: "Very Low",
      description: "Minimal concern - standard preparations sufficient",
      color: "risk-very-low"
    };
  } else if (score <= 40) {
    return {
      level: "low",
      label: "Relatively Low", 
      description: "Low concern - basic awareness recommended",
      color: "risk-low"
    };
  } else if (score <= 60) {
    return {
      level: "moderate", 
      label: "Relatively Moderate",
      description: "Moderate concern - basic preparation recommended",
      color: "risk-moderate"
    };
  } else if (score <= 80) {
    return {
      level: "high",
      label: "Relatively High", 
      description: "High concern - active preparation needed",
      color: "risk-high"
    };
  } else {
    return {
      level: "very-high",
      label: "Very High",
      description: "Very high concern - comprehensive preparation essential",
      color: "risk-very-high"
    };
  }
}