export type Locale = "it" | "en" | "fr" | "ru" | "de" | "es";

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
  /** External portfolio (videographer’s reel / Instagram / Vimeo, etc.) */
  portfolioUrl?: string;
  portfolioLinkLabel?: string;
  portfolioUrl2?: string;
  portfolioLinkLabel2?: string;
  pricingSectionTitle?: string;
  pricingFootnote?: string;
  pricingTiers?: { tierId: string; name: string; detail: string }[];
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
    buy: string;
    about: string;
  };
  hero: {
    eyebrow: string;
    headline: string;
    subtitle: string;
    lead: string;
    primaryCta: string;
    secondaryCta: string;
    buyCta: string;
    buyCtaShort: string;
    socialProof: string;
    mockupCaption: string;
    mockupCaptionSm?: true;
    chipHighlight: string;
    chipAvailability: string;
    chipAvailabilitySub: string;
  };
  trust: string[];
  proof: {
    eyebrow: string;
    items: { value: string; label: string }[];
    footnote: { value: string; label: string };
  };
  problem: {
    eyebrow: string;
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
  servicesLead: string;
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
    freeBadge: string;
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
    compactTitle: string;
    emailLabel: string;
    whatsappLabel: string;
    availability: string;
    cart: {
      eyebrow: string;
      title: string;
      addonsLabel: string;
      continueSearch: string;
      removeItem: string;
    };
    form: {
      name: string;
      email: string;
      business: string;
      businessType: string;
      siteUrl: string;
      brief: string;
      source: string;
      submit: string;
      submitAudit: string;
      submitting: string;
      success: string;
      successTitle: string;
      successClose: string;
      submitError: string;
      auditBriefPlaceholder: string;
      optional: string;
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
        invalidEmail: string;
        invalidUrl: string;
      };
    };
  };
  orderPage: {
    eyebrow: string;
    title: string;
    subtitle: string;
    fromLabel: string;
    plusLabel: string;
    selectHint: string;
    proceedCta: string;
    footnote: string;
    estimatedLabel: string;
    addonsSectionTitle: string;
    aboutServiceCta: string;
    trust: {
      timeline: string;
      deposit: string;
      processLink: string;
      testimonial: string;
    };
  };
  pricingAddons: {
    eyebrow: string;
    title: string;
    subtitle: string;
    footnote: string;
    categories: {
      id: string;
      title: string;
      items: { id: string; label: string; info: string }[];
    }[];
  };
  aboutPage: {
    backToHome: string;
  };
  privacyPage: {
    title: string;
    lastUpdated: string;
    backToHome: string;
    sections: { heading: string; body: string }[];
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
    popularLabel: string;
    orderCta: string;
  };
  servicesPage: {
    eyebrow: string;
    title: string;
    subtitle: string;
    techStack: string;
    viewAll: string;
    pricingNote: string;
    categories: { title: string; items: { label: string; info: string }[] }[];
  };
  workPage: {
    eyebrow: string;
    title: string;
    subtitle: string;
    viewAll: string;
    backToWork: string;
    visitLiveSite: string;
    viewRepo: string;
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
      id: "porto-sole",
      name: "Porto Sole",
      subtitle: "Ristorante sul molo · Dal 1993",
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
      subtitle: "Hotel fronte mare · booking diretto",
      problem:
        "L'hotel aveva bisogno di un'esperienza di prenotazione diretta capace di comunicare posizione, camere, servizi e offerte senza rimandare gli ospiti su piattaforme esterne.",
      solution:
        "Sito hotel orientato alla conversione con hero immersiva, camere in evidenza, servizi, recensioni, pacchetti speciali e flusso di booking guidato.",
      businessImpact:
        "Prototipo live che posiziona Aurelia del Mar come soggiorno premium sul mare e offre agli ospiti un motivo chiaro per prenotare direttamente.",
    },
    {
      id: "mare-vivo",
      name: "Mare Vivo",
      nameTagline: "Fresh Seafood. Mediterranean Soul.",
      subtitle: "Pesce mediterraneo · Bari",
      problem:
        "Il ristorante aveva bisogno di una presenza online che trasmettesse il pesce fresco dell'Adriatico, la storia di famiglia e un percorso di prenotazione chiaro su mobile.",
      solution:
        "Design editoriale costiero con menu in evidenza, recensioni ospiti, contenuti bilingue EN/IT e flusso prenotazioni con WhatsApp e form diretto.",
      businessImpact:
        "Sito live che posiziona Mare Vivo come eccellenza costiera italiana e converte i visitatori in prenotazioni al tavolo.",
    },
    {
      id: "podlopuhom-jewelry",
      name: "Pod Lopuhom",
      nameTagline: "Gioielli artigianali",
      subtitle: "Gioielli botanici · e-commerce",
      problem:
        "L'artigiana riceveva ordini solo via DM, senza una vetrina chiara per presentare collezioni, prezzi e disponibilita a un pubblico internazionale.",
      solution:
        "Galleria multilingue (EN/RU/IT) con categorie chiare, dettaglio prodotto e CTA dirette su WhatsApp e Instagram per chiudere l'ordine.",
      businessImpact:
        "Sito live che ha trasformato un profilo social in un brand professionale, aumentando fiducia, ordini diretti e visibilita su nuovi mercati.",
    },
    {
      id: "solovyev-store",
      name: "SOLOVYEV STORE",
      nameTagline: "Streetwear & Sneakers Consignment",
      subtitle: "Streetwear premium · buy / sell / trade",
      problem:
        "Il negozio viveva soprattutto su Instagram ed era difficile da trovare su Google. La disponibilita dei pezzi non era chiara e gli ordini su WhatsApp arrivavano in chat confuse, senza dettagli netti su prodotto e taglia.",
      solution:
        "Abbiamo creato un negozio online chiaro: pagine prodotto, stati di disponibilita, pannello per gestire il catalogo, account clienti e messaggi WhatsApp ordinati con tutto cio che serve per chiudere la vendita.",
      businessImpact:
        "Un sito live dove i clienti trovano e comprano con piu facilita — ordini piu chiari, catalogo sotto controllo e meno andirivieni in chat.",
    },
  ],
  services: [
    {
      id: "premium-site",
      title: "Siti web e prodotti digitali",
      description:
        "Siti e prodotti web su misura — dal brand site alle esperienze orientate alla conversione. Mobile-first, veloci, costruiti per funzionare.",
      details: "Da wireframe a produzione · CMS opzionale · SEO base incluso",
      whatYouGet: [
        "Design e identita visiva premium",
        "Sviluppo Next.js veloce e SEO-ready",
        "Mobile-first ottimizzato per conversione",
        "CMS opzionale per gestione contenuti",
        "Lancio e supporto post-live incluso",
      ],
      pricingSectionTitle: "Pacchetti sito web",
      pricingFootnote:
        "Importi indicativi «da». Il preventivo finale dipende da pagine, integrazioni e tempistiche.",
      pricingTiers: [
        {
          tierId: "starter",
          name: "Starter",
          detail: "Landing · 3–5 schermate · 1 lingua · SEO base incluso.",
        },
        {
          tierId: "business",
          name: "Business",
          detail: "6–10 pagine · CMS · form · SEO base · ideale per PMI e hospitality.",
        },
        {
          tierId: "premium",
          name: "Premium",
          detail: "Sito completo · multilingua · booking · animazioni · massima conversione.",
        },
      ],
    },
    {
      id: "redesign",
      title: "Upgrade sistemi e redesign",
      description:
        "Portiamo la presenza digitale esistente a un sistema piu chiaro — struttura, UX, performance e percorsi di conversione.",
      details: "Audit · Strategia · Implementazione",
      whatYouGet: [
        "Audit completo del sito attuale",
        "Nuova architettura informativa e UX",
        "Identita visiva aggiornata e premium",
        "Migrazione contenuti senza perdite",
        "Setup analytics e tracking",
      ],
      pricingSectionTitle: "Pacchetti redesign",
      pricingFootnote:
        "Il costo dipende dallo stato attuale del sito, dal numero di pagine e dal livello di personalizzazione.",
      pricingTiers: [
        {
          tierId: "audit",
          name: "Solo audit",
          detail: "Analisi completa · report con priorità · roadmap di miglioramento.",
        },
        {
          tierId: "standard",
          name: "Standard",
          detail: "Redesign schermate chiave + implementazione · nuova UX e visual.",
        },
        {
          tierId: "full",
          name: "Completo",
          detail: "Redesign totale · migrazione contenuti · analytics e tracking.",
        },
      ],
    },
    {
      id: "booking-flow",
      title: "Automazione dei processi",
      description:
        "Automatizziamo prenotazioni, richieste e workflow ripetitivi perche i lead non si perdano in chat e calendari.",
      details: "Flussi · Integrazioni · Form intelligenti · Report",
      whatYouGet: [
        "Analisi del funnel di prenotazione attuale",
        "Integrazione del sistema di booking",
        "Form intelligenti orientati alla conversione",
        "Test A/B su CTA e flussi chiave",
        "Report mensile sui risultati",
      ],
      pricingSectionTitle: "Pacchetti booking & lead",
      pricingFootnote:
        "Compatibile con siti esistenti o nuovi progetti. Il prezzo varia in base a integrazioni e complessità del funnel.",
      pricingTiers: [
        {
          tierId: "single",
          name: "Singolo flusso",
          detail: "Un percorso — prenotazione o richiesta diretta · form + CTA ottimizzati.",
        },
        {
          tierId: "multi",
          name: "Multi-flusso",
          detail: "Più percorsi · integrazione booking · ottimizzazione CTA su tutto il sito.",
        },
        {
          tierId: "full",
          name: "Completo",
          detail: "Funnel end-to-end · A/B test · report mensile sui risultati.",
        },
      ],
    },
    {
      id: "monthly-support",
      title: "Crescita continua e cura",
      description:
        "Aggiornamenti, ottimizzazione e supporto prioritario su tutto lo stack digitale — cosi i sistemi restano al passo del business.",
      details: "Da 2h/mese · Priorita garantita · Report mensile",
      whatYouGet: [
        "Aggiornamenti tecnici e di contenuto",
        "Monitoraggio performance e uptime",
        "Ottimizzazioni continue di conversione",
        "Priorita su nuove richieste",
        "Report mensile chiaro",
      ],
      pricingSectionTitle: "Piani di supporto",
      pricingFootnote:
        "Canone mensile. Ore non utilizzate non si accumulano — si rinnovano ogni mese.",
      pricingTiers: [
        {
          tierId: "essential",
          name: "Essential",
          detail: "~2 ore/mese · aggiornamenti · monitoraggio base · risposta prioritaria.",
        },
        {
          tierId: "growth",
          name: "Growth",
          detail: "~5 ore/mese · ottimizzazione continua · report mensile.",
        },
        {
          tierId: "priority",
          name: "Priority",
          detail: "~10 ore/mese · massima priorità · report dettagliato.",
        },
      ],
    },
    {
      id: "photo-video",
      title: "Produzione contenuti",
      description:
        "Produzione foto e video per web, campagne e social — brief, riprese, editing e deliverable pronti all'uso.",
      details: "Sessioni in location · Audio dove serve · Export per web e social",
      whatYouGet: [
        "Brief con shot list e tempistiche chiare",
        "Riprese foto e video con videografo professionista",
        "Editing (taglio, colore, formati verticali/orizzontali)",
        "Consegna file pronti per hero, menu digitali e campagne",
        "Licenza d'uso per marketing online (come da contratto)",
      ],
      portfolioUrl2: "https://levkaplan-video.framer.website",
      portfolioLinkLabel2: "Portfolio videografo",
      pricingSectionTitle: "Piani tariffari (servizio dedicato)",
      pricingFootnote:
        "Importi indicativi: si definiscono in preventivo in base a location, durata e diritti di utilizzo.",
      pricingTiers: [
        {
          tierId: "half-day",
          name: "Half day",
          detail: "Fino a 4 ore · foto o video · selezione e editing base · ideale per menu e social.",
        },
        {
          tierId: "full-day",
          name: "Full day",
          detail: "Giornata intera · foto + video · più varianti per campagne e sito.",
        },
        {
          tierId: "retainer",
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
    buy: "Ordina",
    about: "Chi siamo",
  },
  hero: {
    eyebrow: "Studio Digitale",
    headline: "Your business.\nBuilt to work.\nDesigned to impress.",
    subtitle: "",
    lead: "Sistemi digitali, automazione dei processi, siti web e produzione di contenuti.",
    primaryCta: "Vedi i progetti",
    secondaryCta: "Richiedi audit gratuito",
    buyCta: "Ordina servizi",
    buyCtaShort: "Ordina",
    socialProof: "4 progetti · Disponibile per nuovi clienti",
    mockupCaption: "Il tuo miglior biglietto da visita",
    chipHighlight: "Chiavi in mano",
    chipAvailability: "Waiting for you",
    chipAvailabilitySub: "digital studio",
  },
  trust: [
    "Sistemi digitali che collegano",
    "Automazione che fa risparmiare tempo",
    "Siti che convertono",
    "Contenuti che costruiscono fiducia",
  ],
  proof: {
    eyebrow: "In numeri",
    items: [
      { value: "1h", label: "Tempo di risposta medio" },
      { value: "100%", label: "approccio unico" },
      { value: "4", label: "direzioni diverse\nsistemi · automazione · web · contenuti" },
      { value: "26", label: "Servizi e moduli disponibili" },
    ],
    footnote: { value: "2 sett.", label: "Avvio medio progetto" },
  },
  problem: {
    eyebrow: "01 — Perche conta",
    title:
      "Quasi tutti i business hanno strumenti.\nQuasi nessuno ha un sistema digitale che funziona davvero.",
    body: "Canali sparsi, processi manuali, una presenza web debole e contenuti che non vendono: questo gap costa tempo e clienti.\n\nColleghiamo sistemi digitali, automatizziamo i processi, costruiamo siti e produciamo contenuti perche il business funzioni meglio e comunichi al livello giusto.",
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
    eyebrow: "Prima e dopo · primo schermo",
    title: "Come cambia il primo schermo dopo un redesign mirato.",
    subtitle:
      "Esempi interattivi da settori diversi — hotel, ristorante, bar, business locale e progetto su misura. Confronta come migliorano gerarchia, messaggio e invito all'azione. Trascina il bordo dorato.",
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
  servicesLead: "Sistemi · Automazione · Siti · Contenuti",
  processSection: {
    eyebrow: "Processo",
    title: "Come trasformiamo il caos digitale in un asset di business",
    subtitle:
      "Sistemi, automazione, web e contenuti in un unico metodo guidato dal business — non solo un bel sito.",
    stepLabel: "Step",
    footerNote:
      "Ogni progetto è flessibile: processo, design e funzionalità si adattano alle esigenze reali di ogni cliente.",
  },
  impact: {
    label: "Perche conta",
    items: [
      {
        title: "Sistemi che collegano le operazioni",
        body: "Portali, dashboard e prodotti digitali che tolgono il lavoro da chat e fogli di calcolo.",
        note: "Sistemi digitali",
      },
      {
        title: "Automazione che fa risparmiare ore",
        body: "Prenotazioni, richieste e flussi ripetitivi gestiti in modo chiaro — meno lead persi, meno follow-up manuale.",
        note: "Automazione dei processi",
      },
      {
        title: "Siti che convertono",
        body: "La presenza web costruisce ancora fiducia. Progettiamo e aggiorniamo siti che trasformano attenzione in azione.",
        note: "Siti web",
      },
      {
        title: "Contenuti che costruiscono fiducia",
        body: "Foto, video e asset pronti per web e campagne — cosi il brand appare solido quanto opera.",
        note: "Produzione contenuti",
      },
    ],
  },
  audit: {
    title: "Vuoi sapere cosa frena\nil tuo business?",
    body: "Analizziamo sistemi, processi, sito e contenuti — e ti diciamo esattamente cosa migliorare.",
    cta: "Richiedi il tuo audit",
    meta: "Rispondiamo entro 1 ora · Gratuito · Decidi tu i prossimi passi",
    freeBadge: "FREE",
  },
  about: {
    eyebrow: "Chi siamo",
    title: "Chi siamo?",
    bio: "Siamo un piccolo studio digitale. Creiamo l'ambiente digitale di cui il business ha bisogno: sistemi e piattaforme, automazione dei processi, siti e interfacce, piu contenuti visivi e sviluppo continuo del prodotto. Non solo belli — tutto e costruito per risultati di business concreti.\n\nNon lavoriamo con 30 clienti alla volta. Seguiamo pochi progetti, trattando ogni business come se fosse il nostro.",
    pills: ["Disponibile per nuovi progetti"],
  },
  contact: {
    label: "Iniziamo",
    title: "Un ambiente digitale per business che non vogliono essere come tutti.",
    body: "Dopo il tuo messaggio ricevi una risposta chiara con prossimi passi, tempistiche e fattibilita.",
    compactTitle: "Richiedi il tuo audit gratuito",
    emailLabel: "Email",
    whatsappLabel: "WhatsApp · Rispondiamo entro 1h",
    availability: "Attualmente disponibile per nuovi clienti",
    cart: {
      eyebrow: "La tua selezione",
      title: "Servizi scelti",
      addonsLabel: "Moduli aggiuntivi",
      continueSearch: "Continua a scegliere",
      removeItem: "Rimuovi",
    },
    form: {
      name: "Nome e cognome",
      email: "Email",
      business: "Nome del business",
      businessType: "Tipo di business",
      siteUrl: "URL sito o prodotto",
      brief: "Descrivi brevemente cosa cerchi",
      source: "Come ci hai trovato?",
      submit: "Invia messaggio",
      submitAudit: "Richiedi audit gratuito",
      submitting: "Invio in corso...",
      success: "Ti rispondiamo entro 1 ora.",
      successTitle: "La tua richiesta è stata inviata",
      successClose: "Chiudi",
      submitError: "Invio non riuscito. Scrivici a {email} e ti rispondiamo subito.",
      auditBriefPlaceholder: "Cosa non funziona nel tuo setup digitale — sistemi, processi, sito o contenuti?",
      optional: "facoltativo",
      options: {
        restaurant: "Ristorazione / hospitality",
        hotel: "Hotel",
        bar: "Bar / locale",
        other: "Altro / servizi",
        google: "Google",
        referral: "Passaparola",
        social: "Social",
      },
      errors: {
        required: "Campo obbligatorio",
        invalidEmail: "Inserisci un'email valida",
        invalidUrl: "Inserisci un URL valido (es. https://tuosito.it)",
      },
    },
  },
  orderPage: {
    eyebrow: "Ordine",
    title: "Scegli i servizi",
    subtitle:
      "Seleziona una o piu opzioni — riceverai un preventivo personalizzato entro 1 ora.",
    fromLabel: "da",
    plusLabel: "+",
    selectHint: "Seleziona almeno un servizio per continuare, oppure scrivici direttamente.",
    proceedCta: "Richiedi preventivo",
    footnote:
      "Dopo la richiesta ricevi una risposta con scope, tempi e costo finale. Nessun pagamento automatico.",
    estimatedLabel: "Stima indicativa",
    addonsSectionTitle: "Moduli aggiuntivi",
    aboutServiceCta: "Info sul servizio",
    trust: {
      timeline: "Tempi tipici: 4–8 settimane",
      deposit: "Acconto 30% all'avvio",
      processLink: "Come lavoriamo",
      testimonial:
        "«Risposta rapida, scope chiaro — esattamente il partner digitale che cercavamo.»",
    },
  },
  pricingAddons: {
    eyebrow: "Moduli",
    title: "Estendi il progetto",
    subtitle:
      "Aggiungi funzionalita al pacchetto base. I moduli si scelgono in base alle esigenze del progetto.",
    footnote:
      "Il preventivo finale per ogni modulo viene definito dopo il brief.",
    categories: [
      {
        id: "websites",
        title: "Siti web",
        items: [
          { id: "corporate", label: "Siti aziendali", info: "Multi-pagina con team, servizi e SEO." },
          { id: "promo", label: "Promo", info: "Sito a breve termine per lanci e campagne." },
          { id: "landing", label: "Landing page", info: "Una pagina, un obiettivo, massima conversione." },
          { id: "media-blog", label: "Media e blog", info: "Articoli, categorie, tag e RSS." },
          { id: "no-code", label: "No/Low-code", info: "Webflow, Framer o Tilda — consegna rapida." },
        ],
      },
      {
        id: "products",
        title: "Prodotti digitali",
        items: [
          { id: "web-service", label: "Web service", info: "Dashboard, booking engine, marketplace." },
          { id: "ecommerce", label: "E-commerce", info: "Shop con carrello, pagamenti e inventario." },
          { id: "client-portal", label: "Area riservata", info: "Spazio clienti per ordini e documenti." },
          { id: "chatbot", label: "Chatbot", info: "Flussi automatizzati per supporto e lead." },
          { id: "intranet", label: "Intranet", info: "Portali interni per team e documenti." },
          { id: "mobile-app", label: "App mobile", info: "iOS e Android con React Native o Flutter." },
        ],
      },
      {
        id: "design",
        title: "Design",
        items: [
          { id: "ux-ui", label: "UX & UI", info: "Wireframe e design d'interfaccia." },
          { id: "branding", label: "Branding", info: "Logo, palette, tipografia e identita." },
          { id: "motion-sound", label: "Motion & Sound", info: "Animazioni e identita sonora." },
          { id: "ux-research", label: "UX Research", info: "Interviste, test e decisioni data-driven." },
        ],
      },
      {
        id: "development",
        title: "Sviluppo",
        items: [
          { id: "cms", label: "CMS", info: "Gestione contenuti autonoma." },
          { id: "multilingual", label: "Multilingua", info: "Per ogni lingua aggiuntiva." },
          { id: "backend", label: "Backend / API", info: "Logica server, database e autenticazione." },
          { id: "qa", label: "Quality Assurance", info: "Test su dispositivi e browser." },
          { id: "devops", label: "DevOps", info: "CI/CD, hosting e monitoraggio." },
          { id: "seo-extended", label: "SEO esteso", info: "Ottimizzazione avanzata e struttura." },
        ],
      },
    ],
  },
  aboutPage: {
    backToHome: "Torna alla home",
  },
  privacyPage: {
    title: "Informativa sulla privacy",
    lastUpdated: "Ultimo aggiornamento: giugno 2026",
    backToHome: "Torna alla home",
    sections: [
      {
        heading: "Titolare del trattamento",
        body: "DormUp Studio digital studio — contatto: dormup.it@gmail.com.",
      },
      {
        heading: "Dati raccolti",
        body: "Raccogliamo i dati che invii volontariamente tramite i moduli di contatto: nome, email, nome del business, tipo di attività, URL del sito (se fornito), breve descrizione del progetto e servizi selezionati.",
      },
      {
        heading: "Finalità e base giuridica",
        body: "I dati sono trattati per rispondere alle richieste, preparare preventivi e audit gratuiti. Base giuridica: esecuzione di misure precontrattuali e consenso implicito inviando il modulo (art. 6 GDPR).",
      },
      {
        heading: "Conservazione",
        body: "Conserviamo i dati per il tempo necessario a gestire la richiesta e per un massimo di 24 mesi, salvo obblighi di legge diversi.",
      },
      {
        heading: "Diritti dell'interessato",
        body: "Puoi richiedere accesso, rettifica, cancellazione, limitazione o opposizione scrivendo a dormup.it@gmail.com. Hai diritto di reclamo al Garante per la protezione dei dati personali.",
      },
      {
        heading: "Cookie e analytics",
        body: "Questo sito non utilizza cookie di profilazione di terze parti. Eventuali cookie tecnici servono al funzionamento del sito e della selezione lingua.",
      },
    ],
  },
  footer: {
    description: "Studio digitale per sistemi, automazione, siti e contenuti.",
    links: "Link rapidi",
    location: "Digital Studio",
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
    popularLabel: "Piu scelto",
    orderCta: "Richiedi il servizio",
  },
  servicesPage: {
    eyebrow: "Servizi",
    title: "Cosa costruiamo",
    subtitle: "Sistemi digitali, automazione dei processi, siti web e produzione contenuti — end to end.",
    techStack: "Stack: Next.js · React · TypeScript · Tailwind CSS · Framer Motion",
    viewAll: "Tutti i servizi",
    pricingNote:
      "Ogni progetto viene quotato su misura dopo il brief. I moduli aggiuntivi si scelgono in base alle esigenze del progetto.",
    categories: [
      {
        title: "Siti web",
        items: [
          { label: "Siti aziendali", info: "Sito istituzionale multi-pagina con team, servizi e SEO ottimizzato." },
          { label: "Promo", info: "Sito a breve termine per lanciare un'offerta, evento o campagna." },
          { label: "Landing page", info: "Pagina singola ad alta conversione con un obiettivo e una CTA chiara." },
          { label: "Media e blog", info: "Sito editoriale con articoli, categorie, tag e feed RSS." },
          { label: "No/Low-code", info: "Consegna rapida tramite Webflow, Framer o Tilda — senza dev pesante." },
        ],
      },
      {
        title: "Prodotti digitali",
        items: [
          { label: "Web service", info: "Tool web interattivi: dashboard, prenotazioni, marketplace." },
          { label: "App mobile", info: "App iOS e Android native con React Native o Flutter." },
          { label: "Intranet", info: "Portali interni per team: wiki, documenti, comunicazioni." },
          { label: "Area riservata", info: "Spazio clienti protetto per ordini, progetti e documenti." },
          { label: "Chatbot", info: "Flussi automatizzati per assistenza, lead capture e onboarding." },
          { label: "E-commerce", info: "Shop online con carrello, pagamenti e gestione inventario." },
        ],
      },
      {
        title: "Design",
        items: [
          { label: "UX & UI", info: "Wireframe e design d'interfaccia pixel-perfect basati su ricerca utente." },
          { label: "Motion & Sound", info: "Animazioni, micro-interazioni e identità sonora del brand." },
          { label: "Branding", info: "Logo, palette, tipografia e sistema di identità visiva completo." },
          { label: "UX Research", info: "Interviste, test di usabilità e decisioni basate sui dati." },
        ],
      },
      {
        title: "Sviluppo",
        items: [
          { label: "Analisi di sistema", info: "Requisiti, specifiche tecniche e pianificazione dell'architettura." },
          { label: "Frontend", info: "Interfacce React/Next.js — veloci, accessibili, pronte per la produzione." },
          { label: "Backend", info: "API, database, autenticazione e logica server scalabile." },
          { label: "Sviluppo mobile", info: "App cross-platform con performance fluide su iOS e Android." },
          { label: "Quality Assurance", info: "Test manuali e automatizzati su dispositivi, browser e scenari reali." },
          { label: "DevOps", info: "CI/CD, hosting cloud, monitoraggio e deploy senza downtime." },
        ],
      },
    ],
  },
  workPage: {
    eyebrow: "Lavori",
    title: "Tutti i progetti",
    subtitle: "Una selezione di concept, prototipi e progetti pronti per il cliente.",
    viewAll: "Vedi tutti i lavori",
    backToWork: "Torna ai progetti",
    visitLiveSite: "Visita il sito",
    viewRepo: "Vedi su GitHub",
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
      id: "porto-sole",
      name: "Porto Sole",
      subtitle: "Restaurant & bar on the pier",
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
      subtitle: "Seafront hotel · direct booking",
      problem:
        "The hotel needed a polished direct-booking experience that could communicate location, rooms, services and exclusive offers without sending guests back to third-party booking sites.",
      solution:
        "A conversion-focused hotel website with immersive hero, room highlights, service sections, guest reviews, packages and a guided booking flow.",
      businessImpact:
        "Live prototype positions Aurelia del Mar as a premium seafront stay and gives guests a clear reason to book direct.",
    },
    {
      id: "mare-vivo",
      name: "Mare Vivo",
      nameTagline: "Fresh Seafood. Mediterranean Soul.",
      subtitle: "Mediterranean seafood · Bari",
      problem:
        "The restaurant needed a digital presence that communicated fresh Adriatic catch, the family story and an effortless reservation path on mobile.",
      solution:
        "Coastal editorial design with featured menu, guest reviews, bilingual EN/IT content and an integrated reservation flow via WhatsApp and direct booking form.",
      businessImpact:
        "Live site that positions Mare Vivo as authentic Italian coastal dining and converts first-time visitors into table reservations.",
    },
    {
      id: "podlopuhom-jewelry",
      name: "Pod Lopuhom",
      nameTagline: "Handmade Jewelry",
      subtitle: "Botanical jewelry · e-commerce",
      problem:
        "The artisan was taking orders only via DMs, with no proper showroom to present collections, pricing and availability to an international audience.",
      solution:
        "Multi-language gallery (EN/RU/IT) with clear categories, product detail and direct WhatsApp / Instagram CTAs to close the order.",
      businessImpact:
        "Live site that turned a social profile into a professional brand, increasing trust, direct orders and visibility on new markets.",
    },
    {
      id: "solovyev-store",
      name: "SOLOVYEV STORE",
      nameTagline: "Streetwear & Sneakers Consignment",
      subtitle: "Premium streetwear · buy / sell / trade",
      problem:
        "The shop lived mostly on Instagram and was hard to find on Google. Stock was unclear, and WhatsApp orders arrived as messy chats without clear product or size details.",
      solution:
        "We built a clear online store: product pages, stock status, an easy panel to manage the catalog, customer accounts, and tidy WhatsApp orders with everything needed to close the sale.",
      businessImpact:
        "A live store people can find and shop from — clearer orders, better control of what's in stock, and less back-and-forth in chat.",
    },
  ],
  services: [
    {
      id: "premium-site",
      title: "Websites & web products",
      description:
        "Custom websites and web products — from brand sites to conversion-focused experiences. Mobile-first, fast, built to work.",
      details: "From wireframe to launch · Optional CMS · Base SEO included",
      whatYouGet: [
        "Premium design and visual identity",
        "Fast, SEO-ready Next.js development",
        "Mobile-first optimized for conversion",
        "Optional CMS for content management",
        "Launch and post-live support included",
      ],
      pricingSectionTitle: "Website packages",
      pricingFootnote:
        "Indicative starting prices. Final quote depends on pages, integrations and timeline.",
      pricingTiers: [
        {
          tierId: "starter",
          name: "Starter",
          detail: "Landing · 3–5 screens · 1 language · base SEO included.",
        },
        {
          tierId: "business",
          name: "Business",
          detail: "6–10 pages · CMS · forms · base SEO · ideal for SMBs and hospitality.",
        },
        {
          tierId: "premium",
          name: "Premium",
          detail: "Full site · multilingual · booking · animations · maximum conversion.",
        },
      ],
    },
    {
      id: "redesign",
      title: "Systems upgrade & redesign",
      description:
        "We upgrade existing digital presence into a clearer system — structure, UX, performance and conversion paths.",
      details: "Audit · Strategy · Implementation",
      whatYouGet: [
        "Full audit of your current site",
        "New information architecture and UX",
        "Updated, premium visual identity",
        "Content migration without loss",
        "Analytics and tracking setup",
      ],
      pricingSectionTitle: "Redesign packages",
      pricingFootnote:
        "Cost depends on current site state, page count and customization level.",
      pricingTiers: [
        {
          tierId: "audit",
          name: "Audit only",
          detail: "Full analysis · priority report · improvement roadmap.",
        },
        {
          tierId: "standard",
          name: "Standard",
          detail: "Key screens redesign + implementation · new UX and visual.",
        },
        {
          tierId: "full",
          name: "Full",
          detail: "Complete redesign · content migration · analytics and tracking.",
        },
      ],
    },
    {
      id: "booking-flow",
      title: "Process automation",
      description:
        "We automate bookings, enquiries and repeat workflows so leads don't get lost in chats and calendars.",
      details: "Flows · Integrations · Smart forms · Reporting",
      whatYouGet: [
        "Analysis of your current booking funnel",
        "Booking system integration",
        "Smart conversion-oriented forms",
        "A/B testing on CTAs and key flows",
        "Monthly results report",
      ],
      pricingSectionTitle: "Booking & lead packages",
      pricingFootnote:
        "Works with existing or new sites. Price varies by integrations and funnel complexity.",
      pricingTiers: [
        {
          tierId: "single",
          name: "Single flow",
          detail: "One path — booking or enquiry · optimized form + CTA.",
        },
        {
          tierId: "multi",
          name: "Multi-flow",
          detail: "Multiple paths · booking integration · site-wide CTA optimization.",
        },
        {
          tierId: "full",
          name: "Full",
          detail: "End-to-end funnel · A/B testing · monthly results report.",
        },
      ],
    },
    {
      id: "monthly-support",
      title: "Ongoing growth & care",
      description:
        "Updates, optimization and priority support across your digital stack — so systems keep pace with the business.",
      details: "From 2h/month · Priority guaranteed · Monthly report",
      whatYouGet: [
        "Technical and content updates",
        "Performance and uptime monitoring",
        "Continuous conversion optimization",
        "Priority on new requests",
        "Clear monthly report",
      ],
      pricingSectionTitle: "Support plans",
      pricingFootnote: "Monthly retainer. Unused hours do not roll over.",
      pricingTiers: [
        {
          tierId: "essential",
          name: "Essential",
          detail: "~2h/month · updates · basic monitoring · priority response.",
        },
        {
          tierId: "growth",
          name: "Growth",
          detail: "~5h/month · continuous optimization · monthly report.",
        },
        {
          tierId: "priority",
          name: "Priority",
          detail: "~10h/month · top priority · detailed report.",
        },
      ],
    },
    {
      id: "photo-video",
      title: "Content production",
      description:
        "Photo and video production for web, campaigns and social — brief, shoot, edit and deliverables ready to use.",
      details: "On-location sessions · Audio when needed · Web & social deliverables",
      whatYouGet: [
        "Creative brief and shot list aligned with your goals",
        "Professional photo and video capture",
        "Editing (cut, grade, vertical and horizontal formats)",
        "Files ready for hero sections, digital menus, and campaigns",
        "Usage rights for digital marketing (per agreement)",
      ],
      portfolioUrl2: "https://levkaplan-video.framer.website",
      portfolioLinkLabel2: "Videographer portfolio",
      pricingSectionTitle: "Pricing tiers (standalone service)",
      pricingFootnote:
        "Figures are quoted per brief depending on location, duration, and usage rights.",
      pricingTiers: [
        {
          tierId: "half-day",
          name: "Half day",
          detail: "Up to 4 hours · photo or video · curated selects and base edit · ideal for menus and social.",
        },
        {
          tierId: "full-day",
          name: "Full day",
          detail: "Full shoot day · photo + video · more variants for site and campaigns.",
        },
        {
          tierId: "retainer",
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
    buy: "Order",
    about: "About us",
  },
  hero: {
    eyebrow: "Digital Studio",
    headline: "Your business.\nBuilt to work.\nDesigned to impress.",
    subtitle: "",
    lead: "Digital systems, process automation, websites and content production.",
    primaryCta: "View projects",
    secondaryCta: "Request free audit",
    buyCta: "Order services",
    buyCtaShort: "Order",
    socialProof: "4 projects · Available for new clients",
    mockupCaption: "Your best business card",
    chipHighlight: "Turnkey work",
    chipAvailability: "Waiting for you",
    chipAvailabilitySub: "digital studio",
  },
  trust: [
    "Digital systems that connect",
    "Process automation that saves time",
    "Websites that convert",
    "Content that builds trust",
  ],
  proof: {
    eyebrow: "By the numbers",
    items: [
      { value: "1h", label: "Average response time" },
      { value: "100%", label: "unique approach" },
      { value: "4", label: "different directions\nsystems · automation · web · content" },
      { value: "26", label: "Services & add-on modules" },
    ],
    footnote: { value: "2 wks", label: "Average project kickoff" },
  },
  problem: {
    eyebrow: "01 — Why it matters",
    title:
      "Most businesses have tools.\nAlmost none have a digital system that works.",
    body: "Scattered channels, manual processes, a weak web presence and content that doesn't sell — that gap costs time and customers.\n\nWe connect digital systems, automate processes, build websites and produce content so your business runs better and looks the part.",
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
    eyebrow: "Before & after · first screen",
    title: "How the first screen changes after a focused redesign.",
    subtitle:
      "Interactive examples across sectors — hotel, restaurant, bar, local business and a custom brief-led layout. Compare how hierarchy, message and call-to-action improve. Drag the gold divider.",
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
  servicesLead: "Systems · Automation · Websites · Content",
  processSection: {
    eyebrow: "Process",
    title: "How we turn digital chaos into a business asset",
    subtitle:
      "Systems, automation, web and content in one business-driven method — not just a pretty site.",
    stepLabel: "Step",
    footerNote:
      "Every project is flexible — the process, design, and functionality are customized around the real needs of each client.",
  },
  impact: {
    label: "Why it matters",
    items: [
      {
        title: "Systems that connect operations",
        body: "Portals, dashboards and product surfaces that stop work from living in chats and spreadsheets.",
        note: "Digital systems",
      },
      {
        title: "Automation that saves hours",
        body: "Booking, enquiries and repeat workflows handled by clear flows — fewer lost leads, less manual follow-up.",
        note: "Process automation",
      },
      {
        title: "Websites that convert",
        body: "A strong web presence still closes trust. We build and upgrade sites that turn attention into action.",
        note: "Websites",
      },
      {
        title: "Content that builds trust",
        body: "Photo, video and assets ready for web and campaigns — so the brand looks as solid as it operates.",
        note: "Content production",
      },
    ],
  },
  audit: {
    title: "Want to know what's\nholding your business back?",
    body: "We review your systems, processes, website and content — and tell you exactly what to improve.",
    cta: "Request your audit",
    meta: "Reply within 1 hour · Free · You decide the next steps",
    freeBadge: "FREE",
  },
  about: {
    eyebrow: "About us",
    title: "Who are we?",
    bio: "We're a small digital studio. We build the digital environment your business needs—systems and platforms, process automation, websites and interfaces, plus visual content and ongoing product development. Not just polished looks: everything is built for real business results.\n\nWe don't work with 30 clients at a time. We take a few projects and treat every business as if it were our own.",
    pills: ["Available for new projects"],
  },
  contact: {
    label: "Let's start",
    title: "A digital environment for businesses that refuse to look generic.",
    body: "After your message you get a clear reply with next steps, timeline and feasibility.",
    compactTitle: "Request your free audit",
    emailLabel: "Email",
    whatsappLabel: "WhatsApp · Reply within 1h",
    availability: "Currently available for new clients",
    cart: {
      eyebrow: "Your selection",
      title: "Selected services",
      addonsLabel: "Add-on modules",
      continueSearch: "Continue browsing services",
      removeItem: "Remove",
    },
    form: {
      name: "Full name",
      email: "Email",
      business: "Business name",
      businessType: "Business type",
      siteUrl: "Website or product URL",
      brief: "Briefly describe what you're looking for",
      source: "How did you find us?",
      submit: "Send message",
      submitAudit: "Request free audit",
      submitting: "Sending...",
      success: "We'll reply within 1 hour.",
      successTitle: "Your request has been sent",
      successClose: "Close",
      submitError: "Could not send. Email us at {email} and we'll reply shortly.",
      auditBriefPlaceholder: "What isn't working in your digital setup — systems, processes, website or content?",
      optional: "optional",
      options: {
        restaurant: "Restaurant / hospitality",
        hotel: "Hotel",
        bar: "Bar / venue",
        other: "Other / services",
        google: "Google",
        referral: "Word of mouth",
        social: "Social",
      },
      errors: {
        required: "Required field",
        invalidEmail: "Enter a valid email address",
        invalidUrl: "Enter a valid URL (e.g. https://yoursite.com)",
      },
    },
  },
  orderPage: {
    eyebrow: "Order",
    title: "Choose your services",
    subtitle:
      "Select one or more options — you'll get a tailored quote within 1 hour.",
    fromLabel: "from",
    plusLabel: "+",
    selectHint: "Select at least one service to continue, or message us directly.",
    proceedCta: "Request a quote",
    footnote:
      "After your request you get scope, timeline and final cost. No automatic payment.",
    estimatedLabel: "Indicative estimate",
    addonsSectionTitle: "Add-on modules",
    aboutServiceCta: "About this service",
    trust: {
      timeline: "Typical timeline: 4–8 weeks",
      deposit: "30% deposit to start",
      processLink: "How we work",
      testimonial:
        "«Fast reply, clear scope — exactly the digital partner we were looking for.»",
    },
  },
  pricingAddons: {
    eyebrow: "Modules",
    title: "Extend your project",
    subtitle:
      "Add capabilities to the base package. Modules are scoped individually after your brief.",
    footnote: "Final quote for each module is set after the brief.",
    categories: [
      {
        id: "websites",
        title: "Websites",
        items: [
          { id: "corporate", label: "Corporate sites", info: "Multi-page with team, services and SEO." },
          { id: "promo", label: "Promo", info: "Short-term site for launches and campaigns." },
          { id: "landing", label: "Landing pages", info: "One page, one goal, maximum conversion." },
          { id: "media-blog", label: "Media & blogs", info: "Articles, categories, tags and RSS." },
          { id: "no-code", label: "No/Low-code", info: "Webflow, Framer or Tilda — fast delivery." },
        ],
      },
      {
        id: "products",
        title: "Digital products",
        items: [
          { id: "web-service", label: "Web services", info: "Dashboards, booking engines, marketplaces." },
          { id: "ecommerce", label: "E-commerce", info: "Shop with cart, payments and inventory." },
          { id: "client-portal", label: "Client portals", info: "Protected space for orders and documents." },
          { id: "chatbot", label: "Chatbots", info: "Automated flows for support and leads." },
          { id: "intranet", label: "Intranets", info: "Internal portals for teams and docs." },
          { id: "mobile-app", label: "Mobile apps", info: "iOS and Android with React Native or Flutter." },
        ],
      },
      {
        id: "design",
        title: "Design",
        items: [
          { id: "ux-ui", label: "UX & UI", info: "Wireframes and interface design." },
          { id: "branding", label: "Branding", info: "Logo, palette, typography and identity." },
          { id: "motion-sound", label: "Motion & Sound", info: "Animations and sonic branding." },
          { id: "ux-research", label: "UX Research", info: "Interviews, tests and data-driven decisions." },
        ],
      },
      {
        id: "development",
        title: "Development",
        items: [
          { id: "cms", label: "CMS", info: "Self-managed content." },
          { id: "multilingual", label: "Multilingual", info: "Per additional language." },
          { id: "backend", label: "Backend / API", info: "Server logic, database and auth." },
          { id: "qa", label: "Quality Assurance", info: "Testing across devices and browsers." },
          { id: "devops", label: "DevOps", info: "CI/CD, hosting and monitoring." },
          { id: "seo-extended", label: "Extended SEO", info: "Advanced optimization and structure." },
        ],
      },
    ],
  },
  aboutPage: {
    backToHome: "Back to home",
  },
  privacyPage: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: June 2026",
    backToHome: "Back to home",
    sections: [
      {
        heading: "Data controller",
        body: "DormUp Studio digital studio — contact: dormup.it@gmail.com.",
      },
      {
        heading: "Data we collect",
        body: "We collect data you voluntarily submit via contact forms: name, email, business name, business type, website URL (if provided), project brief and selected services.",
      },
      {
        heading: "Purpose and legal basis",
        body: "Data is processed to respond to enquiries, prepare quotes and free audits. Legal basis: pre-contractual measures and implicit consent when submitting the form (GDPR Art. 6).",
      },
      {
        heading: "Retention",
        body: "We retain data as long as needed to handle your request, up to 24 months unless legal obligations require otherwise.",
      },
      {
        heading: "Your rights",
        body: "You may request access, rectification, erasure, restriction or objection by emailing dormup.it@gmail.com. You may lodge a complaint with your local data protection authority.",
      },
      {
        heading: "Cookies",
        body: "This site does not use third-party profiling cookies. Technical cookies may be used for site operation and language selection.",
      },
    ],
  },
  footer: {
    description: "Digital studio for systems, automation, websites and content.",
    links: "Quick links",
    location: "Digital Studio",
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
    popularLabel: "Most popular",
    orderCta: "Request this service",
  },
  servicesPage: {
    eyebrow: "Services",
    title: "What we build",
    subtitle: "Digital systems, process automation, websites and content production — end to end.",
    techStack: "Stack: Next.js · React · TypeScript · Tailwind CSS · Framer Motion",
    viewAll: "All services",
    pricingNote:
      "Every project is quoted individually after the brief. Add-on modules are selected based on your needs.",
    categories: [
      {
        title: "Websites",
        items: [
          { label: "Corporate sites", info: "Multi-page brand site with team, services, contacts and SEO." },
          { label: "Promo", info: "Short-term campaign site to push a launch, event or offer." },
          { label: "Landing pages", info: "Single-focus conversion page — one goal, one clear CTA." },
          { label: "Media & blogs", info: "Content-driven site with articles, categories, tags and RSS." },
          { label: "No/Low-code", info: "Fast delivery via Webflow, Framer or Tilda — no heavy dev needed." },
        ],
      },
      {
        title: "Digital products",
        items: [
          { label: "Web services", info: "Browser-based tools: dashboards, booking engines, marketplaces." },
          { label: "Mobile apps", info: "iOS & Android apps built with React Native or Flutter." },
          { label: "Intranets", info: "Internal portals for teams: wikis, docs and announcements." },
          { label: "Client portals", info: "Password-protected spaces for clients to track orders or projects." },
          { label: "Chatbots", info: "Automated chat flows for support, lead capture or onboarding." },
          { label: "E-commerce", info: "Online stores with cart, checkout, payments and inventory." },
        ],
      },
      {
        title: "Design",
        items: [
          { label: "UX & UI", info: "Research-backed wireframes and pixel-perfect interface design." },
          { label: "Motion & Sound", info: "Animated transitions, micro-interactions and sonic branding." },
          { label: "Branding", info: "Logo, color palette, typography and full brand identity system." },
          { label: "UX Research", info: "User interviews, usability tests and data-driven design decisions." },
        ],
      },
      {
        title: "Development",
        items: [
          { label: "Systems analysis", info: "Requirements mapping, technical specs and architecture planning." },
          { label: "Frontend dev", info: "React/Next.js interfaces — fast, accessible, production-ready." },
          { label: "Backend dev", info: "APIs, databases, auth and server logic built to scale." },
          { label: "Mobile dev", info: "Cross-platform native apps with smooth performance." },
          { label: "Quality Assurance", info: "Manual and automated testing across devices and browsers." },
          { label: "DevOps", info: "CI/CD pipelines, cloud hosting, monitoring and zero-downtime deploys." },
        ],
      },
    ],
  },
  workPage: {
    eyebrow: "Work",
    title: "All projects",
    subtitle: "A selection of concepts, prototypes and client-ready projects.",
    viewAll: "View all work",
    backToWork: "Back to projects",
    visitLiveSite: "Visit live site",
    viewRepo: "View on GitHub",
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
      id: "porto-sole",
      name: "Porto Sole",
      subtitle: "Restaurant & bar sur la jetée",
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
      subtitle: "Hotel en bord de mer · reservation directe",
      problem:
        "L'hotel avait besoin d'une experience de reservation directe capable de presenter emplacement, chambres, services et offres exclusives sans renvoyer les clients vers des plateformes externes.",
      solution:
        "Site hotelier oriente conversion avec hero immersive, chambres mises en avant, services, avis clients, forfaits et parcours de booking guide.",
      businessImpact:
        "Prototype live qui positionne Aurelia del Mar comme sejour premium en bord de mer et donne aux clients une raison claire de reserver en direct.",
    },
    {
      id: "mare-vivo",
      name: "Mare Vivo",
      nameTagline: "Fresh Seafood. Mediterranean Soul.",
      subtitle: "Fruits de mer mediterraneens · Bari",
      problem:
        "Le restaurant avait besoin d'une presence en ligne qui transmette le poisson frais de l'Adriatique, l'histoire familiale et un parcours de reservation clair sur mobile.",
      solution:
        "Design editorial cotier avec menu mis en avant, avis clients, contenu bilingue EN/IT et flux de reservation via WhatsApp et formulaire direct.",
      businessImpact:
        "Site live qui positionne Mare Vivo comme une adresse cotiere italienne authentique et convertit les visiteurs en reservations.",
    },
    {
      id: "podlopuhom-jewelry",
      name: "Pod Lopuhom",
      nameTagline: "Bijoux faits main",
      subtitle: "Bijoux botaniques · e-commerce",
      problem:
        "L'artisane prenait les commandes uniquement par messages, sans vitrine claire pour presenter collections, prix et disponibilites a un public international.",
      solution:
        "Galerie multilingue (EN/RU/IT) avec categories claires, fiche produit et CTA directs vers WhatsApp et Instagram pour finaliser la commande.",
      businessImpact:
        "Site live qui a transforme un profil social en marque professionnelle, en augmentant la confiance, les commandes directes et la visibilite sur de nouveaux marches.",
    },
    {
      id: "solovyev-store",
      name: "SOLOVYEV STORE",
      nameTagline: "Streetwear & Sneakers Consignment",
      subtitle: "Streetwear premium · buy / sell / trade",
      problem:
        "La boutique vivait surtout sur Instagram et etait difficile a trouver sur Google. Les stocks n'etaient pas clairs et les commandes WhatsApp arrivaient en messages confus, sans details nets sur le produit ou la taille.",
      solution:
        "Nous avons cree une boutique en ligne claire : pages produit, etats de stock, un panneau simple pour gerer le catalogue, des comptes clients et des messages WhatsApp ranges avec tout ce qu'il faut pour conclure la vente.",
      businessImpact:
        "Un site live ou les clients trouvent et achettent plus facilement — commandes plus claires, catalogue sous controle et moins d'allers-retours en chat.",
    },
  ],
  services: [
    {
      id: "premium-site",
      title: "Sites web et produits digitaux",
      description:
        "Sites et produits web sur mesure — du site de marque aux experiences orientees conversion. Mobile-first, rapide, concu pour fonctionner.",
      details: "Du wireframe a la production · CMS optionnel · SEO de base inclus",
      whatYouGet: [
        "Design et identite visuelle premium",
        "Developpement Next.js rapide et SEO-ready",
        "Mobile-first optimise pour la conversion",
        "CMS optionnel pour la gestion de contenu",
        "Lancement et support post-live inclus",
      ],
      pricingSectionTitle: "Forfaits site web",
      pricingFootnote:
        "Montants indicatifs « a partir de ». Le devis final depend des pages, integrations et delais.",
      pricingTiers: [
        { tierId: "starter", name: "Starter", detail: "Landing · 3–5 ecrans · 1 langue · SEO de base." },
        { tierId: "business", name: "Business", detail: "6–10 pages · CMS · formulaires · SEO de base." },
        { tierId: "premium", name: "Premium", detail: "Site complet · multilingue · booking · animations." },
      ],
    },
    {
      id: "redesign",
      title: "Upgrade systemes et redesign",
      description:
        "Nous faisons evoluer la presence digitale existante en un systeme plus clair — structure, UX, performance et parcours de conversion.",
      details: "Audit · Strategie · Implementation",
      whatYouGet: [
        "Audit complet du site actuel",
        "Nouvelle architecture de l'information",
        "Identite visuelle mise a jour, premium",
        "Migration de contenu sans perte",
        "Configuration analytics et tracking",
      ],
      pricingSectionTitle: "Forfaits redesign",
      pricingFootnote: "Le cout depend de l etat actuel du site et du nombre de pages.",
      pricingTiers: [
        { tierId: "audit", name: "Audit seul", detail: "Analyse complete · rapport priorise · feuille de route." },
        { tierId: "standard", name: "Standard", detail: "Redesign des ecrans cles + implementation." },
        { tierId: "full", name: "Complet", detail: "Redesign total · migration contenu · analytics." },
      ],
    },
    {
      id: "booking-flow",
      title: "Automatisation des processus",
      description:
        "Nous automatisons reservations, demandes et workflows repetitifs pour que les leads ne se perdent plus dans les chats et agendas.",
      details: "Flux · Integrations · Formulaires intelligents · Reporting",
      whatYouGet: [
        "Analyse du funnel de booking actuel",
        "Integration du systeme de booking",
        "Formulaires intelligents orientes conversion",
        "A/B testing sur CTAs et flux cles",
        "Rapport mensuel des resultats",
      ],
      pricingSectionTitle: "Forfaits booking & lead",
      pricingFootnote: "Compatible site existant ou nouveau projet.",
      pricingTiers: [
        { tierId: "single", name: "Flux unique", detail: "Reservation ou demande · formulaire + CTA optimises." },
        { tierId: "multi", name: "Multi-flux", detail: "Plusieurs parcours · integration booking · CTA site-wide." },
        { tierId: "full", name: "Complet", detail: "Funnel complet · A/B test · rapport mensuel." },
      ],
    },
    {
      id: "monthly-support",
      title: "Croissance continue et accompagnement",
      description:
        "Mises a jour, optimisation et support prioritaire sur votre stack digital — pour que les systemes suivent le rythme du business.",
      details: "A partir de 2h/mois · Priorite garantie · Rapport mensuel",
      whatYouGet: [
        "Mises a jour techniques et de contenu",
        "Monitoring performance et uptime",
        "Optimisations continues de conversion",
        "Priorite sur les nouvelles demandes",
        "Rapport mensuel clair",
      ],
      pricingSectionTitle: "Plans de support",
      pricingFootnote: "Forfait mensuel. Les heures non utilisees ne sont pas reportees.",
      pricingTiers: [
        { tierId: "essential", name: "Essential", detail: "~2h/mois · mises a jour · monitoring de base." },
        { tierId: "growth", name: "Growth", detail: "~5h/mois · optimisation continue · rapport mensuel." },
        { tierId: "priority", name: "Priority", detail: "~10h/mois · priorite maximale · rapport detaille." },
      ],
    },
    {
      id: "photo-video",
      title: "Production de contenus",
      description:
        "Production photo et video pour le web, les campagnes et les reseaux — brief, shoot, montage et livrables prets a l'emploi.",
      details: "Seances sur site · Audio si besoin · Livrables web et social",
      whatYouGet: [
        "Brief créatif et liste de plans",
        "Prises de vue photo et video professionnelles",
        "Montage (decoupage, etalonnage, formats)",
        "Fichiers prets pour hero, menus digitaux et campagnes",
        "Droits d utilisation marketing digital (selon contrat)",
      ],
      portfolioUrl2: "https://levkaplan-video.framer.website",
      portfolioLinkLabel2: "Portfolio vidéaste",
      pricingSectionTitle: "Grilles tarifaires (service autonome)",
      pricingFootnote:
        "Montants indicatifs : devis selon lieu, duree et droits d exploitation.",
      pricingTiers: [
        { tierId: "half-day", name: "Demi-journee", detail: "Jusqu a 4h · photo ou video · montage de base." },
        { tierId: "full-day", name: "Journee complete", detail: "Journee pleine · photo + video · variantes campagnes." },
        { tierId: "retainer", name: "Forfait mensuel", detail: "Seances recurrentes · planning contenus." },
      ],
    },
  ],
  process: [
    {
      id: "understand",
      title: "Comprendre",
      summary: "Business, audience, objectifs, freins.",
      description:
        "Nous etudions le business, le public, les objectifs et les freins actuels pour definir ce que le systeme digital — sites et integrations — doit accomplir.",
    },
    {
      id: "plan",
      title: "Planifier",
      summary: "Structure, parcours, systemes, priorites.",
      description:
        "Nous definissons la structure, les parcours, les systemes et les fonctionnalites cles selon les besoins reels du client.",
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
      summary: "Sites, systemes, integrations, performance.",
      description:
        "Nous developpons des sites et integrations responsives, rapides et fonctionnels, avec les bons outils connectes.",
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
    buy: "Commander",
    about: "A propos",
  },
  hero: {
    eyebrow: "Studio Digital",
    headline: "Your business.\nBuilt to work.\nDesigned to impress.",
    subtitle: "",
    lead: "Systemes digitaux, automatisation des processus, sites web et production de contenus.",
    primaryCta: "Voir les projets",
    secondaryCta: "Demander un audit",
    buyCta: "Commander des services",
    buyCtaShort: "Commander",
    socialProof: "4 projets · Disponible pour nouveaux clients",
    mockupCaption: "Votre meilleure carte de visite",
    chipHighlight: "Cles en main",
    chipAvailability: "Waiting for you",
    chipAvailabilitySub: "digital studio",
  },
  trust: [
    "Systemes digitaux qui connectent",
    "Automatisation qui fait gagner du temps",
    "Sites qui convertissent",
    "Contenus qui construisent la confiance",
  ],
  proof: {
    eyebrow: "En chiffres",
    items: [
      { value: "1h", label: "Temps de reponse moyen" },
      { value: "100%", label: "approche unique" },
      { value: "4", label: "directions differentes\nsystemes · automatisation · web · contenus" },
      { value: "26", label: "Services et modules disponibles" },
    ],
    footnote: { value: "2 sem.", label: "Demarrage moyen projet" },
  },
  problem: {
    eyebrow: "01 — Pourquoi c'est important",
    title:
      "La plupart des entreprises ont des outils.\nPresque aucune n'a un systeme digital qui fonctionne.",
    body: "Canaux eparpilles, processus manuels, presence web faible et contenus qui ne vendent pas — cela coute du temps et des clients.\n\nNous connectons les systemes, automatisons les processus, construisons des sites et produisons des contenus.",
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
    eyebrow: "Avant et apres · premier ecran",
    title: "Comment le premier ecran change apres un redesign cible.",
    subtitle:
      "Exemples interactifs par secteur — hotel, restaurant, bar, commerce local et projet sur mesure. Comparez l'amelioration de la hierarchie, du message et de l'appel a l'action. Glissez la ligne doree.",
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
  servicesLead: "Systemes · Automatisation · Sites · Contenus",
  processSection: {
    eyebrow: "Processus",
    title: "Comment nous transformons le chaos digital en actif business",
    subtitle:
      "Systemes, automatisation, web et contenus dans une seule methode pilotee par le business — pas juste un beau site.",
    stepLabel: "Etape",
    footerNote:
      "Chaque projet est flexible : processus, design et fonctionnalites s adaptent aux besoins reels de chaque client.",
  },
  impact: {
    label: "Pourquoi c'est important",
    items: [
      {
        title: "Des systemes qui connectent les operations",
        body: "Portails, dashboards et surfaces produit qui sortent le travail des chats et des tableurs.",
        note: "Systemes digitaux",
      },
      {
        title: "Une automatisation qui fait gagner des heures",
        body: "Reservations, demandes et workflows repetitifs geres par des flux clairs — moins de leads perdus, moins de suivi manuel.",
        note: "Automatisation des processus",
      },
      {
        title: "Des sites qui convertissent",
        body: "Une presence web solide construit encore la confiance. Nous creons et ameliorons des sites qui transforment l'attention en action.",
        note: "Sites web",
      },
      {
        title: "Des contenus qui construisent la confiance",
        body: "Photo, video et assets prets pour le web et les campagnes — pour que la marque paraisse aussi solide qu'elle opere.",
        note: "Production de contenus",
      },
    ],
  },
  audit: {
    title: "Vous voulez savoir ce qui\nfreine votre business?",
    body: "Nous analysons systemes, processus, site et contenus — et vous disons exactement quoi ameliorer.",
    cta: "Demander votre audit",
    meta: "Reponse sous 1h · Gratuit · Vous decidez des prochaines etapes",
    freeBadge: "FREE",
  },
  about: {
    eyebrow: "Qui sommes-nous",
    title: "Qui sommes-nous?",
    bio: "Nous sommes un petit studio digital. Nous creons l'environnement digital dont le business a besoin : systemes et plateformes, automatisation des processus, sites et interfaces, plus contenus visuels et developpement continu du produit. Pas seulement beau — tout est pense pour des resultats business concrets.\n\nNous ne travaillons pas avec 30 clients en parallele. Nous suivons quelques projets, en traitant chaque business comme s'il etait le notre.",
    pills: ["Disponible pour nouveaux projets"],
  },
  contact: {
    label: "Commencons",
    title: "Un environnement digital pour les business qui ne veulent pas ressembler a tout le monde.",
    body: "Apres votre message vous recevez une reponse claire avec les prochaines etapes, le timing et la faisabilite.",
    compactTitle: "Demander votre audit gratuit",
    emailLabel: "Email",
    whatsappLabel: "WhatsApp · Reponse sous 1h",
    availability: "Actuellement disponible pour nouveaux clients",
    cart: {
      eyebrow: "Votre selection",
      title: "Services choisis",
      addonsLabel: "Modules additionnels",
      continueSearch: "Continuer la selection",
      removeItem: "Retirer",
    },
    form: {
      name: "Nom et prenom",
      email: "E-mail",
      business: "Nom du business",
      businessType: "Type de business",
      siteUrl: "URL du site ou du produit",
      brief: "Decrivez brievement ce que vous cherchez",
      source: "Comment nous avez-vous trouves?",
      submit: "Envoyer le message",
      submitAudit: "Demander l'audit gratuit",
      submitting: "Envoi en cours...",
      success: "Nous repondons sous 1 heure.",
      successTitle: "Votre demande a ete envoyee",
      successClose: "Fermer",
      submitError: "Envoi echoue. Ecrivez a {email} et nous repondrons rapidement.",
      auditBriefPlaceholder: "Qu'est-ce qui ne fonctionne pas dans votre setup digital — systemes, processus, site ou contenus?",
      optional: "facultatif",
      options: {
        restaurant: "Restaurant / hospitality",
        hotel: "Hotel",
        bar: "Bar / lieu",
        other: "Autre / services",
        google: "Google",
        referral: "Bouche a oreille",
        social: "Reseaux sociaux",
      },
      errors: {
        required: "Champ obligatoire",
        invalidEmail: "Entrez une adresse e-mail valide",
        invalidUrl: "Entrez une URL valide (ex. https://votresite.fr)",
      },
    },
  },
  orderPage: {
    eyebrow: "Commande",
    title: "Choisissez vos services",
    subtitle:
      "Selectionnez une ou plusieurs options — vous recevrez un devis personnalise sous 1 heure.",
    fromLabel: "a partir de",
    selectHint: "Selectionnez au moins un service pour continuer, ou ecrivez-nous directement.",
    proceedCta: "Demander un devis",
    footnote:
      "Apres votre demande vous recevez scope, delais et cout final. Aucun paiement automatique.",
    plusLabel: "+",
    estimatedLabel: "Estimation indicative",
    addonsSectionTitle: "Modules additionnels",
    aboutServiceCta: "A propos du service",
    trust: {
      timeline: "Delai typique : 4–8 semaines",
      deposit: "Acompte 30% au demarrage",
      processLink: "Notre methode",
      testimonial:
        "«Reponse rapide, scope clair — exactement le partenaire digital qu'il nous fallait.»",
    },
  },
  pricingAddons: {
    eyebrow: "Modules",
    title: "Etendez votre projet",
    subtitle: "Ajoutez des fonctionnalites au forfait de base.",
    footnote: "Le devis final de chaque module est etabli apres le brief.",
    categories: [
      {
        id: "websites",
        title: "Sites web",
        items: [
          { id: "corporate", label: "Sites d'entreprise", info: "Multi-pages avec equipe et SEO." },
          { id: "promo", label: "Promo", info: "Site court terme pour lancements." },
          { id: "landing", label: "Landing pages", info: "Une page, un objectif." },
          { id: "media-blog", label: "Medias et blogs", info: "Articles, categories et RSS." },
          { id: "no-code", label: "No/Low-code", info: "Webflow, Framer ou Tilda." },
        ],
      },
      {
        id: "products",
        title: "Systemes digitaux",
        items: [
          { id: "web-service", label: "Services web", info: "Dashboards, booking, marketplaces." },
          { id: "ecommerce", label: "E-commerce", info: "Boutique avec panier et paiements." },
          { id: "client-portal", label: "Espaces clients", info: "Zone securisee pour commandes." },
          { id: "chatbot", label: "Chatbots", info: "Flux automatises support et leads." },
          { id: "intranet", label: "Intranets", info: "Portails internes equipes." },
          { id: "mobile-app", label: "Apps mobiles", info: "iOS et Android." },
        ],
      },
      {
        id: "design",
        title: "Design",
        items: [
          { id: "ux-ui", label: "UX & UI", info: "Wireframes et interfaces." },
          { id: "branding", label: "Branding", info: "Logo, palette et identite." },
          { id: "motion-sound", label: "Motion & Sound", info: "Animations et son de marque." },
          { id: "ux-research", label: "UX Research", info: "Interviews et tests." },
        ],
      },
      {
        id: "development",
        title: "Developpement",
        items: [
          { id: "cms", label: "CMS", info: "Gestion de contenu autonome." },
          { id: "multilingual", label: "Multilingue", info: "Par langue supplementaire." },
          { id: "backend", label: "Backend / API", info: "Logique serveur et base de donnees." },
          { id: "qa", label: "Quality Assurance", info: "Tests multi-appareils." },
          { id: "devops", label: "DevOps", info: "CI/CD et monitoring." },
          { id: "seo-extended", label: "SEO etendu", info: "Optimisation avancee." },
        ],
      },
    ],
  },
  aboutPage: {
    backToHome: "Retour a l'accueil",
  },
  privacyPage: {
    title: "Politique de confidentialite",
    lastUpdated: "Derniere mise a jour : juin 2026",
    backToHome: "Retour a l'accueil",
    sections: [
      {
        heading: "Responsable du traitement",
        body: "DormUp Studio digital studio — contact : dormup.it@gmail.com.",
      },
      {
        heading: "Donnees collectees",
        body: "Nous collectons les donnees que vous soumettez volontairement via les formulaires : nom, e-mail, business, type d'activite, URL du site (si fournie), brief et services selectionnes.",
      },
      {
        heading: "Finalite et base legale",
        body: "Les donnees sont traitees pour repondre aux demandes, preparer des devis et audits gratuits. Base legale : mesures precontractuelles et consentement implicite (RGPD art. 6).",
      },
      {
        heading: "Conservation",
        body: "Conservation le temps necessaire pour traiter la demande, jusqu'a 24 mois sauf obligation legale contraire.",
      },
      {
        heading: "Vos droits",
        body: "Vous pouvez demander acces, rectification, effacement, limitation ou opposition via dormup.it@gmail.com. Droit de reclamation aupres de la CNIL ou autorite competente.",
      },
      {
        heading: "Cookies",
        body: "Ce site n'utilise pas de cookies de profilage tiers. Des cookies techniques peuvent servir au fonctionnement et a la langue.",
      },
    ],
  },
  footer: {
    description: "Studio digital pour systemes, automatisation, sites et contenus.",
    links: "Liens rapides",
    location: "Digital Studio",
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
    popularLabel: "Le plus choisi",
    orderCta: "Demander ce service",
  },
  servicesPage: {
    eyebrow: "Services",
    title: "Ce que nous créons",
    subtitle: "Systemes digitaux, automatisation des processus, sites et production de contenus — de bout en bout.",
    techStack: "Stack : Next.js · React · TypeScript · Tailwind CSS · Framer Motion",
    viewAll: "Tous les services",
    pricingNote:
      "Chaque projet fait l'objet d'un devis sur mesure apres le brief. Les modules complementaires s'ajoutent selon vos besoins.",
    categories: [
      {
        title: "Sites web",
        items: [
          { label: "Sites d'entreprise", info: "Site institutionnel multi-pages avec équipe, services et SEO." },
          { label: "Promo", info: "Site de courte durée pour lancer une offre, un événement ou une campagne." },
          { label: "Landing pages", info: "Page unique à fort taux de conversion avec un seul objectif." },
          { label: "Médias et blogs", info: "Site éditorial avec articles, catégories, tags et flux RSS." },
          { label: "No/Low-code", info: "Livraison rapide via Webflow, Framer ou Tilda — sans dev lourd." },
        ],
      },
      {
        title: "Systemes digitaux",
        items: [
          { label: "Services web", info: "Outils web interactifs : tableaux de bord, réservations, marketplaces." },
          { label: "Applications mobiles", info: "Apps iOS et Android natives avec React Native ou Flutter." },
          { label: "Intranets", info: "Portails internes pour équipes : wikis, docs, annonces." },
          { label: "Espaces clients", info: "Espace sécurisé pour suivre commandes, projets et documents." },
          { label: "Chatbots", info: "Flux automatisés pour support, capture de leads et onboarding." },
          { label: "E-commerce", info: "Boutiques en ligne avec panier, paiements et gestion de stock." },
        ],
      },
      {
        title: "Design",
        items: [
          { label: "UX & UI", info: "Wireframes et design d'interface pixel-perfect basés sur la recherche." },
          { label: "Motion & Sound", info: "Animations, micro-interactions et identité sonore de marque." },
          { label: "Branding", info: "Logo, palette, typographie et système d'identité visuelle complet." },
          { label: "UX Research", info: "Interviews, tests d'utilisabilité et décisions basées sur les données." },
        ],
      },
      {
        title: "Développement",
        items: [
          { label: "Analyse système", info: "Cahier des charges, specs techniques et planification d'architecture." },
          { label: "Développement frontend", info: "Interfaces React/Next.js — rapides, accessibles, prêtes pour la prod." },
          { label: "Développement backend", info: "APIs, bases de données, auth et logique serveur scalable." },
          { label: "Dev mobile", info: "Apps cross-platform natives avec performances fluides." },
          { label: "Quality Assurance", info: "Tests manuels et automatisés sur appareils et navigateurs." },
          { label: "DevOps", info: "CI/CD, hébergement cloud, monitoring et déploiement sans interruption." },
        ],
      },
    ],
  },
  workPage: {
    eyebrow: "Projets",
    title: "Tous les projets",
    subtitle: "Une selection de concepts, prototypes et projets prets pour le client.",
    viewAll: "Voir tous les projets",
    backToWork: "Retour aux projets",
    visitLiveSite: "Visiter le site",
    viewRepo: "Voir sur GitHub",
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
      id: "porto-sole",
      name: "Porto Sole",
      subtitle: "Ресторан и бар на причале",
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
      subtitle: "Отель у моря · прямое бронирование",
      problem:
        "Отелю нужен был убедительный сценарий прямого бронирования, который показывает локацию, номера, сервисы и специальные предложения без возврата гостя на сторонние площадки.",
      solution:
        "Конверсионный сайт отеля с атмосферным первым экраном, витриной номеров, блоками сервисов, отзывами, пакетами и понятным booking-flow.",
      businessImpact:
        "Живой прототип позиционирует Aurelia del Mar как премиальный отдых у моря и дает гостям понятную причину бронировать напрямую.",
    },
    {
      id: "mare-vivo",
      name: "Mare Vivo",
      nameTagline: "Fresh Seafood. Mediterranean Soul.",
      subtitle: "Средиземноморские морепродукты · Бари",
      problem:
        "Ресторану нужен был сайт, который передавал свежий улов Адриатики, семейную историю и понятный путь бронирования на мобильных.",
      solution:
        "Прибрежный editorial-дизайн с витриной меню, отзывами гостей, двуязычным контентом EN/IT и бронированием через WhatsApp и прямую форму.",
      businessImpact:
        "Живой сайт, который позиционирует Mare Vivo как аутентичную итальянскую кухню у моря и конвертирует посетителей в бронирования.",
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
    {
      id: "solovyev-store",
      name: "SOLOVYEV STORE",
      nameTagline: "Streetwear & Sneakers Consignment",
      subtitle: "Premium streetwear · buy / sell / trade",
      problem:
        "Магазин жил в основном в Instagram и его было сложно найти в Google. Наличие вещей было непонятным, а заказы в WhatsApp приходили хаотичными сообщениями — без чётких деталей о товаре и размере.",
      solution:
        "Сделали понятный онлайн-магазин: страницы товаров, статусы наличия, простая панель для каталога, аккаунты клиентов и аккуратные заказы в WhatsApp со всем нужным, чтобы закрыть продажу.",
      businessImpact:
        "Живой сайт, где клиенты находят магазин и покупают проще — заказы понятнее, каталог под контролем, меньше переписок туда-сюда.",
    },
  ],
  services: [
    {
      id: "premium-site",
      title: "Сайты и веб-продукты",
      description:
        "Кастомные сайты и веб-продукты — от бренд-сайтов до опытов под конверсию. Mobile-first, быстро, сделано чтобы работать.",
      details: "От wireframe до продукта · Опциональный CMS · Базовый SEO включён",
      whatYouGet: [
        "Премиум дизайн и визуальная идентичность",
        "Быстрая разработка Next.js, готовая под SEO",
        "Mobile-first под конверсию",
        "Опциональный CMS для управления контентом",
        "Запуск и поддержка после launch включены",
      ],
      pricingSectionTitle: "Пакеты сайта",
      pricingFootnote:
        "Цены указаны «от». Итоговая смета зависит от страниц, интеграций и сроков.",
      pricingTiers: [
        { tierId: "starter", name: "Starter", detail: "Лендинг · 3–5 экранов · 1 язык · базовый SEO." },
        { tierId: "business", name: "Business", detail: "6–10 страниц · CMS · формы · SEO · для SMB и hospitality." },
        { tierId: "premium", name: "Premium", detail: "Полный сайт · мультиязычность · booking · анимации." },
      ],
    },
    {
      id: "redesign",
      title: "Апгрейд систем и редизайн",
      description:
        "Усиливаем существующее цифровое присутствие: яснее система — структура, UX, производительность и пути конверсии.",
      details: "Аудит · Стратегия · Внедрение",
      whatYouGet: [
        "Полный аудит текущего сайта",
        "Новая информационная архитектура и UX",
        "Обновлённая премиум-идентичность",
        "Миграция контента без потерь",
        "Настройка аналитики и трекинга",
      ],
      pricingSectionTitle: "Пакеты редизайна",
      pricingFootnote: "Стоимость зависит от состояния сайта и количества страниц.",
      pricingTiers: [
        { tierId: "audit", name: "Только аудит", detail: "Полный анализ · отчёт с приоритетами · roadmap." },
        { tierId: "standard", name: "Standard", detail: "Редизайн ключевых экранов + внедрение." },
        { tierId: "full", name: "Полный", detail: "Полный редизайн · миграция · аналитика." },
      ],
    },
    {
      id: "booking-flow",
      title: "Автоматизация процессов",
      description:
        "Автоматизируем бронирования, заявки и повторяющиеся сценарии — чтобы лиды не терялись в чатах и календарях.",
      details: "Потоки · Интеграции · Умные формы · Отчётность",
      whatYouGet: [
        "Анализ текущего booking-funnel",
        "Интеграция booking-системы",
        "Умные формы под конверсию",
        "A/B-тесты CTA и ключевых flow",
        "Ежемесячный отчёт по результатам",
      ],
      pricingSectionTitle: "Пакеты booking и lead",
      pricingFootnote: "Подходит для существующих и новых сайтов.",
      pricingTiers: [
        { tierId: "single", name: "Один поток", detail: "Бронь или заявка · форма + CTA." },
        { tierId: "multi", name: "Несколько потоков", detail: "Интеграция booking · оптимизация CTA." },
        { tierId: "full", name: "Полный", detail: "Весь funnel · A/B · ежемесячный отчёт." },
      ],
    },
    {
      id: "monthly-support",
      title: "Рост и сопровождение",
      description:
        "Обновления, оптимизация и приоритетная поддержка по всему цифровому стеку — чтобы системы не отставали от бизнеса.",
      details: "От 2ч/мес · Гарантированный приоритет · Месячный отчёт",
      whatYouGet: [
        "Технические и контентные обновления",
        "Мониторинг производительности и uptime",
        "Постоянные улучшения конверсии",
        "Приоритет по новым запросам",
        "Ясный ежемесячный отчёт",
      ],
      pricingSectionTitle: "Планы поддержки",
      pricingFootnote: "Ежемесячный абонемент. Неиспользованные часы не переносятся.",
      pricingTiers: [
        { tierId: "essential", name: "Essential", detail: "~2 ч/мес · обновления · базовый мониторинг." },
        { tierId: "growth", name: "Growth", detail: "~5 ч/мес · оптимизация · отчёт." },
        { tierId: "priority", name: "Priority", detail: "~10 ч/мес · максимальный приоритет." },
      ],
    },
    {
      id: "photo-video",
      title: "Производство контента",
      description:
        "Фото и видео для сайта, кампаний и соцсетей — бриф, съёмка, монтаж и готовые материалы к использованию.",
      details: "Выезд на объект · При необходимости звук · Файлы под сайт и соцсети",
      whatYouGet: [
        "Бриф и shot list под задачу",
        "Съёмка фото и видео профессиональным оператором",
        "Монтаж: монтажный ряд, цвет, форматы (вертикаль/горизонталь)",
        "Готовые материалы для hero, меню и кампаний",
        "Права использования для digital-маркетинга (по договору)",
      ],
      portfolioUrl2: "https://levkaplan-video.framer.website",
      portfolioLinkLabel2: "Работы оператора",
      pricingSectionTitle: "Тарифы (отдельная услуга)",
      pricingFootnote:
        "Итоговая стоимость — в смете: зависит от локации, времени съёмки и прав использования.",
      pricingTiers: [
        { tierId: "half-day", name: "Полдня", detail: "До 4 часов · фото или видео · базовый монтаж." },
        { tierId: "full-day", name: "Полный день", detail: "Целый день · фото + видео · варианты под сайт." },
        { tierId: "retainer", name: "Ретейнер", detail: "Регулярные съёмки · календарь контента." },
      ],
    },
  ],
  process: [
    {
      id: "understand",
      title: "Понимание",
      summary: "Бизнес, аудитория, цели, проблемы.",
      description:
        "Изучаем бизнес, аудиторию, цели и текущие ограничения — чтобы понять, какую задачу должен решать цифровой стек: системы, сайты и интеграции.",
    },
    {
      id: "plan",
      title: "План",
      summary: "Структура, сценарии, системы, приоритеты.",
      description:
        "Определяем структуру, пользовательские потоки, системы и ключевые функции под конкретные задачи клиента.",
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
      summary: "Сайты, системы, интеграции, производительность.",
      description:
        "Собираем быстрые адаптивные сайты и интеграции с нужными инструментами.",
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
    buy: "Купить",
    about: "О нас",
  },
  hero: {
    eyebrow: "Digital Studio",
    headline: "Your business.\nBuilt to work.\nDesigned to impress.",
    subtitle: "",
    lead: "Цифровые системы, автоматизация процессов, сайты и производство контента.",
    primaryCta: "Смотреть проекты",
    secondaryCta: "Запросить бесплатный аудит",
    buyCta: "Заказать услуги",
    buyCtaShort: "Заказать",
    socialProof: "4 проекта · Открыты для новых клиентов",
    mockupCaption: "Ваша лучшая визитная карточка",
    mockupCaptionSm: true,
    chipHighlight: "Работа под ключ",
    chipAvailability: "Waiting for you",
    chipAvailabilitySub: "digital studio",
  },
  trust: [
    "Цифровые системы, которые связывают",
    "Автоматизация процессов, которая экономит время",
    "Сайты, которые конвертируют",
    "Контент, который строит доверие",
  ],
  proof: {
    eyebrow: "В цифрах",
    items: [
      { value: "1h", label: "Среднее время ответа" },
      { value: "100%", label: "уникальный подход" },
      { value: "4", label: "разных направления\nсистемы · автоматизация · web · контент" },
      { value: "26", label: "Услуг и модулей на выбор" },
    ],
    footnote: { value: "2 нед.", label: "Средний старт проекта" },
  },
  problem: {
    eyebrow: "01 — Почему это важно",
    title:
      "У большинства бизнесов есть инструменты.\nПочти ни у кого нет цифровой системы, которая реально работает.",
    body: "Разрозненные каналы, ручные процессы, слабое веб-присутствие и контент, который не продаёт — это стоит времени и клиентов.\n\nМы связываем системы, автоматизируем процессы, делаем сайты и производим контент.",
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
    eyebrow: "До и после · первый экран",
    title: "Как меняется первый экран после целевого редизайна.",
    subtitle:
      "Интерактивные примеры из разных отраслей — отель, ресторан, бар, локальный бизнес и индивидуальный проект. Сравните, как улучшаются иерархия, смысл и призыв к действию. Тяните золотую границу.",
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
  servicesLead: "Системы · Автоматизация · Сайты · Контент",
  processSection: {
    eyebrow: "Процесс",
    title: "Как мы превращаем цифровой хаос в бизнес-актив",
    subtitle:
      "Системы, автоматизация, web и контент в одном бизнес-методе — не просто красивый сайт.",
    stepLabel: "Этап",
    footerNote:
      "Каждый проект гибкий: процесс, дизайн и функциональность подстраиваются под реальные задачи клиента.",
  },
  impact: {
    label: "Почему это важно",
    items: [
      {
        title: "Системы, которые связывают операции",
        body: "Порталы, дашборды и продуктовые поверхности — чтобы работа не жила в чатах и таблицах.",
        note: "Цифровые системы",
      },
      {
        title: "Автоматизация, которая экономит часы",
        body: "Бронирования, заявки и повторяющиеся сценарии в понятных потоках — меньше потерянных лидов и ручного follow-up.",
        note: "Автоматизация процессов",
      },
      {
        title: "Сайты, которые конвертируют",
        body: "Сильное веб-присутствие по-прежнему закрывает доверие. Мы делаем и обновляем сайты, которые превращают внимание в действие.",
        note: "Сайты",
      },
      {
        title: "Контент, который строит доверие",
        body: "Фото, видео и материалы для сайта и кампаний — чтобы бренд выглядел так же уверенно, как работает.",
        note: "Производство контента",
      },
    ],
  },
  audit: {
    title: "Хотите узнать, что тормозит\nваш бизнес?",
    body: "Разберём системы, процессы, сайт и контент — и скажем точно, что улучшить.",
    cta: "Запросить свой аудит",
    meta: "Отвечаем в течение 1 часа · Бесплатно · Решение за вами",
    freeBadge: "FREE",
  },
  about: {
    eyebrow: "О нас",
    title: "Кто мы?",
    bio: "Мы небольшая цифровая студия. Создаём цифровую среду, которая нужна бизнесу: системы и платформы, автоматизация процессов, сайты и интерфейсы, плюс визуальный контент и постоянное развитие продукта. Не просто красиво — всё заточено под реальные бизнес-результаты.\n\nМы не работаем с 30 клиентами одновременно. Берём несколько проектов и относимся к каждому бизнесу как к своему.",
    pills: ["Открыты для новых проектов"],
  },
  contact: {
    label: "Начнём",
    title: "Цифровая среда для бизнеса, который не хочет быть как все.",
    body: "После вашего сообщения вы получите чёткий ответ со следующими шагами, сроками и оценкой реализуемости.",
    compactTitle: "Запросить бесплатный аудит",
    emailLabel: "Email",
    whatsappLabel: "WhatsApp · Ответ в течение 1ч",
    availability: "Сейчас открыты для новых клиентов",
    cart: {
      eyebrow: "Ваш выбор",
      title: "Выбранные услуги",
      addonsLabel: "Дополнительные модули",
      continueSearch: "Продолжить выбор услуг",
      removeItem: "Убрать",
    },
    form: {
      name: "Имя и фамилия",
      email: "Email",
      business: "Название бизнеса",
      businessType: "Тип бизнеса",
      siteUrl: "URL сайта или продукта",
      brief: "Коротко опишите, что ищете",
      source: "Как вы нас нашли?",
      submit: "Отправить сообщение",
      submitAudit: "Запросить бесплатный аудит",
      submitting: "Отправка...",
      success: "Ответим в течение 1 часа.",
      successTitle: "Ваша заявка отправлена",
      successClose: "Закрыть",
      submitError: "Не удалось отправить. Напишите на {email} — ответим в ближайшее время.",
      auditBriefPlaceholder: "Что не работает в цифровом сетапе — системы, процессы, сайт или контент?",
      optional: "необязательно",
      options: {
        restaurant: "Ресторан / hospitality",
        hotel: "Отель",
        bar: "Бар / площадка",
        other: "Другое / услуги",
        google: "Google",
        referral: "Сарафанное радио",
        social: "Соцсети",
      },
      errors: {
        required: "Обязательное поле",
        invalidEmail: "Введите корректный email",
        invalidUrl: "Введите корректный URL (например https://vashsite.ru)",
      },
    },
  },
  orderPage: {
    eyebrow: "Заказ",
    title: "Выберите услуги",
    subtitle:
      "Отметьте одну или несколько опций — персональный расчёт пришлём в течение 1 часа.",
    fromLabel: "от",
    selectHint: "Выберите хотя бы одну услугу или напишите нам напрямую.",
    proceedCta: "Запросить расчёт",
    footnote:
      "После заявки вы получите объём работ, сроки и итоговую стоимость. Автоматической оплаты нет.",
    plusLabel: "+",
    estimatedLabel: "Ориентировочная сумма",
    addonsSectionTitle: "Дополнительные модули",
    aboutServiceCta: "Об услуге",
    trust: {
      timeline: "Типичный срок: 4–8 недель",
      deposit: "Предоплата 30% при старте",
      processLink: "Как мы работаем",
      testimonial:
        "«Быстрый ответ, понятный scope — именно такого digital-партнёра мы искали.»",
    },
  },
  pricingAddons: {
    eyebrow: "Модули",
    title: "Расширьте проект",
    subtitle:
      "Добавьте функции к базовому пакету. Стоимость каждого модуля рассчитываем после брифа.",
    footnote: "Итоговая цена модулей — после брифа.",
    categories: [
      {
        id: "websites",
        title: "Сайты",
        items: [
          { id: "corporate", label: "Корпоративные", info: "Многостраничный сайт с SEO." },
          { id: "promo", label: "Промо", info: "Краткосрочный сайт под акцию." },
          { id: "landing", label: "Лендинги", info: "Одна страница, одна цель." },
          { id: "media-blog", label: "Медиа и блоги", info: "Статьи, категории, RSS." },
          { id: "no-code", label: "No/Low-code", info: "Webflow, Framer или Tilda." },
        ],
      },
      {
        id: "products",
        title: "Цифровые системы",
        items: [
          { id: "web-service", label: "Веб-сервисы", info: "Дашборды, booking, маркетплейсы." },
          { id: "ecommerce", label: "Интернет-магазины", info: "Корзина, оплата, каталог." },
          { id: "client-portal", label: "Личные кабинеты", info: "Заказы и документы клиентов." },
          { id: "chatbot", label: "Чат-боты", info: "Поддержка и сбор лидов." },
          { id: "intranet", label: "Интранеты", info: "Внутренние порталы команд." },
          { id: "mobile-app", label: "Мобильные приложения", info: "iOS и Android." },
        ],
      },
      {
        id: "design",
        title: "Дизайн",
        items: [
          { id: "ux-ui", label: "UX & UI", info: "Вайрфреймы и интерфейсы." },
          { id: "branding", label: "Брендинг", info: "Лого, палитра, типографика." },
          { id: "motion-sound", label: "Motion & Sound", info: "Анимации и звук бренда." },
          { id: "ux-research", label: "UX-исследования", info: "Интервью и тесты." },
        ],
      },
      {
        id: "development",
        title: "Разработка",
        items: [
          { id: "cms", label: "CMS", info: "Самостоятельное управление контентом." },
          { id: "multilingual", label: "Мультиязычность", info: "За каждый доп. язык." },
          { id: "backend", label: "Backend / API", info: "Сервер, БД, авторизация." },
          { id: "qa", label: "Quality Assurance", info: "Тестирование на устройствах." },
          { id: "devops", label: "DevOps", info: "CI/CD и мониторинг." },
          { id: "seo-extended", label: "Расширенный SEO", info: "Продвинутая оптимизация." },
        ],
      },
    ],
  },
  aboutPage: {
    backToHome: "На главную",
  },
  privacyPage: {
    title: "Политика конфиденциальности",
    lastUpdated: "Обновлено: июнь 2026",
    backToHome: "На главную",
    sections: [
      {
        heading: "Оператор данных",
        body: "DormUp Studio digital studio — контакт: dormup.it@gmail.com.",
      },
      {
        heading: "Какие данные собираем",
        body: "Данные, которые вы добровольно отправляете через формы: имя, email, название бизнеса, тип, URL сайта (если указан), описание проекта и выбранные услуги.",
      },
      {
        heading: "Цель и правовое основание",
        body: "Обработка для ответа на запросы, подготовки расчётов и бесплатных аудитов. Основание: преддоговорные меры и согласие при отправке формы (GDPR ст. 6).",
      },
      {
        heading: "Хранение",
        body: "Храним данные столько, сколько нужно для обработки запроса, до 24 месяцев, если иное не требует закон.",
      },
      {
        heading: "Ваши права",
        body: "Вы можете запросить доступ, исправление, удаление, ограничение или возражение, написав на dormup.it@gmail.com. Право на жалобу в надзорный орган.",
      },
      {
        heading: "Cookies",
        body: "Сайт не использует сторонние профилирующие cookies. Технические cookies могут использоваться для работы сайта и выбора языка.",
      },
    ],
  },
  footer: {
    description: "Цифровая студия для систем, автоматизации, сайтов и контента.",
    links: "Быстрые ссылки",
    location: "Digital Studio",
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
    popularLabel: "Популярный",
    orderCta: "Запросить услугу",
  },
  servicesPage: {
    eyebrow: "Услуги",
    title: "Что мы создаём",
    subtitle: "Цифровые системы, автоматизация процессов, сайты и производство контента — под ключ.",
    techStack: "Стек: Next.js · React · TypeScript · Tailwind CSS · Framer Motion",
    viewAll: "Все услуги",
    pricingNote:
      "Каждый проект оценивается индивидуально после брифа. Дополнительные модули подбираются под ваши задачи.",
    categories: [
      {
        title: "Сайты",
        items: [
          { label: "Корпоративные", info: "Многостраничный сайт компании с командой, услугами и SEO." },
          { label: "Промо", info: "Краткосрочный сайт под запуск, акцию или мероприятие." },
          { label: "Лендинги", info: "Одностраничник под конверсию — одна цель, один призыв к действию." },
          { label: "Медиа и блоги", info: "Редакционный сайт со статьями, категориями и RSS-лентой." },
          { label: "No/Low-code", info: "Быстрая разработка на Webflow, Framer или Tilda." },
        ],
      },
      {
        title: "Цифровые системы",
        items: [
          { label: "Веб-сервисы", info: "Браузерные инструменты: дашборды, движки бронирования, маркетплейсы." },
          { label: "Мобильные приложения", info: "iOS и Android приложения на React Native или Flutter." },
          { label: "Интранеты", info: "Внутренние порталы для команд: вики, документы, объявления." },
          { label: "Личные кабинеты", info: "Защищённые зоны для клиентов — заказы, проекты, документы." },
          { label: "Чат-боты", info: "Автоматизированные сценарии для поддержки, лидов и онбординга." },
          { label: "Интернет-магазины", info: "Магазины с корзиной, оплатой и управлением товарами." },
        ],
      },
      {
        title: "Дизайн",
        items: [
          { label: "UX & UI", info: "Вайрфреймы и пиксельный дизайн интерфейсов на основе исследований." },
          { label: "Motion & Sound", info: "Анимации, микро-взаимодействия и звуковой брендинг." },
          { label: "Брендинг", info: "Логотип, палитра, типографика и полная система визуальной идентичности." },
          { label: "UX-исследования", info: "Интервью, тесты юзабилити и решения на основе данных." },
        ],
      },
      {
        title: "Разработка",
        items: [
          { label: "Системный анализ", info: "Требования, технические спецификации и планирование архитектуры." },
          { label: "Frontend-разработка", info: "React/Next.js интерфейсы — быстрые, доступные, готовые к продакшену." },
          { label: "Backend-разработка", info: "API, базы данных, авторизация и серверная логика с масштабируемостью." },
          { label: "Мобильная разработка", info: "Кросс-платформенные нативные приложения с плавной работой." },
          { label: "Quality Assurance", info: "Ручное и автоматическое тестирование на устройствах и браузерах." },
          { label: "DevOps", info: "CI/CD, облачный хостинг, мониторинг и деплой без простоев." },
        ],
      },
    ],
  },
  workPage: {
    eyebrow: "Работы",
    title: "Все проекты",
    subtitle: "Выборка концептов, прототипов и client-ready проектов.",
    viewAll: "Смотреть все работы",
    backToWork: "Назад к проектам",
    visitLiveSite: "Перейти на сайт",
    viewRepo: "Смотреть на GitHub",
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
      id: "porto-sole",
      name: "Porto Sole",
      subtitle: "Restaurant & Bar auf dem Pier",
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
      subtitle: "Strandhotel · Direktbuchung",
      problem:
        "Das Hotel brauchte ein hochwertiges Direktbuchungserlebnis, das Lage, Zimmer, Services und exklusive Angebote vermittelt, ohne Gaste zu externen Buchungsplattformen zu schicken.",
      solution:
        "Conversion-fokussierte Hotelwebsite mit immersiver Hero-Section, Zimmer-Highlights, Services, Gastebewertungen, Paketen und gefuhrtem Buchungsflow.",
      businessImpact:
        "Live-Prototyp, der Aurelia del Mar als premium Aufenthalt am Meer positioniert und Gasten einen klaren Grund gibt, direkt zu buchen.",
    },
    {
      id: "mare-vivo",
      name: "Mare Vivo",
      nameTagline: "Fresh Seafood. Mediterranean Soul.",
      subtitle: "Mediterrane Meeresfruchte · Bari",
      problem:
        "Das Restaurant brauchte einen Online-Auftritt, der frischen Adriatik-Fang, Familiengeschichte und einen klaren Reservierungspfad auf Mobile vermittelt.",
      solution:
        "Kustennahes Editorial-Design mit Menu-Highlights, Gastebewertungen, zweisprachigem EN/IT-Content und Reservierungsflow uber WhatsApp und Direktformular.",
      businessImpact:
        "Live-Site, die Mare Vivo als authentisches italienisches Kustenrestaurant positioniert und Besucher in Tischreservierungen verwandelt.",
    },
    {
      id: "podlopuhom-jewelry",
      name: "Pod Lopuhom",
      nameTagline: "Handgefertigter Schmuck",
      subtitle: "Botanischer Schmuck · e-commerce",
      problem:
        "Die Kunsthandwerkerin nahm Bestellungen nur uber DMs entgegen, ohne klaren Showroom fur Kollektionen, Preise und Verfugbarkeit fur ein internationales Publikum.",
      solution:
        "Mehrsprachige Galerie (EN/RU/IT) mit klaren Kategorien, Produktdetail und direkten WhatsApp- / Instagram-CTAs zum Abschluss der Bestellung.",
      businessImpact:
        "Live-Site, die ein Social-Profil in eine professionelle Marke verwandelt hat — mehr Vertrauen, direkte Bestellungen und Sichtbarkeit auf neuen Markten.",
    },
    {
      id: "solovyev-store",
      name: "SOLOVYEV STORE",
      nameTagline: "Streetwear & Sneakers Consignment",
      subtitle: "Premium-Streetwear · buy / sell / trade",
      problem:
        "Der Shop lebte vor allem auf Instagram und war bei Google schwer zu finden. Der Bestand war unklar, und WhatsApp-Bestellungen kamen als unubersichtliche Chats ohne klare Produkt- oder Grossenangaben.",
      solution:
        "Wir haben einen klaren Online-Shop gebaut: Produktseiten, Bestandsstatus, ein einfaches Panel fur den Katalog, Kundenkonten und aufgeraumte WhatsApp-Bestellungen mit allem, was fur den Verkauf noetig ist.",
      businessImpact:
        "Ein live Shop, den Kunden finden und leichter bedienen konnen — klarere Bestellungen, besserer Uberblick uber den Bestand und weniger Hin und Her im Chat.",
    },
  ],
  services: [
    {
      id: "premium-site",
      title: "Websites & Webprodukte",
      description:
        "Individuelle Websites und Webprodukte — von Markenseiten bis conversion-starken Erlebnissen. Mobile-first, schnell, gebaut zum Funktionieren.",
      details: "Vom Wireframe bis zum Launch · Optionales CMS · Basis-SEO inklusive",
      whatYouGet: [
        "Premium-Design und visuelle Identitat",
        "Schnelle, SEO-ready Next.js-Entwicklung",
        "Mobile-first, conversion-optimiert",
        "Optionales CMS fur Content-Management",
        "Launch und Post-Live-Support inklusive",
      ],
      pricingSectionTitle: "Website-Pakete",
      pricingFootnote: "Indikative Startpreise. Endangebot hangt von Seiten und Integrationen ab.",
      pricingTiers: [
        { tierId: "starter", name: "Starter", detail: "Landing · 3–5 Screens · 1 Sprache · Basis-SEO." },
        { tierId: "business", name: "Business", detail: "6–10 Seiten · CMS · Formulare · Basis-SEO." },
        { tierId: "premium", name: "Premium", detail: "Volle Website · mehrsprachig · Booking · Animationen." },
      ],
    },
    {
      id: "redesign",
      title: "System-Upgrade & Redesign",
      description:
        "Wir entwickeln die bestehende digitale Präsenz zu einem klareren System weiter — Struktur, UX, Performance und Conversion-Pfade.",
      details: "Audit · Strategie · Umsetzung",
      whatYouGet: [
        "Vollstandiges Audit der aktuellen Website",
        "Neue Informationsarchitektur und UX",
        "Aktualisierte, premium visuelle Identitat",
        "Content-Migration ohne Verlust",
        "Analytics- und Tracking-Setup",
      ],
      pricingSectionTitle: "Redesign-Pakete",
      pricingFootnote: "Kosten hangen vom aktuellen Zustand und Seitenumfang ab.",
      pricingTiers: [
        { tierId: "audit", name: "Nur Audit", detail: "Vollanalyse · Prioritatenreport · Roadmap." },
        { tierId: "standard", name: "Standard", detail: "Redesign Kernscreens + Umsetzung." },
        { tierId: "full", name: "Komplett", detail: "Volles Redesign · Migration · Analytics." },
      ],
    },
    {
      id: "booking-flow",
      title: "Prozessautomatisierung",
      description:
        "Wir automatisieren Buchungen, Anfragen und wiederkehrende Workflows — damit Leads nicht in Chats und Kalendern verloren gehen.",
      details: "Flows · Integrationen · Smarte Formulare · Reporting",
      whatYouGet: [
        "Analyse des aktuellen Booking-Funnels",
        "Integration des Buchungssystems",
        "Smarte, conversion-orientierte Formulare",
        "A/B-Tests auf CTAs und Key Flows",
        "Monatlicher Ergebnisbericht",
      ],
      pricingSectionTitle: "Booking- und Lead-Pakete",
      pricingFootnote: "Fur bestehende oder neue Websites.",
      pricingTiers: [
        { tierId: "single", name: "Einzel-Flow", detail: "Buchung oder Anfrage · Formular + CTA." },
        { tierId: "multi", name: "Multi-Flow", detail: "Mehrere Pfade · Booking-Integration." },
        { tierId: "full", name: "Komplett", detail: "End-to-End-Funnel · A/B · Monatsreport." },
      ],
    },
    {
      id: "monthly-support",
      title: "Laufendes Wachstum & Betreuung",
      description:
        "Updates, Optimierung und priorisierter Support uber Ihren digitalen Stack — damit Systeme mit dem Business mithalten.",
      details: "Ab 2h/Monat · Prioritat garantiert · Monatsreport",
      whatYouGet: [
        "Technische und Content-Updates",
        "Performance- und Uptime-Monitoring",
        "Kontinuierliche Conversion-Optimierung",
        "Prioritat bei neuen Anfragen",
        "Klarer monatlicher Bericht",
      ],
      pricingSectionTitle: "Support-Plane",
      pricingFootnote: "Monatlicher Retainer. Ungenutzte Stunden verfallen.",
      pricingTiers: [
        { tierId: "essential", name: "Essential", detail: "~2h/Mon. · Updates · Basis-Monitoring." },
        { tierId: "growth", name: "Growth", detail: "~5h/Mon. · laufende Optimierung · Report." },
        { tierId: "priority", name: "Priority", detail: "~10h/Mon. · Top-Prioritat · Detailreport." },
      ],
    },
    {
      id: "photo-video",
      title: "Content-Produktion",
      description:
        "Foto- und Videoproduktion für Web, Kampagnen und Social — Briefing, Dreh, Schnitt und einsatzbereite Deliverables.",
      details: "Location-Drehs · Audio bei Bedarf · Deliverables fur Web und Social",
      whatYouGet: [
        "Briefing und Shotliste mit klarem Zeitplan",
        "Professionelle Foto- und Videoaufnahmen",
        "Schnitt, Gradierung, Hoch- und Querformate",
        "Lieferung fur Hero, digitale Speisekarten und Kampagnen",
        "Nutzungsrechte fur Digital-Marketing (vertraglich)",
      ],
      portfolioUrl2: "https://levkaplan-video.framer.website",
      portfolioLinkLabel2: "Videograf-Portfolio",
      pricingSectionTitle: "Tarife (separate Leistung)",
      pricingFootnote:
        "Preise werden je nach Location, Dauer und Nutzungsrechten im Angebot festgelegt.",
      pricingTiers: [
        { tierId: "half-day", name: "Halber Tag", detail: "Bis 4 Std. · Foto oder Video · Basis-Edit." },
        { tierId: "full-day", name: "Ganzer Tag", detail: "Voller Drehtag · Foto + Video · Varianten." },
        { tierId: "retainer", name: "Monatlicher Retainer", detail: "Wiederkehrende Drehs · Content-Plan." },
      ],
    },
  ],
  process: [
    {
      id: "understand",
      title: "Verstehen",
      summary: "Business, Zielgruppe, Ziele, Probleme.",
      description:
        "Wir analysieren Business, Zielgruppe, Ziele und aktuelle Herausforderungen — damit klar ist, was das digitale System aus Sites und Integrationen leisten muss.",
    },
    {
      id: "plan",
      title: "Planen",
      summary: "Struktur, Flows, Systeme, Prioritäten.",
      description:
        "Wir definieren Struktur, Nutzerflusse, Systeme und Kernfunktionen passend zu den Anforderungen.",
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
      summary: "Sites, Systeme, Integrationen, Performance.",
      description:
        "Wir entwickeln schnelle, responsive Sites und Integrationen mit den passenden Tools.",
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
    buy: "Bestellen",
    about: "Uber uns",
  },
  hero: {
    eyebrow: "Digitales Studio",
    headline: "Your business.\nBuilt to work.\nDesigned to impress.",
    subtitle: "",
    lead: "Digitale Systeme, Prozessautomatisierung, Websites und Content-Produktion.",
    primaryCta: "Projekte ansehen",
    secondaryCta: "Audit anfragen",
    buyCta: "Leistungen bestellen",
    buyCtaShort: "Bestellen",
    socialProof: "4 Projekte · Verfugbar fur neue Kunden",
    mockupCaption: "Ihre beste Visitenkarte",
    chipHighlight: "Schlüsselfertig",
    chipAvailability: "Waiting for you",
    chipAvailabilitySub: "digital studio",
  },
  trust: [
    "Digitale Systeme, die verbinden",
    "Prozessautomatisierung, die Zeit spart",
    "Websites, die konvertieren",
    "Content, der Vertrauen aufbaut",
  ],
  proof: {
    eyebrow: "In Zahlen",
    items: [
      { value: "1h", label: "Durchschnittliche Reaktionszeit" },
      { value: "100%", label: "einzigartiger Ansatz" },
      { value: "4", label: "verschiedene Richtungen\nSysteme · Automatisierung · Web · Content" },
      { value: "26", label: "Leistungen und Module zur Auswahl" },
    ],
    footnote: { value: "2 Wo.", label: "Durchschnittlicher Projektstart" },
  },
  problem: {
    eyebrow: "01 — Warum es zahlt",
    title:
      "Die meisten Unternehmen haben Tools.\nFast keines hat ein digitales System, das wirklich funktioniert.",
    body: "Verstreute Kanale, manuelle Prozesse, schwache Webprasenz und Content, der nicht verkauft — das kostet Zeit und Kunden.\n\nWir verbinden Systeme, automatisieren Prozesse, bauen Websites und produzieren Content.",
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
    eyebrow: "Vorher und nachher · erster Screen",
    title: "Wie sich der erste Screen nach einem gezielten Redesign verandert.",
    subtitle:
      "Interaktive Beispiele aus verschiedenen Branchen — Hotel, Restaurant, Bar, lokales Business und individuelles Projekt. Vergleichen Sie Hierarchie, Botschaft und Handlungsaufforderung. Ziehen Sie die goldene Linie.",
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
  servicesLead: "Systeme · Automatisierung · Websites · Content",
  processSection: {
    eyebrow: "Prozess",
    title: "Wie wir digitales Chaos in ein Business-Asset verwandeln",
    subtitle:
      "Systeme, Automatisierung, Web und Content in einer business-getriebenen Methode — nicht nur eine schöne Site.",
    stepLabel: "Schritt",
    footerNote:
      "Jedes Projekt ist flexibel — Prozess, Design und Funktionalität orientieren sich an den realen Bedürfnissen des Kunden.",
  },
  impact: {
    label: "Warum es zahlt",
    items: [
      {
        title: "Systeme, die Operationen verbinden",
        body: "Portale, Dashboards und Produktflächen, die Arbeit aus Chats und Tabellen holen.",
        note: "Digitale Systeme",
      },
      {
        title: "Automatisierung, die Stunden spart",
        body: "Buchungen, Anfragen und wiederkehrende Workflows in klaren Flows — weniger verlorene Leads, weniger manuelles Follow-up.",
        note: "Prozessautomatisierung",
      },
      {
        title: "Websites, die konvertieren",
        body: "Eine starke Webprasenz schafft weiter Vertrauen. Wir bauen und verbessern Sites, die Aufmerksamkeit in Aktion verwandeln.",
        note: "Websites",
      },
      {
        title: "Content, der Vertrauen aufbaut",
        body: "Foto, Video und Assets fur Web und Kampagnen — damit die Marke so solid wirkt, wie sie arbeitet.",
        note: "Content-Produktion",
      },
    ],
  },
  audit: {
    title: "Wollen Sie wissen, was\nIhr Business bremst?",
    body: "Wir prufen Systeme, Prozesse, Website und Content — und sagen Ihnen genau, was zu verbessern ist.",
    cta: "Ihr Audit anfragen",
    meta: "Antwort innerhalb einer Stunde · Kostenlos · Sie entscheiden uber die nachsten Schritte",
    freeBadge: "FREE",
  },
  about: {
    eyebrow: "Uber uns",
    title: "Wer sind wir?",
    bio: "Wir sind ein kleines Digital-Studio. Wir bauen die digitale Umgebung, die Ihr Business braucht: Systeme und Plattformen, Prozessautomatisierung, Websites und Interfaces sowie visuellen Content und laufende Produktentwicklung. Nicht nur schon — alles ist auf echte Business-Ergebnisse ausgelegt.\n\nWir arbeiten nicht mit 30 Kunden gleichzeitig. Wir betreuen wenige Projekte und behandeln jedes Business, als ware es unser eigenes.",
    pills: ["Verfugbar fur neue Projekte"],
  },
  contact: {
    label: "Lass uns starten",
    title: "Eine digitale Umgebung fur Unternehmen, die nicht wie alle sein wollen.",
    body: "Nach Ihrer Nachricht bekommen Sie eine klare Antwort mit nachsten Schritten, Timing und Machbarkeit.",
    compactTitle: "Kostenloses Audit anfragen",
    emailLabel: "E-Mail",
    whatsappLabel: "WhatsApp · Antwort innerhalb 1h",
    availability: "Derzeit verfugbar fur neue Kunden",
    cart: {
      eyebrow: "Ihre Auswahl",
      title: "Gewahlte Leistungen",
      addonsLabel: "Zusatzmodule",
      continueSearch: "Weiter auswahlen",
      removeItem: "Entfernen",
    },
    form: {
      name: "Vor- und Nachname",
      email: "E-Mail",
      business: "Name des Business",
      businessType: "Art des Business",
      siteUrl: "Website- oder Produkt-URL",
      brief: "Beschreiben Sie kurz, was Sie suchen",
      source: "Wie haben Sie uns gefunden?",
      submit: "Nachricht senden",
      submitAudit: "Kostenloses Audit anfragen",
      submitting: "Wird gesendet...",
      success: "Wir antworten innerhalb einer Stunde.",
      successTitle: "Ihre Anfrage wurde gesendet",
      successClose: "Schließen",
      submitError: "Senden fehlgeschlagen. Schreiben Sie an {email} — wir melden uns schnell.",
      auditBriefPlaceholder: "Was funktioniert in Ihrem digitalen Setup nicht — Systeme, Prozesse, Website oder Content?",
      optional: "optional",
      options: {
        restaurant: "Restaurant / Hospitality",
        hotel: "Hotel",
        bar: "Bar / Location",
        other: "Sonstiges / Services",
        google: "Google",
        referral: "Empfehlung",
        social: "Social Media",
      },
      errors: {
        required: "Pflichtfeld",
        invalidEmail: "Gültige E-Mail-Adresse eingeben",
        invalidUrl: "Gültige URL eingeben (z. B. https://ihrewebsite.de)",
      },
    },
  },
  orderPage: {
    eyebrow: "Bestellung",
    title: "Leistungen auswahlen",
    subtitle:
      "Wahlen Sie eine oder mehrere Optionen — Sie erhalten innerhalb einer Stunde ein individuelles Angebot.",
    fromLabel: "ab",
    selectHint: "Wahlen Sie mindestens eine Leistung oder schreiben Sie uns direkt.",
    proceedCta: "Angebot anfragen",
    footnote:
      "Nach Ihrer Anfrage erhalten Sie Umfang, Zeitplan und Endpreis. Keine automatische Zahlung.",
    plusLabel: "+",
    estimatedLabel: "Richtwert",
    addonsSectionTitle: "Zusatzmodule",
    aboutServiceCta: "Zur Leistung",
    trust: {
      timeline: "Typische Dauer: 4–8 Wochen",
      deposit: "30% Anzahlung zum Start",
      processLink: "So arbeiten wir",
      testimonial:
        "«Schnelle Antwort, klarer Scope — genau der Digital-Partner, den wir gesucht haben.»",
    },
  },
  pricingAddons: {
    eyebrow: "Module",
    title: "Projekt erweitern",
    subtitle: "Funktionen zum Basispaket hinzufugen.",
    footnote: "Der Endpreis jedes Moduls wird nach dem Briefing festgelegt.",
    categories: [
      {
        id: "websites",
        title: "Websites",
        items: [
          { id: "corporate", label: "Unternehmenswebsites", info: "Mehrseitig mit SEO." },
          { id: "promo", label: "Promo", info: "Kurzzeit-Site fur Kampagnen." },
          { id: "landing", label: "Landingpages", info: "Eine Seite, ein Ziel." },
          { id: "media-blog", label: "Medien & Blogs", info: "Artikel und RSS." },
          { id: "no-code", label: "No/Low-code", info: "Webflow, Framer oder Tilda." },
        ],
      },
      {
        id: "products",
        title: "Digitale Systeme",
        items: [
          { id: "web-service", label: "Web-Services", info: "Dashboards und Booking." },
          { id: "ecommerce", label: "E-Commerce", info: "Shop mit Warenkorb." },
          { id: "client-portal", label: "Kundenportale", info: "Geschutzter Kundenbereich." },
          { id: "chatbot", label: "Chatbots", info: "Automatisierte Flows." },
          { id: "intranet", label: "Intranets", info: "Interne Team-Portale." },
          { id: "mobile-app", label: "Mobile Apps", info: "iOS und Android." },
        ],
      },
      {
        id: "design",
        title: "Design",
        items: [
          { id: "ux-ui", label: "UX & UI", info: "Wireframes und Interfaces." },
          { id: "branding", label: "Branding", info: "Logo und Identitat." },
          { id: "motion-sound", label: "Motion & Sound", info: "Animationen und Klang." },
          { id: "ux-research", label: "UX Research", info: "Interviews und Tests." },
        ],
      },
      {
        id: "development",
        title: "Entwicklung",
        items: [
          { id: "cms", label: "CMS", info: "Eigenstandige Content-Pflege." },
          { id: "multilingual", label: "Mehrsprachig", info: "Pro zusatzliche Sprache." },
          { id: "backend", label: "Backend / API", info: "Serverlogik und Datenbank." },
          { id: "qa", label: "Quality Assurance", info: "Geraete- und Browser-Tests." },
          { id: "devops", label: "DevOps", info: "CI/CD und Monitoring." },
          { id: "seo-extended", label: "Erweitertes SEO", info: "Fortgeschrittene Optimierung." },
        ],
      },
    ],
  },
  aboutPage: {
    backToHome: "Zur Startseite",
  },
  privacyPage: {
    title: "Datenschutzerklarung",
    lastUpdated: "Stand: Juni 2026",
    backToHome: "Zur Startseite",
    sections: [
      {
        heading: "Verantwortlicher",
        body: "DormUp Studio digital studio — Kontakt: dormup.it@gmail.com.",
      },
      {
        heading: "Erhobene Daten",
        body: "Daten, die Sie freiwillig uber Formulare senden: Name, E-Mail, Business-Name, Typ, Website-URL (falls angegeben), Brief und gewahlte Leistungen.",
      },
      {
        heading: "Zweck und Rechtsgrundlage",
        body: "Verarbeitung zur Beantwortung von Anfragen, Angeboten und kostenlosen Audits. Rechtsgrundlage: vorvertragliche Massnahmen und implizite Einwilligung (DSGVO Art. 6).",
      },
      {
        heading: "Speicherdauer",
        body: "Speicherung so lange wie fur die Bearbeitung erforderlich, maximal 24 Monate, sofern gesetzlich nicht anders vorgeschrieben.",
      },
      {
        heading: "Ihre Rechte",
        body: "Auskunft, Berichtigung, Loschung, Einschrankung oder Widerspruch per E-Mail an dormup.it@gmail.com. Beschwerderecht bei der Aufsichtsbehorde.",
      },
      {
        heading: "Cookies",
        body: "Diese Website verwendet keine Drittanbieter-Profiling-Cookies. Technische Cookies dienen dem Betrieb und der Sprachauswahl.",
      },
    ],
  },
  footer: {
    description: "Digitales Studio für Systeme, Automatisierung, Websites und Content.",
    links: "Schnellzugriff",
    location: "Digital Studio",
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
    popularLabel: "Beliebteste",
    orderCta: "Leistung anfragen",
  },
  servicesPage: {
    eyebrow: "Leistungen",
    title: "Was wir bauen",
    subtitle: "Digitale Systeme, Prozessautomatisierung, Websites und Content-Produktion — end to end.",
    techStack: "Stack: Next.js · React · TypeScript · Tailwind CSS · Framer Motion",
    viewAll: "Alle Leistungen",
    pricingNote:
      "Jedes Projekt wird nach dem Briefing individuell kalkuliert. Zusatzmodule wahlen Sie nach Bedarf.",
    categories: [
      {
        title: "Websites",
        items: [
          { label: "Unternehmenswebsites", info: "Mehrseitige Unternehmenssite mit Team, Leistungen und SEO." },
          { label: "Promo", info: "Kurzfristige Kampagnensite für Launches, Events oder Angebote." },
          { label: "Landingpages", info: "Einzelseite mit hoher Conversion — ein Ziel, ein klarer CTA." },
          { label: "Medien & Blogs", info: "Redaktionelle Site mit Artikeln, Kategorien und RSS-Feed." },
          { label: "No/Low-code", info: "Schnelle Umsetzung mit Webflow, Framer oder Tilda." },
        ],
      },
      {
        title: "Digitale Systeme",
        items: [
          { label: "Web-Services", info: "Browserbasierte Tools: Dashboards, Buchungstools, Marktplätze." },
          { label: "Mobile Apps", info: "iOS- und Android-Apps mit React Native oder Flutter." },
          { label: "Intranets", info: "Interne Portale für Teams: Wikis, Dokumente, Ankündigungen." },
          { label: "Kundenportale", info: "Passwortgeschützte Bereiche für Aufträge, Projekte und Dokumente." },
          { label: "Chatbots", info: "Automatisierte Chat-Flows für Support, Lead-Erfassung und Onboarding." },
          { label: "E-Commerce", info: "Online-Shops mit Warenkorb, Zahlung und Bestandsverwaltung." },
        ],
      },
      {
        title: "Design",
        items: [
          { label: "UX & UI", info: "Forschungsbasierte Wireframes und pixelgenaues Interface-Design." },
          { label: "Motion & Sound", info: "Animationen, Micro-Interactions und Sonic Branding." },
          { label: "Branding", info: "Logo, Farbpalette, Typografie und vollständiges Corporate Design." },
          { label: "UX-Forschung", info: "Nutzerinterviews, Usability-Tests und datengetriebene Entscheidungen." },
        ],
      },
      {
        title: "Entwicklung",
        items: [
          { label: "Systemanalyse", info: "Anforderungen, technische Spezifikationen und Architekturplanung." },
          { label: "Frontend-Entwicklung", info: "React/Next.js-Interfaces — schnell, barrierefrei, produktionsreif." },
          { label: "Backend-Entwicklung", info: "APIs, Datenbanken, Auth und skalierbare Serverlogik." },
          { label: "Mobile-Entwicklung", info: "Cross-Platform-Apps mit flüssiger Performance auf iOS und Android." },
          { label: "Quality Assurance", info: "Manuelle und automatisierte Tests auf Geräten und Browsern." },
          { label: "DevOps", info: "CI/CD, Cloud-Hosting, Monitoring und Zero-Downtime-Deployments." },
        ],
      },
    ],
  },
  workPage: {
    eyebrow: "Arbeiten",
    title: "Alle Projekte",
    subtitle: "Eine Auswahl an Konzepten, Prototypen und client-ready Projekten.",
    viewAll: "Alle Arbeiten ansehen",
    backToWork: "Zuruck zu Projekten",
    visitLiveSite: "Live-Site besuchen",
    viewRepo: "Auf GitHub ansehen",
    liveStatus: "Live",
    techStack: "Tech-Stack",
    overview: "Uberblick",
    otherProjects: "Weitere Projekte",
  },
};

import { es } from "@/lib/locale-es";

export const translations: Record<Locale, TranslationSet> = {
  it,
  en,
  fr,
  ru,
  de,
  es,
};

export { localeOrder } from "@/lib/locale-meta";

