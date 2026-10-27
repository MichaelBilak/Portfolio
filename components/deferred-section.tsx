import type { ReactNode } from "react";

interface DeferredSectionProps {
  children: ReactNode;
  className?: string;
}

/**
 * Below-fold sections stay in the server HTML so crawlers see the copy and links.
 * Offscreen paint cost is limited by content-visibility on `.section-deferred`.
 */
export function DeferredSection({ children, className }: DeferredSectionProps) {
  return <div className={className}>{children}</div>;
}
