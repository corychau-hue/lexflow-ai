import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const cases = await prisma.case.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ cases, total: cases.length });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch cases" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const caseItem = await prisma.case.create({
      data: {
        caseName: body.caseName,
        practiceArea: body.practiceArea,
        caseType: body.caseType || "",
        description: body.description || null,
        clientId: body.clientId,
        assignedUserId: body.assignedUserId || null,
        createdById: body.createdById || null,
      },
    });
    return NextResponse.json({ success: true, case: caseItem }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create case",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
