"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { LOGO_D_SRC } from "@/components/brand-logo/wordmark-core";
import { useCrystalTilt } from "@/lib/hooks/use-crystal-tilt";

const LOGO_WIDTH = 661;
const LOGO_HEIGHT = 615;

export function AboutLogoMark() {
  const reduce = useReducedMotion();
  const { rotateX, rotateY, tiltHandlers } = useCrystalTilt();

  return (
    <div className="relative flex items-center justify-center py-4 md:py-6">
      <motion.div
        className="group relative"
        animate={reduce ? undefined : { y: [0, -14, 5, -10, 0] }}
        transition={
          reduce
            ? undefined
            : { duration: 7, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <motion.div
          {...tiltHandlers}
          className="crystal-stage relative flex h-32 w-32 touch-pan-y items-center justify-center sm:h-40 sm:w-40 md:h-44 md:w-44"
          style={reduce ? undefined : { rotateX, rotateY, transformPerspective: 260 }}
        >
          <Image
            src={LOGO_D_SRC}
            alt="DormUp Studio"
            width={LOGO_WIDTH}
            height={LOGO_HEIGHT}
            sizes="(max-width: 640px) 40vw, 176px"
            className="about-logo-figure relative h-full w-full object-contain"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
