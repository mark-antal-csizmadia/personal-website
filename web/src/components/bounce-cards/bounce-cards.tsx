"use client";

import { gsap } from "gsap";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type MouseEvent,
} from "react";

import { cn } from "@/lib/utils";

import "./bounce-cards.css";

const DEFAULT_TRANSFORM_STYLES = [
  "rotate(10deg) translate(-170px)",
  "rotate(5deg) translate(-85px)",
  "rotate(-3deg)",
  "rotate(-10deg) translate(85px)",
  "rotate(2deg) translate(170px)",
];

const FOCUS_SCALE = 1.08;

type BounceCardsProps = {
  className?: string;
  images?: string[];
  alts?: string[];
  containerWidth?: number;
  containerHeight?: number;
  animationDelay?: number;
  animationStagger?: number;
  easeType?: string;
  transformStyles?: string[];
  enableHover?: boolean;
};

function getNoRotationTransform(transformStr: string) {
  const hasRotate = /rotate\([\s\S]*?\)/.test(transformStr);
  if (hasRotate) {
    return transformStr.replace(/rotate\([\s\S]*?\)/, "rotate(0deg)");
  }
  if (transformStr === "none") {
    return "rotate(0deg)";
  }
  return `${transformStr} rotate(0deg)`;
}

function getFocusedTransform(baseTransform: string) {
  return `${getNoRotationTransform(baseTransform)} scale(${FOCUS_SCALE})`;
}

function hasFineHover() {
  return window.matchMedia("(hover: hover) and (pointer: fine)").matches;
}

function getPushedTransform(baseTransform: string, offsetX: number) {
  const translateRegex = /translate\(([-0-9.]+)px\)/;
  const match = baseTransform.match(translateRegex);
  if (match) {
    const currentX = parseFloat(match[1]);
    const newX = currentX + offsetX;
    return baseTransform.replace(translateRegex, `translate(${newX}px)`);
  }
  return baseTransform === "none"
    ? `translate(${offsetX}px)`
    : `${baseTransform} translate(${offsetX}px)`;
}

export function BounceCards({
  className,
  images = [],
  alts = [],
  containerWidth = 400,
  containerHeight = 400,
  animationDelay = 0.5,
  animationStagger = 0.06,
  easeType = "elastic.out(1, 0.8)",
  transformStyles = DEFAULT_TRANSFORM_STYLES,
  enableHover = false,
}: BounceCardsProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [focusedIdx, setFocusedIdx] = useState<number | null>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".card",
        { scale: 0 },
        {
          scale: 1,
          stagger: animationStagger,
          ease: easeType,
          delay: animationDelay,
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, [animationStagger, easeType, animationDelay]);

  const applyFocus = (idx: number | null) => {
    if (!containerRef.current) {
      return;
    }

    const q = gsap.utils.selector(containerRef);

    images.forEach((_, i) => {
      const target = q(`.card-${i}`);
      gsap.killTweensOf(target);
      const baseTransform = transformStyles[i] || "none";
      gsap.to(target, {
        transform:
          idx === i ? getFocusedTransform(baseTransform) : baseTransform,
        duration: 0.4,
        ease: "back.out(1.4)",
        overwrite: "auto",
      });
    });
  };

  const pushSiblings = (hoveredIdx: number) => {
    if (!enableHover || !hasFineHover() || !containerRef.current) {
      return;
    }

    const q = gsap.utils.selector(containerRef);

    images.forEach((_, i) => {
      const target = q(`.card-${i}`);
      gsap.killTweensOf(target);

      const baseTransform = transformStyles[i] || "none";

      if (i === hoveredIdx) {
        const noRotationTransform = getNoRotationTransform(baseTransform);
        gsap.to(target, {
          transform: noRotationTransform,
          duration: 0.4,
          ease: "back.out(1.4)",
          overwrite: "auto",
        });
      } else {
        const offsetX = i < hoveredIdx ? -160 : 160;
        const pushedTransform = getPushedTransform(baseTransform, offsetX);
        const distance = Math.abs(hoveredIdx - i);
        const delay = distance * 0.05;

        gsap.to(target, {
          transform: pushedTransform,
          duration: 0.4,
          ease: "back.out(1.4)",
          delay,
          overwrite: "auto",
        });
      }
    });
  };

  const resetSiblings = () => {
    if (!enableHover || !hasFineHover() || !containerRef.current) {
      return;
    }

    const q = gsap.utils.selector(containerRef);

    images.forEach((_, i) => {
      const target = q(`.card-${i}`);
      gsap.killTweensOf(target);
      const baseTransform = transformStyles[i] || "none";
      gsap.to(target, {
        transform: baseTransform,
        duration: 0.4,
        ease: "back.out(1.4)",
        overwrite: "auto",
      });
    });
  };

  const handleCardClick = (idx: number, event: MouseEvent<HTMLButtonElement>) => {
    if (hasFineHover() && event.detail !== 0) {
      return;
    }

    const nextIdx = focusedIdx === idx ? null : idx;
    setFocusedIdx(nextIdx);
    applyFocus(nextIdx);
  };

  const handleStageClick = (event: MouseEvent<HTMLDivElement>) => {
    if (
      focusedIdx === null ||
      (event.target instanceof Element && event.target.closest(".card"))
    ) {
      return;
    }

    setFocusedIdx(null);
    applyFocus(null);
  };

  const caption =
    focusedIdx !== null ? (alts[focusedIdx] ?? "") : "";

  return (
    <div
      className="bounceCardsViewport"
      style={
        {
          "--bounce-width": `${containerWidth}px`,
          "--bounce-height": `${containerHeight}px`,
        } as CSSProperties
      }
    >
      <div className="bounceCardsSizer" onClick={handleStageClick}>
        <div
          className={cn("bounceCardsContainer", className)}
          ref={containerRef}
          style={{
            width: containerWidth,
            height: containerHeight,
          }}
        >
          {images.map((src, idx) => (
            <button
              key={src}
              type="button"
              className={`card card-${idx}`}
              style={{
                transform: transformStyles[idx] ?? "none",
                zIndex: focusedIdx === idx ? 20 : idx,
              }}
              aria-pressed={focusedIdx === idx}
              aria-label={alts[idx] ?? `card-${idx}`}
              onClick={(event) => {
                event.stopPropagation();
                handleCardClick(idx, event);
              }}
              onMouseEnter={() => {
                if (!hasFineHover()) {
                  return;
                }
                setFocusedIdx(idx);
                pushSiblings(idx);
              }}
              onMouseLeave={() => {
                if (!hasFineHover()) {
                  return;
                }
                setFocusedIdx(null);
                resetSiblings();
              }}
            >
              {/* BounceCards animates the wrapper; a plain img keeps the original CSS. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="image" src={src} alt="" />
            </button>
          ))}
        </div>
      </div>
      <p
        className="mt-3 min-h-6 text-center text-sm text-muted-foreground"
        aria-live="polite"
      >
        {caption || "\u00a0"}
      </p>
    </div>
  );
}
