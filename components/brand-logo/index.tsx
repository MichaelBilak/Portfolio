import { WordmarkCore } from "@/components/brand-logo/wordmark-core";
import { BRAND_FULL, BRAND_TAGLINE } from "@/lib/brand";

interface BrandLogoProps {
  priority?: boolean;
  showTagline?: boolean;
  wordmarkClassName?: string;
  taglineClassName?: string;
  agencyClassName?: string;
  /** @deprecated Pipe is used inline; kept for API compat */
  separatorClassName?: string;
  groupClassName?: string;
}

export function BrandLogo({
  priority = false,
  showTagline = true,
  wordmarkClassName = "text-2xl",
  taglineClassName = "",
  groupClassName = "text-[0.68em] font-medium tracking-[0.01em] text-textPrimary/90",
  agencyClassName = "text-[0.52em] font-medium tracking-[0.02em] text-textPrimary/70",
}: BrandLogoProps) {
  return (
    <span
      aria-label={BRAND_FULL}
      className={`inline-flex min-w-0 items-center ${wordmarkClassName}`}
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
            className="mx-3 block h-[1.28em] w-px shrink-0 self-center bg-gradient-to-b from-transparent via-[rgba(252,211,77,0.55)] to-transparent sm:mx-4"
          />
          <span
            className={`relative -top-[0.06em] whitespace-nowrap leading-none ${agencyClassName} ${taglineClassName}`}
          >
            {BRAND_TAGLINE}
          </span>
        </>
      ) : null}
    </span>
  );
}
