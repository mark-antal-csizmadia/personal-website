"use client";

import { useMemo, useState, type FormEvent } from "react";

import { DatasetDialog } from "@/components/mark-writing-code/dataset-dialog";
import { ProbabilityMath } from "@/components/mark-writing-code/probability-math";
import {
  GlobalImportanceChart,
  LocalShapChart,
} from "@/components/mark-writing-code/shap-charts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import datasetJson from "@/data/dataset.json";
import { currentTestRow, encodeFlag } from "@/lib/ml/features";
import { formatMs } from "@/lib/ml/timing";
import {
  DAYS_OF_WEEK,
  FEATURE_LABELS,
  type DatasetRow,
  type DayOfWeek,
  type PredictResult,
  type TestRow,
  type TrainResult,
} from "@/lib/ml/types";
import { predictRow, trainModel } from "@/lib/ml/xgboost-client";

const dataset = datasetJson as DatasetRow[];

const HOURS = Array.from({ length: 24 }, (_, hour) => hour);

function ParamSlider({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (value: number) => void;
}) {
  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <Label>{label}</Label>
        <span className="font-mono text-xs text-muted-foreground">{display}</span>
      </div>
      <Slider
        min={min}
        max={max}
        step={step}
        value={[value]}
        onValueChange={(next) => {
          const resolved = Array.isArray(next) ? next[0] : next;
          if (typeof resolved === "number") onChange(resolved);
        }}
      />
    </div>
  );
}

export function MarkWritingCode() {
  const [numRound, setNumRound] = useState(40);
  const [lambda, setLambda] = useState(1);
  const [testRow, setTestRow] = useState<TestRow>(currentTestRow);
  const [trainResult, setTrainResult] = useState<TrainResult | null>(null);
  const [prediction, setPrediction] = useState<PredictResult | null>(null);
  const [training, setTraining] = useState(false);
  const [predicting, setPredicting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const probabilityLabel = useMemo(() => {
    if (!prediction) return null;
    return `${Math.round(prediction.probability * 1000) / 10}%`;
  }, [prediction]);

  function updateTestRow<K extends keyof TestRow>(key: K, value: TestRow[K]) {
    setTestRow((current) => ({ ...current, [key]: value }));
  }

  async function onTrain() {
    setTraining(true);
    setError(null);
    setPrediction(null);
    try {
      const result = await trainModel(dataset, { numRound, lambda });
      setTrainResult(result);
    } catch (cause) {
      setTrainResult(null);
      setError(cause instanceof Error ? cause.message : "Training failed");
    } finally {
      setTraining(false);
    }
  }

  async function onPredict(event: FormEvent) {
    event.preventDefault();
    setPredicting(true);
    setError(null);
    try {
      setPrediction(await predictRow(testRow));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Prediction failed");
    } finally {
      setPredicting(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Train an in-browser XGBoost model to predict whether Márk is writing code right now</CardTitle>
          <CardDescription>
            Gradient boosting runs entirely in your browser on a 100-row
            semi-realistic dataset Márk generated locally. WASM loads on the
            first train click.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <ParamSlider
            label="Boosting rounds"
            value={numRound}
            min={10}
            max={80}
            step={1}
            display={String(numRound)}
            onChange={setNumRound}
          />
          <ParamSlider
            label="L2 regularisation (lambda)"
            value={lambda}
            min={0}
            max={10}
            step={0.1}
            display={lambda.toFixed(1)}
            onChange={setLambda}
          />
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={onTrain} disabled={training}>
              {training ? "Training…" : trainResult ? "Retrain" : "Train"}
            </Button>
            <DatasetDialog rows={dataset} />
            {trainResult ? (
              <Dialog>
                <DialogTrigger render={<Button variant="ghost" />}>
                  View model
                </DialogTrigger>
                <DialogContent className="sm:max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Saved booster JSON</DialogTitle>
                    <DialogDescription>
                      Session-only dump from XGBoost. It is discarded when you
                      leave the page or retrain.
                    </DialogDescription>
                  </DialogHeader>
                  <pre className="max-h-80 overflow-auto rounded-lg bg-muted p-3 font-mono text-xs">
                    {trainResult.modelJson}
                  </pre>
                </DialogContent>
              </Dialog>
            ) : null}
          </div>
          {trainResult ? (
            <p className="text-sm text-muted-foreground">
              Trained in {formatMs(trainResult.trainMs)}
              {trainResult.wasmLoadMs != null
                ? ` · WASM loaded in ${formatMs(trainResult.wasmLoadMs)}`
                : null}
            </p>
          ) : null}
        </CardContent>
      </Card>

      {trainResult ? (
        <Card>
          <CardHeader>
            <CardTitle>Test row</CardTitle>
            <CardDescription>
              Features match the training data. Defaults are this device&apos;s
              current weekday and hour.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="grid gap-5" onSubmit={onPredict}>
              <div className="grid gap-2">
                <Label htmlFor="day-of-week">{FEATURE_LABELS.day_of_week}</Label>
                <Select
                  value={testRow.day_of_week}
                  onValueChange={(value: DayOfWeek | null) => {
                    if (value) updateTestRow("day_of_week", value);
                  }}
                >
                  <SelectTrigger id="day-of-week" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAYS_OF_WEEK.map((day) => (
                      <SelectItem key={day} value={day}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hour-of-day">{FEATURE_LABELS.hour_of_day}</Label>
                <Select
                  value={testRow.hour_of_day}
                  onValueChange={(value: number | null) => {
                    if (value != null) updateTestRow("hour_of_day", value);
                  }}
                >
                  <SelectTrigger id="hour-of-day" className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {HOURS.map((hour) => (
                      <SelectItem key={hour} value={hour}>
                        {String(hour).padStart(2, "0")}:00
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="distance">
                  {FEATURE_LABELS.distance_travelled_during_day}
                </Label>
                <Input
                  id="distance"
                  type="number"
                  min={0}
                  step={0.1}
                  value={testRow.distance_travelled_during_day}
                  onChange={(event) =>
                    updateTestRow(
                      "distance_travelled_during_day",
                      Number(event.target.value),
                    )
                  }
                />
              </div>
              <div className="flex items-center justify-between gap-3 rounded-lg border px-3 py-2">
                <Label htmlFor="on-holiday">{FEATURE_LABELS.on_holiday}</Label>
                <Switch
                  id="on-holiday"
                  checked={testRow.on_holiday === 1}
                  onCheckedChange={(checked) =>
                    updateTestRow("on_holiday", encodeFlag(checked))
                  }
                />
              </div>
              <Button type="submit" disabled={predicting}>
                {predicting ? "Predicting…" : "Predict"}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {prediction && probabilityLabel ? (
        <Card>
          <CardHeader>
            <CardTitle>Is Márk writing code right now?</CardTitle>
            <CardDescription>
              Probability from `binary:logistic`. The exact conversion from
              TreeSHAP log-odds is shown below.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <p className="font-heading text-5xl font-medium tracking-tight">
                {probabilityLabel}
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">
                  Train {formatMs(trainResult?.trainMs ?? 0)}
                </Badge>
                <Badge variant="secondary">
                  Infer {formatMs(prediction.inferenceMs)}
                </Badge>
              </div>
            </div>
            <ProbabilityMath
              bias={prediction.bias}
              shap={prediction.shap}
              probability={prediction.probability}
            />
            <div className="grid gap-2">
              <h3 className="font-medium">Why this prediction</h3>
              <p className="text-sm text-muted-foreground">
                Local TreeSHAP for this row. Positive bars push the log-odds of
                Márk writing code up; negative bars push them down.
              </p>
              <LocalShapChart values={prediction.shap} />
            </div>
            <div className="grid gap-2">
              <h3 className="font-medium">Global feature importance</h3>
              <p className="text-sm text-muted-foreground">
                Mean absolute SHAP over the training set. This is how much each
                feature moves predictions on average, not just for this row.
              </p>
              <GlobalImportanceChart values={trainResult?.globalImportance ?? []} />
            </div>
          </CardContent>
        </Card>
      ) : null}

      {error ? (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
