import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !key) throw new Error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
const sb = createClient(url, key, { auth: { persistSession: false } });

function isoDate(offset: number) {
  return new Date(Date.now() + offset * 86_400_000).toISOString().slice(0, 10);
}

async function ownerId() {
  const { data, error } = await sb.from("profiles").select("id").eq("role", "owner").limit(1).maybeSingle();
  if (error) throw error;
  if (!data) throw new Error("Create an owner profile before seeding HQ.");
  return data.id;
}

async function company(name: string, row: Record<string, unknown>, actor: string) {
  const existing = await sb.from("companies").select("id").eq("name", name).maybeSingle();
  if (existing.error) throw existing.error;
  if (existing.data) return existing.data.id;
  const created = await sb.from("companies").insert({ name, ...row, created_by: actor, owner_id: actor }).select("id").single();
  if (created.error) throw created.error;
  return created.data.id;
}

async function product(sku: string, name: string, price: number, actor: string) {
  const result = await sb.from("products").upsert({
    sku, name, description: `${name} delivered by DormUp Studio`, kind: "service",
    unit_price: price, currency: "EUR", active: true, created_by: actor,
  }, { onConflict: "sku" }).select("id").single();
  if (result.error) throw result.error;
  return result.data.id;
}

async function deal(title: string, row: Record<string, unknown>, actor: string) {
  const existing = await sb.from("deals").select("id").eq("title", title).maybeSingle();
  if (existing.error) throw existing.error;
  if (existing.data) return existing.data.id;
  const created = await sb.from("deals").insert({ title, ...row, created_by: actor, owner_id: actor }).select("id").single();
  if (created.error) throw created.error;
  return created.data.id;
}

async function main() {
  const actor = await ownerId();
  console.info("Seeding DormUp HQ demo data…");

  const companyRows = [
    ["Studio Traduco", { industry: "Legal services", city: "Rimini", country: "Italy", status: "active_client", website: "https://studio-traduco.example" }],
    ["Doloni Documenti", { industry: "Document services", city: "Bologna", country: "Italy", status: "active_client" }],
    ["Rimini Property Group", { industry: "Real estate", city: "Rimini", country: "Italy", status: "active_client" }],
    ["EduBridge Italia", { industry: "Admissions consulting", city: "Milan", country: "Italy", status: "active_client" }],
  ] as const;
  const companies = new Map<string, string>();
  for (const [name, row] of companyRows) companies.set(name, await company(name, row, actor));

  const contacts = [
    ["Studio Traduco", "Volodymyr", "Rossi", "Founder", "volodymyr@traduco.example"],
    ["Doloni Documenti", "Elena", "Doloni", "Operations Director", "elena@doloni.example"],
    ["Rimini Property Group", "Marco", "Bianchi", "Managing Partner", "marco@rpg.example"],
    ["EduBridge Italia", "Sara", "Conti", "Admissions Lead", "sara@edubridge.example"],
  ] as const;
  for (const [companyName, firstName, lastName, role, email] of contacts) {
    const companyId = companies.get(companyName);
    const existing = await sb.from("contacts").select("id").eq("company_id", companyId).eq("email", email).maybeSingle();
    if (existing.error) throw existing.error;
    if (!existing.data) {
      const inserted = await sb.from("contacts").insert({ company_id: companyId, first_name: firstName, last_name: lastName, job_title: role, email, is_primary: true, created_by: actor });
      if (inserted.error) throw inserted.error;
    }
  }

  const products = new Map<string, string>();
  for (const [sku, name, price] of [
    ["LEGAL-OS", "Legal Operations System", 3500],
    ["ADMISSIONS-OS", "Admissions Operations System", 4200],
    ["CRM", "Custom CRM", 2800],
    ["WEBSITE", "Business Website", 1400],
    ["AI-INTAKE", "AI Intake Assistant", 950],
    ["SUPPORT", "Support Plan", 180],
  ] as const) products.set(sku, await product(sku, name, price, actor));

  const leadRows = [
    ["Hotel Adriatico", "Hotel", "Rimini", "new", 7, 2400, "Booking automation"],
    ["Agency X Italia", "Marketing agency", "Pesaro", "contacted", 6, 1800, "Internal CRM"],
    ["LexPoint Consulting", "Legal consulting", "Bologna", "replied", 8, 3600, "Legal Operations System"],
    ["CampusWay", "Education", "Milan", "discovery", 8, 4200, "Admissions Operations System"],
    ["Casa Verde Realty", "Real estate", "Ravenna", "researching", 5, 2200, "Lead CRM"],
    ["Rimini Dental Lab", "Healthcare", "Rimini", "qualified", 9, 3000, "Client Portal"],
    ["Nord Import SRL", "Logistics", "Parma", "contacted", 5, 1700, "Operations dashboard"],
    ["Forma Italia", "Training", "Florence", "new", 6, 2500, "Admissions CRM"],
    ["Studio Ferri", "Accounting", "Cesena", "replied", 7, 2800, "Document portal"],
    ["Blu Marina", "Hospitality", "Rimini", "researching", 4, 1400, "Website"],
    ["VisaPath Europe", "Immigration", "Rome", "qualified", 9, 4800, "Case operations system"],
    ["Adriatica Rentals", "Property management", "Rimini", "discovery", 8, 3200, "Owner portal"],
  ] as const;
  for (const [business, category, city, leadStatus, score, value, offer] of leadRows) {
    const existing = await sb.from("leads").select("id").eq("business_name", business).eq("source", "hq_demo").maybeSingle();
    if (existing.error) throw existing.error;
    if (!existing.data) {
      const inserted = await sb.from("leads").insert({
        business_name: business, business_type: category, category, city, country: "Italy",
        status: leadStatus,
        lead_score: score, estimated_deal_value: value, estimated_value: value,
        recommended_offer: offer, source: "hq_demo", priority: score >= 8 ? "high" : "normal",
        assignee_id: actor, next_follow_up_at: isoDate(score >= 8 ? 1 : 4),
      });
      if (inserted.error) throw inserted.error;
    }
  }

  const dealDefinitions = [
    ["Studio Traduco — Legal OS", "Studio Traduco", "LEGAL-OS", "won", "won", 3500, 100, -20, "Create implementation project"],
    ["Doloni — Document CRM", "Doloni Documenti", "CRM", "negotiation", "open", 2900, 80, 8, "Confirm implementation date"],
    ["Rimini Property — Website", "Rimini Property Group", "WEBSITE", "proposal", "open", 1600, 60, 14, "Follow up on proposal"],
    ["EduBridge — Admissions OS", "EduBridge Italia", "ADMISSIONS-OS", "won", "won", 4400, 100, -35, "Start discovery"],
    ["Traduco — AI Intake", "Studio Traduco", "AI-INTAKE", "qualified", "open", 950, 40, 21, "Schedule demo"],
    ["Doloni — Support", "Doloni Documenti", "SUPPORT", "discovery", "open", 2160, 30, 28, "Define support scope"],
  ] as const;
  const deals = new Map<string, string>();
  for (const [title, companyName, sku, stage, status, value, probability, closeOffset, nextAction] of dealDefinitions) {
    deals.set(title, await deal(title, {
      company_id: companies.get(companyName), product_id: products.get(sku), stage, status, value,
      currency: "EUR", probability, expected_close_date: isoDate(closeOffset),
      closed_at: status === "won" ? new Date().toISOString() : null,
      next_action: nextAction, next_action_date: isoDate(Math.max(1, Math.floor(closeOffset / 2))),
      source: "hq_demo",
    }, actor));
  }

  const projectDefinitions = [
    ["Studio Traduco Legal OS Production", "Studio Traduco — Legal OS", "Studio Traduco", "development", "green", 62, 3500, 56, 38, 28, 18],
    ["EduBridge Admissions OS", "EduBridge — Admissions OS", "EduBridge Italia", "testing", "yellow", 82, 4400, 72, 68, 30, 6],
    ["Doloni CRM Discovery", null, "Doloni Documenti", "waiting_client", "yellow", 25, 2900, 48, 14, 28, 10],
    ["Rimini Property Website", null, "Rimini Property Group", "design", "green", 35, 1600, 30, 9, 25, 16],
  ] as const;
  const projects = new Map<string, string>();
  for (const [name, dealName, companyName, status, health, progress, soldPrice, estimatedHours, actualHours, cost, dueOffset] of projectDefinitions) {
    const existing = await sb.from("client_projects").select("id").eq("name", name).maybeSingle();
    if (existing.error) throw existing.error;
    if (existing.data) { projects.set(name, existing.data.id); continue; }
    const created = await sb.from("client_projects").insert({
      name, deal_id: dealName ? deals.get(dealName) : null, company_id: companies.get(companyName),
      status, health, progress, sold_price: soldPrice, budget: soldPrice, currency: "EUR",
      estimated_hours: estimatedHours, actual_hours: actualHours, internal_hourly_cost: cost,
      start_date: isoDate(-30), target_date: isoDate(dueOffset), owner_id: actor, created_by: actor,
    }).select("id").single();
    if (created.error) throw created.error;
    projects.set(name, created.data.id);
  }

  const milestoneNames = ["Discovery", "Architecture", "Auth", "CRM", "Documents", "Portal", "Automations", "QA", "Deployment", "Training", "Launch"];
  const traducoProject = projects.get("Studio Traduco Legal OS Production");
  if (traducoProject) {
    for (const [index, title] of milestoneNames.entries()) {
      const exists = await sb.from("project_milestones").select("id").eq("project_id", traducoProject).eq("title", title).maybeSingle();
      if (!exists.data) {
        const inserted = await sb.from("project_milestones").insert({ project_id: traducoProject, title, status: index < 4 ? "completed" : index === 4 ? "in_progress" : "pending", due_date: isoDate(index * 4 - 16), sort_order: index, created_by: actor });
        if (inserted.error) throw inserted.error;
      }
    }
  }

  const taskTitles = [
    "Follow up with Doloni", "Send proposal to Rimini Property", "Review Traduco feedback",
    "Prepare EduBridge training", "Invoice Studio Traduco", "Finish Documents module",
    "Confirm Doloni data fields", "QA admissions workflow", "Review project profitability",
    "Schedule CampusWay discovery", "Research Hotel Adriatico stack", "Update client timeline",
    "Collect Rimini Property assets", "Draft AI Intake scope", "Plan next week delivery",
  ];
  for (const [index, title] of taskTitles.entries()) {
    const exists = await sb.from("tasks").select("id").eq("title", title).maybeSingle();
    if (!exists.data) {
      const inserted = await sb.from("tasks").insert({
        title, status: index === 6 ? "blocked" : index === 2 ? "waiting" : "todo",
        priority: index < 3 ? "urgent" : index < 8 ? "high" : "normal",
        assignee_id: actor, due_at: new Date(Date.now() + (index - 3) * 86_400_000).toISOString(),
        client_project_id: index % 2 ? projects.get("Studio Traduco Legal OS Production") : projects.get("EduBridge Admissions OS"),
        estimated_minutes: 30 + (index % 4) * 15, created_by: actor,
      });
      if (inserted.error) throw inserted.error;
    }
  }

  for (const [index, companyName] of ["Studio Traduco", "Doloni Documenti", "Rimini Property Group", "EduBridge Italia", "Studio Traduco"].entries()) {
    const invoiceNumber = `HQ-DEMO-2026-${String(index + 1).padStart(3, "0")}`;
    const companyId = companies.get(companyName);
    const exists = await sb.from("invoices").select("id").eq("invoice_number", invoiceNumber).maybeSingle();
    if (!exists.data) {
      const total = [1750, 1450, 800, 2200, 900][index];
      const inserted = await sb.from("invoices").insert({
        invoice_number: invoiceNumber, company_id: companyId, issue_date: isoDate(-index * 8),
        due_date: isoDate(index === 1 ? -3 : 10 + index * 4), subtotal: total, total,
        amount_paid: index === 0 ? total : 0, status: index === 0 ? "paid" : index === 1 ? "overdue" : "sent",
        currency: "EUR", created_by: actor,
      });
      if (inserted.error) throw inserted.error;
    }
  }

  const paidInvoice = await sb.from("invoices").select("id,company_id,total,currency").eq("invoice_number", "HQ-DEMO-2026-001").maybeSingle();
  if (paidInvoice.data) {
    const existingPayment = await sb.from("payments").select("id").eq("invoice_id", paidInvoice.data.id).maybeSingle();
    if (!existingPayment.data) {
      const payment = await sb.from("payments").insert({
        invoice_id: paidInvoice.data.id,
        company_id: paidInvoice.data.company_id,
        amount: paidInvoice.data.total,
        currency: paidInvoice.data.currency || "EUR",
        status: "succeeded",
        method: "bank_transfer",
        paid_at: new Date().toISOString(),
        created_by: actor,
      });
      if (payment.error) throw payment.error;
    }
  }

  for (const [companyName, sku, name, amount, interval] of [
    ["Studio Traduco", "SUPPORT", "Studio Traduco Support", 180, "month"],
    ["Doloni Documenti", "SUPPORT", "Doloni Care", 240, "month"],
    ["EduBridge Italia", "SUPPORT", "EduBridge Annual Support", 1800, "year"],
  ] as const) {
    const companyId = companies.get(companyName);
    const exists = await sb.from("subscriptions").select("id").eq("company_id", companyId).eq("name", name).maybeSingle();
    if (!exists.data) {
      const inserted = await sb.from("subscriptions").insert({
        company_id: companyId, product_id: products.get(sku), name, amount, currency: "EUR",
        interval, interval_count: 1, status: "active", started_on: isoDate(-60),
        next_billing_date: isoDate(15), created_by: actor,
      });
      if (inserted.error) throw inserted.error;
    }
  }

  console.info("DormUp HQ demo data is ready.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
