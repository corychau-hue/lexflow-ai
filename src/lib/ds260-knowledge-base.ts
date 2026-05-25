export interface DS260Field {
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

export interface DS260Part {
  part: string;
  title: string;
  description: string;
  fields: DS260Field[];
}

export const DS260_KNOWLEDGE_BASE: DS260Part[] = [
  {
    part: "Part 1",
    title: "Personal Information",
    description: "Full legal name, biographic details, and identification information.",
    fields: [
      { id: "ds260_name", label: "Full Legal Name (Last, First, Middle)", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.lastName + personal.firstName", instructions: "Enter your full legal name exactly as it appears in your passport.", legalReference: "INA § 222", legalTitle: "Application for immigrant visas" },
      { id: "ds260_dob", label: "Date of Birth", uscisPart: "Part 1", type: "date", required: true, intakeSource: "personal.dateOfBirth", instructions: "Enter your date of birth in MM/DD/YYYY format." },
      { id: "ds260_birthCountry", label: "Country of Birth", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.countryOfBirth", instructions: "Enter the country where you were born." },
      { id: "ds260_citizenship", label: "Country of Citizenship", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.countryOfCitizenship", instructions: "Enter your current country of citizenship." },
      { id: "ds260_gender", label: "Gender", uscisPart: "Part 1", type: "select", options: ["Male", "Female"], required: true, intakeSource: "personal.gender", instructions: "Select your gender." },
      { id: "ds260_maritalStatus", label: "Marital Status", uscisPart: "Part 1", type: "select", options: ["Single", "Married", "Divorced", "Widowed"], required: true, intakeSource: "family.maritalStatus", instructions: "Select your current marital status." },
      { id: "ds260_otherNames", label: "Other Names Used", uscisPart: "Part 1", type: "text", required: false, intakeSource: "personal.otherNames", instructions: "List all other names you have used, including maiden name." },
      { id: "ds260_anumber", label: "A-Number (if any)", uscisPart: "Part 1", type: "text", required: false, intakeSource: "immigration.aNumber", instructions: "Enter your Alien Registration Number if you have one." },
    ],
  },
  {
    part: "Part 2",
    title: "Address & Contact",
    description: "Your current and previous addresses and contact information.",
    fields: [
      { id: "ds260_address", label: "Current Street Address", uscisPart: "Part 2", type: "text", required: true, intakeSource: "address.street", instructions: "Enter your current residential address." },
      { id: "ds260_city", label: "City", uscisPart: "Part 2", type: "text", required: true, intakeSource: "address.city", instructions: "Enter your current city." },
      { id: "ds260_state", label: "State/Province", uscisPart: "Part 2", type: "text", required: true, intakeSource: "address.state", instructions: "Enter your current state or province." },
      { id: "ds260_zip", label: "ZIP/Postal Code", uscisPart: "Part 2", type: "text", required: true, intakeSource: "address.zip", instructions: "Enter your ZIP or postal code." },
      { id: "ds260_phone", label: "Phone Number", uscisPart: "Part 2", type: "text", required: true, intakeSource: "personal.phone", instructions: "Enter a phone number where you can be reached." },
      { id: "ds260_email", label: "Email Address", uscisPart: "Part 2", type: "text", required: true, intakeSource: "personal.email", instructions: "Enter your email address." },
    ],
  },
  {
    part: "Part 3",
    title: "Family Information",
    description: "Information about your spouse, children, parents, and siblings.",
    fields: [
      { id: "ds260_spouseName", label: "Spouse's Full Name", uscisPart: "Part 3", type: "text", required: false, intakeSource: "family.spouseName", instructions: "Enter your spouse's full legal name." },
      { id: "ds260_spouseDOB", label: "Spouse's Date of Birth", uscisPart: "Part 3", type: "date", required: false, intakeSource: "family.spouseDOB", instructions: "Enter your spouse's date of birth." },
      { id: "ds260_spouseCitizen", label: "Spouse's Country of Citizenship", uscisPart: "Part 3", type: "text", required: false, intakeSource: "family.spouseCountryBirth", instructions: "Enter your spouse's country of citizenship." },
      { id: "ds260_childrenCount", label: "Number of Children", uscisPart: "Part 3", type: "text", required: true, intakeSource: "family.childrenCount", instructions: "Enter the total number of children you have." },
      { id: "ds260_motherName", label: "Mother's Full Name", uscisPart: "Part 3", type: "text", required: true, intakeSource: "family.motherName", instructions: "Enter your mother's full name at birth." },
      { id: "ds260_fatherName", label: "Father's Full Name", uscisPart: "Part 3", type: "text", required: true, intakeSource: "family.fatherName", instructions: "Enter your father's full name at birth." },
    ],
  },
  {
    part: "Part 4",
    title: "Employment & Education",
    description: "Your employment history and educational background.",
    fields: [
      { id: "ds260_empEmployer", label: "Current Employer", uscisPart: "Part 4", type: "text", required: false, intakeSource: "employment.currentEmployer", instructions: "Enter your current employer's name." },
      { id: "ds260_empTitle", label: "Job Title", uscisPart: "Part 4", type: "text", required: false, intakeSource: "employment.currentTitle", instructions: "Enter your current job title." },
      { id: "ds260_eduLevel", label: "Highest Level of Education", uscisPart: "Part 4", type: "select", options: ["No Formal Schooling", "Elementary", "High School", "Associate's", "Bachelor's", "Master's", "Doctorate", "Professional Degree"], required: true, intakeSource: "education.highestLevel", instructions: "Select your highest level of education." },
    ],
  },
  {
    part: "Part 5",
    title: "Travel & Immigration History",
    description: "Your travel history and prior U.S. immigration history.",
    fields: [
      { id: "ds260_travelHistory", label: "Travel History (last 5 years)", uscisPart: "Part 5", type: "textarea", required: true, intakeSource: "immigration.departureHistory", instructions: "List all international travel in the last 5 years, including countries visited and dates." },
      { id: "ds260_prevApps", label: "Previously filed U.S. immigration applications?", uscisPart: "Part 5", type: "yesno", required: true, intakeSource: "priorFilings.hasPriorFilings", instructions: "Indicate if you have previously filed any U.S. immigration applications." },
      { id: "ds260_priorReceipt", label: "Prior Application Receipt Number", uscisPart: "Part 5", type: "text", required: false, intakeSource: "priorFilings.priorReceiptNumber", instructions: "Enter the receipt number of any prior application." },
    ],
  },
];

export function getDS260Part(part: string): DS260Part | undefined {
  return DS260_KNOWLEDGE_BASE.find((p) => p.part === part);
}

export function getDS260FieldById(id: string): DS260Field | undefined {
  for (const part of DS260_KNOWLEDGE_BASE) {
    const field = part.fields.find((f) => f.id === id);
    if (field) return field;
  }
}
