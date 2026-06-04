"use client";

import { motion, useReducedMotion } from "framer-motion";
import { fadeUp } from "@/lib/animations";
import { TranslationSet } from "@/lib/translations";

interface ProblemStatementProps {
  t: TranslationSet;
}

export function ProblemStatement({ t }: ProblemStatementProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section className="py-16 md:py-32">
      <motion.div
        initial={shouldReduceMotion ? false : "hidden"}
        whileInView={shouldReduceMotion ? undefined : "visible"}
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="container-lux max-w-3xl"
      >
        <h2 className="text-fluid-title font-display font-light">{t.problem.title}</h2>
        <p className="mt-8 text-lg leading-relaxed text-textPrimary/80">{t.problem.body}</p>
        <hr className="mt-10 border-0 border-t border-[rgba(201,169,110,0.3)]" />
      </motion.div>
    </section>
  );
}
