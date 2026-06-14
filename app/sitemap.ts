import type { MetadataRoute } from "next";
import { servicesMeta } from "@/data/services";
import { projectsMeta } from "@/data/projects";
import { localeOrder } from "@/lib/locale-meta";
import { absoluteUrl, localeAlternateLanguages } from "@/lib/site-paths";
import type { Locale } from "@/lib/translations";

const staticPaths = ["", "/about", "/contact", "/order", "/privacy", "/services", "/work"];

function sitemapEntry(pathname: string): MetadataRoute.Sitemap[number] {
  const defaultLocale = localeOrder[0] as Locale;
  return {
    url: absoluteUrl(defaultLocale, pathname),
    lastModified: new Date(),
    changeFrequency: pathname === "" ? "weekly" : "monthly",
    priority: pathname === "" ? 1 : pathname.startsWith("/services") || pathname.startsWith("/work") ? 0.8 : 0.7,
    alternates: {
      languages: localeAlternateLanguages(pathname),
    },
  };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) =>
    sitemapEntry(path === "" ? "" : path),
  );

  for (const service of servicesMeta) {
    entries.push(sitemapEntry(`/services/${service.slug}`));
  }

  for (const project of projectsMeta) {
    entries.push(sitemapEntry(`/work/${project.slug}`));
  }

  return entries;
}
