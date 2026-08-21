"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  BarChart3,
  BriefcaseBusiness,
  CheckSquare2,
  ChevronRight,
  FileText,
  FolderKanban,
  Inbox,
  LayoutDashboard,
  Settings2,
  SlidersHorizontal,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { studioPath } from "@/lib/studio/path";
import type { StudioRole } from "@/lib/studio/auth";
import { StudioSignOut } from "@/components/studio/sign-out";
import {
  StudioLanguageSelector,
  type StudioMessageKey,
  useStudioI18n,
} from "@/lib/studio/i18n";

type NavItem = {
  href: string;
  label: StudioMessageKey;
  group: "crm" | "content";
  icon: LucideIcon;
  roles?: StudioRole[];
};

const ITEMS: NavItem[] = [
  {
    href: studioPath(),
    label: "nav.overview",
    group: "crm",
    icon: BarChart3,
  },
  {
    href: studioPath("/leads"),
    label: "nav.leads",
    group: "crm",
    icon: Inbox,
    roles: ["owner", "editor", "sales", "manager"],
  },
  { href: studioPath("/inbox"), label: "nav.inbox", group: "crm", icon: Bell },
  { href: studioPath("/cases"), label: "nav.cases", group: "crm", icon: BriefcaseBusiness },
  { href: studioPath("/tasks"), label: "nav.tasks", group: "crm", icon: CheckSquare2 },
  { href: studioPath("/documents"), label: "nav.documents", group: "crm", icon: FileText },
  {
    href: studioPath("/automations"),
    label: "nav.automations",
    group: "crm",
    icon: Workflow,
    roles: ["owner", "editor", "manager"],
  },
  {
    href: studioPath("/reports"),
    label: "nav.reports",
    group: "crm",
    icon: LayoutDashboard,
    roles: ["owner", "editor", "sales", "manager", "viewer"],
  },
  {
    href: studioPath("/crm-settings"),
    label: "nav.settings",
    group: "crm",
    icon: SlidersHorizontal,
    roles: ["owner", "editor"],
  },
  {
    href: studioPath("/copy"),
    label: "nav.website",
    group: "content",
    icon: BriefcaseBusiness,
    roles: ["owner", "editor"],
  },
  {
    href: studioPath("/projects"),
    label: "nav.portfolio",
    group: "content",
    icon: FolderKanban,
    roles: ["owner", "editor"],
  },
  {
    href: studioPath("/manage"),
    label: "nav.siteSettings",
    group: "content",
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
  const { t } = useStudioI18n();
  const items = ITEMS.filter((item) => !item.roles || item.roles.includes(role));
  const groups = [
    { key: "crm", label: "nav.crm" as const },
    { key: "content", label: "nav.content" as const },
  ] as const;

  return (
    <aside className="st-nav">
      <Link href={studioPath()} className="st-brand">
        <span className="st-brand-mark">D</span>
        <span>
          DormUp
          <small>{t("nav.workspace")}</small>
        </span>
      </Link>

      <nav className="st-nav-list" aria-label={t("nav.aria")}>
        {groups.map((group) => (
          <div className="st-nav-group" key={group.key}>
            <span className="st-nav-group-label">{t(group.label)}</span>
            {items.filter((item) => item.group === group.key).map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== studioPath() && pathname.startsWith(`${item.href}/`));
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href} className={active ? "active" : undefined}>
                  <Icon size={18} aria-hidden />
                  <span><strong>{t(item.label)}</strong></span>
                  <ChevronRight className="st-nav-chevron" size={15} aria-hidden />
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      <div className="st-user">
        <div className="st-user-avatar">{email.slice(0, 1).toUpperCase()}</div>
        <div className="st-user-copy">
          <strong>{email}</strong>
          <span>{t(`role.${role}` as StudioMessageKey)}</span>
        </div>
        <StudioLanguageSelector />
        <StudioSignOut compact />
      </div>
    </aside>
  );
}
