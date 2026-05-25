export interface N400Field {
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

export interface N400Part {
  part: string;
  title: string;
  description: string;
  fields: N400Field[];
}

export const N400_KNOWLEDGE_BASE: N400Part[] = [
  {
    part: "Part 1",
    title: "Information About You (Applicant)",
    description: "Your full legal name, biographic details, and identification information.",
    fields: [
      { id: "n400_name", label: "Full Legal Name (Last, First, Middle)", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.lastName + personal.firstName", instructions: "Enter your full legal name exactly as it appears on your Permanent Resident Card.", legalReference: "INA § 310", legalTitle: "Naturalization authority" },
      { id: "n400_dob", label: "Date of Birth", uscisPart: "Part 1", type: "date", required: true, intakeSource: "personal.dateOfBirth", instructions: "Enter your date of birth in MM/DD/YYYY format." },
      { id: "n400_birthCountry", label: "Country of Birth", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.countryOfBirth", instructions: "Enter the country where you were born." },
      { id: "n400_citizenship", label: "Country of Citizenship", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.countryOfCitizenship", instructions: "Enter your current country of citizenship." },
      { id: "n400_anumber", label: "A-Number (USCIS Number)", uscisPart: "Part 1", type: "text", required: true, intakeSource: "immigration.aNumber", instructions: "Enter your Alien Registration Number from your Green Card." },
      { id: "n400_ssn", label: "Social Security Number", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.ssn", instructions: "Enter your 9-digit Social Security Number." },
      { id: "n400_gender", label: "Gender", uscisPart: "Part 1", type: "select", options: ["Male", "Female"], required: true, intakeSource: "personal.gender", instructions: "Select your gender." },
      { id: "n400_maritalStatus", label: "Marital Status", uscisPart: "Part 1", type: "select", options: ["Single", "Married", "Divorced", "Widowed"], required: true, intakeSource: "family.maritalStatus", instructions: "Select your current marital status." },
      { id: "n400_otherNames", label: "Other Names Used", uscisPart: "Part 1", type: "text", required: false, intakeSource: "personal.otherNames", instructions: "List all other names you have ever used." },
    ],
  },
  {
    part: "Part 2",
    title: "Physical Presence & Residency",
    description: "Your residency history and physical presence in the United States.",
    fields: [
      { id: "n400_residencyYears", label: "Years as a Lawful Permanent Resident", uscisPart: "Part 2", type: "text", required: true, intakeSource: "immigration.immigrationStatus", instructions: "Enter the number of years you have been a lawful permanent resident.", legalReference: "INA § 316(a)", legalTitle: "Residency requirements for naturalization" },
      { id: "n400_dateOfEntry", label: "Date of Entry as Permanent Resident", uscisPart: "Part 2", type: "date", required: true, intakeSource: "immigration.lastArrivalDate", instructions: "Enter the date you became a lawful permanent resident." },
      { id: "n400_placeOfEntry", label: "Place of Entry (City, State)", uscisPart: "Part 2", type: "text", required: true, intakeSource: "immigration.lastArrivalPlace", instructions: "Enter the city and state where you were admitted as a permanent resident." },
      { id: "n400_departureHistory", label: "Departures from U.S. (last 5 years)", uscisPart: "Part 2", type: "textarea", required: true, intakeSource: "immigration.departureHistory", instructions: "List all trips outside the U.S. in the last 5 years including dates and destinations." },
      { id: "n400_address", label: "Current Street Address", uscisPart: "Part 2", type: "text", required: true, intakeSource: "address.street", instructions: "Enter your current residential address." },
      { id: "n400_city", label: "City", uscisPart: "Part 2", type: "text", required: true, intakeSource: "address.city", instructions: "Enter your current city." },
      { id: "n400_state", label: "State", uscisPart: "Part 2", type: "text", required: true, intakeSource: "address.state", instructions: "Enter your current state." },
      { id: "n400_zip", label: "ZIP Code", uscisPart: "Part 2", type: "text", required: true, intakeSource: "address.zip", instructions: "Enter your 5-digit ZIP code." },
    ],
  },
  {
    part: "Part 3",
    title: "Family Information",
    description: "Information about your spouse, children, and parents.",
    fields: [
      { id: "n400_spouseName", label: "Spouse's Full Name", uscisPart: "Part 3", type: "text", required: false, intakeSource: "family.spouseName", instructions: "Enter your spouse's full legal name if married." },
      { id: "n400_spouseDOB", label: "Spouse's Date of Birth", uscisPart: "Part 3", type: "date", required: false, intakeSource: "family.spouseDOB", instructions: "Enter your spouse's date of birth." },
      { id: "n400_spouseCitizen", label: "Is your spouse a U.S. citizen?", uscisPart: "Part 3", type: "yesno", required: false, intakeSource: "family.spouseCitizen", instructions: "Indicate if your spouse is a U.S. citizen." },
      { id: "n400_marriageDate", label: "Date of Marriage", uscisPart: "Part 3", type: "date", required: false, intakeSource: "family.marriageDate", instructions: "Enter your marriage date." },
      { id: "n400_priorMarriages", label: "Number of Prior Marriages", uscisPart: "Part 3", type: "select", options: ["0", "1", "2", "3+"], required: true, intakeSource: "family.priorMarriages", instructions: "Enter the number of times you have been previously married." },
      { id: "n400_childrenCount", label: "Total Number of Children", uscisPart: "Part 3", type: "text", required: true, intakeSource: "family.childrenCount", instructions: "Enter the total number of children you have." },
    ],
  },
  {
    part: "Part 4",
    title: "Employment & Education",
    description: "Your employment history and education.",
    fields: [
      { id: "n400_empEmployer", label: "Current Employer", uscisPart: "Part 4", type: "text", required: false, intakeSource: "employment.currentEmployer", instructions: "Enter your current employer's name." },
      { id: "n400_empTitle", label: "Job Title", uscisPart: "Part 4", type: "text", required: false, intakeSource: "employment.currentTitle", instructions: "Enter your current job title." },
      { id: "n400_empStart", label: "Employment Start Date", uscisPart: "Part 4", type: "date", required: false, intakeSource: "employment.currentStartDate", instructions: "Enter the date you started working for this employer." },
      { id: "n400_eduLevel", label: "Highest Level of Education", uscisPart: "Part 4", type: "select", options: ["No Formal Schooling", "Elementary", "High School", "Associate's", "Bachelor's", "Master's", "Doctorate", "Professional Degree"], required: true, intakeSource: "education.highestLevel", instructions: "Select your highest level of education." },
    ],
  },
  {
    part: "Part 5",
    title: "Good Moral Character",
    description: "Questions about your moral character, criminal history, and eligibility.",
    fields: [
      { id: "n400_arrested", label: "Ever arrested or detained?", uscisPart: "Part 5", type: "yesno", required: true, intakeSource: "criminalHistory.arrested", instructions: "Indicate if you have ever been arrested, cited, or detained by law enforcement.", evidenceRequired: "Certified court dispositions for all arrests", legalReference: "INA § 316(a)(3)", legalTitle: "Good moral character requirement" },
      { id: "n400_convicted", label: "Ever convicted of a crime?", uscisPart: "Part 5", type: "yesno", required: true, intakeSource: "criminalHistory.convicted", instructions: "Indicate if you have ever been convicted of any crime." },
      { id: "n400_militaryService", label: "Ever served in U.S. military?", uscisPart: "Part 5", type: "yesno", required: true, intakeSource: "immigration.militaryService", instructions: "Indicate if you have ever served in the U.S. armed forces.", legalReference: "INA § 328", legalTitle: "Naturalization through military service" },
      { id: "n400_publicBenefits", label: "Ever received public benefits?", uscisPart: "Part 5", type: "yesno", required: true, intakeSource: "immigration.publicBenefits", instructions: "Indicate if you have ever received public assistance." },
      { id: "n400_taxFiled", label: "Have you filed your taxes?", uscisPart: "Part 5", type: "yesno", required: true, intakeSource: "employment.currentEmployer", instructions: "Indicate if you have filed your federal, state, and local taxes for the last 5 years." },
    ],
  },
  {
    part: "Part 6",
    title: "Oath Requirements",
    description: "Questions about your attachment to the U.S. Constitution and willingness to bear arms.",
    fields: [
      { id: "n400_oath", label: "Do you support the U.S. Constitution?", uscisPart: "Part 6", type: "yesno", required: true, intakeSource: "immigration.immigrationStatus", instructions: "Indicate whether you support the principles of the U.S. Constitution.", legalReference: "INA § 337", legalTitle: "Oath of renunciation and allegiance" },
    ],
  },
];

export function getN400Part(part: string): N400Part | undefined {
  return N400_KNOWLEDGE_BASE.find((p) => p.part === part);
}

export function getN400FieldById(id: string): N400Field | undefined {
  for (const part of N400_KNOWLEDGE_BASE) {
    const field = part.fields.find((f) => f.id === id);
    if (field) return field;
  }
}
