export const writingTemplates: Record<string, string> = {
  formal_legal: `Rewrite the following in formal legal style, using precise legal terminology and a professional tone. Maintain all factual content but use formal language appropriate for legal correspondence:\n\n{{INPUT}}`,

  simple_english: `Rewrite the following in simple, plain English that a non-legal professional can easily understand. Avoid legal jargon and use clear, straightforward language:\n\n{{INPUT}}`,

  more_professional: `Rewrite the following text to make it more professional and polished, suitable for a law firm environment. Keep it concise and business-appropriate:\n\n{{INPUT}}`,

  more_friendly: `Rewrite the following text to make it warmer and more friendly, while remaining professional. Use a client-centered tone:\n\n{{INPUT}}`,

  draft_client_update: `Draft a professional client update letter/email for the following case information. Include the case status, recent developments, and next steps. Keep it informative but reassuring:\n\n{{INPUT}}`,

  draft_attorney_letter: `Draft a formal legal letter from an attorney regarding the following matter. Use proper legal letter format, include relevant legal references, and maintain a professional tone:\n\n{{INPUT}}`,

  draft_insurance_demand: `Draft an insurance demand letter paragraph based on the following information. Include the damages, liability arguments, and a professional request for settlement:\n\n{{INPUT}}`,

  draft_uscis_inquiry: `Draft a professional inquiry to USCIS/NVC regarding the following immigration case matter. Include case details and a clear request for status update or action:\n\n{{INPUT}}`,

  draft_court_filing: `Draft a court filing summary based on the following case information. Include the case caption, filing type, key arguments, and requested relief:\n\n{{INPUT}}`,

  translate_vietnamese: `Translate the following text from English to Vietnamese. Maintain legal accuracy while using natural Vietnamese phrasing appropriate for legal communications:\n\n{{INPUT}}`,

  translate_chinese: `Translate the following text from English to Chinese. Maintain legal accuracy while using natural Chinese phrasing appropriate for legal communications:\n\n{{INPUT}}`,

  translate_spanish: `Translate the following text from English to Spanish. Maintain legal accuracy while using natural Spanish phrasing appropriate for legal communications:\n\n{{INPUT}}`,

  summarize: `Provide a concise summary of the following legal document or case information. Include the key parties, issues, important dates, and current status:\n\n{{INPUT}}`,

  extract_action_items: `Extract all action items, tasks, and deadlines from the following text. List them in priority order with responsible party and due dates where identifiable:\n\n{{INPUT}}`,

  create_checklist: `Create a detailed checklist based on the following case information. Organize by category and include estimated timeframes where applicable:\n\n{{INPUT}}`,
};

export const extractionPrompt = `Extract the following fields from the document text below. For each field, provide the value and a confidence score (0-1). If a field is not found, set value to "NOT FOUND" and confidence to 0.

Fields to extract:
- Full Name
- Date of Birth
- Address
- Phone Number
- Email
- A-Number (if immigration document)
- Receipt Number (if immigration document)
- Passport Number
- Policy Number (if insurance document)
- Case Number (if court document)
- Claim Number (if insurance claim)
- Property Address (if property document)
- Medical Provider Name (if medical document)
- Document Date
- Expiration Date

Document Text:
{{INPUT}}

Return the results as a JSON array of objects with keys: fieldName, fieldValue, confidence.`;

export const translationPrompt = `Translate the following text from {{SOURCE_LANG}} to {{TARGET_LANG}}.
Mode: {{MODE}} (plain = conversational, legal = formal legal style)
Preserve all names, dates, numbers, and legal references exactly as in the original.

Text to translate:
{{INPUT}}

Return only the translated text, no additional commentary.`;

export const caseSummaryPrompt = `Generate a comprehensive case summary based on the following case information. Include:
1. Case Overview (1-2 sentences)
2. Key Parties
3. Current Status
4. Important Deadlines
5. Key Documents
6. Next Steps

Case Information:
{{INPUT}}

Format the summary in clear sections with brief bullet points.`;

export const strategyMemoPrompt = `Draft an attorney strategy memo based on the following case information. Include:
1. Case Background
2. Legal Issues
3. Strengths and Weaknesses
4. Recommended Strategy
5. Alternative Approaches
6. Risk Assessment

Case Information:
{{INPUT}}

Format as a professional internal memo.`;
