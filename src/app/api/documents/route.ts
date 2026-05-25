import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import type { DocumentType } from "@/generated/prisma/enums";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");
const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "image/jpeg",
  "image/png",
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get("clientId");
    const caseId = searchParams.get("caseId");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {};
    if (clientId) where.clientId = clientId;
    if (caseId) where.caseId = caseId;
    if (search) where.originalName = { contains: search };

    const documents = await prisma.document.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ documents, total: documents.length });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to fetch documents" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const clientId = formData.get("clientId") as string | null;
    const caseId = formData.get("caseId") as string | null;
    const documentType = (formData.get("documentType") as string) || "OTHER";

    if (!file || !clientId) {
      return NextResponse.json(
        { success: false, message: "File and clientId are required" },
        { status: 400 }
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { success: false, message: `File type ${file.type} is not supported. Allowed: PDF, Word, JPG, PNG` },
        { status: 400 }
      );
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { success: false, message: "File exceeds 10MB limit" },
        { status: 400 }
      );
    }

    const client = await prisma.client.findUnique({ where: { id: clientId } });
    if (!client) {
      return NextResponse.json(
        { success: false, message: "Client not found" },
        { status: 404 }
      );
    }

    await mkdir(UPLOAD_DIR, { recursive: true });
    const ext = path.extname(file.name) || ".bin";
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}${ext}`;
    const filePath = path.join(UPLOAD_DIR, safeName);
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);

    const doc = await prisma.document.create({
      data: {
        fileName: safeName,
        originalName: file.name,
        fileType: file.type,
        fileSize: file.size,
        filePath: `/uploads/${safeName}`,
        documentType: documentType as DocumentType,
        clientId,
        caseId: caseId || undefined,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "File uploaded successfully",
        document: {
          id: doc.id,
          fileName: doc.fileName,
          originalName: doc.originalName,
          fileType: doc.fileType,
          fileSize: doc.fileSize,
          documentType: doc.documentType,
          filePath: doc.filePath,
          clientId: doc.clientId,
          caseId: doc.caseId,
          createdAt: doc.createdAt.toISOString(),
        },
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Upload failed",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
