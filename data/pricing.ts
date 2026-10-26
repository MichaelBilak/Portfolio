/** Central pricing data (EUR). Display strings are built per locale in format-price.ts */

export type ServiceId =
  | "visibility"
  | "premium-site"
  | "photo-video"
  | "booking-flow"
  | "digital-growth"
  | "monthly-support"
  | "redesign";

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

/** Starting prices for catalog services (indicative “from”) */
export const SERVICE_BASE_PRICES: Record<ServiceId, number> = {
  visibility: 699,
  "premium-site": 1299,
  "photo-video": 499,
  "booking-flow": 599,
  "digital-growth": 499,
  "monthly-support": 199,
  redesign: 899,
};

export const SERVICE_MONTHLY: Partial<Record<ServiceId, boolean>> = {
  "monthly-support": true,
  "digital-growth": true,
};

export const SERVICE_TIERS: Record<ServiceId, PricingTierConfig[]> = {
  visibility: [
    { tierId: "audit", price: 699 },
    { tierId: "local", price: 1199, featured: true },
    { tierId: "ongoing", price: 1499, monthly: true },
  ],
  "premium-site": [
    { tierId: "starter", price: 1299 },
    { tierId: "business", price: 1999, featured: true },
    { tierId: "premium", price: 2999 },
  ],
  "photo-video": [
    { tierId: "half-day", price: 499 },
    { tierId: "full-day", price: 899, featured: true },
    { tierId: "retainer", price: 1499, monthly: true },
  ],
  "booking-flow": [
    { tierId: "single", price: 599 },
    { tierId: "multi", price: 999, featured: true },
    { tierId: "full", price: 1499 },
  ],
  "digital-growth": [
    { tierId: "setup", price: 499 },
    { tierId: "monthly", price: 399, monthly: true, featured: true },
    { tierId: "full", price: 699, monthly: true },
  ],
  "monthly-support": [
    { tierId: "essential", price: 199, monthly: true },
    { tierId: "growth", price: 399, monthly: true, featured: true },
    { tierId: "priority", price: 699, monthly: true },
  ],
  redesign: [
    { tierId: "audit", price: 499 },
    { tierId: "standard", price: 899, featured: true },
    { tierId: "full", price: 2299 },
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
