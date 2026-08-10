import type { AdminViewServerProps } from "payload";
import { Gutter } from "@payloadcms/ui";
import { getPayloadClient } from "@/lib/payload";

const LOCALES = ["it", "en", "fr", "ru", "de", "es"] as const;

async function getLeadStats() {
  try {
    const payload = await getPayloadClient();
    const [all, neu, won, lost, audit] = await Promise.all([
      payload.count({ collection: "leads", overrideAccess: true }),
      payload.count({
        collection: "leads",
        where: { status: { equals: "new" } },
        overrideAccess: true,
      }),
      payload.count({
        collection: "leads",
        where: { status: { equals: "won" } },
        overrideAccess: true,
      }),
      payload.count({
        collection: "leads",
        where: { status: { equals: "lost" } },
        overrideAccess: true,
      }),
      payload.count({
        collection: "leads",
        where: { intent: { equals: "audit" } },
        overrideAccess: true,
      }),
    ]);
    return {
      total: all.totalDocs,
      neu: neu.totalDocs,
      won: won.totalDocs,
      lost: lost.totalDocs,
      audit: audit.totalDocs,
    };
  } catch {
    return { total: 0, neu: 0, won: 0, lost: 0, audit: 0 };
  }
}

async function getLocaleCompleteness() {
  try {
    const payload = await getPayloadClient();
    const services = await payload.find({
      collection: "services",
      limit: 50,
      depth: 0,
      overrideAccess: true,
      locale: "it",
    });

    const rows: { id: string; filled: Record<string, boolean> }[] = [];

    for (const svc of services.docs) {
      const filled: Record<string, boolean> = {};
      for (const locale of LOCALES) {
        const localized = await payload.findByID({
          collection: "services",
          id: svc.id,
          locale,
          depth: 0,
          overrideAccess: true,
        });
        filled[locale] = Boolean(
          localized?.title && String(localized.title).trim().length > 0,
        );
      }
      rows.push({ id: String(svc.serviceId), filled });
    }

    return rows;
  } catch {
    return [];
  }
}

/** Custom dashboard body only — Root already wraps with DefaultTemplate. */
export async function DashboardView(_props: AdminViewServerProps) {
  const [stats, localeRows] = await Promise.all([getLeadStats(), getLocaleCompleteness()]);
  const cards = [
    { label: "Total leads", value: stats.total },
    { label: "New", value: stats.neu },
    { label: "Won", value: stats.won },
    { label: "Lost", value: stats.lost },
    { label: "Audit requests", value: stats.audit },
  ];

  return (
    <Gutter>
      <h1 style={{ marginBottom: "0.5rem" }}>DormUp Dashboard</h1>
      <p style={{ opacity: 0.7, marginBottom: "1.5rem" }}>
        Business analytics + locale completeness for catalog content.
      </p>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: "1rem",
          marginBottom: "2rem",
        }}
      >
        {cards.map((card) => (
          <div
            key={card.label}
            style={{
              border: "1px solid var(--theme-elevation-150)",
              borderRadius: 8,
              padding: "1rem",
            }}
          >
            <div style={{ fontSize: 12, opacity: 0.65, textTransform: "uppercase" }}>
              {card.label}
            </div>
            <div style={{ fontSize: 28, fontWeight: 600, marginTop: 4 }}>{card.value}</div>
          </div>
        ))}
      </div>

      <h2 style={{ marginBottom: "0.75rem", fontSize: 18 }}>Service locale completeness</h2>
      <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left", padding: 8 }}>Service</th>
              {LOCALES.map((l) => (
                <th key={l} style={{ textAlign: "center", padding: 8 }}>
                  {l.toUpperCase()}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {localeRows.map((row) => (
              <tr key={row.id}>
                <td style={{ padding: 8 }}>{row.id}</td>
                {LOCALES.map((l) => (
                  <td key={l} style={{ textAlign: "center", padding: 8 }}>
                    {row.filled[l] ? "✓" : "—"}
                  </td>
                ))}
              </tr>
            ))}
            {!localeRows.length ? (
              <tr>
                <td colSpan={7} style={{ padding: 8, opacity: 0.6 }}>
                  No services yet — run npm run payload:seed
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>

      <p style={{ marginTop: "1.5rem", fontSize: 12, opacity: 0.65 }}>
        GDPR: export/erase leads via <code>/api/admin/leads-gdpr?id=LEAD_ID</code>{" "}
        (authenticated).
      </p>
    </Gutter>
  );
}

export default DashboardView;
