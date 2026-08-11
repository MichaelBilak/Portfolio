import Link from "next/link";
import {
  ArrowRight,
  Images,
  Settings2,
  Shuffle,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { getStudioSession } from "@/lib/studio/auth";
import { createStudioTranslator, resolveStudioLocale } from "@/lib/studio/i18n/messages";
import { studioPath } from "@/lib/studio/path";

export default async function ManageHubPage() {
  const user = await getStudioSession();
  const locale = resolveStudioLocale(user?.adminLocale);
  const t = createStudioTranslator(locale);

  const sections = [
    {
      href: "/seo",
      title: t("manage.seoTitle"),
      description: t("manage.seoDesc"),
      icon: SlidersHorizontal,
    },
    {
      href: "/media",
      title: t("manage.mediaTitle"),
      description: t("manage.mediaDesc"),
      icon: Images,
    },
    {
      href: "/redirects",
      title: t("manage.redirectsTitle"),
      description: t("manage.redirectsDesc"),
      icon: Shuffle,
    },
    {
      href: "/settings",
      title: t("manage.settingsTitle"),
      description: t("manage.settingsDesc"),
      icon: Settings2,
    },
    ...(user?.role === "owner"
      ? [{
          href: "/users",
          title: t("manage.usersTitle"),
          description: t("manage.usersDesc"),
          icon: Users,
        }]
      : []),
  ];

  return (
    <>
      <div className="st-page-header">
        <div>
          <p className="st-eyebrow">{t("manage.eyebrow")}</p>
          <h1 className="st-h1">{t("manage.title")}</h1>
          <p className="st-sub">{t("manage.subtitle")}</p>
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
