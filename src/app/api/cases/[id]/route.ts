import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = Promise<{ id: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;
    const caseItem = await prisma.case.findUnique({
      where: { id },
      include: {
        tasks: { orderBy: { createdAt: "desc" } },
        deadlines: { orderBy: { dueDate: "asc" } },
        notes: { orderBy: { createdAt: "desc" } },
        documents: { orderBy: { createdAt: "desc" } },
        client: true,
      },
    });
    if (!caseItem) {
      return NextResponse.json(
        { success: false, message: "Case not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, case: caseItem });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch case" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const existing = await prisma.case.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Case not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    const scalarFields = ["caseName", "practiceArea", "caseType", "status", "description", "filingDate", "closingDate", "importance"];
    for (const field of scalarFields) {
      if (body[field] !== undefined) updateData[field] = body[field];
    }

    const caseItem = await prisma.case.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, case: caseItem });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update case",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;
    const existing = await prisma.case.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Case not found" },
        { status: 404 }
      );
    }
    await prisma.case.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Case deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete case" },
      { status: 500 }
    );
  }
}
