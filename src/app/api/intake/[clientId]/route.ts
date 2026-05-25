import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = Promise<{ clientId: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { clientId } = await params;
    const intake = await prisma.intake.findFirst({
      where: { clientId },
      orderBy: { submittedAt: "desc" },
    });

    if (!intake) {
      return NextResponse.json(
        { success: false, message: "No intake found for this client" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      intake: {
        id: intake.id,
        clientId: intake.clientId,
        formData: intake.formData,
        submittedAt: intake.submittedAt.toISOString(),
      },
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch intake data" },
      { status: 500 }
    );
  }
}
