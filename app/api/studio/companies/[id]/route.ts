import { NextRequest } from "next/server";
import { getSalesResource, updateSalesResource } from "@/lib/studio/sales-api";
import { companiesResource } from "@/lib/studio/sales-resources";

type Context = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: Context) {
  const { id } = await context.params;
  return getSalesResource(id, companiesResource);
}

export async function PATCH(request: NextRequest, context: Context) {
  const { id } = await context.params;
  return updateSalesResource(request, id, companiesResource);
}

export const PUT = PATCH;
