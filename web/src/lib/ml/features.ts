import type { BinaryFlag, DatasetRow, DayOfWeek, TestRow } from "@/lib/ml/types";
import { DAYS_OF_WEEK } from "@/lib/ml/types";

export function encodeDay(day: DayOfWeek): number {
  return DAYS_OF_WEEK.indexOf(day);
}

/** Coerce JSON booleans, 0/1, and strings into a numeric flag XGBoost can split on. */
export function encodeFlag(value: unknown): BinaryFlag {
  if (value === 1 || value === true || value === "1" || value === "true") {
    return 1;
  }
  return 0;
}

export function encodeRow(row: TestRow): number[] {
  return [
    encodeDay(row.day_of_week),
    Number(row.hour_of_day),
    encodeFlag(row.on_holiday),
    Number(row.distance_travelled_during_day),
  ];
}

export function encodeDataset(rows: DatasetRow[]): {
  X: number[][];
  y: number[];
} {
  return {
    X: rows.map(encodeRow),
    y: rows.map((row) => encodeFlag(row.writing_code)),
  };
}

export function currentTestRow(): TestRow {
  const now = new Date();
  const jsDay = now.getDay();
  const day = DAYS_OF_WEEK[jsDay === 0 ? 6 : jsDay - 1];

  return {
    day_of_week: day,
    hour_of_day: now.getHours(),
    on_holiday: 0,
    distance_travelled_during_day: 0,
  };
}
