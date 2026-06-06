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

let pendingGyro: GyroTilt | null = null;
let gyroRafId = 0;

function flushGyro() {
  gyroRafId = 0;
  if (!pendingGyro) return;
  const tilt = pendingGyro;
  pendingGyro = null;
  gyroListeners.forEach((fn) => fn(tilt));
}

function handleOrientation(event: DeviceOrientationEvent) {
  const { beta, gamma } = event;
  if (beta == null || gamma == null) return;
  if (!neutral) neutral = { beta, gamma };

  const dBeta = beta - neutral.beta;
  const dGamma = gamma - neutral.gamma;

  const y = (clamp(dGamma, 25) / 25) * 24;
  const x = (clamp(dBeta, 25) / 25) * -20;

  pendingGyro = { x, y };
  if (gyroRafId) return;
  gyroRafId = requestAnimationFrame(flushGyro);
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

export interface TiltOptions {
  /** Max pointer-driven tilt in degrees (default: 42 for X, 34 for Y). */
  angleX?: number;
  angleY?: number;
  /** Spring physics (default: crystal-style — stiffness 220, damping 12). */
  stiffness?: number;
  damping?: number;
  /** Gyro scale — maps 25° of physical tilt to this many degrees of rotation.
   *  Defaults match the pointer range so the two sources feel consistent. */
  gyroX?: number;
  gyroY?: number;
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

/* Tilt an element toward the pointer (mouse OR finger) while it's being
   touched/hovered, and toward the phone's physical tilt the rest of the
   time on devices with a gyroscope. */
export function useCrystalTilt(opts: TiltOptions = {}): CrystalTilt {
  const {
    angleX = 34,
    angleY = 42,
    stiffness = 220,
    damping = 12,
    gyroX,
    gyroY,
  } = opts;

  // How far the gyro moves the element (default: match pointer range).
  const gx = gyroX ?? angleX * 0.6;
  const gy = gyroY ?? angleY * 0.6;

  const reduce = useReducedMotion();
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const rotateX = useSpring(rx, { stiffness, damping });
  const rotateY = useSpring(ry, { stiffness, damping });
  const interacting = useRef(false);

  useEffect(() => {
    if (reduce || typeof window === "undefined") return;

    const onGyro = (t: GyroTilt) => {
      if (interacting.current) return;
      // Scale the shared gyro output (calibrated for crystal range) to our range.
      rx.set((t.x / 20) * gx);
      ry.set((t.y / 24) * gy);
    };
    gyroListeners.add(onGyro);

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
  }, [reduce, rx, ry, gx, gy]);

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (reduce) return;
      interacting.current = true;
      const rect = event.currentTarget.getBoundingClientRect();
      const px = (event.clientX - rect.left) / rect.width - 0.5;
      const py = (event.clientY - rect.top) / rect.height - 0.5;
      ry.set(px * angleY);
      rx.set(py * -angleX);
    },
    [reduce, rx, ry, angleX, angleY],
  );

  const release = useCallback(() => {
    interacting.current = false;
    if (reduce) return;
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
