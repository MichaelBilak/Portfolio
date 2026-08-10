"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { studioPath } from "@/lib/studio/path";

export function StudioSignOut({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  return (
    <button
      type="button"
      className={compact ? "st-icon-btn" : "st-btn"}
      aria-label="Выйти"
      title="Выйти"
      onClick={async () => {
        const sb = createBrowserSupabaseClient();
        await sb.auth.signOut();
        router.replace(studioPath("/login"));
        router.refresh();
      }}
    >
      {compact ? <LogOut size={16} aria-hidden /> : "Выйти"}
    </button>
  );
}
