"use client";

import { useLayoutEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { AnimatedWordmark } from "@/components/brand-logo/wordmark-animated";
import { detectLiteMode } from "@/lib/lite-mode";
import { hideSplashGate, isLocaleSwitchInProgress, markSplashSeen, shouldSkipSplash } from "@/lib/splash-session";

const MIN_DISPLAY_MS = 300;
const WORDMARK_DONE_MS = 400;
const EXIT_MS = 200;
const EASE_LOAD = [0.22, 1, 0.36, 1] as const;

export function LoadingScreen() {
  const reduceMotion = useReducedMotion();
  const [visible, setVisible] = useState(false);

  useLayoutEffect(() => {
    if (shouldSkipSplash()) {
      hideSplashGate();
      if (isLocaleSwitchInProgress()) markSplashSeen();
      return;
    }

    const liteMode = detectLiteMode();
    if (liteMode || reduceMotion) {
      markSplashSeen();
      hideSplashGate();
      return;
    }

    setVisible(true);
    const start = Date.now();

    const finish = () => {
      const elapsed = Date.now() - start;
      const remaining = MIN_DISPLAY_MS - elapsed;
      setTimeout(() => {
        markSplashSeen();
        setVisible(false);
      }, Math.max(0, remaining) + EXIT_MS);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
      return () => window.removeEventListener("load", finish);
    }
  }, [reduceMotion]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.4, ease: [0.76, 0, 0.24, 1] }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            background: "#06080c",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3, ease: EASE_LOAD }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.75rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
              <AnimatedWordmark
                priority
                className="text-[clamp(3rem,9vw,5.35rem)]"
                groupClassName="text-[0.46em] font-medium tracking-[0.01em] text-textPrimary/90"
              />

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.35,
                  delay: WORDMARK_DONE_MS / 1000,
                  ease: EASE_LOAD,
                }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                }}
              >
                <span
                  style={{
                    width: "2.5rem",
                    height: "1px",
                    background: "rgba(252,211,77,0.35)",
                  }}
                />
                <span
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.62rem",
                    fontWeight: 500,
                    letterSpacing: "0.28em",
                    textTransform: "uppercase",
                    color: "rgba(252,211,77,0.7)",
                  }}
                >
                  Digital Studio · Emilia-Romagna
                </span>
                <span
                  style={{
                    width: "2.5rem",
                    height: "1px",
                    background: "rgba(252,211,77,0.35)",
                  }}
                />
              </motion.div>
            </div>
          </motion.div>

          <div
            style={{
              position: "absolute",
              bottom: "max(2.5rem, env(safe-area-inset-bottom))",
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(280px, 70vw)",
              zIndex: 1,
            }}
          >
            <div
              style={{
                width: "100%",
                height: "1px",
                background: "rgba(246,245,241,0.1)",
                borderRadius: "99px",
                overflow: "hidden",
              }}
            >
              <div
                className="splash-progress-bar"
                style={{
                  height: "100%",
                  width: "100%",
                  background:
                    "linear-gradient(90deg, #fcd34d 0%, #fde68a 60%, #34d399 100%)",
                  borderRadius: "99px",
                  boxShadow: "0 0 8px rgba(252,211,77,0.6)",
                  transformOrigin: "left center",
                  animation: `splashProgress ${MIN_DISPLAY_MS}ms ease-out forwards`,
                }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
