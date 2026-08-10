import Link from "next/link";
import { studioPath } from "@/lib/studio/path";

const BLOCKS = [
  {
    href: "/services",
    title: "Услуги и цены",
    desc: "Каталог услуг, тарифы и описания на всех языках",
  },
  {
    href: "/projects",
    title: "Портфолио",
    desc: "Кейсы и проекты на сайте",
  },
  {
    href: "/addons",
    title: "Доп. модули",
    desc: "Опции к заказу (addons)",
  },
  {
    href: "/copy",
    title: "Тексты сайта",
    desc: "Hero, меню, контакты, футер и страницы",
  },
  {
    href: "/process",
    title: "Процесс работы",
    desc: "Шаги «как мы работаем»",
  },
  {
    href: "/before-after",
    title: "До / После",
    desc: "Слайдеры сравнения",
  },
] as const;

export default function ContentHubPage() {
  return (
    <>
      <h1 className="st-h1">Контент сайта</h1>
      <p className="st-sub">Всё, что видно посетителям. Выберите раздел — правки без кода.</p>
      <div className="st-hub">
        {BLOCKS.map((b) => (
          <Link key={b.href} href={studioPath(b.href)} className="st-hub-card">
            <strong>{b.title}</strong>
            <span>{b.desc}</span>
          </Link>
        ))}
      </div>
    </>
  );
}
