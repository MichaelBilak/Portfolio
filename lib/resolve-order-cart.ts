import { ADDON_CATEGORIES } from "@/data/pricing";
import { servicesMeta } from "@/data/services";
import type { TranslationSet } from "@/lib/translations";

export interface CartServiceItem {
  slug: string;
  title: string;
}

export interface CartAddonItem {
  id: string;
  label: string;
}

export interface ResolvedOrderCart {
  services: string[];
  addons: string[];
}

export interface ResolvedOrderCartItems {
  services: CartServiceItem[];
  addons: CartAddonItem[];
}

export function resolveOrderCartItems(
  t: TranslationSet,
  serviceSlugs: string[],
  addonIds: string[],
): ResolvedOrderCartItems {
  const services = serviceSlugs
    .map((slug) => {
      const index = servicesMeta.findIndex((m) => m.slug === slug);
      if (index < 0) return { slug, title: slug };
      return { slug, title: t.services[index].title };
    })
    .filter((item) => item.slug);

  const addons = addonIds
    .map((id) => {
      let label = id;
      for (const cat of ADDON_CATEGORIES) {
        if (!cat.items.some((i) => i.id === id)) continue;
        for (const localized of t.pricingAddons.categories) {
          const item = localized.items.find((i) => i.id === id);
          if (item) label = item.label;
        }
      }
      return { id, label };
    })
    .filter((item) => item.id);

  return { services, addons };
}

export function resolveOrderCart(
  t: TranslationSet,
  serviceSlugs: string[],
  addonIds: string[],
): ResolvedOrderCart {
  const items = resolveOrderCartItems(t, serviceSlugs, addonIds);
  return {
    services: items.services.map((s) => s.title),
    addons: items.addons.map((a) => a.label),
  };
}

export function buildOrderQuery(services: string[], addons: string[]): string {
  const params = new URLSearchParams();
  if (services.length > 0) params.set("services", services.join(","));
  if (addons.length > 0) params.set("addons", addons.join(","));
  return params.toString();
}
