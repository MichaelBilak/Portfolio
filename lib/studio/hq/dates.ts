import type { ISODate, ISODateTime } from "./types";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export function isISODate(value: unknown): value is ISODate {
  if (typeof value !== "string" || !ISO_DATE_PATTERN.test(value)) return false;
  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

export function toISODate(value: Date): ISODate {
  if (Number.isNaN(value.getTime())) throw new Error("Cannot convert invalid date");
  return value.toISOString().slice(0, 10);
}

export function toISODateTime(value: Date): ISODateTime {
  if (Number.isNaN(value.getTime())) throw new Error("Cannot convert invalid date");
  return value.toISOString();
}

export function compareISODate(left: ISODate, right: ISODate): number {
  if (!isISODate(left) || !isISODate(right)) throw new Error("Expected valid ISO dates");
  return left.localeCompare(right);
}

export function daysBetween(left: ISODate, right: ISODate): number {
  if (!isISODate(left) || !isISODate(right)) throw new Error("Expected valid ISO dates");
  const leftMs = Date.parse(`${left}T00:00:00.000Z`);
  const rightMs = Date.parse(`${right}T00:00:00.000Z`);
  return Math.round((rightMs - leftMs) / 86_400_000);
}

export function isPastDue(dueDate: ISODate | null, today: ISODate, completed = false): boolean {
  return Boolean(dueDate && !completed && compareISODate(dueDate, today) < 0);
}
