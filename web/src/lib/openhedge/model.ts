/** Override with OPENROUTER_MODEL in .env.local. */
export const DEFAULT_OPENROUTER_MODEL = "deepseek/deepseek-v4.1-flash";

export const DEFAULT_STEP_TIMEOUT_MS = 90_000;
export const DEFAULT_TOOL_TIMEOUT_MS = 40_000;
export const DEFAULT_TOTAL_TIMEOUT_MS = 180_000;

export function openrouterModel() {
  const configured = process.env.OPENROUTER_MODEL?.trim();
  return configured || DEFAULT_OPENROUTER_MODEL;
}

function envPositiveInt(name: string, fallback: number) {
  const raw = process.env[name]?.trim();
  if (!raw) {
    return fallback;
  }
  const value = Number(raw);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

export function generationTimeout() {
  return {
    stepMs: envPositiveInt(
      "OPENHEDGE_STEP_TIMEOUT_MS",
      DEFAULT_STEP_TIMEOUT_MS,
    ),
    toolMs: envPositiveInt(
      "OPENHEDGE_TOOL_TIMEOUT_MS",
      DEFAULT_TOOL_TIMEOUT_MS,
    ),
    totalMs: envPositiveInt(
      "OPENHEDGE_TOTAL_TIMEOUT_MS",
      DEFAULT_TOTAL_TIMEOUT_MS,
    ),
  };
}

