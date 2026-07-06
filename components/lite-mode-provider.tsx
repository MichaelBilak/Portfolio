"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { detectLiteMode } from "@/lib/lite-mode";

const LITE_MODE_CLASS = "lite-mode";

type LiteModeContextValue = {
  liteMode: boolean;
};

const LiteModeContext = createContext<LiteModeContextValue>({ liteMode: false });

export function LiteModeProvider({ children }: { children: ReactNode }) {
  const [liteMode, setLiteMode] = useState(false);

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
