"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";
import { LoadingScreen } from "@/components/loading-screen";
import { LiteModeProvider } from "@/components/lite-mode-provider";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <LiteModeProvider>
      <LazyMotion features={domAnimation} strict={false}>
        <LoadingScreen />
        {children}
      </LazyMotion>
    </LiteModeProvider>
  );
}
