import { NextRequest } from "next/server";
import { updateResource } from "@/lib/studio/hq/resource-api";
import { subscriptionResource } from "@/lib/studio/hq/resources";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  return updateResource(request, (await context.params).id, subscriptionResource);
}

export const PUT = PATCH;
