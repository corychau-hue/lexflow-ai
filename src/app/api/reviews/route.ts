import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const items = await prisma.reviewItem.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ items });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch review items" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const item = await prisma.reviewItem.create({
      data: {
        title: body.title,
        type: body.type,
        status: body.status || "PENDING_REVIEW",
        caseId: body.caseId || null,
        clientName: body.clientName || null,
        details: body.details || null,
      },
    });
    return NextResponse.json({ success: true, item }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create review item",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
