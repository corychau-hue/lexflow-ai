export interface IntakeData {
  id: string;
  clientId?: string;
  submittedAt: Date;
  personal: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    gender: string;
    email: string;
    phone: string;
    countryOfBirth: string;
    countryOfCitizenship: string;
    otherNames: string;
    ssn: string;
    height: string;
    weight: string;
    hairColor: string;
    eyeColor: string;
    needsAccommodation: boolean;
    smsConsent: boolean;
  };
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
    mailingDifferent: boolean;
    mailingStreet: string;
    mailingCity: string;
    mailingState: string;
    mailingZip: string;
  };
  family: {
    maritalStatus: string;
    spouseName: string;
    spouseDOB: string;
    spouseCountryBirth: string;
    spouseANumber: string;
    spouseCitizen: boolean;
    spouseStatus: string;
    marriageDate: string;
    marriagePlace: string;
    priorMarriages: string;
    priorMarriageEnd: string;
    priorMarriageEndDate: string;
    childrenCount: string;
    childName: string;
    childDOB: string;
    childCitizen: boolean;
    motherName: string;
    motherCountry: string;
    fatherName: string;
    fatherCountry: string;
    parentUSCitizen: boolean;
    siblingsCount: string;
    petitionerRelationship: string;
  };
  immigration: {
    aNumber: string;
    immigrationStatus: string;
    lastArrivalDate: string;
    lastArrivalPlace: string;
    statusAtEntry: string;
    i94Number: string;
    statusExpired: boolean;
    waiverNeeded: boolean;
    removalProceedings: boolean;
    unauthorizedWork: boolean;
    visaViolations: boolean;
    publicBenefits: boolean;
    militaryService: boolean;
    departureHistory: string;
  };
  employment: {
    currentEmployer: string;
    currentTitle: string;
    currentStartDate: string;
    currentAddress: string;
    currentCity: string;
    currentState: string;
    currentDuties: string;
    prevEmployer: string;
    prevTitle: string;
    prevStartDate: string;
    prevEndDate: string;
  };
  education: {
    highestLevel: string;
    schoolName: string;
    schoolLocation: string;
    degreeEarned: string;
    attendedFrom: string;
    attendedTo: string;
  };
  priorFilings: {
    hasPriorFilings: boolean;
    priorFormType: string;
    priorFilingDate: string;
    priorReceiptNumber: string;
  };
  criminalHistory: {
    arrested: boolean;
    arrestExplanation: string;
    convicted: boolean;
    convictionExplanation: string;
  };
}

const defaultIntake: IntakeData = {
  id: "",
  submittedAt: new Date(),
  personal: {
    firstName: "", lastName: "", dateOfBirth: "", gender: "", email: "", phone: "",
    countryOfBirth: "", countryOfCitizenship: "", otherNames: "", ssn: "",
    height: "", weight: "", hairColor: "", eyeColor: "",
    needsAccommodation: false, smsConsent: false,
  },
  address: {
    street: "", city: "", state: "", zip: "",
    mailingDifferent: false, mailingStreet: "", mailingCity: "", mailingState: "", mailingZip: "",
  },
  family: {
    maritalStatus: "", spouseName: "", spouseDOB: "", spouseCountryBirth: "", spouseANumber: "",
    spouseCitizen: false, spouseStatus: "", marriageDate: "", marriagePlace: "",
    priorMarriages: "", priorMarriageEnd: "", priorMarriageEndDate: "",
    childrenCount: "", childName: "", childDOB: "", childCitizen: false,
    motherName: "", motherCountry: "", fatherName: "", fatherCountry: "",
    parentUSCitizen: false, siblingsCount: "", petitionerRelationship: "",
  },
  immigration: {
    aNumber: "", immigrationStatus: "", lastArrivalDate: "", lastArrivalPlace: "", statusAtEntry: "",
    i94Number: "", statusExpired: false, waiverNeeded: false,
    removalProceedings: false, unauthorizedWork: false, visaViolations: false,
    publicBenefits: false, militaryService: false, departureHistory: "",
  },
  employment: {
    currentEmployer: "", currentTitle: "", currentStartDate: "", currentAddress: "", currentCity: "",
    currentState: "", currentDuties: "", prevEmployer: "", prevTitle: "", prevStartDate: "", prevEndDate: "",
  },
  education: {
    highestLevel: "", schoolName: "", schoolLocation: "", degreeEarned: "", attendedFrom: "", attendedTo: "",
  },
  priorFilings: {
    hasPriorFilings: false, priorFormType: "", priorFilingDate: "", priorReceiptNumber: "",
  },
  criminalHistory: {
    arrested: false, arrestExplanation: "", convicted: false, convictionExplanation: "",
  },
};

export function createIntake(): IntakeData {
  return JSON.parse(JSON.stringify(defaultIntake));
}

export async function saveIntake(data: IntakeData): Promise<string> {
  const res = await fetch("/api/intake", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ formData: data }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to save intake");
  }
  const result = await res.json();
  setClientIntakeId(result.intakeId, result.clientId);
  return result.intakeId;
}

export async function getClientIntake(clientId: string): Promise<IntakeData | undefined> {
  try {
    const res = await fetch(`/api/intake/${clientId}`);
    if (!res.ok) return undefined;
    const result = await res.json();
    return result.intake?.formData as IntakeData;
  } catch {
    return undefined;
  }
}

// In-memory mapping of intakeId → clientId (ephemeral, to bridge the gap)
const intakeClientMap = new Map<string, string>();

function setClientIntakeId(intakeId: string, clientId: string) {
  intakeClientMap.set(intakeId, clientId);
}

export function getDefaultIntake(): IntakeData {
  return defaultIntake;
}

export function getSampleIntake(): IntakeData {
  return {
    id: "intake-sample",
    submittedAt: new Date("2026-05-15"),
    clientId: "client-1",
    personal: {
      firstName: "Tran", lastName: "Nguyen", dateOfBirth: "1988-03-15", gender: "Female",
      email: "tran.nguyen@email.com", phone: "(555) 123-4567",
      countryOfBirth: "Vietnam", countryOfCitizenship: "Vietnam", otherNames: "Tran Thi Nguyen", ssn: "XXX-XX-1234",
      height: "5'4\"", weight: "130", hairColor: "Black", eyeColor: "Brown",
      needsAccommodation: false, smsConsent: true,
    },
    address: {
      street: "1234 Main Street", city: "Los Angeles", state: "CA", zip: "90012",
      mailingDifferent: false, mailingStreet: "", mailingCity: "", mailingState: "", mailingZip: "",
    },
    family: {
      maritalStatus: "Married", spouseName: "Michael Nguyen", spouseDOB: "1985-07-22",
      spouseCountryBirth: "United States", spouseANumber: "N/A",
      spouseCitizen: true, spouseStatus: "U.S. Citizen",
      marriageDate: "2022-03-15", marriagePlace: "Los Angeles, California",
      priorMarriages: "0", priorMarriageEnd: "", priorMarriageEndDate: "",
      childrenCount: "0", childName: "", childDOB: "", childCitizen: false,
      motherName: "Linh Nguyen", motherCountry: "Vietnam",
      fatherName: "Binh Nguyen", fatherCountry: "Vietnam",
      parentUSCitizen: false, siblingsCount: "2", petitionerRelationship: "Spouse of U.S. Citizen",
    },
    immigration: {
      aNumber: "A123 456 789", immigrationStatus: "LPR", lastArrivalDate: "2022-06-20",
      lastArrivalPlace: "Los Angeles, CA", statusAtEntry: "K-1 Fiancé(e) Visa",
      i94Number: "98765432101", statusExpired: false, waiverNeeded: false,
      removalProceedings: false, unauthorizedWork: false, visaViolations: false,
      publicBenefits: false, militaryService: false, departureHistory: "No departures since last arrival.",
    },
    employment: {
      currentEmployer: "ABC Corporation", currentTitle: "Software Engineer", currentStartDate: "2023-01-15",
      currentAddress: "500 Tech Boulevard", currentCity: "San Jose", currentState: "CA",
      currentDuties: "Software development and system architecture",
      prevEmployer: "XYZ Solutions", prevTitle: "Junior Developer", prevStartDate: "2020-06-01", prevEndDate: "2022-12-31",
    },
    education: {
      highestLevel: "Bachelor's Degree", schoolName: "University of California",
      schoolLocation: "Los Angeles, CA, USA", degreeEarned: "B.S. Computer Science",
      attendedFrom: "2016-09-01", attendedTo: "2020-06-15",
    },
    priorFilings: {
      hasPriorFilings: true, priorFormType: "I-129F (Fiancé Petition)",
      priorFilingDate: "2021-08-15", priorReceiptNumber: "WACxxxxxxxxx",
    },
    criminalHistory: {
      arrested: false, arrestExplanation: "", convicted: false, convictionExplanation: "",
    },
  };
}
