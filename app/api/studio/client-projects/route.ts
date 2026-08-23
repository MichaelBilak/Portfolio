import { NextRequest } from "next/server";
import { createResource, listResource } from "@/lib/studio/hq/resource-api";
import { clientProjectResource } from "@/lib/studio/hq/resources";

export function GET(request: NextRequest) {
  return listResource(request, clientProjectResource);
}

export function POST(request: NextRequest) {
  return createResource(request, clientProjectResource);
}
