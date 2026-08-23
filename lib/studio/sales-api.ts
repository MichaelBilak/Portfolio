import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { apiError, ApiInputError, pageParams, readJsonObject } from "@/lib/studio/api";
import {
  requireStudioUser,
  type StudioCapability,
  type StudioProfile,
} from "@/lib/studio/auth";
import { recordStudioMutation } from "@/lib/studio/audit";

type FieldKind =
  | "string"
  | "uuid"
  | "number"
  | "integer"
  | "boolean"
  | "date"
  | "object"
  | "stringArray";

export type SalesField = {
  column: string;
  aliases?: readonly string[];
  kind: FieldKind;
  required?: boolean;
  nullable?: boolean;
  maxLength?: number;
  allowed?: readonly string[];
  min?: number;
  max?: number;
  defaultValue?: string | number | boolean | Record<string, unknown>;
};

export type SalesResource = {
  table: string;
  singular: string;
  readCapability: StudioCapability;
  writeCapability: StudioCapability;
  fields: readonly SalesField[];
  searchColumns?: readonly string[];
  filterColumns?: Readonly<Record<string, string>>;
  orderBy?: string;
  select?: string;
  listSelect?: string;
  actorColumn?: string;
  validateCreate?: (row: Readonly<Record<string, unknown>>) => void;
  prepareMutation?: (row: Record<string, unknown>, create: boolean) => Record<string, unknown>;
};

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function fieldKeys(field: SalesField) {
  return [field.column, ...(field.aliases || [])];
}

function suppliedValue(body: Record<string, unknown>, field: SalesField) {
  for (const key of fieldKeys(field)) {
    if (Object.prototype.hasOwnProperty.call(body, key)) return body[key];
  }
  return undefined;
}

function parseField(value: unknown, field: SalesField): unknown {
  const label = field.aliases?.[0] || field.column;
  if (value === null || value === "") {
    if (field.nullable) return null;
    throw new ApiInputError(`${label} cannot be empty`);
  }

  switch (field.kind) {
    case "string": {
      if (typeof value !== "string" || !value.trim()) {
        throw new ApiInputError(`${label} must be a non-empty string`);
      }
      const result = value.trim();
      if (result.length > (field.maxLength || 5000)) {
        throw new ApiInputError(`${label} is too long`);
      }
      if (field.allowed && !field.allowed.includes(result)) {
        throw new ApiInputError(`${label} is invalid`);
      }
      return result;
    }
    case "uuid":
      if (typeof value !== "string" || !UUID_PATTERN.test(value)) {
        throw new ApiInputError(`${label} must be a UUID`);
      }
      return value;
    case "number": {
      const result = typeof value === "number" ? value : Number(value);
      if (!Number.isFinite(result)) throw new ApiInputError(`${label} must be a number`);
      if (field.min !== undefined && result < field.min) {
        throw new ApiInputError(`${label} must be at least ${field.min}`);
      }
      if (field.max !== undefined && result > field.max) {
        throw new ApiInputError(`${label} must be at most ${field.max}`);
      }
      return result;
    }
    case "integer": {
      const result = typeof value === "number" ? value : Number(value);
      if (!Number.isInteger(result)) throw new ApiInputError(`${label} must be an integer`);
      if (field.min !== undefined && result < field.min) {
        throw new ApiInputError(`${label} must be at least ${field.min}`);
      }
      if (field.max !== undefined && result > field.max) {
        throw new ApiInputError(`${label} must be at most ${field.max}`);
      }
      return result;
    }
    case "boolean":
      if (typeof value !== "boolean") throw new ApiInputError(`${label} must be a boolean`);
      return value;
    case "date": {
      if (typeof value !== "string" || !value.trim() || Number.isNaN(Date.parse(value))) {
        throw new ApiInputError(`${label} must be a valid date`);
      }
      return value;
    }
    case "object":
      if (!value || typeof value !== "object" || Array.isArray(value)) {
        throw new ApiInputError(`${label} must be an object`);
      }
      return value as Record<string, unknown>;
    case "stringArray":
      if (!Array.isArray(value) || !value.every((item) => typeof item === "string")) {
        throw new ApiInputError(`${label} must be an array of strings`);
      }
      return value.map((item) => item.trim()).filter(Boolean);
  }
}

function mutationFromBody(
  body: Record<string, unknown>,
  resource: SalesResource,
  create: boolean,
) {
  const allowed = new Set(resource.fields.flatMap(fieldKeys));
  const unknownKeys = Object.keys(body).filter((key) => !allowed.has(key));
  if (unknownKeys.length) {
    throw new ApiInputError(`Unknown fields: ${unknownKeys.join(", ")}`);
  }

  const row: Record<string, unknown> = {};
  for (const field of resource.fields) {
    const value = suppliedValue(body, field);
    if (value === undefined) {
      if (create && field.required && field.defaultValue === undefined) {
        throw new ApiInputError(`${field.aliases?.[0] || field.column} is required`);
      }
      if (create && field.defaultValue !== undefined) row[field.column] = field.defaultValue;
      continue;
    }
    row[field.column] = parseField(value, field);
  }
  return row;
}

function getRowId(value: unknown): string | null {
  if (!value || typeof value !== "object" || !("id" in value)) return null;
  return typeof value.id === "string" ? value.id : null;
}

async function authenticate(
  capability: StudioCapability,
): Promise<StudioProfile | Response> {
  const auth = await requireStudioUser({ capability });
  return "error" in auth ? auth.error : auth;
}

export async function listSalesResource(request: NextRequest, resource: SalesResource) {
  const auth = await authenticate(resource.readCapability);
  if (auth instanceof Response) return auth;

  try {
    const { limit, offset } = pageParams(request);
    const sb = createAdminClient();
    let query = sb
      .from(resource.table)
      .select(resource.listSelect || resource.select || "*", { count: "exact" })
      .order(resource.orderBy || "created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const rawSearch = request.nextUrl.searchParams.get("q")?.trim();
    if (rawSearch && resource.searchColumns?.length) {
      const term = rawSearch.replace(/[%_,()]/g, " ").slice(0, 100);
      query = query.or(resource.searchColumns.map((column) => `${column}.ilike.%${term}%`).join(","));
    }

    for (const [param, column] of Object.entries(resource.filterColumns || {})) {
      const value = request.nextUrl.searchParams.get(param)?.trim();
      if (value) query = query.eq(column, value);
    }

    const { data, error, count } = await query;
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    return NextResponse.json({ items: data || [], total: count || 0, limit, offset });
  } catch (error) {
    return apiError(error);
  }
}

export async function createSalesResource(request: NextRequest, resource: SalesResource) {
  const auth = await authenticate(resource.writeCapability);
  if (auth instanceof Response) return auth;

  try {
    const body = await readJsonObject(request);
    let row = mutationFromBody(body, resource, true);
    row = resource.prepareMutation?.(row, true) ?? row;
    resource.validateCreate?.(row);
    if (resource.actorColumn) row[resource.actorColumn] = auth.id;
    const sb = createAdminClient();
    const { data, error } = await sb
      .from(resource.table)
      .insert(row)
      .select(resource.select || "*")
      .single();
    if (error) return NextResponse.json({ error: error.message }, { status: 400 });
    await recordStudioMutation(sb, {
      actorId: auth.id,
      action: `${resource.singular}.create`,
      entity: resource.table,
      entityId: getRowId(data),
    });
    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    return apiError(error);
  }
}

export async function getSalesResource(
  id: string,
  resource: SalesResource,
) {
  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "id must be a UUID" }, { status: 400 });
  }
  const auth = await authenticate(resource.readCapability);
  if (auth instanceof Response) return auth;

  const sb = createAdminClient();
  const { data, error } = await sb
    .from(resource.table)
    .select(resource.select || "*")
    .eq("id", id)
    .maybeSingle();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  if (!data) return NextResponse.json({ error: `${resource.singular} not found` }, { status: 404 });
  return NextResponse.json(data);
}

export async function updateSalesResource(
  request: NextRequest,
  id: string,
  resource: SalesResource,
) {
  if (!UUID_PATTERN.test(id)) {
    return NextResponse.json({ error: "id must be a UUID" }, { status: 400 });
  }
  const auth = await authenticate(resource.writeCapability);
  if (auth instanceof Response) return auth;

  try {
    const body = await readJsonObject(request);
    let patch = mutationFromBody(body, resource, false);
    patch = resource.prepareMutation?.(patch, false) ?? patch;
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
