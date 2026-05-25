import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ clients, total: clients.length });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch clients" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const client = await prisma.client.create({
      data: {
        firstName: body.firstName || "",
        lastName: body.lastName || "",
        email: body.email || "",
        phone: body.phone || "",
        dateOfBirth: body.dateOfBirth ? new Date(body.dateOfBirth) : undefined,
        language: body.language || "ENGLISH",
        eSignatureConsent: body.eSignatureConsent || false,
        addressStreet: body.addressStreet || "",
        addressCity: body.addressCity || "",
        addressState: body.addressState || "",
        addressZip: body.addressZip || "",
        immigrationStatus: body.immigrationStatus || "",
        countryOfBirth: body.countryOfBirth || "",
        countryOfCitizenship: body.countryOfCitizenship || "",
        ssn: body.ssn || "",
        gender: body.gender || "",
        otherNames: body.otherNames || "",
        notes: body.notes || "",
        consentEmail: body.consentEmail || false,
        consentSms: body.consentSms || false,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Client created successfully",
        client: {
          id: client.id,
          firstName: client.firstName,
          lastName: client.lastName,
          email: client.email,
          phone: client.phone,
          dateOfBirth: client.dateOfBirth?.toISOString().split("T")[0] || "",
          language: client.language,
          eSignatureConsent: client.eSignatureConsent,
          addressStreet: client.addressStreet,
          addressCity: client.addressCity,
          addressState: client.addressState,
          addressZip: client.addressZip,
          immigrationStatus: client.immigrationStatus,
          countryOfBirth: client.countryOfBirth,
          countryOfCitizenship: client.countryOfCitizenship,
          gender: client.gender,
          ssn: client.ssn,
          otherNames: client.otherNames,
          source: body.source || "api",
          createdAt: client.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create client",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
