# Instagram Launch Pack · @dormup.studio

Полный комплект для запуска профиля DormUp Group. Визуалы: [`templates/posts-export.html`](templates/posts-export.html).

---

## 1. Профиль (ручная настройка в Instagram)

### Handle
`@dormup.studio` · https://www.instagram.com/dormup.studio/

### Аватар
- Файл: [`LogoDMGroup_glow_profile.gif`](../../LogoDMGroup_glow_profile.gif) или [`LogoDMGroup_black_bg.png`](../../LogoDMGroup_black_bg.png)
- Crop: центр на букве **D** + золотой glow
- Не использовать полный wordmark — текст «Group» на 110px не читается

### Name (поле имени)
```
DormUp Group · Digital Studio
```

### Bio
```
Widespread digital services for local brands, hotels & restaurants 
Siti web su misura · Emilia-Romagna, Italia
↓ Free audit · Audit gratuito
```

### Ссылка в bio
```
https://www.dormup-it.com/it/contact?intent=audit&utm_source=instagram&utm_medium=social
```
(константа `INSTAGRAM_BIO_LINK` в [`lib/brand.ts`](../../lib/brand.ts))

### Кнопка действия
- **Contact** → тот же URL аудита или `mailto:dormup.it@gmail.com`

### Категория
Product/service или Design & fashion

---

## 2. Highlights (5 штук)

**Готовые PNG:** [`export/`](../export/) — 27 файлов (5 обложек + 22 stories).  
Перегенерация: `npm run export:instagram-stories`

| Папка | Файлы |
|-------|-------|
| `export/covers/` | Обложки Highlights (Work, Services, Audit, Process, About) |
| `export/work/` | 4 проекта |
| `export/services/` | 5 услуг с ценами |
| `export/audit/` | 4 stories |
| `export/process/` | 5 этапов |
| `export/about/` | 4 stories |

HTML-источник: [`templates/stories-export.html`](../templates/stories-export.html)

Обложки также в `posts-export.html` (секция Highlight · …).

| Highlight | Stories внутри | Ссылка (sticker) |
|-----------|----------------|------------------|
| **Work** | 4 карточки проектов (Posts 2–5) | dormup-it.com/work |
| **Services** | 5 услуг: Premium, Redesign, Booking, Support, Photo/Video | dormup-it.com/services |
| **Audit** | «Cos'è l'audit» · «Gratis» · «Risposta in 1h» · CTA sticker | bio link |
| **Process** | 5 slides из Post 10 | — |
| **About** | Bio студии · Rimini · «Built with intention.» | dormup-it.com/about |

Текст About (IT):
> Siamo una piccola digital studio in Emilia-Romagna. Non lavoriamo con 30 clienti insieme — prendiamo pochi progetti e trattiamo ogni business come nostro.

---

## 3. Визуальная система

### Design tokens (из сайта)
| Token | Value |
|-------|-------|
| bg-primary | `#06080c` |
| bg-secondary | `#0b1118` |
| accent-gold | `#fcd34d` |
| accent-emerald | `#34d399` |
| text-primary | `#f6f5f1` |
| border | `rgba(252,211,77,0.16)` |

### Шрифты
- **Unbounded** — заголовки
- **Manrope** — body
- **IBM Plex Mono** — eyebrow / labels

### Форматы
| Формат | Размер | Использование |
|--------|--------|---------------|
| Portrait | 1080×1350 | Основной feed |
| Square | 1080×1080 | Карусели |
| Story/Reel | 1080×1920 | Highlights, Reels |

### Мастер-шаблоны
- [`templates/master-portrait.html`](templates/master-portrait.html)
- [`templates/master-square.html`](templates/master-square.html)
- [`templates/master-story.html`](templates/master-story.html)
- [`templates/shared.css`](templates/shared.css)

### Экспорт визуалов
1. Открыть [`templates/posts-export.html`](templates/posts-export.html) в Chrome
2. Zoom 100%, DevTools → screenshot node на каждый `.frame`
3. Или: Figma/Canva по spec выше + ассеты из `public/images/`

### Сетка первых 9 постов
```
[Intro] [Porto Sole] [Aurelia]
[BA carousel] [Premium] [Stats]
[Process] [Audit CTA] [Reel cover]
```

---

## 4. Twelve launch posts — captions (copy-paste)

Формат: IT сверху, EN снизу, хэштеги, CTA.

---

### Post 1 · Intro
**Asset:** posts-export → Post 1 · Intro  
**Type:** single portrait

**Caption:**
```
Siamo DormUp Group — digital studio in Emilia-Romagna. Creiamo siti premium per ristoranti, hotel e brand locali che non vogliono sembrare «template». Design che converte, strategia chiara, risultati misurabili.

We're DormUp Group — a boutique digital studio in Emilia-Romagna. Premium websites for restaurants, hotels & local brands that refuse to look generic.

Audit gratuito · link in bio ↓

#webdesign #digitalstudio #emiliaromagna #horeca #sitiweb
```

---

### Post 2 · Porto Sole
**Asset:** `public/images/project-porto-sole.png` · posts-export Post 2  
**Type:** single portrait

**Caption:**
```
Concept redesign per ristorante/bar sul molo. Hero cinematografico, menu in evidenza, prenotazione diretta.

Concept redesign for a waterfront restaurant/bar — cinematic hero, menu-first layout, direct booking flow.

#restaurantdesign #uxdesign #conceptdesign #webdesign
```

---

### Post 3 · Aurelia del Mar
**Asset:** `public/images/project-hotel-aurelia.png`  
**Type:** single portrait

**Caption:**
```
Prototipo live per hotel — prenotazione diretta senza OTA. Un CTA dominante, copy orientato alla conversione.

Live hotel prototype — direct booking without OTAs. One dominant CTA, conversion-focused copy.

🔗 hotel-aurelia-del-mar.vercel.app

#hoteldesign #directbooking #uxdesign #webdevelopment
```

---

### Post 4 · Pod Lopuhom
**Asset:** `public/images/project-podlopuhom.png`

**Caption:**
```
Da profilo social a brand professionale. Galleria multilingue EN/RU/IT + checkout WhatsApp/Instagram.

From social profile to professional brand. Multilingual gallery + WhatsApp/Instagram checkout.

🔗 podlopuhom.com

#ecommerce #handmade #i18n #webdesign
```

---

### Post 5 · Mare Vivo
**Asset:** `public/images/project-mare-vivo.png`

**Caption:**
```
Seafood restaurant, Bari. Concept redesign con flusso prenotazione e identità mediterranea.

Seafood restaurant concept — Mediterranean identity + reservation flow.

#restaurantdesign #bari #conceptdesign #webdesign
```

---

### Post 6 · Before/After
**Asset:** 5 square slides (hotel, restaurant, bar, local, custom) — posts-export Post 6  
**Type:** carousel (5 slides)

**Caption:**
```
Quasi tutti hanno un sito. Quasi nessuno ha una vera prima impressione digitale. Scorri per vedere cosa cambia nel primo schermo.

Almost everyone has a website. Almost no one has a real digital first impression. Swipe to compare.

Audit gratuito · link in bio

#beforeafter #redesign #conversion #uxdesign #webdesign
```

---

### Post 7 · Premium Website
**Asset:** `public/images/service-premium-website.png`

**Caption:**
```
Siti custom per ristoranti, hotel, bar — da €1.299. Non template. Costruito per il tuo brand.

Custom websites for restaurants, hotels & bars — from €1,299. Not a template. Built for your brand.

#webdevelopment #customwebsite #horeca #digitalstudio
```

---

### Post 8 · Booking & Lead Flow
**Asset:** `public/images/service-booking-flow.png`

**Caption:**
```
Prenotazioni e richieste dirette sul tuo sito — da €599. Meno commissioni, più controllo.

Direct bookings & lead forms on your site — from €599. Less commission, more control.

#booking #leadgeneration #restaurant #hotel
```

---

### Post 9 · Proof / Stats
**Asset:** posts-export Post 9

**Caption:**
```
Rispondiamo entro 1 ora. Il 70% giudica il business dal sito. 26 servizi modulari. Start medio: 2 settimane.

1-hour reply. 70% judge your business by your website. 26 modular services. ~2-week project start.

#digitalstudio #webdesign #emiliaromagna
```

---

### Post 10 · Process
**Asset:** 5 square slides — posts-export Post 10  
**Type:** carousel (5 slides)

**Caption:**
```
Come trasformiamo un sito debole in un asset di business — in 5 fasi chiare.

How we turn a weak website into a business asset — in 5 clear phases.

Capire → Pianificare → Design → Sviluppare → Migliorare

#process #webdesign #digitalstrategy
```

---

### Post 11 · Free Audit CTA
**Asset:** posts-export Post 11

**Caption:**
```
Analizziamo il tuo sito attuale e ti diciamo cosa migliorare. Gratis, senza pressione. Risposta entro 1 ora.

We'll review your current site and tell you exactly what to improve. Free, no pressure. Reply within 1 hour.

Richiedi audit · link in bio ↓

#freeaudit #webdesign #digitalstudio #rimini
```

---

### Post 12 · Reel
**Asset:** screen recording + posts-export Post 12 as cover  
**Type:** Reel 9:16, 15–30 sec

**Caption:**
```
Prima: template. Dopo: premium. Il primo schermo del sito fa la differenza.

Before: template. After: premium. Your homepage makes the difference.

Audit gratuito · link in bio

#webdesign #beforeafter #reels #digitalstudio
```

---

## 5. Reel — сценарий съёмки

**Длительность:** 20–25 сек  
**Формат:** 1080×1920, 30fps

| Sec | Кадр | Текст overlay |
|-----|------|---------------|
| 0–3 | Scroll `ba-hotel-before.svg` (или скрин шаблонного сайта) | «Prima» |
| 3–6 | Gold wipe transition | — |
| 6–12 | Scroll `porto-sole.vercel.app` или mockup PNG | «Dopo» |
| 12–18 | Quick cuts: Aurelia + Mare Vivo (2 sec each) | «Premium · Custom» |
| 18–25 | Dark frame + audit copy | «Audit gratuito · Link in bio» |

**Audio:** тихий ambient (no trending sounds — premium tone)  
**Subtitles:** EN bottom, IT optional top  
**Cover:** Post 12 frame from posts-export.html

**Как снять:**
1. Записать экран телефона/браузера при scroll по live demo
2. CapCut / Premiere: добавить overlays в Unbounded + gold accent
3. Export MP4 → Instagram Reels

---

## 6. Stories для Highlights (контент)

**Готовые файлы:** загрузите PNG из [`../export/`](../export/) в Instagram Stories.

### Work (4 stories) → `export/work/`
1. Porto Sole + sticker link porto-sole.vercel.app
2. Aurelia + sticker link hotel-aurelia-del-mar.vercel.app
3. Pod Lopuhom + sticker podlopuhom.com
4. Mare Vivo + «Concept · Bari» + sticker mare-vivo.vercel.app

### Services (5 stories)
Использовать `public/images/service-*.png` + цена «da €X» из [`data/pricing.ts`](../../data/pricing.ts)

### Audit (3–4 stories)
1. «Cos'è l'audit?» — analisi gratuita del sito attuale
2. «Cosa ricevi» — lista punti (UX, CTA, mobile, velocità)
3. «Gratis · 1h risposta»
4. Poll: «Il tuo sito converte?» Sì / Non so → sticker link bio

### Process
5 stories = 5 slides Post 10

### About
1. Map pin Rimini · Emilia-Romagna
2. Quote: «Built with intention.»
3. «4 progetti · aperti per nuovi clienti»
4. Email sticker: dormup.it@gmail.com

---

## 7. Контент-ритм после запуска

| Неделя | Feed | Stories |
|--------|------|---------|
| 1 | Posts 1–4 | Highlights setup + «We're live» |
| 2 | Posts 5–8 | Poll «Il tuo sito converte?» |
| 3 | Posts 9–12 + Reel | Q&A audit |
| Ongoing | 2–3/week | 3–5/week |

**Mix:** 40% portfolio · 25% expertise · 20% proof · 15% CTA

**Язык:** IT + EN в каждой подписи; Reels — IT voiceover + EN subs.

---

## 8. Чеклист публикации

- [ ] Аватар установлен
- [ ] Bio + link на audit (с UTM)
- [ ] 5 Highlights с обложками
- [ ] 9+ постов в ленте (сетка 3×3)
- [ ] 1 Reel опубликован
- [ ] Сайт: Instagram в footer ✓ (см. [`components/footer/index.tsx`](../../components/footer/index.tsx))
- [ ] Schema.org sameAs ✓ (см. [`app/[locale]/layout.tsx`](../../app/[locale]/layout.tsx))

---

## 9. Ассеты — быстрый индекс

| Пост | Файл |
|------|------|
| Logo | `public/images/logo-dm-group.png` |
| Porto Sole | `public/images/project-porto-sole.png` |
| Aurelia | `public/images/project-hotel-aurelia.png` |
| Pod Lopuhom | `public/images/project-podlopuhom.png` |
| Mare Vivo | `public/images/project-mare-vivo.png` |
| Services | `public/images/service-*.png` |
| Before/After | `public/images/ba-*-{before,after}.svg` |
| Profile GIF | `LogoDMGroup_glow_profile.gif` |
