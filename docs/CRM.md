# DormUp HQ

DormUp HQ is the internal operating system for the studio: lead → deal →
company → project → recurring support and revenue. The legacy Cases workspace
remains available during reconciliation but is no longer the primary model.

## Workflow

1. A public contact form creates a lead (`status: new`), appends a `lead_events`
   row, and notifies sales/managers in Inbox.
2. Sales moves leads through Researching, Contacted, Replied, Discovery and
   Qualified with a score and dated follow-up.
3. Conversion atomically creates/reuses Company and Contact records and creates
   a Deal with the required value.
4. A won Deal can be converted once into a delivery `client_projects` record.
5. Delivery is tracked through milestones, related tasks, progress, health and
   project economics.
6. The team works from tasks, the case journal, private files, and versioned
   specifications (Documents / Automations live under Settings shortcuts, not top nav).
7. Automations create reminders and template tasks. Cron also raises lead SLA
   reminders and **Care review** notifications. They never make destructive
   changes without an explicit user action.
8. When a case moves to `completed`, Studio seeds proof tasks (portfolio,
   testimonial, services copy) and offers **Open Care** for retainer. Optional
   `cases.project_id` links delivery to portfolio.
9. The dashboard calculates pipeline, weighted pipeline, cash received, MRR,
   outstanding invoices, expected 30-day value and ordered next actions from
   live HQ records.

## Lead fields (workspace)

Beyond contact payload fields, leads store:

- `assignee_id`, `first_responded_at`, `next_action_at`
- `qualified_at`, `closed_at`, `lost_reason`
- append-only `lead_events` (`created`, `status_changed`, `assigned`,
  `note_added`, `imported`, `converted`, GDPR events, …)

`first_responded_at` is set on the first note or when status moves
`new` → `contacted` (legacy `in_progress` is remapped by migration 008).

## Data boundaries

- `media` is the public website asset bucket.
- `crm-private` is private and must never expose permanent public URLs.
- Access to case files uses short-lived signed URLs.
- The database stores file metadata, authorship, retention dates, and case
  membership.
- Specifications are edited manually and stored as immutable versions.
- No OCR, speech-to-text, embeddings, or LLM processing is used.

## Roles

- `owner`: unrestricted Studio administration.
- `manager`: cases, workflows, documents, deadlines, and team assignments.
- `sales`: leads, qualification, communication, and case conversion.
- `specialist`: assigned cases, tasks, files, and working documents.
- `viewer`: read-only access to assigned cases.

Global roles define the maximum capability. Case membership limits which cases
a non-owner can access. Hiding navigation is not authorization: server pages
and API routes must perform the same capability check.

## Languages

Studio supports Russian and English independently from public-site locales.
The preferred language is stored on the profile and mirrored in a cookie so
server-rendered pages use the correct language immediately.

## Deployment

1. Back up the existing database. Apply migrations `003` through
   `008_hq_phase1.sql` in numeric order. Migration 008 is additive.
   **Never run `supabase/SETUP.sql` on an existing database**: it is a
   destructive greenfield bootstrap.
2. Create the private `case-files` / `crm-private` storage bucket if the
   migration cannot do it in the current Supabase environment.
3. Verify the first owner profile before inviting the team.
4. Deploy the application and test direct-URL role restrictions.
5. Verify signed file downloads and GDPR deletion on a disposable test case /
   lead.

Run `npm run studio:check` for a read-only schema check. Run
`npm run studio:smoke` before the first production rollout; it creates a
temporary lead (event + notification), a case with related records and a
private file, verifies them, and removes the test data in a `finally` cleanup.

Run `npm run hq:reconcile` for a read-only report of legacy Cases that are not
linked to a delivery project. Review these manually; the migration deliberately
does not guess whether an old Case represents a deal or a project. Run
`npm run hq:seed` only when realistic demo records are desired; it is
idempotent and does not delete existing business records.

The optional reminder scheduler is enabled only when `CRM_CRON_SECRET` is set.
Call `POST /api/studio/cron` from the deployment scheduler with that value in
the `x-crm-cron-secret` header. The endpoint deduplicates unread reminders,
runs lead SLA checks, and runs enabled `task_due` automation rules.

## Operational checks

- Every mutation records an audit entry with actor and entity.
- Every case change relevant to the team records a journal event.
- Lead status and assignment changes append `lead_events`.
- Every active case has an owner, next action, and deadline.
- Failed automation runs are visible and can be retried safely.
- Private files cannot be downloaded after a signed URL expires.
- Case export/delete includes tasks, events, files, and document versions.
- Lead GDPR export/delete includes notes and timeline events.
