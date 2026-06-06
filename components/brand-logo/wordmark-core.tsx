import Image from "next/image";

export const LOGO_SRC = "/images/logo-dm-group.png";

/** Visible width of the D glyph inside the PNG (rest is transparent padding). */
const D_SLOT_WIDTH = "0.58em";
/** Pulls "ormUp" left so it sits flush against the D on every size. */
const TEXT_OVERLAP = "0.46em";

interface WordmarkCoreProps {
  className?: string;
  showGroup?: boolean;
  groupClassName?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}

export function WordmarkCore({
  className = "",
  showGroup = true,
  groupClassName = "text-[0.72em] font-normal tracking-[0.04em] text-textPrimary/90",
  priority = false,
  style,
}: WordmarkCoreProps) {
  return (
    <span
      className={`inline-flex items-center whitespace-nowrap font-brand font-light leading-none tracking-tight text-textPrimary ${className}`}
      style={style}
    >
      <span
        aria-hidden
        className="relative shrink-0 overflow-hidden"
        style={{ width: D_SLOT_WIDTH, height: "1em" }}
      >
        <Image
          src={LOGO_SRC}
          alt=""
          aria-hidden
          width={256}
          height={256}
          priority={priority}
          className="absolute left-0 top-0 h-[1em] w-[1em] max-w-none object-contain object-left"
        />
      </span>
      <span aria-hidden style={{ marginLeft: `calc(-1 * ${TEXT_OVERLAP})` }}>
        orm<span className="text-accentGold">Up</span>
        {showGroup ? <span className={groupClassName}> Group</span> : null}
      </span>
    </span>
  );
}
