import { WordmarkCore } from "@/components/brand-logo/wordmark-core";

interface BrandLogoProps {
  priority?: boolean;
  showTagline?: boolean;
  wordmarkClassName?: string;
  taglineClassName?: string;
  agencyClassName?: string;
  separatorClassName?: string;
  groupClassName?: string;
}

export function BrandLogo({
  priority = false,
  showTagline = true,
  wordmarkClassName = "text-2xl",
  taglineClassName = "hidden md:inline-block",
  groupClassName = "text-[0.72em] font-normal tracking-[0.04em] text-textPrimary/90",
  agencyClassName = "text-[9px] font-medium leading-none tracking-[0.22em] text-accentGold/70 uppercase",
  separatorClassName = "h-[0.68em] w-px bg-borderSubtle",
}: BrandLogoProps) {
  return (
    <span
      aria-label="DormUp Group Digital Studio"
      className={`inline-flex items-center gap-2.5 md:gap-3 ${wordmarkClassName}`}
    >
      <WordmarkCore
        priority={priority}
        className="-translate-y-[0.26em] text-[length:inherit] leading-none"
        groupClassName={groupClassName}
      />
      {showTagline ? (
        <>
          <span
            aria-hidden
            className={`hidden shrink-0 md:block ${separatorClassName}`}
          />
          <span className={`whitespace-nowrap ${agencyClassName} ${taglineClassName}`}>
            Digital Studio
          </span>
        </>
      ) : null}
    </span>
  );
}
