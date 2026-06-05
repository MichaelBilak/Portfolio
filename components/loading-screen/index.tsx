"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const LOGO_SRC = "/images/logo-dm-group.png";
const MIN_DISPLAY_MS = 1800;

export function LoadingScreen() {
  const [visible, setVisible] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const start = Date.now();

    // Animate the progress bar smoothly to ~90 % on its own,
    // then snap to 100 % once the page is actually ready.
    let raf: number;
    const tick = () => {
      const elapsed = Date.now() - start;
      // ease-out curve that slows down near 90%
      const natural = Math.min(90, (elapsed / MIN_DISPLAY_MS) * 100 * 0.9);
      setProgress(natural);
      if (natural < 90) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const finish = () => {
      cancelAnimationFrame(raf);
      setProgress(100);
      const remaining = MIN_DISPLAY_MS - (Date.now() - start);
      setTimeout(() => setVisible(false), Math.max(0, remaining) + 350);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("load", finish);
    };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="loading-screen"
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.03 }}
          transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
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
          {/* ── ambient orbs ── */}
          <div
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              overflow: "hidden",
            }}
          >
            {/* gold orb top-left */}
            <motion.div
              animate={{ scale: [1, 1.18, 1], opacity: [0.18, 0.32, 0.18] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{
                position: "absolute",
                top: "-15%",
                left: "-10%",
                width: "55vw",
                height: "55vw",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(252,211,77,0.22) 0%, transparent 70%)",
                filter: "blur(60px)",
              }}
            />
            {/* emerald orb bottom-right */}
            <motion.div
              animate={{ scale: [1, 1.14, 1], opacity: [0.14, 0.26, 0.14] }}
              transition={{
                duration: 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 1.2,
              }}
              style={{
                position: "absolute",
                bottom: "-12%",
                right: "-8%",
                width: "50vw",
                height: "50vw",
                borderRadius: "50%",
                background:
                  "radial-gradient(circle, rgba(52,211,153,0.18) 0%, transparent 70%)",
                filter: "blur(70px)",
              }}
            />
            {/* grain overlay */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E")`,
                opacity: 0.5,
              }}
            />
          </div>

          {/* ── center content ── */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "2rem",
              position: "relative",
              zIndex: 1,
            }}
          >
            {/* logo mark with glow */}
            <motion.div
              animate={{
                filter: [
                  "drop-shadow(0 0 12px rgba(252,211,77,0.35))",
                  "drop-shadow(0 0 28px rgba(252,211,77,0.65))",
                  "drop-shadow(0 0 12px rgba(252,211,77,0.35))",
                ],
              }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <Image
                src={LOGO_SRC}
                alt="DormUp Group"
                width={72}
                height={72}
                priority
                style={{ objectFit: "contain" }}
              />
            </motion.div>

            {/* wordmark */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
              <span
                style={{
                  fontFamily: "var(--font-brand)",
                  fontWeight: 300,
                  fontSize: "clamp(2rem, 6vw, 3.5rem)",
                  lineHeight: 1,
                  letterSpacing: "-0.02em",
                  color: "#f6f5f1",
                }}
              >
                orm<span style={{ color: "#fcd34d" }}>Up</span>
              </span>

              <div
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
                  Digital Studio · Rimini
                </span>
                <span
                  style={{
                    width: "2.5rem",
                    height: "1px",
                    background: "rgba(252,211,77,0.35)",
                  }}
                />
              </div>
            </div>
          </motion.div>

          {/* ── progress bar ── */}
          <div
            style={{
              position: "absolute",
              bottom: "2.5rem",
              left: "50%",
              transform: "translateX(-50%)",
              width: "min(280px, 70vw)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.6rem",
              zIndex: 1,
            }}
          >
            {/* track */}
            <div
              style={{
                width: "100%",
                height: "1px",
                background: "rgba(246,245,241,0.1)",
                borderRadius: "99px",
                overflow: "hidden",
              }}
            >
              <motion.div
                style={{
                  height: "100%",
                  background:
                    "linear-gradient(90deg, #fcd34d 0%, #fde68a 60%, #34d399 100%)",
                  borderRadius: "99px",
                  boxShadow: "0 0 8px rgba(252,211,77,0.6)",
                }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "linear" }}
              />
            </div>

            {/* percentage */}
            <motion.span
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6rem",
                letterSpacing: "0.2em",
                color: "rgba(246,245,241,0.35)",
              }}
            >
              {Math.round(progress)}%
            </motion.span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
