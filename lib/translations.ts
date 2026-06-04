export type Locale = "it" | "en" | "fr" | "ru" | "de";

export interface LocalizedProject {
  id: string;
  name: string;
  /** Optional second line under the project name (smaller type). */
  nameTagline?: string;
  subtitle: string;
  problem: string;
  solution: string;
  businessImpact: string;
}

export interface LocalizedService {
  id: string;
  title: string;
  description: string;
  details: string;
  whatYouGet: string[];
  /** External portfolio (operator’s reel / Instagram / Vimeo, etc.) */
  portfolioUrl?: string;
  portfolioLinkLabel?: string;
  pricingSectionTitle?: string;
  pricingFootnote?: string;
  pricingTiers?: { name: string; detail: string }[];
}

export interface LocalizedProcessStep {
  id: string;
  title: string;
  /** Short comma-led line (compact “card” summary) */
  summary: string;
  description: string;
}

export interface TranslationSet {
  langName: string;
  langCode: string;
  projects: LocalizedProject[];
  services: LocalizedService[];
  process: LocalizedProcessStep[];
  nav: {
    work: string;
    services: string;
    process: string;
    contact: string;
    audit: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    subtitle: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    socialProof: string;
    mockupCaption: string;
    mockupCaptionSm?: true;
  };
  trust: string[];
  problem: {
    title: string;
    body: string;
  };
  caseStudies: {
    label: string;
    viewCaseStudy: string;
    fields: {
      problem: string;
      solution: string;
      businessImpact: string;
    };
  };
  beforeAfter: {
    eyebrow: string;
    title: string;
    subtitle: string;
    beforeBadge: string;
    afterBadge: string;
    dragHint: string;
    changesTitle: string;
    footerNote: string;
    cases: {
      tab: string;
      headline: string;
      changes: string[];
      beforeAlt: string;
      afterAlt: string;
    }[];
  };
  servicesLabel: string;
  processSection: {
    eyebrow: string;
    title: string;
    subtitle: string;
    stepLabel: string;
    footerNote: string;
  };
  impact: {
    label: string;
    items: { title: string; body: string; note: string }[];
  };
  audit: {
    title: string;
    body: string;
    cta: string;
    meta: string;
  };
  about: {
    eyebrow: string;
    title: string;
    bio: string;
    pills: string[];
  };
  contact: {
    label: string;
    title: string;
    body: string;
    emailLabel: string;
    whatsappLabel: string;
    availability: string;
    form: {
      name: string;
      business: string;
      businessType: string;
      brief: string;
      source: string;
      submit: string;
      submitting: string;
      success: string;
      options: {
        restaurant: string;
        hotel: string;
        bar: string;
        other: string;
        google: string;
        referral: string;
        social: string;
      };
      errors: {
        required: string;
      };
    };
  };
  footer: {
    description: string;
    links: string;
    location: string;
    status: string;
    privacy: string;
    built: string;
  };
  langSelector: {
    label: string;
  };
  servicePage: {
    backToHome: string;
    deliverables: string;
    howItWorks: string;
    viewService: string;
    otherServices: string;
    sectionEyebrow: string;
    pricingEyebrow: string;
  };
  workPage: {
    eyebrow: string;
    title: string;
    subtitle: string;
    viewAll: string;
    backToWork: string;
    visitLiveSite: string;
    liveStatus: string;
    techStack: string;
    overview: string;
    otherProjects: string;
  };
}

const it: TranslationSet = {
  langName: "Italiano",
  langCode: "IT",
  projects: [
    {
      id: "rockisland-rimini",
      name: "Porto Sole",
      subtitle: "Ristorante sul molo · Bar · Eventi · Dal 1993",
      problem:
        "Il sito non comunicava l'esperienza unica di cenare a 400 metri nel mare, l'atmosfera al tramonto e il calendario eventi con sufficiente chiarezza.",
      solution:
        "Storytelling cinematografico che guida il visitatore dal tramonto alla notte, con percorso di prenotazione chiaro e ottimizzato per mobile.",
      businessImpact:
        "Sito live che trasmette l'identita visiva di Porto Sole e converte i visitatori in prenotazioni dirette al primo sguardo.",
    },
    {
      id: "hotel-direct-booking",
      name: "Aurelia del Mar",
      nameTagline: "Hotel Direct Booking System",
      subtitle: "Hotel fronte mare a Benidorm con offerte di booking diretto",
      problem:
        "L'hotel aveva bisogno di un'esperienza di prenotazione diretta capace di comunicare posizione, camere, servizi e offerte senza rimandare gli ospiti alle OTA.",
      solution:
        "Sito hotel orientato alla conversione con hero immersiva, camere in evidenza, servizi, recensioni, pacchetti speciali e flusso di booking guidato.",
      businessImpact:
        "Prototipo live che posiziona Aurelia del Mar come soggiorno premium sul mare e offre agli ospiti un motivo chiaro per prenotare direttamente.",
    },
    {
      id: "premium-restaurant-local-concept",
      name: "Premium Restaurant Website",
      subtitle: "Pagina di conversione per ristorante locale",
      problem:
        "Un layout datato non valorizzava atmosfera, qualita del menu e percorso di prenotazione su mobile.",
      solution:
        "Linguaggio visivo editoriale, struttura reservation-first e prove chiare di qualita dell'esperienza.",
      businessImpact:
        "Esperienza che riduce la sensibilita al prezzo e aumenta le prenotazioni dirette in prima visita.",
    },
    {
      id: "student-marketplace-rimini",
      name: "Student Marketplace Rimini",
      subtitle: "Concept marketplace / dashboard partner",
      problem:
        "Studenti senza un luogo affidabile per le offerte locali, partner senza un modo leggero per pubblicarle.",
      solution:
        "Flusso mobile-first che bilancia scoperta, fiducia e semplicita di onboarding per entrambi i lati.",
      businessImpact:
        "Concept client-ready per un marketplace locale verticale, scalabile su nuove categorie.",
    },
    {
      id: "podlopuhom-jewelry",
      name: "Pod Lopuhom",
      nameTagline: "Gioielli artigianali",
      subtitle: "E-commerce per gioielli botanici in resina",
      problem:
        "L'artigiana riceveva ordini solo via DM, senza una vetrina chiara per presentare collezioni, prezzi e disponibilita a un pubblico internazionale.",
      solution:
        "Galleria multilingue (EN/RU/IT) con categorie chiare, dettaglio prodotto e CTA dirette su WhatsApp e Instagram per chiudere l'ordine.",
      businessImpact:
        "Sito live che ha trasformato un profilo social in un brand professionale, aumentando fiducia, ordini diretti e visibilita su nuovi mercati.",
    },
  ],
  services: [
    {
      id: "premium-site",
      title: "Sito Web Premium",
      description:
        "Design e sviluppo completo per ristoranti, hotel, bar. Mobile-first, veloce, ottimizzato per convertire.",
      details: "Da wireframe a produzione · CMS opzionale · SEO base incluso",
      whatYouGet: [
        "Design e identita visiva premium",
        "Sviluppo Next.js veloce e SEO-ready",
        "Mobile-first ottimizzato per conversione",
        "CMS opzionale per gestione contenuti",
        "Lancio e supporto post-live incluso",
      ],
    },
    {
      id: "redesign",
      title: "Redesign & Ottimizzazione",
      description:
        "Trasformiamo siti esistenti in asset digitali di qualita. Nuovo look, nuova struttura, nuovi risultati.",
      details: "Audit · Strategia · Implementazione",
      whatYouGet: [
        "Audit completo del sito attuale",
        "Nuova architettura informativa e UX",
        "Identita visiva aggiornata e premium",
        "Migrazione contenuti senza perdite",
        "Setup analytics e tracking",
      ],
    },
    {
      id: "booking-flow",
      title: "Booking & Lead Flow",
      description:
        "Costruiamo flussi di prenotazione diretta che riducono la dipendenza da OTA e aumentano le conversioni.",
      details: "Integrazione booking · Form intelligenti · A/B logic",
      whatYouGet: [
        "Analisi del funnel di prenotazione attuale",
        "Integrazione del sistema di booking",
        "Form intelligenti orientati alla conversione",
        "Test A/B su CTA e flussi chiave",
        "Report mensile sui risultati",
      ],
    },
    {
      id: "monthly-support",
      title: "Supporto Mensile",
      description:
        "Aggiornamenti, ottimizzazioni continue, supporto prioritario. Il tuo sito cresce con il tuo business.",
      details: "Da 2h/mese · Priorita garantita · Report mensile",
      whatYouGet: [
        "Aggiornamenti tecnici e di contenuto",
        "Monitoraggio performance e uptime",
        "Ottimizzazioni continue di conversione",
        "Priorita su nuove richieste",
        "Report mensile chiaro",
      ],
    },
    {
      id: "photo-video",
      title: "Foto & video con operatore professionista",
      description:
        "Riprese e post-produzione affidate a un operatore dedicato: food, interni, team e contenuti per social. Servizio separato dai progetti web, con piani tariffari dedicati.",
      details: "Sessioni in location · Audio dove serve · Export per sito e social",
      whatYouGet: [
        "Brief con shot list e tempistiche chiare",
        "Riprese foto e video con operatore professionista",
        "Editing (taglio, colore, formati verticali/orizzontali)",
        "Consegna file pronti per hero, menu digitali e campagne",
        "Licenza d'uso per marketing online (come da contratto)",
      ],
      portfolioUrl: "https://www.instagram.com/",
      portfolioLinkLabel: "Vedi i lavori dell'operatore",
      pricingSectionTitle: "Piani tariffari (servizio dedicato)",
      pricingFootnote:
        "Importi indicativi: si definiscono in preventivo in base a location, durata e diritti di utilizzo.",
      pricingTiers: [
        {
          name: "Half day",
          detail: "Fino a 4 ore · foto o video · selezione e editing base · ideale per menu e social.",
        },
        {
          name: "Full day",
          detail: "Giornata intera · foto + video · più varianti per campagne e sito.",
        },
        {
          name: "Retainer / mensile",
          detail: "Sessioni ricorrenti e calendario contenuti · continuità per feed e ads.",
        },
      ],
    },
  ],
  process: [
    {
      id: "understand",
      title: "Capire",
      summary: "Business, audience, obiettivi, problemi.",
      description:
        "Studiamo business, pubblico, obiettivi e criticità attuali, così da capire cosa deve fare davvero il sito.",
    },
    {
      id: "plan",
      title: "Pianificare",
      summary: "Struttura, flusso, funzionalità, priorità.",
      description:
        "Definiamo architettura, percorso utente e feature chiave in base alle esigenze specifiche del cliente.",
    },
    {
      id: "design",
      title: "Design",
      summary: "Stile del brand, chiarezza, fiducia, conversione.",
      description:
        "Creiamo una direzione visiva coerente con il brand, che genera fiducia e rende l’offerta immediatamente chiara.",
    },
    {
      id: "build",
      title: "Sviluppare",
      summary: "Sito responsive, integrazioni, performance.",
      description:
        "Sviluppiamo un sito reattivo, veloce e funzionale, con strumenti e integrazioni adeguate al caso.",
    },
    {
      id: "improve",
      title: "Migliorare",
      summary: "Test, lancio, feedback, ottimizzazione.",
      description:
        "Testiamo, lanciamo e raffiniamo il progetto in base a feedback, dati e esigenze future del business.",
    },
  ],
  nav: {
    work: "Lavori",
    services: "Servizi",
    process: "Processo",
    contact: "Contatti",
    audit: "Audit gratuito",
  },
  hero: {
    eyebrow: "Studio Digitale · Rimini, Italia",
    headline: "La prima impressione\ndel tuo business\ninizia qui.",
    subtitle: "Digital first impression for hospitality brands",
    lead: "Costruiamo esperienze digitali premium per ristoranti, hotel e brand dell'ospitalita che vogliono apparire come i migliori e ricevere prenotazioni dirette.",
    primaryCta: "Vedi i progetti",
    secondaryCta: "Richiedi audit gratuito",
    socialProof: "4 progetti · Rimini & Italia · Disponibile per nuovi clienti",
    mockupCaption: "Il tuo miglior biglietto da visita",
  },
  trust: [
    "Design che converte",
    "Focus su ospitalita e ristorazione",
    "Nessuna dipendenza da OTA",
    "Mobile-first & veloce",
  ],
  problem: {
    title:
      "Quasi tutti i business locali hanno un sito. Quasi nessuno ha una vera prima impressione digitale.",
    body: "La maggior parte dei siti locali non costruisce fiducia. Mostra informazioni, ma non comunica qualita. Nel frattempo le OTA trattengono commissioni tra il 15% e il 25%. Un sito premium orientato alla conversione puo ripagarsi in pochi mesi: per questo aiutiamo i business dell'ospitalita italiana a recuperare valore diretto.",
  },
  caseStudies: {
    label: "Lavori selezionati",
    viewCaseStudy: "Vedi il progetto",
    fields: {
      problem: "Problema",
      solution: "Soluzione",
      businessImpact: "Impatto business",
    },
  },
  beforeAfter: {
    eyebrow: "Mini confronti · primo schermo",
    title: "Cinque tipologie, stesso problema: confusione. Cinque direzioni ‘dopo’ — non sempre piu scuro.",
    subtitle:
      "Il miglioramento e gerarchia, messaggio e azione. Sotto scegli hotel, ristorante, bar, business locale o un layout su misura dal brief. Trascina il bordo dorato.",
    beforeBadge: "Prima",
    afterBadge: "Dopo",
    dragHint: "Trascina per confrontare",
    changesTitle: "In questo esempio, cosa migliora",
    footerNote:
      "Mockup illustrativi: palette e layout cambiano per settore. L’obiettivo e sempre chiarezza e conversione.",
    cases: [
      {
        tab: "Hotel",
        headline: "Da hero ‘tutto uguale’ a prenotazione leggibile anche su sfondo chiaro.",
        changes: [
          "Un CTA prenotazione dominante, secondari ridimensionati.",
          "Hero editoriale chiaro: testo grande, foto ordinata, micro-fiducia.",
          "Rimossi blocchi identici in basso: spazio per una sola promessa forte.",
          "Palette calda e premium senza dipendere dal tema scuro.",
        ],
        beforeAlt: "Mockup hotel template: gradiente stock, doppi CTA grigi, griglia generica.",
        afterAlt: "Mockup hotel dopo: layout chiaro crema/ambra, un bottone prenotazione, hero bilanciato.",
      },
      {
        tab: "Ristorante",
        headline: "Menu e tono cucina al centro — meno rumore visivo.",
        changes: [
          "Gerarchia menu / serata in evidenza rispetto al generico ‘benvenuto’.",
          "CTA unico (prenota tavolo / degustazione) con colore caldo coerente.",
          "Immagine food con cornice e respiro, non banda colorata casuale.",
          "Sezione fiducia sotto hero, non quattro box uguali.",
        ],
        beforeAlt: "Mockup ristorante template: fascia colorata, titolo debole, doppio bottone anonimo.",
        afterAlt: "Mockup ristorante dopo: palette calda, titolo forte, CTA terracotta, foto evidenziata.",
      },
      {
        tab: "Bar",
        headline: "Identita notturna senza ‘neon caos’: contrasto e un solo invito.",
        changes: [
          "Sfondo chiaro + tipografia nera forte per leggibilita immediata.",
          "Un solo CTA (lista / prenota) in colore accento, non due grigi.",
          "Immagine laterale ordinata invece di banda astratta piena schermo.",
          "Struttura da menu drink: rapida scansione, meno elementi pari peso.",
        ],
        beforeAlt: "Mockup bar template: banda astratta, testo centrale debole, blocchi gemelli.",
        afterAlt: "Mockup bar dopo: UI chiara, headline grande, CTA arancione, card laterale.",
      },
      {
        tab: "Locale",
        headline: "Da vetrina anonima a ‘perche scegliere noi’ in tre secondi.",
        changes: [
          "Titolo con promessa locale (orari, zona, servizio) in evidenza.",
          "Badge fiducia (recensioni, anni attivita) subito sotto hero.",
          "Griglia servizi sostituita da una riga leggibile + CTA contatto.",
          "Palette verde/bianca per sanita e vicinanza — non template grigio.",
        ],
        beforeAlt: "Mockup business locale: griglia di box identici senza messaggio.",
        afterAlt: "Mockup locale dopo: headline verde, CTA contatto, strip fiducia.",
      },
      {
        tab: "Su misura",
        headline: "Dal brief vuoto a moduli che raccontano il tuo brand.",
        changes: [
          "Struttura modulare (servizi / prove / CTA) adattabile al settore reale.",
          "Spazi per claim, numeri e testimonianze senza lorem infinito.",
          "Accenti oro leggeri sul bianco per continuita con il resto del sito.",
          "Pronto per contenuti reali: ogni blocco ha un ruolo chiaro.",
        ],
        beforeAlt: "Mockup generico lorem e tre bande grigie senza gerarchia.",
        afterAlt: "Mockup modulare su misura: card brand, griglia ordinata, contenitori definiti.",
      },
    ],
  },
  servicesLabel: "Cosa costruiamo",
  processSection: {
    eyebrow: "Processo",
    title: "Come trasformiamo un sito debole in un asset di business",
    subtitle:
      "Visuale, strategia e risultato in un unico metodo guidato dal business. Non solo design.",
    stepLabel: "Step",
    footerNote:
      "Ogni progetto è flessibile: processo, design e funzionalità si adattano alle esigenze reali di ogni cliente.",
  },
  impact: {
    label: "Perche conta",
    items: [
      {
        title: "Le OTA ti costano il 20%",
        body: "Un hotel che riceve 100.000EUR di prenotazioni annue paga fino a 20.000EUR in commissioni. Un sito diretto ben fatto puo recuperare buona parte di quella cifra nel primo anno.",
        note: "Dato medio di settore. I risultati variano.",
      },
      {
        title: "Il 70% dei clienti giudica un business dal sito",
        body: "Prima di entrare nel tuo ristorante, i clienti ti hanno gia giudicato online. Un sito scadente costa piu di quanto pensi.",
        note: "Fonte: Stanford Web Credibility Research.",
      },
      {
        title: "Un sito premium si ripaga",
        body: "Una singola prenotazione diretta in piu a settimana puo coprire l'intero investimento nel sito nel giro di pochi mesi.",
        note: "Stima indicativa basata su prezzi medi del settore.",
      },
    ],
  },
  audit: {
    title: "Vuoi sapere cosa frena il tuo sito?",
    body: "Analizziamo il tuo sito attuale e ti diciamo esattamente cosa migliorare. Gratuitamente, senza impegno.",
    cta: "Richiedi il tuo audit gratuito",
    meta: "Rispondiamo entro 24 ore · Nessun costo · Nessun impegno",
  },
  about: {
    eyebrow: "Chi siamo",
    title: "Design e sviluppo",
    bio: "Siamo un piccolo studio digitale basato a Rimini. Lavoriamo con ristoranti, hotel e brand locali che vogliono un sito che funziona davvero. Non solo bello, ma costruito per portare risultati concreti.\n\nNon lavoriamo con 30 clienti alla volta. Seguiamo pochi progetti, trattando ogni business come se fosse il nostro.",
    pills: ["Rimini, Italia", "Disponibile per nuovi progetti"],
  },
  contact: {
    label: "Iniziamo",
    title: "Costruiamo qualcosa che funziona.",
    body: "Dopo il tuo messaggio ricevi una risposta chiara con prossimi passi, tempistiche e fattibilita.",
    emailLabel: "Email",
    whatsappLabel: "WhatsApp · Rispondiamo entro 24h",
    availability: "Attualmente disponibile per nuovi clienti",
    form: {
      name: "Nome e cognome",
      business: "Nome del business",
      businessType: "Tipo di business",
      brief: "Descrivi brevemente cosa cerchi",
      source: "Come ci hai trovato?",
      submit: "Invia messaggio",
      submitting: "Invio in corso...",
      success: "Ricevuto. Ti rispondiamo entro 24 ore.",
      options: {
        restaurant: "Ristorante",
        hotel: "Hotel",
        bar: "Bar",
        other: "Altro",
        google: "Google",
        referral: "Passaparola",
        social: "Social",
      },
      errors: {
        required: "Campo obbligatorio",
      },
    },
  },
  footer: {
    description: "Studio digitale per hospitality e brand locali premium.",
    links: "Link rapidi",
    location: "Rimini, Italia",
    status: "Disponibile per nuovi clienti",
    privacy: "Privacy Policy",
    built: "Built with intention.",
  },
  langSelector: {
    label: "Lingua",
  },
  servicePage: {
    backToHome: "Torna alla home",
    deliverables: "Cosa include",
    howItWorks: "Come funziona",
    viewService: "Scopri il servizio",
    otherServices: "Altri servizi",
    sectionEyebrow: "Servizio",
    pricingEyebrow: "Tariffe",
  },
  workPage: {
    eyebrow: "Lavori",
    title: "Tutti i progetti",
    subtitle: "Una selezione di concept, prototipi e progetti pronti per il cliente.",
    viewAll: "Vedi tutti i lavori",
    backToWork: "Torna ai progetti",
    visitLiveSite: "Visita il sito",
    liveStatus: "Online",
    techStack: "Stack tecnico",
    overview: "Panoramica",
    otherProjects: "Altri progetti",
  },
};

const en: TranslationSet = {
  langName: "English",
  langCode: "EN",
  projects: [
    {
      id: "rockisland-rimini",
      name: "Porto Sole",
      subtitle: "Seaside restaurant & bar on the pier · Since 1993",
      problem:
        "The website failed to convey the unique experience of dining 400 metres into the Adriatic, the sunset atmosphere and event bookings with enough clarity.",
      solution:
        "Cinematic storytelling leading visitors from sunset to midnight, with a clear mobile-optimised booking journey.",
      businessImpact:
        "Live website that communicates Porto Sole's visual identity and converts visitors into direct reservations at first glance.",
    },
    {
      id: "hotel-direct-booking",
      name: "Aurelia del Mar",
      nameTagline: "Hotel Direct Booking System",
      subtitle: "Seafront hotel in Benidorm with direct-booking offers",
      problem:
        "The hotel needed a polished direct-booking experience that could communicate location, rooms, services and exclusive offers without sending guests back to OTA platforms.",
      solution:
        "A conversion-focused hotel website with immersive hero, room highlights, service sections, guest reviews, packages and a guided booking flow.",
      businessImpact:
        "Live prototype positions Aurelia del Mar as a premium seafront stay and gives guests a clear reason to book direct.",
    },
    {
      id: "premium-restaurant-local-concept",
      name: "Premium Restaurant Website",
      subtitle: "Local restaurant conversion page",
      problem:
        "Outdated layout failed to showcase atmosphere, menu value and the reservation path on mobile.",
      solution:
        "Editorial visual language, reservation-first structure and clear proof of experience quality.",
      businessImpact:
        "Experience that lowers price sensitivity and increases first-visit direct bookings.",
    },
    {
      id: "student-marketplace-rimini",
      name: "Student Marketplace Rimini",
      subtitle: "Marketplace / partner dashboard concept",
      problem:
        "Students lacked one trusted place to discover verified local discounts and partner offers.",
      solution:
        "Mobile-first flow balancing discovery, trust and onboarding simplicity for both sides of the marketplace.",
      businessImpact:
        "Client-ready concept for a local vertical marketplace, scalable to new categories.",
    },
    {
      id: "podlopuhom-jewelry",
      name: "Pod Lopuhom",
      nameTagline: "Handmade Jewelry",
      subtitle: "Botanical resin jewelry e-commerce",
      problem:
        "The artisan was taking orders only via DMs, with no proper showroom to present collections, pricing and availability to an international audience.",
      solution:
        "Multi-language gallery (EN/RU/IT) with clear categories, product detail and direct WhatsApp / Instagram CTAs to close the order.",
      businessImpact:
        "Live site that turned a social profile into a professional brand, increasing trust, direct orders and visibility on new markets.",
    },
  ],
  services: [
    {
      id: "premium-site",
      title: "Premium Website",
      description:
        "Full design and development for restaurants, hotels and bars. Mobile-first, fast, optimized to convert.",
      details: "From wireframe to launch · Optional CMS · Base SEO included",
      whatYouGet: [
        "Premium design and visual identity",
        "Fast, SEO-ready Next.js development",
        "Mobile-first optimized for conversion",
        "Optional CMS for content management",
        "Launch and post-live support included",
      ],
    },
    {
      id: "redesign",
      title: "Redesign & Optimization",
      description:
        "We turn existing sites into quality digital assets. New look, new structure, new results.",
      details: "Audit · Strategy · Implementation",
      whatYouGet: [
        "Full audit of your current site",
        "New information architecture and UX",
        "Updated, premium visual identity",
        "Content migration without loss",
        "Analytics and tracking setup",
      ],
    },
    {
      id: "booking-flow",
      title: "Booking & Lead Flow",
      description:
        "We build direct booking flows that reduce OTA dependency and increase conversion.",
      details: "Booking integration · Smart forms · A/B logic",
      whatYouGet: [
        "Analysis of your current booking funnel",
        "Booking system integration",
        "Smart conversion-oriented forms",
        "A/B testing on CTAs and key flows",
        "Monthly results report",
      ],
    },
    {
      id: "monthly-support",
      title: "Monthly Support",
      description:
        "Updates, continuous optimization, priority support. Your site grows with your business.",
      details: "From 2h/month · Priority guaranteed · Monthly report",
      whatYouGet: [
        "Technical and content updates",
        "Performance and uptime monitoring",
        "Continuous conversion optimization",
        "Priority on new requests",
        "Clear monthly report",
      ],
    },
    {
      id: "photo-video",
      title: "Photo & video with a professional operator",
      description:
        "Location shoots and post-production handled by a dedicated operator—food, interiors, team, and social-ready assets. Separate from web projects, with its own pricing tiers.",
      details: "On-location sessions · Audio when needed · Deliverables for web and social",
      whatYouGet: [
        "Creative brief and shot list aligned with your goals",
        "Professional photo and video capture",
        "Editing (cut, grade, vertical and horizontal formats)",
        "Files ready for hero sections, digital menus, and campaigns",
        "Usage rights for digital marketing (per agreement)",
      ],
      portfolioUrl: "https://www.instagram.com/",
      portfolioLinkLabel: "View the operator’s portfolio",
      pricingSectionTitle: "Pricing tiers (standalone service)",
      pricingFootnote:
        "Figures are quoted per brief depending on location, duration, and usage rights.",
      pricingTiers: [
        {
          name: "Half day",
          detail: "Up to 4 hours · photo or video · curated selects and base edit · ideal for menus and social.",
        },
        {
          name: "Full day",
          detail: "Full shoot day · photo + video · more variants for site and campaigns.",
        },
        {
          name: "Monthly retainer",
          detail: "Recurring shoots and a content cadence · continuity for feed and ads.",
        },
      ],
    },
  ],
  process: [
    {
      id: "understand",
      title: "Understand",
      summary: "Business, audience, goals, problems.",
      description:
        "We study the business, audience, goals, and current problems to understand what the website must achieve.",
    },
    {
      id: "plan",
      title: "Plan",
      summary: "Structure, flow, features, priorities.",
      description:
        "We define the structure, user flow, and key features based on the client’s specific needs.",
    },
    {
      id: "design",
      title: "Design",
      summary: "Brand style, clarity, trust, conversion.",
      description:
        "We create a visual direction that matches the brand, builds trust, and makes the offer clear.",
    },
    {
      id: "build",
      title: "Build",
      summary: "Responsive website, integrations, performance.",
      description:
        "We develop a responsive, fast, and functional website with the right tools and integrations.",
    },
    {
      id: "improve",
      title: "Improve",
      summary: "Testing, launch, feedback, optimization.",
      description:
        "We test, launch, and refine the project based on feedback, data, and future business needs.",
    },
  ],
  nav: {
    work: "Work",
    services: "Services",
    process: "Process",
    contact: "Contact",
    audit: "Free audit",
  },
  hero: {
    eyebrow: "Digital Studio · Rimini, Italy",
    headline: "Your business\nfirst impression\nstarts here.",
    subtitle: "Digital first impression for hospitality brands",
    lead: "We build premium digital experiences for restaurants, hotels and hospitality brands that want to look like the best and get booked like it.",
    primaryCta: "View projects",
    secondaryCta: "Request free audit",
    socialProof: "4 projects · Rimini & Italy · Available for new clients",
    mockupCaption: "Your best business card",
  },
  trust: [
    "Design that converts",
    "Hospitality and dining focus",
    "Less OTA dependency",
    "Mobile-first & fast",
  ],
  problem: {
    title:
      "Most local businesses have a website. Almost none of them have a digital first impression.",
    body: "Most local sites don't build trust. They display information but don't communicate quality. Meanwhile OTAs keep 15% to 25% in commissions. A premium, conversion-focused site can pay for itself within a few months. That's why we help Italian hospitality businesses recover direct value.",
  },
  caseStudies: {
    label: "Selected work",
    viewCaseStudy: "View case study",
    fields: {
      problem: "Problem",
      solution: "Solution",
      businessImpact: "Business impact",
    },
  },
  beforeAfter: {
    eyebrow: "Quick comparisons · first screen",
    title: "Five segments, same issue: clutter. Five ‘after’ directions — darker is not the goal.",
    subtitle:
      "Improvement is hierarchy, message and action. Pick hotel, restaurant, bar, local business or a brief-led layout. Drag the gold divider.",
    beforeBadge: "Before",
    afterBadge: "After",
    dragHint: "Drag to compare",
    changesTitle: "In this example, what improves",
    footerNote:
      "Illustrative mockups: palette and layout shift by sector. The goal is always clarity and conversion.",
    cases: [
      {
        tab: "Hotel",
        headline: "From a ‘everything looks the same’ hero to a readable booking path — even on a light UI.",
        changes: [
          "One dominant booking CTA; secondary actions visually downgraded.",
          "Clear editorial hero: large type, tidy photo, micro-trust.",
          "Removed identical bottom tiles: room for one strong promise.",
          "Warm premium palette without relying on a dark theme.",
        ],
        beforeAlt: "Generic hotel template: stock gradient, twin grey CTAs, bland grid.",
        afterAlt: "Hotel after: warm cream layout, single amber booking button, balanced hero.",
      },
      {
        tab: "Restaurant",
        headline: "Menu and kitchen tone first — less visual noise.",
        changes: [
          "Menu / evening focus beats a generic ‘welcome’ wall.",
          "Single CTA (book / tasting) with a coherent warm accent.",
          "Food image framed with breathing room, not a random color band.",
          "Trust strip under the hero instead of four equal boxes.",
        ],
        beforeAlt: "Restaurant template: loud band, weak title, two anonymous buttons.",
        afterAlt: "Restaurant after: warm palette, strong headline, terracotta CTA, featured photo.",
      },
      {
        tab: "Bar",
        headline: "Nightlife identity without neon chaos: contrast and one invitation.",
        changes: [
          "Light UI + bold black type for instant readability.",
          "One accent CTA (list / reserve), not two grey twins.",
          "Side visual card instead of a full-width abstract band.",
          "Structure tuned for quick scanning like a drinks menu.",
        ],
        beforeAlt: "Bar template: abstract band, weak centered copy, twin blocks.",
        afterAlt: "Bar after: clean light UI, big headline, orange CTA, side card.",
      },
      {
        tab: "Local",
        headline: "From anonymous showcase to ‘why choose us’ in three seconds.",
        changes: [
          "Headline with a local promise (hours, area, service) upfront.",
          "Trust badges (reviews, years) directly under the hero.",
          "Readable service row + contact CTA instead of identical tiles.",
          "Fresh green/white palette for proximity and hygiene — not grey template.",
        ],
        beforeAlt: "Local business: identical boxes with no clear message.",
        afterAlt: "Local after: green headline, contact CTA, trust strip.",
      },
      {
        tab: "Custom",
        headline: "From an empty brief to modules that carry your brand.",
        changes: [
          "Modular structure (services / proof / CTA) adaptable to the real sector.",
          "Slots for claims, numbers and quotes without endless lorem.",
          "Light gold accents on white for continuity with the rest of the site.",
          "Ready for real content: every block has a clear role.",
        ],
        beforeAlt: "Generic lorem and three grey bands with no hierarchy.",
        afterAlt: "Brief-led modular layout: brand cards, tidy grid, defined containers.",
      },
    ],
  },
  servicesLabel: "What we build",
  processSection: {
    eyebrow: "Process",
    title: "How we turn a weak website into a business asset",
    subtitle:
      "Visual, strategy and outcome in a single business-driven method. Not just design.",
    stepLabel: "Step",
    footerNote:
      "Every project is flexible — the process, design, and functionality are customized around the real needs of each client.",
  },
  impact: {
    label: "Why it matters",
    items: [
      {
        title: "OTAs cost you 20%",
        body: "A hotel doing 100,000EUR in annual bookings pays up to 20,000EUR in commissions. A well-built direct site can recover a meaningful share of that in the first year.",
        note: "Industry average. Results vary.",
      },
      {
        title: "70% of customers judge a business by its website",
        body: "Before stepping into your restaurant, customers have already judged you online. A weak site costs more than you think.",
        note: "Source: Stanford Web Credibility Research.",
      },
      {
        title: "A premium site pays for itself",
        body: "A single extra direct booking per week can cover the entire site investment within a few months.",
        note: "Indicative estimate based on industry averages.",
      },
    ],
  },
  audit: {
    title: "Want to know what's holding your site back?",
    body: "We analyze your current website and tell you exactly what to improve. Free of charge, no commitment.",
    cta: "Request your free audit",
    meta: "Reply within 24 hours · Free · No commitment",
  },
  about: {
    eyebrow: "About us",
    title: "Design & development",
    bio: "We're a small digital studio based in Rimini. We work with restaurants, hotels and local brands that want a site that actually works. Not just pretty, but built to bring real business results.\n\nWe don't work with 30 clients at a time. We take a few projects and treat every business as if it were our own.",
    pills: ["Rimini, Italy", "Available for new projects"],
  },
  contact: {
    label: "Let's start",
    title: "Let's build something that works.",
    body: "After your message you get a clear reply with next steps, timeline and feasibility.",
    emailLabel: "Email",
    whatsappLabel: "WhatsApp · Reply within 24h",
    availability: "Currently available for new clients",
    form: {
      name: "Full name",
      business: "Business name",
      businessType: "Business type",
      brief: "Briefly describe what you're looking for",
      source: "How did you find us?",
      submit: "Send message",
      submitting: "Sending...",
      success: "Got it. We'll reply within 24 hours.",
      options: {
        restaurant: "Restaurant",
        hotel: "Hotel",
        bar: "Bar",
        other: "Other",
        google: "Google",
        referral: "Word of mouth",
        social: "Social",
      },
      errors: {
        required: "Required field",
      },
    },
  },
  footer: {
    description: "Digital studio for premium hospitality and local brands.",
    links: "Quick links",
    location: "Rimini, Italy",
    status: "Available for new clients",
    privacy: "Privacy Policy",
    built: "Built with intention.",
  },
  langSelector: {
    label: "Language",
  },
  servicePage: {
    backToHome: "Back to home",
    deliverables: "What's included",
    howItWorks: "How it works",
    viewService: "Explore service",
    otherServices: "Other services",
    sectionEyebrow: "Service",
    pricingEyebrow: "Pricing",
  },
  workPage: {
    eyebrow: "Work",
    title: "All projects",
    subtitle: "A selection of concepts, prototypes and client-ready projects.",
    viewAll: "View all work",
    backToWork: "Back to projects",
    visitLiveSite: "Visit live site",
    liveStatus: "Live",
    techStack: "Tech stack",
    overview: "Overview",
    otherProjects: "Other projects",
  },
};

const fr: TranslationSet = {
  langName: "Francais",
  langCode: "FR",
  projects: [
    {
      id: "rockisland-rimini",
      name: "Porto Sole",
      subtitle: "Restaurant & bar sur la jetee · Depuis 1993",
      problem:
        "Le site ne communiquait pas l'experience unique de diner a 400 metres en mer, l'ambiance du coucher de soleil et la reservation d'evenements avec assez de clarte.",
      solution:
        "Storytelling cinematographique guidant les visiteurs du coucher de soleil a la nuit, avec un parcours de reservation clair optimise pour mobile.",
      businessImpact:
        "Site live qui transmet l'identite visuelle de Porto Sole et convertit les visiteurs en reservations directes des le premier coup d'oeil.",
    },
    {
      id: "hotel-direct-booking",
      name: "Aurelia del Mar",
      nameTagline: "Hotel Direct Booking System",
      subtitle: "Hotel en bord de mer a Benidorm avec offres de reservation directe",
      problem:
        "L'hotel avait besoin d'une experience de reservation directe capable de presenter emplacement, chambres, services et offres exclusives sans renvoyer les clients vers les OTA.",
      solution:
        "Site hotelier oriente conversion avec hero immersive, chambres mises en avant, services, avis clients, forfaits et parcours de booking guide.",
      businessImpact:
        "Prototype live qui positionne Aurelia del Mar comme sejour premium en bord de mer et donne aux clients une raison claire de reserver en direct.",
    },
    {
      id: "premium-restaurant-local-concept",
      name: "Premium Restaurant Website",
      subtitle: "Page de conversion pour restaurant local",
      problem:
        "Un layout depasse ne mettait pas en valeur atmosphere, qualite du menu et parcours de reservation sur mobile.",
      solution:
        "Langage visuel editorial, structure centree reservation et preuves claires de la qualite de l'experience.",
      businessImpact:
        "Une experience qui reduit la sensibilite au prix et augmente les reservations directes des la premiere visite.",
    },
    {
      id: "student-marketplace-rimini",
      name: "Student Marketplace Rimini",
      subtitle: "Concept marketplace / dashboard partenaire",
      problem:
        "Les etudiants n'avaient pas un lieu fiable pour decouvrir les remises locales verifiees et les offres partenaires.",
      solution:
        "Flux mobile-first equilibrant decouverte, confiance et simplicite d'onboarding des deux cotes du marketplace.",
      businessImpact:
        "Concept pret pour le client pour un marketplace local vertical, scalable a de nouvelles categories.",
    },
    {
      id: "podlopuhom-jewelry",
      name: "Pod Lopuhom",
      nameTagline: "Bijoux faits main",
      subtitle: "E-commerce de bijoux botaniques en resine",
      problem:
        "L'artisane prenait les commandes uniquement par messages, sans vitrine claire pour presenter collections, prix et disponibilites a un public international.",
      solution:
        "Galerie multilingue (EN/RU/IT) avec categories claires, fiche produit et CTA directs vers WhatsApp et Instagram pour finaliser la commande.",
      businessImpact:
        "Site live qui a transforme un profil social en marque professionnelle, en augmentant la confiance, les commandes directes et la visibilite sur de nouveaux marches.",
    },
  ],
  services: [
    {
      id: "premium-site",
      title: "Site Web Premium",
      description:
        "Design et developpement complets pour restaurants, hotels, bars. Mobile-first, rapide, optimise pour la conversion.",
      details: "Du wireframe a la production · CMS optionnel · SEO de base inclus",
      whatYouGet: [
        "Design et identite visuelle premium",
        "Developpement Next.js rapide et SEO-ready",
        "Mobile-first optimise pour la conversion",
        "CMS optionnel pour la gestion de contenu",
        "Lancement et support post-live inclus",
      ],
    },
    {
      id: "redesign",
      title: "Redesign et Optimisation",
      description:
        "Nous transformons des sites existants en actifs digitaux de qualite. Nouveau look, nouvelle structure, nouveaux resultats.",
      details: "Audit · Strategie · Implementation",
      whatYouGet: [
        "Audit complet du site actuel",
        "Nouvelle architecture de l'information",
        "Identite visuelle mise a jour, premium",
        "Migration de contenu sans perte",
        "Configuration analytics et tracking",
      ],
    },
    {
      id: "booking-flow",
      title: "Booking et Lead Flow",
      description:
        "Nous construisons des flux de reservation directe qui reduisent la dependance aux OTA et augmentent les conversions.",
      details: "Integration booking · Formulaires intelligents · Logique A/B",
      whatYouGet: [
        "Analyse du funnel de booking actuel",
        "Integration du systeme de booking",
        "Formulaires intelligents orientes conversion",
        "A/B testing sur CTAs et flux cles",
        "Rapport mensuel des resultats",
      ],
    },
    {
      id: "monthly-support",
      title: "Support Mensuel",
      description:
        "Mises a jour, optimisations continues, support prioritaire. Votre site evolue avec votre business.",
      details: "A partir de 2h/mois · Priorite garantie · Rapport mensuel",
      whatYouGet: [
        "Mises a jour techniques et de contenu",
        "Monitoring performance et uptime",
        "Optimisations continues de conversion",
        "Priorite sur les nouvelles demandes",
        "Rapport mensuel clair",
      ],
    },
    {
      id: "photo-video",
      title: "Photo & video avec operateur professionnel",
      description:
        "Prises de vue et post-production avec un operateur dedie : platings, lieux, equipe et contenus social. Service distinct des projets web, avec grilles tarifaires dediees.",
      details: "Seances sur site · Audio si besoin · Livrables web et social",
      whatYouGet: [
        "Brief creatif et liste de plans",
        "Prises de vue photo et video professionnelles",
        "Montage (decoupage, etalonnage, formats)",
        "Fichiers prets pour hero, menus digitaux et campagnes",
        "Droits d utilisation marketing digital (selon contrat)",
      ],
      portfolioUrl: "https://www.instagram.com/",
      portfolioLinkLabel: "Voir les travaux de l'operateur",
      pricingSectionTitle: "Grilles tarifaires (service autonome)",
      pricingFootnote:
        "Montants indicatifs : devis selon lieu, duree et droits d exploitation.",
      pricingTiers: [
        {
          name: "Demi-journee",
          detail: "Jusqu a 4h · photo ou video · selection et montage de base.",
        },
        {
          name: "Journee complete",
          detail: "Journee pleine · photo + video · variantes pour site et campagnes.",
        },
        {
          name: "Forfait mensuel",
          detail: "Seances recurrentes et planning contenus · continuite feed et pubs.",
        },
      ],
    },
  ],
  process: [
    {
      id: "understand",
      title: "Comprendre",
      summary: "Business, audience, objectifs, freins.",
      description:
        "Nous etudions le business, le public, les objectifs et les problemes actuels pour definir ce que le site doit accomplir.",
    },
    {
      id: "plan",
      title: "Planifier",
      summary: "Structure, parcours, fonctionnalites, priorites.",
      description:
        "Nous definissons la structure, le flux utilisateur et les fonctionnalites cles selon les besoins reels du client.",
    },
    {
      id: "design",
      title: "Design",
      summary: "Style de marque, clarte, confiance, conversion.",
      description:
        "Nous creons une direction visuelle alignee sur la marque qui inspire confiance et rend l offre limpide.",
    },
    {
      id: "build",
      title: "Construire",
      summary: "Site responsive, integrations, performance.",
      description:
        "Nous developpons un site reactif, rapide et fonctionnel, avec les bons outils et integrations.",
    },
    {
      id: "improve",
      title: "Ameliorer",
      summary: "Tests, lancement, feedback, optimisation.",
      description:
        "Nous testons, lancons et affinons le projet selon les retours, les donnees et les besoins futurs.",
    },
  ],
  nav: {
    work: "Projets",
    services: "Services",
    process: "Methode",
    contact: "Contact",
    audit: "Audit gratuit",
  },
  hero: {
    eyebrow: "Studio Digital · Rimini, Italie",
    headline: "La premiere impression\nde votre business\ncommence ici.",
    subtitle: "Premiere impression digitale pour l'hospitalite",
    lead: "Nous concevons des experiences digitales premium pour restaurants, hotels et marques de l'hospitalite qui veulent paraitre au sommet et etre reserves comme tels.",
    primaryCta: "Voir les projets",
    secondaryCta: "Demander un audit",
    socialProof: "4 projets · Rimini & Italie · Disponible pour nouveaux clients",
    mockupCaption: "Votre meilleure carte de visite",
  },
  trust: [
    "Design qui convertit",
    "Focus hospitalite et restauration",
    "Moins de dependance aux OTA",
    "Mobile-first et rapide",
  ],
  problem: {
    title:
      "Presque tous les business locaux ont un site. Presque aucun n'a une vraie premiere impression digitale.",
    body: "La majorite des sites locaux n'inspire pas confiance. Ils montrent des infos mais ne communiquent pas la qualite. Les OTA prennent entre 15% et 25% de commission. Un site premium oriente conversion peut s'amortir en quelques mois. C'est pourquoi nous aidons les business de l'hospitalite italienne a recuperer de la valeur en direct.",
  },
  caseStudies: {
    label: "Projets selectionnes",
    viewCaseStudy: "Voir le projet",
    fields: {
      problem: "Probleme",
      solution: "Solution",
      businessImpact: "Impact business",
    },
  },
  beforeAfter: {
    eyebrow: "Mini-comparaisons · premier écran",
    title: "Cinq segments, même problème : le flou. Cinq directions ‘après’ — pas toujours plus sombre.",
    subtitle:
      "Le progrès, c’est hiérarchie, message et action. Choisissez hôtel, restaurant, bar, commerce local ou une mise en page pilotée par le brief. Glissez la ligne dorée.",
    beforeBadge: "Avant",
    afterBadge: "Après",
    dragHint: "Glisser pour comparer",
    changesTitle: "Dans cet exemple, qu’est-ce qui s’améliore",
    footerNote:
      "Maquettes illustratives : palette et composition varient selon le secteur. L’objectif reste clarté et conversion.",
    cases: [
      {
        tab: "Hôtel",
        headline: "D’un hero ‘tout pareil’ à une réservation lisible — même sur fond clair.",
        changes: [
          "Un CTA réservation dominant, actions secondaires visuellement réduites.",
          "Hero éditorial clair : gros texte, photo rangée, micro-confiance.",
          "Blocs identiques en bas retirés : place pour une promesse forte.",
          "Palette chaude premium sans dépendre du mode sombre.",
        ],
        beforeAlt: "Template hôtel : dégradé stock, doubles CTA gris, grille générique.",
        afterAlt: "Après hôtel : UI claire crème/ambre, un bouton réservation, hero équilibré.",
      },
      {
        tab: "Restaurant",
        headline: "Menu et tonalité cuisine au centre — moins de bruit visuel.",
        changes: [
          "Hiérarchie menu / soirée avant le ‘bienvenue’ générique.",
          "Un seul CTA (réserver / dégustation) avec une couleur chaude cohérente.",
          "Image plat avec cadre et respiration, pas une bande colorée aléatoire.",
          "Bandeau de confiance sous le hero, pas quatre blocs égaux.",
        ],
        beforeAlt: "Template restaurant : bande colorée, titre faible, deux boutons anonymes.",
        afterAlt: "Après restaurant : palette chaude, titre fort, CTA terracotta, photo mise en avant.",
      },
      {
        tab: "Bar",
        headline: "Identité nocturne sans ‘néon chaos’ : contraste et une seule invitation.",
        changes: [
          "Fond clair + typo noire forte pour une lecture immédiate.",
          "Un CTA accent (carte / réserver), pas deux gris identiques.",
          "Carte visuelle latérale au lieu d’une bande abstraite plein écran.",
          "Structure pensée pour scanner vite, comme une carte de boissons.",
        ],
        beforeAlt: "Template bar : bande abstraite, texte centré faible, blocs jumeaux.",
        afterAlt: "Après bar : UI claire, gros titre, CTA orange, carte latérale.",
      },
      {
        tab: "Local",
        headline: "De vitrine anonyme à ‘pourquoi nous choisir’ en trois secondes.",
        changes: [
          "Titre avec promesse locale (horaires, zone, service) en avant.",
          "Badges confiance (avis, années) juste sous le hero.",
          "Rangée de services lisible + CTA contact au lieu de tuiles identiques.",
          "Palette vert/blanc pour proximité — pas le gris template.",
        ],
        beforeAlt: "Commerce local : cases identiques sans message clair.",
        afterAlt: "Après local : titre vert, CTA contact, bandeau confiance.",
      },
      {
        tab: "Sur mesure",
        headline: "Du brief vide à des modules qui portent votre marque.",
        changes: [
          "Structure modulaire (services / preuve / CTA) adaptable au secteur réel.",
          "Emplacements pour claims, chiffres et témoignages sans lorem infini.",
          "Accents or légers sur blanc pour la continuité avec le site.",
          "Prêt pour du vrai contenu : chaque bloc a un rôle net.",
        ],
        beforeAlt: "Lorem et trois bandes grises sans hiérarchie.",
        afterAlt: "Après sur mesure : cartes marque, grille nette, conteneurs définis.",
      },
    ],
  },
  servicesLabel: "Ce que nous construisons",
  processSection: {
    eyebrow: "Processus",
    title: "Comment nous transformons un site faible en actif business",
    subtitle:
      "Visuel, strategie et resultat dans une seule methode pilotee par le business. Pas juste du design.",
    stepLabel: "Etape",
    footerNote:
      "Chaque projet est flexible : processus, design et fonctionnalites s adaptent aux besoins reels de chaque client.",
  },
  impact: {
    label: "Pourquoi c'est important",
    items: [
      {
        title: "Les OTA vous coutent 20%",
        body: "Un hotel avec 100.000EUR de reservations annuelles paie jusqu'a 20.000EUR de commissions. Un site direct bien fait peut recuperer une part importante de cette somme des la premiere annee.",
        note: "Moyenne du secteur. Les resultats varient.",
      },
      {
        title: "70% des clients jugent un business par son site",
        body: "Avant d'entrer dans votre restaurant, vos clients vous ont deja juge en ligne. Un site mediocre coute plus cher qu'on ne le pense.",
        note: "Source: Stanford Web Credibility Research.",
      },
      {
        title: "Un site premium se rembourse",
        body: "Une seule reservation directe supplementaire par semaine peut couvrir tout l'investissement en quelques mois.",
        note: "Estimation indicative basee sur les moyennes du secteur.",
      },
    ],
  },
  audit: {
    title: "Vous voulez savoir ce qui freine votre site?",
    body: "Nous analysons votre site actuel et nous vous disons exactement ce qu'il faut ameliorer. Gratuitement, sans engagement.",
    cta: "Demander votre audit gratuit",
    meta: "Reponse sous 24h · Gratuit · Sans engagement",
  },
  about: {
    eyebrow: "Qui sommes-nous",
    title: "Design & développement",
    bio: "Nous sommes un petit studio digital base a Rimini. Nous travaillons avec des restaurants, hotels et marques locales qui veulent un site qui fonctionne vraiment. Pas juste beau, mais construit pour apporter des resultats concrets.\n\nNous ne travaillons pas avec 30 clients en parallele. Nous suivons quelques projets, en traitant chaque business comme s'il etait le notre.",
    pills: ["Rimini, Italie", "Disponible pour nouveaux projets"],
  },
  contact: {
    label: "Commencons",
    title: "Construisons quelque chose qui fonctionne.",
    body: "Apres votre message vous recevez une reponse claire avec les prochaines etapes, le timing et la faisabilite.",
    emailLabel: "Email",
    whatsappLabel: "WhatsApp · Reponse sous 24h",
    availability: "Actuellement disponible pour nouveaux clients",
    form: {
      name: "Nom et prenom",
      business: "Nom du business",
      businessType: "Type de business",
      brief: "Decrivez brievement ce que vous cherchez",
      source: "Comment nous avez-vous trouves?",
      submit: "Envoyer le message",
      submitting: "Envoi en cours...",
      success: "Bien recu. Nous repondons sous 24 heures.",
      options: {
        restaurant: "Restaurant",
        hotel: "Hotel",
        bar: "Bar",
        other: "Autre",
        google: "Google",
        referral: "Bouche a oreille",
        social: "Reseaux sociaux",
      },
      errors: {
        required: "Champ obligatoire",
      },
    },
  },
  footer: {
    description: "Studio digital pour l'hospitalite et les marques locales premium.",
    links: "Liens rapides",
    location: "Rimini, Italie",
    status: "Disponible pour nouveaux clients",
    privacy: "Politique de confidentialite",
    built: "Built with intention.",
  },
  langSelector: {
    label: "Langue",
  },
  servicePage: {
    backToHome: "Retour a l'accueil",
    deliverables: "Ce qui est inclus",
    howItWorks: "Comment ca marche",
    viewService: "Decouvrir le service",
    otherServices: "Autres services",
    sectionEyebrow: "Service",
    pricingEyebrow: "Tarifs",
  },
  workPage: {
    eyebrow: "Projets",
    title: "Tous les projets",
    subtitle: "Une selection de concepts, prototypes et projets prets pour le client.",
    viewAll: "Voir tous les projets",
    backToWork: "Retour aux projets",
    visitLiveSite: "Visiter le site",
    liveStatus: "En ligne",
    techStack: "Stack technique",
    overview: "Apercu",
    otherProjects: "Autres projets",
  },
};

const ru: TranslationSet = {
  langName: "Русский",
  langCode: "RU",
  projects: [
    {
      id: "rockisland-rimini",
      name: "Porto Sole",
      subtitle: "Ресторан и бар на причале · 400м в море · С 1993",
      problem:
        "Сайт не передавал уникальность ужина в 400 метрах от берега в Адриатическом море, атмосферу заката и бронирование мероприятий достаточно чётко.",
      solution:
        "Кинематографичный сторителлинг, ведущий посетителя от заката до ночи, с понятным мобильным путём бронирования.",
      businessImpact:
        "Живой сайт, транслирующий визуальную идентичность Porto Sole и конвертирующий посетителей в прямые бронирования с первого взгляда.",
    },
    {
      id: "hotel-direct-booking",
      name: "Aurelia del Mar",
      nameTagline: "Hotel Direct Booking System",
      subtitle: "Отель у моря в Бенидорме с предложениями для прямого бронирования",
      problem:
        "Отелю нужен был убедительный сценарий прямого бронирования, который показывает локацию, номера, сервисы и специальные предложения без возврата гостя на OTA-платформы.",
      solution:
        "Конверсионный сайт отеля с атмосферным первым экраном, витриной номеров, блоками сервисов, отзывами, пакетами и понятным booking-flow.",
      businessImpact:
        "Живой прототип позиционирует Aurelia del Mar как премиальный отдых у моря и дает гостям понятную причину бронировать напрямую.",
    },
    {
      id: "premium-restaurant-local-concept",
      name: "Premium Restaurant Website",
      subtitle: "Конверсионная страница локального ресторана",
      problem:
        "Устаревший layout не показывал атмосферу, ценность меню и путь бронирования на мобильных.",
      solution:
        "Редакционный визуальный язык, структура вокруг бронирования и чёткие доказательства качества опыта.",
      businessImpact:
        "Опыт, который снижает чувствительность к цене и поднимает прямые бронирования при первом визите.",
    },
    {
      id: "student-marketplace-rimini",
      name: "Student Marketplace Rimini",
      subtitle: "Концепт маркетплейса / dashboard партнёра",
      problem:
        "Студентам не хватало одного доверительного места для проверенных локальных скидок и предложений партнёров.",
      solution:
        "Mobile-first flow, балансирующий открываемость, доверие и простоту онбординга для обеих сторон.",
      businessImpact:
        "Client-ready концепт локального vertical-маркетплейса, масштабируемый на новые категории.",
    },
    {
      id: "podlopuhom-jewelry",
      name: "Pod Lopuhom",
      nameTagline: "украшения ручной работы",
      subtitle: "E-commerce ботанических украшений в смоле",
      problem:
        "Мастерица принимала заказы только в личных сообщениях, без чёткой витрины для коллекций, цен и наличия — особенно для международной аудитории.",
      solution:
        "Многоязычная галерея (EN/RU/IT) с понятными категориями, карточкой товара и прямыми CTA в WhatsApp и Instagram для закрытия заказа.",
      businessImpact:
        "Live-сайт, который превратил соц-профиль в профессиональный бренд, повысив доверие, прямые заказы и видимость на новых рынках.",
    },
  ],
  services: [
    {
      id: "premium-site",
      title: "Премиум-сайт",
      description:
        "Полный дизайн и разработка для ресторанов, отелей, баров. Mobile-first, быстрый, заточенный под конверсию.",
      details: "От wireframe до продукта · Опциональный CMS · Базовый SEO включён",
      whatYouGet: [
        "Премиум дизайн и визуальная идентичность",
        "Быстрая разработка Next.js, готовая под SEO",
        "Mobile-first под конверсию",
        "Опциональный CMS для управления контентом",
        "Запуск и поддержка после launch включены",
      ],
    },
    {
      id: "redesign",
      title: "Редизайн и оптимизация",
      description:
        "Превращаем существующие сайты в качественные цифровые активы. Новый вид, новая структура, новые результаты.",
      details: "Аудит · Стратегия · Внедрение",
      whatYouGet: [
        "Полный аудит текущего сайта",
        "Новая информационная архитектура и UX",
        "Обновлённая премиум-идентичность",
        "Миграция контента без потерь",
        "Настройка аналитики и трекинга",
      ],
    },
    {
      id: "booking-flow",
      title: "Booking и lead-flow",
      description:
        "Строим прямые бронирования, снижающие зависимость от OTA и поднимающие конверсию.",
      details: "Интеграция booking · Умные формы · A/B логика",
      whatYouGet: [
        "Анализ текущего booking-funnel",
        "Интеграция booking-системы",
        "Умные формы под конверсию",
        "A/B-тесты CTA и ключевых flow",
        "Ежемесячный отчёт по результатам",
      ],
    },
    {
      id: "monthly-support",
      title: "Ежемесячная поддержка",
      description:
        "Обновления, постоянная оптимизация, приоритетная поддержка. Ваш сайт растёт вместе с бизнесом.",
      details: "От 2ч/мес · Гарантированный приоритет · Месячный отчёт",
      whatYouGet: [
        "Технические и контентные обновления",
        "Мониторинг производительности и uptime",
        "Постоянные улучшения конверсии",
        "Приоритет по новым запросам",
        "Ясный ежемесячный отчёт",
      ],
    },
    {
      id: "photo-video",
      title: "Фото и видео с профессиональным оператором",
      description:
        "Съёмка и постпродакшн — отдельная услуга с выездным оператором: еда, интерьеры, команда, контент для соцсетей. Не смешивается с веб-пакетами; тарифы свои.",
      details: "Выезд на объект · При необходимости звук · Файлы под сайт и соцсети",
      whatYouGet: [
        "Бриф и shot list под задачу",
        "Съёмка фото и видео профессиональным оператором",
        "Монтаж: монтажный ряд, цвет, форматы (вертикаль/горизонталь)",
        "Готовые материалы для hero, меню и кампаний",
        "Права использования для digital-маркетинга (по договору)",
      ],
      portfolioUrl: "https://www.instagram.com/",
      portfolioLinkLabel: "Работы оператора",
      pricingSectionTitle: "Тарифы (отдельная услуга)",
      pricingFootnote:
        "Итоговая стоимость — в смете: зависит от локации, времени съёмки и прав использования.",
      pricingTiers: [
        {
          name: "Полдня",
          detail: "До 4 часов · фото или видео · отбор кадров и базовый монтаж · соцсети и меню.",
        },
        {
          name: "Полный день",
          detail: "Целый день · фото + видео · больше вариантов под сайт и рекламу.",
        },
        {
          name: "Ежемесячно / ретейнер",
          detail: "Регулярные съёмки и календарь контента · стабильный поток для ленты и ads.",
        },
      ],
    },
  ],
  process: [
    {
      id: "understand",
      title: "Понимание",
      summary: "Бизнес, аудитория, цели, проблемы.",
      description:
        "Изучаем бизнес, аудиторию, цели и текущие ограничения — чтобы понять, какую задачу должен решать сайт.",
    },
    {
      id: "plan",
      title: "План",
      summary: "Структура, сценарий, функции, приоритеты.",
      description:
        "Определяем структуру, пользовательский поток и ключевые функции под конкретные задачи клиента.",
    },
    {
      id: "design",
      title: "Дизайн",
      summary: "Стиль бренда, ясность, доверие, конверсия.",
      description:
        "Создаём визуальное направление в духе бренда: доверие, понятное предложение, аккуратная иерархия.",
    },
    {
      id: "build",
      title: "Разработка",
      summary: "Адаптивный сайт, интеграции, производительность.",
      description:
        "Собираем быстрый отзывчивый сайт с нужными инструментами и интеграциями.",
    },
    {
      id: "improve",
      title: "Улучшение",
      summary: "Тесты, запуск, обратная связь, оптимизация.",
      description:
        "Тестируем, запускаем и дорабатываем проект по обратной связи, данным и будущим задачам бизнеса.",
    },
  ],
  nav: {
    work: "Проекты",
    services: "Услуги",
    process: "Процесс",
    contact: "Контакты",
    audit: "Бесплатный аудит",
  },
  hero: {
    eyebrow: "Digital Studio · Rimini, Italia",
    headline: "Первое впечатление\nо вашем бизнесе\nначинается здесь.",
    subtitle: "Цифровое первое впечатление для hospitality-брендов",
    lead: "Создаём премиум цифровые опыты для ресторанов, отелей и hospitality-брендов, которые хотят выглядеть как лучшие и получать бронирования напрямую.",
    primaryCta: "Смотреть проекты",
    secondaryCta: "Запросить бесплатный аудит",
    socialProof: "4 проекта · Римини и Италия · Открыты для новых клиентов",
    mockupCaption: "Ваша лучшая визитная карточка",
    mockupCaptionSm: true,
  },
  trust: [
    "Дизайн, который конвертирует",
    "Фокус на hospitality и ресторанах",
    "Меньше зависимости от OTA",
    "Mobile-first и быстрый",
  ],
  problem: {
    title:
      "Почти у всех локальных бизнесов есть сайт. Почти ни у кого нет настоящего цифрового первого впечатления.",
    body: "Большинство локальных сайтов не строит доверие. Они показывают информацию, но не передают качество. OTA при этом удерживают от 15% до 25% комиссии. Премиум-сайт, сделанный под конверсию, может окупиться за несколько месяцев. Именно поэтому мы помогаем hospitality-бизнесам в Италии возвращать прямую ценность.",
  },
  caseStudies: {
    label: "Избранные работы",
    viewCaseStudy: "Смотреть проект",
    fields: {
      problem: "Проблема",
      solution: "Решение",
      businessImpact: "Бизнес-эффект",
    },
  },
  beforeAfter: {
    eyebrow: "Быстрые сравнения · первый экран",
    title: "Пять типов бизнеса — одна проблема: шум. Пять вариантов «после» — не обязательно темнее.",
    subtitle:
      "Улучшение — это иерархия, смысл и действие. Выберите отель, ресторан, бар, локальный бизнес или сетку под ваш бриф. Тяните золотую границу.",
    beforeBadge: "До",
    afterBadge: "После",
    dragHint: "Потяните, чтобы сравнить",
    changesTitle: "В этом примере что меняется",
    footerNote:
      "Иллюстративные макеты: палитра и композиция меняются по сегменту. Цель всегда — ясность и конверсия.",
    cases: [
      {
        tab: "Отель",
        headline: "От «всё как у всех» к понятному бронированию — в том числе на светлом UI.",
        changes: [
          "Один доминирующий CTA бронирования, второстепенные действия визуально тише.",
          "Светлый editorial-hero: крупный текст, аккуратное фото, микро-доверие.",
          "Убраны одинаковые плитки внизу — место одному сильному обещанию.",
          "Тёплая премиум-палитра без привязки к «тёмной теме = лучше».",
        ],
        beforeAlt: "Шаблон отеля: стоковый градиент, два серых CTA, серая сетка.",
        afterAlt: "После отеля: тёплый кремовый layout, одна янтарная кнопка, сбалансированный hero.",
      },
      {
        tab: "Ресторан",
        headline: "Меню и характер кухни в центре — меньше визуального шума.",
        changes: [
          "Акцент на меню / вечер вместо общего «добро пожаловать».",
          "Один CTA (стол / дегустация) в тёплом акцентном цвете.",
          "Фото блюда в рамке с воздухом, а не цветная полоса на весь экран.",
          "Полоса доверия под hero вместо четырёх одинаковых блоков.",
        ],
        beforeAlt: "Шаблон ресторана: яркая полоса, слабый заголовок, два безликих кнопки.",
        afterAlt: "После ресторана: тёплая палитра, сильный заголовок, терракотовый CTA, фото.",
      },
      {
        tab: "Бар",
        headline: "Ночной характер без «неонового хаоса»: контраст и одно приглашение.",
        changes: [
          "Светлый фон + жирная чёрная типографика для мгновенного считывания.",
          "Один акцентный CTA (меню / бронь), а не два одинаковых серых.",
          "Боковая карточка вместо абстрактной полосы на всю ширину.",
          "Структура как у карты напитков: быстрый скан, меньше равных элементов.",
        ],
        beforeAlt: "Шаблон бара: абстрактная полоса, слабый текст по центру, близнецы-блоки.",
        afterAlt: "После бара: светлый UI, крупный заголовок, оранжевый CTA, боковая карточка.",
      },
      {
        tab: "Локально",
        headline: "С анонимной витрины к «почему мы» за три секунды.",
        changes: [
          "Заголовок с локальным обещанием (часы, район, услуга) в первом экране.",
          "Бейджи доверия (отзывы, стаж) сразу под hero.",
          "Читаемая строка услуг + CTA связи вместо одинаковых плиток.",
          "Свежая зелёно-белая палитра вместо серого шаблона.",
        ],
        beforeAlt: "Локальный бизнес: сетка одинаковых блоков без смысла.",
        afterAlt: "После локального: зелёный заголовок, CTA связи, полоса доверия.",
      },
      {
        tab: "Под вас",
        headline: "От пустого брифа к модулям под ваш бренд.",
        changes: [
          "Модульная сетка (услуги / доказательства / CTA) под реальный сектор.",
          "Ячейки под цифры, офферы и отзывы без бесконечного lorem.",
          "Лёгкие золотые акценты на белом — в линию с остальным сайтом.",
          "Готово к реальному контенту: у каждого блока роль.",
        ],
        beforeAlt: "Общий lorem и три серые полосы без иерархии.",
        afterAlt: "После под бриф: карточки бренда, аккуратная сетка, контейнеры.",
      },
    ],
  },
  servicesLabel: "Что мы делаем",
  processSection: {
    eyebrow: "Процесс",
    title: "Как мы превращаем слабый сайт в бизнес-актив",
    subtitle:
      "Визуал, стратегия и результат в одном бизнес-ориентированном методе. Не просто дизайн.",
    stepLabel: "Этап",
    footerNote:
      "Каждый проект гибкий: процесс, дизайн и функциональность подстраиваются под реальные задачи клиента.",
  },
  impact: {
    label: "Почему это важно",
    items: [
      {
        title: "OTA забирают у вас 20%",
        body: "Отель с годовым оборотом бронирований в 100.000EUR теряет до 20.000EUR на комиссиях. Хороший сайт с прямым бронированием может вернуть значительную часть этой суммы уже в первый год.",
        note: "Средний показатель по отрасли. Результаты могут отличаться.",
      },
      {
        title: "70% клиентов судит о бизнесе по сайту",
        body: "Ещё до того, как зайти в ваш ресторан, клиенты уже оценили вас онлайн. Слабый сайт стоит дороже, чем кажется.",
        note: "Источник: Stanford Web Credibility Research.",
      },
      {
        title: "Премиум-сайт себя окупает",
        body: "Всего одно дополнительное прямое бронирование в неделю может покрыть всю стоимость сайта за несколько месяцев.",
        note: "Ориентировочная оценка на основе средних по рынку.",
      },
    ],
  },
  audit: {
    title: "Хотите узнать, что мешает вашему сайту?",
    body: "Мы проанализируем ваш текущий сайт и скажем точно, что улучшить. Бесплатно, без обязательств.",
    cta: "Запросить свой бесплатный аудит",
    meta: "Отвечаем в течение 24 часов · Бесплатно · Без обязательств",
  },
  about: {
    eyebrow: "О нас",
    title: "Дизайн и разработка",
    bio: "Мы небольшая цифровая студия в Римини. Работаем с ресторанами, отелями и локальными брендами, которым нужен сайт, действительно работающий. Не просто красивый, а построенный под реальные бизнес-результаты.\n\nМы не работаем с 30 клиентами одновременно. Берём несколько проектов и относимся к каждому бизнесу как к своему.",
    pills: ["Римини, Италия", "Открыты для новых проектов"],
  },
  contact: {
    label: "Начнём",
    title: "Давайте построим что-то, что работает.",
    body: "После вашего сообщения вы получите чёткий ответ со следующими шагами, сроками и оценкой реализуемости.",
    emailLabel: "Email",
    whatsappLabel: "WhatsApp · Ответ в течение 24ч",
    availability: "Сейчас открыты для новых клиентов",
    form: {
      name: "Имя и фамилия",
      business: "Название бизнеса",
      businessType: "Тип бизнеса",
      brief: "Коротко опишите, что ищете",
      source: "Как вы нас нашли?",
      submit: "Отправить сообщение",
      submitting: "Отправка...",
      success: "Принято. Ответим в течение 24 часов.",
      options: {
        restaurant: "Ресторан",
        hotel: "Отель",
        bar: "Бар",
        other: "Другое",
        google: "Google",
        referral: "Сарафанное радио",
        social: "Соцсети",
      },
      errors: {
        required: "Обязательное поле",
      },
    },
  },
  footer: {
    description: "Цифровая студия для премиум hospitality и локальных брендов.",
    links: "Быстрые ссылки",
    location: "Римини, Италия",
    status: "Открыты для новых клиентов",
    privacy: "Политика конфиденциальности",
    built: "Built with intention.",
  },
  langSelector: {
    label: "Язык",
  },
  servicePage: {
    backToHome: "Вернуться на главную",
    deliverables: "Что включено",
    howItWorks: "Как это работает",
    viewService: "Смотреть услугу",
    otherServices: "Другие услуги",
    sectionEyebrow: "Услуга",
    pricingEyebrow: "Тарифы",
  },
  workPage: {
    eyebrow: "Работы",
    title: "Все проекты",
    subtitle: "Выборка концептов, прототипов и client-ready проектов.",
    viewAll: "Смотреть все работы",
    backToWork: "Назад к проектам",
    visitLiveSite: "Перейти на сайт",
    liveStatus: "Live",
    techStack: "Стек технологий",
    overview: "Обзор",
    otherProjects: "Другие проекты",
  },
};

const de: TranslationSet = {
  langName: "Deutsch",
  langCode: "DE",
  projects: [
    {
      id: "rockisland-rimini",
      name: "Porto Sole",
      subtitle: "Restaurant & Bar auf dem Pier · Seit 1993",
      problem:
        "Die Website vermittelte das einzigartige Erlebnis, 400 Meter im Meer zu speisen, die Sonnenuntergangsatmosphare und Event-Buchungen nicht klar genug.",
      solution:
        "Kinematografisches Storytelling, das Besucher vom Sonnenuntergang bis zur Nacht fuhrt, mit klarem mobiloptimierten Buchungspfad.",
      businessImpact:
        "Live-Website, die Porto Soles visuelle Identitat transportiert und Besucher beim ersten Blick in direkte Buchungen verwandelt.",
    },
    {
      id: "hotel-direct-booking",
      name: "Aurelia del Mar",
      nameTagline: "Hotel Direct Booking System",
      subtitle: "Strandhotel in Benidorm mit Direktbuchungsangeboten",
      problem:
        "Das Hotel brauchte ein hochwertiges Direktbuchungserlebnis, das Lage, Zimmer, Services und exklusive Angebote vermittelt, ohne Gaste zuruck zu OTA-Plattformen zu schicken.",
      solution:
        "Conversion-fokussierte Hotelwebsite mit immersiver Hero-Section, Zimmer-Highlights, Services, Gastebewertungen, Paketen und gefuhrtem Buchungsflow.",
      businessImpact:
        "Live-Prototyp, der Aurelia del Mar als premium Aufenthalt am Meer positioniert und Gasten einen klaren Grund gibt, direkt zu buchen.",
    },
    {
      id: "premium-restaurant-local-concept",
      name: "Premium Restaurant Website",
      subtitle: "Conversion-Seite fur lokales Restaurant",
      problem:
        "Veraltetes Layout zeigte Atmosphare, Menu-Wert und Reservierungspfad auf Mobile nicht ausreichend.",
      solution:
        "Editoriale visuelle Sprache, reservierungsorientierte Struktur und klare Qualitatsnachweise.",
      businessImpact:
        "Erlebnis, das Preissensibilitat senkt und Direktbuchungen beim ersten Besuch erhoht.",
    },
    {
      id: "student-marketplace-rimini",
      name: "Student Marketplace Rimini",
      subtitle: "Marketplace- / Partner-Dashboard-Konzept",
      problem:
        "Studenten fehlte ein vertrauenswurdiger Ort fur gepruft lokale Rabatte und Partnerangebote.",
      solution:
        "Mobile-first Flow, der Entdeckung, Vertrauen und Onboarding-Einfachheit fur beide Seiten ausbalanciert.",
      businessImpact:
        "Client-ready Konzept fur einen lokalen Vertical-Marketplace, skalierbar auf neue Kategorien.",
    },
    {
      id: "podlopuhom-jewelry",
      name: "Pod Lopuhom",
      nameTagline: "Handgefertigter Schmuck",
      subtitle: "Botanischer Resin-Schmuck-Onlineshop",
      problem:
        "Die Kunsthandwerkerin nahm Bestellungen nur uber DMs entgegen, ohne klaren Showroom fur Kollektionen, Preise und Verfugbarkeit fur ein internationales Publikum.",
      solution:
        "Mehrsprachige Galerie (EN/RU/IT) mit klaren Kategorien, Produktdetail und direkten WhatsApp- / Instagram-CTAs zum Abschluss der Bestellung.",
      businessImpact:
        "Live-Site, die ein Social-Profil in eine professionelle Marke verwandelt hat — mehr Vertrauen, direkte Bestellungen und Sichtbarkeit auf neuen Markten.",
    },
  ],
  services: [
    {
      id: "premium-site",
      title: "Premium-Website",
      description:
        "Komplettes Design und Entwicklung fur Restaurants, Hotels und Bars. Mobile-first, schnell, conversion-orientiert.",
      details: "Vom Wireframe bis zum Launch · Optionales CMS · Basis-SEO inklusive",
      whatYouGet: [
        "Premium-Design und visuelle Identitat",
        "Schnelle, SEO-ready Next.js-Entwicklung",
        "Mobile-first, conversion-optimiert",
        "Optionales CMS fur Content-Management",
        "Launch und Post-Live-Support inklusive",
      ],
    },
    {
      id: "redesign",
      title: "Redesign und Optimierung",
      description:
        "Wir verwandeln bestehende Websites in hochwertige digitale Assets. Neuer Look, neue Struktur, neue Ergebnisse.",
      details: "Audit · Strategie · Umsetzung",
      whatYouGet: [
        "Vollstandiges Audit der aktuellen Website",
        "Neue Informationsarchitektur und UX",
        "Aktualisierte, premium visuelle Identitat",
        "Content-Migration ohne Verlust",
        "Analytics- und Tracking-Setup",
      ],
    },
    {
      id: "booking-flow",
      title: "Booking und Lead-Flow",
      description:
        "Wir bauen Direktbuchungs-Flows, die OTA-Abhangigkeit reduzieren und Conversion steigern.",
      details: "Booking-Integration · Smarte Formulare · A/B-Logik",
      whatYouGet: [
        "Analyse des aktuellen Booking-Funnels",
        "Integration des Buchungssystems",
        "Smarte, conversion-orientierte Formulare",
        "A/B-Tests auf CTAs und Key Flows",
        "Monatlicher Ergebnisbericht",
      ],
    },
    {
      id: "monthly-support",
      title: "Monatlicher Support",
      description:
        "Updates, laufende Optimierung, priorisierter Support. Ihre Website wachst mit Ihrem Business.",
      details: "Ab 2h/Monat · Prioritat garantiert · Monatsreport",
      whatYouGet: [
        "Technische und Content-Updates",
        "Performance- und Uptime-Monitoring",
        "Kontinuierliche Conversion-Optimierung",
        "Prioritat bei neuen Anfragen",
        "Klarer monatlicher Bericht",
      ],
    },
    {
      id: "photo-video",
      title: "Foto & Video mit professionellem Operator",
      description:
        "Drehs und Postproduktion mit festem Operator: Food, Raume, Team und Social-Assets. Eigenstandiger Service neben Webprojekten, mit eigenen Tarifen.",
      details: "Location-Drehs · Audio bei Bedarf · Deliverables fur Web und Social",
      whatYouGet: [
        "Briefing und Shotliste mit klarem Zeitplan",
        "Professionelle Foto- und Videoaufnahmen",
        "Schnitt, Gradierung, Hoch- und Querformate",
        "Lieferung fur Hero, digitale Speisekarten und Kampagnen",
        "Nutzungsrechte fur Digital-Marketing (vertraglich)",
      ],
      portfolioUrl: "https://www.instagram.com/",
      portfolioLinkLabel: "Arbeiten des Operators ansehen",
      pricingSectionTitle: "Tarife (separate Leistung)",
      pricingFootnote:
        "Preise werden je nach Location, Dauer und Nutzungsrechten im Angebot festgelegt.",
      pricingTiers: [
        {
          name: "Halber Tag",
          detail: "Bis 4 Std. · Foto oder Video · Auswahl und Basis-Edit · ideal fur Social und Menu.",
        },
        {
          name: "Ganzer Tag",
          detail: "Voller Drehtag · Foto + Video · mehr Varianten fur Website und Ads.",
        },
        {
          name: "Monatlicher Retainer",
          detail: "Wiederkehrende Drehs und Content-Plan · Kontinuitat fur Feed und Kampagnen.",
        },
      ],
    },
  ],
  process: [
    {
      id: "understand",
      title: "Verstehen",
      summary: "Business, Zielgruppe, Ziele, Probleme.",
      description:
        "Wir analysieren Business, Zielgruppe, Ziele und aktuelle Herausforderungen — damit klar ist, was die Website leisten muss.",
    },
    {
      id: "plan",
      title: "Planen",
      summary: "Struktur, Flow, Features, Prioritäten.",
      description:
        "Wir definieren Informationsarchitektur, Nutzerfluss und Kernfunktionen passend zu den Anforderungen.",
    },
    {
      id: "design",
      title: "Design",
      summary: "Markenstil, Klarheit, Vertrauen, Conversion.",
      description:
        "Wir entwickeln eine visuelle Richtung, die zur Marke passt, Vertrauen aufbaut und das Angebot klar macht.",
    },
    {
      id: "build",
      title: "Umsetzen",
      summary: "Responsive Website, Integrationen, Performance.",
      description:
        "Wir entwickeln eine schnelle, responsive Website mit den passenden Tools und Anbindungen.",
    },
    {
      id: "improve",
      title: "Verbessern",
      summary: "Tests, Launch, Feedback, Optimierung.",
      description:
        "Wir testen, live schalten und verfeinern das Projekt anhand von Feedback, Daten und kunftigen Business-Anforderungen.",
    },
  ],
  nav: {
    work: "Arbeiten",
    services: "Leistungen",
    process: "Prozess",
    contact: "Kontakt",
    audit: "Kostenloses Audit",
  },
  hero: {
    eyebrow: "Digitales Studio · Rimini, Italien",
    headline: "Der erste Eindruck\nIhres Business\nbeginnt hier.",
    subtitle: "Digitaler erster Eindruck fur Hospitality-Marken",
    lead: "Wir bauen Premium-Digitalerlebnisse fur Restaurants, Hotels und Hospitality-Marken, die wie die Besten aussehen und so gebucht werden wollen.",
    primaryCta: "Projekte ansehen",
    secondaryCta: "Audit anfragen",
    socialProof: "4 Projekte · Rimini & Italien · Verfugbar fur neue Kunden",
    mockupCaption: "Ihre beste Visitenkarte",
  },
  trust: [
    "Design, das konvertiert",
    "Fokus auf Hospitality und Gastronomie",
    "Weniger Abhangigkeit von OTAs",
    "Mobile-first und schnell",
  ],
  problem: {
    title:
      "Fast jedes lokale Unternehmen hat eine Website. Fast keines hat einen echten digitalen ersten Eindruck.",
    body: "Die meisten lokalen Websites schaffen kein Vertrauen. Sie zeigen Informationen, vermitteln aber keine Qualitat. OTAs behalten dabei 15 bis 25 Prozent Provision. Eine Premium-Website mit Conversion-Fokus kann sich in wenigen Monaten amortisieren. Genau deshalb helfen wir italienischen Hospitality-Unternehmen, direkten Wert zuruckzuholen.",
  },
  caseStudies: {
    label: "Ausgewahlte Arbeiten",
    viewCaseStudy: "Projekt ansehen",
    fields: {
      problem: "Problem",
      solution: "Losung",
      businessImpact: "Business-Effekt",
    },
  },
  beforeAfter: {
    eyebrow: "Kurzvergleiche · erster Screen",
    title: "Funf Segmente, gleiches Problem: Unruhe. Funf ‘Nachher’-Richtungen — nicht immer dunkler.",
    subtitle:
      "Verbesserung ist Hierarchie, Botschaft und Handlung. Wahlen Sie Hotel, Restaurant, Bar, lokales Business oder ein Brief-getriebenes Layout. Ziehen Sie die goldene Linie.",
    beforeBadge: "Vorher",
    afterBadge: "Nachher",
    dragHint: "Ziehen zum Vergleichen",
    changesTitle: "Was sich in diesem Beispiel verbessert",
    footerNote:
      "Illustrative Mockups: Palette und Layout wechseln je Segment. Ziel bleiben Klarheit und Conversion.",
    cases: [
      {
        tab: "Hotel",
        headline: "Vom ‘alles gleich’-Hero zu lesbarer Buchung — auch auf hellem UI.",
        changes: [
          "Ein dominanter Buchungs-CTA, sekundare Aktionen visuell zuruckgenommen.",
          "Klarer Editorial-Hero: grosse Typo, ordentliches Foto, Mikro-Vertrauen.",
          "Gleiche Kacheln unten entfernt — Platz fur ein starkes Versprechen.",
          "Warme Premium-Palette ohne dunkel-gleich-besser.",
        ],
        beforeAlt: "Hotel-Template: Stock-Verlauf, zwei graue CTAs, generisches Raster.",
        afterAlt: "Hotel nachher: warmes Creme-Layout, ein bernsteinfarbener Button, balancierter Hero.",
      },
      {
        tab: "Restaurant",
        headline: "Menu und Kuchenton im Mittelpunkt — weniger visuelles Rauschen.",
        changes: [
          "Fokus Menu / Abend statt generischem ‘Willkommen’.",
          "Ein CTA (Tisch / Degustation) mit warmem Akzent.",
          "Food-Foto mit Rahmen und Luft, keine zufallige Farbband-Flache.",
          "Vertrauensleiste unter dem Hero statt vier gleichen Boxen.",
        ],
        beforeAlt: "Restaurant-Template: lautes Band, schwache Headline, zwei anonyme Buttons.",
        afterAlt: "Restaurant nachher: warme Palette, starke Typo, Terrakotta-CTA, Foto im Fokus.",
      },
      {
        tab: "Bar",
        headline: "Nacht-Look ohne Neon-Chaos: Kontrast und eine Einladung.",
        changes: [
          "Helles UI + starke schwarze Schrift fur sofortige Lesbarkeit.",
          "Ein Akzent-CTA (Karte / Reservierung), nicht zwei graue Zwillinge.",
          "Seitenkarte statt abstrakter Vollbreiten-Bahn.",
          "Struktur wie eine Drinkkarte: schnell scannen, weniger gleichgewichtige Elemente.",
        ],
        beforeAlt: "Bar-Template: abstraktes Band, schwacher Mitteltext, Zwillings-Blocke.",
        afterAlt: "Bar nachher: helles UI, grosse Headline, orangener CTA, Seitenkarte.",
      },
      {
        tab: "Lokal",
        headline: "Von anonymer Schaufenster-Seite zu ‘warum wir’ in drei Sekunden.",
        changes: [
          "Headline mit lokalem Versprechen (Zeiten, Gegend, Service) oben.",
          "Vertrauens-Badges (Reviews, Jahre) direkt unter dem Hero.",
          "Lesbare Service-Zeile + Kontakt-CTA statt identischer Kacheln.",
          "Frisches Grun/Weiss statt grauem Template.",
        ],
        beforeAlt: "Lokales Business: identische Boxen ohne klare Botschaft.",
        afterAlt: "Lokal nachher: grune Headline, Kontakt-CTA, Vertrauensleiste.",
      },
      {
        tab: "Individuell",
        headline: "Vom leeren Brief zu Modulen fur Ihre Marke.",
        changes: [
          "Modulares Raster (Leistungen / Proof / CTA) passend zur Branche.",
          "Platze fur Claims, Zahlen und Zitate ohne endloses Lorem.",
          "Leichte Gold-Akzente auf Weiss — konsistent zum Rest der Site.",
          "Bereit fur echte Inhalte: jeder Block hat eine klare Rolle.",
        ],
        beforeAlt: "Generisches Lorem und drei graue Streifen ohne Hierarchie.",
        afterAlt: "Brief-getrieben: Marken-Karten, sauberes Raster, definierte Container.",
      },
    ],
  },
  servicesLabel: "Was wir bauen",
  processSection: {
    eyebrow: "Prozess",
    title: "Wie wir aus einer schwachen Website ein Business-Asset machen",
    subtitle:
      "Visuelles, Strategie und Ergebnis in einer einzigen business-getriebenen Methode. Nicht nur Design.",
    stepLabel: "Schritt",
    footerNote:
      "Jedes Projekt ist flexibel — Prozess, Design und Funktionalität orientieren sich an den realen Bedürfnissen des Kunden.",
  },
  impact: {
    label: "Warum es zahlt",
    items: [
      {
        title: "OTAs kosten Sie 20%",
        body: "Ein Hotel mit 100.000EUR Jahresumsatz an Buchungen zahlt bis zu 20.000EUR an Provisionen. Eine gute Direkt-Website kann einen wesentlichen Teil davon im ersten Jahr zuruckholen.",
        note: "Branchendurchschnitt. Ergebnisse variieren.",
      },
      {
        title: "70% der Kunden beurteilen ein Business an seiner Website",
        body: "Bevor Gaste Ihr Restaurant betreten, haben sie Sie online schon beurteilt. Eine schwache Website kostet mehr, als man denkt.",
        note: "Quelle: Stanford Web Credibility Research.",
      },
      {
        title: "Eine Premium-Website rechnet sich",
        body: "Eine einzige zusatzliche Direktbuchung pro Woche kann die gesamte Website-Investition in wenigen Monaten decken.",
        note: "Indikative Schatzung basierend auf Branchendurchschnitten.",
      },
    ],
  },
  audit: {
    title: "Wollen Sie wissen, was Ihre Website bremst?",
    body: "Wir analysieren Ihre aktuelle Website und sagen Ihnen genau, was zu verbessern ist. Kostenlos und unverbindlich.",
    cta: "Ihr kostenloses Audit anfragen",
    meta: "Antwort innerhalb von 24 Stunden · Kostenlos · Unverbindlich",
  },
  about: {
    eyebrow: "Uber uns",
    title: "Design & Entwicklung",
    bio: "Wir sind ein kleines Digital-Studio aus Rimini. Wir arbeiten mit Restaurants, Hotels und lokalen Marken, die eine Website wollen, die wirklich funktioniert. Nicht nur schon, sondern fur echte Business-Ergebnisse gebaut.\n\nWir arbeiten nicht mit 30 Kunden gleichzeitig. Wir betreuen wenige Projekte und behandeln jedes Business, als ware es unser eigenes.",
    pills: ["Rimini, Italien", "Verfugbar fur neue Projekte"],
  },
  contact: {
    label: "Lass uns starten",
    title: "Lassen Sie uns etwas bauen, das funktioniert.",
    body: "Nach Ihrer Nachricht bekommen Sie eine klare Antwort mit nachsten Schritten, Timing und Machbarkeit.",
    emailLabel: "E-Mail",
    whatsappLabel: "WhatsApp · Antwort innerhalb 24h",
    availability: "Derzeit verfugbar fur neue Kunden",
    form: {
      name: "Vor- und Nachname",
      business: "Name des Business",
      businessType: "Art des Business",
      brief: "Beschreiben Sie kurz, was Sie suchen",
      source: "Wie haben Sie uns gefunden?",
      submit: "Nachricht senden",
      submitting: "Wird gesendet...",
      success: "Erhalten. Wir antworten innerhalb von 24 Stunden.",
      options: {
        restaurant: "Restaurant",
        hotel: "Hotel",
        bar: "Bar",
        other: "Andere",
        google: "Google",
        referral: "Empfehlung",
        social: "Social Media",
      },
      errors: {
        required: "Pflichtfeld",
      },
    },
  },
  footer: {
    description: "Digitales Studio fur Premium-Hospitality und lokale Marken.",
    links: "Schnellzugriff",
    location: "Rimini, Italien",
    status: "Verfugbar fur neue Kunden",
    privacy: "Datenschutz",
    built: "Built with intention.",
  },
  langSelector: {
    label: "Sprache",
  },
  servicePage: {
    backToHome: "Zuruck zur Startseite",
    deliverables: "Was enthalten ist",
    howItWorks: "Wie es funktioniert",
    viewService: "Service entdecken",
    otherServices: "Weitere Leistungen",
    sectionEyebrow: "Leistung",
    pricingEyebrow: "Preise",
  },
  workPage: {
    eyebrow: "Arbeiten",
    title: "Alle Projekte",
    subtitle: "Eine Auswahl an Konzepten, Prototypen und client-ready Projekten.",
    viewAll: "Alle Arbeiten ansehen",
    backToWork: "Zuruck zu Projekten",
    visitLiveSite: "Live-Site besuchen",
    liveStatus: "Live",
    techStack: "Tech-Stack",
    overview: "Uberblick",
    otherProjects: "Weitere Projekte",
  },
};

export const translations: Record<Locale, TranslationSet> = {
  it,
  en,
  fr,
  ru,
  de,
};

export const localeOrder: Locale[] = ["it", "en", "fr", "ru", "de"];
