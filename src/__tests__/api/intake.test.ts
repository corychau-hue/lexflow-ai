import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/intake/route";
import { GET } from "@/app/api/intake/[clientId]/route";
import { createMockRequest, createRouteParams, parseJson } from "../helpers";

describe("POST /api/intake", () => {
  it("creates a client and intake record from form data", async () => {
    const req = createMockRequest("POST", {
      body: {
        formData: {
          personal: { firstName: "Intake", lastName: "Test", email: "intake.test@example.com", phone: "(555) 111-2222", dateOfBirth: "1990-01-01" },
          address: { street: "100 Test St", city: "Los Angeles", state: "CA", zip: "90001" },
          immigration: { immigrationStatus: "F-1" },
        },
        language: "ENGLISH",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const body = await parseJson(res) as { success: boolean; intakeId: string; clientId: string; client: { firstName: string } };
    expect(body.success).toBe(true);
    expect(body.client.firstName).toBe("Intake");
    expect(body.intakeId).toBeTruthy();
    expect(body.clientId).toBeTruthy();
  });
});

describe("GET /api/intake/[clientId]", () => {
  it("returns the most recent intake for a client", async () => {
    const res = await GET(createMockRequest("GET"), createRouteParams({ clientId: "client-1" }));
    expect(res.status).toBe(200);

    const body = await parseJson(res) as { success: boolean; intake: { id: string; clientId: string; formData: Record<string, unknown> } };
    expect(body.success).toBe(true);
    expect(body.intake.clientId).toBe("client-1");
    expect(body.intake.formData).toHaveProperty("personal");
  });

  it("returns 404 for client with no intake", async () => {
    const res = await GET(createMockRequest("GET"), createRouteParams({ clientId: "non-existent-client-id" }));
    expect(res.status).toBe(404);

    const body = await parseJson(res) as { success: boolean; message: string };
    expect(body.success).toBe(false);
    expect(body.message).toMatch(/no intake/i);
  });
});
