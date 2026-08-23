import type { CurrencyCode, DecimalString } from "./types";

const DECIMAL_PATTERN = /^-?(?:0|[1-9]\d*)(?:\.\d+)?$/;
const CURRENCY_PATTERN = /^[A-Z]{3}$/;

export function assertCurrencyCode(value: string): asserts value is CurrencyCode {
  if (!CURRENCY_PATTERN.test(value)) {
    throw new Error(`Invalid ISO 4217 currency code: ${value}`);
  }
}

export function assertDecimalString(value: string): asserts value is DecimalString {
  if (!DECIMAL_PATTERN.test(value)) {
    throw new Error(`Invalid decimal value: ${value}`);
  }
}

export function decimalToMinorUnits(value: DecimalString, scale = 2): bigint {
  assertDecimalString(value);
  if (!Number.isInteger(scale) || scale < 0) throw new Error("Scale must be a non-negative integer");

  const negative = value.startsWith("-");
  const unsigned = negative ? value.slice(1) : value;
  const [whole, fraction = ""] = unsigned.split(".");
  if (fraction.length > scale) {
    throw new Error(`Decimal ${value} has more than ${scale} fractional digits`);
  }

  const units = BigInt(whole) * 10n ** BigInt(scale) + BigInt(fraction.padEnd(scale, "0") || "0");
  return negative ? -units : units;
}

export function minorUnitsToDecimal(value: bigint, scale = 2): DecimalString {
  if (!Number.isInteger(scale) || scale < 0) throw new Error("Scale must be a non-negative integer");

  const negative = value < 0n;
  const absolute = negative ? -value : value;
  if (scale === 0) return `${negative ? "-" : ""}${absolute}`;

  const digits = absolute.toString().padStart(scale + 1, "0");
  const decimal = `${digits.slice(0, -scale)}.${digits.slice(-scale)}`;
  return `${negative ? "-" : ""}${decimal}`;
}

export function addDecimals(values: readonly DecimalString[], scale = 2): DecimalString {
  return minorUnitsToDecimal(
    values.reduce((sum, value) => sum + decimalToMinorUnits(value, scale), 0n),
    scale,
  );
}

export function subtractDecimals(
  minuend: DecimalString,
  subtrahend: DecimalString,
  scale = 2,
): DecimalString {
  return minorUnitsToDecimal(
    decimalToMinorUnits(minuend, scale) - decimalToMinorUnits(subtrahend, scale),
    scale,
  );
}

export function formatMoney(
  amount: DecimalString,
  currency: CurrencyCode,
  locale = "it-IT",
): string {
  assertCurrencyCode(currency);
  const numeric = Number(amount);
  if (!Number.isFinite(numeric)) throw new Error(`Money value cannot be formatted: ${amount}`);
  return new Intl.NumberFormat(locale, { style: "currency", currency }).format(numeric);
}
