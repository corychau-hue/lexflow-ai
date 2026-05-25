export interface I485Field {
  id: string;
  label: string;
  uscisPart: string;
  type: "text" | "date" | "select" | "yesno" | "textarea";
  options?: string[];
  required: boolean;
  intakeSource: string;
  instructions: string;
  evidenceRequired?: string;
}

export interface I485Part {
  part: string;
  title: string;
  description: string;
  fields: I485Field[];
}

export const I485_KNOWLEDGE_BASE: I485Part[] = [
  {
    part: "Part 1",
    title: "Information About You",
    description: "Your full legal name, contact information, and biographic details as they appear on your passport.",
    fields: [
      { id: "i485_lastName", label: "Your Full Legal Name (Last, First, Middle)", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.lastName + personal.firstName", instructions: "Enter your family name (surname), first name (given name), and middle name exactly as shown on your passport.", evidenceRequired: "Copy of passport biographical page" },
      { id: "i485_dob", label: "Date of Birth", uscisPart: "Part 1", type: "date", required: true, intakeSource: "personal.dateOfBirth", instructions: "Provide your date of birth in MM/DD/YYYY format. Must match birth certificate.", evidenceRequired: "Birth certificate with certified English translation" },
      { id: "i485_countryBirth", label: "Country of Birth", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.countryOfBirth", instructions: "Enter the country where you were born as it is currently known.", evidenceRequired: "Birth certificate" },
      { id: "i485_countryCitizen", label: "Country of Citizenship", uscisPart: "Part 1", type: "text", required: true, intakeSource: "personal.countryOfCitizenship", instructions: "Enter the country or countries of which you are currently a citizen or national." },
      { id: "i485_ssn", label: "U.S. Social Security Number", uscisPart: "Part 1", type: "text", required: false, intakeSource: "personal.ssn", instructions: "Enter your 9-digit SSN if you have been issued one. Format: XXX-XX-XXXX." },
      { id: "i485_anumber", label: "A-Number (USCIS Number)", uscisPart: "Part 1", type: "text", required: true, intakeSource: "immigration.aNumber", instructions: "Enter your 8 or 9-digit Alien Registration Number. Format: AXXXXXXXX.", evidenceRequired: "Copy of Permanent Resident Card, Employment Authorization Document, or USCIS notice" },
      { id: "i485_gender", label: "Gender", uscisPart: "Part 1", type: "select", options: ["Male", "Female"], required: true, intakeSource: "personal.gender", instructions: "Select your gender." },
      { id: "i485_maritalStatus", label: "Marital Status", uscisPart: "Part 1", type: "select", options: ["Single", "Married", "Divorced", "Widowed"], required: true, intakeSource: "family.maritalStatus", instructions: "Select your current marital status as of the date of filing.", evidenceRequired: "Marriage certificate, divorce decree, or death certificate as applicable" },
      { id: "i485_otherNames", label: "Other Names Used (Maiden, Aliases)", uscisPart: "Part 1", type: "text", required: false, intakeSource: "personal.otherNames", instructions: "List all other names you have ever used, including maiden name, aliases, and nicknames." },
    ],
  },
  {
    part: "Part 2",
    title: "Application Type",
    description: "The basis for your adjustment of status application and any accompanying waivers.",
    fields: [
      { id: "i485_appType", label: "Application Basis", uscisPart: "Part 2", type: "select", options: ["Spouse of U.S. Citizen", "Child of U.S. Citizen", "Parent of U.S. Citizen", "Family-Based Preference", "Employment-Based", "Refugee/Asylee", "VAWA Self-Petitioner", "Other"], required: true, intakeSource: "family.petitionerRelationship", instructions: "Select the basis for your adjustment of status application. This determines which category you are applying under.", evidenceRequired: "Petition approval notice or underlying petition" },
      { id: "i485_waiver", label: "Applying for Waiver of Inadmissibility?", uscisPart: "Part 2", type: "yesno", required: true, intakeSource: "immigration.waiverNeeded", instructions: "Indicate whether you are applying for a waiver of certain grounds of inadmissibility along with this application." },
    ],
  },
  {
    part: "Part 3",
    title: "Address & Contact Information",
    description: "Your current residential address and contact details in the United States.",
    fields: [
      { id: "i485_addrStreet", label: "Street Address", uscisPart: "Part 3", type: "text", required: true, intakeSource: "address.street", instructions: "Enter your current residential street address in the U.S. Include apartment or unit number if applicable.", evidenceRequired: "Lease agreement, utility bill, or bank statement" },
      { id: "i485_addrCity", label: "City", uscisPart: "Part 3", type: "text", required: true, intakeSource: "address.city", instructions: "Enter the city of your current residence." },
      { id: "i485_addrState", label: "State", uscisPart: "Part 3", type: "select", options: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"], required: true, intakeSource: "address.state", instructions: "Select the state of your current residence." },
      { id: "i485_addrZip", label: "ZIP Code", uscisPart: "Part 3", type: "text", required: true, intakeSource: "address.zip", instructions: "Enter your 5-digit ZIP code." },
      { id: "i485_email", label: "Email Address", uscisPart: "Part 3", type: "text", required: true, intakeSource: "personal.email", instructions: "Enter your email address. USCIS may send case updates via email." },
      { id: "i485_phone", label: "Phone Number", uscisPart: "Part 3", type: "text", required: true, intakeSource: "personal.phone", instructions: "Enter a phone number where you can be reached during business hours." },
      { id: "i485_smsConsent", label: "Authorize SMS/Text Messages?", uscisPart: "Part 3", type: "yesno", required: true, intakeSource: "personal.smsConsent", instructions: "Indicate whether you authorize USCIS to send case updates via SMS/text message." },
      { id: "i485_mailAddr", label: "Mailing Address (if different)", uscisPart: "Part 3", type: "yesno", required: false, intakeSource: "address.mailingDifferent", instructions: "Indicate if your mailing address is different from your residential address." },
    ],
  },
  {
    part: "Part 4",
    title: "Disability Accommodations",
    description: "Request for special accommodations for individuals with disabilities or impairments.",
    fields: [
      { id: "i485_accommodation", label: "Do you need a disability accommodation?", uscisPart: "Part 4", type: "yesno", required: true, intakeSource: "personal.needsAccommodation", instructions: "If you are deaf, hard of hearing, have a disability, or have a medical condition that requires special accommodations, indicate yes." },
    ],
  },
  {
    part: "Part 5",
    title: "Employment History (Last 5 Years)",
    description: "Your employment history for the past five years, including current employment.",
    fields: [
      { id: "i485_emp1Employer", label: "Current/Most Recent Employer Name", uscisPart: "Part 5", type: "text", required: true, intakeSource: "employment.currentEmployer", instructions: "Enter the name of your current employer (or most recent if unemployed).", evidenceRequired: "Employment verification letter" },
      { id: "i485_emp1Title", label: "Job Title", uscisPart: "Part 5", type: "text", required: true, intakeSource: "employment.currentTitle", instructions: "Enter your current job title." },
      { id: "i485_emp1Start", label: "Employment Start Date", uscisPart: "Part 5", type: "date", required: true, intakeSource: "employment.currentStartDate", instructions: "Enter the date you started working for this employer." },
      { id: "i485_emp1Addr", label: "Employer Street Address", uscisPart: "Part 5", type: "text", required: true, intakeSource: "employment.currentAddress", instructions: "Enter the street address of your employer." },
      { id: "i485_emp1City", label: "Employer City", uscisPart: "Part 5", type: "text", required: true, intakeSource: "employment.currentCity", instructions: "Enter the city of your employer." },
      { id: "i485_emp1State", label: "Employer State", uscisPart: "Part 5", type: "select", options: ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"], required: true, intakeSource: "employment.currentState", instructions: "Select the state of your employer." },
      { id: "i485_emp1Duties", label: "Job Duties (brief description)", uscisPart: "Part 5", type: "textarea", required: false, intakeSource: "employment.currentDuties", instructions: "Briefly describe your primary job duties and responsibilities." },
      { id: "i485_emp2Employer", label: "Previous Employer (if less than 5 years at current)", uscisPart: "Part 5", type: "text", required: false, intakeSource: "employment.prevEmployer", instructions: "If you have been with your current employer for less than 5 years, enter your previous employer." },
      { id: "i485_emp2Title", label: "Previous Job Title", uscisPart: "Part 5", type: "text", required: false, intakeSource: "employment.prevTitle", instructions: "Enter your previous job title." },
      { id: "i485_emp2Start", label: "Previous Employment Start Date", uscisPart: "Part 5", type: "date", required: false, intakeSource: "employment.prevStartDate", instructions: "Enter the start date for your previous employment." },
      { id: "i485_emp2End", label: "Previous Employment End Date", uscisPart: "Part 5", type: "date", required: false, intakeSource: "employment.prevEndDate", instructions: "Enter the end date for your previous employment." },
    ],
  },
  {
    part: "Part 6",
    title: "Education",
    description: "Your educational background, including highest level of education attained.",
    fields: [
      { id: "i485_eduLevel", label: "Highest Level of Education", uscisPart: "Part 6", type: "select", options: ["No Formal Schooling", "Elementary School", "Middle/Junior High School", "High School", "Associate's Degree", "Bachelor's Degree", "Master's Degree", "Doctorate", "Professional Degree"], required: true, intakeSource: "education.highestLevel", instructions: "Select the highest level of education you have completed.", evidenceRequired: "Diplomas or transcripts" },
      { id: "i485_eduSchool", label: "School or Institution Name", uscisPart: "Part 6", type: "text", required: false, intakeSource: "education.schoolName", instructions: "Enter the name of the school or institution where you earned your highest degree." },
      { id: "i485_eduCity", label: "School City and State/Country", uscisPart: "Part 6", type: "text", required: false, intakeSource: "education.schoolLocation", instructions: "Enter the city and state (or country if outside the U.S.) of the school." },
      { id: "i485_eduDegree", label: "Degree or Certificate Earned", uscisPart: "Part 6", type: "text", required: false, intakeSource: "education.degreeEarned", instructions: "Enter the degree, diploma, or certificate you earned." },
      { id: "i485_eduFrom", label: "Date Attended From", uscisPart: "Part 6", type: "date", required: false, intakeSource: "education.attendedFrom", instructions: "Enter the date you began attending." },
      { id: "i485_eduTo", label: "Date Attended To", uscisPart: "Part 6", type: "date", required: false, intakeSource: "education.attendedTo", instructions: "Enter the date you completed or left the program." },
    ],
  },
  {
    part: "Part 7",
    title: "Additional Information About You",
    description: "Additional biographical and security-related information.",
    fields: [
      { id: "i485_height", label: "Height (feet/inches)", uscisPart: "Part 7", type: "text", required: false, intakeSource: "personal.height", instructions: "Enter your height in feet and inches (e.g., 5'6\")." },
      { id: "i485_weight", label: "Weight (pounds)", uscisPart: "Part 7", type: "text", required: false, intakeSource: "personal.weight", instructions: "Enter your weight in pounds." },
      { id: "i485_hairColor", label: "Hair Color", uscisPart: "Part 7", type: "select", options: ["Black", "Brown", "Blonde", "Red", "Gray", "White", "Bald"], required: false, intakeSource: "personal.hairColor", instructions: "Select your hair color." },
      { id: "i485_eyeColor", label: "Eye Color", uscisPart: "Part 7", type: "select", options: ["Brown", "Blue", "Green", "Hazel", "Gray", "Black"], required: false, intakeSource: "personal.eyeColor", instructions: "Select your eye color." },
    ],
  },
  {
    part: "Part 8",
    title: "Your Parents",
    description: "Information about your biological or legal parents.",
    fields: [
      { id: "i485_motherName", label: "Mother's Full Name (Last, First)", uscisPart: "Part 8", type: "text", required: true, intakeSource: "family.motherName", instructions: "Enter your biological mother's full name at birth." },
      { id: "i485_motherBirth", label: "Mother's Country of Birth", uscisPart: "Part 8", type: "text", required: true, intakeSource: "family.motherCountry", instructions: "Enter the country where your mother was born." },
      { id: "i485_fatherName", label: "Father's Full Name (Last, First)", uscisPart: "Part 8", type: "text", required: true, intakeSource: "family.fatherName", instructions: "Enter your biological father's full name at birth." },
      { id: "i485_fatherBirth", label: "Father's Country of Birth", uscisPart: "Part 8", type: "text", required: true, intakeSource: "family.fatherCountry", instructions: "Enter the country where your father was born." },
      { id: "i485_parentsUSCitizen", label: "Are either of your parents U.S. citizens?", uscisPart: "Part 8", type: "yesno", required: true, intakeSource: "family.parentUSCitizen", instructions: "Indicate if either parent is a U.S. citizen." },
    ],
  },
  {
    part: "Part 9",
    title: "Your Spouse",
    description: "Information about your current spouse if you are married.",
    fields: [
      { id: "i485_spouseName", label: "Spouse's Full Name (Last, First, Middle)", uscisPart: "Part 9", type: "text", required: true, intakeSource: "family.spouseName", instructions: "Enter your spouse's full legal name.", evidenceRequired: "Spouse's birth certificate or passport" },
      { id: "i485_spouseDOB", label: "Spouse's Date of Birth", uscisPart: "Part 9", type: "date", required: true, intakeSource: "family.spouseDOB", instructions: "Enter your spouse's date of birth." },
      { id: "i485_spouseBirth", label: "Spouse's Country of Birth", uscisPart: "Part 9", type: "text", required: true, intakeSource: "family.spouseCountryBirth", instructions: "Enter the country where your spouse was born." },
      { id: "i485_spouseANumber", label: "Spouse's A-Number (if any)", uscisPart: "Part 9", type: "text", required: false, intakeSource: "family.spouseANumber", instructions: "Enter your spouse's Alien Registration Number if they have one." },
      { id: "i485_marriageDate", label: "Date of Marriage", uscisPart: "Part 9", type: "date", required: true, intakeSource: "family.marriageDate", instructions: "Enter the date you were married.", evidenceRequired: "Marriage certificate" },
      { id: "i485_marriagePlace", label: "Place of Marriage (City, State/Country)", uscisPart: "Part 9", type: "text", required: true, intakeSource: "family.marriagePlace", instructions: "Enter the city and state or country where you were married." },
      { id: "i485_spouseCitizen", label: "Is your spouse a U.S. citizen?", uscisPart: "Part 9", type: "yesno", required: true, intakeSource: "family.spouseCitizen", instructions: "Indicate if your spouse is a U.S. citizen.", evidenceRequired: "Spouse's U.S. passport, naturalization certificate, or birth certificate" },
      { id: "i485_spouseStatus", label: "Spouse's Immigration Status", uscisPart: "Part 9", type: "select", options: ["U.S. Citizen", "Lawful Permanent Resident", "Asylee/Refugee", "Nonimmigrant", "Other"], required: true, intakeSource: "family.spouseStatus", instructions: "Select your spouse's current immigration status." },
    ],
  },
  {
    part: "Part 10",
    title: "Your Children",
    description: "Information about all of your children, regardless of age or where they live.",
    fields: [
      { id: "i485_childrenCount", label: "Number of Children", uscisPart: "Part 10", type: "select", options: ["0", "1", "2", "3", "4", "5+"], required: true, intakeSource: "family.childrenCount", instructions: "Enter the total number of children you have, including stepchildren, adopted children, and children born abroad.", evidenceRequired: "Birth certificates for all children" },
      { id: "i485_child1Name", label: "Child's Full Name (if applicable)", uscisPart: "Part 10", type: "text", required: false, intakeSource: "family.childName", instructions: "Enter your child's full name." },
      { id: "i485_child1DOB", label: "Child's Date of Birth", uscisPart: "Part 10", type: "date", required: false, intakeSource: "family.childDOB", instructions: "Enter child's date of birth." },
      { id: "i485_child1Citizen", label: "Is this child a U.S. citizen?", uscisPart: "Part 10", type: "yesno", required: false, intakeSource: "family.childCitizen", instructions: "Indicate if the child is a U.S. citizen." },
    ],
  },
  {
    part: "Part 11",
    title: "Your Siblings",
    description: "Information about your brothers and sisters (if applicable).",
    fields: [
      { id: "i485_siblingsCount", label: "Number of Siblings", uscisPart: "Part 11", type: "select", options: ["0", "1", "2", "3", "4", "5+"], required: true, intakeSource: "family.siblingsCount", instructions: "Enter the total number of brothers and sisters you have (including half-siblings and step-siblings)." },
    ],
  },
  {
    part: "Part 12",
    title: "Your Marital History",
    description: "Complete history of all your marriages and those of your prior spouses.",
    fields: [
      { id: "i485_priorMarriages", label: "Number of Prior Marriages (yours)", uscisPart: "Part 12", type: "select", options: ["0", "1", "2", "3+"], required: true, intakeSource: "family.priorMarriages", instructions: "Enter the number of times you have been previously married (excluding current marriage).", evidenceRequired: "Divorce decrees or death certificates for each prior marriage" },
      { id: "i485_priorMarriage1End", label: "How did the prior marriage end?", uscisPart: "Part 12", type: "select", options: ["Divorce", "Annulment", "Death"], required: false, intakeSource: "family.priorMarriageEnd", instructions: "Indicate how your prior marriage ended." },
      { id: "i485_priorMarriage1Date", label: "Date Prior Marriage Ended", uscisPart: "Part 12", type: "date", required: false, intakeSource: "family.priorMarriageEndDate", instructions: "Enter the date the divorce was finalized, annulment was granted, or spouse passed away." },
    ],
  },
  {
    part: "Part 13",
    title: "Your Previous Immigration History",
    description: "Complete history of your immigration status, entries, and departures from the United States.",
    fields: [
      { id: "i485_lastArrival", label: "Date of Last Arrival in the U.S.", uscisPart: "Part 13", type: "date", required: true, intakeSource: "immigration.lastArrivalDate", instructions: "Enter the date of your most recent arrival in the United States.", evidenceRequired: "I-94 Arrival/Departure Record" },
      { id: "i485_lastArrivalPlace", label: "Place of Last Arrival (City, State)", uscisPart: "Part 13", type: "text", required: true, intakeSource: "immigration.lastArrivalPlace", instructions: "Enter the city and state where you last entered the United States." },
      { id: "i485_statusAtEntry", label: "Immigration Status at Last Arrival", uscisPart: "Part 13", type: "text", required: true, intakeSource: "immigration.statusAtEntry", instructions: "Enter the immigration status or visa type you held when you last entered.", evidenceRequired: "Copy of visa and I-94" },
      { id: "i485_i94Number", label: "I-94 Number", uscisPart: "Part 13", type: "text", required: false, intakeSource: "immigration.i94Number", instructions: "Enter your I-94 admission number if available." },
      { id: "i485_statusExpired", label: "Has your status ever expired?", uscisPart: "Part 13", type: "yesno", required: true, intakeSource: "immigration.statusExpired", instructions: "Indicate if you have ever overstayed your authorized period of stay." },
      { id: "i485_departureHistory", label: "All departures from U.S. in last 5 years", uscisPart: "Part 13", type: "textarea", required: false, intakeSource: "immigration.departureHistory", instructions: "List all trips outside the U.S. in the last 5 years including dates and destinations." },
    ],
  },
  {
    part: "Part 14",
    title: "Additional Application Information",
    description: "Security, inadmissibility, and background-related questions.",
    fields: [
      { id: "i485_removalProceedings", label: "Ever placed in removal/deportation proceedings?", uscisPart: "Part 14", type: "yesno", required: true, intakeSource: "immigration.removalProceedings", instructions: "Indicate if you have ever been placed in removal, deportation, or exclusion proceedings." },
      { id: "i485_unauthorizedWork", label: "Ever worked without authorization?", uscisPart: "Part 14", type: "yesno", required: true, intakeSource: "immigration.unauthorizedWork", instructions: "Indicate if you have ever engaged in unauthorized employment in the United States." },
      { id: "i485_criminalHistory", label: "Ever arrested or convicted of a crime?", uscisPart: "Part 14", type: "yesno", required: true, intakeSource: "criminalHistory.arrested", instructions: "Indicate if you have ever been arrested, cited, or convicted of any crime, including DUI and traffic violations (excluding minor traffic offenses).", evidenceRequired: "Certified court dispositions for all arrests/charges" },
      { id: "i485_visaViolations", label: "Ever violated terms of nonimmigrant status?", uscisPart: "Part 14", type: "yesno", required: true, intakeSource: "immigration.visaViolations", instructions: "Indicate if you have ever violated the terms and conditions of your nonimmigrant status." },
      { id: "i485_publicCharge", label: "Ever received public benefits?", uscisPart: "Part 14", type: "yesno", required: true, intakeSource: "immigration.publicBenefits", instructions: "Indicate if you have ever received public benefits (Medicaid, SNAP, housing assistance, etc.)." },
      { id: "i485_militaryService", label: "Ever served in the U.S. military?", uscisPart: "Part 14", type: "yesno", required: true, intakeSource: "immigration.militaryService", instructions: "Indicate whether you have ever served in the U.S. armed forces." },
      { id: "i485_priorApps", label: "Ever filed any immigration application before?", uscisPart: "Part 14", type: "yesno", required: true, intakeSource: "priorFilings.hasPriorFilings", instructions: "Indicate whether you have previously filed any immigration petition or application with USCIS." },
    ],
  },
];

export function getI485Part(part: string): I485Part | undefined {
  return I485_KNOWLEDGE_BASE.find((p) => p.part === part);
}

export function getFieldById(id: string): I485Field | undefined {
  for (const part of I485_KNOWLEDGE_BASE) {
    const field = part.fields.find((f) => f.id === id);
    if (field) return field;
  }
}

export const EVIDENCE_CHECKLIST: { item: string; uscisParts: string[]; notes: string }[] = [
  { item: "Passport-style photographs (2)", uscisParts: ["Part 1"], notes: "2×2 inches, white background, taken within 30 days" },
  { item: "Copy of passport (biographical page)", uscisParts: ["Part 1"], notes: "All pages with visas, stamps, or markings" },
  { item: "Birth certificate with English translation", uscisParts: ["Part 1", "Part 8"], notes: "Certified translation with translator's certification" },
  { item: "Marriage certificate", uscisParts: ["Part 1", "Part 9"], notes: "Certified copy from issuing authority" },
  { item: "Divorce decrees (all prior marriages)", uscisParts: ["Part 1", "Part 12"], notes: "Certified copies for each prior marriage dissolution" },
  { item: "Form I-94 Arrival/Departure Record", uscisParts: ["Part 13"], notes: "Print from CBP website or copy of paper I-94" },
  { item: "Form I-864 Affidavit of Support", uscisParts: ["Part 2"], notes: "Signed by sponsor with supporting tax documents" },
  { item: "Federal tax returns + transcripts (3 years)", uscisParts: ["Part 5"], notes: "Signed copies and IRS transcripts for most recent 3 years" },
  { item: "Employment verification letter", uscisParts: ["Part 5"], notes: "On company letterhead, stating position, salary, and date of hire" },
  { item: "Pay stubs (last 6 months)", uscisParts: ["Part 5"], notes: "Consecutive monthly or bi-weekly pay stubs" },
  { item: "Form I-693 Medical Examination (sealed)", uscisParts: ["Part 1"], notes: "Must remain in sealed envelope from civil surgeon" },
  { item: "Evidence of bona fide marriage", uscisParts: ["Part 9"], notes: "Joint lease, joint bank accounts, photos, insurance, affidavits" },
  { item: "Police clearance certificates", uscisParts: ["Part 14"], notes: "From countries where you lived 6+ months since age 16" },
  { item: "Certified court dispositions", uscisParts: ["Part 14"], notes: "For all arrests, citations, or convictions" },
];

export function getEvidenceForPart(part: string): typeof EVIDENCE_CHECKLIST {
  return EVIDENCE_CHECKLIST.filter((e) => e.uscisParts.includes(part));
}
