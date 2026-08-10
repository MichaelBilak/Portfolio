import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getStudioSession, type StudioRole } from "@/lib/studio/auth";
import { StudioSignOut } from "@/components/studio/sign-out";

export const dynamic = "force-dynamic";

const NAV: Array<{ href: string; label: string; roles?: StudioRole[] }> = [
  { href: "/studio", label: "Dashboard" },
  { href: "/studio/leads", label: "Leads" },
  { href: "/studio/projects", label: "Projects", roles: ["owner", "editor"] },
  { href: "/studio/services", label: "Services", roles: ["owner", "editor"] },
  { href: "/studio/addons", label: "Addons", roles: ["owner", "editor"] },
  { href: "/studio/process", label: "Process", roles: ["owner", "editor"] },
  { href: "/studio/before-after", label: "Before / After", roles: ["owner", "editor"] },
  { href: "/studio/copy", label: "Site copy", roles: ["owner", "editor"] },
  { href: "/studio/seo", label: "SEO", roles: ["owner", "editor"] },
  { href: "/studio/redirects", label: "Redirects", roles: ["owner", "editor"] },
  { href: "/studio/media", label: "Media", roles: ["owner", "editor"] },
  { href: "/studio/settings", label: "Settings", roles: ["owner", "editor"] },
  { href: "/studio/users", label: "Users", roles: ["owner"] },
];

export default async function StudioAppLayout({ children }: { children: ReactNode }) {
  const user = await getStudioSession();
  if (!user) redirect("/studio/login");

  const links = NAV.filter((item) => !item.roles || item.roles.includes(user.role));

  return (
    <div className="st-shell">
      <aside className="st-nav">
        <div className="st-brand">DormUp Studio</div>
        {links.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
        <div style={{ marginTop: "auto", padding: "1rem 0.65rem 0", color: "var(--st-muted)", fontSize: "0.8rem" }}>
          <div>{user.email}</div>
          <div className="st-badge" style={{ marginTop: 6 }}>
            {user.role}
          </div>
          <div style={{ marginTop: 10 }}>
            <StudioSignOut />
          </div>
        </div>
      </aside>
      <main className="st-main">{children}</main>
    </div>
  );
}
