"use client";

import { contactMailtoHref, openContactEmail } from "@/lib/contact-email";
import { cn } from "@/lib/ui";
import type { ComponentPropsWithoutRef, MouseEvent } from "react";

type MailtoLinkProps = Omit<ComponentPropsWithoutRef<"a">, "href"> & {
  href?: string;
};

function isTouchLikeDevice(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(hover: none), (pointer: coarse)").matches;
}

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

    // Desktop: native mailto navigation (Outlook, Mail, Gmail handler, etc.)
    if (!isTouchLikeDevice()) return;

    // Mobile webviews / iOS: programmatic open avoids transform/tap quirks
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
