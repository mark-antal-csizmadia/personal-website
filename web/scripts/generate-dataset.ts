import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { DAYS_OF_WEEK, type DatasetRow, type DayOfWeek } from "../src/lib/ml/types";

const WEEKEND = new Set<DayOfWeek>(["Saturday", "Sunday"]);

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function choice<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]!;
}

function choiceWeighted<T>(
  rng: () => number,
  items: readonly T[],
  probs: readonly number[],
): T {
  const sample = rng();
  let cumulative = 0;
  for (let i = 0; i < items.length; i++) {
    cumulative += probs[i]!;
    if (sample < cumulative) return items[i]!;
  }
  return items[items.length - 1]!;
}

function randint(rng: () => number, maxExclusive: number) {
  return Math.floor(rng() * maxExclusive);
}

function uniform(rng: () => number, min: number, max: number) {
  return min + rng() * (max - min);
}

function round1(value: number) {
  return Math.round(value * 10) / 10;
}

function writingCodeProbability(
  onHoliday: 0 | 1,
  day: DayOfWeek,
  hour: number,
): number {
  if (onHoliday === 1) return 0.04;

  if (WEEKEND.has(day)) {
    if (hour === 21) return 0.55;
    if (hour === 20 || hour === 22) return 0.25;
    if (hour >= 10 && hour <= 18) return 0.15;
    return 0.04;
  }

  if (hour === 11 || hour === 15) return 0.85;
  if (hour === 21) return 0.75;
  if (hour === 20 || hour === 22) return 0.3;
  if (hour >= 9 && hour <= 17) return 0.45;
  return 0.05;
}

function distanceTravelled(
  rng: () => number,
  onHoliday: 0 | 1,
  day: DayOfWeek,
): number {
  if (onHoliday === 1) {
    return round1(uniform(rng, 2.0, 25.0));
  }

  if (WEEKEND.has(day)) {
    const walked = choiceWeighted(rng, [true, false], [0.4, 0.6]);
    return walked ? round1(uniform(rng, 1.0, 2.0)) : 0.0;
  }

  const wentToOffice = choiceWeighted(rng, [true, false], [0.5, 0.5]);
  if (!wentToOffice) {
    const tinyMovement = choiceWeighted(rng, [true, false], [0.3, 0.7]);
    return tinyMovement ? round1(uniform(rng, 0.1, 0.4)) : 0.0;
  }

  const oneWayKm = uniform(rng, 4.0, 5.0);
  const recordedRoundTrip = choiceWeighted(rng, [true, false], [0.5, 0.5]);
  return recordedRoundTrip ? round1(2 * oneWayKm) : 0.0;
}

function generateRows(count: number, seed: number): DatasetRow[] {
  const rng = mulberry32(seed);
  const rows: DatasetRow[] = [];

  for (let i = 0; i < count; i++) {
    const day = choice(rng, DAYS_OF_WEEK) as DayOfWeek;
    const hour = randint(rng, 24);
    const onHoliday = choiceWeighted(rng, [1, 0] as const, [0.15, 0.85]);
    const probability = writingCodeProbability(onHoliday, day, hour);

    rows.push({
      day_of_week: day,
      hour_of_day: hour,
      on_holiday: onHoliday,
      distance_travelled_during_day: distanceTravelled(rng, onHoliday, day),
      writing_code: rng() < probability ? 1 : 0,
    });
  }

  return enforceRareHolidayWriting(rows, rng);
}

function enforceRareHolidayWriting(
  rows: DatasetRow[],
  rng: () => number,
): DatasetRow[] {
  const holidayIndexes = rows
    .map((row, index) => (row.on_holiday === 1 ? index : -1))
    .filter((index) => index >= 0);
  const writing = holidayIndexes.filter(
    (index) => rows[index]!.writing_code === 1,
  );
  const target = choice(rng, [1, 2] as const);

  while (writing.length > target) {
    const dropAt = Math.floor(rng() * writing.length);
    const rowIndex = writing.splice(dropAt, 1)[0]!;
    rows[rowIndex] = { ...rows[rowIndex]!, writing_code: 0 };
  }

  const idle = holidayIndexes.filter(
    (index) => rows[index]!.writing_code === 0,
  );
  while (writing.length < target && idle.length > 0) {
    const pickAt = Math.floor(rng() * idle.length);
    const rowIndex = idle.splice(pickAt, 1)[0]!;
    rows[rowIndex] = { ...rows[rowIndex]!, writing_code: 1 };
    writing.push(rowIndex);
  }

  return rows;
}

const scriptDir = dirname(fileURLToPath(import.meta.url));
const outputPath = join(scriptDir, "../src/data/dataset.json");
mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(outputPath, `${JSON.stringify(generateRows(100, 42), null, 2)}\n`);
console.log(`Wrote ${outputPath}`);
