import { NextRequest, NextResponse } from "next/server";
import { loadUpdatesFromDb } from "@/lib/immigration-updates";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const formType = request.nextUrl.searchParams.get("formType");
    const all = await loadUpdatesFromDb(100);

    // Filter for form-specific updates (formType is not null)
    const formAlerts = formType
      ? all.filter((item) => item.formType === formType)
      : all.filter((item) => item.formType != null);

    return NextResponse.json({ success: true, items: formAlerts });
  } catch (err) {
    console.error("Failed to fetch form alerts:", err);
    return NextResponse.json(
      { success: false, items: [], message: "Failed to fetch form alerts" },
      { status: 500 }
    );
  }
}
