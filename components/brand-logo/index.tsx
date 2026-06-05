import Image from "next/image";

const LOGO_SRC = "/images/logo-dm-group.png";

interface BrandLogoProps {
  imageSize?: number;
  priority?: boolean;
  showTagline?: boolean;
  wordmarkClassName?: string;
  wordmarkOffsetClassName?: string;
  taglineClassName?: string;
  groupClassName?: string;
  agencyClassName?: string;
  separatorClassName?: string;
}

export function BrandLogo({
  imageSize = 40,
  priority = false,
  showTagline = true,
  wordmarkClassName = "text-2xl",
  wordmarkOffsetClassName = "-ml-2.5",
  taglineClassName = "",
  groupClassName = "text-[10px] font-semibold leading-none tracking-[0.18em] text-textPrimary/90 uppercase",
  agencyClassName = "text-[8px] font-medium leading-none tracking-[0.22em] text-accentGold/70 uppercase",
  separatorClassName = "h-7 w-px bg-borderSubtle",
}: BrandLogoProps) {
  return (
    <>
      <span
        className="flex items-center"
        aria-label="DormUp"
      >
        <Image
          src={LOGO_SRC}
          alt=""
          aria-hidden
          width={imageSize}
          height={imageSize}
          priority={priority}
          className="shrink-0 object-contain"
        />
        <span
          className={`font-brand font-light leading-none tracking-tight text-textPrimary ${wordmarkOffsetClassName} ${wordmarkClassName}`}
          aria-hidden
        >
          orm<span className="text-accentGold">Up</span>
        </span>
      </span>
      {showTagline ? (
        <>
          <span className={separatorClassName} aria-hidden />
          <span className={`flex flex-col gap-[3px] ${taglineClassName}`}>
            <span className={groupClassName}>Group</span>
            <span className={agencyClassName}>Digital Studio</span>
          </span>
        </>
      ) : null}
    </>
  );
}
