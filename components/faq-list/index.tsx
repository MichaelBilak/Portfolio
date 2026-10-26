"use client";

import { useId, useState } from "react";
import { ChevronDown } from "lucide-react";

interface FaqItem {
  question: string;
  answer: string;
}

export function FaqList({ items }: { items: FaqItem[] }) {
  const baseId = useId();
  const [open, setOpen] = useState<Record<number, boolean>>({});

  return (
    <div className="mt-8 border-t border-borderSubtle">
      {items.map((item, index) => {
        const isOpen = Boolean(open[index]);
        const panelId = `${baseId}-panel-${index}`;
        return (
          <div key={item.question} className="border-b border-borderSubtle">
            <h3>
              <button
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpen((current) => ({ ...current, [index]: !current[index] }))}
                className="focus-outline flex w-full items-center justify-between gap-4 py-5 text-left text-lg font-medium text-textPrimary"
              >
                <span>{item.question}</span>
                <ChevronDown
                  size={18}
                  aria-hidden
                  className={`shrink-0 text-accentGold transition-transform duration-300 motion-reduce:transition-none ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              className={`grid motion-reduce:transition-none motion-safe:transition-[grid-template-rows] motion-safe:duration-300 motion-safe:ease-out ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="whitespace-pre-line pb-5 text-pretty leading-relaxed text-textSecondary">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
