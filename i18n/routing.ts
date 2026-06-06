import { defineRouting } from "next-intl/routing";
import { localeOrder } from "@/lib/locale-meta";

export const routing = defineRouting({
  locales: localeOrder,
  defaultLocale: "it",
  localePrefix: "as-needed",
});
