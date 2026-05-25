import { handlers } from "@/lib/auth";
import type { NextRequest } from "next/server";

const handler = handlers;

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ nextauth: string[] }> }
) {
  return handler.GET(request);
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ nextauth: string[] }> }
) {
  return handler.POST(request);
}
