import { redirect } from "next/navigation";
import type { ReactNode } from "react";
import { getStudioSession } from "@/lib/studio/auth";
import { studioPath } from "@/lib/studio/path";
import { StudioNavigation } from "@/components/studio/studio-navigation";
import { StudioTopbar } from "@/components/studio/studio-topbar";
import { StudioToastProvider } from "@/components/studio/ui";
import { StudioI18nProvider } from "@/lib/studio/i18n";

export const dynamic = "force-dynamic";

export default async function StudioAppLayout({ children }: { children: ReactNode }) {
  const user = await getStudioSession();
  if (!user) redirect(studioPath("/login"));

  return (
    <StudioI18nProvider initialLocale={user.adminLocale}>
      <StudioToastProvider>
      <div className="st-shell">
        <StudioNavigation email={user.email} role={user.role} />
        <div className="st-workspace">
          <StudioTopbar
            quickCreateItems={[
              { label: "Lead", href: studioPath("/leads?create=1") },
              { label: "Deal", href: studioPath("/deals?create=1") },
              { label: "Company", href: studioPath("/companies?create=1") },
              { label: "Project", href: studioPath("/projects?create=1") },
              { label: "Task", href: studioPath("/tasks?create=1") },
              { label: "Invoice", href: studioPath("/invoices?create=1") },
            ]}
          />
          <main className="st-main">{children}</main>
        </div>
      </div>
      </StudioToastProvider>
    </StudioI18nProvider>
  );
}
