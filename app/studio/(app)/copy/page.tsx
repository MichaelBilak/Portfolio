import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { studioPath } from "@/lib/studio/path";

const GROUPS = [
  {
    title: "Главная страница",
    description: "Первое впечатление и основные продающие блоки",
    sections: [
      ["hero", "Первый экран", "Главный заголовок, описание и кнопки"],
      ["trust", "Блок доверия", "Короткие аргументы о надёжности"],
      ["problem", "Проблема клиента", "Проблема, которую решает студия"],
      ["impact", "Результат для бизнеса", "Ценность и ожидаемый эффект"],
      ["caseStudies", "Кейсы", "Заголовки блока с портфолио"],
      ["processSection", "Процесс работы", "Введение к этапам работы"],
      ["beforeAfter", "До / После", "Подписи блока сравнения"],
      ["audit", "Бесплатный аудит", "Призыв заказать аудит"],
    ],
  },
  {
    title: "Продажи",
    description: "Тексты для выбора и заказа услуг",
    sections: [
      ["servicesLabel", "Заголовок услуг", "Короткая подпись над услугами"],
      ["servicesLead", "Введение к услугам", "Вводный текст блока услуг"],
      ["servicesPage", "Страница услуг", "Заголовки списка услуг"],
      ["servicePage", "Детали услуги", "Подписи на страницах услуг"],
      ["orderPage", "Страница заказа", "Инструкции и подписи конфигуратора"],
      ["pricingAddons", "Доп. опции", "Заголовки дополнительных услуг"],
      ["workPage", "Страница портфолио", "Заголовки и подписи портфолио"],
    ],
  },
  {
    title: "О студии и контакты",
    description: "Информация о студии, контакты и документы",
    sections: [
      ["about", "Коротко о студии", "Краткое описание студии"],
      ["aboutPage", "Страница о студии", "Полная информация о команде"],
      ["contact", "Контакты", "Контактные данные и форма"],
      ["privacyPage", "Конфиденциальность", "Текст политики конфиденциальности"],
    ],
  },
  {
    title: "Общие элементы",
    description: "Тексты, которые видны на всём сайте",
    sections: [
      ["nav", "Главное меню", "Названия пунктов навигации"],
      ["footer", "Подвал сайта", "Текст и ссылки внизу страницы"],
      ["langSelector", "Выбор языка", "Подпись меню языков"],
      ["beforeAfterShowOnSite", "Видимость До / После", "Показать или скрыть блок сравнения"],
    ],
  },
] as const;

export default function SiteCopyIndexPage() {
  return (
    <>
      <div className="st-page-header">
        <div>
          <p className="st-eyebrow">Контент сайта</p>
          <h1 className="st-h1">Страницы и тексты</h1>
          <p className="st-sub">Выберите часть сайта, которую хотите изменить.</p>
        </div>
      </div>
      <div className="st-copy-groups">
        {GROUPS.map((group) => (
          <section className="st-copy-group" key={group.title}>
            <div className="st-copy-group-head">
              <h2>{group.title}</h2>
              <p>{group.description}</p>
            </div>
            <div className="st-copy-list">
              {group.sections.map(([section, title, description]) => (
                <Link
                  key={section}
                  href={`${studioPath(`/copy/${section}`)}?locale=it`}
                >
                  <span>
                    <strong>{title}</strong>
                    <small>{description}</small>
                  </span>
                  <ArrowRight size={16} />
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
