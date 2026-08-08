import Image from "next/image";

/** Tightly cropped D glyph — no transparent padding (see logo-dm-group.png source). */
export const LOGO_D_SRC = "/images/logo-d-letter.png";
/** Full lockup PNG kept for favicon / schema / other uses. */
export const LOGO_SRC = "/images/logo-dm-group.png";

const D_WIDTH = 661;
const D_HEIGHT = 615;

interface WordmarkCoreProps {
  className?: string;
  showStudio?: boolean;
  groupClassName?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}

export function WordmarkCore({
  className = "",
  showStudio = true,
  groupClassName = "text-[0.68em] font-medium tracking-[0.01em] text-textPrimary/90",
  priority = false,
  style,
}: WordmarkCoreProps) {
  return (
    <span
      className={`inline-flex items-baseline whitespace-nowrap font-brand font-semibold leading-none tracking-tight text-textPrimary ${className}`}
      style={style}
    >
      <Image
        src={LOGO_D_SRC}
        alt=""
        aria-hidden
        width={D_WIDTH}
        height={D_HEIGHT}
        priority={priority}
        className="h-[1em] w-auto shrink-0 translate-x-[2px] self-baseline"
      />
      <span aria-hidden className="leading-none">
        orm<span className="text-accentGold">Up</span>
        {showStudio ? <span className={groupClassName}> Studio</span> : null}
      </span>
    </span>
  );
}
