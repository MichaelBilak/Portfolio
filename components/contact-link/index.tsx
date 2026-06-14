import { Link } from "@/i18n/navigation";
import type { ComponentProps, ReactNode } from "react";

type ContactLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  children: ReactNode;
  /** When true, opens contact form in free-audit mode (?intent=audit). */
  audit?: boolean;
};

/** Links to the contact page with the enquiry form. */
export function ContactLink({ className, children, audit, ...props }: ContactLinkProps) {
  const href = audit ? "/contact?intent=audit" : "/contact";
  return (
    <Link href={href} className={className} {...props}>
      {children}
    </Link>
  );
}
