import { CalendarCheck, Monitor, RefreshCw, Video, Wrench } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface ServiceMeta {
  id: string;
  slug: string;
  icon: LucideIcon;
  image: string;
}

export const servicesMeta: ServiceMeta[] = [
  {
    id: "premium-site",
    slug: "premium-website",
    icon: Monitor,
    image: "/images/service-premium-website.png",
  },
  {
    id: "redesign",
    slug: "redesign",
    icon: RefreshCw,
    image: "/images/service-redesign.png",
  },
  {
    id: "booking-flow",
    slug: "booking-flow",
    icon: CalendarCheck,
    image: "/images/service-booking-flow.png",
  },
  {
    id: "monthly-support",
    slug: "monthly-support",
    icon: Wrench,
    image: "/images/service-monthly-support.png",
  },
  {
    id: "photo-video",
    slug: "photo-video",
    icon: Video,
    image: "/images/service-photo-video.png",
  },
];
