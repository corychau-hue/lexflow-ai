import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type RouteParams = Promise<{ id: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;
    const client = await prisma.client.findUnique({ where: { id } });
    if (!client) {
      return NextResponse.json(
        { success: false, message: "Client not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, client });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch client" },
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

    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Client not found" },
        { status: 404 }
      );
    }

    const updateData: Record<string, unknown> = {};
    const scalarFields = [
      "firstName", "lastName", "email", "phone", "ssn",
      "addressStreet", "addressCity", "addressState", "addressZip",
      "immigrationStatus", "countryOfBirth", "countryOfCitizenship",
      "language", "gender", "otherNames", "notes",
    ];
    for (const field of scalarFields) {
      if (body[field] !== undefined) updateData[field] = body[field];
    }
    if (body.dateOfBirth !== undefined) {
      updateData.dateOfBirth = new Date(body.dateOfBirth);
    }
    if (body.eSignatureConsent !== undefined) updateData.eSignatureConsent = body.eSignatureConsent;
    if (body.consentEmail !== undefined) updateData.consentEmail = body.consentEmail;
    if (body.consentSms !== undefined) updateData.consentSms = body.consentSms;

    const client = await prisma.client.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, client });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update client",
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
    const existing = await prisma.client.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, message: "Client not found" },
        { status: 404 }
      );
    }
    await prisma.client.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Client deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to delete client" },
      { status: 500 }
    );
  }
}
