import { CalendarCheck, Monitor, RefreshCw, Video, Wrench } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface ServiceMeta {
  id: string;
  slug: string;
  icon: LucideIcon;
}

export const servicesMeta: ServiceMeta[] = [
  { id: "premium-site", slug: "premium-website", icon: Monitor },
  { id: "redesign", slug: "redesign", icon: RefreshCw },
  { id: "booking-flow", slug: "booking-flow", icon: CalendarCheck },
  { id: "monthly-support", slug: "monthly-support", icon: Wrench },
  { id: "photo-video", slug: "photo-video", icon: Video },
];
