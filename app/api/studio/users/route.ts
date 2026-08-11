import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireStudioUser } from "@/lib/studio/auth";

const studioRoles = ["owner", "editor", "sales", "manager", "specialist", "viewer"] as const;
const adminLocales = ["ru", "en"] as const;

export async function GET() {
  const auth = await requireStudioUser({ capability: "cases.update" });
  if ("error" in auth) return auth.error;
  const { data, error } = await createAdminClient()
    .from("profiles")
    .select("id,name,role")
    .order("name", { ascending: true });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data || []);
}

export async function POST(request: NextRequest) {
  const auth = await requireStudioUser({ owner: true });
  if ("error" in auth) return auth.error;

  const body = (await request.json()) as {
    email?: string;
    password?: string;
    name?: string;
    role?: string;
    adminLocale?: string;
  };
  if (!body.email || !body.password) {
    return NextResponse.json({ error: "email and password required" }, { status: 400 });
  }
  if (body.role && !studioRoles.includes(body.role as (typeof studioRoles)[number])) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  if (
    body.adminLocale &&
    !adminLocales.includes(body.adminLocale as (typeof adminLocales)[number])
  ) {
    return NextResponse.json({ error: "Invalid admin locale" }, { status: 400 });
  }

  const sb = createAdminClient();
  const { data, error } = await sb.auth.admin.createUser({
    email: body.email,
    password: body.password,
    email_confirm: true,
    user_metadata: {
      name: body.name || "",
      role: body.role || "editor",
      admin_locale: body.adminLocale || "ru",
    },
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (data.user) {
    await sb
      .from("profiles")
      .upsert({
        id: data.user.id,
        name: body.name || null,
        role: body.role || "editor",
        admin_locale: body.adminLocale || "ru",
      });
    await sb.from("audit_logs").insert({
      actor_id: auth.id,
      action: "create_user",
      entity: "profiles",
      entity_id: data.user.id,
      meta: { email: body.email, role: body.role },
    });
  }

  return NextResponse.json({ ok: true, id: data.user?.id });
}

export async function PATCH(request: NextRequest) {
  const body = (await request.json()) as {
    id?: string;
    role?: string;
    name?: string;
    adminLocale?: string;
  };

  // Any authenticated studio user can update their own admin locale.
  if (body.adminLocale && !body.id && !body.role) {
    const auth = await requireStudioUser();
    if ("error" in auth) return auth.error;
    if (!adminLocales.includes(body.adminLocale as (typeof adminLocales)[number])) {
      return NextResponse.json({ error: "Invalid admin locale" }, { status: 400 });
    }
    const sb = createAdminClient();
    const { error } = await sb
      .from("profiles")
      .update({
        admin_locale: body.adminLocale,
        updated_at: new Date().toISOString(),
      })
      .eq("id", auth.id);
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ ok: true });
  }

  const auth = await requireStudioUser({ owner: true });
  if ("error" in auth) return auth.error;

  if (!body.id || !body.role) {
    return NextResponse.json({ error: "id and role required" }, { status: 400 });
  }
  if (!studioRoles.includes(body.role as (typeof studioRoles)[number])) {
    return NextResponse.json({ error: "Invalid role" }, { status: 400 });
  }
  if (
    body.adminLocale &&
    !adminLocales.includes(body.adminLocale as (typeof adminLocales)[number])
  ) {
    return NextResponse.json({ error: "Invalid admin locale" }, { status: 400 });
  }

  const sb = createAdminClient();
  const { error } = await sb
    .from("profiles")
    .update({
      role: body.role,
      name: body.name,
      ...(body.adminLocale ? { admin_locale: body.adminLocale } : {}),
      updated_at: new Date().toISOString(),
    })
    .eq("id", body.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await sb.from("audit_logs").insert({
    actor_id: auth.id,
    action: "change_role",
    entity: "profiles",
    entity_id: body.id,
    meta: { role: body.role, adminLocale: body.adminLocale },
  });

  return NextResponse.json({ ok: true });
}
