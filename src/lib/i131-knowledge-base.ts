export interface I131Field {
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

export interface I131Part {
  part: string;
  title: string;
  description: string;
  fields: I131Field[];
}

export const I131_KNOWLEDGE_BASE: I131Part[] = [
  {
    part: "Part 1",
    title: "Information About You",
    description: "Your full legal name, biographic details, and identification numbers.",
    fields: [
      { id: "i131_name", label: "Full Legal Name (Last, First, Middle)", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.lastName + personal.firstName", instructions: "Enter your full legal name exactly as it appears on your passport.", legalReference: "INA § 212(d)(4)", legalTitle: "Travel document authority" },
      { id: "i131_dob", label: "Date of Birth", uscisPart: "Part 1", type: "date", required: true, intakeSource: "personal.dateOfBirth", instructions: "Enter your date of birth in MM/DD/YYYY format." },
      { id: "i131_birthCountry", label: "Country of Birth", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.countryOfBirth", instructions: "Enter the country where you were born." },
      { id: "i131_anumber", label: "A-Number (USCIS Number)", uscisPart: "Part 1", type: "text", required: true, intakeSource: "immigration.aNumber", instructions: "Enter your Alien Registration Number." },
      { id: "i131_gender", label: "Gender", uscisPart: "Part 1", type: "select", options: ["Male", "Female"], required: true, intakeSource: "personal.gender", instructions: "Select your gender." },
      { id: "i131_maritalStatus", label: "Marital Status", uscisPart: "Part 1", type: "select", options: ["Single", "Married", "Divorced", "Widowed"], required: true, intakeSource: "family.maritalStatus", instructions: "Select your current marital status." },
    ],
  },
  {
    part: "Part 2",
    title: "Travel Document Type",
    description: "Select the type of travel document you are applying for.",
    fields: [
      { id: "i131_docType", label: "Application Type", uscisPart: "Part 2", type: "select", options: ["Advance Parole (I-512)", "Reentry Permit", "Refugee Travel Document"], required: true, intakeSource: "immigration.immigrationStatus", instructions: "Select the type of travel document you need.", legalReference: "INA § 223", legalTitle: "Reentry permits" },
      { id: "i131_travelPurpose", label: "Purpose of Travel", uscisPart: "Part 2", type: "textarea", required: true, intakeSource: "immigration.departureHistory", instructions: "Explain the reason you need to travel outside the United States." },
    ],
  },
  {
    part: "Part 3",
    title: "Planned Travel Information",
    description: "Details about your planned travel itinerary.",
    fields: [
      { id: "i131_departDate", label: "Expected Date of Departure", uscisPart: "Part 3", type: "date", required: false, intakeSource: "immigration.lastArrivalDate", instructions: "Enter when you plan to depart the U.S." },
      { id: "i131_returnDate", label: "Expected Date of Return", uscisPart: "Part 3", type: "date", required: false, intakeSource: "immigration.lastArrivalDate", instructions: "Enter when you plan to return to the U.S." },
      { id: "i131_destCountries", label: "Countries to Visit", uscisPart: "Part 3", type: "textarea", required: true, intakeSource: "personal.countryOfCitizenship", instructions: "List all countries you plan to visit during your travel." },
    ],
  },
  {
    part: "Part 4",
    title: "Address & Contact",
    description: "Your contact information.",
    fields: [
      { id: "i131_address", label: "Street Address", uscisPart: "Part 4", type: "text", required: true, intakeSource: "address.street", instructions: "Enter your current residential address." },
      { id: "i131_city", label: "City", uscisPart: "Part 4", type: "text", required: true, intakeSource: "address.city", instructions: "Enter your city." },
      { id: "i131_state", label: "State", uscisPart: "Part 4", type: "text", required: true, intakeSource: "address.state", instructions: "Enter your state." },
      { id: "i131_zip", label: "ZIP Code", uscisPart: "Part 4", type: "text", required: true, intakeSource: "address.zip", instructions: "Enter your ZIP code." },
      { id: "i131_phone", label: "Phone Number", uscisPart: "Part 4", type: "text", required: true, intakeSource: "personal.phone", instructions: "Enter a daytime phone number." },
      { id: "i131_email", label: "Email Address", uscisPart: "Part 4", type: "text", required: true, intakeSource: "personal.email", instructions: "Enter your email address." },
    ],
  },
];

export function getI131Part(part: string): I131Part | undefined {
  return I131_KNOWLEDGE_BASE.find((p) => p.part === part);
}

export function getI131FieldById(id: string): I131Field | undefined {
  for (const part of I131_KNOWLEDGE_BASE) {
    const field = part.fields.find((f) => f.id === id);
    if (field) return field;
  }
}
