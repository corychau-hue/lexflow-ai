import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const formData = body.formData || body;
    const existingClientId = body.clientId || formData.clientId;

    let clientId: string;
    let clientInfo: { id: string; firstName: string; lastName: string };

    if (existingClientId) {
      // Verify the client exists
      const existing = await prisma.client.findUnique({ where: { id: existingClientId } });
      if (!existing) {
        return NextResponse.json(
          { success: false, message: "Client not found" },
          { status: 404 }
        );
      }
      clientId = existingClientId;
      clientInfo = { id: existing.id, firstName: existing.firstName, lastName: existing.lastName };
    } else {
      // Create a new client record from the intake data
      const client = await prisma.client.create({
        data: {
          firstName: formData.personal?.firstName || "",
          lastName: formData.personal?.lastName || "",
          email: formData.personal?.email || "",
          phone: formData.personal?.phone || "",
          dateOfBirth: formData.personal?.dateOfBirth
            ? new Date(formData.personal.dateOfBirth)
            : undefined,
          ssn: formData.personal?.ssn || "",
          addressStreet: formData.address?.street || "",
          addressCity: formData.address?.city || "",
          addressState: formData.address?.state || "",
          addressZip: formData.address?.zip || "",
          language: body.language || "ENGLISH",
          immigrationStatus: formData.immigration?.immigrationStatus || "",
          countryOfBirth: formData.personal?.countryOfBirth || "",
          countryOfCitizenship: formData.personal?.countryOfCitizenship || "",
          otherNames: formData.personal?.otherNames || "",
          consentEmail: formData.personal?.email ? true : false,
          consentSms: formData.personal?.smsConsent || false,
          eSignatureConsent: body.eSignatureConsent || false,
          notes: body.notes || "",
          employmentHistory: formData.employment || {},
          familyMembers: formData.family || {},
          priorFilings: formData.priorFilings || {},
          criminalHistory: formData.criminalHistory || {},
        },
      });
      clientId = client.id;
      clientInfo = { id: client.id, firstName: client.firstName, lastName: client.lastName };
    }

    // Store the raw intake form data as a separate record
    const intake = await prisma.intake.create({
      data: {
        clientId,
        formData,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Intake submitted successfully",
        intakeId: intake.id,
        clientId,
        client: clientInfo,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit intake",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 400 }
    );
  }
}
