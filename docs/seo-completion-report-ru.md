# Отчёт о реализации SEO / GEO / позиционирования — DormUp Studio

## 1. Краткое резюме

Реализована техническая SEO-база, исправлены подтверждённые дефекты (каноникалы/hreflang, redirect booking-flow, sitemap/robots), обновлено позиционирование на **Digital Growth & Creative Studio**, каталог услуг приведён к новой иерархии с **Video Production** как самостоятельным оффером и сервисом **Google & AI Visibility**. Добавлены audit-landing, JSON-LD, `llms.txt` и документация.

**Сборка:** `npm run typecheck`, `npm run lint`, `npm run build` — успешно.

**Не завершено без владельца:** GSC/Bing, consent banner, GBP, реальные кейс-метрики, deploy.

## 2. Подтверждённые проблемы

1. Layout задавал canonical/hreflang на homepage для всех дочерних страниц.
2. Sitemap включал `/services/booking-flow`, пока route был 301 → `/services`.
3. Слабая гео-привязка (без Rimini в meta/footer).
4. Instagram bio ссылался на `/it/contact` при `as-needed` prefix.
5. Нет Service/Breadcrumb schema; Organization только в layout.
6. Analytics без consent UI при возможном GA4.

Гипотезы прошлых аудитов о «сломанном» porto-sole: **намеренный** redirect на `/work` — сохранён.

## 3. Детали реализации

### Technical SEO
- `lib/seo/metadata.ts` — path-correct canonical + hreflang + OG/Twitter
- Layout больше не «протекает» homepage-canonical
- `robots.ts` — disallow `/studio/`, `/api/`
- `sitemap.ts` — audit + services; retired work excluded; стабильный lastModified
- Restore `booking-flow` page (redirect удалён)

### Localization
- IT default сохранён; EN/RU обновлены по позиционированию; FR/DE/ES — parity сервисов

### Content / services
- Новые: `visibility` / `google-ai-visibility`, `digital-growth` / `digital-growth`
- Video: `photo-video` → «Produzione video» / Video production
- Websites, automation, care, redesign сохранены и переименованы в messaging

### GEO
- Entity block на About (IT/EN)
- FAQ на ключевых сервисах
- `public/llms.txt`
- Measurement template в `docs/geo-ai-readiness.md`

### Structured data
- Organization + WebSite graph
- Service + BreadcrumbList на service/work pages

### Local SEO
- Rimini-first copy; secondary cities только как service area text
- Без thin city doorways

### Conversion
- `/audit-digitale` + form `auditMode`
- Audit CTA → audit landing
- Events: `audit_submit` / `contact_submit`

### Analytics / privacy
- Privacy IT/EN обновлены под возможный GA/Plausible
- Consent banner = NEEDS_OWNER_INPUT

## 4. Изменённые файлы (основные)

- `lib/seo/*`, `lib/content/localized-services.ts`, `lib/brand.ts`, `lib/translations.ts`, `lib/locale-es.ts`
- `data/services.ts`, `data/pricing.ts`
- `app/sitemap.ts`, `app/robots.ts`, `app/[locale]/**`, `next.config.mjs`
- `components/about`, `contact`, `contact-link`, `footer`, `brand-logo`
- `public/llms.txt`, `docs/seo-*.md`

## 5. Изменения маршрутов

| Изменение | Деталь |
|-----------|--------|
| Новый | `/audit-digitale` (+ locale variants) |
| Новый | `/services/google-ai-visibility`, `/services/digital-growth` |
| Восстановлен | `/services/booking-flow` (200) |
| Redirects сохранены | porto-sole, rockisland-rimini → `/work`; mare-vivo rename |

## 6. До / после

| Метрика | До | После |
|---------|----|--------|
| Path canonicals | Homepage leak | Per-page |
| booking-flow | 301 → services | 200 + content |
| Primary services | 5 | 7 (+ visibility, growth) |
| Video naming | «Produzione contenuti» | «Produzione video» |
| Audit landing | Нет | `/audit-digitale` |
| Schema | Organization only | + WebSite, Service, Breadcrumb |
| Rimini in footer | «Digital Studio» | «Rimini, Italy» / IT copy |

## 7. Тесты

- `npm run typecheck` — OK
- `npm run lint` — OK
- `npm run build` — OK

## 8. Действия владельца

См. `docs/seo-owner-actions.md` (GSC, Bing, consent, GBP, domain email, deploy).

## 9. Риски и ограничения

- CMS Supabase может ещё содержать старые service rows/redirects — нужен re-seed при использовании CMS.
- Новые service images временно переиспользуют существующие PNG.
- FR/DE/ES service titles локализованы; полный deep copy — частично EN-based.
- Нет гарантий AI/Google ranking (намеренно).

## 10. Следующие шаги

1. Deploy после review
2. Submit sitemap в GSC
3. Юридический consent banner
4. Уникальные изображения для visibility/growth
5. При наличии контента — отдельные IT landings без doorway-клонов
6. Ручной AI-visibility measurement по шаблону
