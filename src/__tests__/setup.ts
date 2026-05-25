// Set test environment variables before any imports
process.env.NEXTAUTH_SECRET = "test-secret";
process.env.AI_PROVIDER = "mock";
process.env.DATABASE_URL = "postgresql://localhost:5432/lexflow_test?schema=public";
