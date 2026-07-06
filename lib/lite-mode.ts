export function detectLiteMode(): boolean {
  if (typeof window === "undefined") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true;
  }

  if (window.matchMedia("(pointer: coarse)").matches) {
    return true;
  }

  const conn = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;

  if (conn?.saveData) return true;

  const slowNet = ["slow-2g", "2g", "3g"].includes(conn?.effectiveType ?? "");
  if (slowNet) return true;

  const nav = navigator as Navigator & { deviceMemory?: number };
  if (typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4) {
    return true;
  }

  if (typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4) {
    return true;
  }

  return false;
}
