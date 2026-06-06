import Image from "next/image";

interface BrowserMockupProps {
  image: string;
  alt: string;
  displayUrl: string;
  imagePosition?: "top" | "center";
  priority?: boolean;
  sizes?: string;
  loaded?: boolean;
  onLoad?: () => void;
  href?: string;
  linkLabel?: string;
  interactive?: boolean;
  className?: string;
}

export function BrowserMockup({
  image,
  alt,
  displayUrl,
  imagePosition = "top",
  priority = false,
  sizes = "(min-width: 1024px) 620px, 100vw",
  loaded = true,
  onLoad,
  href,
  linkLabel,
  interactive = false,
  className = "",
}: BrowserMockupProps) {
  return (
    <div
      className={`browser-mockup-inset relative overflow-hidden rounded-xl ${className}`}
    >
      <div
        className={`flex items-center gap-2 border-b border-borderCool bg-white/[0.025] px-3 py-2 transition-colors duration-500 ${
          interactive ? "group-hover:bg-white/[0.04]" : ""
        }`}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400/80" />
        <span
          className={`ml-3 inline-flex flex-1 items-center justify-center truncate rounded-md bg-bgPrimary/60 px-3 py-1 font-mono text-[10px] tracking-[0.04em] text-textMuted transition-colors duration-500 ${
            interactive ? "group-hover:text-accentGold/80" : ""
          }`}
        >
          {displayUrl}
        </span>
      </div>

      <div className="relative aspect-[16/10] overflow-hidden">
        {href ? (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="absolute inset-0 z-20"
            aria-label={linkLabel ?? `Open ${displayUrl}`}
          />
        ) : null}

        {!loaded ? (
          <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-bgSecondary via-bgElevated to-bgSecondary" />
        ) : null}

        {interactive ? (
          <>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 -translate-x-full bg-gradient-to-r from-transparent via-accentGold/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
            />
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 z-10 bg-black/20 transition-opacity duration-500 group-hover:opacity-0"
            />
          </>
        ) : (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 -translate-x-full bg-gradient-to-r from-transparent via-accentGold/10 to-transparent transition-transform duration-700 group-hover:translate-x-full"
          />
        )}

        <Image
          src={image}
          alt={alt}
          fill
          priority={priority}
          sizes={sizes}
          className={`object-cover transition-transform duration-700 ease-out ${
            interactive ? "group-hover:scale-[1.04]" : "group-hover:scale-[1.05]"
          } ${imagePosition === "center" ? "object-center" : "object-top"}`}
          onLoad={onLoad}
        />
      </div>
    </div>
  );
}
