"use client";

import { useEffect, useState } from "react";

export function useTouchDevice(): boolean {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    setIsTouchDevice(
      "ontouchstart" in window || navigator.maxTouchPoints > 0,
    );
  }, []);

  return isTouchDevice;
}
