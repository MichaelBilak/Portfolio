import { NextRequest } from "next/server";
import { createSalesResource, listSalesResource } from "@/lib/studio/sales-api";
import { productsResource } from "@/lib/studio/sales-resources";

export function GET(request: NextRequest) {
  return listSalesResource(request, productsResource);
}

export function POST(request: NextRequest) {
  return createSalesResource(request, productsResource);
}
