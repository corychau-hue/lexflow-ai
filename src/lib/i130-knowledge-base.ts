export interface I130Field {
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

export interface I130Part {
  part: string;
  title: string;
  description: string;
  fields: I130Field[];
}

export const I130_KNOWLEDGE_BASE: I130Part[] = [
  {
    part: "Part 1",
    title: "Relationship to Beneficiary",
    description: "Select the family relationship that qualifies you to file this petition.",
    fields: [
      { id: "i130_relationship", label: "Relationship to Beneficiary", uscisPart: "Part 1", type: "select", options: ["Spouse", "Parent", "Child", "Sibling"], required: true, intakeSource: "family.petitionerRelationship", instructions: "Select your family relationship to the person you are petitioning for.", legalReference: "INA § 203(a)", legalTitle: "Preference allocation for family-sponsored immigrants" },
    ],
  },
  {
    part: "Part 2",
    title: "Information About You (Petitioner)",
    description: "Your full legal name, contact information, and biographic details.",
    fields: [
      { id: "i130_petName", label: "Your Full Legal Name (Last, First, Middle)", uscisPart: "Part 2", type: "text", required: true, intakeSource: "personal.lastName + personal.firstName", instructions: "Enter your full legal name exactly as it appears on your passport or government ID.", legalReference: "INA § 204(a)(1)(A)", legalTitle: "Petition requirements for immediate relatives" },
      { id: "i130_petDOB", label: "Date of Birth", uscisPart: "Part 2", type: "date", required: true, intakeSource: "personal.dateOfBirth", instructions: "Enter your date of birth in MM/DD/YYYY format." },
      { id: "i130_petBirthCountry", label: "Country of Birth", uscisPart: "Part 2", type: "text", required: true, intakeSource: "personal.countryOfBirth", instructions: "Enter the country where you were born." },
      { id: "i130_petCitizenship", label: "Country of Citizenship", uscisPart: "Part 2", type: "text", required: true, intakeSource: "personal.countryOfCitizenship", instructions: "Enter your current country of citizenship." },
      { id: "i130_petAddress", label: "Street Address", uscisPart: "Part 2", type: "text", required: true, intakeSource: "address.street", instructions: "Enter your current residential address." },
      { id: "i130_petCity", label: "City", uscisPart: "Part 2", type: "text", required: true, intakeSource: "address.city", instructions: "Enter your current city of residence." },
      { id: "i130_petState", label: "State", uscisPart: "Part 2", type: "text", required: true, intakeSource: "address.state", instructions: "Enter your current state of residence." },
      { id: "i130_petZip", label: "ZIP Code", uscisPart: "Part 2", type: "text", required: true, intakeSource: "address.zip", instructions: "Enter your 5-digit ZIP code." },
      { id: "i130_petPhone", label: "Phone Number", uscisPart: "Part 2", type: "text", required: true, intakeSource: "personal.phone", instructions: "Enter a daytime phone number where you can be reached." },
      { id: "i130_petEmail", label: "Email Address", uscisPart: "Part 2", type: "text", required: true, intakeSource: "personal.email", instructions: "Enter your email address for case updates." },
      { id: "i130_petMaritalStatus", label: "Marital Status", uscisPart: "Part 2", type: "select", options: ["Single", "Married", "Divorced", "Widowed"], required: true, intakeSource: "family.maritalStatus", instructions: "Select your current marital status." },
      { id: "i130_petANumber", label: "A-Number (if any)", uscisPart: "Part 2", type: "text", required: false, intakeSource: "immigration.aNumber", instructions: "Enter your Alien Registration Number if you are a permanent resident." },
    ],
  },
  {
    part: "Part 3",
    title: "Information About Your Relative (Beneficiary)",
    description: "Information about the person you are petitioning for.",
    fields: [
      { id: "i130_benName", label: "Beneficiary's Full Legal Name (Last, First, Middle)", uscisPart: "Part 3", type: "text", required: true, intakeSource: "family.spouseName", instructions: "Enter the full legal name of the person you are filing this petition for." },
      { id: "i130_benDOB", label: "Beneficiary's Date of Birth", uscisPart: "Part 3", type: "date", required: true, intakeSource: "family.spouseDOB", instructions: "Enter the beneficiary's date of birth." },
      { id: "i130_benBirthCountry", label: "Beneficiary's Country of Birth", uscisPart: "Part 3", type: "text", required: true, intakeSource: "family.spouseCountryBirth", instructions: "Enter the country where the beneficiary was born." },
      { id: "i130_benCitizenship", label: "Beneficiary's Country of Citizenship", uscisPart: "Part 3", type: "text", required: true, intakeSource: "family.spouseStatus", instructions: "Enter the beneficiary's current country of citizenship." },
      { id: "i130_benANumber", label: "Beneficiary's A-Number (if any)", uscisPart: "Part 3", type: "text", required: false, intakeSource: "family.spouseANumber", instructions: "Enter the beneficiary's Alien Registration Number if applicable." },
      { id: "i130_benAddress", label: "Beneficiary's Street Address", uscisPart: "Part 3", type: "text", required: true, intakeSource: "address.street", instructions: "Enter the beneficiary's current residential address." },
      { id: "i130_benMaritalStatus", label: "Beneficiary's Marital Status", uscisPart: "Part 3", type: "select", options: ["Single", "Married", "Divorced", "Widowed"], required: true, intakeSource: "family.maritalStatus", instructions: "Select the beneficiary's current marital status." },
    ],
  },
  {
    part: "Part 4",
    title: "Beneficiary's Parents (if applicable)",
    description: "Information about the beneficiary's parents, required for certain relationships.",
    fields: [
      { id: "i130_benMotherName", label: "Beneficiary's Mother's Full Name", uscisPart: "Part 4", type: "text", required: false, intakeSource: "family.motherName", instructions: "Enter the full name of the beneficiary's mother." },
      { id: "i130_benFatherName", label: "Beneficiary's Father's Full Name", uscisPart: "Part 4", type: "text", required: false, intakeSource: "family.fatherName", instructions: "Enter the full name of the beneficiary's father." },
    ],
  },
  {
    part: "Part 5",
    title: "Beneficiary's Marital History",
    description: "Complete history of the beneficiary's marriages.",
    fields: [
      { id: "i130_benPriorMarriages", label: "Number of Prior Marriages", uscisPart: "Part 5", type: "select", options: ["0", "1", "2", "3+"], required: true, intakeSource: "family.priorMarriages", instructions: "Enter the number of times the beneficiary has been previously married." },
      { id: "i130_benMarriageDate", label: "Date of Current Marriage", uscisPart: "Part 5", type: "date", required: true, intakeSource: "family.marriageDate", instructions: "Enter the date of the beneficiary's current marriage." },
      { id: "i130_benMarriagePlace", label: "Place of Current Marriage", uscisPart: "Part 5", type: "text", required: true, intakeSource: "family.marriagePlace", instructions: "Enter the city and state/country of the current marriage." },
    ],
  },
  {
    part: "Part 6",
    title: "Petitioner's Previous Marriages",
    description: "Information about the petitioner's prior marriages, if any.",
    fields: [
      { id: "i130_petPriorMarriages", label: "Number of Prior Marriages", uscisPart: "Part 6", type: "select", options: ["0", "1", "2", "3+"], required: true, intakeSource: "family.priorMarriages", instructions: "Enter the number of times you have been previously married." },
    ],
  },
];

export function getI130Part(part: string): I130Part | undefined {
  return I130_KNOWLEDGE_BASE.find((p) => p.part === part);
}

export function getI130FieldById(id: string): I130Field | undefined {
  for (const part of I130_KNOWLEDGE_BASE) {
    const field = part.fields.find((f) => f.id === id);
    if (field) return field;
  }
}
