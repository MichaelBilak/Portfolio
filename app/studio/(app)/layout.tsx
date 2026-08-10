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

  const nav: Array<{ href: string; label: string; hint?: string; roles?: StudioRole[] }> = [
    { href: studioPath(), label: "Обзор", hint: "Аналитика" },
    { href: studioPath("/leads"), label: "Заявки", hint: "CRM" },
    { href: studioPath("/content"), label: "Контент", hint: "Сайт", roles: ["owner", "editor"] },
    { href: studioPath("/media"), label: "Медиа", hint: "Файлы", roles: ["owner", "editor"] },
    { href: studioPath("/setup"), label: "Настройки", hint: "SEO и доступы", roles: ["owner", "editor"] },
  ];

  const links = nav.filter((item) => !item.roles || item.roles.includes(user.role));

  return (
    <div className="st-shell">
      <aside className="st-nav">
        <div className="st-brand">
          DormUp
          <small>панель управления</small>
        </div>
        <nav className="st-nav-list">
          {links.map((item) => (
            <Link key={item.href} href={item.href} className="st-nav-link">
              <span>{item.label}</span>
              {item.hint ? <small>{item.hint}</small> : null}
            </Link>
          ))}
        </nav>
        <div className="st-nav-foot">
          <div className="st-nav-user">{user.email}</div>
          <div className="st-badge">{user.role === "owner" ? "владелец" : user.role === "editor" ? "редактор" : "продажи"}</div>
          <StudioSignOut />
        </div>
      </aside>
      <main className="st-main">{children}</main>
    </div>
  );
}
