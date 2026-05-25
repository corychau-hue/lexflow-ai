import { describe, it, expect } from "vitest";
import { GET, POST } from "@/app/api/clients/route";
import { GET as GET_CLIENT, PUT, DELETE } from "@/app/api/clients/[id]/route";
import { createMockRequest, createRouteParams, parseJson } from "../helpers";

describe("GET /api/clients", () => {
  it("returns a list of clients", async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const body = await parseJson(res) as { clients: unknown[] };
    expect(body).toHaveProperty("clients");
    expect(Array.isArray(body.clients)).toBe(true);
    expect(body.clients.length).toBeGreaterThanOrEqual(5);
  });
});

describe("POST /api/clients", () => {
  it("creates a new client and returns 201", async () => {
    const req = createMockRequest("POST", {
      body: {
        firstName: "Test",
        lastName: "Client",
        email: "test.client@example.com",
        phone: "(555) 000-0000",
        language: "ENGLISH",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const body = await parseJson(res) as { success: boolean; client: { id: string; firstName: string } };
    expect(body.success).toBe(true);
    expect(body.client.firstName).toBe("Test");

    // Cleanup — delete the test client
    const deleteReq = createMockRequest("DELETE");
    await DELETE(deleteReq, createRouteParams(body.client.id));
  });

});

describe("GET /api/clients/[id]", () => {
  it("returns a single client by id", async () => {
    const res = await GET_CLIENT(createMockRequest("GET"), createRouteParams("client-1"));
    expect(res.status).toBe(200);

    const body = await parseJson(res) as { success: boolean; client: { id: string; firstName: string } };
    expect(body.success).toBe(true);
    expect(body.client.id).toBe("client-1");
    expect(body.client.firstName).toBe("Tran");
  });

  it("returns 404 for non-existent client", async () => {
    const res = await GET_CLIENT(createMockRequest("GET"), createRouteParams("non-existent-id"));
    expect(res.status).toBe(404);
  });
});

describe("PUT /api/clients/[id]", () => {
  it("updates a client's fields", async () => {
    const req = createMockRequest("PUT", {
      body: { firstName: "Updated", phone: "(555) 999-9999" },
    });

    const res = await PUT(req, createRouteParams("client-2"));
    expect(res.status).toBe(200);

    const body = await parseJson(res) as { success: boolean; client: { firstName: string; phone: string } };
    expect(body.client.firstName).toBe("Updated");
    expect(body.client.phone).toBe("(555) 999-9999");

    // Restore
    await PUT(createMockRequest("PUT", { body: { firstName: "Maria", phone: "(213) 555-1002" } }), createRouteParams("client-2"));
  });

  it("returns 404 for non-existent client", async () => {
    const req = createMockRequest("PUT", { body: { firstName: "Nope" } });
    const res = await PUT(req, createRouteParams("non-existent-id"));
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/clients/[id]", () => {
  it("returns 404 for non-existent client", async () => {
    const res = await DELETE(createMockRequest("DELETE"), createRouteParams("non-existent-id"));
    expect(res.status).toBe(404);
  });
});
