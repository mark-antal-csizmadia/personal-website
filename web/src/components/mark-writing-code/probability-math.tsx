"use client";

import { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FEATURE_NAMES, type ShapValue } from "@/lib/ml/types";

function formatFixed(value: number, digits = 3) {
  const abs = Math.abs(value).toFixed(digits);
  return value < 0 ? `−${abs}` : abs;
}

function formatTerm(value: number, digits = 3) {
  const abs = Math.abs(value).toFixed(digits);
  return value < 0 ? `− ${abs}` : `+ ${abs}`;
}

function sigmoid(logOdds: number) {
  return 1 / (1 + Math.exp(-logOdds));
}

export function ProbabilityMath({
  bias,
  shap,
  probability,
}: {
  bias: number;
  shap: ShapValue[];
  probability: number;
}) {
  const [open, setOpen] = useState(false);
  const byFeature = new Map(shap.map((item) => [item.feature, item]));
  const ordered = FEATURE_NAMES.map((feature) => byFeature.get(feature)).filter(
    (item): item is ShapValue => item != null,
  );
  const logOdds = ordered.reduce((sum, item) => sum + item.value, 0) + bias;
  const fromLogOdds = sigmoid(logOdds);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        render={
          <Button variant="outline" className="w-full justify-between" />
        }
      >
        From log-odds to probability
        <ChevronDownIcon
          className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-3 grid gap-3 rounded-lg border bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">
            TreeSHAP is additive in log-odds. The sigmoid maps that sum onto a
            probability in (0, 1).
          </p>
          <div className="grid gap-3 overflow-x-auto font-mono text-sm leading-7">
            <p>
              logit(p) = bias{" "}
              {ordered.map((item) => formatTerm(item.value)).join(" ")}
            </p>
            <ul className="grid gap-1 text-muted-foreground">
              <li>bias = {formatFixed(bias)}</li>
              {ordered.map((item) => (
                <li key={item.feature}>
                  {item.label} = {formatFixed(item.value)}
                </li>
              ))}
            </ul>
            <p>logit(p) = {formatFixed(logOdds)}</p>
            <p>
              p = 1 / (1 + e
              <sup>−logit(p)</sup>) = 1 / (1 + e
              <sup>{formatFixed(-logOdds)}</sup>)
            </p>
            <p>
              p = {fromLogOdds.toFixed(4)} = {(fromLogOdds * 100).toFixed(1)}%
              {Math.abs(fromLogOdds - probability) > 1e-3
                ? ` (model ${probability.toFixed(4)})`
                : null}
            </p>
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
