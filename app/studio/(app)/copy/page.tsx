import Link from "next/link";

const SECTIONS = [
  "nav",
  "hero",
  "trust",
  "servicesLabel",
  "servicesLead",
  "problem",
  "caseStudies",
  "impact",
  "audit",
  "processSection",
  "beforeAfter",
  "beforeAfterShowOnSite",
  "about",
  "aboutPage",
  "contact",
  "orderPage",
  "pricingAddons",
  "servicesPage",
  "servicePage",
  "workPage",
  "footer",
  "privacyPage",
  "langSelector",
] as const;

const LOCALES = ["it", "en", "fr", "ru", "de", "es"] as const;

export default function SiteCopyIndexPage() {
  return (
    <>
      <h1 className="st-h1">Site copy</h1>
      <p className="st-sub">Localized marketing sections (JSON per locale).</p>
      <div className="st-cards">
        {SECTIONS.map((section) => (
          <Link key={section} href={`/studio/copy/${section}?locale=it`} className="st-card">
            <strong style={{ fontSize: "1rem" }}>{section}</strong>
            <span>Edit · {LOCALES.join("/")}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
