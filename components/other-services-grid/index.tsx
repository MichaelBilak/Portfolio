"use client";

import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "@/i18n/navigation";
import { useTilt } from "@/components/ui";

interface OtherServiceItem {
  id: string;
  slug: string;
  image: string;
  title: string;
  description: string;
}

function OtherServiceCard({ item }: { item: OtherServiceItem }) {
  const { tiltStyle, tiltHandlers } = useTilt(8);

  return (
    <motion.div {...tiltHandlers} style={tiltStyle}>
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
      </Link>
    </motion.div>
  );
}

export function OtherServicesGrid({ items }: { items: OtherServiceItem[] }) {
  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2 md:grid-cols-3">
      {items.map((item) => (
        <OtherServiceCard key={item.id} item={item} />
      ))}
    </div>
  );
}