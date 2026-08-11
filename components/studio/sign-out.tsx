"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { useStudioI18n } from "@/lib/studio/i18n";
import { studioPath } from "@/lib/studio/path";

export function StudioSignOut({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const { t } = useStudioI18n();
  const label = t("common.signOut");
  return (
    <button
      type="button"
      className={compact ? "st-icon-btn" : "st-btn"}
      aria-label={label}
      title={label}
      onClick={async () => {
        const sb = createBrowserSupabaseClient();
        await sb.auth.signOut();
        router.replace(studioPath("/login"));
        router.refresh();
      }}
    >
      {compact ? <LogOut size={16} aria-hidden /> : label}
    </button>
  );
}
