import { describe, it, expect } from "vitest";
import { getAIService } from "@/lib/ai-service-core";

describe("AIService", () => {
  const service = getAIService();

  describe("generateText", () => {
    it("returns a string response for a legal prompt", async () => {
      const result = await service.generateText({
        prompt: "Draft a brief legal memo about filing deadlines.",
      });

      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(50);
    });

    it("includes attorney review disclaimer in output", async () => {
      const result = await service.generateText({
        prompt: "What are the filing requirements for I-485?",
      });

      expect(result).toMatch(/attorney review/i);
    });

    it("respects custom system prompt", async () => {
      const result = await service.generateText({
        prompt: "Write a short client update.",
        system: "You are an assistant generating client update communications.",
      });

      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
    });
  });

  describe("extractFields", () => {
    it("returns an array of extracted fields", async () => {
      const result = await service.extractFields({
        text: "Full Name: John Doe. Date of Birth: 01/01/1990.",
        documentId: "test-doc-1",
      });

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBeGreaterThan(0);
    });

    it("each field has required properties", async () => {
      const result = await service.extractFields({
        text: "Passport AB1234567 issued Jan 1, 2020.",
        documentId: "test-doc-2",
      });

      for (const field of result) {
        expect(field).toHaveProperty("fieldName");
        expect(field).toHaveProperty("fieldValue");
        expect(field).toHaveProperty("confidence");
        expect(field).toHaveProperty("documentId");
      }
    });
  });

  describe("translate", () => {
    it("returns translated text", async () => {
      const result = await service.translate({
        text: "Hello, how are you?",
        sourceLang: "ENGLISH",
        targetLang: "VIETNAMESE",
        mode: "plain",
      });

      expect(result).toBeTruthy();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
