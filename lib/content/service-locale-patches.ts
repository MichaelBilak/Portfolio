import type { LocalizedService } from "@/lib/translations";

type Patch = Partial<LocalizedService>;

/** French commercial copy. Titles and bodies, not an English clone. */
export const frServicePatches: Record<string, Patch> = {
  visibility: {
    title: "Visibilité Google et IA",
    description:
      "Nous aidons les entreprises à être trouvées sur Google, Maps et dans les recherches avec IA — grâce à des contenus clairs, une présence locale et une fiche établissement cohérente lorsqu’elle est éligible.",
    details: "SEO local · Fiche Google · Contenus lisibles par l’IA · Aucune garantie de position",
    whatYouGet: [
      "Analyse de la façon dont les clients vous cherchent aujourd’hui",
      "Amélioration des pages clés et de la structure du site",
      "Indications pour Google Maps / la fiche établissement, si elle est éligible",
      "Textes clairs et vérifiables pour les moteurs et la recherche IA",
      "Suivi de base et priorités d’amélioration",
    ],
    pricingSectionTitle: "Formules visibilité",
    pricingFootnote:
      "Montants indicatifs « à partir de ». Nous ne garantissons ni les positions Google ni les mentions dans ChatGPT.",
    pricingTiers: [
      { tierId: "audit", name: "Audit visibilité", detail: "État des lieux · opportunités · feuille de route." },
      { tierId: "local", name: "Local", detail: "Pages + local · fiche · contenus clés." },
      { tierId: "ongoing", name: "Continu", detail: "Améliorations mensuelles · rapport simple." },
    ],
    faq: [
      {
        question: "Que comprend la visibilité Google et IA ?",
        answer:
          "Le travail porte sur la découvrabilité : structure, contenus clairs, pertinence locale et accessibilité technique. Lorsque c’est pertinent, nous aidons aussi sur la fiche Google. Nous ne contrôlons pas ChatGPT ni les autres assistants.",
      },
      {
        question: "Pouvez-vous garantir d’apparaître dans ChatGPT ?",
        answer:
          "Non. Nous améliorons les signaux que l’entreprise contrôle : clarté, faits, pages explorables et crédibilité vérifiable.",
      },
    ],
  },
  "premium-site": {
    title: "Sites web et e-commerce",
    description:
      "Sites et boutiques sur mesure — clairs sur mobile, rapides, conçus pour transformer les visites en contacts ou en ventes.",
    details: "Du wireframe à la mise en ligne · CMS en option · SEO de base inclus",
    whatYouGet: [
      "Design et identité visuelle soignés",
      "Développement moderne, rapide et prêt pour la recherche",
      "Parcours de contact clairs, mobile d’abord",
      "CMS en option pour mettre à jour les contenus",
      "Mise en ligne et accompagnement après le lancement",
    ],
    pricingSectionTitle: "Formules site web",
    pricingFootnote: "Montants indicatifs « à partir de ». Le devis final dépend du périmètre.",
    pricingTiers: [
      { tierId: "starter", name: "Starter", detail: "Landing · 3–5 écrans · 1 langue." },
      { tierId: "business", name: "Business", detail: "6–10 pages · CMS · formulaires · PME et hôtellerie." },
      { tierId: "premium", name: "Premium", detail: "Site complet · multilingue · réservation." },
    ],
    faq: [
      {
        question: "Un beau site suffit-il pour obtenir des clients ?",
        answer:
          "Non. Il faut aussi un message clair, des parcours de contact simples et une mesure. Design, contenu et conversion vont ensemble.",
      },
    ],
  },
  "photo-video": {
    title: "Production vidéo",
    description:
      "Vidéo professionnelle pour raconter et valoriser votre activité — tournage, montage et formats prêts pour le site, les réseaux et les campagnes.",
    details: "Tournages sur place · Reels et promos · Exports web et social",
    whatYouGet: [
      "Brief avec liste de plans et calendrier",
      "Tournage vidéo professionnel (et photo si besoin)",
      "Montage : coupe, couleur, formats vertical et horizontal",
      "Supports adaptés à l’hôtellerie et à la restauration",
      "Fichiers prêts pour le hero du site, les Reels et les campagnes",
    ],
    portfolioLinkLabel2: "Portfolio vidéaste",
    pricingSectionTitle: "Formules vidéo (service autonome)",
    pricingFootnote:
      "Achetable seul ou avec un projet plus large. Le devis dépend du lieu, de la durée et des droits.",
    pricingTiers: [
      { tierId: "half-day", name: "Demi-journée", detail: "Jusqu’à 4 h · photo ou vidéo · montage de base." },
      { tierId: "full-day", name: "Journée", detail: "Journée complète · photo + vidéo · variantes." },
      { tierId: "retainer", name: "Mensuel", detail: "Sessions régulières pour le feed et les pubs." },
    ],
    faq: [
      {
        question: "Faut-il associer la vidéo au SEO ou à l’automatisation ?",
        answer:
          "Non. La production vidéo est un service autonome. Elle peut renforcer un projet plus large, sans être obligatoire.",
      },
      {
        question: "Quels types de vidéos réalisez-vous ?",
        answer:
          "Films promotionnels, contenus pour les réseaux et Reels, supports hôtellerie et restauration, montage pour le site et les campagnes — selon le brief réel.",
      },
    ],
  },
  "booking-flow": {
    title: "Automatisation des processus",
    description:
      "Réduisez le travail manuel et gérez mieux les demandes — réservations, formulaires, notifications et parcours qui ne se perdent plus dans les chats.",
    details: "Parcours · Intégrations · Formulaires · Suivi",
    whatYouGet: [
      "Analyse du parcours actuel de demande ou de réservation",
      "Automatisation des leads, alertes et relances essentielles",
      "Formulaires et appels à l’action orientés conversion",
      "Intégrations avec les outils déjà en place, lorsque c’est possible",
      "Rapport clair sur ce qui fonctionne",
    ],
    pricingSectionTitle: "Formules automatisation",
    pricingFootnote: "Compatible avec un site existant ou nouveau. Le prix dépend des intégrations.",
    pricingTiers: [
      { tierId: "single", name: "Un parcours", detail: "Une voie — réservation ou demande." },
      { tierId: "multi", name: "Plusieurs parcours", detail: "Plusieurs voies · intégration · CTA." },
      { tierId: "full", name: "Complet", detail: "Parcours de bout en bout · tests · rapport." },
    ],
    faq: [
      {
        question: "L’automatisation remplace-t-elle les personnes ?",
        answer:
          "Non. Nous automatisons les tâches répétitives et l’orientation des demandes. Les décisions importantes restent humaines lorsque c’est nécessaire.",
      },
    ],
  },
  "digital-growth": {
    title: "Croissance digitale et analytics",
    description:
      "Transformez plus de visiteurs en contacts et mesurez ce qui fonctionne — suivi, parcours de conversion et priorités fondées sur les données.",
    details: "Suivi · Conversions · Rapports · Améliorations ciblées",
    whatYouGet: [
      "Mise en place ou revue des analytics et des événements clés",
      "Analyse des frictions sur mobile et dans les formulaires",
      "Améliorations concrètes des CTA et des parcours de contact",
      "Rapports lisibles pour le dirigeant",
      "Feuille de route mensuelle lorsque le suivi est prévu au contrat",
    ],
    pricingSectionTitle: "Formules croissance",
    pricingFootnote:
      "Mise en place ou mensuel. Nous ne promettons pas un volume de leads sans mesure.",
    pricingTiers: [
      { tierId: "setup", name: "Mise en place", detail: "Événements clés · tableau simple · écarts." },
      { tierId: "monthly", name: "Mensuel", detail: "Suivi · priorités · ajustements de conversion." },
      { tierId: "full", name: "Complet", detail: "Croissance continue · tests · rapport détaillé." },
    ],
    faq: [
      {
        question: "Comment mesurez-vous les résultats ?",
        answer:
          "Avec des événements et des objectifs convenus : demandes, audits, clics e-mail, parcours clés. Nous privilégions les leads qualifiés au trafic seul.",
      },
    ],
  },
  "monthly-support": {
    title: "Entretien du site et support",
    description:
      "Mises à jour, petites évolutions et support prioritaire — pour que le site et les outils suivent le rythme de l’activité.",
    details: "Dès 2 h/mois · Priorité · Rapport mensuel",
    whatYouGet: [
      "Mises à jour techniques et de contenu",
      "Suivi de base des performances et de la disponibilité",
      "Petites améliorations de conversion",
      "Priorité sur les nouvelles demandes",
      "Rapport mensuel clair",
    ],
    pricingSectionTitle: "Formules de support",
    pricingFootnote: "Forfait mensuel. Les heures non utilisées ne sont pas reportées.",
    pricingTiers: [
      { tierId: "essential", name: "Essential", detail: "~2 h/mois · mises à jour · suivi de base." },
      { tierId: "growth", name: "Growth", detail: "~5 h/mois · optimisation · rapport." },
      { tierId: "priority", name: "Priority", detail: "~10 h/mois · priorité maximale · rapport détaillé." },
    ],
  },
  redesign: {
    title: "Upgrade et redesign",
    description:
      "Nous faisons évoluer une présence existante vers un système plus clair — structure, UX, performance et parcours de conversion.",
    details: "Audit · Stratégie · Mise en œuvre",
    whatYouGet: [
      "Audit du site actuel",
      "Nouvelle architecture et UX",
      "Identité visuelle mise à jour",
      "Migration des contenus sans pertes inutiles",
      "Mise en place du suivi analytics",
    ],
    pricingSectionTitle: "Formules redesign",
    pricingFootnote: "Le coût dépend de l’état du site, du nombre de pages et du niveau de personnalisation.",
    pricingTiers: [
      { tierId: "audit", name: "Audit seul", detail: "Analyse · rapport · feuille de route." },
      { tierId: "standard", name: "Standard", detail: "Écrans clés + mise en œuvre." },
      { tierId: "full", name: "Complet", detail: "Redesign total · migration · analytics." },
    ],
  },
};

export const deServicePatches: Record<string, Patch> = {
  visibility: {
    title: "Sichtbarkeit bei Google und KI",
    description:
      "Wir helfen Unternehmen, bei Google, Maps und in der KI-Suche gefunden zu werden — mit klaren Inhalten, lokaler Relevanz und einem stimmigen Unternehmensprofil, wo es passt.",
    details: "Lokales SEO · Google-Profil · KI-lesbare Inhalte · Keine Ranking-Garantie",
    whatYouGet: [
      "Analyse, wie Kunden Sie heute suchen",
      "Verbesserung der wichtigsten Seiten und der Struktur",
      "Hinweise zu Google Maps / Unternehmensprofil, sofern geeignet",
      "Klare, prüfbare Texte für Suche und KI",
      "Basis-Monitoring und Prioritäten",
    ],
    pricingSectionTitle: "Pakete Sichtbarkeit",
    pricingFootnote:
      "Richtwerte „ab“. Wir garantieren keine Google-Positionen und keine ChatGPT-Erwähnungen.",
    pricingTiers: [
      { tierId: "audit", name: "Sichtbarkeits-Audit", detail: "Ist-Stand · Chancen · Fahrplan." },
      { tierId: "local", name: "Lokal", detail: "Seiten + lokal · Profil · Kerninhalte." },
      { tierId: "ongoing", name: "Laufend", detail: "Monatliche Verbesserungen · kurzer Bericht." },
    ],
    faq: [
      {
        question: "Was umfasst Sichtbarkeit bei Google und KI?",
        answer:
          "Es geht um Auffindbarkeit: Struktur, klare Inhalte, lokale Relevanz und technische Zugänglichkeit. Wo sinnvoll, unterstützen wir auch das Google-Unternehmensprofil. ChatGPT und andere Assistenten steuern wir nicht.",
      },
      {
        question: "Können Sie ChatGPT-Erwähnungen garantieren?",
        answer:
          "Nein. Wir verbessern Signale, die das Unternehmen kontrolliert: Klarheit, Fakten, crawlbare Seiten und nachprüfbare Glaubwürdigkeit.",
      },
    ],
  },
  "premium-site": {
    title: "Websites und E-Commerce",
    description:
      "Websites und Shops nach Maß — auf dem Handy klar, schnell und darauf ausgelegt, Besuche in Anfragen oder Verkäufe zu verwandeln.",
    details: "Vom Wireframe bis live · CMS optional · Basis-SEO inklusive",
    whatYouGet: [
      "Gestaltung und visuelle Identität",
      "Moderne, schnelle, suchfreundliche Entwicklung",
      "Klare Kontaktwege, mobile zuerst",
      "Optionales CMS für Inhaltsupdates",
      "Launch und Betreuung nach dem Go-live",
    ],
    pricingSectionTitle: "Website-Pakete",
    pricingFootnote: "Richtwerte „ab“. Das Angebot hängt vom Umfang ab.",
    pricingTiers: [
      { tierId: "starter", name: "Starter", detail: "Landing · 3–5 Screens · 1 Sprache." },
      { tierId: "business", name: "Business", detail: "6–10 Seiten · CMS · Formulare · KMU und Hotellerie." },
      { tierId: "premium", name: "Premium", detail: "Komplette Website · mehrsprachig · Buchung." },
    ],
    faq: [
      {
        question: "Reicht eine schöne Website, um Kunden zu gewinnen?",
        answer:
          "Nein. Es braucht auch eine klare Botschaft, einfache Kontaktwege und Messung. Gestaltung, Inhalt und Conversion gehören zusammen.",
      },
    ],
  },
  "photo-video": {
    title: "Videoproduktion",
    description:
      "Professionelles Video, das Ihr Geschäft erzählt und aufwertet — Dreh, Schnitt und Formate für Website, Social Media und Kampagnen.",
    details: "Drehs vor Ort · Reels und Promos · Exporte für Web und Social",
    whatYouGet: [
      "Briefing mit Shotlist und Zeitplan",
      "Professioneller Videodreh (und Foto, wo nötig)",
      "Schnitt: Cut, Farbe, Hoch- und Querformat",
      "Material für Hotellerie und Gastronomie",
      "Dateien für Website-Hero, Reels und Kampagnen",
    ],
    portfolioLinkLabel2: "Portfolio Videograf",
    pricingSectionTitle: "Videopakete (eigenständige Leistung)",
    pricingFootnote:
      "Allein oder zusammen mit einem größeren Projekt. Der Preis hängt von Ort, Dauer und Nutzungsrechten ab.",
    pricingTiers: [
      { tierId: "half-day", name: "Halber Tag", detail: "Bis 4 Stunden · Foto oder Video · Basisschnitt." },
      { tierId: "full-day", name: "Ganzer Tag", detail: "Ganzer Tag · Foto + Video · Varianten." },
      { tierId: "retainer", name: "Monatlich", detail: "Wiederkehrende Drehs für Feed und Ads." },
    ],
    faq: [
      {
        question: "Muss Video mit SEO oder Automatisierung kombiniert werden?",
        answer:
          "Nein. Videoproduktion ist eine eigenständige Leistung. Sie kann ein größeres Projekt stärken, ist aber nicht Pflicht.",
      },
      {
        question: "Welche Videos produzieren Sie?",
        answer:
          "Werbefilme, Social- und Reel-Inhalte, Material für Hotellerie und Gastronomie sowie Schnitt für Website und Kampagnen — nach dem konkreten Briefing.",
      },
    ],
  },
  "booking-flow": {
    title: "Prozessautomatisierung",
    description:
      "Weniger Handarbeit und bessere Bearbeitung von Anfragen — Buchungen, Formulare, Benachrichtigungen und Abläufe, die nicht im Chat verloren gehen.",
    details: "Abläufe · Integrationen · Formulare · Reporting",
    whatYouGet: [
      "Analyse des aktuellen Anfrage- oder Buchungswegs",
      "Automatisierung von Leads, Hinweisen und wichtigen Nachfassaktionen",
      "Formulare und CTAs mit klarem Ziel",
      "Anbindung vorhandener Tools, wo das sinnvoll ist",
      "Klarer Bericht, was funktioniert",
    ],
    pricingSectionTitle: "Pakete Automatisierung",
    pricingFootnote: "Für bestehende oder neue Websites. Der Preis hängt von den Integrationen ab.",
    pricingTiers: [
      { tierId: "single", name: "Ein Ablauf", detail: "Ein Weg — Buchung oder Anfrage." },
      { tierId: "multi", name: "Mehrere Abläufe", detail: "Mehrere Wege · Integration · CTAs." },
      { tierId: "full", name: "Komplett", detail: "Gesamter Funnel · Tests · Bericht." },
    ],
    faq: [
      {
        question: "Ersetzt Automatisierung Menschen?",
        answer:
          "Nein. Wir automatisieren wiederkehrende Aufgaben und die Weiterleitung. Wichtige Entscheidungen bleiben menschlich, wo das nötig ist.",
      },
    ],
  },
  "digital-growth": {
    title: "Digitales Wachstum und Analytics",
    description:
      "Mehr Besucher zu Kontakten machen und messen, was wirkt — Tracking, Conversion-Wege und Prioritäten auf Basis von Daten.",
    details: "Tracking · Conversions · Berichte · gezielte Verbesserungen",
    whatYouGet: [
      "Einrichtung oder Prüfung von Analytics und Schlüsselereignissen",
      "Analyse von Reibung auf dem Handy und in Formularen",
      "Konkrete Verbesserungen an CTAs und Kontaktwegen",
      "Berichte, die für Inhaber lesbar sind",
      "Monatlicher Versuchsplan, wenn er beauftragt ist",
    ],
    pricingSectionTitle: "Pakete Wachstum",
    pricingFootnote: "Einrichtung oder monatlich. Ohne Messung versprechen wir keine Lead-Mengen.",
    pricingTiers: [
      { tierId: "setup", name: "Messung einrichten", detail: "Schlüsselereignisse · einfaches Dashboard · Lücken." },
      { tierId: "monthly", name: "Monatlich", detail: "Beobachtung · Prioritäten · Conversion-Anpassungen." },
      { tierId: "full", name: "Komplett", detail: "Laufendes Wachstum · Tests · ausführlicher Bericht." },
    ],
    faq: [
      {
        question: "Wie messen Sie Ergebnisse?",
        answer:
          "Mit vereinbarten Ereignissen und Zielen: Anfragen, Audits, E-Mail-Klicks, wichtige Wege. Qualifizierte Anfragen zählen mehr als reiner Traffic.",
      },
    ],
  },
  "monthly-support": {
    title: "Website-Pflege und Support",
    description:
      "Updates, kleine Weiterentwicklungen und priorisierter Support — damit Website und Systeme mit dem Geschäft Schritt halten.",
    details: "Ab 2 Std./Monat · Priorität · Monatsbericht",
    whatYouGet: [
      "Technische und inhaltliche Updates",
      "Basis-Monitoring von Performance und Erreichbarkeit",
      "Kleine Conversion-Verbesserungen",
      "Priorität bei neuen Anfragen",
      "Klarer Monatsbericht",
    ],
    pricingSectionTitle: "Support-Pläne",
    pricingFootnote: "Monatliche Pauschale. Nicht genutzte Stunden verfallen.",
    pricingTiers: [
      { tierId: "essential", name: "Essential", detail: "~2 Std./Monat · Updates · Basis-Monitoring." },
      { tierId: "growth", name: "Growth", detail: "~5 Std./Monat · Optimierung · Bericht." },
      { tierId: "priority", name: "Priority", detail: "~10 Std./Monat · höchste Priorität · ausführlicher Bericht." },
    ],
  },
  redesign: {
    title: "Upgrade und Redesign",
    description:
      "Wir bringen eine bestehende digitale Präsenz in ein klareres System — Struktur, UX, Performance und Conversion-Wege.",
    details: "Audit · Strategie · Umsetzung",
    whatYouGet: [
      "Audit der aktuellen Website",
      "Neue Architektur und UX",
      "Aktualisierte visuelle Identität",
      "Inhaltsmigration ohne unnötige Verluste",
      "Einrichtung von Analytics",
    ],
    pricingSectionTitle: "Redesign-Pakete",
    pricingFootnote: "Hängt vom Zustand der Website, der Seitenzahl und dem Grad der Anpassung ab.",
    pricingTiers: [
      { tierId: "audit", name: "Nur Audit", detail: "Analyse · Bericht · Fahrplan." },
      { tierId: "standard", name: "Standard", detail: "Wichtige Screens + Umsetzung." },
      { tierId: "full", name: "Komplett", detail: "Vollständiges Redesign · Migration · Analytics." },
    ],
  },
};

export const esServicePatches: Record<string, Patch> = {
  visibility: {
    title: "Visibilidad en Google e IA",
    description:
      "Ayudamos a las empresas a hacerse encontrar en Google, Maps y en las búsquedas con IA — con contenidos claros, presencia local y una ficha de negocio coherente cuando corresponde.",
    details: "SEO local · Ficha de Google · Contenido legible por IA · Sin garantía de posiciones",
    whatYouGet: [
      "Análisis de cómo te buscan hoy los clientes",
      "Mejora de las páginas clave y de la estructura del sitio",
      "Indicaciones para Google Maps / la ficha, si es elegible",
      "Textos claros y comprobables para buscadores y búsqueda con IA",
      "Seguimiento básico y prioridades de mejora",
    ],
    pricingSectionTitle: "Paquetes de visibilidad",
    pricingFootnote:
      "Importes orientativos «desde». No garantizamos posiciones en Google ni menciones en ChatGPT.",
    pricingTiers: [
      { tierId: "audit", name: "Auditoría de visibilidad", detail: "Estado actual · oportunidades · hoja de ruta." },
      { tierId: "local", name: "Local", detail: "Páginas + local · ficha · contenidos clave." },
      { tierId: "ongoing", name: "Continuo", detail: "Mejoras mensuales · informe sencillo." },
    ],
    faq: [
      {
        question: "¿Qué incluye la visibilidad en Google e IA?",
        answer:
          "Trabajamos la descubribilidad: estructura, contenidos claros, relevancia local y accesibilidad técnica. Cuando tiene sentido, también la ficha de Google. No controlamos ChatGPT ni otros asistentes.",
      },
      {
        question: "¿Podéis garantizar aparecer en ChatGPT?",
        answer:
          "No. Mejoramos las señales que la empresa controla: claridad, hechos, páginas rastreables y credibilidad comprobable.",
      },
    ],
  },
  "premium-site": {
    title: "Sitios web y e-commerce",
    description:
      "Sitios y tiendas a medida — claros en el móvil, rápidos y pensados para convertir visitas en contactos o ventas.",
    details: "Del wireframe a la publicación · CMS opcional · SEO base incluido",
    whatYouGet: [
      "Diseño e identidad visual cuidados",
      "Desarrollo moderno, rápido y preparado para la búsqueda",
      "Recorridos de contacto claros, mobile first",
      "CMS opcional para actualizar contenidos",
      "Publicación y soporte tras el lanzamiento",
    ],
    pricingSectionTitle: "Paquetes de sitio web",
    pricingFootnote: "Importes orientativos «desde». El presupuesto final depende del alcance.",
    pricingTiers: [
      { tierId: "starter", name: "Starter", detail: "Landing · 3–5 pantallas · 1 idioma." },
      { tierId: "business", name: "Business", detail: "6–10 páginas · CMS · formularios · pymes y hostelería." },
      { tierId: "premium", name: "Premium", detail: "Sitio completo · multilingüe · reservas." },
    ],
    faq: [
      {
        question: "¿Un sitio bonito basta para conseguir clientes?",
        answer:
          "No. También hace falta un mensaje claro, caminos de contacto simples y medición. Diseño, contenido y conversión van juntos.",
      },
    ],
  },
  "photo-video": {
    title: "Producción de vídeo",
    description:
      "Vídeo profesional para contar y valorizar tu actividad — rodaje, edición y formatos listos para la web, redes y campañas.",
    details: "Sesiones en local · Reels y promos · Exports para web y redes",
    whatYouGet: [
      "Brief con lista de planos y tiempos",
      "Rodaje de vídeo profesional (y foto cuando hace falta)",
      "Edición: corte, color, formatos vertical y horizontal",
      "Material para hostelería y restauración",
      "Archivos listos para el hero del sitio, Reels y campañas",
    ],
    portfolioLinkLabel2: "Portfolio del videógrafo",
    pricingSectionTitle: "Planes de vídeo (servicio independiente)",
    pricingFootnote:
      "Se puede contratar solo o junto con un proyecto más amplio. El precio depende de la localización, la duración y los derechos.",
    pricingTiers: [
      { tierId: "half-day", name: "Media jornada", detail: "Hasta 4 h · foto o vídeo · edición básica." },
      { tierId: "full-day", name: "Jornada", detail: "Día completo · foto + vídeo · variantes." },
      { tierId: "retainer", name: "Mensual", detail: "Sesiones recurrentes para el feed y los anuncios." },
    ],
    faq: [
      {
        question: "¿Hay que combinar el vídeo con SEO o automatización?",
        answer:
          "No. La producción de vídeo es un servicio independiente. Puede reforzar un proyecto más amplio, pero no es obligatoria.",
      },
      {
        question: "¿Qué tipos de vídeo realizáis?",
        answer:
          "Vídeos promocionales, contenidos para redes y Reels, material para hostelería y restauración, edición para la web y campañas — según el brief real.",
      },
    ],
  },
  "booking-flow": {
    title: "Automatización de procesos",
    description:
      "Reduce el trabajo manual y gestiona mejor las solicitudes — reservas, formularios, avisos y flujos que no se pierden en el chat.",
    details: "Flujos · Integraciones · Formularios · Informes",
    whatYouGet: [
      "Análisis del recorrido actual de solicitud o reserva",
      "Automatización de leads, avisos y seguimientos esenciales",
      "Formularios y CTA orientados a la conversión",
      "Integraciones con las herramientas que ya usas, cuando es viable",
      "Informe claro de lo que funciona",
    ],
    pricingSectionTitle: "Paquetes de automatización",
    pricingFootnote: "Compatible con sitios existentes o nuevos. El precio depende de las integraciones.",
    pricingTiers: [
      { tierId: "single", name: "Un flujo", detail: "Un camino — reserva o solicitud." },
      { tierId: "multi", name: "Varios flujos", detail: "Varios caminos · integración · CTA." },
      { tierId: "full", name: "Completo", detail: "Embudo de extremo a extremo · pruebas · informe." },
    ],
    faq: [
      {
        question: "¿La automatización sustituye a las personas?",
        answer:
          "No. Automatizamos tareas repetitivas y el enrutado de solicitudes. Las decisiones importantes siguen siendo humanas cuando hace falta.",
      },
    ],
  },
  "digital-growth": {
    title: "Crecimiento digital y analytics",
    description:
      "Convierte más visitas en contactos y mide qué funciona — tracking, recorridos de conversión y prioridades basadas en datos.",
    details: "Tracking · Conversiones · Informes · Mejoras concretas",
    whatYouGet: [
      "Configuración o revisión de analytics y eventos clave",
      "Análisis de fricción en móvil y formularios",
      "Mejoras concretas de CTA y caminos de contacto",
      "Informes comprensibles para el titular",
      "Hoja de ruta mensual cuando está contratada",
    ],
    pricingSectionTitle: "Paquetes de crecimiento",
    pricingFootnote: "Puesta en marcha o cuota mensual. No prometemos volumen de leads sin medición.",
    pricingTiers: [
      { tierId: "setup", name: "Puesta en marcha", detail: "Eventos clave · panel simple · huecos." },
      { tierId: "monthly", name: "Mensual", detail: "Seguimiento · prioridades · ajustes de conversión." },
      { tierId: "full", name: "Completo", detail: "Crecimiento continuo · pruebas · informe detallado." },
    ],
    faq: [
      {
        question: "¿Cómo medís los resultados?",
        answer:
          "Con eventos y objetivos acordados: solicitudes, auditorías, clics en el email, recorridos clave. Preferimos leads cualificados al tráfico por sí solo.",
      },
    ],
  },
  "monthly-support": {
    title: "Cuidado del sitio y soporte",
    description:
      "Actualizaciones, pequeñas mejoras y soporte prioritario — para que el sitio y los sistemas sigan el ritmo del negocio.",
    details: "Desde 2 h/mes · Prioridad · Informe mensual",
    whatYouGet: [
      "Actualizaciones técnicas y de contenido",
      "Monitorización básica de rendimiento y disponibilidad",
      "Pequeñas mejoras de conversión",
      "Prioridad en las nuevas solicitudes",
      "Informe mensual claro",
    ],
    pricingSectionTitle: "Planes de soporte",
    pricingFootnote: "Cuota mensual. Las horas no usadas no se acumulan.",
    pricingTiers: [
      { tierId: "essential", name: "Essential", detail: "~2 h/mes · actualizaciones · seguimiento básico." },
      { tierId: "growth", name: "Growth", detail: "~5 h/mes · optimización · informe." },
      { tierId: "priority", name: "Priority", detail: "~10 h/mes · máxima prioridad · informe detallado." },
    ],
  },
  redesign: {
    title: "Upgrade y redesign",
    description:
      "Llevamos una presencia digital existente a un sistema más claro — estructura, UX, rendimiento y caminos de conversión.",
    details: "Auditoría · Estrategia · Implementación",
    whatYouGet: [
      "Auditoría del sitio actual",
      "Nueva arquitectura y UX",
      "Identidad visual actualizada",
      "Migración de contenidos sin pérdidas innecesarias",
      "Configuración de analytics",
    ],
    pricingSectionTitle: "Paquetes de redesign",
    pricingFootnote: "El coste depende del estado del sitio, del número de páginas y del nivel de personalización.",
    pricingTiers: [
      { tierId: "audit", name: "Solo auditoría", detail: "Análisis · informe · hoja de ruta." },
      { tierId: "standard", name: "Standard", detail: "Pantallas clave + implementación." },
      { tierId: "full", name: "Completo", detail: "Redesign total · migración · analytics." },
    ],
  },
};
