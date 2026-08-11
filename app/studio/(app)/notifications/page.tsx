import { redirect } from "next/navigation";
import { studioPath } from "@/lib/studio/path";

export default function StudioNotificationsPage() {
  redirect(studioPath("/inbox"));
}
