"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Building2, CheckSquare2, ChevronLeft, ChevronRight, CircleDollarSign, CreditCard,
  FileText, FolderKanban, Handshake, LayoutDashboard, PanelLeftClose, PanelLeftOpen,
  Receipt, Settings2, Users, WalletCards, type LucideIcon,
} from "lucide-react";
import { studioPath } from "@/lib/studio/path";
import type { StudioRole } from "@/lib/studio/auth";
import { StudioSignOut } from "@/components/studio/sign-out";
import { StudioLanguageSelector } from "@/lib/studio/i18n";

type NavGroup = "Overview" | "Sales" | "Delivery" | "Finance" | "Operations" | "Admin";
type NavItem = { href: string; label: string; group: NavGroup; icon: LucideIcon; roles?: StudioRole[] };

const managers: StudioRole[] = ["owner", "editor", "sales", "manager"];
const contentManagers: StudioRole[] = ["owner", "editor"];
const items: NavItem[] = [
  { href: studioPath(), label: "Dashboard", group: "Overview", icon: LayoutDashboard },
  { href: studioPath("/leads"), label: "Leads", group: "Sales", icon: Handshake, roles: managers },
  { href: studioPath("/deals"), label: "Deals", group: "Sales", icon: CircleDollarSign, roles: managers },
  { href: studioPath("/companies"), label: "Companies", group: "Sales", icon: Building2 },
  { href: studioPath("/projects"), label: "Projects", group: "Delivery", icon: FolderKanban },
  { href: studioPath("/tasks"), label: "Tasks", group: "Delivery", icon: CheckSquare2 },
  { href: studioPath("/payments"), label: "Payments", group: "Finance", icon: WalletCards, roles: managers },
  { href: studioPath("/invoices"), label: "Invoices", group: "Finance", icon: Receipt, roles: managers },
  { href: studioPath("/subscriptions"), label: "Subscriptions", group: "Finance", icon: CreditCard, roles: managers },
  { href: studioPath("/content/projects"), label: "Portfolio", group: "Operations", icon: FileText, roles: contentManagers },
  { href: studioPath("/copy"), label: "Website content", group: "Operations", icon: FileText, roles: contentManagers },
  { href: studioPath("/cases"), label: "Legacy cases", group: "Operations", icon: ChevronRight },
  { href: studioPath("/users"), label: "Team", group: "Admin", icon: Users, roles: ["owner"] },
  { href: studioPath("/manage"), label: "Settings", group: "Admin", icon: Settings2, roles: contentManagers },
];

const groups: NavGroup[] = ["Overview", "Sales", "Delivery", "Finance", "Operations", "Admin"];

export function StudioNavigation({ email, role }: { email: string; role: StudioRole }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const visible = items.filter((item) => !item.roles || item.roles.includes(role));

  return (
    <aside className={`st-nav ${collapsed ? "collapsed" : ""}`}>
      <div className="st-nav-brand-row">
        <Link href={studioPath()} className="st-brand"><span className="st-brand-mark">D</span><span className="st-brand-copy">DormUp<small>HQ</small></span></Link>
        <button className="st-icon-btn st-nav-collapse" onClick={() => setCollapsed((value) => !value)} aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}>{collapsed ? <PanelLeftOpen size={16} /> : <PanelLeftClose size={16} />}</button>
      </div>
      <nav className="st-nav-list" aria-label="DormUp HQ navigation">
        {groups.map((group) => {
          const groupItems = visible.filter((item) => item.group === group);
          if (!groupItems.length) return null;
          return <div className="st-nav-group" key={group}><span className="st-nav-group-label">{group}</span>{groupItems.map((item) => {
            const active = pathname === item.href || (item.href !== studioPath() && pathname.startsWith(`${item.href}/`));
            const Icon = item.icon;
            return <Link key={item.href} href={item.href} className={active ? "active" : undefined} title={collapsed ? item.label : undefined}><Icon size={17} /><span className="st-nav-item-label">{item.label}</span>{active ? <ChevronLeft className="st-nav-active-mark" size={13} /> : null}</Link>;
          })}</div>;
        })}
      </nav>
      <div className="st-user"><div className="st-user-avatar">{email.slice(0, 1).toUpperCase()}</div><div className="st-user-copy"><strong>{email}</strong><span>{role}</span></div><StudioLanguageSelector /><StudioSignOut compact /></div>
    </aside>
  );
}
