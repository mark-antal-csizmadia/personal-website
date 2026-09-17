"use client";

import { ChevronDownIcon, RotateCcwIcon } from "lucide-react";
import {
  useLayoutEffect,
  useState,
  type TransitionEvent,
} from "react";

import { Button } from "@/components/ui/button";
import { funFacts } from "@/lib/fun-facts";
import { cn } from "@/lib/utils";

const VISIBLE_COUNT = 3;
const ITEM_HEIGHT_REM = 1.75;

export function KeepGoingFacts() {
  const factCount = funFacts.length;
  const [offset, setOffset] = useState(factCount);
  const [animating, setAnimating] = useState(false);
  const [skipTransition, setSkipTransition] = useState(false);

  useLayoutEffect(() => {
    if (!skipTransition) {
      return;
    }

    const frame = requestAnimationFrame(() => {
      setSkipTransition(false);
      setAnimating(false);
    });

    return () => cancelAnimationFrame(frame);
  }, [skipTransition]);

  if (factCount === 0) {
    return null;
  }

  const tape = [...funFacts, ...funFacts];
  const visibleFacts = Array.from(
    { length: VISIBLE_COUNT },
    (_, index) => funFacts[(offset + index) % factCount],
  );
  const isStartOver = offset <= 1;

  function keepGoing() {
    if (animating) {
      return;
    }

    if (
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setOffset((current) => {
        const next = current - 1;
        return next <= 0 ? factCount : next;
      });
      return;
    }

    setAnimating(true);
    setOffset((current) => current - 1);
  }

  function handleTransitionEnd(event: TransitionEvent<HTMLUListElement>) {
    if (event.target !== event.currentTarget) {
      return;
    }

    if (event.propertyName !== "transform") {
      return;
    }

    if (offset > 0) {
      setAnimating(false);
      return;
    }

    setSkipTransition(true);
    setOffset(factCount);
  }

  return (
    <div className="mt-6 max-w-xl">
      <p className="sr-only" aria-live="polite">
        {visibleFacts.map((fact) => fact.text).join(" ")}
      </p>
      <div
        aria-hidden="true"
        className="relative overflow-hidden"
        style={{ height: `calc(${VISIBLE_COUNT} * ${ITEM_HEIGHT_REM}rem)` }}
      >
        <ul
          className={cn(
            "absolute inset-x-0 top-0 m-0 list-none p-0",
            !skipTransition &&
              "motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-[cubic-bezier(0.22,1.7,0.36,1)]",
          )}
          style={{
            transform: `translateY(calc(-${offset} * ${ITEM_HEIGHT_REM}rem))`,
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {tape.map((fact, index) => (
            <li
              key={`${fact.id}-${index}`}
              title={fact.text}
              className="flex h-7 items-center leading-7 text-muted-foreground"
            >
              <span className="truncate">{fact.text}</span>
            </li>
          ))}
        </ul>
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="mt-4 rounded-full"
        aria-label={
          isStartOver ? "Start fun facts over" : "Show the next fun fact"
        }
        onClick={keepGoing}
      >
        {isStartOver ? "Start over" : "Keep going"}
        {isStartOver ? <RotateCcwIcon /> : <ChevronDownIcon />}
      </Button>
    </div>
  );
}
