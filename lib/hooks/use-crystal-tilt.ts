"use client";

import {
  useMotionValue,
  useReducedMotion,
  useSpring,
  type MotionValue,
} from "framer-motion";
import { useCallback, useEffect, useRef } from "react";

/* ── Shared gyroscope source ─────────────────────────────────────────
   A single `deviceorientation` listener feeds every mounted crystal so we
   don't attach dozens of listeners. Each crystal subscribes and receives
   the current tilt (in degrees) relative to the orientation the phone was
   first held at. */
type GyroTilt = { x: number; y: number };
const gyroListeners = new Set<(t: GyroTilt) => void>();
let gyroStarted = false;
let neutral: { beta: number; gamma: number } | null = null;

const clamp = (value: number, max: number) =>
  Math.max(-max, Math.min(max, value));

function handleOrientation(event: DeviceOrientationEvent) {
  const { beta, gamma } = event;
  if (beta == null || gamma == null) return;
  if (!neutral) neutral = { beta, gamma };

  // Offset from the initial resting position so any starting angle feels neutral.
  const dBeta = beta - neutral.beta; // front-to-back tilt
  const dGamma = gamma - neutral.gamma; // left-to-right tilt

  // Map ~25° of physical tilt to the same rotation range as the pointer effect.
  const y = (clamp(dGamma, 25) / 25) * 24;
  const x = (clamp(dBeta, 25) / 25) * -20;

  gyroListeners.forEach((fn) => fn({ x, y }));
}

function startGyro() {
  if (gyroStarted || typeof window === "undefined") return;
  gyroStarted = true;
  window.addEventListener("deviceorientation", handleOrientation);
}

function requestGyroPermission() {
  if (typeof window === "undefined") return;
  const DOE = window.DeviceOrientationEvent as
    | (typeof window.DeviceOrientationEvent & {
        requestPermission?: () => Promise<"granted" | "denied">;
      })
    | undefined;

  // iOS 13+ requires an explicit permission grant from a user gesture.
  if (DOE && typeof DOE.requestPermission === "function") {
    DOE.requestPermission()
      .then((state) => {
        if (state === "granted") startGyro();
      })
      .catch(() => {});
  } else {
    startGyro();
  }
}

export interface CrystalTilt {
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  tiltHandlers: {
    onPointerMove: (event: React.PointerEvent<HTMLElement>) => void;
    onPointerLeave: () => void;
    onPointerUp: () => void;
    onPointerCancel: () => void;
  };
}

/* Tilt a crystal toward the pointer (mouse OR finger) while it's being
   touched/hovered, and toward the phone's physical tilt the rest of the
   time on devices with a gyroscope. */
export function useCrystalTilt(): CrystalTilt {
  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness: 220, damping: 12 });
  const rotateY = useSpring(ry, { stiffness: 220, damping: 12 });
  const interacting = useRef(false);

  useEffect(() => {
    if (reduce || typeof window === "undefined") return;

    const onGyro = (t: GyroTilt) => {
      // Finger interaction wins while it's active.
      if (interacting.current) return;
      rx.set(t.x);
      ry.set(t.y);
    };
    gyroListeners.add(onGyro);

    // Kick off the gyroscope on the first touch (covers the iOS permission gate).
    const kick = () => requestGyroPermission();
    const hasPermissionGate =
      typeof (
        window.DeviceOrientationEvent as { requestPermission?: unknown } | undefined
      )?.requestPermission === "function";

    if (hasPermissionGate) {
      window.addEventListener("touchstart", kick, { once: true, passive: true });
    } else {
      startGyro();
    }

    return () => {
      gyroListeners.delete(onGyro);
      window.removeEventListener("touchstart", kick);
    };
  }, [reduce, rx, ry]);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (reduce) return;
      interacting.current = true;
      const rect = event.currentTarget.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      ry.set(px * 42);
      rx.set(py * -34);
    },
    [reduce, rx, ry],
  );

  const release = useCallback(() => {
    interacting.current = false;
    if (reduce) return;
    // Spring back to rest; the gyro loop takes over again if it's running.
    rx.set(0);
    ry.set(0);
  }, [reduce, rx, ry]);

  return {
    rotateX,
    rotateY,
    tiltHandlers: {
      onPointerMove,
      onPointerLeave: release,
      onPointerUp: release,
      onPointerCancel: release,
    },
  };
}
