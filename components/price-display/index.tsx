import { formatEur } from "@/lib/format-price";
import type { Locale } from "@/lib/translations";

type PriceSize = "sm" | "md" | "lg";

const SIZE: Record<
  PriceSize,
  { prefix: string; amount: string; wrapper: string }
> = {
  sm: {
    prefix: "text-[9px] tracking-[0.16em]",
    amount: "text-sm font-normal",
    wrapper: "gap-1",
  },
  md: {
    prefix: "text-[10px] tracking-[0.18em]",
    amount: "text-base font-normal",
    wrapper: "gap-1.5",
  },
  lg: {
    prefix: "text-[10px] tracking-[0.2em]",
    amount: "text-lg font-light",
    wrapper: "gap-1.5",
  },
};

interface PriceDisplayProps {
  amount: number;
  locale: Locale;
  /** e.g. "от", "from", "+" */
  prefixLabel?: string;
  monthly?: boolean;
  size?: PriceSize;
  align?: "left" | "right";
  className?: string;
}

/** Quiet, value-first price line — informative, not promotional */
export function PriceDisplay({
  amount,
  locale,
  prefixLabel,
  monthly,
  size = "md",
  align = "left",
  className = "",
}: PriceDisplayProps) {
  const s = SIZE[size];

  return (
    <p
      className={`inline-flex items-baseline ${s.wrapper} ${
        align === "right" ? "ml-auto justify-end" : ""
      } ${className}`}
    >
      {prefixLabel ? (
        <span className={`shrink-0 font-mono uppercase text-textMuted ${s.prefix}`}>
          {prefixLabel}
        </span>
      ) : null}
      <span className={`font-display tracking-tight text-textPrimary/80 ${s.amount}`}>
        {formatEur(amount, locale, { monthly })}
      </span>
    </p>
  );
}
