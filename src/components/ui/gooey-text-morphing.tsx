"use client";

import * as React from "react";
import { cn } from "../../lib/utils";

interface GooeyTextProps {
  texts: string[];
  morphTime?: number;
  cooldownTime?: number;
  className?: string;
  textClassName?: string;
}

export function GooeyText({
  texts,
  morphTime = 1.2,
  cooldownTime = 0.8,
  className,
  textClassName
}: GooeyTextProps) {
  const text1Ref = React.useRef<HTMLSpanElement>(null);
  const text2Ref = React.useRef<HTMLSpanElement>(null);

  const textsKey = React.useMemo(() => texts.join("|"), [texts]);

  React.useEffect(() => {
    if (texts.length === 0) return;
    
    let textIndex = 0;
    let time = new Date();
    let morph = 0;
    let cooldown = cooldownTime;

    // Set initial values
    if (text1Ref.current && text2Ref.current) {
      text1Ref.current.textContent = texts[0];
      text2Ref.current.textContent = texts[(1) % texts.length];
    }

    const setMorph = (fraction: number) => {
      if (text1Ref.current && text2Ref.current) {
        text2Ref.current.style.filter = `blur(${Math.min(8 / fraction - 8, 100)}px)`;
        text2Ref.current.style.opacity = `${Math.pow(fraction, 0.4) * 100}%`;

        const fractionInv = 1 - fraction;
        text1Ref.current.style.filter = `blur(${Math.min(8 / fractionInv - 8, 100)}px)`;
        text1Ref.current.style.opacity = `${Math.pow(fractionInv, 0.4) * 100}%`;
      }
    };

    const doCooldown = () => {
      morph = 0;
      if (text1Ref.current && text2Ref.current) {
        text1Ref.current.style.filter = "";
        text1Ref.current.style.opacity = "100%";
        text2Ref.current.style.filter = "";
        text2Ref.current.style.opacity = "0%";
      }
    };

    const doMorph = () => {
      morph -= cooldown;
      cooldown = 0;
      let fraction = morph / morphTime;

      if (fraction > 1) {
        cooldown = cooldownTime;
        fraction = 1;
      }

      setMorph(fraction);
    };

    let animationFrameId: number;

    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      const newTime = new Date();
      const shouldIncrementIndex = cooldown > 0;
      const dt = (newTime.getTime() - time.getTime()) / 1000;
      time = newTime;

      cooldown -= dt;

      if (cooldown <= 0) {
        if (shouldIncrementIndex) {
          textIndex = (textIndex + 1) % texts.length;
          if (text1Ref.current && text2Ref.current) {
            text1Ref.current.textContent = texts[textIndex % texts.length];
            text2Ref.current.textContent = texts[(textIndex + 1) % texts.length];
          }
        }
        doMorph();
      } else {
        doCooldown();
      }
    }

    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [textsKey, morphTime, cooldownTime]);

  // If there are no texts, render empty
  if (texts.length === 0) return null;

  return (
    <div className={cn("relative select-none", className)}>
      <svg className="absolute w-px h-px overflow-hidden pointer-events-none opacity-0" aria-hidden="true" focusable="false">
        <defs>
          <filter id="threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
                      0 1 0 0 0
                      0 0 1 0 0
                      0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>

      <div
        className="flex items-center justify-center h-full w-full"
        style={{ filter: "url(#threshold)" }}
      >
        <span
          ref={text1Ref}
          className={cn(
            "absolute inset-0 flex items-center justify-center text-center select-none whitespace-nowrap",
            textClassName || "text-white"
          )}
        />
        <span
          ref={text2Ref}
          className={cn(
            "absolute inset-0 flex items-center justify-center text-center select-none whitespace-nowrap",
            textClassName || "text-white"
          )}
        />
      </div>
    </div>
  );
}

function GooeyTextDemo() {
  return (
    <div className="h-[200px] flex items-center justify-center">
      <GooeyText
        texts={["dazeen", "coffee", "Is", "caffeine free"]}
        morphTime={1}
        cooldownTime={0.25}
        className="font-bold text-stone-900"
      />
    </div>
  );
}

export { GooeyTextDemo };
