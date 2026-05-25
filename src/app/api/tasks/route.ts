import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const caseId = searchParams.get("caseId");
    const assigneeId = searchParams.get("assigneeId");

    const where: Record<string, unknown> = {};
    if (caseId) where.caseId = caseId;
    if (assigneeId) where.assigneeId = assigneeId;

    const tasks = await prisma.task.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ tasks, total: tasks.length });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const task = await prisma.task.create({
      data: {
        title: body.title,
        description: body.description || null,
        status: body.status || "PENDING",
        priority: body.priority || "Medium",
        dueDate: body.dueDate ? new Date(body.dueDate) : null,
        caseId: body.caseId || null,
        assigneeId: body.assigneeId || null,
      },
    });
    return NextResponse.json({ success: true, task }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create task",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
