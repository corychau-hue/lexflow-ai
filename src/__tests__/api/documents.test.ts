import { describe, it, expect } from "vitest";
import { GET } from "@/app/api/documents/route";
import { GET as GET_DOC, DELETE } from "@/app/api/documents/[id]/route";
import { createMockRequest, createRouteParams, parseJson } from "../helpers";

describe("GET /api/documents", () => {
  it("returns a list of documents", async () => {
    const res = await GET(createMockRequest("GET"));
    expect(res.status).toBe(200);

    const body = await parseJson(res) as { documents: unknown[]; total: number };
    expect(body).toHaveProperty("documents");
    expect(Array.isArray(body.documents)).toBe(true);
    expect(body.documents.length).toBeGreaterThanOrEqual(10);
    expect(body.total).toBe(body.documents.length);
  });

  it("filters documents by clientId", async () => {
    const req = createMockRequest("GET", { searchParams: { clientId: "client-1" } });
    const res = await GET(req);
    const body = await parseJson(res) as { documents: { clientId: string }[] };

    for (const doc of body.documents) {
      expect(doc.clientId).toBe("client-1");
    }
  });

  it("filters documents by search term", async () => {
    const req = createMockRequest("GET", { searchParams: { search: "passport" } });
    const res = await GET(req);
    const body = await parseJson(res) as { documents: { originalName: string }[] };

    expect(body.documents.length).toBeGreaterThanOrEqual(1);
    for (const doc of body.documents) {
      expect(doc.originalName.toLowerCase()).toContain("passport");
    }
  });
});

describe("GET /api/documents/[id]", () => {
  it("returns a single document by id", async () => {
    const res = await GET_DOC(createMockRequest("GET"), createRouteParams("doc-1"));
    expect(res.status).toBe(200);

    const body = await parseJson(res) as { success: boolean; document: { id: string; originalName: string } };
    expect(body.success).toBe(true);
    expect(body.document.id).toBe("doc-1");
  });

  it("returns 404 for non-existent document", async () => {
    const res = await GET_DOC(createMockRequest("GET"), createRouteParams("non-existent"));
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/documents/[id]", () => {
  it("returns 404 for non-existent document", async () => {
    const res = await DELETE(createMockRequest("DELETE"), createRouteParams("non-existent"));
    expect(res.status).toBe(404);
  });
});
