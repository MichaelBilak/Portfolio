"use client";

import Script from "next/script";

/** Loads GA4 / Plausible when env or CMS IDs are provided. */
export function AnalyticsScripts({
  gaId,
  plausibleDomain,
}: {
  gaId?: string | null;
  plausibleDomain?: string | null;
}) {
  const measurementId = gaId || process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const plausible = plausibleDomain || process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <>
      {measurementId ? (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
            strategy="afterInteractive"
          />
          <Script id="ga4-init" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${measurementId}', { anonymize_ip: true });
            `}
          </Script>
        </>
      ) : null}
      {plausible ? (
        <Script
          defer
          data-domain={plausible}
          src="https://plausible.io/js/script.js"
          strategy="afterInteractive"
        />
      ) : null}
    </>
  );
}

export function trackEvent(name: string, params?: Record<string, string | number | boolean>) {
  if (typeof window === "undefined") return;
  const w = window as Window & {
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, opts?: { props?: Record<string, unknown> }) => void;
  };
  w.gtag?.("event", name, params);
  w.plausible?.(name, params ? { props: params } : undefined);
}
