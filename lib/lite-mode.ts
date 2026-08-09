export const LITE_MODE_CLASS = "lite-mode";

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

/** Synchronous before paint — avoids mounting the heavy carousel on touch devices. */
export const LITE_MODE_BOOTSTRAP_SCRIPT = `(function(){try{var m=window.matchMedia;if(!m)return;if(m("(prefers-reduced-motion: reduce)").matches||m("(pointer: coarse)").matches){document.documentElement.classList.add("${LITE_MODE_CLASS}");return;}var c=navigator.connection;if(c&&(c.saveData||["slow-2g","2g","3g"].indexOf(c.effectiveType||"")>=0)){document.documentElement.classList.add("${LITE_MODE_CLASS}");return;}var d=navigator.deviceMemory;if(typeof d==="number"&&d<=4){document.documentElement.classList.add("${LITE_MODE_CLASS}");return;}var h=navigator.hardwareConcurrency;if(typeof h==="number"&&h<=4){document.documentElement.classList.add("${LITE_MODE_CLASS}");}}catch(e){}})();`;
