/** Central pricing data (EUR). Display strings are built per locale in format-price.ts */

export type ServiceId =
  | "premium-site"
  | "redesign"
  | "booking-flow"
  | "monthly-support"
  | "photo-video";

export type AddonPriceType = "from" | "plus";

export interface PricingTierConfig {
  tierId: string;
  price: number;
  /** Recurring monthly price (e.g. support, retainer) */
  monthly?: boolean;
  featured?: boolean;
}

export interface AddonModuleConfig {
  id: string;
  price: number;
  type: AddonPriceType;
  /** Override: recurring monthly add-on */
  monthly?: boolean;
}

export interface AddonCategoryConfig {
  id: string;
  items: AddonModuleConfig[];
}

/** Starting prices for the 5 main services */
export const SERVICE_BASE_PRICES: Record<ServiceId, number> = {
  "premium-site": 1299,
  redesign: 1499,
  "booking-flow": 599,
  "monthly-support": 199,
  "photo-video": 499,
};

export const SERVICE_MONTHLY: Partial<Record<ServiceId, boolean>> = {
  "monthly-support": true,
};

export const SERVICE_TIERS: Record<ServiceId, PricingTierConfig[]> = {
  "premium-site": [
    { tierId: "starter", price: 1299 },
    { tierId: "business", price: 1999, featured: true },
    { tierId: "premium", price: 2999 },
  ],
  redesign: [
    { tierId: "audit", price: 499 },
    { tierId: "standard", price: 1499, featured: true },
    { tierId: "full", price: 2499 },
  ],
  "booking-flow": [
    { tierId: "single", price: 599 },
    { tierId: "multi", price: 999, featured: true },
    { tierId: "full", price: 1499 },
  ],
  "monthly-support": [
    { tierId: "essential", price: 199, monthly: true },
    { tierId: "growth", price: 399, monthly: true, featured: true },
    { tierId: "priority", price: 699, monthly: true },
  ],
  "photo-video": [
    { tierId: "half-day", price: 499 },
    { tierId: "full-day", price: 899, featured: true },
    { tierId: "retainer", price: 1499, monthly: true },
  ],
};

export const ADDON_CATEGORIES: AddonCategoryConfig[] = [
  {
    id: "websites",
    items: [
      { id: "corporate", price: 1999, type: "from" },
      { id: "promo", price: 999, type: "from" },
      { id: "landing", price: 1299, type: "from" },
      { id: "media-blog", price: 2499, type: "from" },
      { id: "no-code", price: 899, type: "from" },
    ],
  },
  {
    id: "products",
    items: [
      { id: "web-service", price: 2999, type: "from" },
      { id: "ecommerce", price: 2499, type: "from" },
      { id: "client-portal", price: 1499, type: "from" },
      { id: "chatbot", price: 799, type: "from" },
      { id: "intranet", price: 3499, type: "from" },
      { id: "mobile-app", price: 4999, type: "from" },
    ],
  },
  {
    id: "design",
    items: [
      { id: "ux-ui", price: 799, type: "from" },
      { id: "branding", price: 599, type: "from" },
      { id: "motion-sound", price: 399, type: "plus" },
      { id: "ux-research", price: 799, type: "from" },
    ],
  },
  {
    id: "development",
    items: [
      { id: "cms", price: 299, type: "plus" },
      { id: "multilingual", price: 399, type: "plus" },
      { id: "backend", price: 1499, type: "plus" },
      { id: "qa", price: 499, type: "plus" },
      { id: "devops", price: 399, type: "plus" },
      { id: "seo-extended", price: 299, type: "plus" },
    ],
  },
];

/** Main services + add-on modules offered on the order page */
export const SERVICE_OFFER_COUNT =
  (Object.keys(SERVICE_BASE_PRICES) as ServiceId[]).length +
  ADDON_CATEGORIES.reduce((sum, category) => sum + category.items.length, 0);

/** @deprecated Use SERVICE_BASE_PRICES — kept for any legacy imports */
export const orderPricingEur: Record<string, number> = SERVICE_BASE_PRICES;
