export interface I864Field {
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

export interface I864Part {
  part: string;
  title: string;
  description: string;
  fields: I864Field[];
}

export const I864_KNOWLEDGE_BASE: I864Part[] = [
  {
    part: "Part 1",
    title: "Sponsor Information",
    description: "Your full legal name, contact information, and biographic details as the sponsor.",
    fields: [
      { id: "i864_sponsorName", label: "Sponsor's Full Legal Name (Last, First, Middle)", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.lastName + personal.firstName", instructions: "Enter your full legal name as the sponsor.", legalReference: "INA § 213A", legalTitle: "Affidavit of support requirements" },
      { id: "i864_sponsorDOB", label: "Date of Birth", uscisPart: "Part 1", type: "date", required: true, intakeSource: "personal.dateOfBirth", instructions: "Enter your date of birth." },
      { id: "i864_sponsorBirthCountry", label: "Country of Birth", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.countryOfBirth", instructions: "Enter your country of birth." },
      { id: "i864_sponsorCitizenship", label: "Country of Citizenship", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.countryOfCitizenship", instructions: "Enter your country of citizenship." },
      { id: "i864_sponsorAddress", label: "Street Address", uscisPart: "Part 1", type: "text", required: true, intakeSource: "address.street", instructions: "Enter your current residential address in the U.S." },
      { id: "i864_sponsorCity", label: "City", uscisPart: "Part 1", type: "text", required: true, intakeSource: "address.city", instructions: "Enter your city." },
      { id: "i864_sponsorState", label: "State", uscisPart: "Part 1", type: "text", required: true, intakeSource: "address.state", instructions: "Enter your state." },
      { id: "i864_sponsorZip", label: "ZIP Code", uscisPart: "Part 1", type: "text", required: true, intakeSource: "address.zip", instructions: "Enter your 5-digit ZIP code." },
      { id: "i864_sponsorPhone", label: "Phone Number", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.phone", instructions: "Enter your daytime phone number." },
      { id: "i864_sponsorEmail", label: "Email Address", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.email", instructions: "Enter your email address." },
      { id: "i864_sponsorANumber", label: "A-Number", uscisPart: "Part 1", type: "text", required: false, intakeSource: "immigration.aNumber", instructions: "Enter your Alien Registration Number if you are a permanent resident." },
      { id: "i864_sponsorSSN", label: "Social Security Number", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.ssn", instructions: "Enter your 9-digit Social Security Number." },
    ],
  },
  {
    part: "Part 2",
    title: "Sponsor's Employment & Income",
    description: "Employment information and income details to demonstrate financial ability.",
    fields: [
      { id: "i864_empEmployer", label: "Current Employer Name", uscisPart: "Part 2", type: "text", required: true, intakeSource: "employment.currentEmployer", instructions: "Enter the name of your current employer.", evidenceRequired: "Employment verification letter + recent pay stubs" },
      { id: "i864_empTitle", label: "Job Title", uscisPart: "Part 2", type: "text", required: true, intakeSource: "employment.currentTitle", instructions: "Enter your current job title." },
      { id: "i864_empStart", label: "Employment Start Date", uscisPart: "Part 2", type: "date", required: true, intakeSource: "employment.currentStartDate", instructions: "Enter the date you started working for this employer." },
      { id: "i864_empAddress", label: "Employer Address", uscisPart: "Part 2", type: "text", required: true, intakeSource: "employment.currentAddress", instructions: "Enter your employer's street address." },
      { id: "i864_empCity", label: "Employer City", uscisPart: "Part 2", type: "text", required: true, intakeSource: "employment.currentCity", instructions: "Enter your employer's city." },
      { id: "i864_empState", label: "Employer State", uscisPart: "Part 2", type: "text", required: true, intakeSource: "employment.currentState", instructions: "Enter your employer's state." },
    ],
  },
  {
    part: "Part 3",
    title: "Household Size",
    description: "Number of people in your household for determining poverty line requirements.",
    fields: [
      { id: "i864_householdSize", label: "Total Household Size", uscisPart: "Part 3", type: "text", required: true, intakeSource: "family.childrenCount", instructions: "Enter the total number of people in your household, including yourself, your spouse, dependents, and the immigrant(s) you are sponsoring.", evidenceRequired: "Proof of relationship for each household member", legalReference: "INA § 213A(f)(4)", legalTitle: "Household size determination" },
      { id: "i864_spouseIncluded", label: "Is your spouse included in household?", uscisPart: "Part 3", type: "yesno", required: true, intakeSource: "family.maritalStatus", instructions: "Indicate whether your spouse is part of your household." },
    ],
  },
  {
    part: "Part 4",
    title: "Beneficiary Information",
    description: "Information about the person(s) you are sponsoring.",
    fields: [
      { id: "i864_beneficiaryName", label: "Principal Beneficiary's Full Name", uscisPart: "Part 4", type: "text", required: true, intakeSource: "family.spouseName", instructions: "Enter the full name of the person you are sponsoring." },
      { id: "i864_beneficiaryRelation", label: "Relationship to Beneficiary", uscisPart: "Part 4", type: "text", required: true, intakeSource: "family.petitionerRelationship", instructions: "State your relationship to the beneficiary." },
    ],
  },
  {
    part: "Part 5",
    title: "Assets",
    description: "Information about your assets that can be counted toward the income requirement.",
    fields: [
      { id: "i864_assetValue", label: "Total Cash Value of Assets", uscisPart: "Part 5", type: "text", required: false, intakeSource: "employment.currentEmployer", instructions: "Enter the total value of your assets (savings, stocks, property equity, etc.)", legalReference: "INA § 213A(f)(3)", legalTitle: "Assets counted toward support" },
    ],
  },
];

export function getI864Part(part: string): I864Part | undefined {
  return I864_KNOWLEDGE_BASE.find((p) => p.part === part);
}

export function getI864FieldById(id: string): I864Field | undefined {
  for (const part of I864_KNOWLEDGE_BASE) {
    const field = part.fields.find((f) => f.id === id);
    if (field) return field;
  }
}
