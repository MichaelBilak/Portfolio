# DormUp Studio Admin

Custom admin at **`/studio`** (Supabase Auth + Postgres + Storage). Payload CMS has been removed.

## Setup

1. Create a Supabase project.
2. In **SQL Editor**, run [`supabase/migrations/001_studio.sql`](../supabase/migrations/001_studio.sql).
3. Create a Storage bucket named **`media`** (public).
4. Copy API keys into `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
```

5. Create your user in **Authentication → Users** (email/password).
6. In SQL:

```sql
update profiles set role = 'owner' where id = '<your-auth-user-uuid>';
```

7. Seed catalog + copy from the static site data:

```bash
npm run studio:seed
```

8. Open [http://localhost:3000/studio](http://localhost:3000/studio) and sign in.

## Roles

| Role | Access |
|------|--------|
| `owner` | Everything + Users |
| `editor` | Content (projects, services, copy, SEO, media, settings) + leads |
| `sales` | Leads only |

## Features

- **Dashboard** — lead counters, quick links
- **Leads CRM** — status/priority, notes, GDPR export/delete
- **Projects / Services / Addons / Process / Before-After** — JSON editors with i18n
- **Site copy** — per-section, per-locale editors
- **SEO / Redirects / Settings / Media / Users**

## Public site

[`lib/cms/catalog.ts`](../lib/cms/catalog.ts) reads Supabase when configured; otherwise falls back to `data/*` + `lib/translations.ts`. Contact form writes to `leads` when Supabase is configured; email/Sheets still work via env.

## Vercel

Set the same three Supabase env vars (+ Gmail etc.) on the project. No `PAYLOAD_SECRET` / `DATABASE_URL` needed for Studio.
