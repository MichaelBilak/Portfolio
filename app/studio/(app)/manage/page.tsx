import Link from "next/link";
import {
  ArrowRight,
  Images,
  Settings2,
  Shuffle,
  SlidersHorizontal,
  Users,
} from "lucide-react";
import { getStudioSession } from "@/lib/studio/auth";
import { studioPath } from "@/lib/studio/path";

export default async function ManageHubPage() {
  const user = await getStudioSession();
  const sections = [
    {
      href: "/seo",
      title: "Поиск и аналитика",
      description: "SEO-заголовки, описания и счётчики",
      icon: SlidersHorizontal,
    },
    {
      href: "/media",
      title: "Медиатека",
      description: "Изображения и видео для сайта",
      icon: Images,
    },
    {
      href: "/redirects",
      title: "Редиректы",
      description: "Перенаправление старых адресов на новые",
      icon: Shuffle,
    },
    {
      href: "/settings",
      title: "Данные студии",
      description: "Бренд, сайт, email и социальные сети",
      icon: Settings2,
    },
    ...(user?.role === "owner"
      ? [{
          href: "/users",
          title: "Доступ команды",
          description: "Пользователи и права доступа",
          icon: Users,
        }]
      : []),
  ];

  return (
    <>
      <div className="st-page-header">
        <div>
          <p className="st-eyebrow">Управление</p>
          <h1 className="st-h1">Настройки</h1>
          <p className="st-sub">Технические параметры и доступ команды.</p>
        </div>
      </div>
      <div className="st-action-grid">
        {sections.map(({ href, title, description, icon: Icon }) => (
          <Link key={href} href={studioPath(href)} className="st-action-card">
            <span className="st-action-icon"><Icon size={20} /></span>
            <span>
              <strong>{title}</strong>
              <small>{description}</small>
            </span>
            <ArrowRight size={17} aria-hidden />
          </Link>
        ))}
      </div>
    </>
  );
}
