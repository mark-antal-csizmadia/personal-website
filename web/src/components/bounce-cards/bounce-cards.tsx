"use client";

import { gsap } from "gsap";
import { useEffect, useRef, type CSSProperties } from "react";

import { cn } from "@/lib/utils";

import "./bounce-cards.css";

const DEFAULT_TRANSFORM_STYLES = [
  "rotate(10deg) translate(-170px)",
  "rotate(5deg) translate(-85px)",
  "rotate(-3deg)",
  "rotate(-10deg) translate(85px)",
  "rotate(2deg) translate(170px)",
];

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
      <div className="bounceCardsSizer">
        <div
          className={cn("bounceCardsContainer", className)}
          ref={containerRef}
          style={{
            width: containerWidth,
            height: containerHeight,
          }}
        >
          {images.map((src, idx) => (
            <div
              key={src}
              className={`card card-${idx}`}
              style={{
                transform: transformStyles[idx] ?? "none",
              }}
              onMouseEnter={() => pushSiblings(idx)}
              onMouseLeave={resetSiblings}
            >
              {/* BounceCards animates the wrapper; a plain img keeps the original CSS. */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                className="image"
                src={src}
                alt={alts[idx] ?? `card-${idx}`}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
