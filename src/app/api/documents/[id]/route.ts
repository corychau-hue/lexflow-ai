import { NextRequest, NextResponse } from "next/server";
import { unlink } from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";

type RouteParams = Promise<{ id: string }>;

export async function GET(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;
    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) {
      return NextResponse.json({ success: false, message: "Document not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, document: doc });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to fetch document" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: RouteParams }
) {
  try {
    const { id } = await params;
    const doc = await prisma.document.findUnique({ where: { id } });
    if (!doc) {
      return NextResponse.json({ success: false, message: "Document not found" }, { status: 404 });
    }

    // Delete file from disk
    try {
      const fullPath = path.join(process.cwd(), "public", doc.filePath);
      await unlink(fullPath);
    } catch {
      // File may already be missing — proceed with DB cleanup
    }

    await prisma.document.delete({ where: { id } });
    return NextResponse.json({ success: true, message: "Document deleted" });
  } catch {
    return NextResponse.json({ success: false, message: "Failed to delete document" }, { status: 500 });
  }
}
