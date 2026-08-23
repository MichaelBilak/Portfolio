import { addDecimals, decimalToMinorUnits, minorUnitsToDecimal } from "./money";
import type { BillingInterval } from "./enums";
import type { DecimalString } from "./types";

export type PipelineDeal = {
  status: "open" | "won" | "lost";
  value: DecimalString;
  probability: number;
};

export type RecurringAmount = {
  status: "trialing" | "active" | "paused" | "past_due" | "cancelled" | "ended";
  amount: DecimalString;
  interval: BillingInterval;
  intervalCount: number;
};

export function weightedPipelineValue(deals: readonly PipelineDeal[]): DecimalString {
  const weightedMinor = deals
    .filter((deal) => deal.status === "open")
    .reduce((sum, deal) => {
      if (!Number.isInteger(deal.probability) || deal.probability < 0 || deal.probability > 100) {
        throw new Error(`Invalid deal probability: ${deal.probability}`);
      }
      return sum + (decimalToMinorUnits(deal.value) * BigInt(deal.probability)) / 100n;
    }, 0n);
  return minorUnitsToDecimal(weightedMinor);
}

export function openPipelineValue(deals: readonly PipelineDeal[]): DecimalString {
  return addDecimals(deals.filter((deal) => deal.status === "open").map((deal) => deal.value));
}

export function monthlyRecurringRevenue(rows: readonly RecurringAmount[]): DecimalString {
  const monthlyMinor = rows
    .filter((row) => ["trialing", "active", "past_due"].includes(row.status))
    .reduce((sum, row) => {
      if (!Number.isInteger(row.intervalCount) || row.intervalCount <= 0) {
        throw new Error(`Invalid billing interval count: ${row.intervalCount}`);
      }

      const amount = decimalToMinorUnits(row.amount);
      const count = BigInt(row.intervalCount);
      switch (row.interval) {
        case "week":
          return sum + (amount * 52n) / (12n * count);
        case "month":
          return sum + amount / count;
        case "quarter":
          return sum + amount / (3n * count);
        case "year":
          return sum + amount / (12n * count);
      }
    }, 0n);

  return minorUnitsToDecimal(monthlyMinor);
}
