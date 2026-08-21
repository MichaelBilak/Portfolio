# DormUp Studio CRM

The Studio CRM manages a lead from first contact through delivery without AI
services or paid model APIs.

## Workflow

1. A public contact form creates a lead (`status: new`), appends a `lead_events`
   row, and notifies sales/managers in Inbox.
2. Sales claims or assigns the lead, sets next action / SLA, and moves it to
   `in_progress` (list or board on `/leads`).
3. Qualification continues on the lead detail page: notes, timeline, lost reason,
   spam, or convert to a case (stage + owner + **required deal value**).
4. Convert marks the lead `won`, creates a case with `estimated_value` / currency
   at the chosen pipeline stage, and links `cases.lead_id`.
5. A manager assigns the case, stage, deadline, and workflow template.
6. The team works from tasks, the case journal, private files, and versioned
   specifications (Documents / Automations live under Settings shortcuts, not top nav).
7. Automations create reminders and template tasks. Cron also raises lead SLA
   reminders and **Care review** notifications. They never make destructive
   changes without an explicit user action.
8. When a case moves to `completed`, Studio seeds proof tasks (portfolio,
   testimonial, services copy) and offers **Open Care** for retainer. Optional
   `cases.project_id` links delivery to portfolio.
9. Overview is the daily pulse: attention (SLA leads, overdue tasks, unpaid
   milestones, Care due) + short funnel + site health. Reports add period depth
   including unpaid finance and Care MRR.

## Lead fields (workspace)

Beyond contact payload fields, leads store:

- `assignee_id`, `first_responded_at`, `next_action_at`
- `qualified_at`, `closed_at`, `lost_reason`
- append-only `lead_events` (`created`, `status_changed`, `assigned`,
  `note_added`, `imported`, `converted`, GDPR events, …)

`first_responded_at` is set on the first note or when status moves
`new` → `in_progress`.

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

1. Apply CRM migrations `003_crm_backend.sql`,
   `004_fix_case_event_cascades.sql`, `005_task_soft_delete.sql`, and
   `006_leads_workspace.sql` after the existing Studio schema.
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
