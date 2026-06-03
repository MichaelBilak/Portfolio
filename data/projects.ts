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
}

export const projectsMeta: ProjectMeta[] = [
  {
    id: "rockisland-rimini",
    slug: "rockisland-rimini",
    index: "01",
    tag: "Concept Redesign",
    image: "/images/project-rockisland.svg",
    tech: ["Next.js", "TypeScript", "Framer Motion", "Figma Prototype"],
    url: "#",
    displayUrl: "rockisland-rimini.it",
  },
  {
    id: "hotel-direct-booking",
    slug: "hotel-direct-booking",
    index: "02",
    tag: "Prototype",
    image: "/images/project-hotel.svg",
    tech: ["Next.js", "App Router", "Tailwind CSS", "Conversion Copy"],
    url: "#",
    displayUrl: "direct-booking-hotel.it",
  },
  {
    id: "podlopuhom-jewelry",
    slug: "podlopuhom-jewelry",
    index: "03",
    tag: "Live Project",
    image: "/images/project-podlopuhom.png",
    tech: ["Next.js", "i18n EN/RU/IT", "Gallery / Catalog", "WhatsApp Checkout"],
    url: "https://www.podlopuhom.com/",
    displayUrl: "podlopuhom.com",
    isLive: true,
  },
  {
    id: "premium-restaurant-local-concept",
    slug: "premium-restaurant-local-concept",
    index: "04",
    tag: "Demo Build",
    image: "/images/project-restaurant.svg",
    tech: ["React", "TypeScript", "API Integrations", "Responsive Design"],
    url: "#",
    displayUrl: "premium-restaurant.it",
  },
  {
    id: "student-marketplace-rimini",
    slug: "student-marketplace-rimini",
    index: "05",
    tag: "Client-Ready Concept",
    image: "/images/project-student-marketplace.svg",
    tech: ["Next.js", "State Management", "Component Architecture", "UX Testing"],
    url: "#",
    displayUrl: "student-marketplace.it",
  },
];
