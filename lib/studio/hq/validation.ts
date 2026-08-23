import { isISODate } from "./dates";
import { assertCurrencyCode, assertDecimalString } from "./money";

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; errors: Record<string, string> };

export function isEnumValue<const T extends readonly string[]>(
  values: T,
  value: unknown,
): value is T[number] {
  return typeof value === "string" && values.includes(value);
}

export function requiredText(value: unknown, field: string, maxLength = 500): string {
  if (typeof value !== "string" || !value.trim()) throw new Error(`${field} is required`);
  const result = value.trim();
  if (result.length > maxLength) throw new Error(`${field} must be at most ${maxLength} characters`);
  return result;
}

export function optionalText(
  value: unknown,
  field: string,
  maxLength = 2_000,
): string | null {
  if (value == null || value === "") return null;
  if (typeof value !== "string") throw new Error(`${field} must be text`);
  const result = value.trim();
  if (result.length > maxLength) throw new Error(`${field} must be at most ${maxLength} characters`);
  return result || null;
}

export function currencyCode(value: unknown): string {
  if (typeof value !== "string") throw new Error("currency must be text");
  assertCurrencyCode(value);
  return value;
}

export function nonNegativeDecimal(value: unknown, field: string): string {
  if (typeof value !== "string") throw new Error(`${field} must be a decimal string`);
  assertDecimalString(value);
  if (value.startsWith("-")) throw new Error(`${field} cannot be negative`);
  return value;
}

export function optionalISODate(value: unknown, field: string): string | null {
  if (value == null || value === "") return null;
  if (!isISODate(value)) throw new Error(`${field} must be a valid YYYY-MM-DD date`);
  return value;
}

export function validateDateRange(
  start: string | null,
  end: string | null,
  startField = "startDate",
  endField = "endDate",
): void {
  if (start && end && start > end) {
    throw new Error(`${endField} cannot be before ${startField}`);
  }
}

export function collectValidation<T>(validator: () => T): ValidationResult<T> {
  try {
    return { ok: true, value: validator() };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid input";
    const field = message.split(" ", 1)[0] || "input";
    return { ok: false, errors: { [field]: message } };
  }
}
