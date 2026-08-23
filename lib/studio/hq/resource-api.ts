import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ApiInputError, apiError, pageParams, readJsonObject } from "@/lib/studio/api";
import { requireStudioUser, type StudioCapability } from "@/lib/studio/auth";
import { recordStudioMutation } from "@/lib/studio/audit";
import { isISODate } from "@/lib/studio/hq/dates";

type FieldKind = "string" | "uuid" | "decimal" | "integer" | "date" | "datetime" | "object";

export type HqField = {
  column: string;
  input: string;
  kind: FieldKind;
  required?: boolean;
  nullable?: boolean;
  maxLength?: number;
  min?: number;
  max?: number;
  values?: readonly string[];
  fallback?: string | number | Record<string, unknown>;
};

export type HqResource = {
  table: string;
  singular: string;
  readCapability: StudioCapability;
  writeCapability: StudioCapability;
  fields: readonly HqField[];
  select?: string;
  listSelect?: string;
  orderBy?: string;
  filters?: Readonly<Record<string, string>>;
  searchColumns?: readonly string[];
};

const UUID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const DECIMAL = /^(?:0|[1-9]\d*)(?:\.\d{1,4})?$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;

function parseValue(value: unknown, field: HqField): unknown {
  if (value === null || value === "") {
    if (field.nullable) return null;
    throw new ApiInputError(`${field.input} cannot be empty`);
  }
  if (field.kind === "string") {
    if (typeof value !== "string" || !value.trim()) {
      throw new ApiInputError(`${field.input} must be a non-empty string`);
    }
    const result = value.trim();
    if (result.length > (field.maxLength || 5000)) {
      throw new ApiInputError(`${field.input} is too long`);
    }
    if (field.values && !field.values.includes(result)) {
      throw new ApiInputError(`${field.input} is invalid`);
    }
    if (field.column === "currency" && !/^[A-Z]{3}$/.test(result)) {
      throw new ApiInputError(`${field.input} must be a 3-letter uppercase code`);
    }
    return result;
  }
  if (field.kind === "uuid") {
    if (typeof value !== "string" || !UUID.test(value)) {
      throw new ApiInputError(`${field.input} must be a UUID`);
    }
    return value;
  }
  if (field.kind === "decimal") {
    const result = typeof value === "number" ? String(value) : value;
    if (typeof result !== "string" || !DECIMAL.test(result)) {
      throw new ApiInputError(`${field.input} must be a non-negative decimal`);
    }
    return result;
  }
  if (field.kind === "integer") {
    const result = typeof value === "number" ? value : Number(value);
    if (
      !Number.isInteger(result) ||
      (field.min !== undefined && result < field.min) ||
      (field.max !== undefined && result > field.max)
    ) {
      throw new ApiInputError(`${field.input} is invalid`);
    }
    return result;
  }
  if (field.kind === "date") {
    if (typeof value !== "string" || !DATE.test(value) || !isISODate(value)) {
      throw new ApiInputError(`${field.input} must be an ISO date`);
    }
    return value;
  }
  if (field.kind === "datetime") {
    if (typeof value !== "string" || Number.isNaN(Date.parse(value))) {
      throw new ApiInputError(`${field.input} must be an ISO date-time`);
    }
    return value;
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ApiInputError(`${field.input} must be an object`);
  }
  return value as Record<string, unknown>;
}

export function parseMutation(
  body: Record<string, unknown>,
  resource: HqResource,
  create: boolean,
): Record<string, unknown> {
  const fields = new Map(resource.fields.map((field) => [field.input, field]));
  const unknown = Object.keys(body).filter((key) => !fields.has(key));
  if (unknown.length) throw new ApiInputError(`Unknown fields: ${unknown.join(", ")}`);
  const row: Record<string, unknown> = {};
  for (const field of resource.fields) {
    const supplied = Object.prototype.hasOwnProperty.call(body, field.input);
    if (!supplied) {
      if (create && field.required && field.fallback === undefined) {
        throw new ApiInputError(`${field.input} is required`);
      }
      if (create && field.fallback !== undefined) row[field.column] = field.fallback;
      continue;
    }
    row[field.column] = parseValue(body[field.input], field);
  }
  return row;
}

async function authorize(capability: StudioCapability) {
  const auth = await requireStudioUser({ capability });
  return "error" in auth ? auth.error : auth;
}

export async function listResource(request: NextRequest, resource: HqResource) {
  const auth = await authorize(resource.readCapability);
  if (auth instanceof Response) return auth;
  const { limit, offset } = pageParams(request);
  const sb = createAdminClient();
  let query = sb
    .from(resource.table)
    .select(resource.listSelect || resource.select || "*", { count: "exact" })
    .order(resource.orderBy || "created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  for (const [param, column] of Object.entries(resource.filters || {})) {
    const value = request.nextUrl.searchParams.get(param)?.trim();
    if (value) query = query.eq(column, value);
  }
  const search = request.nextUrl.searchParams.get("q")?.trim().replace(/[%_,()]/g, " ").slice(0, 100);
  if (search && resource.searchColumns?.length) {
    query = query.or(resource.searchColumns.map((column) => `${column}.ilike.%${search}%`).join(","));
  }
  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ items: data || [], total: count || 0, limit, offset });
}

export async function createResource(request: NextRequest, resource: HqResource) {
  const auth = await authorize(resource.writeCapability);
  if (auth instanceof Response) return auth;
  try {
    const row = parseMutation(await readJsonObject(request), resource, true);
    row.created_by = auth.id;
    const sb = createAdminClient();
    const { data, error } = await sb.from(resource.table).insert(row).select(resource.select || "*").single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    const inserted: unknown = data;
    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: `${resource.singular}.create`,
      entity: resource.table,
      entityId:
        inserted &&
        typeof inserted === "object" &&
        "id" in inserted &&
        typeof inserted.id === "string"
          ? inserted.id
          : null,
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

export async function getResource(id: string, resource: HqResource) {
  const auth = await authorize(resource.readCapability);
  if (auth instanceof Response) return auth;
  const { data, error } = await createAdminClient()
    .from(resource.table)
    .select(resource.select || "*")
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ error: `${resource.singular} not found` }, { status: 404 });
  return NextResponse.json(data);
}

export async function updateResource(request: NextRequest, id: string, resource: HqResource) {
  const auth = await authorize(resource.writeCapability);
  if (auth instanceof Response) return auth;
  try {
    const patch = parseMutation(await readJsonObject(request), resource, false);
    if (!Object.keys(patch).length) throw new ApiInputError("No fields to update");
    patch.updated_at = new Date().toISOString();
    const sb = createAdminClient();
    const { data, error } = await sb
      .from(resource.table)
      .update(patch)
      .eq("id", id)
      .select(resource.select || "*")
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    if (!data) return NextResponse.json({ error: `${resource.singular} not found` }, { status: 404 });
    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: `${resource.singular}.update`,
      entity: resource.table,
      entityId: id,
    });
    return NextResponse.json(data);
  } catch (error) {
    return apiError(error);
  }
}
