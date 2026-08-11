import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) {
  console.error("Missing Supabase env");
  process.exit(1);
}

const sb = createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });

async function main() {
  const { error: bucketError } = await sb.storage.createBucket("crm-private", { public: false });
  if (bucketError && !/already|exists/i.test(bucketError.message)) {
    console.error(bucketError);
    process.exit(1);
  }

  const { data: buckets } = await sb.storage.listBuckets();
  console.info(
    "buckets:",
    buckets?.map((bucket) => ({ id: bucket.id, public: bucket.public })),
  );

  // PostgREST schema cache can lag after migrations; retry briefly.
  let count: number | null = null;
  let lastError: { message: string } | null = null;
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const result = await sb.from("pipeline_stages").select("*", { count: "exact", head: true });
    if (!result.error) {
      count = result.count;
      lastError = null;
      break;
    }
    lastError = result.error;
    await new Promise((resolve) => setTimeout(resolve, 1500));
  }
  if (lastError) {
    console.error(lastError);
    console.error(
      "If the table is missing, run supabase/migrations/003_crm_backend.sql in the Supabase SQL editor, then retry.",
    );
    process.exit(1);
  }

  if (!count) {
    const { error } = await sb.from("pipeline_stages").upsert(
      [
        { key: "intake", name: "Intake", color: "#64748b", sort_order: 10 },
        { key: "discovery", name: "Discovery", color: "#3b82f6", sort_order: 20 },
        { key: "proposal", name: "Proposal", color: "#8b5cf6", sort_order: 30 },
        { key: "active", name: "Active", color: "#f59e0b", sort_order: 40 },
        { key: "review", name: "Review", color: "#06b6d4", sort_order: 50 },
        {
          key: "completed",
          name: "Completed",
          color: "#22c55e",
          sort_order: 60,
          is_closed: true,
          is_won: true,
        },
        {
          key: "cancelled",
          name: "Cancelled",
          color: "#ef4444",
          sort_order: 70,
          is_closed: true,
          is_won: false,
        },
      ],
      { onConflict: "key" },
    );
    if (error) {
      console.error(error);
      process.exit(1);
    }
    console.info("seeded pipeline stages");
  } else {
    console.info(`pipeline stages already present: ${count}`);
  }
}

main();
