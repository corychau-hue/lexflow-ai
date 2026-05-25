// Debug endpoint to test database connectivity from Vercel
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const userCount = await prisma.user.count();
    const sampleUser = await prisma.user.findFirst({
      select: { id: true, email: true, role: true, isActive: true },
    });

    return NextResponse.json({
      success: true,
      userCount,
      sampleUser,
      env: {
        hasDatabaseUrl: !!process.env.DATABASE_URL,
        hasPostgresPrismaUrl: !!process.env.POSTGRES_PRISMA_URL,
        nodeEnv: process.env.NODE_ENV,
      },
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message,
      stack: error.stack?.split("\n").slice(0, 3).join("\n"),
    });
  }
}
