import { CalendarCheck, ChartColumnIncreasing, Monitor, RefreshCw, Search, Video, Wrench } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface ServiceMeta {
  id: string;
  slug: string;
  icon: LucideIcon;
  image: string;
}

/**
 * Primary commercial order:
 * Visibility → Websites → Video → Automation → Growth → Care;
 * redesign kept as supporting offer.
 *
 * Each service has its own glass crystal. Video production stays a standalone service.
 */
export const servicesMeta: ServiceMeta[] = [
  {
    id: "visibility",
    slug: "google-ai-visibility",
    icon: Search,
    image: "/images/service-visibility.png",
  },
  {
    id: "premium-site",
    slug: "premium-website",
    icon: Monitor,
    image: "/images/service-premium-website.png",
  },
  {
    id: "photo-video",
    slug: "photo-video",
    icon: Video,
    image: "/images/service-photo-video.png",
  },
  {
    id: "booking-flow",
    slug: "booking-flow",
    icon: CalendarCheck,
    image: "/images/service-booking-flow.png",
  },
  {
    id: "digital-growth",
    slug: "digital-growth",
    icon: ChartColumnIncreasing,
    image: "/images/service-digital-growth.png",
  },
  {
    id: "monthly-support",
    slug: "monthly-support",
    icon: Wrench,
    image: "/images/service-monthly-support.png",
  },
  {
    id: "redesign",
    slug: "redesign",
    icon: RefreshCw,
    image: "/images/service-redesign.png",
  },
];
