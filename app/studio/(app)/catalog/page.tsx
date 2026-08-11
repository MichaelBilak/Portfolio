import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  ListPlus,
  Route,
  Sparkles,
} from "lucide-react";
import { getStudioSession } from "@/lib/studio/auth";
import { createStudioTranslator, resolveStudioLocale } from "@/lib/studio/i18n/messages";
import { studioPath } from "@/lib/studio/path";

export default async function CatalogHubPage() {
  const user = await getStudioSession();
  const locale = resolveStudioLocale(user?.adminLocale);
  const t = createStudioTranslator(locale);

  const sections = [
    {
      href: "/services",
      title: t("catalog.servicesTitle"),
      description: t("catalog.servicesDesc"),
      icon: Sparkles,
    },
    {
      href: "/projects",
      title: t("catalog.projectsTitle"),
      description: t("catalog.projectsDesc"),
      icon: BriefcaseBusiness,
    },
    {
      href: "/addons",
      title: t("catalog.addonsTitle"),
      description: t("catalog.addonsDesc"),
      icon: ListPlus,
    },
    {
      href: "/process",
      title: t("catalog.processTitle"),
      description: t("catalog.processDesc"),
      icon: Route,
    },
  ];

  return (
    <>
      <div className="st-page-header">
        <div>
          <p className="st-eyebrow">{t("catalog.eyebrow")}</p>
          <h1 className="st-h1">{t("catalog.title")}</h1>
          <p className="st-sub">{t("catalog.subtitle")}</p>
        </div>
      </div>
      <div className="st-action-grid">
        {sections.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={studioPath(href)} className="st-action-card">
            <span className="st-action-icon"><Icon size={20} /></span>
            <span>
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
            <ArrowRight size={17} aria-hidden />
          </Link>
        ))}
      </div>
    </>
  );
}
