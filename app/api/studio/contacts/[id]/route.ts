import { NextRequest } from "next/server";
import { getSalesResource, updateSalesResource } from "@/lib/studio/sales-api";
import { contactsResource } from "@/lib/studio/sales-resources";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const { id } = await context.params;
  return getSalesResource(id, contactsResource);
}

export async function PATCH(request: NextRequest, context: Context) {
  const { id } = await context.params;
  return updateSalesResource(request, id, contactsResource);
}

export const PUT = PATCH;
