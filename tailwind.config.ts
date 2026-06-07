import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bgPrimary: "var(--bg-primary)",
        bgSecondary: "var(--bg-secondary)",
        bgElevated: "var(--bg-elevated)",
        bgCard: "var(--bg-card)",
        accentGold: "var(--accent-gold)",
        accentWarm: "var(--accent-warm)",
        accentDeep: "var(--accent-deep)",
        accentEmerald: "var(--accent-emerald)",
        accentEmeraldDeep: "var(--accent-emerald-deep)",
        glowViolet: "var(--glow-violet)",
        glowCyan: "var(--glow-cyan)",
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        textMuted: "var(--text-muted)",
        borderSubtle: "var(--border-subtle)",
        borderStrong: "var(--border-strong)",
        borderCool: "var(--border-cool)",
      },
      fontFamily: {
        display: [
          "var(--font-display)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        brand: [
          "var(--font-brand)",
          "ui-sans-serif",
          "system-ui",
          "sans-serif",
        ],
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Consolas",
          "monospace",
        ],
      },
      keyframes: {
        floatY: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        floatYlg: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-16px)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "0.35", transform: "scale(1)" },
          "50%": { opacity: "0.6", transform: "scale(1.06)" },
        },
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "float-y": "floatY 7s ease-in-out infinite",
        "float-y-lg": "floatYlg 9s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
        "glow-pulse": "glowPulse 6s ease-in-out infinite",
        "rise-in": "riseIn 0.7s cubic-bezier(0.25,0.1,0.25,1) both",
      },
      backgroundImage: {
        "amber-gradient":
          "linear-gradient(135deg, rgba(252,211,77,0.28), rgba(252,211,77,0))",
        "violet-glow":
          "radial-gradient(circle, rgba(252,211,77,0.45), rgba(252,211,77,0) 70%)",
        "cyan-glow":
          "radial-gradient(circle, rgba(52,211,153,0.4), rgba(52,211,153,0) 70%)",
        "emerald-glow":
          "radial-gradient(circle, rgba(52,211,153,0.4), rgba(52,211,153,0) 70%)",
        "gold-radial":
          "radial-gradient(circle, rgba(252,211,77,0.5), rgba(252,211,77,0) 70%)",
      },
      boxShadow: {
        gold: "0 24px 60px -24px rgba(252,211,77,0.55)",
        "gold-sm": "0 14px 36px -16px rgba(252,211,77,0.5)",
      },
    },
  },
  safelist: [
    "px-6", "px-9", "px-14",
    "py-2.5", "py-3.5", "py-4",
    "min-h-10", "min-h-[3.1rem]", "min-h-[3.6rem]",
    "gap-2", "gap-2.5",
  ],
  plugins: [],
};
export default config;
