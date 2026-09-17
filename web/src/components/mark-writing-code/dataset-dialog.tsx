"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DatasetRow } from "@/lib/ml/types";
import { FEATURE_LABELS, FEATURE_NAMES, TARGET_LABEL } from "@/lib/ml/types";

function formatCell(value: DatasetRow[keyof DatasetRow]) {
  return String(value);
}

export function DatasetDialog({ rows }: { rows: DatasetRow[] }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button variant="outline" />}>
        View dataset
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Training dataset</DialogTitle>
          <DialogDescription>
            {rows.length} semi-realistic rows generated locally and shipped with
            the app. The browser only trains on this file.
          </DialogDescription>
        </DialogHeader>
        {open ? (
          <div className="max-h-[60vh] overflow-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  {FEATURE_NAMES.map((feature) => (
                    <TableHead key={feature}>{FEATURE_LABELS[feature]}</TableHead>
                  ))}
                  <TableHead>{TARGET_LABEL}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{formatCell(row.day_of_week)}</TableCell>
                    <TableCell>{formatCell(row.hour_of_day)}</TableCell>
                    <TableCell>{formatCell(row.on_holiday)}</TableCell>
                    <TableCell>
                      {formatCell(row.distance_travelled_during_day)}
                    </TableCell>
                    <TableCell>{formatCell(row.writing_code)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
