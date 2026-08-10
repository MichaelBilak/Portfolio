# DormUp Studio Admin

Public admin URL is set by env (not the obvious `/studio`):

```env
NEXT_PUBLIC_STUDIO_PATH=/ops-k7m2xq9n4w
```

Open `https://your-domain/ops-k7m2xq9n4w`. Direct `/studio` returns **404** when a custom path is set.

## Setup

1. Supabase project + run [`supabase/SETUP.sql`](../supabase/SETUP.sql)
2. Storage bucket **`media`** (public)
3. `.env.local`: Supabase keys + `NEXT_PUBLIC_STUDIO_PATH`
4. Auth user → `update profiles set role = 'owner' where id = '…'`
5. `npm run studio:seed`
6. Open `http://localhost:3000` + your studio path

## Roles

| Role | Access |
|------|--------|
| `owner` | Everything + Users |
| `editor` | Content + leads |
| `sales` | Leads only |

## Vercel

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_STUDIO_PATH`
