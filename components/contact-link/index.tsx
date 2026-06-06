import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/ui";
import type { ComponentProps, ReactNode } from "react";

type ContactLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  children: ReactNode;
  desktopClassName?: string;
};

/** Mobile → /contact page; md+ → /#contact section on home. */
export function ContactLink({
  className,
  desktopClassName = "hidden md:inline-flex",
  children,
  ...props
}: ContactLinkProps) {
  return (
    <>
      <Link href="/contact" className={cn("md:hidden", className)} {...props}>
        {children}
      </Link>
      <Link href="/#contact" className={cn(desktopClassName, className)} {...props}>
        {children}
      </Link>
    </>
  );
}
