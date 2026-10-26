import type { Locale } from "@/lib/translations";

/** Default homepage-level metadata per locale (layout fallback + home page). */
export const localeMetaContent: Record<
  Locale,
  { title: string; description: string }
> = {
  it: {
    title: "Siti web, video e crescita digitale a Rimini | DormUp Studio",
    description:
      "Studio digitale a Rimini: visibilità su Google e AI, siti web, video professionali e automazione per aziende che vogliono più clienti e un'immagine chiara.",
  },
  en: {
    title: "Websites, Video & Digital Growth in Rimini | DormUp Studio",
    description:
      "Digital growth & creative studio in Rimini: Google & AI visibility, websites, professional video and automation for businesses that need more customers and a stronger brand.",
  },
  fr: {
    title: "Sites web, vidéo et croissance digitale à Rimini | DormUp Studio",
    description:
      "Studio digital à Rimini : visibilité Google et IA, sites web, vidéo professionnelle et automatisation pour les entreprises qui veulent plus de clients.",
  },
  ru: {
    title: "Сайты, видео и цифровой рост в Римини | DormUp Studio",
    description:
      "Digital Growth & Creative Studio в Римини: видимость в Google и AI-поиске, сайты, профессиональное видео и автоматизация для бизнеса.",
  },
  de: {
    title: "Websites, Video & digitales Wachstum in Rimini | DormUp Studio",
    description:
      "Digital Growth & Creative Studio in Rimini: Google- & KI-Sichtbarkeit, Websites, professionelles Video und Automatisierung für Unternehmen.",
  },
  es: {
    title: "Sitios web, vídeo y crecimiento digital en Rímini | DormUp Studio",
    description:
      "Estudio digital en Rímini: visibilidad en Google e IA, sitios web, vídeo profesional y automatización para empresas que quieren más clientes.",
  },
};
