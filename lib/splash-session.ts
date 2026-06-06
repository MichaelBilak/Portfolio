import { LOCALE_SWITCH_SCROLL_KEY } from "@/lib/locale-navigation";

export const SPLASH_SEEN_KEY = "dormup-splash-seen";
export const SPLASH_GATE_ID = "splash-gate";

export function hasSplashBeenSeen(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(SPLASH_SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

export function isLocaleSwitchInProgress(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return sessionStorage.getItem(LOCALE_SWITCH_SCROLL_KEY) !== null;
  } catch {
    return false;
  }
}

export function shouldSkipSplash(): boolean {
  return hasSplashBeenSeen() || isLocaleSwitchInProgress();
}

export function hideSplashGate(): void {
  if (typeof document === "undefined") return;
  document.documentElement.classList.add("splash-done");
}

export function markSplashSeen(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(SPLASH_SEEN_KEY, "1");
  } catch {
    // sessionStorage may be unavailable in private mode
  }
  hideSplashGate();
}

/** Runs synchronously before paint — see app/[locale]/layout.tsx */
export const SPLASH_BOOTSTRAP_SCRIPT = `(function(){try{var k="${SPLASH_SEEN_KEY}";var l="${LOCALE_SWITCH_SCROLL_KEY}";if(sessionStorage.getItem(k)==="1"||sessionStorage.getItem(l)!==null){document.documentElement.classList.add("splash-done");}}catch(e){}})();`;
