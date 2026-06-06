"use client";

import { useEffect, useRef, useState } from "react";
import type { ScrollDirection } from "./use-scroll-direction";

/** Single rAF-throttled scroll listener for nav hide/show and scrolled styling. */
export function useNavScroll(threshold = 10) {
  const [direction, setDirection] = useState<ScrollDirection>("up");
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    lastY.current = window.scrollY;
    setScrolled(window.scrollY > 16);

    const update = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastY.current;

      setScrolled(currentY > 16);

      if (Math.abs(delta) >= threshold) {
        setDirection(delta > 0 ? "down" : "up");
        lastY.current = currentY;
      }

      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return { direction, scrolled };
}
