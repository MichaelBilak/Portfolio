import { cn } from "@/lib/ui";

type HeadingTag = "h1" | "h2" | "h3";

/**
 * Display heading that wraps only on explicit newlines.
 * Each line scales to the container so a phrase is never split mid-thought.
 */
export function FitHeading({
  as: Tag = "h1",
  text,
  className,
  max = "5.75rem",
  min = "1rem",
  fitChars,
}: {
  as?: HeadingTag;
  text: string;
  className?: string;
  max?: string;
  min?: string;
  /** Size every heading as if it were this many characters, so locales match. */
  fitChars?: number;
}) {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  const longest = fitChars ?? Math.max(...lines.map((line) => line.length), 1);
  const cqi = Math.min(11, 100 / (longest * 0.78));
  const size = `clamp(${min}, ${cqi.toFixed(3)}cqi, ${max})`;

  return (
    <Tag
      className={cn(
        "w-full max-w-full font-display font-light leading-[0.98] tracking-[-0.03em] text-textPrimary [container-type:inline-size]",
        className,
      )}
    >
      {lines.map((line, index) => (
        <span key={`${line}-${index}`} className="block whitespace-nowrap" style={{ fontSize: size }}>
          {line}
        </span>
      ))}
    </Tag>
  );
}
