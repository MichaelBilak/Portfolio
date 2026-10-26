import { Link } from "@/i18n/navigation";
import type { ComponentProps, ReactNode } from "react";

type ContactLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  children: ReactNode;
  /** When true, opens the digital audit landing (form in audit mode). */
  audit?: boolean;
};

/** Links to the contact page or audit landing with the enquiry form. */
export function ContactLink({ className, children, audit, ...props }: ContactLinkProps) {
  const href = audit ? "/audit-digitale" : "/contact";
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
}
