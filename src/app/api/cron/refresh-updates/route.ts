import { NextResponse } from "next/server";
import { fetchAllLiveUpdates } from "@/lib/immigration-updates";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET() {
  try {
    console.log("[Cron] Starting immigration updates refresh...");
    const data = await fetchAllLiveUpdates();
    console.log(`[Cron] Refresh complete: ${data.items.length} items fetched`);
    return NextResponse.json({
      success: true,
      itemsCount: data.items.length,
      sourceStatus: data.sourceStatus,
      fetchedAt: data.fetchedAt,
    });
  } catch (err) {
    console.error("[Cron] Refresh failed:", err);
    return NextResponse.json(
      { success: false, message: "Refresh failed" },
      { status: 500 }
    );
  }
}
