"use client";

import { useEffect, useState } from "react";
import { useTouchDevice } from "@/lib/hooks/use-touch-device";

export function CustomCursor() {
  const isTouchDevice = useTouchDevice();
  const [position, setPosition] = useState({ x: -40, y: -40 });
  const [active, setActive] = useState(false);

  useEffect(() => {
    if (isTouchDevice) {
      return;
    }

    const onMove = (event: MouseEvent) => {
      setPosition({ x: event.clientX, y: event.clientY });
    };
    const onMouseOver = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      setActive(Boolean(target?.closest("a, button, input, textarea, select, [role='button']")));
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onMouseOver);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onMouseOver);
    };
  }, [isTouchDevice]);

  if (isTouchDevice) {
    return null;
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[90] hidden rounded-full border border-accentGold bg-accentGold/40 mix-blend-screen md:block"
      style={{
        width: 16,
        height: 16,
        transform: `translate(${position.x - 8}px, ${position.y - 8}px) scale(${active ? 1.8 : 1})`,
        transition: "transform 200ms ease",
      }}
    />
  );
}
