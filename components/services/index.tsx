"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { servicesMeta } from "@/data/services";
import { Link } from "@/i18n/navigation";
import { fadeUp } from "@/lib/animations";
import { TranslationSet } from "@/lib/translations";

interface ServicesProps {
  t: TranslationSet;
}

export function Services({ t }: ServicesProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section id="services" className="py-24 md:py-32">
      <div className="container-lux">
        <h2 className="text-fluid-title mb-10 font-display font-light">{t.servicesLabel}</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {servicesMeta.map((meta, index) => {
            const copy = t.services[index];
            const Icon = meta.icon;
            return (
              <motion.div
                key={meta.id}
                variants={fadeUp}
                initial={shouldReduceMotion ? false : "hidden"}
                whileInView={shouldReduceMotion ? undefined : "visible"}
                viewport={{ once: true, margin: "-80px" }}
              >
                <Link
                  href={`/services/${meta.slug}`}
                  className="glass-card hover-lift group flex h-full flex-col rounded-3xl p-7 hover:border-borderStrong"
                >
                  <div className="flex items-start justify-between">
                    <div className="inline-flex rounded-2xl border border-borderSubtle bg-white/[0.03] p-3 transition-transform duration-200 group-hover:scale-105">
                      <Icon className="text-accentGold" size={20} />
                    </div>
                    <ArrowUpRight
                      size={18}
                      className="text-textMuted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accentGold"
                    />
                  </div>
                  <h3 className="mt-5 font-display text-3xl font-light text-textPrimary">
                    {copy.title}
                  </h3>
                  <p className="mt-3 text-textSecondary">{copy.description}</p>
                  <p className="mt-5 border-t border-borderCool pt-4 text-sm font-normal leading-relaxed tracking-normal text-accentWarm/90">
                    {copy.details}
                  </p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm text-accentGold transition-colors group-hover:text-accentWarm">
                    {t.servicePage.viewService}
                    <ArrowUpRight size={14} />
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
