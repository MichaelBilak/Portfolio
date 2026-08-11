import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";

const LOCALES = ["it", "en", "fr", "ru", "de", "es"] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

export async function GET() {
  const auth = await requireStudioUser({ content: true });
  if ("error" in auth) return auth.error;

  const sb = createAdminClient();
  const { data, error } = await sb
    .from("projects")
    .select("*, project_i18n(id, locale, name, name_tagline, subtitle)")
    .order("sort_order", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ projects: data || [] });
}

export async function POST(request: NextRequest) {
  const auth = await requireStudioUser({ content: true });
  if ("error" in auth) return auth.error;

  const body = (await request.json()) as {
    project_id?: string;
    slug?: string;
    name?: string;
    tag?: string;
    url?: string;
    display_url?: string;
    image_path?: string;
  };

  const name = String(body.name || "").trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const slug = slugify(body.slug || body.project_id || name);
  const projectId = slugify(body.project_id || slug);
  if (!slug || !projectId) {
    return NextResponse.json({ error: "Invalid slug" }, { status: 400 });
  }

  const sb = createAdminClient();
  const { data: maxRow } = await sb
    .from("projects")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const sortOrder = Number(maxRow?.sort_order ?? -1) + 1;
  const indexLabel = String(sortOrder + 1).padStart(2, "0");

  const { data, error } = await sb
    .from("projects")
    .insert({
      project_id: projectId,
      slug,
      index_label: indexLabel,
      tag: String(body.tag || "Live Project"),
      sort_order: sortOrder,
      image_path: String(body.image_path || `/images/project-${projectId}.png`),
      image_position: "top",
      tech: [],
      url: String(body.url || "#"),
      display_url: String(body.display_url || ""),
      is_live: true,
      featured: true,
      published: true,
      updated_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  for (const locale of LOCALES) {
    await sb.from("project_i18n").upsert(
      {
        project_id: data.id,
        locale,
        name,
        name_tagline: null,
        subtitle: "",
        problem: "",
        solution: "",
        business_impact: "",
      },
      { onConflict: "project_id,locale" },
    );
  }

  return NextResponse.json({ ok: true, id: data.id });
}

export async function PATCH(request: NextRequest) {
  const auth = await requireStudioUser({ content: true });
  if ("error" in auth) return auth.error;

  const body = (await request.json()) as {
    order?: string[];
    id?: string;
    featured?: boolean;
    published?: boolean;
    is_live?: boolean;
  };

  const sb = createAdminClient();

  if (Array.isArray(body.order) && body.order.length) {
    const updates = body.order.map((id, index) =>
      sb
        .from("projects")
        .update({
          sort_order: index,
          index_label: String(index + 1).padStart(2, "0"),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id),
    );
    const results = await Promise.all(updates);
    const failed = results.find((r) => r.error);
    if (failed?.error) {
      return NextResponse.json({ error: failed.error.message }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  }

  if (!body.id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }

  const patch: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (typeof body.featured === "boolean") patch.featured = body.featured;
  if (typeof body.published === "boolean") patch.published = body.published;
  if (typeof body.is_live === "boolean") patch.is_live = body.is_live;

  const { error } = await sb.from("projects").update(patch).eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ ok: true });
}
