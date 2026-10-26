/**
 * Narrow CMS content sync for the release positioning.
 *
 * Does NOT run studio:seed. Does not touch projects, leads, redirects,
 * site_settings, seo_defaults, CRM tables, or unrelated settings.
 * Never bulk-deletes service tiers. Never changes existing slugs or prices.
 *
 * Usage (from the repo root):
 *   npm run cms:sync -- --snapshot     # read-only local anchor
 *   npm run cms:sync                   # dry-run, no writes
 *   npm run cms:sync -- --apply        # writes only if the host is NOT production
 *   npm run cms:sync -- --rollback     # restores the snapshot; same write guard
 *
 * Production writes are refused unless CMS_SYNC_ALLOW_PRODUCTION=yes.
 * Do not set that flag for this release. If the configured database is the
 * snapshotted production host, stop and follow the cutover notes below.
 *
 * Cutover (when preview uses the same database as production):
 *   1. Keep this script in dry-run. Do not pass --apply.
 *   2. Deploy the site only to a preview URL whose public traffic is not production.
 *      The app treats snapshot-matching CMS rows as stale and renders static copy.
 *      Production stays unchanged until that deployment.
 *   3. Take a Supabase backup / point-in-time copy before any content write.
 *   4. Apply this sync only after the owner confirms the backup.
 *      Preferred: restore the backup into a separate Supabase project, point a
 *      local env file at THAT host, then run --apply there and review the site.
 *   5. Rollback on that host: npm run cms:sync -- --rollback
 *      Restores snapshotted site_copy, service i18n, tier labels, sort_order and icon.
 *      Services inserted by the sync are unpublished, not deleted.
 *      Tiers are never deleted. Slugs and prices are never rewritten.
 *
 * Do not regenerate baseline.snapshot.json after --apply or after manual edits.
 * That file is the conflict anchor for this release.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { servicesMeta } from "../data/services";
import {
  SERVICE_BASE_PRICES,
  SERVICE_MONTHLY,
  SERVICE_TIERS,
  type ServiceId,
} from "../data/pricing";
import { approvedSectionData, approvedServicePayload } from "../lib/cms/approved-copy";
import {
  sectionHash,
  serviceI18nHash,
  serviceI18nPayload,
  tierCopyHash,
} from "../lib/cms/content-hash";
import { translations, type Locale, type LocalizedService } from "../lib/translations";

const LOCALES: Locale[] = ["it", "en", "fr", "ru", "de", "es"];
const COPY_SECTIONS = [
  "nav",
  "hero",
  "trust",
  "servicesLabel",
  "servicesLead",
  "problem",
  "caseStudies",
  "impact",
  "audit",
  "processSection",
  "about",
  "aboutPage",
  "contact",
  "orderPage",
  "pricingAddons",
  "servicesPage",
  "servicePage",
  "workPage",
  "footer",
  "privacyPage",
  "langSelector",
] as const;

const KNOWN_PRODUCTION_HOST = "bcfebgxfuneruzljivwv.supabase.co";
const SNAPSHOT_PATH = path.join(process.cwd(), "scripts", "cms-sync", "baseline.snapshot.json");

const ICONS: Record<string, string> = {
  visibility: "Search",
  "premium-site": "Monitor",
  "photo-video": "Video",
  "booking-flow": "CalendarCheck",
  "digital-growth": "ChartColumnIncreasing",
  "monthly-support": "Wrench",
  redesign: "RefreshCw",
};

type CopySection = (typeof COPY_SECTIONS)[number];

interface SnapshotCopy {
  hash: string;
  updatedAt: string | null;
  data: unknown;
}

interface SnapshotI18n {
  hash: string;
  fields: ReturnType<typeof serviceI18nPayload>;
}

interface SnapshotTier {
  rowId: string;
  tierId: string;
  price: number;
  i18n: Record<string, { hash: string; name: string; detail: string }>;
}

interface SnapshotService {
  rowId: string;
  serviceId: string;
  slug: string;
  sortOrder: number;
  icon: string;
  imagePath: string;
  basePrice: number;
  isMonthly: boolean;
  published: boolean;
  i18n: Record<string, SnapshotI18n>;
  tiers: SnapshotTier[];
}

interface Snapshot {
  purpose: "pre-migration-anchor";
  capturedAt: string;
  databaseHost: string;
  note: string;
  siteCopy: Record<string, Record<string, SnapshotCopy>>;
  services: SnapshotService[];
}

interface LiveService {
  rowId: string;
  serviceId: string;
  slug: string;
  sortOrder: number;
  icon: string;
  imagePath: string;
  basePrice: number;
  isMonthly: boolean;
  published: boolean;
  i18n: Record<string, ReturnType<typeof serviceI18nPayload>>;
  tiers: Array<{
    rowId: string;
    tierId: string;
    price: number;
    i18n: Record<string, { name: string; detail: string }>;
  }>;
}

type PlanItem =
  | { kind: "unchanged"; target: string }
  | { kind: "conflict"; target: string; detail: string }
  | { kind: "update-copy"; locale: Locale; section: CopySection }
  | { kind: "insert-copy"; locale: Locale; section: CopySection }
  | { kind: "insert-service"; serviceId: string }
  | { kind: "update-order"; serviceId: string; from: number; to: number }
  | { kind: "update-icon"; serviceId: string; from: string; to: string }
  | { kind: "update-i18n"; serviceId: string; locale: Locale }
  | { kind: "insert-i18n"; serviceId: string; locale: Locale }
  | { kind: "update-tier-i18n"; serviceId: string; tierId: string; locale: Locale; rowId: string }
  | { kind: "insert-tier-i18n"; serviceId: string; tierId: string; locale: Locale; rowId: string }
  | { kind: "insert-tiers"; serviceId: string };

function hostFromUrl(url: string): string {
  return new URL(url).host;
}

function clientFromEnv(): { client: SupabaseClient; host: string } {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY. No write was attempted.");
  }
  return {
    host: hostFromUrl(url),
    client: createClient(url, key, { auth: { persistSession: false } }),
  };
}

function readSnapshot(): Snapshot {
  return JSON.parse(readFileSync(SNAPSHOT_PATH, "utf8")) as Snapshot;
}

function desiredSection(locale: Locale, section: CopySection): unknown {
  return approvedSectionData(locale, section);
}

function desiredI18n(copy: LocalizedService) {
  return approvedServicePayload(copy);
}

async function readLive(client: SupabaseClient): Promise<{
  siteCopy: Map<string, { data: unknown; updatedAt: string | null }>;
  services: LiveService[];
}> {
  const copy = await client.from("site_copy").select("locale, section, data, updated_at");
  if (copy.error) throw new Error(`site_copy read failed: ${copy.error.message}`);
  const services = await client
    .from("services")
    .select("id, service_id, slug, sort_order, icon, image_path, published, base_price, is_monthly");
  if (services.error) throw new Error(`services read failed: ${services.error.message}`);
  const i18n = await client.from("service_i18n").select("*");
  if (i18n.error) throw new Error(`service_i18n read failed: ${i18n.error.message}`);
  const tiers = await client
    .from("service_tiers")
    .select("id, service_id, tier_id, price, monthly, featured, sort_order");
  if (tiers.error) throw new Error(`service_tiers read failed: ${tiers.error.message}`);
  const tierI18n = await client.from("service_tier_i18n").select("tier_id, locale, name, detail");
  if (tierI18n.error) throw new Error(`service_tier_i18n read failed: ${tierI18n.error.message}`);

  const siteCopy = new Map<string, { data: unknown; updatedAt: string | null }>();
  for (const row of copy.data ?? []) {
    siteCopy.set(`${row.locale}:${row.section}`, {
      data: row.data,
      updatedAt: row.updated_at ? String(row.updated_at) : null,
    });
  }

  const liveServices: LiveService[] = (services.data ?? []).map((row) => {
    const rowId = String(row.id);
    const relatedI18n = (i18n.data ?? []).filter((item) => String(item.service_id) === rowId);
    const i18nMap: LiveService["i18n"] = {};
    for (const item of relatedI18n) {
      i18nMap[String(item.locale)] = serviceI18nPayload(item);
    }
    const relatedTiers = (tiers.data ?? []).filter((item) => String(item.service_id) === rowId);
    return {
      rowId,
      serviceId: String(row.service_id),
      slug: String(row.slug),
      sortOrder: Number(row.sort_order),
      icon: String(row.icon ?? ""),
      imagePath: String(row.image_path ?? ""),
      basePrice: Number(row.base_price),
      isMonthly: Boolean(row.is_monthly),
      published: row.published !== false,
      i18n: i18nMap,
      tiers: relatedTiers.map((tier) => {
        const labels: Record<string, { name: string; detail: string }> = {};
        for (const label of tierI18n.data ?? []) {
          if (String(label.tier_id) !== String(tier.id)) continue;
          labels[String(label.locale)] = {
            name: String(label.name ?? ""),
            detail: String(label.detail ?? ""),
          };
        }
        return {
          rowId: String(tier.id),
          tierId: String(tier.tier_id),
          price: Number(tier.price),
          i18n: labels,
        };
      }),
    };
  });

  return { siteCopy, services: liveServices };
}

function buildSnapshot(
  host: string,
  live: Awaited<ReturnType<typeof readLive>>,
): Snapshot {
  const siteCopy: Snapshot["siteCopy"] = {};
  for (const [key, row] of live.siteCopy) {
    const [locale, section] = key.split(":");
    if (!COPY_SECTIONS.includes(section as CopySection)) continue;
    siteCopy[locale] ??= {};
    siteCopy[locale][section] = {
      hash: sectionHash(row.data),
      updatedAt: row.updatedAt,
      data: row.data,
    };
  }

  const services: SnapshotService[] = live.services.map((service) => ({
    rowId: service.rowId,
    serviceId: service.serviceId,
    slug: service.slug,
    sortOrder: service.sortOrder,
    icon: service.icon,
    imagePath: service.imagePath,
    basePrice: service.basePrice,
    isMonthly: service.isMonthly,
    published: service.published,
    i18n: Object.fromEntries(
      Object.entries(service.i18n).map(([locale, fields]) => [
        locale,
        { hash: serviceI18nHash(fields), fields },
      ]),
    ),
    tiers: service.tiers.map((tier) => ({
      rowId: tier.rowId,
      tierId: tier.tierId,
      price: tier.price,
      i18n: Object.fromEntries(
        Object.entries(tier.i18n).map(([locale, label]) => [
          locale,
          { hash: tierCopyHash(label), name: label.name, detail: label.detail },
        ]),
      ),
    })),
  }));

  return {
    purpose: "pre-migration-anchor",
    capturedAt: new Date().toISOString(),
    databaseHost: host,
    note: "Conflict anchor captured before the release sync. Do not regenerate after apply or after manual CMS edits.",
    siteCopy,
    services,
  };
}

function findBaselineService(snapshot: Snapshot, serviceId: string) {
  return snapshot.services.find((service) => service.serviceId === serviceId);
}

function buildPlan(snapshot: Snapshot, live: Awaited<ReturnType<typeof readLive>>): PlanItem[] {
  const plan: PlanItem[] = [];
  const liveById = new Map(live.services.map((service) => [service.serviceId, service]));

  for (const locale of LOCALES) {
    for (const section of COPY_SECTIONS) {
      const target = `site_copy ${locale}/${section}`;
      const current = live.siteCopy.get(`${locale}:${section}`);
      const desired = desiredSection(locale, section);
      const desiredHash = sectionHash(desired);
      const baseline = snapshot.siteCopy[locale]?.[section];
      if (!current) {
        plan.push({ kind: "insert-copy", locale, section });
        continue;
      }
      const liveHash = sectionHash(current.data);
      if (liveHash === desiredHash) {
        plan.push({ kind: "unchanged", target });
        continue;
      }
      if (!baseline || liveHash !== baseline.hash) {
        plan.push({
          kind: "conflict",
          target,
          detail: "Live copy differs from the pre-migration anchor. Skipped.",
        });
        continue;
      }
      plan.push({ kind: "update-copy", locale, section });
    }
  }

  for (const [index, meta] of servicesMeta.entries()) {
    const serviceId = meta.id;
    const current = liveById.get(serviceId);
    const baseline = findBaselineService(snapshot, serviceId);
    if (!current) {
      if (serviceId === "visibility" || serviceId === "digital-growth") {
        plan.push({ kind: "insert-service", serviceId });
        plan.push({ kind: "insert-tiers", serviceId });
      } else {
        plan.push({
          kind: "conflict",
          target: `service ${serviceId}`,
          detail: "Expected existing service is missing. Not recreated.",
        });
      }
      continue;
    }

    if (current.slug !== meta.slug) {
      plan.push({
        kind: "conflict",
        target: `service ${serviceId} slug`,
        detail: `Slug ${current.slug} is kept. Static slug ${meta.slug} was not written.`,
      });
    }

    const baselineOrder = baseline?.sortOrder;
    if (current.sortOrder !== index) {
      if (baseline && baselineOrder !== current.sortOrder) {
        plan.push({
          kind: "conflict",
          target: `service ${serviceId} sort_order`,
          detail: "Sort order changed since the anchor. Skipped.",
        });
      } else {
        plan.push({ kind: "update-order", serviceId, from: current.sortOrder, to: index });
      }
    }

    const desiredIcon = ICONS[serviceId] || current.icon;
    if (current.icon !== desiredIcon) {
      if (baseline && baseline.icon !== current.icon) {
        plan.push({
          kind: "conflict",
          target: `service ${serviceId} icon`,
          detail: "Icon changed since the anchor. Skipped.",
        });
      } else {
        plan.push({ kind: "update-icon", serviceId, from: current.icon, to: desiredIcon });
      }
    }

    for (const locale of LOCALES) {
      const copy = translations[locale].services.find((service) => service.id === serviceId);
      if (!copy) continue;
      const desired = desiredI18n(copy);
      const desiredHash = serviceI18nHash(desired);
      const liveFields = current.i18n[locale];
      const target = `service_i18n ${serviceId}/${locale}`;
      if (!liveFields) {
        plan.push({ kind: "insert-i18n", serviceId, locale });
        continue;
      }
      const liveHash = serviceI18nHash(liveFields);
      if (liveHash === desiredHash) {
        plan.push({ kind: "unchanged", target });
        continue;
      }
      const anchor = baseline?.i18n[locale];
      if (!anchor || liveHash !== anchor.hash) {
        plan.push({
          kind: "conflict",
          target,
          detail: "Live translation differs from the anchor. Skipped.",
        });
        continue;
      }
      plan.push({ kind: "update-i18n", serviceId, locale });
    }

    for (const tier of current.tiers) {
      for (const locale of LOCALES) {
        const copy = translations[locale].services.find((service) => service.id === serviceId);
        const tierCopy = copy?.pricingTiers?.find((item) => item.tierId === tier.tierId);
        if (!tierCopy) continue;
        const target = `service_tier_i18n ${serviceId}/${tier.tierId}/${locale}`;
        const liveLabel = tier.i18n[locale];
        if (!liveLabel) {
          plan.push({
            kind: "insert-tier-i18n",
            serviceId,
            tierId: tier.tierId,
            locale,
            rowId: tier.rowId,
          });
          continue;
        }
        const liveHash = tierCopyHash(liveLabel);
        const desiredHash = tierCopyHash(tierCopy);
        if (liveHash === desiredHash) {
          plan.push({ kind: "unchanged", target });
          continue;
        }
        const anchor = baseline?.tiers
          .find((item) => item.tierId === tier.tierId)
          ?.i18n[locale];
        if (!anchor || liveHash !== anchor.hash) {
          plan.push({
            kind: "conflict",
            target,
            detail: "Live tier label differs from the anchor. Price was not touched.",
          });
          continue;
        }
        plan.push({
          kind: "update-tier-i18n",
          serviceId,
          tierId: tier.tierId,
          locale,
          rowId: tier.rowId,
        });
      }
    }
  }

  return plan;
}

function printPlan(plan: PlanItem[]) {
  const interesting = plan.filter((item) => item.kind !== "unchanged");
  const unchanged = plan.length - interesting.length;
  console.log(`Unchanged records: ${unchanged}`);
  if (!interesting.length) {
    console.log("No records would change.");
    return;
  }
  for (const item of interesting) {
    if (item.kind === "conflict") {
      console.log(`CONFLICT  ${item.target} — ${item.detail}`);
      continue;
    }
    if (item.kind === "update-copy" || item.kind === "insert-copy") {
      console.log(`${item.kind.toUpperCase()}  site_copy ${item.locale}/${item.section}`);
      continue;
    }
    if (item.kind === "update-order") {
      console.log(`UPDATE-ORDER  service ${item.serviceId} ${item.from} -> ${item.to}`);
      continue;
    }
    if (item.kind === "update-icon") {
      console.log(`UPDATE-ICON  service ${item.serviceId} ${item.from} -> ${item.to}`);
      continue;
    }
    if (item.kind === "insert-service") {
      console.log(`INSERT-SERVICE  ${item.serviceId} (new row, six locales, existing slug/price rules do not apply)`);
      continue;
    }
    if (item.kind === "insert-tiers") {
      console.log(`INSERT-TIERS  ${item.serviceId} (only when that service has no tiers)`);
      continue;
    }
    if (item.kind === "update-i18n" || item.kind === "insert-i18n") {
      console.log(`${item.kind.toUpperCase()}  ${item.serviceId}/${item.locale}`);
      continue;
    }
    console.log(`${item.kind.toUpperCase()}  ${item.serviceId}/${item.tierId}/${item.locale}`);
  }
}

function assertWritesAllowed(host: string, snapshot: Snapshot) {
  const blocked = new Set([snapshot.databaseHost, KNOWN_PRODUCTION_HOST]);
  if (blocked.has(host) && process.env.CMS_SYNC_ALLOW_PRODUCTION !== "yes") {
    console.error("");
    console.error("STOP. Refusing to write.");
    console.error(`Database host ${host} is the snapshotted production database.`);
    console.error("No separate preview database is configured in this environment.");
    console.error("The public site was not modified. Follow the cutover notes in scripts/cms-content-sync.ts.");
    process.exit(3);
  }
}

async function applyPlan(
  client: SupabaseClient,
  plan: PlanItem[],
  live: Awaited<ReturnType<typeof readLive>>,
) {
  const conflicts = plan.filter((item) => item.kind === "conflict");
  const liveById = new Map(live.services.map((service) => [service.serviceId, service]));

  for (const item of plan) {
    if (item.kind === "update-copy" || item.kind === "insert-copy") {
      const { error } = await client.from("site_copy").upsert(
        {
          locale: item.locale,
          section: item.section,
          data: desiredSection(item.locale, item.section),
          updated_at: new Date().toISOString(),
        },
        { onConflict: "locale,section" },
      );
      if (error) throw new Error(`site_copy ${item.locale}/${item.section}: ${error.message}`);
    }

    if (item.kind === "insert-service") {
      const meta = servicesMeta.find((service) => service.id === item.serviceId);
      if (!meta) continue;
      const serviceId = item.serviceId as ServiceId;
      const created = await client
        .from("services")
        .insert({
          service_id: item.serviceId,
          slug: meta.slug,
          sort_order: servicesMeta.findIndex((service) => service.id === item.serviceId),
          icon: ICONS[item.serviceId] || "Monitor",
          image_path: meta.image,
          published: true,
          base_price: SERVICE_BASE_PRICES[serviceId],
          is_monthly: Boolean(SERVICE_MONTHLY[serviceId]),
          updated_at: new Date().toISOString(),
        })
        .select("id")
        .single();
      if (created.error) throw new Error(`insert ${item.serviceId}: ${created.error.message}`);
      for (const locale of LOCALES) {
        const copy = translations[locale].services.find((service) => service.id === item.serviceId);
        if (!copy) continue;
        const { error } = await client.from("service_i18n").upsert(
          { service_id: created.data.id, locale, ...desiredI18n(copy) },
          { onConflict: "service_id,locale" },
        );
        if (error) throw new Error(`i18n ${item.serviceId}/${locale}: ${error.message}`);
      }
    }

    if (item.kind === "update-order" || item.kind === "update-icon") {
      const current = liveById.get(item.serviceId);
      if (!current) continue;
      const patch =
        item.kind === "update-order"
          ? { sort_order: item.to, updated_at: new Date().toISOString() }
          : { icon: item.to, updated_at: new Date().toISOString() };
      const { error } = await client.from("services").update(patch).eq("id", current.rowId);
      if (error) throw new Error(`service ${item.serviceId}: ${error.message}`);
    }

    if (item.kind === "update-i18n" || item.kind === "insert-i18n") {
      const current = liveById.get(item.serviceId);
      if (!current) continue;
      const copy = translations[item.locale].services.find((service) => service.id === item.serviceId);
      if (!copy) continue;
      const { error } = await client.from("service_i18n").upsert(
        {
          service_id: current.rowId,
          locale: item.locale,
          ...desiredI18n(copy),
        },
        { onConflict: "service_id,locale" },
      );
      if (error) throw new Error(`i18n ${item.serviceId}/${item.locale}: ${error.message}`);
    }

    if (item.kind === "update-tier-i18n" || item.kind === "insert-tier-i18n") {
      const copy = translations[item.locale].services.find((service) => service.id === item.serviceId);
      const tierCopy = copy?.pricingTiers?.find((tier) => tier.tierId === item.tierId);
      if (!tierCopy) continue;
      const { error } = await client.from("service_tier_i18n").upsert(
        {
          tier_id: item.rowId,
          locale: item.locale,
          name: tierCopy.name,
          detail: tierCopy.detail,
        },
        { onConflict: "tier_id,locale" },
      );
      if (error) throw new Error(`tier i18n ${item.serviceId}: ${error.message}`);
    }

    if (item.kind === "insert-tiers") {
      const inserted = await client
        .from("services")
        .select("id")
        .eq("service_id", item.serviceId)
        .maybeSingle();
      if (inserted.error || !inserted.data) {
        throw new Error(`Could not read inserted service ${item.serviceId}`);
      }
      const existingTiers = await client
        .from("service_tiers")
        .select("id")
        .eq("service_id", inserted.data.id);
      if (existingTiers.error) throw new Error(existingTiers.error.message);
      if ((existingTiers.data ?? []).length > 0) continue;
      const tiers = SERVICE_TIERS[item.serviceId as ServiceId] || [];
      for (const [tierIndex, tier] of tiers.entries()) {
        const created = await client
          .from("service_tiers")
          .insert({
            service_id: inserted.data.id,
            tier_id: tier.tierId,
            price: tier.price,
            monthly: Boolean(tier.monthly),
            featured: Boolean(tier.featured),
            sort_order: tierIndex,
          })
          .select("id")
          .single();
        if (created.error) throw new Error(created.error.message);
        for (const locale of LOCALES) {
          const copy = translations[locale].services.find((service) => service.id === item.serviceId);
          const tierCopy = copy?.pricingTiers?.find((itemTier) => itemTier.tierId === tier.tierId);
          const label = await client.from("service_tier_i18n").upsert(
            {
              tier_id: created.data.id,
              locale,
              name: tierCopy?.name || tier.tierId,
              detail: tierCopy?.detail || "",
            },
            { onConflict: "tier_id,locale" },
          );
          if (label.error) throw new Error(label.error.message);
        }
      }
    }
  }

  if (conflicts.length) {
    console.error(`Completed non-conflicting writes. ${conflicts.length} conflicts were skipped.`);
    process.exitCode = 2;
  }
}

async function rollback(client: SupabaseClient, snapshot: Snapshot, live: Awaited<ReturnType<typeof readLive>>) {
  for (const [locale, sections] of Object.entries(snapshot.siteCopy)) {
    for (const [section, row] of Object.entries(sections)) {
      const { error } = await client.from("site_copy").upsert(
        {
          locale,
          section,
          data: row.data,
          updated_at: row.updatedAt ?? new Date().toISOString(),
        },
        { onConflict: "locale,section" },
      );
      if (error) throw new Error(`rollback site_copy ${locale}/${section}: ${error.message}`);
    }
  }

  const known = new Set(snapshot.services.map((service) => service.serviceId));
  for (const service of snapshot.services) {
    const { error } = await client
      .from("services")
      .update({ sort_order: service.sortOrder, icon: service.icon })
      .eq("id", service.rowId);
    if (error) throw new Error(`rollback service ${service.serviceId}: ${error.message}`);

    for (const [locale, i18n] of Object.entries(service.i18n)) {
      const { error: i18nError } = await client.from("service_i18n").upsert(
        { service_id: service.rowId, locale, ...i18n.fields },
        { onConflict: "service_id,locale" },
      );
      if (i18nError) throw new Error(i18nError.message);
    }

    for (const tier of service.tiers) {
      for (const [locale, label] of Object.entries(tier.i18n)) {
        const { error: tierError } = await client.from("service_tier_i18n").upsert(
          { tier_id: tier.rowId, locale, name: label.name, detail: label.detail },
          { onConflict: "tier_id,locale" },
        );
        if (tierError) throw new Error(tierError.message);
      }
    }
  }

  for (const service of live.services) {
    if (known.has(service.serviceId)) continue;
    if (service.serviceId !== "visibility" && service.serviceId !== "digital-growth") continue;
    const { error } = await client.from("services").update({ published: false }).eq("id", service.rowId);
    if (error) throw new Error(`rollback unpublish ${service.serviceId}: ${error.message}`);
    console.log(`UNPUBLISH  ${service.serviceId} (inserted after the anchor; not deleted)`);
  }
  console.log("Rollback writes finished. Tiers, slugs, prices, projects, leads and redirects were not deleted.");
}

async function main() {
  const args = new Set(process.argv.slice(2));
  const selected = ["--snapshot", "--apply", "--rollback", "--dry-run"].filter((flag) => args.has(flag));
  if (selected.length > 1) {
    throw new Error(`Choose one mode. Received ${selected.join(", ")}`);
  }
  const mode = selected[0] ?? "--dry-run";
  const { client, host } = clientFromEnv();
  console.log(`CMS sync mode ${mode}`);
  console.log(`Database host ${host}`);
  console.log("Reads catalog copy only. Projects, leads, redirects and CRM are not queried.");

  const live = await readLive(client);

  if (mode === "--snapshot") {
    const snapshot = buildSnapshot(host, live);
    mkdirSync(path.dirname(SNAPSHOT_PATH), { recursive: true });
    writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);
    console.log(`Wrote read-only snapshot: ${SNAPSHOT_PATH}`);
    console.log(`site_copy locales: ${Object.keys(snapshot.siteCopy).join(", ") || "(none)"}`);
    console.log(`services: ${snapshot.services.map((service) => service.serviceId).join(", ") || "(none)"}`);
    console.log("No database writes.");
    return;
  }

  const snapshot = readSnapshot();
  const plan = buildPlan(snapshot, live);
  printPlan(plan);
  if (mode === "--dry-run") {
    console.log("Dry-run only. No database writes.");
    return;
  }

  assertWritesAllowed(host, snapshot);
  if (mode === "--rollback") {
    await rollback(client, snapshot, live);
    return;
  }
  await applyPlan(client, plan, live);
  console.log("Apply finished.");
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(message);
  process.exit(1);
});
