"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { useTilt } from "@/components/ui";

interface DeliverablesGridProps {
  items: string[];
}

function DeliverableCard({ item }: { item: string }) {
  const { tiltStyle, onTiltMove, onTiltLeave } = useTilt(10);

  return (
    <motion.li
      onMouseMove={onTiltMove}
      onMouseLeave={onTiltLeave}
      style={tiltStyle}
      className="glass-card flex items-start gap-3 rounded-2xl p-5 transition-colors hover:border-borderStrong"
    >
      <span className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-borderStrong bg-bgElevated">
        <Check size={14} className="text-accentGold" />
      </span>
      <span className="leading-relaxed text-textPrimary">{item}</span>
    </motion.li>
  );
}

export function DeliverablesGrid({ items }: DeliverablesGridProps) {
  return (
    <ul className="mt-10 grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <DeliverableCard key={item} item={item} />
      ))}
    </ul>
  );
}
