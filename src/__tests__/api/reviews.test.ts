import { describe, it, expect } from "vitest";
import { GET, POST } from "@/app/api/reviews/route";
import { PUT } from "@/app/api/reviews/[id]/route";
import { createMockRequest, createRouteParams, parseJson } from "../helpers";

describe("GET /api/reviews", () => {
  it("returns review items", async () => {
    const res = await GET();
    expect(res.status).toBe(200);

    const body = await parseJson(res) as { items: unknown[] };
    expect(body).toHaveProperty("items");
    expect(Array.isArray(body.items)).toBe(true);
    expect(body.items.length).toBeGreaterThanOrEqual(4);
  });
});

describe("POST /api/reviews", () => {
  it("creates a new review item and returns 201", async () => {
    const req = createMockRequest("POST", {
      body: {
        title: "Test Review Item",
        type: "AI_SUMMARY",
        caseId: "case-1",
        clientName: "Tran Nguyen",
        details: "Test details for review item",
      },
    });

    const res = await POST(req);
    expect(res.status).toBe(201);

    const body = await parseJson(res) as { success: boolean; item: { id: string; title: string; status: string } };
    expect(body.success).toBe(true);
    expect(body.item.title).toBe("Test Review Item");
    expect(body.item.status).toBe("PENDING_REVIEW");
  });

  it("returns 400 when title is missing", async () => {
    const req = createMockRequest("POST", { body: { type: "TRANSLATION" } });
    const res = await POST(req);
    expect(res.status).toBe(400);
  });
});

describe("PUT /api/reviews/[id]", () => {
  it("updates a review item's status", async () => {
    const req = createMockRequest("PUT", { body: { status: "APPROVED" } });
    const res = await PUT(req, createRouteParams("review-1"));
    expect(res.status).toBe(200);

    const body = await parseJson(res) as { success: boolean; item: { status: string } };
    expect(body.success).toBe(true);
    expect(body.item.status).toBe("APPROVED");

    // Restore
    await PUT(createMockRequest("PUT", { body: { status: "PENDING_REVIEW" } }), createRouteParams("review-1"));
  });

  it("returns 404 for non-existent review item", async () => {
    const req = createMockRequest("PUT", { body: { status: "APPROVED" } });
    const res = await PUT(req, createRouteParams("non-existent"));
    expect(res.status).toBe(404);
  });
});
