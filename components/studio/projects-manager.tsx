"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Plus, Star } from "lucide-react";
import { useStudioI18n } from "@/lib/studio/i18n";
import { studioPath } from "@/lib/studio/path";

type ProjectI18n = {
  id?: string;
  locale: string;
  name: string;
  name_tagline?: string | null;
  subtitle?: string | null;
};

export type StudioProjectRow = {
  id: string;
  project_id: string;
  slug: string;
  index_label: string;
  tag: string;
  sort_order: number;
  published: boolean;
  featured: boolean;
  is_live: boolean;
  url: string;
  display_url: string;
  project_i18n?: ProjectI18n[] | null;
};

async function revalidateSite() {
  await fetch("/api/studio/revalidate", { method: "POST" });
}

export function ProjectsManager({
  initial,
  adminLocale,
}: {
  initial: StudioProjectRow[];
  adminLocale: string;
}) {
  const router = useRouter();
  const { t } = useStudioI18n();
  const [rows, setRows] = useState(initial);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const preferredLocale = useMemo(() => {
    const order = [adminLocale, "it", "en", "ru"];
    return order;
  }, [adminLocale]);

  function projectTitle(row: StudioProjectRow) {
    const i18n = row.project_i18n || [];
    for (const locale of preferredLocale) {
      const match = i18n.find((item) => item.locale === locale && item.name);
      if (match?.name) return match.name;
    }
    return i18n.find((item) => item.name)?.name || row.project_id;
  }

  async function persistOrder(next: StudioProjectRow[]) {
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/studio/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order: next.map((row) => row.id) }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || t("projects.saveFailed"));
      setBusy(false);
      return;
    }
    setRows(next.map((row, index) => ({
      ...row,
      sort_order: index,
      index_label: String(index + 1).padStart(2, "0"),
    })));
    setMsg(t("projects.orderSaved"));
    await revalidateSite();
    setBusy(false);
    router.refresh();
  }

  async function move(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= rows.length) return;
    const next = [...rows];
    const [item] = next.splice(index, 1);
    next.splice(target, 0, item);
    await persistOrder(next);
  }

  async function patchFlags(
    id: string,
    patch: { featured?: boolean; published?: boolean },
  ) {
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/studio/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...patch }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || t("projects.saveFailed"));
      setBusy(false);
      return;
    }
    setRows((all) =>
      all.map((row) => (row.id === id ? { ...row, ...patch } : row)),
    );
    setMsg(t("projects.saved"));
    await revalidateSite();
    setBusy(false);
    router.refresh();
  }

  async function createProject() {
    if (!name.trim()) {
      setMsg(t("projects.nameRequired"));
      return;
    }
    setBusy(true);
    setMsg("");
    const res = await fetch("/api/studio/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: name.trim(), slug: slug.trim() || undefined }),
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.error || t("projects.createFailed"));
      setBusy(false);
      return;
    }
    setName("");
    setSlug("");
    setMsg(t("projects.created"));
    await revalidateSite();
    setBusy(false);
    if (data.id) {
      router.push(studioPath(`/projects/${data.id}`));
      return;
    }
    router.refresh();
  }

  async function removeProject(id: string, label: string) {
    if (!window.confirm(t("projects.deleteConfirm", { name: label }))) return;
    setBusy(true);
    setMsg("");
    const res = await fetch(`/api/studio/projects/${id}`, { method: "DELETE" });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setMsg(data.error || t("projects.deleteFailed"));
      setBusy(false);
      return;
    }
    setRows((all) => all.filter((row) => row.id !== id));
    setMsg(t("projects.deleted"));
    await revalidateSite();
    setBusy(false);
    router.refresh();
  }

  return (
    <div className="st-form" style={{ maxWidth: 1100 }}>
      <div className="st-table-wrap">
        <table className="st-table">
          <thead>
            <tr>
              <th>{t("content.colOrder")}</th>
              <th>{t("content.colName")}</th>
              <th>{t("content.colSlug")}</th>
              <th>{t("content.colFeatured")}</th>
              <th>{t("content.colPublished")}</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => {
              const title = projectTitle(row);
              return (
                <tr key={row.id}>
                  <td>
                    <div className="st-row" style={{ gap: 6 }}>
                      <span style={{ fontFamily: "ui-monospace, monospace", fontSize: 12 }}>
                        {row.index_label}
                      </span>
                      <button
                        type="button"
                        className="st-btn subtle"
                        disabled={busy || index === 0}
                        onClick={() => move(index, -1)}
                        aria-label={t("projects.moveUp")}
                      >
                        <ArrowUp size={14} />
                      </button>
                      <button
                        type="button"
                        className="st-btn subtle"
                        disabled={busy || index === rows.length - 1}
                        onClick={() => move(index, 1)}
                        aria-label={t("projects.moveDown")}
                      >
                        <ArrowDown size={14} />
                      </button>
                    </div>
                  </td>
                  <td>
                    <strong>{title}</strong>
                    <div style={{ color: "var(--st-muted)", fontSize: 12, marginTop: 2 }}>
                      {row.tag}
                    </div>
                  </td>
                  <td>
                    <code>{row.slug}</code>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="st-btn subtle"
                      disabled={busy}
                      onClick={() => patchFlags(row.id, { featured: !row.featured })}
                      aria-pressed={row.featured}
                      aria-label={
                        row.featured
                          ? t("projects.featuredOn")
                          : t("projects.featuredOff")
                      }
                      title={
                        row.featured
                          ? t("projects.featuredOn")
                          : t("projects.featuredOff")
                      }
                      style={{
                        color: row.featured ? "var(--st-gold)" : "var(--st-muted)",
                        minWidth: 40,
                        paddingInline: 10,
                      }}
                    >
                      <Star
                        size={18}
                        fill={row.featured ? "currentColor" : "none"}
                        strokeWidth={row.featured ? 0 : 1.75}
                      />
                    </button>
                  </td>
                  <td>
                    <label className="st-row" style={{ gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={row.published}
                        disabled={busy}
                        onChange={(e) =>
                          patchFlags(row.id, { published: e.target.checked })
                        }
                      />
                      {row.published ? t("common.yes") : t("common.no")}
                    </label>
                  </td>
                  <td>
                    <div className="st-row" style={{ gap: 8, justifyContent: "flex-end" }}>
                      <Link className="st-btn" href={studioPath(`/projects/${row.id}`)}>
                        {t("common.edit")}
                      </Link>
                      <button
                        type="button"
                        className="st-btn danger"
                        disabled={busy}
                        onClick={() => removeProject(row.id, title)}
                      >
                        {t("common.remove")}
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="st-card" style={{ marginTop: 24 }}>
        <h2 style={{ margin: "0 0 8px", fontSize: 18 }}>{t("projects.addTitle")}</h2>
        <p className="st-sub">{t("projects.addSub")}</p>
        <div className="st-row" style={{ flexWrap: "wrap", gap: 10 }}>
          <input
            className="st-input"
            placeholder={t("projects.namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ minWidth: 220 }}
          />
          <input
            className="st-input"
            placeholder={t("projects.slugPlaceholder")}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            style={{ minWidth: 180 }}
          />
          <button
            type="button"
            className="st-btn primary"
            disabled={busy}
            onClick={createProject}
          >
            <Plus size={16} />
            {t("projects.add")}
          </button>
        </div>
      </div>

      {msg ? <p className="st-ok">{msg}</p> : null}
    </div>
  );
}
