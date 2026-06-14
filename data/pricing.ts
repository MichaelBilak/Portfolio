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
}

export interface AddonCategoryConfig {
  id: string;
  items: AddonModuleConfig[];
}

/** Starting prices for the 5 main services */
export const SERVICE_BASE_PRICES: Record<ServiceId, number> = {
  "premium-site": 1299,
  redesign: 899,
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
    { tierId: "standard", price: 899, featured: true },
    { tierId: "full", price: 2299 },
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
      { id: "corporate" },
      { id: "promo" },
      { id: "landing" },
      { id: "media-blog" },
      { id: "no-code" },
    ],
  },
  {
    id: "products",
    items: [
      { id: "web-service" },
      { id: "ecommerce" },
      { id: "client-portal" },
      { id: "chatbot" },
      { id: "intranet" },
      { id: "mobile-app" },
    ],
  },
  {
    id: "design",
    items: [
      { id: "ux-ui" },
      { id: "branding" },
      { id: "motion-sound" },
      { id: "ux-research" },
    ],
  },
  {
    id: "development",
    items: [
      { id: "cms" },
      { id: "multilingual" },
      { id: "backend" },
      { id: "qa" },
      { id: "devops" },
      { id: "seo-extended" },
    ],
  },
];

/** Main services + add-on modules offered on the order page */
export const SERVICE_OFFER_COUNT =
  (Object.keys(SERVICE_BASE_PRICES) as ServiceId[]).length +
  ADDON_CATEGORIES.reduce((sum, category) => sum + category.items.length, 0);

/** @deprecated Use SERVICE_BASE_PRICES — kept for any legacy imports */
export const orderPricingEur: Record<string, number> = SERVICE_BASE_PRICES;
