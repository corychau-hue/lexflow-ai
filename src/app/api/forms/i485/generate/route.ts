import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

const PAGE_W = 612; // US Letter width (points)
const PAGE_H = 792; // US Letter height
const MARGIN = 48;
const COL_W = PAGE_W - 2 * MARGIN;
const LINE_H = 14;
const FIELD_W = 240;

// Sections organized by USCIS part with their field labels and accessor paths
const USCIS_SECTIONS = [
  {
    title: "Part 1: Information About You",
    fields: [
      { label: "Full Legal Name (Last, First)", key: "fullName" },
      { label: "Date of Birth", key: "dateOfBirth" },
      { label: "Country of Birth", key: "countryOfBirth" },
      { label: "Country of Citizenship", key: "citizenship" },
      { label: "Social Security Number", key: "ssn" },
      { label: "A-Number (USCIS Number)", key: "aNumber" },
      { label: "Gender", key: "gender" },
      { label: "Marital Status", key: "maritalStatus" },
      { label: "Other Names Used", key: "otherNames" },
      { label: "Height", key: "height" },
      { label: "Weight", key: "weight" },
      { label: "Hair Color", key: "hairColor" },
      { label: "Eye Color", key: "eyeColor" },
    ],
  },
  {
    title: "Part 2: Application Type",
    fields: [
      { label: "Application Basis", key: "petitionerRelationship" },
      { label: "Applying for Waiver?", key: "waiverNeeded", type: "boolean" },
    ],
  },
  {
    title: "Part 3: Address & Contact Information",
    fields: [
      { label: "Street Address", key: "address" },
      { label: "City", key: "city" },
      { label: "State", key: "state" },
      { label: "ZIP Code", key: "zip" },
      { label: "Email", key: "email" },
      { label: "Phone", key: "phone" },
    ],
  },
  {
    title: "Part 4: Information About Your Family",
    fields: [
      { label: "Marital Status", key: "maritalStatus" },
      { label: "Spouse Name", key: "spouseName" },
      { label: "Spouse Date of Birth", key: "spouseDOB" },
      { label: "Spouse Country of Birth", key: "spouseBirth" },
      { label: "Spouse A-Number", key: "spouseANumber" },
      { label: "Spouse is U.S. Citizen?", key: "spouseCitizen", type: "boolean" },
      { label: "Spouse Immigration Status", key: "spouseStatus" },
      { label: "Date of Marriage", key: "marriageDate" },
      { label: "Place of Marriage", key: "marriagePlace" },
      { label: "Number of Prior Marriages", key: "priorMarriages" },
      { label: "Prior Marriage Ended By", key: "priorMarriageEnd" },
      { label: "Prior Marriage End Date", key: "priorMarriageEndDate" },
      { label: "Number of Children", key: "childrenCount" },
      { label: "Child's Name", key: "childName" },
      { label: "Child's Date of Birth", key: "childDOB" },
      { label: "Mother's Name", key: "motherName" },
      { label: "Mother's Country of Birth", key: "motherCountry" },
      { label: "Father's Name", key: "fatherName" },
      { label: "Father's Country of Birth", key: "fatherCountry" },
      { label: "Parent is U.S. Citizen?", key: "parentUSCitizen", type: "boolean" },
      { label: "Number of Siblings", key: "siblingsCount" },
      { label: "Relationship to Petitioner", key: "petitionerRelationship" },
    ],
  },
  {
    title: "Part 5: Education & Employment History",
    fields: [
      { label: "Highest Level of Education", key: "eduLevel" },
      { label: "School Name", key: "eduSchool" },
      { label: "School Location", key: "eduLocation" },
      { label: "Degree Earned", key: "eduDegree" },
      { label: "Attended From", key: "eduFrom" },
      { label: "Attended To", key: "eduTo" },
      { label: "Current Employer", key: "employer" },
      { label: "Job Title", key: "jobTitle" },
      { label: "Employment Start Date", key: "empStart" },
      { label: "Employer Address", key: "empAddress" },
      { label: "Employer City", key: "empCity" },
      { label: "Employer State", key: "empState" },
      { label: "Job Duties", key: "empDuties" },
      { label: "Previous Employer", key: "prevEmployer" },
      { label: "Previous Job Title", key: "prevTitle" },
      { label: "Previous Start Date", key: "prevStart" },
      { label: "Previous End Date", key: "prevEnd" },
    ],
  },
  {
    title: "Part 6: Immigration History",
    fields: [
      { label: "Current Immigration Status", key: "immigrationStatus" },
      { label: "Date of Last Arrival", key: "dateOfEntry" },
      { label: "Place of Last Arrival", key: "lastArrivalPlace" },
      { label: "Status at Entry", key: "statusAtEntry" },
      { label: "I-94 Number", key: "i94Number" },
      { label: "Departure History", key: "departureHistory" },
      { label: "Status Ever Expired?", key: "statusExpired", type: "boolean" },
      { label: "Waiver Needed?", key: "waiverNeeded", type: "boolean" },
      { label: "Removal Proceedings?", key: "removalProceedings", type: "boolean" },
      { label: "Unauthorized Work?", key: "unauthorizedWork", type: "boolean" },
      { label: "Visa Violations?", key: "visaViolations", type: "boolean" },
      { label: "Public Benefits Received?", key: "publicBenefits", type: "boolean" },
      { label: "Military Service?", key: "militaryService", type: "boolean" },
    ],
  },
  {
    title: "Part 7: Criminal History",
    fields: [
      { label: "Ever Arrested?", key: "arrested", type: "boolean" },
      { label: "Arrest Explanation", key: "arrestExplanation" },
      { label: "Ever Convicted?", key: "convicted", type: "boolean" },
      { label: "Conviction Explanation", key: "convictionExplanation" },
    ],
  },
  {
    title: "Prior Immigration Filings",
    fields: [
      { label: "Has Prior Filings?", key: "hasPriorFilings", type: "boolean" },
      { label: "Prior Form Type", key: "priorFormType" },
      { label: "Prior Filing Date", key: "priorFilingDate" },
      { label: "Prior Receipt Number", key: "priorReceiptNumber" },
    ],
  },
];

const EVIDENCE_ITEMS = [
  "Copy of passport biographical page",
  "Birth certificate with certified English translation (if not in English)",
  "Marriage certificate (if applicable)",
  "Divorce decree or death certificate for prior marriages (if applicable)",
  "Copy of Form I-94 Arrival/Departure Record",
  "Copy of visa and admission/parole stamp",
  "Form I-864 Affidavit of Support (if required)",
  "Medical exam results (Form I-693)",
  "Two passport-style photographs",
  "Police certificates from country of nationality (if 16+ years old)",
  "Certified court dispositions for any arrests (if applicable)",
  "Employment authorization document (if any)",
  "Copy of all prior USCIS notices and approvals",
  "Form G-1145 e-Notification (optional)",
];

function fmt(v: unknown, type?: string): string {
  if (v === undefined || v === null || v === "") return "—";
  if (type === "boolean") return v ? "Yes" : "No";
  return String(v);
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const doc = await PDFDocument.create();
    const font = await doc.embedFont(StandardFonts.Helvetica);
    const bold = await doc.embedFont(StandardFonts.HelveticaBold);
    const mono = await doc.embedFont(StandardFonts.Courier);

    let page = doc.addPage([PAGE_W, PAGE_H]);
    let y = PAGE_H - MARGIN;

    function wrap(text: string, maxW: number, size: number): string[] {
      const words = text.split(" ");
      const lines: string[] = [];
      let line = "";
      for (const w of words) {
        const test = line ? `${line} ${w}` : w;
        if (font.widthOfTextAtSize(test, size) > maxW) {
          lines.push(line);
          line = w;
        } else {
          line = test;
        }
      }
      if (line) lines.push(line);
      return lines.length ? lines : [""];
    }

    function drawText(text: string, x: number, yPos: number, size: number, opts?: { font?: typeof font; color?: typeof rgb.prototype; align?: "left" | "right" }) {
      const f = opts?.font || font;
      page.drawText(text, { x, y: yPos, size, font: f, color: opts?.color || rgb(0.1, 0.1, 0.1) });
    }

    function drawLine(yPos: number) {
      page.drawLine({ start: { x: MARGIN, y: yPos }, end: { x: PAGE_W - MARGIN, y: yPos }, thickness: 0.5, color: rgb(0.8, 0.8, 0.8) });
    }

    function checkPage(needed: number) {
      if (y - needed < MARGIN + 30) {
        // Page number on outgoing page
        drawText(`Page ${doc.getPageCount()}`, PAGE_W - MARGIN - 60, MARGIN - 12, 9, { color: rgb(0.6, 0.6, 0.6) });
        page = doc.addPage([PAGE_W, PAGE_H]);
        y = PAGE_H - MARGIN;
      }
    }

    // =====================================================================
    // COVER PAGE
    // =====================================================================
    drawText("U.S. Department of Homeland Security", MARGIN, y, 11, { color: rgb(0.3, 0.3, 0.3) });
    y -= 18;
    drawText("USCIS Form I-485 Data Packet", MARGIN, y, 22, { font: bold });
    y -= 14;
    drawText("Application to Register Permanent Residence or Adjust Status", MARGIN, y, 12, { color: rgb(0.3, 0.3, 0.3) });
    y -= 28;

    // Attorney review banner
    const bannerY = y;
    page.drawRectangle({ x: MARGIN, y: y - 32, width: COL_W, height: 32, color: rgb(1, 0.85, 0.7) });
    drawText("ATTORNEY REVIEW REQUIRED — NOT FOR FILING WITH USCIS", MARGIN + 10, y - 10, 14, { font: bold, color: rgb(0.7, 0.35, 0) });
    drawText("This document is a data packet prepared for attorney/staff review. Do not submit to USCIS without attorney approval.", MARGIN + 10, y - 26, 8, { color: rgb(0.6, 0.3, 0) });
    y = bannerY - 48;

    drawLine(y);
    y -= 16;

    // Client info on cover
    const coverFields = [
      ["Client Name", data.fullName],
      ["Date of Birth", data.dateOfBirth],
      ["A-Number", data.aNumber],
      ["Country of Birth", data.countryOfBirth],
      ["Date of Entry", data.dateOfEntry],
      ["Packet Generated", new Date().toLocaleDateString()],
    ];
    for (const [label, value] of coverFields) {
      drawText(label + ":", MARGIN, y, 10, { font: bold });
      drawText(fmt(value), MARGIN + 120, y, 10);
      y -= 18;
    }

    y -= 10;
    drawLine(y);
    y -= 20;

    // Table of contents
    drawText("Form Sections", MARGIN, y, 13, { font: bold });
    y -= 20;
    for (const section of USCIS_SECTIONS) {
      drawText(`  ${section.title}`, MARGIN, y, 10);
      y -= 15;
    }
    y -= 10;
    drawText("  Evidence Checklist", MARGIN, y, 10);
    y -= 10;

    // =====================================================================
    // FORM SECTIONS
    // =====================================================================
    for (const section of USCIS_SECTIONS) {
      // Section header
      checkPage(40);
      y -= 8;
      drawLine(y);
      y -= 16;
      drawText(section.title, MARGIN, y, 14, { font: bold });
      y -= 6;
      page.drawRectangle({ x: MARGIN, y: y - 2, width: COL_W, height: 2, color: rgb(0.2, 0.4, 0.7) });
      y -= 14;

      for (const field of section.fields) {
        const val = data[field.key];
        if (val === undefined || val === null || val === "" || val === false) continue;

        const labelW = font.widthOfTextAtSize(field.label, 9);
        const valueStr = fmt(val, field.type);
        const lines = wrap(valueStr, FIELD_W, 9);

        checkPage(lines.length * LINE_H + 4);

        drawText(field.label, MARGIN, y, 9, { font: bold, color: rgb(0.3, 0.3, 0.3) });
        for (let i = 0; i < lines.length; i++) {
          drawText(lines[i], MARGIN + Math.min(labelW + 12, 200), y, 9);
          y -= LINE_H;
        }
        y -= 2;
      }

      // If no fields had values, show a note
      const hasAny = section.fields.some((f) => data[f.key] !== undefined && data[f.key] !== null && data[f.key] !== "" && data[f.key] !== false);
      if (!hasAny) {
        drawText("(No data provided for this section)", MARGIN + 10, y, 9, { color: rgb(0.6, 0.6, 0.6) });
        y -= 14;
      }
    }

    // =====================================================================
    // EVIDENCE CHECKLIST
    // =====================================================================
    y -= 10;
    checkPage(40);
    drawLine(y);
    y -= 16;
    drawText("Required Evidence Checklist", MARGIN, y, 14, { font: bold });
    y -= 6;
    page.drawRectangle({ x: MARGIN, y: y - 2, width: COL_W, height: 2, color: rgb(0.2, 0.4, 0.7) });
    y -= 18;

    for (const item of EVIDENCE_ITEMS) {
      checkPage(LINE_H);
      page.drawRectangle({ x: MARGIN, y: y - 2, width: 10, height: 10, borderColor: rgb(0.3, 0.3, 0.3), borderWidth: 1 });
      drawText(item, MARGIN + 18, y - 1, 9);
      y -= 16;
    }

    // =====================================================================
    // FINAL PAGE — FOOTER
    // =====================================================================
    y -= 20;
    checkPage(40);
    drawLine(y);
    y -= 18;
    drawText("Certification", MARGIN, y, 11, { font: bold });
    y -= 16;
    drawText("This data packet was generated by LexFlow AI from client intake information. It requires attorney review,", MARGIN, y, 8, { color: rgb(0.4, 0.4, 0.4) });
    y -= 12;
    drawText("verification, and approval before use. The attorney is responsible for ensuring the accuracy and completeness", MARGIN, y, 8, { color: rgb(0.4, 0.4, 0.4) });
    y -= 12;
    drawText("of all information prior to submission to U.S. Citizenship and Immigration Services (USCIS).", MARGIN, y, 8, { color: rgb(0.4, 0.4, 0.4) });
    y -= 28;

    // Signature lines
    drawText("Attorney Signature: ________________________________", MARGIN, y, 10);
    y -= 24;
    drawText("Date: ____________________", MARGIN, y, 10);

    // Page number on last page
    drawText(`Page ${doc.getPageCount()}`, PAGE_W - MARGIN - 60, MARGIN - 12, 9, { color: rgb(0.6, 0.6, 0.6) });

    // =====================================================================
    // SERVE PDF
    // =====================================================================
    const pdfBytes = await doc.save();

    const blob = new Blob([Buffer.from(pdfBytes)], { type: "application/pdf" });
    return new Response(blob, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="i485-packet-${data.fullName?.replace(/[^a-zA-Z0-9]/g, "_") || "unknown"}.pdf"`,
        "Content-Length": String(pdfBytes.length),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to generate PDF",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
