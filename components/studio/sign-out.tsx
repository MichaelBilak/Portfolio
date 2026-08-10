"use client";

import { useRouter } from "next/navigation";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";

export function StudioSignOut() {
  const router = useRouter();
  return (
    <button
      type="button"
      className="st-btn"
      onClick={async () => {
        const sb = createBrowserSupabaseClient();
        await sb.auth.signOut();
        router.replace("/studio/login");
        router.refresh();
      }}
    >
      Sign out
    </button>
  );
}
