import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getStudioSession } from "@/lib/studio/auth";
import {
  createStudioTranslator,
  getSiteCopyCatalog,
  resolveStudioLocale,
} from "@/lib/studio/i18n/messages";
import { studioPath } from "@/lib/studio/path";

export default async function SiteCopyIndexPage() {
  const user = await getStudioSession();
  const locale = resolveStudioLocale(user?.adminLocale);
  const t = createStudioTranslator(locale);
  const groups = getSiteCopyCatalog(locale);

  return (
    <>
      <div className="st-page-header">
        <div>
          <p className="st-eyebrow">{t("copy.eyebrow")}</p>
          <h1 className="st-h1">{t("copy.title")}</h1>
          <p className="st-sub">{t("copy.subtitle")}</p>
        </div>
      </div>
      <div className="st-copy-groups">
        {groups.map((group) => (
          <section className="st-copy-group" key={group.title}>
            <div className="st-copy-group-head">
              <h2>{group.title}</h2>
              <p>{group.description}</p>
            </div>
            <div className="st-copy-list">
              {group.sections.map(([section, title, description]) => (
                <Link
                  key={section}
                  href={`${studioPath(`/copy/${section}`)}?locale=it`}
                >
                  <span>
                    <strong>{title}</strong>
                    <small>{description}</small>
                  </span>
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
