"use client";

import { useState } from "react";
import { ChevronDownIcon, LightbulbIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export function CodingHints() {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger
        render={
          <Button variant="outline" className="w-full justify-between" />
        }
      >
        <span className="flex items-center gap-2">
          <LightbulbIcon className="size-4" />
          Would you like some hints when I code?
        </span>
        <ChevronDownIcon
          className={`size-4 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="mt-3 grid gap-3 rounded-lg border bg-muted/40 p-4">
          <p className="text-sm text-muted-foreground">
            The training rows follow a semi-realistic schedule, so these are the
            moments the model has actually seen me at the keyboard.
          </p>
          <ul className="grid list-disc gap-2 pl-5 text-sm text-muted-foreground">
            <li>
              Weekdays I usually write code 9–5, with peaks around 11:00 and
              15:00. Side-project time is later: strongest around 21:00, with a
              smaller bump at 20:00 and 22:00.
            </li>
            <li>
              Weekends are quieter. There is a bit of daytime coding between
              10:00 and 18:00, then another evening spike around 21:00.
            </li>
            <li>
              On holiday I almost never write code. In the whole dataset that
              only happens once or twice.
            </li>
            <li>
              Distance is a weak tell. Work-from-home days stay near 0 km.
              Office days are a 4–5 km commute, sometimes logged as a round trip
              and sometimes as 0. Weekends might include a 1–2 km walk.
            </li>
          </ul>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
