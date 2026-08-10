"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  BriefcaseBusiness,
  ChevronRight,
  Inbox,
  Settings2,
  type LucideIcon,
} from "lucide-react";
import { studioPath } from "@/lib/studio/path";
import type { StudioRole } from "@/lib/studio/auth";
import { StudioSignOut } from "@/components/studio/sign-out";

type NavItem = {
  href: string;
  label: string;
  description: string;
  icon: LucideIcon;
  roles?: StudioRole[];
};

const ITEMS: NavItem[] = [
  {
    href: studioPath(),
    label: "Обзор",
    description: "Аналитика и активность",
    icon: BarChart3,
  },
  {
    href: studioPath("/leads"),
    label: "Заявки",
    description: "Клиенты и обращения",
    icon: Inbox,
  },
  {
    href: studioPath("/copy"),
    label: "Сайт",
    description: "Страницы и переводы",
    icon: BriefcaseBusiness,
    roles: ["owner", "editor"],
  },
  {
    href: studioPath("/catalog"),
    label: "Каталог",
    description: "Услуги и портфолио",
    icon: BriefcaseBusiness,
    roles: ["owner", "editor"],
  },
  {
    href: studioPath("/manage"),
    label: "Настройки",
    description: "SEO, медиа и команда",
    icon: Settings2,
    roles: ["owner", "editor"],
  },
];

export function StudioNavigation({
  email,
  role,
}: {
  email: string;
  role: StudioRole;
}) {
  const pathname = usePathname();
  const items = ITEMS.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <aside className="st-nav">
      <Link href={studioPath()} className="st-brand">
        <span className="st-brand-mark">D</span>
        <span>
          DormUp
          <small>Панель управления</small>
        </span>
      </Link>

      <nav className="st-nav-list" aria-label="Studio navigation">
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== studioPath() && pathname.startsWith(`${item.href}/`));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={active ? "active" : undefined}
            >
              <Icon size={18} aria-hidden />
              <span>
                <strong>{item.label}</strong>
                <small>{item.description}</small>
              </span>
              <ChevronRight className="st-nav-chevron" size={15} aria-hidden />
            </Link>
          );
        })}
      </nav>

      <div className="st-user">
        <div className="st-user-avatar">{email.slice(0, 1).toUpperCase()}</div>
        <div className="st-user-copy">
          <strong>{email}</strong>
          <span>{role === "owner" ? "Владелец" : role === "editor" ? "Редактор" : "Продажи"}</span>
        </div>
        <StudioSignOut compact />
      </div>
    </aside>
  );
}
