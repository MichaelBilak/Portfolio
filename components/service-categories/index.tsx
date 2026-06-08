"use client";

import { useRef, useState } from "react";

interface CategoryItem {
  label: string;
  info: string;
}

interface Category {
  title: string;
  items: CategoryItem[];
}

interface ServiceCategoriesProps {
  categories: Category[];
}

function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false);

  return (
    <span className="relative ml-3 inline-flex shrink-0 items-center">
      <button
        type="button"
        aria-label="More info"
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((o) => !o)}
        className="relative inline-flex h-5 w-5 items-center justify-center rounded-full border border-borderStrong bg-white/[0.04] text-[10px] font-semibold text-textMuted transition-all duration-200 before:absolute before:-inset-3 before:content-[''] hover:border-accentGold/50 hover:bg-accentGold/10 hover:text-accentGold focus:outline-none"
      >
        i
      </button>

      {/* Tooltip */}
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full right-0 z-50 mb-2.5 w-[min(16rem,calc(100vw-3rem))] rounded-xl border border-borderStrong bg-bgElevated px-4 py-3 text-[12.5px] leading-relaxed text-textSecondary shadow-[0_16px_40px_-10px_rgba(0,0,0,0.6)] backdrop-blur-sm transition-all duration-200 sm:left-1/2 sm:right-auto sm:w-64 sm:-translate-x-1/2 ${
          open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
        }`}
      >
        {/* Arrow */}
        <span className="absolute -bottom-[5px] right-4 h-2.5 w-2.5 rotate-45 border-b border-r border-borderStrong bg-bgElevated sm:left-1/2 sm:right-auto sm:-translate-x-1/2" />
        {text}
      </span>
    </span>
  );
}

export function ServiceCategories({ categories }: ServiceCategoriesProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [glow, setGlow] = useState({ x: -999, y: -999, visible: false });

  function onMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    setGlow({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true });
  }

  function onMouseLeave() {
    setGlow((g) => ({ ...g, visible: false }));
  }

  return (
    <section className="overflow-hidden border-t border-borderSubtle py-16 md:py-28">
      <div
        ref={sectionRef}
        className="container-lux relative"
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {/* Cursor glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -inset-16 z-0 transition-opacity duration-300"
          style={{ opacity: glow.visible ? 1 : 0 }}
        >
          <div
            className="absolute h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              left: glow.x + 64,
              top: glow.y + 64,
              background:
                "radial-gradient(circle, rgba(252,211,77,0.08) 0%, rgba(52,211,153,0.04) 40%, transparent 68%)",
              filter: "blur(55px)",
            }}
          />
        </div>

        {/* Grid */}
        <div className="relative z-10 grid gap-16 md:grid-cols-2 md:gap-x-20 md:gap-y-20">
          {categories.map((cat) => (
            <div key={cat.title}>
              <span className="inline-block rounded-full border border-borderStrong px-5 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em] text-textMuted">
                {cat.title}
              </span>

              <ul className="mt-8 space-y-0">
                {cat.items.map((item) => (
                  <li
                    key={item.label}
                    className="flex items-center border-b border-borderSubtle py-4 first:border-t"
                  >
                    <span className="min-w-0 flex-1 text-lg font-medium leading-tight tracking-tight text-textPrimary sm:text-xl md:text-2xl">
                      {item.label}
                    </span>
                    <InfoTooltip text={item.info} />
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
