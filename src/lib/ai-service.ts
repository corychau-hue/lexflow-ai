// Server-only AI service with usage tracking.
// Client components should import from "@/lib/ai-service-core" instead.

export { getAIService, type AIService, type AIGenerateParams, type AIExtractParams, type AITranslateParams } from "./ai-service-core";

import { getAIService as getCoreService } from "./ai-service-core";

async function checkUsageLimit(): Promise<void> {
  const limit = parseInt(process.env.AI_MONTHLY_LIMIT || "1000", 10);
  if (limit <= 0) return;

  const now = new Date();
  const firstOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const { prisma } = await import("@/lib/prisma");

  const count = await prisma.auditLog.count({
    where: {
      action: "AI_REQUEST",
      createdAt: { gte: firstOfMonth },
    },
  });

  if (count >= limit) {
    throw new Error(
      `Monthly AI usage limit of ${limit} requests reached. Please wait until next month or contact your administrator.`
    );
  }
}

async function logAIRequest(userId?: string): Promise<void> {
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.auditLog.create({
      data: {
        action: "AI_REQUEST",
        entityType: "ai_output",
        entityId: "usage-counter",
        userId: userId || null,
      },
    });
  } catch {
    // Silently fail – don't block the AI request on a logging error
  }
}

function withUsageLimit<T extends Record<string, any>>(service: T): T {
  return new Proxy(service, {
    get(target, prop) {
      const orig = (target as any)[prop];
      if (typeof orig !== "function") return orig;
      return async (...args: any[]) => {
        await checkUsageLimit();
        const result = await orig.apply(target, args);
        logAIRequest().catch(() => {});
        return result;
      };
    },
  });
}

export function getAIServiceWithUsageTracking() {
  const core = getCoreService();
  const provider = (process.env.AI_PROVIDER || "mock").toLowerCase();
  // Only wrap real providers; mock doesn't need usage tracking
  if (provider === "mock" || provider === "openai" || provider === "anthropic" || provider === "deepseek") {
    if (provider !== "mock" && process.env.AI_API_KEY) {
      return withUsageLimit(core);
    }
  }
  return core;
}
