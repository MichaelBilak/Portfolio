import { revalidatePath, revalidateTag } from "next/cache";
import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from "payload";

export const revalidateCatalog: CollectionAfterChangeHook = ({ doc, collection }) => {
  revalidateTag("cms-catalog");
  if (collection?.slug === "services") {
    revalidatePath("/[locale]/services", "page");
    if (doc?.slug) revalidatePath(`/[locale]/services/${doc.slug}`, "page");
  }
  if (collection?.slug === "projects") {
    revalidatePath("/[locale]/work", "page");
    if (doc?.slug) revalidatePath(`/[locale]/work/${doc.slug}`, "page");
  }
  revalidatePath("/[locale]", "page");
  return doc;
};

export const revalidateCatalogOnDelete: CollectionAfterDeleteHook = () => {
  revalidateTag("cms-catalog");
  revalidatePath("/[locale]", "page");
};
