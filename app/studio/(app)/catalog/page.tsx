import Link from "next/link";
import {
  ArrowRight,
  BriefcaseBusiness,
  ListPlus,
  Route,
  Sparkles,
} from "lucide-react";
import { studioPath } from "@/lib/studio/path";

const SECTIONS = [
  {
    href: "/services",
    title: "Услуги и цены",
    description: "Предложения, тарифы, цены и переводы",
    icon: Sparkles,
  },
  {
    href: "/projects",
    title: "Портфолио",
    description: "Проекты, кейсы и внешние ссылки",
    icon: BriefcaseBusiness,
  },
  {
    href: "/addons",
    title: "Доп. модули",
    description: "Дополнительные услуги для заказа",
    icon: ListPlus,
  },
  {
    href: "/process",
    title: "Процесс работы",
    description: "Шаги работы, показанные на сайте",
    icon: Route,
  },
];

export default function CatalogHubPage() {
  return (
    <>
      <div className="st-page-header">
        <div>
          <p className="st-eyebrow">Контент сайта</p>
          <h1 className="st-h1">Каталог</h1>
          <p className="st-sub">Всё, что вы продаёте и показываете клиентам.</p>
        </div>
      </div>
      <div className="st-action-grid">
        {SECTIONS.map(({ href, title, description, icon: Icon }) => (
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
