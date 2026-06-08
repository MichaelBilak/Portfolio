"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { PriceDisplay } from "@/components/price-display";
import { Link } from "@/i18n/navigation";
import { useTilt } from "@/components/ui";
import type { Locale } from "@/lib/translations";

interface OtherServiceItem {
  id: string;
  slug: string;
  image: string;
  title: string;
  description: string;
  price?: number;
  monthly?: boolean;
}

function OtherServiceCard({
  item,
  locale,
  fromLabel,
}: {
  item: OtherServiceItem;
  locale: Locale;
  fromLabel: string;
}) {
  const { tiltStyle, onTiltMove, onTiltLeave } = useTilt(8);

  return (
    <motion.div onMouseMove={onTiltMove} onMouseLeave={onTiltLeave} style={tiltStyle}>
      <Link
        href={`/services/${item.slug}`}
        className="glass-card group flex h-full flex-col gap-4 rounded-2xl p-6 hover:border-borderStrong"
      >
        <div className="flex items-center justify-between">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 rounded-full bg-emerald-500/10 blur-[14px] transition-all duration-400 group-hover:bg-accentGold/15"
            />
            <Image
              src={item.image}
              alt={item.title}
              width={80}
              height={80}
              sizes="40px"
              className="relative h-full w-full object-contain transition-transform duration-400 group-hover:scale-110"
            />
          </div>
          <ArrowUpRight
            size={14}
            className="text-textMuted transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accentGold"
          />
        </div>
        <h3 className="text-xl font-semibold tracking-tight text-textPrimary sm:text-2xl">
          {item.title}
        </h3>
        <p className="flex-1 text-sm leading-relaxed text-textSecondary">{item.description}</p>
        {item.price != null ? (
          <div className="border-t border-borderSubtle pt-3">
            <PriceDisplay
              amount={item.price}
              locale={locale}
              prefixLabel={fromLabel}
              monthly={item.monthly}
              size="sm"
            />
          </div>
        ) : null}
      </Link>
    </motion.div>
  );
}

export function OtherServicesGrid({
  items,
  locale,
  fromLabel,
}: {
  items: OtherServiceItem[];
  locale: Locale;
  fromLabel: string;
}) {
  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
      {items.map((item) => (
        <OtherServiceCard key={item.id} item={item} locale={locale} fromLabel={fromLabel} />
      ))}
    </div>
  );
}