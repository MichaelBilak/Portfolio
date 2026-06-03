import { Brush, Code2, Compass, Search, TrendingUp } from "lucide-react";
import { LucideIcon } from "lucide-react";

export interface ProcessStepMeta {
  id: string;
  number: string;
  icon: LucideIcon;
}

export const processStepsMeta: ProcessStepMeta[] = [
  { id: "understand", number: "01", icon: Search },
  { id: "plan", number: "02", icon: Compass },
  { id: "design", number: "03", icon: Brush },
  { id: "build", number: "04", icon: Code2 },
  { id: "improve", number: "05", icon: TrendingUp },
];
