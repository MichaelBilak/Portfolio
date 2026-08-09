"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { detectLiteMode, LITE_MODE_CLASS } from "@/lib/lite-mode";

type LiteModeContextValue = {
  liteMode: boolean;
};

function readInitialLiteMode(): boolean {
  if (typeof document === "undefined") return false;
  if (document.documentElement.classList.contains(LITE_MODE_CLASS)) return true;
  return detectLiteMode();
}

const LiteModeContext = createContext<LiteModeContextValue>({ liteMode: false });

export function LiteModeProvider({ children }: { children: ReactNode }) {
  const [liteMode, setLiteMode] = useState(readInitialLiteMode);

  useEffect(() => {
    const lite = detectLiteMode();
    setLiteMode(lite);

    if (lite) {
      document.documentElement.classList.add(LITE_MODE_CLASS);
    } else {
      document.documentElement.classList.remove(LITE_MODE_CLASS);
    }

    return () => {
      document.documentElement.classList.remove(LITE_MODE_CLASS);
    };
  }, []);

  const value = useMemo(() => ({ liteMode }), [liteMode]);

  return <LiteModeContext.Provider value={value}>{children}</LiteModeContext.Provider>;
}

export function useLiteMode(): boolean {
  return useContext(LiteModeContext).liteMode;
}
