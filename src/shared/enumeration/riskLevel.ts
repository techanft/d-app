export enum RiskLevel {
  VERY_LOW = "VERY_LOW",
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  VERY_HIGH = "VERY_HIGH",
}

export const riskLevelArray: RiskLevel[] = [
  RiskLevel.VERY_LOW,
  RiskLevel.LOW,
  RiskLevel.MEDIUM,
  RiskLevel.HIGH,
  RiskLevel.VERY_HIGH,
];

export const mapRiskLevel: { [key in RiskLevel]: string } = {
  [RiskLevel.VERY_LOW]: "Rất thấp",
  [RiskLevel.LOW]: "Thấp",
  [RiskLevel.MEDIUM]: "Trung bình",
  [RiskLevel.HIGH]: "Cao",
  [RiskLevel.VERY_HIGH]: "Rất cao",
};

export const mapRiskLevelBadge: { [key in RiskLevel]: string } = {
  [RiskLevel.VERY_LOW]: "success",
  [RiskLevel.LOW]: "info",
  [RiskLevel.MEDIUM]: "primary",
  [RiskLevel.HIGH]: "warning",
  [RiskLevel.VERY_HIGH]: "danger",
};
