import { servicesMeta } from "@/data/services";
import type { LocalizedService, TranslationSet } from "@/lib/translations";

export function serviceCopyById(
  t: TranslationSet,
  id: string,
): LocalizedService | undefined {
  return t.services.find((s) => s.id === id);
}

export function serviceCopyBySlug(
  t: TranslationSet,
  slug: string,
): LocalizedService | undefined {
  const meta = servicesMeta.find((m) => m.slug === slug);
  if (!meta) return undefined;
  return serviceCopyById(t, meta.id);
}
