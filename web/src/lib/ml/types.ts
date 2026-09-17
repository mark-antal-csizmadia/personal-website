export const DAYS_OF_WEEK = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
] as const;

export type DayOfWeek = (typeof DAYS_OF_WEEK)[number];

export type BinaryFlag = 0 | 1;

export type DatasetRow = {
  day_of_week: DayOfWeek;
  hour_of_day: number;
  on_holiday: BinaryFlag;
  distance_travelled_during_day: number;
  writing_code: BinaryFlag;
};

export type FeatureName =
  | "day_of_week"
  | "hour_of_day"
  | "on_holiday"
  | "distance_travelled_during_day";

export const FEATURE_NAMES: FeatureName[] = [
  "day_of_week",
  "hour_of_day",
  "on_holiday",
  "distance_travelled_during_day",
];

export const FEATURE_LABELS: Record<FeatureName, string> = {
  day_of_week: "Day of week",
  hour_of_day: "Hour of day",
  on_holiday: "Márk is on holiday",
  distance_travelled_during_day: "Distance travelled by Márk (km)",
};

export const TARGET_LABEL = "Márk writing code";

export type TestRow = Omit<DatasetRow, "writing_code">;

export type TrainParams = {
  numRound: number;
  lambda: number;
};

export type ShapValue = {
  feature: FeatureName;
  label: string;
  value: number;
};

export type TrainResult = {
  trainMs: number;
  wasmLoadMs: number | null;
  globalImportance: ShapValue[];
  modelJson: string;
};

export type PredictResult = {
  probability: number;
  inferenceMs: number;
  shap: ShapValue[];
  bias: number;
};
