"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { ShapValue } from "@/lib/ml/types";

const localConfig = {
  value: { label: "SHAP value" },
} satisfies ChartConfig;

const globalConfig = {
  value: { label: "Mean |SHAP|" },
} satisfies ChartConfig;

function signedColor(value: number) {
  return value >= 0 ? "var(--chart-2)" : "var(--destructive)";
}

export function LocalShapChart({ values }: { values: ShapValue[] }) {
  const data = values.map((item) => ({
    feature: item.label,
    value: Number(item.value.toFixed(3)),
  }));

  return (
    <ChartContainer config={localConfig} className="aspect-auto h-56 w-full">
      <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 8, right: 12 }}>
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="feature"
          type="category"
          tickLine={false}
          axisLine={false}
          width={200}
        />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" radius={4}>
          {data.map((item) => (
            <Cell key={item.feature} fill={signedColor(item.value)} />
          ))}
        </Bar>
      </BarChart>
    </ChartContainer>
  );
}

export function GlobalImportanceChart({ values }: { values: ShapValue[] }) {
  const data = values.map((item) => ({
    feature: item.label,
    value: Number(item.value.toFixed(3)),
  }));

  return (
    <ChartContainer config={globalConfig} className="aspect-auto h-56 w-full">
      <BarChart accessibilityLayer data={data} layout="vertical" margin={{ left: 8, right: 12 }}>
        <CartesianGrid horizontal={false} />
        <YAxis
          dataKey="feature"
          type="category"
          tickLine={false}
          axisLine={false}
          width={200}
        />
        <XAxis type="number" tickLine={false} axisLine={false} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <Bar dataKey="value" fill="var(--chart-2)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
