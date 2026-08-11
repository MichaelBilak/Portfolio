import { NextRequest, NextResponse } from "next/server";

export class ApiInputError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ApiInputError";
  }
}

export async function readJsonObject(request: NextRequest): Promise<Record<string, unknown>> {
  const raw = await request.text();
  if (!raw.trim()) return {};
  try {
    const value: unknown = JSON.parse(raw);
    if (!value || typeof value !== "object" || Array.isArray(value)) {
      throw new ApiInputError("JSON object required");
    }
    return value as Record<string, unknown>;
  } catch (error) {
    if (error instanceof ApiInputError) throw error;
    throw new ApiInputError("Invalid JSON");
  }
}

export function requiredString(
  value: unknown,
  name: string,
  maxLength = 500,
): string {
  if (typeof value !== "string" || !value.trim()) {
    throw new ApiInputError(`${name} is required`);
  }
  const result = value.trim();
  if (result.length > maxLength) throw new ApiInputError(`${name} is too long`);
  return result;
}

export function optionalString(
  value: unknown,
  name: string,
  maxLength = 5000,
): string | null | undefined {
  if (value === undefined) return undefined;
  if (value === null || value === "") return null;
  if (typeof value !== "string") throw new ApiInputError(`${name} must be a string`);
  const result = value.trim();
  if (result.length > maxLength) throw new ApiInputError(`${name} is too long`);
  return result || null;
}

export function optionalUuid(value: unknown, name: string): string | null | undefined {
  const result = optionalString(value, name, 36);
  if (result && !/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(result)) {
    throw new ApiInputError(`${name} must be a UUID`);
  }
  return result;
}

export function oneOf<T extends string>(
  value: unknown,
  name: string,
  allowed: readonly T[],
  fallback?: T,
): T | undefined {
  if (value === undefined && fallback !== undefined) return fallback;
  if (value === undefined) return undefined;
  if (typeof value !== "string" || !allowed.includes(value as T)) {
    throw new ApiInputError(`${name} is invalid`);
  }
  return value as T;
}

export function positiveInteger(value: unknown, name: string, max: number): number {
  const number = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(number) || number <= 0 || number > max) {
    throw new ApiInputError(`${name} must be between 1 and ${max}`);
  }
  return number;
}

export function pageParams(request: NextRequest) {
  const requestedLimit = Number(request.nextUrl.searchParams.get("limit") || 50);
  const requestedOffset = Number(request.nextUrl.searchParams.get("offset") || 0);
  return {
    limit: Number.isFinite(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 100) : 50,
    offset: Number.isFinite(requestedOffset) ? Math.max(requestedOffset, 0) : 0,
  };
}

export function apiError(error: unknown) {
  if (error instanceof ApiInputError) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  console.error(error);
  return NextResponse.json({ error: "Internal server error" }, { status: 500 });
}
