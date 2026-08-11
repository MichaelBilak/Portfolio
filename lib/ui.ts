export type ClassValue = string | false | null | undefined;

/** Tiny className joiner (no extra dependency). */
export function cn(...values: ClassValue[]): string {
  return values.filter(Boolean).join(" ");
}

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md" | "lg";

const base =
  "focus-outline interactive group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full text-center font-semibold tracking-tight hyphens-none text-safe-wrap transition-transform active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:active:scale-100";

const sizes: Record<ButtonSize, string> = {
  sm: "btn-sm min-h-11 sm:min-h-10 text-xs",
  md: "btn-md min-h-[3.1rem] text-sm",
  lg: "btn-lg min-h-[3.6rem] text-[0.95rem]",
};

const variants: Record<ButtonVariant, string> = {
  primary:
    "bg-accentGold text-bgPrimary shadow-[0_12px_32px_-14px_rgba(252,211,77,0.7)] hover:-translate-y-0.5 hover:shadow-[0_18px_40px_-14px_rgba(252,211,77,0.85)]",
  secondary:
    "border border-white/[0.14] bg-white/[0.04] text-accentGold backdrop-blur-sm hover:-translate-y-0.5 hover:border-white/[0.22] hover:bg-white/[0.07]",
  ghost:
    "border border-white/[0.12] bg-transparent text-textPrimary backdrop-blur-sm hover:border-white/[0.2] hover:text-accentGold",
};

/** Composable button class string — works on <a>, <button> and next-intl <Link>. */
export function btn(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  extra?: ClassValue,
): string {
  return cn(base, sizes[size], variants[variant], extra);
}
