import { ExtractedField } from "@/types";

export interface AIGenerateParams {
  prompt: string;
  system?: string;
  caseId?: string;
}

export interface AIExtractParams {
  text: string;
  documentId: string;
}

export interface AITranslateParams {
  text: string;
  sourceLang: string;
  targetLang: string;
  mode: "plain" | "legal";
}

export interface AIService {
  generateText(params: AIGenerateParams): Promise<string>;
  extractFields(params: AIExtractParams): Promise<ExtractedField[]>;
  translate(params: AITranslateParams): Promise<string>;
}

// ---------------------------------------------------------------------------
// OpenAI provider
// ---------------------------------------------------------------------------
class OpenAIService implements AIService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = "gpt-4o") {
    this.apiKey = apiKey;
    this.model = model;
  }

  private async callAPI(system: string, user: string): Promise<string> {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.3,
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`OpenAI API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  async generateText(params: AIGenerateParams): Promise<string> {
    return this.callAPI(
      params.system || "You are a legal writing assistant for a California law firm. Provide professional legal text.",
      params.prompt
    );
  }

  async extractFields(params: AIExtractParams): Promise<ExtractedField[]> {
    const system = "You extract structured data from legal documents. Respond ONLY with a JSON array of objects with keys: fieldName, fieldValue, confidence (0-1). No markdown, no code fences.";
    const user = `Extract all relevant fields from this document:\n\n${params.text}`;
    const raw = await this.callAPI(system, user);
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch {
      return [];
    }
  }

  async translate(params: AITranslateParams): Promise<string> {
    const system = `You are a legal translator. Translate from ${params.sourceLang} to ${params.targetLang}. Mode: ${params.mode === "legal" ? "formal legal style preserving legal terminology" : "conversational and clear"}. Return only the translation.`;
    return this.callAPI(system, params.text);
  }
}

// ---------------------------------------------------------------------------
// Anthropic / Claude provider
// ---------------------------------------------------------------------------
class AnthropicService implements AIService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = "claude-sonnet-4-20250514") {
    this.apiKey = apiKey;
    this.model = model;
  }

  private async callAPI(system: string, user: string): Promise<string> {
    const res = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": this.apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: this.model,
        system,
        messages: [{ role: "user", content: user }],
        max_tokens: 4096,
        temperature: 0.3,
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Anthropic API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    return data.content?.[0]?.text || "";
  }

  async generateText(params: AIGenerateParams): Promise<string> {
    return this.callAPI(
      params.system || "You are a legal writing assistant for a California law firm. Provide professional legal text.",
      params.prompt
    );
  }

  async extractFields(params: AIExtractParams): Promise<ExtractedField[]> {
    const system = "You extract structured data from legal documents. Respond ONLY with a JSON array of objects with keys: fieldName, fieldValue, confidence (0-1). No markdown, no code fences.";
    const user = `Extract all relevant fields from this document:\n\n${params.text}`;
    const raw = await this.callAPI(system, user);
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch {
      return [];
    }
  }

  async translate(params: AITranslateParams): Promise<string> {
    const system = `You are a legal translator. Translate from ${params.sourceLang} to ${params.targetLang}. Mode: ${params.mode === "legal" ? "formal legal style preserving legal terminology" : "conversational and clear"}. Return only the translation.`;
    return this.callAPI(system, params.text);
  }
}

// ---------------------------------------------------------------------------
// DeepSeek provider (OpenAI-compatible API)
// ---------------------------------------------------------------------------
class DeepSeekService implements AIService {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = "deepseek-chat") {
    this.apiKey = apiKey;
    this.model = model;
  }

  private async callAPI(system: string, user: string): Promise<string> {
    const res = await fetch("https://api.deepseek.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user },
        ],
        temperature: 0.3,
      }),
      signal: AbortSignal.timeout(60000),
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`DeepSeek API error (${res.status}): ${err}`);
    }

    const data = await res.json();
    return data.choices?.[0]?.message?.content || "";
  }

  async generateText(params: AIGenerateParams): Promise<string> {
    return this.callAPI(
      params.system || "You are a legal writing assistant for a California law firm. Provide professional legal text.",
      params.prompt
    );
  }

  async extractFields(params: AIExtractParams): Promise<ExtractedField[]> {
    const system = "You extract structured data from legal documents. Respond ONLY with a JSON array of objects with keys: fieldName, fieldValue, confidence (0-1). No markdown, no code fences.";
    const user = `Extract all relevant fields from this document:\n\n${params.text}`;
    const raw = await this.callAPI(system, user);
    try {
      const cleaned = raw.replace(/```json|```/g, "").trim();
      return JSON.parse(cleaned);
    } catch {
      return [];
    }
  }

  async translate(params: AITranslateParams): Promise<string> {
    const system = `You are a legal translator. Translate from ${params.sourceLang} to ${params.targetLang}. Mode: ${params.mode === "legal" ? "formal legal style preserving legal terminology" : "conversational and clear"}. Return only the translation.`;
    return this.callAPI(system, params.text);
  }
}

// ---------------------------------------------------------------------------
// Mock provider (fallback / development)
// ---------------------------------------------------------------------------
class MockAIService implements AIService {
  async generateText(params: AIGenerateParams): Promise<string> {
    await delay(800 + Math.random() * 700);
    const input = params.prompt;
    if (params.system?.includes("formal legal")) return generateMockLegalText(input);
    if (params.system?.includes("simple English")) return generateMockSimpleText(input);
    if (params.system?.includes("client update")) return generateMockClientUpdate(input);
    if (params.system?.includes("attorney letter")) return generateMockAttorneyLetter(input);
    if (params.system?.includes("summar")) return generateMockSummary(input);
    if (params.system?.includes("action item")) return generateMockActionItems(input);
    if (params.system?.includes("checklist")) return generateMockChecklist(input);
    return generateMockLegalText(input);
  }

  async extractFields(params: AIExtractParams): Promise<ExtractedField[]> {
    await delay(1000 + Math.random() * 1000);
    return generateMockExtractedFields(params.documentId);
  }

  async translate(params: AITranslateParams): Promise<string> {
    await delay(600 + Math.random() * 600);
    return generateMockTranslation(params.text, params.targetLang, params.mode);
  }
}

// ---------------------------------------------------------------------------
// Service selection (safe for client components — no Prisma imports)
// ---------------------------------------------------------------------------
let aiServiceInstance: AIService;

export function getAIService(): AIService {
  if (aiServiceInstance) return aiServiceInstance;

  const provider = (typeof process !== "undefined" && process.env && (process.env as any).AI_PROVIDER || "mock").toLowerCase();

  const apiKey = typeof process !== "undefined" && process.env ? (process.env as any).AI_API_KEY : undefined;

  if (provider === "openai" && apiKey) {
    aiServiceInstance = new OpenAIService(
      apiKey,
      (typeof process !== "undefined" && process.env ? (process.env as any).AI_MODEL : undefined) || "gpt-4o"
    );
  } else if (provider === "anthropic" && apiKey) {
    aiServiceInstance = new AnthropicService(
      apiKey,
      (typeof process !== "undefined" && process.env ? (process.env as any).AI_MODEL : undefined) || "claude-sonnet-4-20250514"
    );
  } else if (provider === "deepseek" && apiKey) {
    aiServiceInstance = new DeepSeekService(
      apiKey,
      (typeof process !== "undefined" && process.env ? (process.env as any).AI_MODEL : undefined) || "deepseek-chat"
    );
  } else {
    if (provider !== "mock") {
      console.warn(
        `AI_PROVIDER is set to "${provider}" but no AI_API_KEY found. Falling back to mock provider.`
      );
    }
    aiServiceInstance = new MockAIService();
  }

  return aiServiceInstance;
}

// ---------------------------------------------------------------------------
// Mock data generators
// ---------------------------------------------------------------------------
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function generateMockLegalText(input: string): string {
  return `Pursuant to the foregoing facts and applicable legal authorities, the undersigned hereby provides the following analysis and recommendations. Based upon a thorough review of the evidentiary record and relevant statutory provisions, it is respectfully submitted that the aforementioned matter requires immediate attention and procedural action.

The parties involved are hereby notified that compliance with all applicable deadlines and filing requirements is mandatory. Failure to adhere to the prescribed timelines may result in adverse consequences, including but not limited to the waiver of rights or claims.

This office recommends the following course of action:
1. Compile all relevant documentation in support of the claims asserted herein;
2. Submit the requisite filings to the appropriate tribunal or agency;
3. Monitor case progress and respond to any inquiries or requests for additional information;
4. Maintain communication with all interested parties regarding material developments.

This communication is intended for informational purposes only and does not constitute legal advice or create an attorney-client relationship.

[AI-Generated — Attorney Review Required]`;
}

function generateMockSimpleText(input: string): string {
  return `Here is a plain English explanation of the legal information you provided:

The main points of your case are:
1. There are important deadlines you need to know about.
2. You will need to provide certain documents to support your case.
3. The court or government agency will review your information and make a decision.
4. We will keep you updated on what happens next.

What you need to do now:
- Gather the documents listed in your checklist
- Sign any forms that need your signature
- Let us know if your contact information changes
- Ask questions if anything is unclear

Remember: We are here to help you through this process. Do not hesitate to reach out if you need any clarification.

[AI-Generated — Attorney Review Required]`;
}

function generateMockClientUpdate(input: string): string {
  return `RE: Case Status Update

Dear Client,

We hope this letter finds you well. We are writing to provide you with an update on the status of your legal matter.

Current Status: Your case remains active and we are making progress. Our office has been working diligently to advance your matter through the appropriate legal channels.

Recent Developments: We have reviewed the relevant documentation and are preparing the necessary filings. Our team is coordinating with all relevant parties to ensure timely processing.

Next Steps:
1. We will complete and file the required paperwork
2. You will receive copies of all filings for your records
3. We will notify you of any responses or requests we receive
4. We will schedule follow-up consultations as needed

Please do not hesitate to contact our office if you have any questions or concerns regarding your case. We remain committed to providing you with exceptional legal representation.

Best regards,
LexFlow AI Legal Team

[AI-Generated — Attorney Review Required]`;
}

function generateMockAttorneyLetter(input: string): string {
  return `LAW OFFICES OF LEXFLOW AI
123 Legal Avenue, Suite 400
Los Angeles, California 90001
(555) 123-4567

Date: ${new Date().toLocaleDateString()}

RE: Formal Legal Correspondence Regarding Legal Matter

Dear Recipient,

This firm represents the interested party in the above-referenced matter. Please direct all future communications regarding this matter to our office.

We write to formally address the legal issues pertaining to this case. Based on our review of the relevant facts and applicable law, we set forth the following positions:

1. Our client maintains all rights and remedies available under applicable law;
2. We request that all pertinent documentation be provided in a timely manner;
3. We are prepared to pursue all appropriate legal avenues to protect our client's interests.

Please respond to this correspondence within fourteen (14) calendar days. Failure to respond may result in further legal action without additional notice.

This letter does not constitute a complete statement of all facts or legal positions, and nothing herein shall be deemed a waiver of any rights or remedies.

Sincerely,
[Attorney Name]
LexFlow AI Legal Team

[AI-Generated — Attorney Review Required]`;
}

function generateMockSummary(input: string): string {
  const items = [
    "Case involves review of immigration benefits application",
    "Key parties have been identified and notified",
    "Supporting documentation is being compiled for submission",
    "Statutory deadlines have been noted for compliance",
    "Potential challenges have been identified and mitigation strategies prepared",
    "Recommendation: proceed with filing upon completion of documentation review",
  ];
  return `## Case Summary

**Overview:** This case requires review and processing of legal documentation in accordance with applicable laws and regulations.

**Key Details:**
- ${items[0]}
- ${items[1]}
- ${items[2]}

**Status:** Active - Documentation Phase

**Recommendations:**
- ${items[3]}
- ${items[4]}
- ${items[5]}

[AI-Generated — Attorney Review Required]`;
}

function generateMockActionItems(input: string): string {
  return `## Action Items

**High Priority:**
1. [ ] Gather all identification documents (Passport, ID, Birth Certificate) — Due: ASAP
2. [ ] Complete and sign all required forms — Due: Within 7 days
3. [ ] Submit filing fees/payment — Due: Before deadline

**Medium Priority:**
4. [ ] Obtain supporting records (Tax returns, Employment letters) — Due: Within 14 days
5. [ ] Notify relevant parties of case status — Due: Within 14 days
6. [ ] Schedule follow-up consultation — Due: Within 30 days

**Low Priority:**
7. [ ] Organize digital copies of all documents
8. [ ] Update case management system with new information

[AI-Generated — Attorney Review Required]`;
}

function generateMockChecklist(input: string): string {
  return `## Document Checklist

### Required Documents:
- [ ] Government-issued photo identification
- [ ] Proof of current address (utility bill or lease)
- [ ] Relevant court or agency forms (completed and signed)
- [ ] Supporting evidence and exhibits
- [ ] Filing fee payment or fee waiver request

### Supporting Documents:
- [ ] Correspondence with opposing parties or agencies
- [ ] Photographs or other visual evidence
- [ ] Witness statements or declarations
- [ ] Expert reports or evaluations

### Administrative:
- [ ] Case file opened and labeled
- [ ] Client contact information verified
- [ ] Conflict check completed
- [ ] Engagement letter signed and filed
- [ ] Billing arrangements confirmed

[AI-Generated — Attorney Review Required]`;
}

function generateMockExtractedFields(documentId: string): ExtractedField[] {
  return [
    { id: `field-1-${documentId}`, fieldName: "Full Name", fieldValue: "Nguyen Van Tran", confidence: 0.95, isApproved: false, isRejected: false, documentId },
    { id: `field-2-${documentId}`, fieldName: "Date of Birth", fieldValue: "March 15, 1988", confidence: 0.92, isApproved: false, isRejected: false, documentId },
    { id: `field-3-${documentId}`, fieldName: "A-Number", fieldValue: "A123-456-789", confidence: 0.88, isApproved: false, isRejected: false, documentId },
    { id: `field-4-${documentId}`, fieldName: "Passport Number", fieldValue: "AB1234567", confidence: 0.85, isApproved: false, isRejected: false, documentId },
    { id: `field-5-${documentId}`, fieldName: "Address", fieldValue: "1234 Main Street, Los Angeles, CA 90012", confidence: 0.78, isApproved: false, isRejected: false, documentId },
    { id: `field-6-${documentId}`, fieldName: "Document Date", fieldValue: "January 10, 2024", confidence: 0.91, isApproved: false, isRejected: false, documentId },
    { id: `field-7-${documentId}`, fieldName: "Expiration Date", fieldValue: "January 10, 2034", confidence: 0.73, isApproved: false, isRejected: false, documentId },
    { id: `field-8-${documentId}`, fieldName: "Receipt Number", fieldValue: "IOE9876543210", confidence: 0.45, isApproved: false, isRejected: false, documentId },
  ];
}

function generateMockTranslation(text: string, targetLang: string, mode: string): string {
  const translations: Record<string, string> = {
    VIETNAMESE: `Kính gửi Quý khách hàng,

Chúng tôi viết thư này để cập nhật tình trạng hồ sơ pháp lý của Quý khách. Hồ sơ của Quý khách hiện đang trong quá trình xử lý tích cực và đội ngũ pháp lý của chúng tôi đang làm việc để đảm bảo tất cả các tài liệu cần thiết được chuẩn bị và nộp đúng hạn.

Các bước tiếp theo:
1. Chúng tôi sẽ hoàn tất và nộp các giấy tờ cần thiết
2. Quý khách sẽ nhận được bản sao của tất cả các hồ sơ đã nộp
3. Chúng tôi sẽ thông báo cho Quý khách về bất kỳ phản hồi hoặc yêu cầu nào

Vui lòng liên hệ với chúng tôi nếu Quý khách có bất kỳ câu hỏi nào.

Trân trọng,
LexFlow AI

[Nội dung do AI tạo — Cần Luật sư xem xét]`,

    CHINESE: `尊敬的客户：

我们写信是为了更新您的法律案件状态。您的案件正在积极处理中，我们的法律团队正在努力确保所有必要文件按时准备和提交。

后续步骤：
1. 我们将完成并提交必要的文件
2. 您将收到所有提交文件的副本
3. 我们将通知您任何回复或要求

如有任何问题，请随时与我们联系。

此致
LexFlow AI

[AI生成内容 — 需要律师审核]`,

    SPANISH: `Estimado Cliente:

Le escribimos para actualizarle sobre el estado de su caso legal. Su caso se encuentra en proceso activo y nuestro equipo legal está trabajando para asegurar que todos los documentos necesarios sean preparados y presentados a tiempo.

Próximos pasos:
1. Completaremos y presentaremos la documentación necesaria
2. Usted recibirá copias de todos los documentos presentados
3. Le notificaremos sobre cualquier respuesta o solicitud

Por favor no dude en contactarnos si tiene alguna pregunta.

Atentamente,
LexFlow AI

[Generado por IA — Revisión de Abogado Requerida]`,
  };

  return translations[targetLang] || `[Translated to ${targetLang}: ${text.slice(0, 50)}...]`;
}
