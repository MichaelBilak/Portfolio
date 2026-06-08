import { Link } from "@/i18n/navigation";
import type { ComponentProps, ReactNode } from "react";

type ContactLinkProps = Omit<ComponentProps<typeof Link>, "href"> & {
  children: ReactNode;
};

/** Links to the contact page with the enquiry form. */
export function ContactLink({ className, children, ...props }: ContactLinkProps) {
  return (
    <Link href="/contact" className={className} {...props}>
      {children}
    </Link>
  );
}
