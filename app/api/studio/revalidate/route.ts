import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { requireStudioUser } from "@/lib/studio/auth";

export async function POST() {
  const auth = await requireStudioUser({ content: true });
  if ("error" in auth) return auth.error;

  try {
    revalidateTag("cms-catalog");
  } catch {
    /* ignore outside request store edge cases */
  }
  for (const locale of ["it", "en", "fr", "ru", "de", "es"]) {
    revalidatePath(`/${locale}`, "layout");
  }
  revalidatePath("/", "layout");

  return NextResponse.json({ ok: true });
}
