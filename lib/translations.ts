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
  };
  trust: string[];
  proof: {
    eyebrow: string;
    items: { value: string; label: string }[];
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
      optional: string;
      errors: {
        required: string;
        invalidEmail: string;
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
      id: "premium-restaurant-local-concept",
      name: "Premium Restaurant Website",
      subtitle: "Conversione per ristorante locale",
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
      subtitle: "Gioielli botanici · e-commerce",
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
      title: "Custom Website Dev",
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
      title: "Booking & Lead Flow",
      description:
        "Costruiamo flussi di prenotazione e richiesta diretta dal sito che aumentano le conversioni.",
      details: "Integrazione booking · Form intelligenti · A/B logic",
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
      title: "Foto & video con videografo professionista",
      description:
        "Riprese e post-produzione affidate a un videografo dedicato: food, interni, team e contenuti per social. Servizio separato dai progetti web, con piani tariffari dedicati.",
      details: "Sessioni in location · Audio dove serve · Export per sito e social",
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
    eyebrow: "Studio Digitale · Emilia-Romagna, Italia",
    headline: "La prima impressione sul business\ninizia\ndal sito.",
    subtitle: "La presenza digitale che parla al posto tuo",
    lead: "Creiamo esperienze digitali premium per brand e business che non vogliono sembrare generici: ristoranti, negozi, studi e startup con ambizioni chiare. Design distintivo, strategia concreta, risultati misurabili.",
    primaryCta: "Vedi i progetti",
    secondaryCta: "Richiedi audit gratuito",
    buyCta: "Ordina servizi",
    buyCtaShort: "Ordina",
    socialProof: "4 progetti · Emilia-Romagna & Italia · Disponibile per nuovi clienti",
    mockupCaption: "Il tuo miglior biglietto da visita",
  },
  trust: [
    "Design che converte",
    "Pensato per brand ambiziosi",
    "Prenotazioni e lead diretti",
    "Ottimo su smartphone",
  ],
  proof: {
    eyebrow: "In numeri",
    items: [
      { value: "1h", label: "Tempo di risposta medio" },
      { value: "100%", label: "Custom per il tuo brand, personale" },
      { value: "70%", label: "Giudica un business dal sito" },
      { value: "26", label: "Servizi e moduli disponibili" },
      { value: "2 sett.", label: "Avvio medio progetto" },
    ],
  },
  problem: {
    eyebrow: "01 — Perche conta",
    title:
      "Quasi tutti i business locali hanno un sito. Quasi nessuno ha una vera prima impressione digitale.",
    body: "La maggior parte dei siti locali non costruisce fiducia. Mostra informazioni, ma non comunica qualita. Un sito premium orientato alla conversione puo ripagarsi in pochi mesi: per questo aiutiamo i business italiani a conquistare clienti diretti.",
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
        title: "Il 70% giudica un business dal sito",
        body: "Prima di contattarti, i clienti ti hanno gia valutato online. Un sito debole perde fiducia e conversioni.",
        note: "Stanford Web Credibility Research",
      },
      {
        title: "Un sito premium si ripaga",
        body: "Piu richieste dirette dal sito possono coprire l'investimento in pochi mesi — se il percorso e chiaro.",
        note: "Stima indicativa per il settore hospitality e locale",
      },
    ],
  },
  audit: {
    title: "Vuoi sapere\ncosa frena il tuo sito?",
    body: "Analizziamo il tuo sito attuale e ti diciamo esattamente cosa migliorare. Gratuito, senza pressione.",
    cta: "Richiedi il tuo audit gratuito",
    meta: "Rispondiamo entro 1 ora · Gratuito · Decidi tu i prossimi passi",
  },
  about: {
    eyebrow: "Chi siamo",
    title: "Design e sviluppo",
    bio: "Siamo un piccolo studio digitale in Emilia-Romagna. Creiamo un ambiente digitale per il business: dai siti e le interfacce all'automazione delle richieste, ai contenuti visivi e allo sviluppo continuo del prodotto. Non solo belli — tutto e costruito per risultati di business concreti.\n\nNon lavoriamo con 30 clienti alla volta. Seguiamo pochi progetti, trattando ogni business come se fosse il nostro.",
    pills: ["Emilia-Romagna, Italia", "Disponibile per nuovi progetti"],
  },
  contact: {
    label: "Iniziamo",
    title: "Un ambiente digitale per business che non vogliono essere come tutti.",
    body: "Dopo il tuo messaggio ricevi una risposta chiara con prossimi passi, tempistiche e fattibilita.",
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
      brief: "Descrivi brevemente cosa cerchi",
      source: "Come ci hai trovato?",
      submit: "Invia messaggio",
      submitting: "Invio in corso...",
      success: "Ricevuto. Ti rispondiamo entro 1 ora.",
      optional: "facoltativo",
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
        invalidEmail: "Inserisci un'email valida",
      },
    },
  },
  orderPage: {
    eyebrow: "Ordine",
    title: "Scegli i servizi",
    subtitle:
      "Seleziona una o piu opzioni — riceverai un preventivo personalizzato entro 1 ora. I prezzi sono indicativi e dipendono da scope e tempistiche.",
    fromLabel: "da",
    plusLabel: "+",
    selectHint: "Seleziona almeno un servizio per continuare, oppure scrivici direttamente.",
    proceedCta: "Richiedi preventivo",
    footnote:
      "Dopo la richiesta ricevi una risposta con scope, tempi e costo finale. Nessun pagamento automatico.",
    estimatedLabel: "Stima indicativa",
    addonsSectionTitle: "Moduli aggiuntivi",
    aboutServiceCta: "Info sul servizio",
  },
  pricingAddons: {
    eyebrow: "Moduli",
    title: "Estendi il progetto",
    subtitle:
      "Aggiungi funzionalita al pacchetto base. I moduli «+» si sommano al prezzo principale; quelli «da» sono progetti autonomi.",
    footnote:
      "Tutti gli importi sono indicativi. Il preventivo finale viene definito dopo il brief.",
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
  footer: {
    description: "Studio digitale per brand e business premium in tutta Italia.",
    links: "Link rapidi",
    location: "Emilia-Romagna, Italia",
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
    subtitle: "Dal sito di presentazione alla piattaforma digitale completa.",
    techStack: "Stack: Next.js · React · TypeScript · Tailwind CSS · Framer Motion",
    viewAll: "Tutti i servizi",
    pricingNote:
      "I prezzi dei pacchetti principali sono nella sezione Tariffe di ogni servizio. I moduli sotto si aggiungono su richiesta.",
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
      id: "premium-restaurant-local-concept",
      name: "Premium Restaurant Website",
      subtitle: "Restaurant conversion page",
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
      subtitle: "Botanical jewelry · e-commerce",
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
      title: "Custom Website Dev",
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
      title: "Booking & Lead Flow",
      description:
        "We build direct booking and enquiry flows on your site that increase conversion.",
      details: "Booking integration · Smart forms · A/B logic",
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
      title: "Photo & video with a professional videographer",
      description:
        "Location shoots and post-production handled by a dedicated videographer—food, interiors, team, and social-ready assets. Separate from web projects, with its own pricing tiers.",
      details: "On-location sessions · Audio when needed · Deliverables for web and social",
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
    eyebrow: "Digital Studio · Emilia-Romagna, Italy",
    headline: "Your business first impression\nstarts with\nthe website.",
    subtitle: "Where your brand speaks before you do",
    lead: "We craft premium digital experiences for brands and businesses that refuse to look generic—from local institutions to ambitious startups. Distinctive design, sharp strategy, measurable results.",
    primaryCta: "View projects",
    secondaryCta: "Request free audit",
    buyCta: "Order services",
    buyCtaShort: "Order",
    socialProof: "4 projects · Emilia-Romagna & Italy · Available for new clients",
    mockupCaption: "Your best business card",
  },
  trust: [
    "Design that converts",
    "Built for brands that stand out",
    "Direct bookings & leads",
    "Great on phones",
  ],
  proof: {
    eyebrow: "By the numbers",
    items: [
      { value: "1h", label: "Average response time" },
      { value: "100%", label: "Custom for your brand, personally" },
      { value: "70%", label: "Judge a business by its website" },
      { value: "26", label: "Services & add-on modules" },
      { value: "2 wks", label: "Average project kickoff" },
    ],
  },
  problem: {
    eyebrow: "01 — Why it matters",
    title:
      "Most local businesses have a website. Almost none of them have a digital first impression.",
    body: "Most local sites don't build trust. They display information but don't communicate quality. A premium, conversion-focused site can pay for itself within a few months. That's why we help Italian businesses win customers directly.",
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
        title: "70% judge a business by its website",
        body: "Before they contact you, customers have already formed an opinion online. A weak site loses trust and conversions.",
        note: "Stanford Web Credibility Research",
      },
      {
        title: "A premium site pays for itself",
        body: "More direct enquiries from your site can cover the investment within months — when the path is clear.",
        note: "Indicative estimate for hospitality and local businesses",
      },
    ],
  },
  audit: {
    title: "Want to know\nwhat's holding your site back?",
    body: "We analyze your current website and tell you exactly what to improve. Free, no pressure.",
    cta: "Request your free audit",
    meta: "Reply within 1 hour · Free · You decide the next steps",
  },
  about: {
    eyebrow: "About us",
    title: "Design & development",
    bio: "We're a small digital studio based in Emilia-Romagna. We build a digital environment for your business—from websites and interfaces to enquiry automation, visual content and ongoing product development. Not just polished looks: everything is built for real business results.\n\nWe don't work with 30 clients at a time. We take a few projects and treat every business as if it were our own.",
    pills: ["Emilia-Romagna, Italy", "Available for new projects"],
  },
  contact: {
    label: "Let's start",
    title: "A digital environment for businesses that don't want to be like everyone else.",
    body: "After your message you get a clear reply with next steps, timeline and feasibility.",
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
      brief: "Briefly describe what you're looking for",
      source: "How did you find us?",
      submit: "Send message",
      submitting: "Sending...",
      success: "Got it. We'll reply within 1 hour.",
      optional: "optional",
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
        invalidEmail: "Enter a valid email address",
      },
    },
  },
  orderPage: {
    eyebrow: "Order",
    title: "Choose your services",
    subtitle:
      "Select one or more options — you'll get a tailored quote within 1 hour. Prices are starting points and depend on scope and timeline.",
    fromLabel: "from",
    plusLabel: "+",
    selectHint: "Select at least one service to continue, or message us directly.",
    proceedCta: "Request a quote",
    footnote:
      "After your request you get scope, timeline and final cost. No automatic payment.",
    estimatedLabel: "Indicative estimate",
    addonsSectionTitle: "Add-on modules",
    aboutServiceCta: "About this service",
  },
  pricingAddons: {
    eyebrow: "Modules",
    title: "Extend your project",
    subtitle:
      "Add capabilities to the base package. «+» modules stack on the main price; «from» items are standalone projects.",
    footnote: "All figures are indicative. Final quote is set after the brief.",
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
  footer: {
    description: "Digital studio for premium brands and businesses across Italy.",
    links: "Quick links",
    location: "Emilia-Romagna, Italy",
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
    subtitle: "From a presentation site to a full digital platform.",
    techStack: "Stack: Next.js · React · TypeScript · Tailwind CSS · Framer Motion",
    viewAll: "All services",
    pricingNote:
      "Main package prices are in each service's Pricing section. Modules below can be added on request.",
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
      id: "premium-restaurant-local-concept",
      name: "Premium Restaurant Website",
      subtitle: "Conversion pour restaurant local",
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
      subtitle: "Bijoux botaniques · e-commerce",
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
      title: "Custom Website Dev",
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
      title: "Booking et Lead Flow",
      description:
        "Nous construisons des flux de reservation et de demande directe sur votre site qui augmentent les conversions.",
      details: "Integration booking · Formulaires intelligents · Logique A/B",
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
      title: "Photo & video avec vidéaste professionnel",
      description:
        "Prises de vue et post-production avec un vidéaste dédié : platings, lieux, équipe et contenus social. Service distinct des projets web, avec grilles tarifaires dédiées.",
      details: "Séances sur site · Audio si besoin · Livrables web et social",
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
    buy: "Commander",
    about: "A propos",
  },
  hero: {
    eyebrow: "Studio Digital · Emilia-Romagna, Italie",
    headline: "La premiere impression sur votre business\ncommence\npar le site.",
    subtitle: "La présence digitale qui parle pour vous",
    lead: "Nous concevons des expériences digitales premium pour marques et business qui refusent le générique — restaurants, commerces, studios et startups ambitieux. Design distinctif, stratégie concrète, résultats mesurables.",
    primaryCta: "Voir les projets",
    secondaryCta: "Demander un audit",
    buyCta: "Commander des services",
    buyCtaShort: "Commander",
    socialProof: "4 projets · Emilia-Romagna & Italie · Disponible pour nouveaux clients",
    mockupCaption: "Votre meilleure carte de visite",
  },
  trust: [
    "Design qui convertit",
    "Pensé pour les marques ambitieuses",
    "Reservations et leads directs",
    "Parfait sur smartphone",
  ],
  proof: {
    eyebrow: "En chiffres",
    items: [
      { value: "1h", label: "Temps de reponse moyen" },
      { value: "100%", label: "Custom pour votre marque, en personne" },
      { value: "70%", label: "Jugent un business par son site" },
      { value: "26", label: "Services et modules disponibles" },
      { value: "2 sem.", label: "Demarrage moyen projet" },
    ],
  },
  problem: {
    eyebrow: "01 — Pourquoi c'est important",
    title:
      "Presque tous les business locaux ont un site. Presque aucun n'a une vraie premiere impression digitale.",
    body: "La majorite des sites locaux n'inspire pas confiance. Ils montrent des infos mais ne communiquent pas la qualite. Un site premium oriente conversion peut s'amortir en quelques mois. C'est pourquoi nous aidons les business italiens a gagner des clients en direct.",
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
        title: "70% jugent un business par son site",
        body: "Avant de vous contacter, vos clients vous ont deja evalue en ligne. Un site faible perd confiance et conversions.",
        note: "Stanford Web Credibility Research",
      },
      {
        title: "Un site premium se rembourse",
        body: "Plus de demandes directes depuis votre site peuvent couvrir l'investissement en quelques mois — si le parcours est clair.",
        note: "Estimation indicative pour l'hospitality et le local",
      },
    ],
  },
  audit: {
    title: "Vous voulez savoir\nce qui freine votre site?",
    body: "Nous analysons votre site actuel et nous vous disons exactement ce qu'il faut ameliorer. Gratuit, sans pression.",
    cta: "Demander votre audit gratuit",
    meta: "Reponse sous 1h · Gratuit · Vous decidez des prochaines etapes",
  },
  about: {
    eyebrow: "Qui sommes-nous",
    title: "Design & développement",
    bio: "Nous sommes un petit studio digital en Emilia-Romagna. Nous creons un environnement digital pour le business : des sites et interfaces a l'automatisation des demandes, au contenu visuel et au developpement continu du produit. Pas seulement beau — tout est pense pour des resultats business concrets.\n\nNous ne travaillons pas avec 30 clients en parallele. Nous suivons quelques projets, en traitant chaque business comme s'il etait le notre.",
    pills: ["Emilia-Romagna, Italie", "Disponible pour nouveaux projets"],
  },
  contact: {
    label: "Commencons",
    title: "Un environnement digital pour les business qui ne veulent pas ressembler a tout le monde.",
    body: "Apres votre message vous recevez une reponse claire avec les prochaines etapes, le timing et la faisabilite.",
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
      brief: "Decrivez brievement ce que vous cherchez",
      source: "Comment nous avez-vous trouves?",
      submit: "Envoyer le message",
      submitting: "Envoi en cours...",
      success: "Bien recu. Nous repondons sous 1 heure.",
      optional: "facultatif",
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
        invalidEmail: "Entrez une adresse e-mail valide",
      },
    },
  },
  orderPage: {
    eyebrow: "Commande",
    title: "Choisissez vos services",
    subtitle:
      "Selectionnez une ou plusieurs options — vous recevrez un devis personnalise sous 1 heure. Les prix sont indicatifs et dependent du scope et des delais.",
    fromLabel: "a partir de",
    selectHint: "Selectionnez au moins un service pour continuer, ou ecrivez-nous directement.",
    proceedCta: "Demander un devis",
    footnote:
      "Apres votre demande vous recevez scope, delais et cout final. Aucun paiement automatique.",
    plusLabel: "+",
    estimatedLabel: "Estimation indicative",
    addonsSectionTitle: "Modules additionnels",
    aboutServiceCta: "A propos du service",
  },
  pricingAddons: {
    eyebrow: "Modules",
    title: "Etendez votre projet",
    subtitle: "Ajoutez des fonctionnalites au forfait de base.",
    footnote: "Montants indicatifs. Devis final apres le brief.",
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
        title: "Produits numeriques",
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
  footer: {
    description: "Studio digital pour marques et business premium en Italie.",
    links: "Liens rapides",
    location: "Emilia-Romagna, Italie",
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
    subtitle: "Du site vitrine à la plateforme numérique complète.",
    techStack: "Stack : Next.js · React · TypeScript · Tailwind CSS · Framer Motion",
    viewAll: "Tous les services",
    pricingNote: "Les tarifs des forfaits principaux sont dans la section Tarifs de chaque service.",
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
        title: "Produits numériques",
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
      title: "Custom Website Dev",
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
      title: "Booking и lead-flow",
      description:
        "Строим прямые бронирования и заявки с сайта, которые поднимают конверсию.",
      details: "Интеграция booking · Умные формы · A/B логика",
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
    buy: "Купить",
    about: "О нас",
  },
  hero: {
    eyebrow: "Digital Studio · Emilia-Romagna, Italia",
    headline: "Первое впечатление\nо бизнесе\nначинается с сайта.",
    subtitle: "Цифровое присутствие, которое говорит за вас",
    lead: "Создаём премиум цифровые опыты для брендов и бизнесов, которые не хотят выглядеть шаблонно — от локальных проектов до амбициозных стартапов. Выразительный дизайн, чёткая стратегия, измеримый результат.",
    primaryCta: "Смотреть проекты",
    secondaryCta: "Запросить бесплатный аудит",
    buyCta: "Заказать услуги",
    buyCtaShort: "Заказать",
    socialProof: "4 проекта · Эмилия-Романья и Италия · Открыты для новых клиентов",
    mockupCaption: "Ваша лучшая визитная карточка",
    mockupCaptionSm: true,
  },
  trust: [
    "Дизайн, который конвертирует",
    "Для брендов, которые выделяются",
    "Прямые заявки и бронирования",
    "Удобно со смартфона",
  ],
  proof: {
    eyebrow: "В цифрах",
    items: [
      { value: "1h", label: "Среднее время ответа" },
      { value: "100%", label: "Кастом под ваш бренд лично" },
      { value: "70%", label: "Судят о бизнесе по сайту" },
      { value: "26", label: "Услуг и модулей на выбор" },
      { value: "2 нед.", label: "Средний старт проекта" },
    ],
  },
  problem: {
    eyebrow: "01 — Почему это важно",
    title:
      "Почти у всех локальных бизнесов есть сайт. Почти ни у кого нет настоящего цифрового первого впечатления.",
    body: "Большинство локальных сайтов не строит доверие. Они показывают информацию, но не передают качество. Премиум-сайт, сделанный под конверсию, может окупиться за несколько месяцев. Именно поэтому мы помогаем итальянским бизнесам получать клиентов напрямую.",
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
        title: "70% судят о бизнесе по сайту",
        body: "Ещё до обращения клиенты уже оценили вас онлайн. Слабый сайт теряет доверие и заявки.",
        note: "Stanford Web Credibility Research",
      },
      {
        title: "Премиум-сайт себя окупает",
        body: "Больше прямых заявок с сайта может покрыть вложения за несколько месяцев — если путь понятен.",
        note: "Ориентир для отелей и локального бизнеса",
      },
    ],
  },
  audit: {
    title: "Хотите узнать,\nчто мешает вашему сайту?",
    body: "Мы проанализируем ваш текущий сайт и скажем точно, что улучшить. Бесплатно, без давления.",
    cta: "Запросить свой бесплатный аудит",
    meta: "Отвечаем в течение 1 часа · Бесплатно · Решение за вами",
  },
  about: {
    eyebrow: "О нас",
    title: "Дизайн и разработка",
    bio: "Мы небольшая цифровая студия в Эмилия-Романье. Создаём цифровую среду для бизнеса: от сайтов и интерфейсов до автоматизации заявок, визуального контента и постоянного развития продукта. Не просто красиво — всё заточено под реальные бизнес-результаты.\n\nМы не работаем с 30 клиентами одновременно. Берём несколько проектов и относимся к каждому бизнесу как к своему.",
    pills: ["Эмилия-Романья, Италия", "Открыты для новых проектов"],
  },
  contact: {
    label: "Начнём",
    title: "Цифровая среда для бизнеса, который не хочет быть как все.",
    body: "После вашего сообщения вы получите чёткий ответ со следующими шагами, сроками и оценкой реализуемости.",
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
      brief: "Коротко опишите, что ищете",
      source: "Как вы нас нашли?",
      submit: "Отправить сообщение",
      submitting: "Отправка...",
      success: "Принято. Ответим в течение 1 часа.",
      optional: "необязательно",
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
        invalidEmail: "Введите корректный email",
      },
    },
  },
  orderPage: {
    eyebrow: "Заказ",
    title: "Выберите услуги",
    subtitle:
      "Отметьте одну или несколько опций — персональный расчёт пришлём в течение 1 часа. Цены указаны «от» и зависят от объёма и сроков.",
    fromLabel: "от",
    selectHint: "Выберите хотя бы одну услугу или напишите нам напрямую.",
    proceedCta: "Запросить расчёт",
    footnote:
      "После заявки вы получите объём работ, сроки и итоговую стоимость. Автоматической оплаты нет.",
    plusLabel: "+",
    estimatedLabel: "Ориентировочная сумма",
    addonsSectionTitle: "Дополнительные модули",
    aboutServiceCta: "Об услуге",
  },
  pricingAddons: {
    eyebrow: "Модули",
    title: "Расширьте проект",
    subtitle:
      "Добавьте функции к базовому пакету. Модули «+» суммируются с основной ценой; «от» — отдельные проекты.",
    footnote: "Все суммы ориентировочные. Итог — после брифа.",
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
        title: "Продукты",
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
  footer: {
    description: "Цифровая студия для премиум-брендов и бизнесов по всей Италии.",
    links: "Быстрые ссылки",
    location: "Эмилия-Романья, Италия",
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
    subtitle: "От сайта-визитки до полноценной цифровой платформы.",
    techStack: "Стек: Next.js · React · TypeScript · Tailwind CSS · Framer Motion",
    viewAll: "Все услуги",
    pricingNote:
      "Цены основных пакетов — в разделе «Тарифы» каждой услуги. Модули ниже добавляются по запросу.",
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
        title: "Продукты",
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
      id: "premium-restaurant-local-concept",
      name: "Premium Restaurant Website",
      subtitle: "Conversion-Seite · lokales Restaurant",
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
      subtitle: "Botanischer Schmuck · e-commerce",
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
      title: "Custom Website Dev",
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
      title: "Booking und Lead-Flow",
      description:
        "Wir bauen Direktbuchungs- und Anfrage-Flows auf Ihrer Website, die Conversion steigern.",
      details: "Booking-Integration · Smarte Formulare · A/B-Logik",
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
      title: "Foto & Video mit professionellem Videografen",
      description:
        "Drehs und Postproduktion mit festem Videografen: Food, Raume, Team und Social-Assets. Eigenstandiger Service neben Webprojekten, mit eigenen Tarifen.",
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
    buy: "Bestellen",
    about: "Uber uns",
  },
  hero: {
    eyebrow: "Digitales Studio · Emilia-Romagna, Italien",
    headline: "Der erste Eindruck uber Ihr Business\nbeginnt\nmit der Website.",
    subtitle: "Digitale Präsenz, die für Sie spricht",
    lead: "Wir bauen Premium-Digitalerlebnisse für Marken und Unternehmen, die nicht generisch wirken wollen — von lokalen Betrieben bis zu ambitionierten Startups. Ausdrucksstarkes Design, klare Strategie, messbare Ergebnisse.",
    primaryCta: "Projekte ansehen",
    secondaryCta: "Audit anfragen",
    buyCta: "Leistungen bestellen",
    buyCtaShort: "Bestellen",
    socialProof: "4 Projekte · Emilia-Romagna & Italien · Verfugbar fur neue Kunden",
    mockupCaption: "Ihre beste Visitenkarte",
  },
  trust: [
    "Design, das konvertiert",
    "Fur Marken, die herausstechen",
    "Direkte Buchungen und Anfragen",
    "Perfekt auf dem Smartphone",
  ],
  proof: {
    eyebrow: "In Zahlen",
    items: [
      { value: "1h", label: "Durchschnittliche Reaktionszeit" },
      { value: "100%", label: "Custom fur Ihre Marke, personlich" },
      { value: "70%", label: "Beurteilen ein Business an der Website" },
      { value: "26", label: "Leistungen und Module zur Auswahl" },
      { value: "2 Wo.", label: "Durchschnittlicher Projektstart" },
    ],
  },
  problem: {
    eyebrow: "01 — Warum es zahlt",
    title:
      "Fast jedes lokale Unternehmen hat eine Website. Fast keines hat einen echten digitalen ersten Eindruck.",
    body: "Die meisten lokalen Websites schaffen kein Vertrauen. Sie zeigen Informationen, vermitteln aber keine Qualitat. Eine Premium-Website mit Conversion-Fokus kann sich in wenigen Monaten amortisieren. Genau deshalb helfen wir italienischen Unternehmen, Kunden direkt zu gewinnen.",
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
        title: "70% beurteilen ein Business an der Website",
        body: "Bevor Kunden Sie kontaktieren, haben sie Sie online schon bewertet. Eine schwache Website verliert Vertrauen und Anfragen.",
        note: "Stanford Web Credibility Research",
      },
      {
        title: "Eine Premium-Website rechnet sich",
        body: "Mehr direkte Anfragen uber Ihre Website konnen die Investition in wenigen Monaten decken — wenn der Weg klar ist.",
        note: "Indikativ fur Hospitality und lokale Businesses",
      },
    ],
  },
  audit: {
    title: "Wollen Sie wissen,\nwas Ihre Website bremst?",
    body: "Wir analysieren Ihre aktuelle Website und sagen Ihnen genau, was zu verbessern ist. Kostenlos, ohne Druck.",
    cta: "Ihr kostenloses Audit anfragen",
    meta: "Antwort innerhalb einer Stunde · Kostenlos · Sie entscheiden uber die nachsten Schritte",
  },
  about: {
    eyebrow: "Uber uns",
    title: "Design & Entwicklung",
    bio: "Wir sind ein kleines Digital-Studio in der Emilia-Romagna. Wir schaffen eine digitale Umgebung fur Ihr Business — von Websites und Interfaces bis zur Automatisierung von Anfragen, visuellem Content und kontinuierlicher Produktentwicklung. Nicht nur schon — alles ist auf echte Business-Ergebnisse ausgelegt.\n\nWir arbeiten nicht mit 30 Kunden gleichzeitig. Wir betreuen wenige Projekte und behandeln jedes Business, als ware es unser eigenes.",
    pills: ["Emilia-Romagna, Italien", "Verfugbar fur neue Projekte"],
  },
  contact: {
    label: "Lass uns starten",
    title: "Eine digitale Umgebung fur Unternehmen, die nicht wie alle sein wollen.",
    body: "Nach Ihrer Nachricht bekommen Sie eine klare Antwort mit nachsten Schritten, Timing und Machbarkeit.",
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
      brief: "Beschreiben Sie kurz, was Sie suchen",
      source: "Wie haben Sie uns gefunden?",
      submit: "Nachricht senden",
      submitting: "Wird gesendet...",
      success: "Erhalten. Wir antworten innerhalb einer Stunde.",
      optional: "optional",
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
        invalidEmail: "Gültige E-Mail-Adresse eingeben",
      },
    },
  },
  orderPage: {
    eyebrow: "Bestellung",
    title: "Leistungen auswahlen",
    subtitle:
      "Wahlen Sie eine oder mehrere Optionen — Sie erhalten innerhalb einer Stunde ein individuelles Angebot. Preise sind Startwerte und hangen von Umfang und Zeitplan ab.",
    fromLabel: "ab",
    selectHint: "Wahlen Sie mindestens eine Leistung oder schreiben Sie uns direkt.",
    proceedCta: "Angebot anfragen",
    footnote:
      "Nach Ihrer Anfrage erhalten Sie Umfang, Zeitplan und Endpreis. Keine automatische Zahlung.",
    plusLabel: "+",
    estimatedLabel: "Richtwert",
    addonsSectionTitle: "Zusatzmodule",
    aboutServiceCta: "Zur Leistung",
  },
  pricingAddons: {
    eyebrow: "Module",
    title: "Projekt erweitern",
    subtitle: "Funktionen zum Basispaket hinzufugen.",
    footnote: "Alle Betrage sind Richtwerte. Endangebot nach Briefing.",
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
        title: "Digitale Produkte",
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
  footer: {
    description: "Digitales Studio fur Premium-Marken und Unternehmen in ganz Italien.",
    links: "Schnellzugriff",
    location: "Emilia-Romagna, Italien",
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
    subtitle: "Vom Präsentationssite bis zur vollständigen digitalen Plattform.",
    techStack: "Stack: Next.js · React · TypeScript · Tailwind CSS · Framer Motion",
    viewAll: "Alle Leistungen",
    pricingNote: "Hauptpaket-Preise finden Sie im Bereich Preise jeder Leistung.",
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
        title: "Digitale Produkte",
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

