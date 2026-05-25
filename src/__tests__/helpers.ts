import { NextRequest } from "next/server";

/**
 * Create a mock NextRequest for testing route handlers.
 */
export function createMockRequest(
  method: string,
  options?: {
    body?: unknown;
    headers?: Record<string, string>;
    searchParams?: Record<string, string>;
  }
): NextRequest {
  const url = new URL("http://localhost:3000/api/test");
  if (options?.searchParams) {
    for (const [k, v] of Object.entries(options.searchParams)) {
      url.searchParams.set(k, v);
    }
  }

  const init: RequestInit & { nextConfig?: any } = {
    method,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  };

  if (options?.body !== undefined) {
    init.body = JSON.stringify(options.body);
  }

  return new NextRequest(url.toString(), init);
}

/**
 * Create params object for Next.js 16 dynamic route handlers.
 * Route handlers receive `{ params: Promise<{ ... }> }`.
 */
export function createRouteParams(
  idOrParams: string | Record<string, string>
): { params: Promise<Record<string, string>> } {
  const params = typeof idOrParams === "string" ? { id: idOrParams } : idOrParams;
  return { params: Promise.resolve(params) };
}

/**
 * Parse a NextResponse or Response as JSON.
 */
export async function parseJson(res: Response): Promise<unknown> {
  return res.json();
}
