export interface BeforeAfterCaseMeta {
  id: "hotel" | "restaurant" | "bar" | "local" | "custom";
  beforeSrc: string;
  afterSrc: string;
}

export const beforeAfterCasesMeta: readonly BeforeAfterCaseMeta[] = [
  {
    id: "hotel",
    beforeSrc: "/images/ba-hotel-before.svg",
    afterSrc: "/images/ba-hotel-after.svg",
  },
  {
    id: "restaurant",
    beforeSrc: "/images/ba-restaurant-before.svg",
    afterSrc: "/images/ba-restaurant-after.svg",
  },
  {
    id: "bar",
    beforeSrc: "/images/ba-bar-before.svg",
    afterSrc: "/images/ba-bar-after.svg",
  },
  {
    id: "local",
    beforeSrc: "/images/ba-local-before.svg",
    afterSrc: "/images/ba-local-after.svg",
  },
  {
    id: "custom",
    beforeSrc: "/images/ba-custom-before.svg",
    afterSrc: "/images/ba-custom-after.svg",
  },
] as const;
