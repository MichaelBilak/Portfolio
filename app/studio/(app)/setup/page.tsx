import Link from "next/link";
import { getStudioSession, canManageUsers } from "@/lib/studio/auth";
import { studioPath } from "@/lib/studio/path";

export default async function SetupHubPage() {
  const user = await getStudioSession();
  const role = user?.role || "sales";

  const blocks = [
    {
      href: "/settings",
      title: "Бренд и контакты",
      desc: "Название студии, email, Instagram",
    },
    {
      href: "/seo",
      title: "SEO",
      desc: "Заголовки, описания, счётчики аналитики",
    },
    {
      href: "/redirects",
      title: "Редиректы",
      desc: "Перенаправления старых ссылок",
    },
    ...(canManageUsers(role)
      ? [
          {
            href: "/users",
            title: "Команда",
            desc: "Кто имеет доступ в админку",
          },
        ]
      : []),
  ];

  return (
    <>
      <h1 className="st-h1">Настройки</h1>
      <p className="st-sub">Технические разделы — открывайте только когда нужно.</p>
      <div className="st-hub">
        {blocks.map((b) => (
          <Link key={b.href} href={studioPath(b.href)} className="st-hub-card">
            <strong>{b.title}</strong>
            <span>{b.desc}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
