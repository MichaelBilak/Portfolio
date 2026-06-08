import {
  SERVICE_BASE_PRICES,
  SERVICE_MONTHLY,
  type ServiceId,
} from "@/data/pricing";
import { PriceDisplay } from "@/components/price-display";
import { formatFromPrice } from "@/lib/format-price";
import type { Locale } from "@/lib/translations";

/** Soft anchor for service hero — sits beside CTA, doesn't compete with it */
export function PriceBadge({
  amount,
  locale,
  fromLabelText,
  monthly,
  className = "",
}: {
  amount: number;
  locale: Locale;
  fromLabelText: string;
  monthly?: boolean;
  className?: string;
}) {
  return (
    <PriceDisplay
      amount={amount}
      locale={locale}
      prefixLabel={fromLabelText}
      monthly={monthly}
      size="md"
      className={className}
    />
  );
}

export function getServiceFromPrice(serviceId: ServiceId, locale: Locale) {
  return formatFromPrice(SERVICE_BASE_PRICES[serviceId], locale, {
    monthly: SERVICE_MONTHLY[serviceId],
  });
}
