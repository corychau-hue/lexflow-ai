import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ leads, total: leads.length });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const lead = await prisma.lead.create({
      data: {
        firstName: body.firstName || "",
        lastName: body.lastName || "",
        email: body.email || null,
        phone: body.phone || null,
        practiceArea: body.practiceArea || null,
        status: body.status || "NEW",
        referralSource: body.referralSource || null,
        estimatedValue: body.estimatedValue ? parseFloat(body.estimatedValue) : null,
        notes: body.notes || null,
      },
    });
    return NextResponse.json({ success: true, lead }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create lead",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
