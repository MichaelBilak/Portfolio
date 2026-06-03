import Image from "next/image";

const LOGO_SRC = "/images/logo-dm-group.png";

interface BrandLogoProps {
  imageSize?: number;
  priority?: boolean;
  showTagline?: boolean;
  taglineClassName?: string;
  groupClassName?: string;
  agencyClassName?: string;
  separatorClassName?: string;
}

export function BrandLogo({
  imageSize = 40,
  priority = false,
  showTagline = true,
  taglineClassName = "",
  groupClassName = "text-[10px] font-semibold leading-none tracking-[0.18em] text-textPrimary/90 uppercase",
  agencyClassName = "text-[8px] font-medium leading-none tracking-[0.22em] text-accentGold/70 uppercase",
  separatorClassName = "h-7 w-px bg-borderSubtle",
}: BrandLogoProps) {
  return (
    <>
      <Image
        src={LOGO_SRC}
        alt="DormUp Group"
        width={imageSize}
        height={imageSize}
        priority={priority}
        className="shrink-0 object-contain"
      />
      {showTagline ? (
        <>
          <span className={separatorClassName} aria-hidden />
          <span className={`flex flex-col gap-[3px] ${taglineClassName}`}>
            <span className={groupClassName}>Group</span>
            <span className={agencyClassName}>Digital Agency</span>
          </span>
        </>
      ) : null}
    </>
  );
}
