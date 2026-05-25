const NEXT_PUBLIC_APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "lexflow-dev-secret-change-in-production";
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || NEXT_PUBLIC_APP_URL;
const DATABASE_URL = process.env.DATABASE_URL || "postgresql://localhost:5432/lexflow";

export const config = {
  app: {
    name: "LexFlow AI",
    description: "AI-Powered Legal Workflow Platform",
    url: NEXT_PUBLIC_APP_URL,
  },
  auth: {
    secret: NEXTAUTH_SECRET,
    url: NEXTAUTH_URL,
    sessionMaxAge: 30 * 24 * 60 * 60, // 30 days
  },
  database: {
    url: DATABASE_URL,
  },
  ai: {
    provider: process.env.AI_PROVIDER || "mock", // "mock", "openai", "anthropic"
    apiKey: process.env.AI_API_KEY || "",
    model: process.env.AI_MODEL || "gpt-4",
  },
  upload: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ["application/pdf", "image/jpeg", "image/png", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    storagePath: "public/uploads",
  },
};
