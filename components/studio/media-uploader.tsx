"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useStudioI18n } from "@/lib/studio/i18n";

export function MediaUploader() {
  const router = useRouter();
  const { t } = useStudioI18n();
  const [alt, setAlt] = useState("");
  const [msg, setMsg] = useState("");

  async function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setMsg(t("media.uploading"));
    const fd = new FormData();
    fd.set("file", file);
    fd.set("alt", alt);
    const res = await fetch("/api/studio/media", { method: "POST", body: fd });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      setMsg(data.error || t("media.failed"));
      return;
    }
    setMsg(t("media.uploaded", { path: data.path }));
    setAlt("");
    router.refresh();
  }

  return (
    <div className="st-form" style={{ maxWidth: 480 }}>
      <label className="st-label">
        {t("media.alt")}
        <input className="st-input" value={alt} onChange={(e) => setAlt(e.target.value)} />
      </label>
      <label className="st-label">
        {t("media.file")}
        <input className="st-input" type="file" accept="image/*,video/*" onChange={onChange} />
      </label>
      {msg ? <p className="st-ok">{msg}</p> : null}
    </div>
  );
}
