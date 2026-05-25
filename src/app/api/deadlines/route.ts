import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get("caseId");

    const where: Record<string, unknown> = {};
    if (caseId) where.caseId = caseId;

    const deadlines = await prisma.deadline.findMany({
      where,
      orderBy: { dueDate: "asc" },
    });
    return NextResponse.json({ deadlines, total: deadlines.length });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch deadlines" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const deadline = await prisma.deadline.create({
      data: {
        title: body.title,
        description: body.description || null,
        dueDate: new Date(body.dueDate),
        reminder: body.reminder !== false,
        caseId: body.caseId,
      },
    });
    return NextResponse.json({ success: true, deadline }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create deadline",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
