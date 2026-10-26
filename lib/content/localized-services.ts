import type { Locale, LocalizedService } from "@/lib/translations";
import {
  deServicePatches,
  esServicePatches,
  frServicePatches,
} from "@/lib/content/service-locale-patches";

function applyPatches(
  base: LocalizedService[],
  patches: Record<string, Partial<LocalizedService>>,
): LocalizedService[] {
  return base.map((service) => ({ ...service, ...patches[service.id] }));
}

const it: LocalizedService[] = [
  {
    id: "visibility",
    title: "Visibilità su Google e AI",
    description:
      "Aiutiamo le aziende a farsi trovare su Google, Maps e nelle ricerche con AI — con contenuti chiari, presenza locale e una scheda attività coerente dove idonea.",
    details:
      "SEO locale · Scheda Google · Contenuti leggibili da AI · Nessuna garanzia di ranking",
    whatYouGet: [
      "Analisi di come i clienti ti cercano oggi online",
      "Ottimizzazione delle pagine chiave e della struttura del sito",
      "Indicazioni per Google Maps / scheda attività (se idonea)",
      "Testi chiari e fatti verificabili per motori e AI search",
      "Monitoraggio di base e priorità di miglioramento",
    ],
    pricingSectionTitle: "Pacchetti visibilità",
    pricingFootnote:
      "Importi indicativi «da». Non garantiamo posizioni su Google o menzioni in ChatGPT.",
    pricingTiers: [
      {
        tierId: "audit",
        name: "Audit visibilità",
        detail: "Stato attuale · opportunità · roadmap chiara.",
      },
      {
        tierId: "local",
        name: "Locale",
        detail: "On-page + locale · scheda attività · contenuti chiave.",
      },
      {
        tierId: "ongoing",
        name: "Continuo",
        detail: "Miglioramenti mensili · report semplice · priorità aggiornate.",
      },
    ],
    faq: [
      {
        question: "Cosa include la visibilità su Google e AI?",
        answer:
          "Lavoriamo su scopribilità: struttura del sito, contenuti chiari, rilevanza locale e accessibilità tecnica. Dove ha senso, supportiamo anche la scheda attività su Google. Non controlliamo le risposte di ChatGPT o di altri assistenti AI.",
      },
      {
        question: "Potete garantire di apparire in ChatGPT?",
        answer:
          "No. Nessuno studio serio può garantire ranking o raccomandazioni AI. Possiamo migliorare i segnali che un’azienda controlla: chiarezza, fatti, pagine crawlabili e reputazione verificabile.",
      },
    ],
  },
  {
    id: "premium-site",
    title: "Siti web e e-commerce",
    description:
      "Siti e shop su misura — chiari sul mobile, veloci e pensati per trasformare visite in contatti o vendite.",
    details: "Da wireframe a produzione · CMS opzionale · SEO di base incluso",
    whatYouGet: [
      "Design e identità visiva premium",
      "Sviluppo moderno, veloce e ottimizzato per la ricerca",
      "Mobile-first con percorsi di contatto chiari",
      "CMS opzionale per aggiornare i contenuti",
      "Lancio e supporto post-live incluso",
    ],
    pricingSectionTitle: "Pacchetti sito web",
    pricingFootnote:
      "Importi indicativi «da». Il preventivo finale dipende da pagine, integrazioni e tempistiche.",
    pricingTiers: [
      {
        tierId: "starter",
        name: "Starter",
        detail: "Landing · 3–5 schermate · 1 lingua · SEO di base.",
      },
      {
        tierId: "business",
        name: "Business",
        detail: "6–10 pagine · CMS · form · ideale per PMI e hospitality.",
      },
      {
        tierId: "premium",
        name: "Premium",
        detail: "Sito completo · multilingua · booking · massima conversione.",
      },
    ],
    faq: [
      {
        question: "Un sito bello basta per ottenere clienti?",
        answer:
          "No. Serve anche chiarezza sul messaggio, percorsi di contatto semplici e misurazione. Un sito efficace combina design, contenuto e conversione.",
      },
    ],
  },
  {
    id: "photo-video",
    title: "Produzione video",
    description:
      "Video professionali per raccontare e valorizzare la tua attività — riprese, editing e formati pronti per sito, social e campagne.",
    details: "Sessioni in location · Reels e promo · Export per web e social",
    whatYouGet: [
      "Brief con shot list e tempistiche chiare",
      "Riprese video professionali (e foto dove serve)",
      "Editing: taglio, colore, formati verticali e orizzontali",
      "Materiali per hotel, ristoranti e attività locali",
      "File pronti per hero del sito, Reels e campagne",
    ],
    portfolioUrl2: "https://levkaplan-video.framer.website",
    portfolioLinkLabel2: "Portfolio videografo",
    pricingSectionTitle: "Piani tariffari (servizio dedicato)",
    pricingFootnote:
      "Acquistabile da solo o insieme a sito e crescita digitale. Importi indicativi in base a location, durata e diritti.",
    pricingTiers: [
      {
        tierId: "half-day",
        name: "Half day",
        detail: "Fino a 4 ore · foto o video · editing base · menu e social.",
      },
      {
        tierId: "full-day",
        name: "Full day",
        detail: "Giornata intera · foto + video · più varianti per campagne e sito.",
      },
      {
        tierId: "retainer",
        name: "Retainer / mensile",
        detail: "Sessioni ricorrenti · continuità per feed e ads.",
      },
    ],
    faq: [
      {
        question: "Devo abbinare il video a SEO o automazione?",
        answer:
          "No. La produzione video è un servizio autonomo. Può rafforzare un progetto più ampio, ma non è obbligatorio.",
      },
      {
        question: "Che tipi di video realizzate?",
        answer:
          "Video promozionali, contenuti per social e Reels, materiali per hospitality e ristorazione, editing e post-produzione per sito e campagne — in base al brief reale.",
      },
    ],
  },
  {
    id: "booking-flow",
    title: "Automazione dei processi",
    description:
      "Riduci il lavoro manuale e gestisci meglio le richieste dei clienti — prenotazioni, form, notifiche e flussi che non si perdono in chat.",
    details: "Flussi · Integrazioni · Form intelligenti · Report",
    whatYouGet: [
      "Analisi del percorso attuale di richiesta o prenotazione",
      "Automazione di lead, notifiche e follow-up essenziali",
      "Form e CTA orientati alla conversione",
      "Integrazioni con strumenti già in uso dove fattibile",
      "Report chiaro su cosa funziona",
    ],
    pricingSectionTitle: "Pacchetti automazione",
    pricingFootnote:
      "Compatibile con siti esistenti o nuovi. Il prezzo dipende da integrazioni e complessità del flusso.",
    pricingTiers: [
      {
        tierId: "single",
        name: "Singolo flusso",
        detail: "Un percorso — prenotazione o richiesta · form + CTA.",
      },
      {
        tierId: "multi",
        name: "Multi-flusso",
        detail: "Più percorsi · integrazione · ottimizzazione CTA.",
      },
      {
        tierId: "full",
        name: "Completo",
        detail: "Funnel end-to-end · test · report sui risultati.",
      },
    ],
    faq: [
      {
        question: "L’automazione sostituisce le persone?",
        answer:
          "No. Automatizziamo compiti ripetitivi e l’instradamento delle richieste. Le decisioni importanti e il rapporto con il cliente restano umani dove serve.",
      },
    ],
  },
  {
    id: "digital-growth",
    title: "Crescita digitale e analytics",
    description:
      "Trasforma più visitatori in contatti e misura cosa funziona — tracking, percorsi di conversione e priorità basate sui dati.",
    details: "Tracking · Conversioni · Report · Miglioramenti mirati",
    whatYouGet: [
      "Setup o revisione di analytics e eventi chiave",
      "Analisi dei punti di attrito su mobile e form",
      "Miglioramenti concreti a CTA e percorsi di contatto",
      "Report comprensibili per il titolare",
      "Roadmap mensile di sperimentazione (dove contrattato)",
    ],
    pricingSectionTitle: "Pacchetti crescita",
    pricingFootnote:
      "Canone o setup una tantum. Non promettiamo volumi di lead senza misurazione.",
    pricingTiers: [
      {
        tierId: "setup",
        name: "Setup misurazione",
        detail: "Eventi chiave · dashboard semplice · gap analysis.",
      },
      {
        tierId: "monthly",
        name: "Mensile",
        detail: "Monitoraggio · priorità · piccoli interventi di conversione.",
      },
      {
        tierId: "full",
        name: "Full",
        detail: "Crescita continua · test · report dettagliato.",
      },
    ],
    faq: [
      {
        question: "Come misurate i risultati?",
        answer:
          "Con eventi e obiettivi concordati: richieste, audit, click su email, percorsi chiave. Preferiamo lead qualificati rispetto al solo traffico.",
      },
    ],
  },
  {
    id: "monthly-support",
    title: "Cura del sito e supporto",
    description:
      "Aggiornamenti, piccole evoluzioni e supporto prioritario — così il sito e i sistemi restano al passo del business.",
    details: "Da 2h/mese · Priorità · Report mensile",
    whatYouGet: [
      "Aggiornamenti tecnici e di contenuto",
      "Monitoraggio performance e uptime di base",
      "Piccole ottimizzazioni di conversione",
      "Priorità sulle nuove richieste",
      "Report mensile chiaro",
    ],
    pricingSectionTitle: "Piani di supporto",
    pricingFootnote:
      "Canone mensile. Ore non utilizzate non si accumulano — si rinnovano ogni mese.",
    pricingTiers: [
      {
        tierId: "essential",
        name: "Essential",
        detail: "~2 ore/mese · aggiornamenti · monitoraggio base.",
      },
      {
        tierId: "growth",
        name: "Growth",
        detail: "~5 ore/mese · ottimizzazione continua · report.",
      },
      {
        tierId: "priority",
        name: "Priority",
        detail: "~10 ore/mese · massima priorità · report dettagliato.",
      },
    ],
  },
  {
    id: "redesign",
    title: "Upgrade e redesign",
    description:
      "Portiamo la presenza digitale esistente a un sistema più chiaro — struttura, UX, performance e percorsi di conversione.",
    details: "Audit · Strategia · Implementazione",
    whatYouGet: [
      "Audit del sito attuale",
      "Nuova architettura e UX",
      "Identità visiva aggiornata",
      "Migrazione contenuti senza perdite inutili",
      "Setup analytics e tracking",
    ],
    pricingSectionTitle: "Pacchetti redesign",
    pricingFootnote:
      "Il costo dipende dallo stato del sito, dal numero di pagine e dal livello di personalizzazione.",
    pricingTiers: [
      {
        tierId: "audit",
        name: "Solo audit",
        detail: "Analisi · report · roadmap.",
      },
      {
        tierId: "standard",
        name: "Standard",
        detail: "Schermate chiave + implementazione.",
      },
      {
        tierId: "full",
        name: "Completo",
        detail: "Redesign totale · migrazione · analytics.",
      },
    ],
  },
];

const en: LocalizedService[] = [
  {
    id: "visibility",
    title: "Google & AI Visibility",
    description:
      "Help customers find you on Google, Maps and AI-powered search — with clear content, local relevance and a coherent business profile where eligible.",
    details: "Local SEO · Business profile · AI-readable content · No ranking guarantees",
    whatYouGet: [
      "Review of how customers search for you today",
      "On-page and structure improvements",
      "Guidance for Google Business Profile when eligible",
      "Clear, factual copy for search and AI retrieval",
      "Basic monitoring and improvement priorities",
    ],
    pricingSectionTitle: "Visibility packages",
    pricingFootnote:
      "Indicative “from” pricing. We do not guarantee Google rankings or ChatGPT mentions.",
    pricingTiers: [
      { tierId: "audit", name: "Visibility audit", detail: "Current state · opportunities · roadmap." },
      { tierId: "local", name: "Local", detail: "On-page + local · profile · key pages." },
      { tierId: "ongoing", name: "Ongoing", detail: "Monthly improvements · simple report." },
    ],
    faq: [
      {
        question: "What does Google & AI Visibility include?",
        answer:
          "Discoverability work: site structure, clear content, local relevance and technical accessibility. Where appropriate, Google Business Profile support. We do not control ChatGPT or other AI assistants.",
      },
      {
        question: "Can you guarantee ChatGPT mentions?",
        answer:
          "No. We improve signals you control — clarity, facts, crawlable pages and verifiable credibility.",
      },
    ],
  },
  {
    id: "premium-site",
    title: "Websites & e-commerce",
    description:
      "Custom sites and shops — mobile-clear, fast, and built to turn visits into enquiries or sales.",
    details: "Wireframe to production · Optional CMS · Baseline SEO included",
    whatYouGet: [
      "Premium visual design",
      "Modern, fast, search-ready development",
      "Mobile-first contact paths",
      "Optional CMS for content updates",
      "Launch and post-live support",
    ],
    pricingSectionTitle: "Website packages",
    pricingFootnote: "Indicative “from” amounts. Final quote depends on scope.",
    pricingTiers: [
      { tierId: "starter", name: "Starter", detail: "Landing · 3–5 screens · 1 language." },
      { tierId: "business", name: "Business", detail: "6–10 pages · CMS · forms · SMEs & hospitality." },
      { tierId: "premium", name: "Premium", detail: "Full site · multilingual · booking · conversion focus." },
    ],
    faq: [
      {
        question: "Is a beautiful site enough to win customers?",
        answer:
          "No. You also need a clear message, simple contact paths and measurement. Design, content and conversion work together.",
      },
    ],
  },
  {
    id: "photo-video",
    title: "Video production",
    description:
      "Professional video to tell and elevate your business — filming, editing and formats ready for website, social and campaigns.",
    details: "On-location sessions · Reels & promos · Web & social exports",
    whatYouGet: [
      "Brief with shot list and schedule",
      "Professional video filming (and photo when needed)",
      "Editing: cut, colour, vertical and horizontal formats",
      "Hospitality and restaurant-ready materials",
      "Files for site heroes, Reels and campaigns",
    ],
    portfolioUrl2: "https://levkaplan-video.framer.website",
    portfolioLinkLabel2: "Videographer portfolio",
    pricingSectionTitle: "Video packages (standalone)",
    pricingFootnote:
      "Available alone or with a wider project. Quoted by location, duration and usage rights.",
    pricingTiers: [
      { tierId: "half-day", name: "Half day", detail: "Up to 4h · photo or video · basic edit." },
      { tierId: "full-day", name: "Full day", detail: "Full day · photo + video · campaign variants." },
      { tierId: "retainer", name: "Retainer", detail: "Recurring sessions for feed and ads." },
    ],
    faq: [
      {
        question: "Do I need SEO or automation with video?",
        answer: "No. Video production is a standalone service. It can complement a larger project but is not required.",
      },
      {
        question: "What kinds of video do you produce?",
        answer:
          "Promotional films, social/Reels, hospitality and restaurant content, editing and post-production for sites and campaigns — based on a real brief.",
      },
    ],
  },
  {
    id: "booking-flow",
    title: "Business automation",
    description:
      "Reduce manual work and handle customer requests better — bookings, forms, notifications and flows that do not get lost in chat.",
    details: "Flows · Integrations · Smart forms · Reporting",
    whatYouGet: [
      "Review of your current enquiry or booking path",
      "Automation of leads, alerts and essential follow-ups",
      "Conversion-oriented forms and CTAs",
      "Integrations with tools you already use where feasible",
      "Clear reporting on what works",
    ],
    pricingSectionTitle: "Automation packages",
    pricingFootnote: "Works with existing or new sites. Price depends on integrations.",
    pricingTiers: [
      { tierId: "single", name: "Single flow", detail: "One path — booking or enquiry." },
      { tierId: "multi", name: "Multi-flow", detail: "Several paths · integration · CTA work." },
      { tierId: "full", name: "Full", detail: "End-to-end funnel · tests · results report." },
    ],
    faq: [
      {
        question: "Does automation replace people?",
        answer:
          "No. We automate repetitive tasks and routing. Important decisions and customer care stay human where needed.",
      },
    ],
  },
  {
    id: "digital-growth",
    title: "Digital growth & analytics",
    description:
      "Turn more visitors into contacts and measure what works — tracking, conversion paths and data-backed priorities.",
    details: "Tracking · Conversions · Reports · Focused improvements",
    whatYouGet: [
      "Analytics and key event setup or review",
      "Friction analysis on mobile and forms",
      "Concrete CTA and contact-path improvements",
      "Owner-friendly reporting",
      "Monthly experiment roadmap when contracted",
    ],
    pricingSectionTitle: "Growth packages",
    pricingFootnote: "Setup or monthly. We do not promise lead volume without measurement.",
    pricingTiers: [
      { tierId: "setup", name: "Measurement setup", detail: "Key events · simple dashboard · gaps." },
      { tierId: "monthly", name: "Monthly", detail: "Monitoring · priorities · conversion tweaks." },
      { tierId: "full", name: "Full", detail: "Ongoing growth · tests · detailed report." },
    ],
    faq: [
      {
        question: "How do you measure results?",
        answer:
          "Agreed events and goals: enquiries, audits, email clicks, key journeys. We prioritise qualified leads over vanity traffic.",
      },
    ],
  },
  {
    id: "monthly-support",
    title: "Website care & support",
    description:
      "Updates, small improvements and priority support — so your site and systems keep pace with the business.",
    details: "From 2h/month · Priority · Monthly report",
    whatYouGet: [
      "Technical and content updates",
      "Basic performance and uptime monitoring",
      "Small conversion improvements",
      "Priority on new requests",
      "Clear monthly report",
    ],
    pricingSectionTitle: "Support plans",
    pricingFootnote: "Monthly retainer. Unused hours do not roll over.",
    pricingTiers: [
      { tierId: "essential", name: "Essential", detail: "~2h/month · updates · basic monitoring." },
      { tierId: "growth", name: "Growth", detail: "~5h/month · ongoing optimisation · report." },
      { tierId: "priority", name: "Priority", detail: "~10h/month · highest priority · detailed report." },
    ],
  },
  {
    id: "redesign",
    title: "Systems upgrade & redesign",
    description:
      "Bring an existing digital presence into a clearer system — structure, UX, performance and conversion paths.",
    details: "Audit · Strategy · Implementation",
    whatYouGet: [
      "Audit of the current site",
      "New information architecture and UX",
      "Updated visual identity",
      "Content migration without unnecessary loss",
      "Analytics and tracking setup",
    ],
    pricingSectionTitle: "Redesign packages",
    pricingFootnote: "Depends on current state, page count and customisation.",
    pricingTiers: [
      { tierId: "audit", name: "Audit only", detail: "Analysis · report · roadmap." },
      { tierId: "standard", name: "Standard", detail: "Key screens + implementation." },
      { tierId: "full", name: "Full", detail: "Full redesign · migration · analytics." },
    ],
  },
];

const ru: LocalizedService[] = [
  {
    id: "visibility",
    title: "Видимость в Google и AI",
    description:
      "Помогаем бизнесу находиться в Google, Maps и AI-поиске — через понятный контент, локальную релевантность и согласованный профиль компании, где это уместно.",
    details: "Локальный SEO · Профиль Google · Контент для AI · Без гарантий позиций",
    whatYouGet: [
      "Разбор того, как вас ищут сегодня",
      "Улучшение ключевых страниц и структуры",
      "Рекомендации по Google Business Profile при eligibility",
      "Ясные проверяемые тексты для поиска и AI",
      "Базовый мониторинг и приоритеты",
    ],
    pricingSectionTitle: "Пакеты видимости",
    pricingFootnote: "Ориентировочные цены «от». Не гарантируем позиции в Google или упоминания в ChatGPT.",
    pricingTiers: [
      { tierId: "audit", name: "Аудит видимости", detail: "Состояние · возможности · roadmap." },
      { tierId: "local", name: "Local", detail: "On-page + local · профиль · ключевые страницы." },
      { tierId: "ongoing", name: "Ongoing", detail: "Ежемесячные улучшения · простой отчёт." },
    ],
    faq: [
      {
        question: "Что входит в видимость Google и AI?",
        answer:
          "Работа над находимостью: структура, ясный контент, локальная релевантность и техническая доступность. Мы не контролируем ответы ChatGPT.",
      },
      {
        question: "Можно ли гарантировать появление в ChatGPT?",
        answer: "Нет. Улучшаем то, что контролирует бизнес: факты, crawlable страницы и проверяемую репутацию.",
      },
    ],
  },
  {
    id: "premium-site",
    title: "Сайты и e-commerce",
    description: "Сайты и магазины под задачу — удобные на мобильных, быстрые и заточенные под заявки и продажи.",
    details: "От wireframe до продакшена · Опциональный CMS · Базовый SEO",
    whatYouGet: [
      "Премиальный визуальный дизайн",
      "Современная быстрая разработка",
      "Mobile-first пути к контакту",
      "Опциональный CMS",
      "Запуск и поддержка после релиза",
    ],
    pricingSectionTitle: "Пакеты сайта",
    pricingFootnote: "Ориентировочные суммы «от». Итоговая смета зависит от объёма.",
    pricingTiers: [
      { tierId: "starter", name: "Starter", detail: "Лендинг · 3–5 экранов · 1 язык." },
      { tierId: "business", name: "Business", detail: "6–10 страниц · CMS · формы." },
      { tierId: "premium", name: "Premium", detail: "Полный сайт · мультиязык · booking." },
    ],
    faq: [
      {
        question: "Достаточно ли красивого сайта?",
        answer: "Нет. Нужны ясное сообщение, простые контакты и измерение. Дизайн, контент и конверсия работают вместе.",
      },
    ],
  },
  {
    id: "photo-video",
    title: "Видеопродакшн",
    description:
      "Профессиональное видео, чтобы рассказать о бизнесе — съёмка, монтаж и форматы для сайта, соцсетей и кампаний.",
    details: "Съёмки на локации · Reels и промо · Экспорт для web и social",
    whatYouGet: [
      "Бриф со shot list и сроками",
      "Профессиональная видеосъёмка (и фото при необходимости)",
      "Монтаж: нарезка, цвет, вертикаль и горизонталь",
      "Материалы для hospitality и ресторанов",
      "Файлы для hero, Reels и кампаний",
    ],
    portfolioUrl2: "https://levkaplan-video.framer.website",
    portfolioLinkLabel2: "Портфолио видеографа",
    pricingSectionTitle: "Тарифы (отдельный сервис)",
    pricingFootnote: "Можно заказать отдельно. Цена зависит от локации, длительности и прав.",
    pricingTiers: [
      { tierId: "half-day", name: "Half day", detail: "До 4 ч · фото или видео · базовый монтаж." },
      { tierId: "full-day", name: "Full day", detail: "Полный день · фото + видео." },
      { tierId: "retainer", name: "Retainer", detail: "Регулярные сессии для ленты и ads." },
    ],
    faq: [
      {
        question: "Нужны ли SEO или автоматизация вместе с видео?",
        answer: "Нет. Видео — самостоятельный сервис. Может дополнять проект, но не обязательно.",
      },
      {
        question: "Какие видео вы делаете?",
        answer: "Промо, Reels/соцсети, hospitality и рестораны, монтаж для сайта и кампаний — по реальному брифу.",
      },
    ],
  },
  {
    id: "booking-flow",
    title: "Автоматизация процессов",
    description:
      "Меньше ручной работы и лучше обработка заявок — бронирования, формы, уведомления и потоки без потерь в чатах.",
    details: "Потоки · Интеграции · Умные формы · Отчёты",
    whatYouGet: [
      "Разбор текущего пути заявки или брони",
      "Автоматизация лидов и ключевых follow-up",
      "Формы и CTA на конверсию",
      "Интеграции с вашими инструментами где возможно",
      "Понятный отчёт",
    ],
    pricingSectionTitle: "Пакеты автоматизации",
    pricingFootnote: "Для существующих и новых сайтов. Цена зависит от интеграций.",
    pricingTiers: [
      { tierId: "single", name: "Один поток", detail: "Один путь — бронь или заявка." },
      { tierId: "multi", name: "Несколько потоков", detail: "Несколько путей · интеграции." },
      { tierId: "full", name: "Full", detail: "End-to-end · тесты · отчёт." },
    ],
    faq: [
      {
        question: "Автоматизация заменяет людей?",
        answer: "Нет. Автоматизируем рутину и маршрутизацию. Важные решения остаются за людьми.",
      },
    ],
  },
  {
    id: "digital-growth",
    title: "Цифровой рост и analytics",
    description:
      "Больше посетителей в контакты и понятная аналитика — трекинг, пути конверсии и приоритеты по данным.",
    details: "Трекинг · Конверсии · Отчёты · Точечные улучшения",
    whatYouGet: [
      "Настройка или ревизия analytics и ключевых событий",
      "Анализ трения на mobile и формах",
      "Улучшения CTA и контактных путей",
      "Отчёты для владельца бизнеса",
      "Ежемесячный roadmap экспериментов при договоре",
    ],
    pricingSectionTitle: "Пакеты роста",
    pricingFootnote: "Setup или ежемесячно. Не обещаем объём лидов без измерения.",
    pricingTiers: [
      { tierId: "setup", name: "Setup измерения", detail: "События · дашборд · gaps." },
      { tierId: "monthly", name: "Monthly", detail: "Мониторинг · приоритеты · правки." },
      { tierId: "full", name: "Full", detail: "Непрерывный рост · тесты · отчёт." },
    ],
    faq: [
      {
        question: "Как вы измеряете результат?",
        answer: "Согласованные события: заявки, аудит, клики по email, ключевые пути. Приоритет — квалифицированные лиды.",
      },
    ],
  },
  {
    id: "monthly-support",
    title: "Поддержка и уход за сайтом",
    description: "Обновления, мелкие улучшения и приоритетная поддержка — чтобы сайт и системы шли в ногу с бизнесом.",
    details: "От 2 ч/мес · Приоритет · Ежемесячный отчёт",
    whatYouGet: [
      "Технические и контентные обновления",
      "Базовый мониторинг",
      "Небольшие улучшения конверсии",
      "Приоритет новых запросов",
      "Понятный ежемесячный отчёт",
    ],
    pricingSectionTitle: "Планы поддержки",
    pricingFootnote: "Ежемесячный retainer. Неиспользованные часы не переносятся.",
    pricingTiers: [
      { tierId: "essential", name: "Essential", detail: "~2 ч/мес." },
      { tierId: "growth", name: "Growth", detail: "~5 ч/мес · отчёт." },
      { tierId: "priority", name: "Priority", detail: "~10 ч/мес · детальный отчёт." },
    ],
  },
  {
    id: "redesign",
    title: "Upgrade и redesign",
    description: "Приводим существующее цифровое присутствие к более ясной системе — структура, UX, скорость и конверсия.",
    details: "Аудит · Стратегия · Реализация",
    whatYouGet: [
      "Аудит текущего сайта",
      "Новая архитектура и UX",
      "Обновлённая визуальная идентичность",
      "Миграция контента",
      "Настройка analytics",
    ],
    pricingSectionTitle: "Пакеты redesign",
    pricingFootnote: "Зависит от состояния сайта и объёма.",
    pricingTiers: [
      { tierId: "audit", name: "Только аудит", detail: "Анализ · отчёт · roadmap." },
      { tierId: "standard", name: "Standard", detail: "Ключевые экраны + реализация." },
      { tierId: "full", name: "Full", detail: "Полный redesign · миграция · analytics." },
    ],
  },
];

const fr = applyPatches(en, frServicePatches);
const de = applyPatches(en, deServicePatches);
const es = applyPatches(en, esServicePatches);

export const localizedServices: Record<Locale, LocalizedService[]> = {
  it,
  en,
  fr,
  ru,
  de,
  es,
};
