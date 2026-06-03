import { defineRouting } from "next-intl/routing";
import { localeOrder } from "@/lib/translations";

export const routing = defineRouting({
  locales: localeOrder,
  defaultLocale: "it",
  localePrefix: "as-needed",
});
