# DormUp Studio Admin

Public admin URL is set by env (not the obvious `/studio`):

```env
NEXT_PUBLIC_STUDIO_PATH=/ops-k7m2xq9n4w
```

Open `https://your-domain/ops-k7m2xq9n4w`. Direct `/studio` returns **404** when a custom path is set.

## Setup

1. Supabase project + run [`supabase/SETUP.sql`](../supabase/SETUP.sql)
2. Storage bucket **`media`** (public)
3. Apply CRM migrations after the base schema (`003`–`007`) and create **`crm-private`**
   as a private bucket
4. `.env.local`: Supabase keys + `NEXT_PUBLIC_STUDIO_PATH`
5. Auth user → `update profiles set role = 'owner' where id = '…'`
6. `npm run studio:seed`
7. `npm run studio:check`
8. Open `http://localhost:3000` + your studio path

### Lead workspace (sales)

- `/leads?view=list|board` — filters, claim, import/export CSV|XLSX
- `/leads/[id]` — assign, SLA next action, timeline, convert to case
- Inbox deep-links new leads and SLA alerts
- Overview + Reports — funnel and custom period

The complete case-management workflow and security checks are documented in
[`docs/CRM.md`](./CRM.md).

## Roles

| Role | Access |
|------|--------|
| `owner` | Everything + Users |
| `manager` | Cases, tasks, documents, automations |
| `editor` | Website content + cases |
| `sales` | Leads and case qualification |
| `specialist` | Assigned cases and tasks |
| `viewer` | Assigned cases, read-only |

## Vercel

`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_STUDIO_PATH`
