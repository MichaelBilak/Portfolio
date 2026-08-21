import { notFound } from "next/navigation";
import { CarePage } from "@/components/studio/care-page";
import { getStudioSession, hasStudioCapability } from "@/lib/studio/auth";

export default async function StudioCareRoute() {
  const user = await getStudioSession();
  if (
    !user ||
    (!hasStudioCapability(user.role, "cases.read") &&
      !hasStudioCapability(user.role, "leads.manage"))
  ) {
    notFound();
  }
  return <CarePage />;
}
