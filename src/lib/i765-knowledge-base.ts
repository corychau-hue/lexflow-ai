export interface I765Field {
  id: string;
  label: string;
  uscisPart: string;
  type: "text" | "date" | "select" | "yesno" | "textarea";
  options?: string[];
  required: boolean;
  intakeSource: string;
  instructions: string;
  evidenceRequired?: string;
  legalReference?: string;
  legalTitle?: string;
}

export interface I765Part {
  part: string;
  title: string;
  description: string;
  fields: I765Field[];
}

export const I765_KNOWLEDGE_BASE: I765Part[] = [
  {
    part: "Part 1",
    title: "Information About You",
    description: "Your full legal name, biographic details, and identification information.",
    fields: [
      { id: "i765_name", label: "Full Legal Name (Last, First, Middle)", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.lastName + personal.firstName", instructions: "Enter your full legal name exactly as it appears on your passport.", legalReference: "8 CFR § 274a.12", legalTitle: "Categories of aliens authorized for employment" },
      { id: "i765_dob", label: "Date of Birth", uscisPart: "Part 1", type: "date", required: true, intakeSource: "personal.dateOfBirth", instructions: "Enter your date of birth in MM/DD/YYYY format." },
      { id: "i765_birthCountry", label: "Country of Birth", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.countryOfBirth", instructions: "Enter the country where you were born." },
      { id: "i765_anumber", label: "A-Number (USCIS Number)", uscisPart: "Part 1", type: "text", required: true, intakeSource: "immigration.aNumber", instructions: "Enter your 8 or 9-digit Alien Registration Number." },
      { id: "i765_ssn", label: "Social Security Number", uscisPart: "Part 1", type: "text", required: false, intakeSource: "personal.ssn", instructions: "Enter your SSN if previously issued one." },
      { id: "i765_gender", label: "Gender", uscisPart: "Part 1", type: "select", options: ["Male", "Female"], required: true, intakeSource: "personal.gender", instructions: "Select your gender." },
      { id: "i765_maritalStatus", label: "Marital Status", uscisPart: "Part 1", type: "select", options: ["Single", "Married", "Divorced", "Widowed"], required: true, intakeSource: "family.maritalStatus", instructions: "Select your current marital status." },
    ],
  },
  {
    part: "Part 2",
    title: "Eligibility Category",
    description: "Select the category under which you are applying for employment authorization.",
    fields: [
      { id: "i765_category", label: "Eligibility Category", uscisPart: "Part 2", type: "select", options: ["(c)(9) - Adjustment of Status Applicant", "(c)(8) - Asylum Applicant", "(a)(12) - Refugee", "(c)(33) - Deferred Action (DACA)", "(c)(26) - F-1 Student OPT", "(c)(3) - F-2 Spouse of Student", "(c)(5) - J-2 Spouse of Exchange Visitor", "(c)(6) - L-2 Spouse of Intracompany Transferee", "(c)(31) - TPS Beneficiary", "(c)(11) - Parolee", "Other"], required: true, intakeSource: "immigration.immigrationStatus", instructions: "Select the category that applies to your current immigration status or basis for employment authorization.", evidenceRequired: "Supporting documentation for selected category", legalReference: "8 CFR § 274a.12(a)-(c)", legalTitle: "Categories of employment authorization" },
    ],
  },
  {
    part: "Part 3",
    title: "Address & Contact",
    description: "Your contact information and mailing address.",
    fields: [
      { id: "i765_address", label: "Street Address", uscisPart: "Part 3", type: "text", required: true, intakeSource: "address.street", instructions: "Enter your current residential address." },
      { id: "i765_city", label: "City", uscisPart: "Part 3", type: "text", required: true, intakeSource: "address.city", instructions: "Enter your city of residence." },
      { id: "i765_state", label: "State", uscisPart: "Part 3", type: "text", required: true, intakeSource: "address.state", instructions: "Enter your state of residence." },
      { id: "i765_zip", label: "ZIP Code", uscisPart: "Part 3", type: "text", required: true, intakeSource: "address.zip", instructions: "Enter your 5-digit ZIP code." },
      { id: "i765_phone", label: "Phone Number", uscisPart: "Part 3", type: "text", required: true, intakeSource: "personal.phone", instructions: "Enter a daytime phone number." },
      { id: "i765_email", label: "Email Address", uscisPart: "Part 3", type: "text", required: true, intakeSource: "personal.email", instructions: "Enter your email address for USCIS updates." },
    ],
  },
  {
    part: "Part 4",
    title: "Previous EAD Information",
    description: "Information about any previously issued Employment Authorization Documents.",
    fields: [
      { id: "i765_prevEAD", label: "Have you ever applied for an EAD before?", uscisPart: "Part 4", type: "yesno", required: true, intakeSource: "priorFilings.hasPriorFilings", instructions: "Indicate if you have previously applied for or received an Employment Authorization Document." },
      { id: "i765_prevReceipt", label: "Previous EAD Receipt Number", uscisPart: "Part 4", type: "text", required: false, intakeSource: "priorFilings.priorReceiptNumber", instructions: "Enter the receipt number of any previously filed I-765 application." },
    ],
  },
];

export function getI765Part(part: string): I765Part | undefined {
  return I765_KNOWLEDGE_BASE.find((p) => p.part === part);
}

export function getI765FieldById(id: string): I765Field | undefined {
  for (const part of I765_KNOWLEDGE_BASE) {
    const field = part.fields.find((f) => f.id === id);
    if (field) return field;
  }
}
