export interface I130AField {
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

export interface I130APart {
  part: string;
  title: string;
  description: string;
  fields: I130AField[];
}

export const I130A_KNOWLEDGE_BASE: I130APart[] = [
  {
    part: "Part 1",
    title: "Information About Spouse Beneficiary",
    description: "Biographic and contact details of the spouse who is the beneficiary of an I-130 petition.",
    fields: [
      { id: "i130a_name", label: "Beneficiary's Full Legal Name (Last, First, Middle)", uscisPart: "Part 1", type: "text", required: true, intakeSource: "family.spouseName", instructions: "Enter your full legal name exactly as shown on your passport.", legalReference: "INA § 204(a)(1)(A)(i)", legalTitle: "Petition by spouse" },
      { id: "i130a_dob", label: "Date of Birth", uscisPart: "Part 1", type: "date", required: true, intakeSource: "family.spouseDOB", instructions: "Enter your date of birth in MM/DD/YYYY format." },
      { id: "i130a_birthCountry", label: "Country of Birth", uscisPart: "Part 1", type: "text", required: true, intakeSource: "family.spouseCountryBirth", instructions: "Enter the country where you were born." },
      { id: "i130a_gender", label: "Gender", uscisPart: "Part 1", type: "select", options: ["Male", "Female"], required: true, intakeSource: "personal.gender", instructions: "Select your gender." },
      { id: "i130a_anumber", label: "A-Number", uscisPart: "Part 1", type: "text", required: false, intakeSource: "family.spouseANumber", instructions: "Enter your Alien Registration Number if you have one." },
      { id: "i130a_address", label: "Current Street Address", uscisPart: "Part 1", type: "text", required: true, intakeSource: "address.street", instructions: "Enter your current residential street address." },
      { id: "i130a_city", label: "City", uscisPart: "Part 1", type: "text", required: true, intakeSource: "address.city", instructions: "Enter your current city." },
      { id: "i130a_state", label: "State", uscisPart: "Part 1", type: "text", required: true, intakeSource: "address.state", instructions: "Enter your current state." },
      { id: "i130a_phone", label: "Phone Number", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.phone", instructions: "Enter a phone number where you can be reached." },
      { id: "i130a_email", label: "Email Address", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.email", instructions: "Enter your email address." },
      { id: "i130a_otherNames", label: "Other Names Used", uscisPart: "Part 1", type: "text", required: false, intakeSource: "personal.otherNames", instructions: "List all other names you have used, including maiden name." },
    ],
  },
  {
    part: "Part 2",
    title: "Beneficiary's Parents",
    description: "Information about the beneficiary's biological parents.",
    fields: [
      { id: "i130a_motherName", label: "Mother's Full Name", uscisPart: "Part 2", type: "text", required: true, intakeSource: "family.motherName", instructions: "Enter your biological mother's full name at birth." },
      { id: "i130a_motherBirth", label: "Mother's Country of Birth", uscisPart: "Part 2", type: "text", required: true, intakeSource: "family.motherCountry", instructions: "Enter the country where your mother was born." },
      { id: "i130a_fatherName", label: "Father's Full Name", uscisPart: "Part 2", type: "text", required: true, intakeSource: "family.fatherName", instructions: "Enter your biological father's full name at birth." },
      { id: "i130a_fatherBirth", label: "Father's Country of Birth", uscisPart: "Part 2", type: "text", required: true, intakeSource: "family.fatherCountry", instructions: "Enter the country where your father was born." },
    ],
  },
  {
    part: "Part 3",
    title: "Beneficiary's Marital History",
    description: "Complete history of prior marriages and current marriage details.",
    fields: [
      { id: "i130a_priorMarriages", label: "Number of Prior Marriages", uscisPart: "Part 3", type: "select", options: ["0", "1", "2", "3+"], required: true, intakeSource: "family.priorMarriages", instructions: "Enter the number of times you have been previously married." },
      { id: "i130a_priorMarriageEnd", label: "How prior marriage ended", uscisPart: "Part 3", type: "select", options: ["Divorce", "Annulment", "Death"], required: false, intakeSource: "family.priorMarriageEnd", instructions: "Indicate how your last prior marriage ended." },
      { id: "i130a_priorMarriageDate", label: "Date Prior Marriage Ended", uscisPart: "Part 3", type: "date", required: false, intakeSource: "family.priorMarriageEndDate", instructions: "Enter the date the prior marriage ended." },
    ],
  },
  {
    part: "Part 4",
    title: "Beneficiary's Employment & Education",
    description: "Current and past employment and educational background.",
    fields: [
      { id: "i130a_empEmployer", label: "Current Employer", uscisPart: "Part 4", type: "text", required: false, intakeSource: "employment.currentEmployer", instructions: "Enter your current employer's name." },
      { id: "i130a_empTitle", label: "Job Title", uscisPart: "Part 4", type: "text", required: false, intakeSource: "employment.currentTitle", instructions: "Enter your current job title." },
      { id: "i130a_eduLevel", label: "Highest Level of Education", uscisPart: "Part 4", type: "select", options: ["No Formal Schooling", "Elementary", "High School", "Associate's", "Bachelor's", "Master's", "Doctorate", "Professional Degree"], required: true, intakeSource: "education.highestLevel", instructions: "Select your highest level of education." },
    ],
  },
];

export function getI130APart(part: string): I130APart | undefined {
  return I130A_KNOWLEDGE_BASE.find((p) => p.part === part);
}

export function getI130AFieldById(id: string): I130AField | undefined {
  for (const part of I130A_KNOWLEDGE_BASE) {
    const field = part.fields.find((f) => f.id === id);
    if (field) return field;
  }
}
