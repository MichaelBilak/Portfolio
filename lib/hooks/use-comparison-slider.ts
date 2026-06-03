"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export function useComparisonSlider(initialPosition = 52) {
  const [position, setPosition] = useState(initialPosition);
  const sliderRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef(false);
  const dragCleanupRef = useRef<(() => void) | null>(null);

  const updatePosition = useCallback((clientX: number) => {
    const el = sliderRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    if (rect.width <= 0) return;
    const next = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, next)));
  }, []);

  useEffect(() => {
    const stop = () => {
      draggingRef.current = false;
    };
    window.addEventListener("blur", stop);
    return () => window.removeEventListener("blur", stop);
  }, []);

  const onPointerDown = useCallback(
    (event: React.PointerEvent<HTMLDivElement>) => {
      if (event.button !== undefined && event.button !== 0) return;
      event.preventDefault();
      dragCleanupRef.current?.();
      draggingRef.current = true;
      updatePosition(event.clientX);

      const onMove = (ev: PointerEvent) => {
        if (!draggingRef.current) return;
        updatePosition(ev.clientX);
      };
      const detach = () => {
        document.removeEventListener("pointermove", onMove);
        document.removeEventListener("pointerup", onUp);
        document.removeEventListener("pointercancel", onUp);
        dragCleanupRef.current = null;
      };
      const onUp = (ev: PointerEvent) => {
        draggingRef.current = false;
        detach();
        updatePosition(ev.clientX);
      };

      dragCleanupRef.current = detach;
      document.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerup", onUp);
      document.addEventListener("pointercancel", onUp);
    },
    [updatePosition],
  );

  useEffect(() => {
    return () => {
      draggingRef.current = false;
      dragCleanupRef.current?.();
      dragCleanupRef.current = null;
    };
  }, []);

  const clip = Math.min(100, Math.max(0, position));
  const innerWidthPercent = clip < 0.5 ? 10000 / 0.5 : 10000 / clip;

  return {
    sliderRef,
    position,
    setPosition,
    clip,
    innerWidthPercent,
    onPointerDown,
  };
}
