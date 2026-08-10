import Link from "next/link";
import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getStudioSession, type StudioRole } from "@/lib/studio/auth";
import { studioPath } from "@/lib/studio/path";
import { StudioSignOut } from "@/components/studio/sign-out";

export const dynamic = "force-dynamic";

export default async function StudioAppLayout({ children }: { children: ReactNode }) {
  const user = await getStudioSession();
  if (!user) redirect(studioPath("/login"));

  const nav: Array<{ href: string; label: string; roles?: StudioRole[] }> = [
    { href: studioPath(), label: "Dashboard" },
    { href: studioPath("/leads"), label: "Leads" },
    { href: studioPath("/projects"), label: "Projects", roles: ["owner", "editor"] },
    { href: studioPath("/services"), label: "Services", roles: ["owner", "editor"] },
    { href: studioPath("/addons"), label: "Addons", roles: ["owner", "editor"] },
    { href: studioPath("/process"), label: "Process", roles: ["owner", "editor"] },
    { href: studioPath("/before-after"), label: "Before / After", roles: ["owner", "editor"] },
    { href: studioPath("/copy"), label: "Site copy", roles: ["owner", "editor"] },
    { href: studioPath("/seo"), label: "SEO", roles: ["owner", "editor"] },
    { href: studioPath("/redirects"), label: "Redirects", roles: ["owner", "editor"] },
    { href: studioPath("/media"), label: "Media", roles: ["owner", "editor"] },
    { href: studioPath("/settings"), label: "Settings", roles: ["owner", "editor"] },
    { href: studioPath("/users"), label: "Users", roles: ["owner"] },
  ];

  const links = nav.filter((item) => !item.roles || item.roles.includes(user.role));

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
