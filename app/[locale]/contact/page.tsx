import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { Contact } from "@/components/contact";
import { Footer } from "@/components/footer";
import { Navigation } from "@/components/navigation";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { Locale, translations } from "@/lib/translations";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = translations[locale as Locale];
  return {
    title: `${t.contact.title} · DormUp Group`,
    description: t.contact.body,
  };
}

export default async function ContactPage({ params }: PageProps) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const safeLocale = locale as Locale;
  const t = translations[safeLocale];

  return (
    <>
      <Navigation locale={safeLocale} t={t} />

      <main className="relative pt-page pb-safe">
        <div className="container-lux max-w-4xl pb-4 md:hidden">
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.24em] text-textMuted transition-colors hover:text-accentGold"
          >
            <ArrowLeft size={14} />
            {t.servicePage.backToHome}
          </Link>
        </div>

        <Contact t={t} />
      </main>

      <Footer t={t} className="!pb-0 pb-safe lg:!pb-0" />
    </>
  );
}
