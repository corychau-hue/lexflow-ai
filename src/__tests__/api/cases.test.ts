import { describe, it, expect } from "vitest";
import { GET, POST } from "@/app/api/cases/route";
import { createMockRequest, parseJson } from "../helpers";

describe("GET /api/cases", () => {
  it("returns a list of cases", async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const body = await parseJson(res) as { cases: unknown[]; total: number };
    expect(body).toHaveProperty("cases");
    expect(Array.isArray(body.cases)).toBe(true);
    expect(body.cases.length).toBeGreaterThanOrEqual(8);
    expect(body.total).toBe(body.cases.length);
  });
});

describe("POST /api/cases", () => {
  it("creates a new case and returns 201", async () => {
    const req = createMockRequest("POST", {
      body: {
        caseName: "Test Case",
        practiceArea: "IMMIGRATION",
        caseType: "I-130",
        clientId: "client-1",
        assignedUserId: "user-attorney",
        createdById: "user-attorney",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const body = await parseJson(res) as { success: boolean; case: { id: string; caseName: string } };
    expect(body.success).toBe(true);
    expect(body.case.caseName).toBe("Test Case");
  });

  it("returns 400 when required fields are missing", async () => {
    const req = createMockRequest("POST", {
      body: { description: "Missing caseName and clientId" },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});
