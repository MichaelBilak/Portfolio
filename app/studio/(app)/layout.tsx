import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getStudioSession } from "@/lib/studio/auth";
import { studioPath } from "@/lib/studio/path";
import { StudioNavigation } from "@/components/studio/studio-navigation";
import { StudioI18nProvider } from "@/lib/studio/i18n";

export const dynamic = "force-dynamic";

export default async function StudioAppLayout({ children }: { children: ReactNode }) {
  const user = await getStudioSession();
  if (!user) redirect(studioPath("/login"));

  return (
    <StudioI18nProvider initialLocale={user.adminLocale}>
      <div className="st-shell">
        <StudioNavigation email={user.email} role={user.role} />
        <main className="st-main">{children}</main>
      </div>
    </StudioI18nProvider>
  );
}
