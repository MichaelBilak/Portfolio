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

/** Fixed content dates. A deploy must not call `new Date()` here. */
const PRIOR_CONTENT_REVISION = new Date("2026-10-23");
const RELEASE_CONTENT_REVISION = new Date("2026-10-26");

function lastModifiedFor(pathname: string): Date {
  if (pathname === "" || pathname === "/services/photo-video") {
    return RELEASE_CONTENT_REVISION;
  }
  return PRIOR_CONTENT_REVISION;
}

function sitemapEntry(
  pathname: string,
  locale: Locale,
): MetadataRoute.Sitemap[number] {
  return {
    url: absoluteUrl(locale, pathname),
    lastModified: lastModifiedFor(pathname),
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

function entriesFor(pathname: string): MetadataRoute.Sitemap {
  return localeOrder.map((locale) => sitemapEntry(pathname, locale as Locale));
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = staticPaths.flatMap((path) =>
    entriesFor(path === "" ? "" : path),
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
    entries.push(...entriesFor(`/services/${slug}`));
  }

  for (const slug of projectSlugs) {
    entries.push(...entriesFor(`/work/${slug}`));
  }

  return entries;
}
