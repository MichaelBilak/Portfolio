import type { TranslationSet } from "@/lib/translations";

export const es: TranslationSet = {
  langName: "Español",
  langCode: "ES",
  projects: [
    {
      id: "porto-sole",
      name: "Porto Sole",
      subtitle: "Restaurante y bar en el muelle",
      problem:
        "El sitio web no transmitía con suficiente claridad la experiencia única de cenar a 400 metros en el Adriático, la atmósfera del atardecer ni las reservas para eventos.",
      solution:
        "Narrativa cinematográfica que guía al visitante del atardecer a la medianoche, con un recorrido de reserva claro y optimizado para móvil.",
      businessImpact:
        "Sitio web en vivo que comunica la identidad visual de Porto Sole y convierte a los visitantes en reservas directas desde el primer vistazo.",
    },
    {
      id: "hotel-direct-booking",
      name: "Aurelia del Mar",
      nameTagline: "Hotel Direct Booking System",
      subtitle: "Hotel frente al mar · reserva directa",
      problem:
        "El hotel necesitaba una experiencia de reserva directa pulida que comunicara ubicación, habitaciones, servicios y ofertas exclusivas sin enviar a los huéspedes de vuelta a plataformas de terceros.",
      solution:
        "Un sitio web hotelero orientado a la conversión con hero inmersivo, destacados de habitaciones, secciones de servicios, reseñas de huéspedes, paquetes y un flujo de reserva guiado.",
      businessImpact:
        "Prototipo en vivo que posiciona a Aurelia del Mar como una estancia premium frente al mar y da a los huéspedes una razón clara para reservar directamente.",
    },
    {
      id: "mare-vivo",
      name: "Mare Vivo",
      nameTagline: "Fresh Seafood. Mediterranean Soul.",
      subtitle: "Mariscos mediterraneos · Bari",
      problem:
        "El restaurante necesitaba una presencia online que transmitiera el pescado fresco del Adriatico, la historia familiar y un camino de reserva claro en movil.",
      solution:
        "Diseno editorial costero con menu destacado, resenas de clientes, contenido bilingue EN/IT y flujo de reservas via WhatsApp y formulario directo.",
      businessImpact:
        "Sitio en vivo que posiciona a Mare Vivo como cocina costera italiana autentica y convierte visitantes en reservas de mesa.",
    },
    {
      id: "podlopuhom-jewelry",
      name: "Pod Lopuhom",
      nameTagline: "Handmade Jewelry",
      subtitle: "Joyería botánica · e-commerce",
      problem:
        "La artesana gestionaba los pedidos solo por mensajes directos, sin un escaparate adecuado para presentar colecciones, precios y disponibilidad a un público internacional.",
      solution:
        "Galería multilingüe (EN/RU/IT) con categorías claras, ficha de producto y CTAs directos a WhatsApp / Instagram para cerrar el pedido.",
      businessImpact:
        "Sitio en vivo que convirtió un perfil social en una marca profesional, aumentando la confianza, los pedidos directos y la visibilidad en nuevos mercados.",
    },
    {
      id: "solovyev-store",
      name: "SOLOVYEV STORE",
      nameTagline: "Streetwear & Sneakers Consignment",
      subtitle: "Streetwear premium · buy / sell / trade",
      problem:
        "La tienda vivia sobre todo en Instagram y era dificil de encontrar en Google. El stock no estaba claro y los pedidos por WhatsApp llegaban en chats confusos, sin detalles claros de producto o talla.",
      solution:
        "Creamos una tienda online clara: paginas de producto, estados de stock, un panel sencillo para el catalogo, cuentas de clientes y pedidos de WhatsApp ordenados con todo lo necesario para cerrar la venta.",
      businessImpact:
        "Un sitio en vivo donde los clientes encuentran y compran con mas facilidad — pedidos mas claros, catalogo bajo control y menos idas y vueltas en el chat.",
    },
  ],
  services: [
    {
      id: "premium-site",
      title: "Sitios web y productos digitales",
      description:
        "Sitios y productos web a medida — del site de marca a experiencias orientadas a conversión. Mobile-first, rápidos, hechos para funcionar.",
      details: "Del wireframe al lanzamiento · CMS opcional · SEO base incluido",
      whatYouGet: [
        "Diseño premium e identidad visual",
        "Desarrollo Next.js rápido y preparado para SEO",
        "Mobile-first optimizado para la conversión",
        "CMS opcional para gestión de contenidos",
        "Lanzamiento y soporte post-publicación incluidos",
      ],
      pricingSectionTitle: "Paquetes web",
      pricingFootnote:
        "Precios orientativos de partida. El presupuesto final depende de páginas, integraciones y plazos.",
      pricingTiers: [
        {
          tierId: "starter",
          name: "Starter",
          detail: "Landing · 3–5 pantallas · 1 idioma · SEO base incluido.",
        },
        {
          tierId: "business",
          name: "Business",
          detail: "6–10 páginas · CMS · formularios · SEO base · ideal para pymes y hostelería.",
        },
        {
          tierId: "premium",
          name: "Premium",
          detail: "Sitio completo · multilingüe · reservas · animaciones · máxima conversión.",
        },
      ],
    },
    {
      id: "redesign",
      title: "Upgrade de sistemas y redesign",
      description:
        "Evolucionamos la presencia digital existente hacia un sistema más claro — estructura, UX, rendimiento y rutas de conversión.",
      details: "Auditoría · Estrategia · Implementación",
      whatYouGet: [
        "Auditoría completa de tu sitio actual",
        "Nueva arquitectura de información y UX",
        "Identidad visual actualizada y premium",
        "Migración de contenidos sin pérdidas",
        "Configuración de analítica y seguimiento",
      ],
      pricingSectionTitle: "Paquetes de rediseño",
      pricingFootnote:
        "El coste depende del estado actual del sitio, el número de páginas y el nivel de personalización.",
      pricingTiers: [
        {
          tierId: "audit",
          name: "Solo auditoría",
          detail: "Análisis completo · informe prioritario · hoja de ruta de mejoras.",
        },
        {
          tierId: "standard",
          name: "Standard",
          detail: "Rediseño de pantallas clave + implementación · nueva UX y visual.",
        },
        {
          tierId: "full",
          name: "Full",
          detail: "Rediseño completo · migración de contenidos · analítica y seguimiento.",
        },
      ],
    },
    {
      id: "booking-flow",
      title: "Automatización de procesos",
      description:
        "Automatizamos reservas, consultas y flujos repetitivos para que los leads no se pierdan en chats y calendarios.",
      details: "Flujos · Integraciones · Formularios inteligentes · Reporting",
      whatYouGet: [
        "Análisis de tu embudo de reservas actual",
        "Integración del sistema de reservas",
        "Formularios inteligentes orientados a la conversión",
        "Pruebas A/B en CTAs y flujos clave",
        "Informe mensual de resultados",
      ],
      pricingSectionTitle: "Paquetes de reservas y leads",
      pricingFootnote:
        "Funciona con sitios existentes o nuevos. El precio varía según integraciones y complejidad del embudo.",
      pricingTiers: [
        {
          tierId: "single",
          name: "Single flow",
          detail: "Un solo camino — reserva o consulta · formulario optimizado + CTA.",
        },
        {
          tierId: "multi",
          name: "Multi-flow",
          detail: "Varios caminos · integración de reservas · optimización de CTAs en todo el sitio.",
        },
        {
          tierId: "full",
          name: "Full",
          detail: "Embudo de extremo a extremo · pruebas A/B · informe mensual de resultados.",
        },
      ],
    },
    {
      id: "monthly-support",
      title: "Crecimiento continuo y cuidado",
      description:
        "Actualizaciones, optimización y soporte prioritario en todo tu stack digital — para que los sistemas sigan el ritmo del negocio.",
      details: "Desde 2 h/mes · Prioridad garantizada · Informe mensual",
      whatYouGet: [
        "Actualizaciones técnicas y de contenido",
        "Monitorización de rendimiento y disponibilidad",
        "Optimización continua de la conversión",
        "Prioridad en nuevas solicitudes",
        "Informe mensual claro",
      ],
      pricingSectionTitle: "Planes de soporte",
      pricingFootnote: "Retainer mensual. Las horas no utilizadas no se acumulan.",
      pricingTiers: [
        {
          tierId: "essential",
          name: "Essential",
          detail: "~2 h/mes · actualizaciones · monitorización básica · respuesta prioritaria.",
        },
        {
          tierId: "growth",
          name: "Growth",
          detail: "~5 h/mes · optimización continua · informe mensual.",
        },
        {
          tierId: "priority",
          name: "Priority",
          detail: "~10 h/mes · máxima prioridad · informe detallado.",
        },
      ],
    },
    {
      id: "photo-video",
      title: "Producción de contenidos",
      description:
        "Producción de foto y vídeo para web, campañas y redes — brief, rodaje, edición y entregables listos para usar.",
      details: "Sesiones in situ · Audio cuando haga falta · Entregables para web y redes",
      whatYouGet: [
        "Brief creativo y lista de planos alineados con tus objetivos",
        "Captura profesional de foto y vídeo",
        "Edición (montaje, color, formatos vertical y horizontal)",
        "Archivos listos para hero, menús digitales y campañas",
        "Derechos de uso para marketing digital (según acuerdo)",
      ],
      portfolioUrl2: "https://levkaplan-video.framer.website",
      portfolioLinkLabel2: "Videographer portfolio",
      pricingSectionTitle: "Niveles de precio (servicio independiente)",
      pricingFootnote:
        "Las cifras se cotizan por brief según ubicación, duración y derechos de uso.",
      pricingTiers: [
        {
          tierId: "half-day",
          name: "Half day",
          detail: "Hasta 4 horas · foto o vídeo · selección curada y edición base · ideal para menús y redes.",
        },
        {
          tierId: "full-day",
          name: "Full day",
          detail: "Jornada completa de rodaje · foto + vídeo · más variantes para sitio y campañas.",
        },
        {
          tierId: "retainer",
          name: "Monthly retainer",
          detail: "Rodajes recurrentes y cadencia de contenido · continuidad para feed y anuncios.",
        },
      ],
    },
  ],
  process: [
    {
      id: "understand",
      title: "Understand",
      summary: "Negocio, audiencia, objetivos, problemas.",
      description:
        "Estudiamos el negocio, la audiencia, los objetivos y los problemas actuales para entender qué debe lograr el sistema digital: sitios e integraciones.",
    },
    {
      id: "plan",
      title: "Plan",
      summary: "Estructura, flujos, sistemas, prioridades.",
      description:
        "Definimos la estructura, los flujos de usuario, los sistemas y las funciones clave según las necesidades específicas del cliente.",
    },
    {
      id: "design",
      title: "Design",
      summary: "Estilo de marca, claridad, confianza, conversión.",
      description:
        "Creamos una dirección visual acorde con la marca, que genera confianza y deja clara la propuesta.",
    },
    {
      id: "build",
      title: "Build",
      summary: "Sitios, sistemas, integraciones, rendimiento.",
      description:
        "Desarrollamos sitios e integraciones responsive, rápidos y funcionales con las herramientas adecuadas.",
    },
    {
      id: "improve",
      title: "Improve",
      summary: "Pruebas, lanzamiento, feedback, optimización.",
      description:
        "Probamos, lanzamos y refinamos el proyecto según feedback, datos y futuras necesidades del negocio.",
    },
  ],
  nav: {
    work: "Proyectos",
    services: "Servicios",
    process: "Proceso",
    contact: "Contacto",
    audit: "Auditoría gratis",
    buy: "Pedir",
    about: "Sobre nosotros",
  },
  hero: {
    eyebrow: "Digital Studio",
    headline: "Your business.\nBuilt to work.\nDesigned to impress.",
    subtitle: "",
    lead: "Sistemas digitales, automatización de procesos, sitios web y producción de contenidos.",
    primaryCta: "Ver proyectos",
    secondaryCta: "Solicitar auditoría gratis",
    buyCta: "Pedir servicios",
    buyCtaShort: "Pedir",
    socialProof: "4 proyectos · Disponibles para nuevos clientes",
    mockupCaption: "Tu mejor tarjeta de visita",
    chipHighlight: "Llave en mano",
    chipAvailability: "Waiting for you",
    chipAvailabilitySub: "digital studio",
  },
  trust: [
    "Sistemas digitales que conectan",
    "Automatización que ahorra tiempo",
    "Sitios que convierten",
    "Contenido que genera confianza",
  ],
  proof: {
    eyebrow: "En cifras",
    items: [
      { value: "1h", label: "Tiempo medio de respuesta" },
      { value: "100%", label: "enfoque único" },
      { value: "4", label: "direcciones distintas\nsistemas · automatización · web · contenido" },
      { value: "26", label: "Servicios y módulos disponibles" },
    ],
    footnote: { value: "2 sem", label: "Inicio medio de proyecto" },
  },
  problem: {
    eyebrow: "01 — Por qué importa",
    title:
      "La mayoría de los negocios tienen herramientas.\nCasi ninguno tiene un sistema digital que funcione de verdad.",
    body: "Canales dispersos, procesos manuales, una presencia web débil y contenido que no vende: esa brecha cuesta tiempo y clientes.\n\nConectamos sistemas digitales, automatizamos procesos, construimos sitios y producimos contenido para que el negocio funcione mejor y se vea a la altura.",
  },
  caseStudies: {
    label: "Trabajo seleccionado",
    viewCaseStudy: "Ver caso de estudio",
    fields: {
      problem: "Problema",
      solution: "Solución",
      businessImpact: "Impacto en el negocio",
    },
  },
  beforeAfter: {
    eyebrow: "Antes y después · primera pantalla",
    title: "Cómo cambia la primera pantalla tras un rediseño enfocado.",
    subtitle:
      "Ejemplos interactivos en distintos sectores — hotel, restaurante, bar, negocio local y un diseño a medida según el brief. Compara cómo mejoran la jerarquía, el mensaje y la llamada a la acción. Arrastra el divisor dorado.",
    beforeBadge: "Antes",
    afterBadge: "Después",
    dragHint: "Arrastra para comparar",
    changesTitle: "En este ejemplo, qué mejora",
    footerNote:
      "Maquetas ilustrativas: la paleta y el diseño varían según el sector. El objetivo siempre es claridad y conversión.",
    cases: [
      {
        tab: "Hotel",
        headline: "De un hero «todo se ve igual» a un camino de reserva legible — incluso con una UI clara.",
        changes: [
          "Un CTA de reserva dominante; acciones secundarias visualmente relegadas.",
          "Hero editorial claro: tipografía grande, foto ordenada, micro-confianza.",
          "Eliminados los bloques idénticos inferiores: espacio para una promesa fuerte.",
          "Paleta cálida premium sin depender de un tema oscuro.",
        ],
        beforeAlt: "Plantilla genérica de hotel: degradado de stock, dos CTAs grises gemelos, cuadrícula anodina.",
        afterAlt: "Hotel después: diseño crema cálido, un solo botón ámbar de reserva, hero equilibrado.",
      },
      {
        tab: "Restaurante",
        headline: "Menú y tono de cocina primero — menos ruido visual.",
        changes: [
          "El foco en menú / cena supera un muro genérico de «bienvenida».",
          "Un solo CTA (reservar / degustación) con un acento cálido coherente.",
          "Imagen de comida enmarcada con aire, no una franja de color aleatoria.",
          "Franja de confianza bajo el hero en lugar de cuatro cajas iguales.",
        ],
        beforeAlt: "Plantilla de restaurante: franja ruidosa, título débil, dos botones anónimos.",
        afterAlt: "Restaurante después: paleta cálida, titular contundente, CTA terracota, foto destacada.",
      },
      {
        tab: "Bar",
        headline: "Identidad nocturna sin caos neón: contraste y una sola invitación.",
        changes: [
          "UI clara + tipografía negra contundente para legibilidad instantánea.",
          "Un CTA de acento (carta / reservar), no dos gemelos grises.",
          "Tarjeta visual lateral en lugar de una franja abstracta a ancho completo.",
          "Estructura pensada para un escaneo rápido como una carta de bebidas.",
        ],
        beforeAlt: "Plantilla de bar: franja abstracta, copy centrado débil, bloques gemelos.",
        afterAlt: "Bar después: UI clara limpia, titular grande, CTA naranja, tarjeta lateral.",
      },
      {
        tab: "Local",
        headline: "De escaparate anónimo a «por qué elegirnos» en tres segundos.",
        changes: [
          "Titular con promesa local (horario, zona, servicio) desde el inicio.",
          "Insignias de confianza (reseñas, años) directamente bajo el hero.",
          "Fila de servicios legible + CTA de contacto en lugar de bloques idénticos.",
          "Paleta verde/blanco fresca para proximidad e higiene — no plantilla gris.",
        ],
        beforeAlt: "Negocio local: cajas idénticas sin mensaje claro.",
        afterAlt: "Local después: titular verde, CTA de contacto, franja de confianza.",
      },
      {
        tab: "Custom",
        headline: "De un brief vacío a módulos que llevan tu marca.",
        changes: [
          "Estructura modular (servicios / prueba / CTA) adaptable al sector real.",
          "Espacios para claims, cifras y citas sin lorem interminable.",
          "Acentos dorados claros sobre blanco para continuidad con el resto del sitio.",
          "Listo para contenido real: cada bloque tiene un rol claro.",
        ],
        beforeAlt: "Lorem genérico y tres franjas grises sin jerarquía.",
        afterAlt: "Diseño modular según brief: tarjetas de marca, cuadrícula ordenada, contenedores definidos.",
      },
    ],
  },
  servicesLabel: "Qué construimos",
  servicesLead: "Sistemas · Automatización · Sitios · Contenido",
  processSection: {
    eyebrow: "Proceso",
    title: "Cómo convertimos el caos digital en un activo de negocio",
    subtitle:
      "Sistemas, automatización, web y contenido en un solo método orientado al negocio — no solo un sitio bonito.",
    stepLabel: "Paso",
    footerNote:
      "Cada proyecto es flexible: el proceso, el diseño y la funcionalidad se adaptan a las necesidades reales de cada cliente.",
  },
  impact: {
    label: "Por qué importa",
    items: [
      {
        title: "Sistemas que conectan las operaciones",
        body: "Portales, dashboards y superficies de producto que sacan el trabajo de chats y hojas de cálculo.",
        note: "Sistemas digitales",
      },
      {
        title: "Automatización que ahorra horas",
        body: "Reservas, consultas y flujos repetitivos con caminos claros — menos leads perdidos, menos seguimiento manual.",
        note: "Automatización de procesos",
      },
      {
        title: "Sitios que convierten",
        body: "Una presencia web sólida sigue generando confianza. Creamos y mejoramos sitios que convierten atención en acción.",
        note: "Sitios web",
      },
      {
        title: "Contenido que genera confianza",
        body: "Foto, vídeo y assets listos para web y campañas — para que la marca se vea tan sólida como opera.",
        note: "Producción de contenidos",
      },
    ],
  },
  audit: {
    title: "¿Quieres saber qué\nfrena tu negocio?",
    body: "Revisamos sistemas, procesos, sitio y contenido — y te decimos exactamente qué mejorar.",
    cta: "Solicita tu auditoría",
    meta: "Respuesta en 1 hora · Gratis · Tú decides los siguientes pasos",
    freeBadge: "FREE",
  },
  about: {
    eyebrow: "Sobre nosotros",
    title: "¿Quiénes somos?",
    bio: "Somos un pequeño estudio digital. Construimos el entorno digital que tu negocio necesita: sistemas y plataformas, automatización de procesos, sitios e interfaces, más contenido visual y desarrollo continuo del producto. No solo un aspecto pulido: todo está pensado para resultados reales de negocio.\n\nNo trabajamos con 30 clientes a la vez. Tomamos pocos proyectos y tratamos cada negocio como si fuera el nuestro.",
    pills: ["Disponibles para nuevos proyectos"],
  },
  contact: {
    label: "Empecemos",
    title: "Un entorno digital para negocios que no quieren ser como todos.",
    body: "Tras tu mensaje recibirás una respuesta clara con los siguientes pasos, plazos y viabilidad.",
    compactTitle: "Solicita tu auditoría gratuita",
    emailLabel: "Email",
    whatsappLabel: "WhatsApp · Respuesta en 1 h",
    availability: "Actualmente disponibles para nuevos clientes",
    cart: {
      eyebrow: "Tu selección",
      title: "Servicios seleccionados",
      addonsLabel: "Módulos adicionales",
      continueSearch: "Seguir explorando servicios",
      removeItem: "Eliminar",
    },
    form: {
      name: "Nombre completo",
      email: "Email",
      business: "Nombre del negocio",
      businessType: "Tipo de negocio",
      siteUrl: "URL del sitio o producto",
      brief: "Describe brevemente qué buscas",
      source: "¿Cómo nos encontraste?",
      submit: "Enviar mensaje",
      submitAudit: "Solicitar auditoría gratuita",
      submitting: "Enviando...",
      success: "Responderemos en 1 hora.",
      successTitle: "Tu solicitud ha sido enviada",
      successClose: "Cerrar",
      submitError: "No se pudo enviar. Escríbenos a {email} y responderemos pronto.",
      auditBriefPlaceholder: "¿Qué no funciona en tu setup digital — sistemas, procesos, sitio o contenido?",
      optional: "opcional",
      options: {
        restaurant: "Restaurante / hospitality",
        hotel: "Hotel",
        bar: "Bar / local",
        other: "Otro / servicios",
        google: "Google",
        referral: "Boca a boca",
        social: "Redes sociales",
      },
      errors: {
        required: "Campo obligatorio",
        invalidEmail: "Introduce una dirección de email válida",
        invalidUrl: "Introduce una URL válida (ej. https://tusitio.com)",
      },
    },
  },
  orderPage: {
    eyebrow: "Pedido",
    title: "Elige tus servicios",
    subtitle:
      "Selecciona una o más opciones — recibirás un presupuesto a medida en 1 hora.",
    fromLabel: "desde",
    plusLabel: "+",
    selectHint: "Selecciona al menos un servicio para continuar, o escríbenos directamente.",
    proceedCta: "Solicitar presupuesto",
    footnote:
      "Tras tu solicitud recibirás alcance, plazos y coste final. Sin pago automático.",
    estimatedLabel: "Estimación orientativa",
    addonsSectionTitle: "Módulos adicionales",
    aboutServiceCta: "Sobre este servicio",
    trust: {
      timeline: "Plazo típico: 4–8 semanas",
      deposit: "Depósito del 30% al inicio",
      processLink: "Cómo trabajamos",
      testimonial:
        "«Respuesta rápida, alcance claro — exactamente el partner digital que buscábamos.»",
    },
  },
  pricingAddons: {
    eyebrow: "Módulos",
    title: "Amplía tu proyecto",
    subtitle:
      "Añade capacidades al paquete base. Cada módulo se valora tras el brief.",
    footnote: "El presupuesto final de cada módulo se fija tras el brief.",
    categories: [
      {
        id: "websites",
        title: "Sitios web",
        items: [
          { id: "corporate", label: "Sitios corporativos", info: "Multipágina con equipo, servicios y SEO." },
          { id: "promo", label: "Promo", info: "Sitio a corto plazo para lanzamientos y campañas." },
          { id: "landing", label: "Landing pages", info: "Una página, un objetivo, máxima conversión." },
          { id: "media-blog", label: "Media y blogs", info: "Artículos, categorías, etiquetas y RSS." },
          { id: "no-code", label: "No/Low-code", info: "Webflow, Framer o Tilda — entrega rápida." },
        ],
      },
      {
        id: "products",
        title: "Sistemas digitales",
        items: [
          { id: "web-service", label: "Servicios web", info: "Dashboards, motores de reserva, marketplaces." },
          { id: "ecommerce", label: "E-commerce", info: "Tienda con carrito, pagos e inventario." },
          { id: "client-portal", label: "Portales de clientes", info: "Espacio protegido para pedidos y documentos." },
          { id: "chatbot", label: "Chatbots", info: "Flujos automatizados para soporte y leads." },
          { id: "intranet", label: "Intranets", info: "Portales internos para equipos y documentación." },
          { id: "mobile-app", label: "Apps móviles", info: "iOS y Android con React Native o Flutter." },
        ],
      },
      {
        id: "design",
        title: "Diseño",
        items: [
          { id: "ux-ui", label: "UX & UI", info: "Wireframes y diseño de interfaz." },
          { id: "branding", label: "Branding", info: "Logo, paleta, tipografía e identidad." },
          { id: "motion-sound", label: "Motion & Sound", info: "Animaciones y sonic branding." },
          { id: "ux-research", label: "UX Research", info: "Entrevistas, pruebas y decisiones basadas en datos." },
        ],
      },
      {
        id: "development",
        title: "Desarrollo",
        items: [
          { id: "cms", label: "CMS", info: "Contenido autogestionado." },
          { id: "multilingual", label: "Multilingüe", info: "Por idioma adicional." },
          { id: "backend", label: "Backend / API", info: "Lógica de servidor, base de datos y autenticación." },
          { id: "qa", label: "Quality Assurance", info: "Pruebas en dispositivos y navegadores." },
          { id: "devops", label: "DevOps", info: "CI/CD, hosting y monitorización." },
          { id: "seo-extended", label: "SEO ampliado", info: "Optimización avanzada y estructura." },
        ],
      },
    ],
  },
  aboutPage: {
    backToHome: "Volver al inicio",
  },
  privacyPage: {
    title: "Política de privacidad",
    lastUpdated: "Última actualización: junio 2026",
    backToHome: "Volver al inicio",
    sections: [
      {
        heading: "Responsable del tratamiento",
        body: "DormUp Studio digital studio — contacto: dormup.it@gmail.com.",
      },
      {
        heading: "Datos recopilados",
        body: "Recopilamos los datos que envías voluntariamente mediante formularios: nombre, email, negocio, tipo de actividad, URL del sitio (si se indica), brief y servicios seleccionados.",
      },
      {
        heading: "Finalidad y base legal",
        body: "Los datos se procesan para responder consultas, preparar presupuestos y auditorías gratuitas. Base legal: medidas precontractuales y consentimiento implícito al enviar el formulario (RGPD art. 6).",
      },
      {
        heading: "Conservación",
        body: "Conservamos los datos el tiempo necesario para gestionar la solicitud, hasta 24 meses salvo obligación legal distinta.",
      },
      {
        heading: "Tus derechos",
        body: "Puedes solicitar acceso, rectificación, supresión, limitación u oposición escribiendo a dormup.it@gmail.com. Tienes derecho a reclamar ante la autoridad de protección de datos.",
      },
      {
        heading: "Cookies",
        body: "Este sitio no utiliza cookies de perfilado de terceros. Las cookies técnicas pueden usarse para el funcionamiento y la selección de idioma.",
      },
    ],
  },
  footer: {
    description: "Estudio digital para sistemas, automatización, sitios y contenido.",
    links: "Enlaces rápidos",
    location: "Digital Studio",
    status: "Disponibles para nuevos clientes",
    privacy: "Política de privacidad",
    built: "Construido con intención.",
  },
  langSelector: {
    label: "Idioma",
  },
  servicePage: {
    backToHome: "Volver al inicio",
    deliverables: "Qué incluye",
    howItWorks: "Cómo funciona",
    viewService: "Explorar servicio",
    otherServices: "Otros servicios",
    sectionEyebrow: "Servicio",
    pricingEyebrow: "Precios",
    popularLabel: "Más popular",
    orderCta: "Solicitar este servicio",
  },
  servicesPage: {
    eyebrow: "Servicios",
    title: "Qué construimos",
    subtitle: "Sistemas digitales, automatización de procesos, sitios web y producción de contenidos — de punta a punta.",
    techStack: "Stack: Next.js · React · TypeScript · Tailwind CSS · Framer Motion",
    viewAll: "Todos los servicios",
    pricingNote:
      "Cada proyecto se presupuesta a medida tras el brief. Los módulos adicionales se eligen según las necesidades del proyecto.",
    categories: [
      {
        title: "Sitios web",
        items: [
          { label: "Sitios corporativos", info: "Sitio de marca multipágina con equipo, servicios, contacto y SEO." },
          { label: "Promo", info: "Sitio de campaña a corto plazo para impulsar un lanzamiento, evento u oferta." },
          { label: "Landing pages", info: "Página de conversión con un solo foco — un objetivo, un CTA claro." },
          { label: "Media y blogs", info: "Sitio orientado a contenido con artículos, categorías, etiquetas y RSS." },
          { label: "No/Low-code", info: "Entrega rápida con Webflow, Framer o Tilda — sin desarrollo pesado." },
        ],
      },
      {
        title: "Sistemas digitales",
        items: [
          { label: "Servicios web", info: "Herramientas en el navegador: dashboards, motores de reserva, marketplaces." },
          { label: "Apps móviles", info: "Apps iOS y Android con React Native o Flutter." },
          { label: "Intranets", info: "Portales internos para equipos: wikis, documentos y anuncios." },
          { label: "Portales de clientes", info: "Espacios protegidos con contraseña para que los clientes sigan pedidos o proyectos." },
          { label: "Chatbots", info: "Flujos de chat automatizados para soporte, captación de leads o onboarding." },
          { label: "E-commerce", info: "Tiendas online con carrito, checkout, pagos e inventario." },
        ],
      },
      {
        title: "Diseño",
        items: [
          { label: "UX & UI", info: "Wireframes basados en investigación y diseño de interfaz pixel-perfect." },
          { label: "Motion & Sound", info: "Transiciones animadas, microinteracciones y sonic branding." },
          { label: "Branding", info: "Logo, paleta de color, tipografía y sistema completo de identidad de marca." },
          { label: "UX Research", info: "Entrevistas con usuarios, pruebas de usabilidad y decisiones de diseño basadas en datos." },
        ],
      },
      {
        title: "Desarrollo",
        items: [
          { label: "Análisis de sistemas", info: "Mapeo de requisitos, especificaciones técnicas y planificación de arquitectura." },
          { label: "Frontend dev", info: "Interfaces React/Next.js — rápidas, accesibles y listas para producción." },
          { label: "Backend dev", info: "APIs, bases de datos, autenticación y lógica de servidor escalable." },
          { label: "Mobile dev", info: "Apps nativas multiplataforma con rendimiento fluido." },
          { label: "Quality Assurance", info: "Pruebas manuales y automatizadas en dispositivos y navegadores." },
          { label: "DevOps", info: "Pipelines CI/CD, hosting en la nube, monitorización y despliegues sin downtime." },
        ],
      },
    ],
  },
  workPage: {
    eyebrow: "Proyectos",
    title: "Todos los proyectos",
    subtitle: "Una selección de conceptos, prototipos y proyectos listos para el cliente.",
    viewAll: "Ver todos los proyectos",
    backToWork: "Volver a proyectos",
    visitLiveSite: "Visitar sitio en vivo",
    liveStatus: "En vivo",
    techStack: "Stack tecnológico",
    overview: "Resumen",
    otherProjects: "Otros proyectos",
  },
};
