export const LITE_MODE_CLASS = "lite-mode";

/**
 * Lite mode is only for explicit accessibility / data-saver cases.
 * Do NOT gate on coarse pointer, CPU cores, or RAM — that killed hero chips,
 * tilt, button polish, and the scroll carousel on normal phones and laptops.
 */
export function detectLiteMode(): boolean {
  if (typeof window === "undefined") return false;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return true;
  }

  const conn = (navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;

  if (conn?.saveData) return true;

  const verySlow = ["slow-2g", "2g"].includes(conn?.effectiveType ?? "");
  if (verySlow) return true;

  return false;
}

/** Synchronous before paint — only reduced-motion / data-saver. */
export const LITE_MODE_BOOTSTRAP_SCRIPT = `(function(){try{var m=window.matchMedia;if(!m)return;if(m("(prefers-reduced-motion: reduce)").matches){document.documentElement.classList.add("${LITE_MODE_CLASS}");return;}var c=navigator.connection;if(c&&(c.saveData||["slow-2g","2g"].indexOf(c.effectiveType||"")>=0)){document.documentElement.classList.add("${LITE_MODE_CLASS}");}}catch(e){}})();`;
