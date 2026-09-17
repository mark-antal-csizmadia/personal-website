import { encodeDataset, encodeRow } from "@/lib/ml/features";
import {
  FEATURE_LABELS,
  FEATURE_NAMES,
  type DatasetRow,
  type PredictResult,
  type ShapValue,
  type TestRow,
  type TrainParams,
  type TrainResult,
} from "@/lib/ml/types";

type XgboostModule = typeof import("@wlearn/xgboost");
type Booster = import("@wlearn/xgboost").Booster;

let xgb: XgboostModule | null = null;
let booster: Booster | null = null;
let trainMatrix: number[][] | null = null;
let wasmReady = false;

async function loadRuntime(): Promise<{ wasmLoadMs: number | null }> {
  if (!xgb) {
    xgb = await import("@wlearn/xgboost");
  }

  if (wasmReady) {
    await xgb.loadXGB();
    return { wasmLoadMs: null };
  }

  const started = performance.now();
  await xgb.loadXGB();
  wasmReady = true;
  return { wasmLoadMs: performance.now() - started };
}

function meanAbsShap(contribs: Float32Array, rows: number): ShapValue[] {
  const stride = FEATURE_NAMES.length + 1;
  return FEATURE_NAMES.map((feature, index) => {
    let total = 0;
    for (let row = 0; row < rows; row++) {
      total += Math.abs(contribs[row * stride + index]);
    }
    return {
      feature,
      label: FEATURE_LABELS[feature],
      value: total / rows,
    };
  }).sort((a, b) => b.value - a.value);
}

function localShap(contribs: Float32Array): {
  shap: ShapValue[];
  bias: number;
} {
  const shap = FEATURE_NAMES.map((feature, index) => ({
    feature,
    label: FEATURE_LABELS[feature],
    value: contribs[index],
  })).sort((a, b) => Math.abs(b.value) - Math.abs(a.value));

  return { shap, bias: contribs[FEATURE_NAMES.length] };
}

function disposeBooster() {
  if (booster) {
    booster.dispose();
    booster = null;
  }
}

export async function trainModel(
  rows: DatasetRow[],
  params: TrainParams,
): Promise<TrainResult> {
  const { wasmLoadMs } = await loadRuntime();
  if (!xgb) throw new Error("XGBoost failed to load");

  const { X, y } = encodeDataset(rows);
  const dtrain = new xgb.DMatrix(X, { label: y });

  disposeBooster();

  const started = performance.now();
  const next = new xgb.Booster(
    {
      objective: "binary:logistic",
      max_depth: 3,
      eta: 0.3,
      lambda: params.lambda,
      verbosity: 0,
    },
    [dtrain],
  );
  for (let round = 0; round < params.numRound; round++) {
    next.update(dtrain, round);
  }
  const trainMs = performance.now() - started;

  const contribs = next.predict(dtrain, { type: 2 });
  const modelBytes = next.saveModel("json");
  dtrain.dispose();

  booster = next;
  trainMatrix = X;

  return {
    trainMs,
    wasmLoadMs,
    globalImportance: meanAbsShap(contribs, X.length),
    modelJson: new TextDecoder().decode(modelBytes),
  };
}

export async function predictRow(row: TestRow): Promise<PredictResult> {
  if (!xgb || !booster) {
    throw new Error("Train a model before predicting");
  }

  const features = [encodeRow(row)];
  const dtest = new xgb.DMatrix(features);

  const started = performance.now();
  const probs = booster.predict(dtest, { type: 0 });
  const inferenceMs = performance.now() - started;

  const contribs = booster.predict(dtest, { type: 2 });
  dtest.dispose();

  const { shap, bias } = localShap(contribs);

  return {
    probability: probs[0],
    inferenceMs,
    shap,
    bias,
  };
}

export function disposeModel() {
  disposeBooster();
  trainMatrix = null;
}

export function hasTrainedModel() {
  return booster !== null && trainMatrix !== null;
}
