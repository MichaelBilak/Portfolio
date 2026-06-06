"use client";

import { contactMailtoHref, openContactEmail } from "@/lib/contact-email";
import { cn } from "@/lib/ui";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";

type MailtoLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href?: string;
};

export function MailtoLink({
  href,
  onClick,
  className,
  children,
  ...props
}: MailtoLinkProps) {
  const mailto = href ?? contactMailtoHref();

  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.(event);
    if (event.defaultPrevented) return;
    event.preventDefault();
    openContactEmail();
  }

  return (
    <a
      {...props}
      href={mailto}
      onClick={handleClick}
      className={cn("relative z-10 cursor-pointer", className)}
    >
      {children}
    </a>
  );
}
