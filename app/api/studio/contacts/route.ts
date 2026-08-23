import { NextRequest } from "next/server";
import { createSalesResource, listSalesResource } from "@/lib/studio/sales-api";
import { contactsResource } from "@/lib/studio/sales-resources";

export function GET(request: NextRequest) {
  return listSalesResource(request, contactsResource);
}

export function POST(request: NextRequest) {
  return createSalesResource(request, contactsResource);
}
