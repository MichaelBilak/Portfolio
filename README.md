# Bilak Studio — Portfolio

Многоязычный сайт-портфолио на **Next.js 14 (App Router)** с поддержкой русского, английского и итальянского языков через `next-intl`. Анимации — `framer-motion`, стили — TailwindCSS.

## Стек

- **Next.js 14** (App Router, RSC)
- **TypeScript**
- **TailwindCSS**
- **next-intl** — локализация (`ru` / `en` / `it`)
- **framer-motion** — анимации и интеракции
- **lucide-react** — иконки
- **Resend** (опционально) — отправка писем из контактной формы

## Структура

```
app/[locale]/          # локализованные страницы (главная, услуги, работы)
app/api/contact/       # API-роут контактной формы
components/            # UI-блоки (hero, services, contact, footer и т.д.)
data/                  # контент: проекты, услуги, кейсы before/after, процесс
i18n/                  # конфигурация next-intl (routing, request, navigation)
lib/                   # хелперы, кастомные хуки, анимации, переводы
public/images/         # SVG/PNG-иллюстрации и мокапы
```

## Запуск локально

```bash
npm install
npm run dev
```

Открой [http://localhost:3000](http://localhost:3000).

## Переменные окружения

Скопируй `.env.local.example` в `.env.local` и заполни значения, если нужна отправка контактных форм:

```bash
cp .env.local.example .env.local
```

| Переменная         | Назначение                                   |
| ------------------ | -------------------------------------------- |
| `RESEND_API_KEY`   | API-ключ [Resend](https://resend.com)        |
| `CONTACT_TO_EMAIL` | Email, куда будут приходить заявки с сайта   |

Без этих переменных форма работает в режиме "fallback" (запрос принимается, но письмо не отправляется).

## Скрипты

| Команда         | Что делает                  |
| --------------- | --------------------------- |
| `npm run dev`   | Запуск дев-сервера          |
| `npm run build` | Production-сборка           |
| `npm run start` | Запуск production-сборки    |
| `npm run lint`  | Линт через `eslint`         |

## Локализация

Поддерживаемые локали определены в `i18n/routing.ts`. Все строки лежат в `lib/translations.ts`. Чтобы добавить язык — расширь массив `locales` и добавь словарь.

## Лицензия

Private — все права защищены.
