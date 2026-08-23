"use client";

import { useState } from "react";
import { LoaderCircle, Plus, X } from "lucide-react";
import { studioPath } from "@/lib/studio/path";

export function CreateLead({ autoOpen = false }: { autoOpen?: boolean }) {
  const [open, setOpen] = useState(autoOpen);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError("");
    const values = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/studio/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        businessName: values.businessName,
        fullName: values.contactPerson,
        contactPerson: values.contactPerson,
        contactRole: values.contactRole,
        email: values.email,
        phone: values.phone,
        category: values.category,
        city: values.city,
        country: values.country,
        status: values.status,
        leadScore: values.leadScore ? Number(values.leadScore) : undefined,
        estimatedDealValue: values.estimatedDealValue ? Number(values.estimatedDealValue) : undefined,
        currency: values.currency,
        recommendedOffer: values.recommendedOffer,
        nextFollowUpAt: values.nextFollowUpAt ? new Date(String(values.nextFollowUpAt)).toISOString() : null,
        source: "manual",
      }),
    });
    const payload: unknown = await response.json().catch(() => null);
    if (!response.ok) {
      setError(payload && typeof payload === "object" && "error" in payload ? String((payload as { error: unknown }).error) : "Could not create lead");
      setSaving(false);
      return;
    }
    const id = payload && typeof payload === "object" && "id" in payload ? String((payload as { id: unknown }).id) : "";
    window.location.href = id ? studioPath(`/leads/${id}`) : studioPath("/leads");
  }

  return <>
    <div className="st-hq-inline-action"><button className="st-btn primary" onClick={() => setOpen(true)}><Plus size={15} /> New lead</button></div>
    {open ? <div className="st-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}><section className="st-modal" role="dialog" aria-modal="true"><button className="st-icon-btn st-modal-close" onClick={() => setOpen(false)}><X size={16} /></button><h2>New lead</h2><form className="st-form" onSubmit={submit}><div className="st-form-grid"><label className="st-label"><span>Company</span><input className="st-input" name="businessName" required /></label><label className="st-label"><span>Category</span><input className="st-input" name="category" /></label><label className="st-label"><span>Contact person</span><input className="st-input" name="contactPerson" /></label><label className="st-label"><span>Role</span><input className="st-input" name="contactRole" /></label><label className="st-label"><span>Email</span><input className="st-input" type="email" name="email" required /></label><label className="st-label"><span>Phone / WhatsApp</span><input className="st-input" name="phone" /></label><label className="st-label"><span>City</span><input className="st-input" name="city" /></label><label className="st-label"><span>Country</span><input className="st-input" name="country" defaultValue="Italy" /></label><label className="st-label"><span>Status</span><select className="st-select" name="status" defaultValue="new"><option value="new">New</option><option value="researching">Researching</option><option value="contacted">Contacted</option><option value="replied">Replied</option><option value="discovery">Discovery</option><option value="qualified">Qualified</option></select></label><label className="st-label"><span>Lead score (0–10)</span><input className="st-input" type="number" min="0" max="10" name="leadScore" /></label><label className="st-label"><span>Potential value</span><input className="st-input" type="number" min="0" step="0.01" name="estimatedDealValue" /></label><label className="st-label"><span>Currency</span><input className="st-input" name="currency" defaultValue="EUR" maxLength={3} /></label><label className="st-label"><span>Recommended offer</span><input className="st-input" name="recommendedOffer" /></label><label className="st-label"><span>Next follow-up</span><input className="st-input" type="datetime-local" name="nextFollowUpAt" /></label></div>{error ? <p className="st-error">{error}</p> : null}<button className="st-btn primary" disabled={saving}>{saving ? <LoaderCircle className="st-spin" size={15} /> : <Plus size={15} />} Create lead</button></form></section></div> : null}
  </>;
}
