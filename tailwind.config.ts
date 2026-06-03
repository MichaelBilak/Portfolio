import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
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
          "ui-serif",
          "Georgia",
          "Cambria",
          "Times New Roman",
          "serif",
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
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        "float-y": "floatY 7s ease-in-out infinite",
        shimmer: "shimmer 2.4s linear infinite",
      },
      backgroundImage: {
        "amber-gradient":
          "linear-gradient(135deg, rgba(252,211,77,0.25), rgba(252,211,77,0))",
        "violet-glow":
          "radial-gradient(circle, rgba(147,51,234,0.5), rgba(147,51,234,0) 70%)",
        "cyan-glow":
          "radial-gradient(circle, rgba(14,165,233,0.45), rgba(14,165,233,0) 70%)",
      },
    },
  },
  plugins: [],
};
export default config;
