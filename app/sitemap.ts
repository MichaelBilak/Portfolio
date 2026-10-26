import type { MetadataRoute } from "next";
import { projectsMeta } from "@/data/projects";
import { servicesMeta } from "@/data/services";
import { getProjects, getServices } from "@/lib/cms/catalog";
import { localeOrder } from "@/lib/locale-meta";
import { absoluteUrl, localeAlternateLanguages } from "@/lib/site-paths";
import type { Locale } from "@/lib/translations";

const RETIRED_WORK_SLUGS = new Set(["porto-sole", "rockisland-rimini"]);

const staticPaths = [
  "",
  "/about",
  "/contact",
  "/order",
  "/privacy",
  "/services",
  "/work",
  "/audit-digitale",
];

function sitemapEntry(
  pathname: string,
  lastModified?: Date,
): MetadataRoute.Sitemap[number] {
  const defaultLocale = localeOrder[0] as Locale;
  return {
    url: absoluteUrl(defaultLocale, pathname),
    lastModified: lastModified ?? new Date("2026-10-23"),
    changeFrequency: pathname === "" ? "weekly" : "monthly",
    priority:
      pathname === ""
        ? 1
        : pathname.startsWith("/services") ||
            pathname.startsWith("/work") ||
            pathname === "/audit-digitale"
          ? 0.8
          : 0.7,
    alternates: {
      languages: localeAlternateLanguages(pathname),
    },
  };
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticPaths.map((path) =>
    sitemapEntry(path === "" ? "" : path),
  );

  const [services, projects] = await Promise.all([
    getServices("it"),
    getProjects("it"),
  ]);

  const serviceSlugs = services.metas.length
    ? services.metas.map((s) => s.slug)
    : servicesMeta.map((s) => s.slug);

  const projectSlugs = (
    projects.length ? projects.map((p) => p.slug) : projectsMeta.map((p) => p.slug)
  ).filter((slug) => !RETIRED_WORK_SLUGS.has(slug));

  for (const slug of serviceSlugs) {
    entries.push(sitemapEntry(`/services/${slug}`));
  }

  for (const slug of projectSlugs) {
    entries.push(sitemapEntry(`/work/${slug}`));
  }

  return entries;
}
