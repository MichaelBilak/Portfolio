export interface ProjectMeta {
  id: string;
  /** URL slug used for the optional detail page (`/work/[slug]`). */
  slug: string;
  index: string;
  tag: string;
  image: string;
  tech: string[];
  /** External live URL. `#` for concept-only projects. */
  url: string;
  displayUrl: string;
  /** When true the project gets an internal detail page and the card hides the description rows. */
  isLive?: boolean;
  /** Focal point for the mockup screenshot crop. Defaults to top. */
  imagePosition?: "top" | "center";
}

export const projectsMeta: ProjectMeta[] = [
  {
    id: "porto-sole",
    slug: "porto-sole",
    index: "01",
    tag: "Concept Redesign",
    image: "/images/project-porto-sole.png",
    imagePosition: "center",
    tech: ["Figma Prototype"],
    url: "https://porto-sole.vercel.app/",
    displayUrl: "porto-sole.vercel.app",
  },
  {
    id: "hotel-direct-booking",
    slug: "hotel-direct-booking",
    index: "02",
    tag: "Live Prototype",
    image: "/images/project-hotel-aurelia.png",
    imagePosition: "center",
    tech: ["Conversion Copy", "Direct Booking"],
    url: "https://hotel-aurelia-del-mar.vercel.app/",
    displayUrl: "hotel-aurelia-del-mar.vercel.app",
    isLive: true,
  },
  {
    id: "podlopuhom-jewelry",
    slug: "podlopuhom-jewelry",
    index: "03",
    tag: "Live Project",
    image: "/images/project-podlopuhom.png",
    tech: ["i18n EN/RU/IT", "Gallery / Catalog", "WhatsApp Checkout"],
    url: "https://www.podlopuhom.com/",
    displayUrl: "podlopuhom.com",
    isLive: true,
  },
  {
    id: "mare-vivo",
    slug: "mare-vivo",
    index: "04",
    tag: "Concept Redesign",
    image: "/images/project-mare-vivo.png",
    imagePosition: "top",
    tech: ["i18n EN/IT", "Reservation Flow"],
    url: "https://mare-vivo.vercel.app/",
    displayUrl: "mare-vivo.vercel.app",
  },
  {
    id: "solovyev-store",
    slug: "solovyev-store",
    index: "05",
    tag: "Live Project",
    image: "/images/project-solovyev.png",
    imagePosition: "top",
    tech: ["Online Catalog", "WhatsApp Orders", "Stock Control"],
    url: "https://solovyev-store.vercel.app/",
    displayUrl: "solovyev-store.vercel.app",
    isLive: true,
  },
];
