import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = Promise<{ id: string }>;

export async function PUT(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.reviewItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Review item not found" },
        { status: 404 }
      );
    }

    const item = await prisma.reviewItem.update({
      where: { id },
      data: { status: body.status },
    });

    return NextResponse.json({ success: true, item });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update review item",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
