"use client";

import { LazyMotion, domAnimation } from "framer-motion";
import type { ReactNode } from "react";
import { LoadingScreen } from "@/components/loading-screen";

export function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict={false}>
      <LoadingScreen />
      {children}
    </LazyMotion>
  );
}
