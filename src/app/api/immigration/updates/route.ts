import { NextResponse } from "next/server";
import { fetchWithCacheFallback } from "@/lib/immigration-updates";

export const dynamic = "force-dynamic";
export const maxDuration = 30;

export async function GET() {
  try {
    const data = await fetchWithCacheFallback();
    return NextResponse.json({ success: true, ...data });
  } catch (err) {
    console.error("Failed to fetch immigration updates:", err);
    return NextResponse.json(
      { success: false, message: "Failed to fetch updates", items: [], fetchedAt: new Date().toISOString(), sourceStatus: {}, fromCache: true },
      { status: 500 }
    );
  }
}
