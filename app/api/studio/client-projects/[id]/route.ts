import { NextRequest } from "next/server";
import { getResource, updateResource } from "@/lib/studio/hq/resource-api";
import { clientProjectResource } from "@/lib/studio/hq/resources";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  return getResource((await context.params).id, clientProjectResource);
}

export async function PATCH(request: NextRequest, context: Context) {
  return updateResource(request, (await context.params).id, clientProjectResource);
}

export const PUT = PATCH;
