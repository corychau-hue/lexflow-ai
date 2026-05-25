"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { UserPlus, ChevronDown, ChevronUp, Upload } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea, Select } from "@/components/ui/textarea";
import { createIntake, saveIntake } from "@/lib/intake-store";

const US_STATES = [
  { value: "AL", label: "Alabama" }, { value: "AK", label: "Alaska" }, { value: "AZ", label: "Arizona" },
  { value: "AR", label: "Arkansas" }, { value: "CA", label: "California" }, { value: "CO", label: "Colorado" },
  { value: "CT", label: "Connecticut" }, { value: "DE", label: "Delaware" }, { value: "FL", label: "Florida" },
  { value: "GA", label: "Georgia" }, { value: "HI", label: "Hawaii" }, { value: "ID", label: "Idaho" },
  { value: "IL", label: "Illinois" }, { value: "IN", label: "Indiana" }, { value: "IA", label: "Iowa" },
  { value: "KS", label: "Kansas" }, { value: "KY", label: "Kentucky" }, { value: "LA", label: "Louisiana" },
  { value: "ME", label: "Maine" }, { value: "MD", label: "Maryland" }, { value: "MA", label: "Massachusetts" },
  { value: "MI", label: "Michigan" }, { value: "MN", label: "Minnesota" }, { value: "MS", label: "Mississippi" },
  { value: "MO", label: "Missouri" }, { value: "MT", label: "Montana" }, { value: "NE", label: "Nebraska" },
  { value: "NV", label: "Nevada" }, { value: "NH", label: "New Hampshire" }, { value: "NJ", label: "New Jersey" },
  { value: "NM", label: "New Mexico" }, { value: "NY", label: "New York" }, { value: "NC", label: "North Carolina" },
  { value: "ND", label: "North Dakota" }, { value: "OH", label: "Ohio" }, { value: "OK", label: "Oklahoma" },
  { value: "OR", label: "Oregon" }, { value: "PA", label: "Pennsylvania" }, { value: "RI", label: "Rhode Island" },
  { value: "SC", label: "South Carolina" }, { value: "SD", label: "South Dakota" }, { value: "TN", label: "Tennessee" },
  { value: "TX", label: "Texas" }, { value: "UT", label: "Utah" }, { value: "VT", label: "Vermont" },
  { value: "VA", label: "Virginia" }, { value: "WA", label: "Washington" }, { value: "WV", label: "West Virginia" },
  { value: "WI", label: "Wisconsin" }, { value: "WY", label: "Wyoming" },
];

const sections = [
  { id: "personal", label: "Personal Information" },
  { id: "address", label: "Address & Contact" },
  { id: "family", label: "Family & Marital History" },
  { id: "education", label: "Education" },
  { id: "employment", label: "Employment History" },
  { id: "immigration", label: "Immigration History" },
  { id: "filings", label: "Prior Immigration Filings" },
  { id: "criminal", label: "Criminal & Background History" },
  { id: "injury", label: "Injury Case Information" },
  { id: "estate", label: "Estate Planning Information" },
  { id: "documents", label: "Document Upload" },
];

export default function NewIntakePage() {
  const { data: session, status } = useSession();
  const [openSections, setOpenSections] = useState<Set<string>>(new Set(["personal"]));
  const [language, setLanguage] = useState("ENGLISH");
  const [submitted, setSubmitted] = useState(false);
  const [intakeId, setIntakeId] = useState("");

  // Form state
  const [form, setForm] = useState(createIntake());

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  const updateField = (section: string, field: string, value: any) => {
    setForm((prev: any) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const toggleSection = (id: string) => {
    const newOpen = new Set(openSections);
    if (newOpen.has(id)) newOpen.delete(id);
    else newOpen.add(id);
    setOpenSections(newOpen);
  };

  const handleSubmit = async () => {
    const id = await saveIntake(form);
    setIntakeId(id);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <UserPlus size={32} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Intake Submitted</h1>
        <p className="text-slate-500 mt-2">Intake ID: {intakeId}. The data is now available for I-485 form preparation.</p>
        <p className="text-xs text-slate-400 mt-1">Go to the immigration workflow to generate the I-485 with this intake data.</p>
        <div className="flex gap-3 justify-center mt-6">
          <Button variant="primary" onClick={() => { setSubmitted(false); setForm(createIntake()); }}>New Intake</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">New Client Intake</h1>
        <p className="text-sm text-slate-500 mt-1">
          Complete all relevant sections. Data flows directly to I-485 and other USCIS forms.
        </p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Select
              label="Language Preference"
              options={[
                { value: "ENGLISH", label: "English" },
                { value: "VIETNAMESE", label: "Tiếng Việt" },
                { value: "CHINESE", label: "中文" },
                { value: "SPANISH", label: "Español" },
              ]}
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-48"
            />
          </div>

          <div className="space-y-3">
            {sections.map((section) => (
              <div key={section.id} className="border border-slate-200 rounded-lg overflow-hidden">
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100 transition-colors"
                >
                  <span className="font-medium text-sm text-slate-800">{section.label}</span>
                  {openSections.has(section.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>
                {openSections.has(section.id) && (
                  <div className="p-4 space-y-4">
                    {/* ===== PERSONAL INFORMATION ===== */}
                    {section.id === "personal" && (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="First Name" placeholder="First name" value={form.personal.firstName} onChange={(e) => updateField("personal", "firstName", e.target.value)} />
                          <Input label="Last Name" placeholder="Last name" value={form.personal.lastName} onChange={(e) => updateField("personal", "lastName", e.target.value)} />
                          <Input label="Email" type="email" placeholder="client@email.com" value={form.personal.email} onChange={(e) => updateField("personal", "email", e.target.value)} />
                          <Input label="Phone" type="tel" placeholder="(555) 123-4567" value={form.personal.phone} onChange={(e) => updateField("personal", "phone", e.target.value)} />
                          <Input label="Date of Birth" type="date" value={form.personal.dateOfBirth} onChange={(e) => updateField("personal", "dateOfBirth", e.target.value)} />
                          <Input label="SSN (if any)" placeholder="XXX-XX-XXXX" value={form.personal.ssn} onChange={(e) => updateField("personal", "ssn", e.target.value)} />
                          <Select label="Gender" options={[{ value: "Male", label: "Male" }, { value: "Female", label: "Female" }]} placeholder="Select gender..." value={form.personal.gender} onChange={(e) => updateField("personal", "gender", e.target.value)} />
                          <Input label="Country of Birth" placeholder="e.g., Vietnam" value={form.personal.countryOfBirth} onChange={(e) => updateField("personal", "countryOfBirth", e.target.value)} />
                          <Input label="Country of Citizenship" placeholder="e.g., Vietnam" value={form.personal.countryOfCitizenship} onChange={(e) => updateField("personal", "countryOfCitizenship", e.target.value)} />
                          <Input label="Other Names Used (Maiden, Aliases)" placeholder="Any other names" value={form.personal.otherNames} onChange={(e) => updateField("personal", "otherNames", e.target.value)} />
                          <Input label="Height (feet/inches)" placeholder="Height" value={form.personal.height} onChange={(e) => updateField("personal", "height", e.target.value)} />
                          <Input label="Weight (lbs)" placeholder="Weight" value={form.personal.weight} onChange={(e) => updateField("personal", "weight", e.target.value)} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <Select label="Hair Color" options={[{ value: "Black", label: "Black" }, { value: "Brown", label: "Brown" }, { value: "Blonde", label: "Blonde" }, { value: "Red", label: "Red" }, { value: "Gray", label: "Gray" }, { value: "White", label: "White" }, { value: "Bald", label: "Bald" }]} placeholder="Select..." value={form.personal.hairColor} onChange={(e) => updateField("personal", "hairColor", e.target.value)} />
                          <Select label="Eye Color" options={[{ value: "Brown", label: "Brown" }, { value: "Blue", label: "Blue" }, { value: "Green", label: "Green" }, { value: "Hazel", label: "Hazel" }, { value: "Gray", label: "Gray" }]} placeholder="Select..." value={form.personal.eyeColor} onChange={(e) => updateField("personal", "eyeColor", e.target.value)} />
                        </div>
                        <div className="flex items-center gap-6">
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" className="rounded border-slate-300 accent-accent-600" checked={form.personal.smsConsent} onChange={(e) => updateField("personal", "smsConsent", e.target.checked)} />
                            Authorize SMS updates
                          </label>
                          <label className="flex items-center gap-2 text-sm">
                            <input type="checkbox" className="rounded border-slate-300 accent-accent-600" checked={form.personal.needsAccommodation} onChange={(e) => updateField("personal", "needsAccommodation", e.target.checked)} />
                            Need disability accommodation
                          </label>
                        </div>
                      </>
                    )}

                    {/* ===== ADDRESS & CONTACT ===== */}
                    {section.id === "address" && (
                      <>
                        <p className="text-xs text-slate-500">Current U.S. residential address</p>
                        <Input label="Street Address" placeholder="123 Main Street" value={form.address.street} onChange={(e) => updateField("address", "street", e.target.value)} />
                        <div className="grid grid-cols-3 gap-4">
                          <Input label="City" placeholder="City" value={form.address.city} onChange={(e) => updateField("address", "city", e.target.value)} />
                          <Select label="State" options={US_STATES} placeholder="State" value={form.address.state} onChange={(e) => updateField("address", "state", e.target.value)} />
                          <Input label="ZIP Code" placeholder="90012" value={form.address.zip} onChange={(e) => updateField("address", "zip", e.target.value)} />
                        </div>
                        <div className="mt-4 p-4 rounded-lg border border-slate-200">
                          <label className="flex items-center gap-2 text-sm mb-3">
                            <input type="checkbox" className="rounded border-slate-300 accent-accent-600" checked={form.address.mailingDifferent} onChange={(e) => updateField("address", "mailingDifferent", e.target.checked)} />
                            Mailing address is different from residential
                          </label>
                          {form.address.mailingDifferent && (
                            <div className="space-y-3">
                              <Input label="Mailing Street Address" placeholder="P.O. Box or street" value={form.address.mailingStreet} onChange={(e) => updateField("address", "mailingStreet", e.target.value)} />
                              <div className="grid grid-cols-3 gap-4">
                                <Input label="City" placeholder="City" value={form.address.mailingCity} onChange={(e) => updateField("address", "mailingCity", e.target.value)} />
                                <Select label="State" options={US_STATES} placeholder="State" value={form.address.mailingState} onChange={(e) => updateField("address", "mailingState", e.target.value)} />
                                <Input label="ZIP Code" placeholder="90012" value={form.address.mailingZip} onChange={(e) => updateField("address", "mailingZip", e.target.value)} />
                              </div>
                            </div>
                          )}
                        </div>
                      </>
                    )}

                    {/* ===== FAMILY & MARITAL HISTORY ===== */}
                    {section.id === "family" && (
                      <>
                        <Select label="Marital Status" options={[{ value: "Single", label: "Single" }, { value: "Married", label: "Married" }, { value: "Divorced", label: "Divorced" }, { value: "Widowed", label: "Widowed" }]} placeholder="Select marital status..." value={form.family.maritalStatus} onChange={(e) => updateField("family", "maritalStatus", e.target.value)} />
                        <div className="border-t border-slate-200 pt-4">
                          <p className="text-sm font-medium text-slate-700 mb-3">Spouse Information</p>
                          <div className="grid grid-cols-2 gap-4">
                            <Input label="Spouse Full Name (Last, First)" placeholder="Last, First" value={form.family.spouseName} onChange={(e) => updateField("family", "spouseName", e.target.value)} />
                            <Input label="Spouse Date of Birth" type="date" value={form.family.spouseDOB} onChange={(e) => updateField("family", "spouseDOB", e.target.value)} />
                            <Input label="Spouse Country of Birth" placeholder="e.g., United States" value={form.family.spouseCountryBirth} onChange={(e) => updateField("family", "spouseCountryBirth", e.target.value)} />
                            <Input label="Spouse A-Number (if any)" placeholder="N/A if none" value={form.family.spouseANumber} onChange={(e) => updateField("family", "spouseANumber", e.target.value)} />
                            <Select label="Is your spouse a U.S. citizen?" options={[{ value: "true", label: "Yes" }, { value: "false", label: "No" }]} placeholder="Select..." value={String(form.family.spouseCitizen)} onChange={(e) => updateField("family", "spouseCitizen", e.target.value === "true")} />
                            <Select label="Spouse Immigration Status" options={[{ value: "U.S. Citizen", label: "U.S. Citizen" }, { value: "Lawful Permanent Resident", label: "Lawful Permanent Resident" }, { value: "Asylee/Refugee", label: "Asylee/Refugee" }, { value: "Nonimmigrant", label: "Nonimmigrant" }, { value: "Other", label: "Other" }]} placeholder="Select..." value={form.family.spouseStatus} onChange={(e) => updateField("family", "spouseStatus", e.target.value)} />
                            <Input label="Date of Marriage" type="date" value={form.family.marriageDate} onChange={(e) => updateField("family", "marriageDate", e.target.value)} />
                            <Input label="Place of Marriage (City, State)" placeholder="e.g., Los Angeles, CA" value={form.family.marriagePlace} onChange={(e) => updateField("family", "marriagePlace", e.target.value)} />
                          </div>
                        </div>
                        <div className="border-t border-slate-200 pt-4">
                          <p className="text-sm font-medium text-slate-700 mb-3">Prior Marriages</p>
                          <div className="grid grid-cols-2 gap-4">
                            <Select label="Number of Prior Marriages" options={[{ value: "0", label: "0" }, { value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3+", label: "3+" }]} placeholder="Select..." value={form.family.priorMarriages} onChange={(e) => updateField("family", "priorMarriages", e.target.value)} />
                            {form.family.priorMarriages !== "0" && (
                              <>
                                <Select label="How did prior marriage end?" options={[{ value: "Divorce", label: "Divorce" }, { value: "Annulment", label: "Annulment" }, { value: "Death", label: "Death" }]} placeholder="Select..." value={form.family.priorMarriageEnd} onChange={(e) => updateField("family", "priorMarriageEnd", e.target.value)} />
                                <Input label="Date Prior Marriage Ended" type="date" value={form.family.priorMarriageEndDate} onChange={(e) => updateField("family", "priorMarriageEndDate", e.target.value)} />
                              </>
                            )}
                          </div>
                        </div>
                        <div className="border-t border-slate-200 pt-4">
                          <p className="text-sm font-medium text-slate-700 mb-3">Children</p>
                          <Select label="Number of Children" options={[{ value: "0", label: "0" }, { value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }, { value: "5+", label: "5+" }]} placeholder="Select..." value={form.family.childrenCount} onChange={(e) => updateField("family", "childrenCount", e.target.value)} />
                          {form.family.childrenCount !== "0" && (
                            <div className="grid grid-cols-2 gap-4 mt-3">
                              <Input label="Child's Full Name" placeholder="Full name" value={form.family.childName} onChange={(e) => updateField("family", "childName", e.target.value)} />
                              <Input label="Child's Date of Birth" type="date" value={form.family.childDOB} onChange={(e) => updateField("family", "childDOB", e.target.value)} />
                              <Select label="Is this child a U.S. citizen?" options={[{ value: "true", label: "Yes" }, { value: "false", label: "No" }]} placeholder="Select..." value={String(form.family.childCitizen)} onChange={(e) => updateField("family", "childCitizen", e.target.value === "true")} />
                            </div>
                          )}
                        </div>
                        <div className="border-t border-slate-200 pt-4">
                          <p className="text-sm font-medium text-slate-700 mb-3">Parents</p>
                          <div className="grid grid-cols-2 gap-4">
                            <Input label="Mother's Full Name (Last, First)" placeholder="Last, First" value={form.family.motherName} onChange={(e) => updateField("family", "motherName", e.target.value)} />
                            <Input label="Mother's Country of Birth" placeholder="e.g., Vietnam" value={form.family.motherCountry} onChange={(e) => updateField("family", "motherCountry", e.target.value)} />
                            <Input label="Father's Full Name (Last, First)" placeholder="Last, First" value={form.family.fatherName} onChange={(e) => updateField("family", "fatherName", e.target.value)} />
                            <Input label="Father's Country of Birth" placeholder="e.g., Vietnam" value={form.family.fatherCountry} onChange={(e) => updateField("family", "fatherCountry", e.target.value)} />
                          </div>
                          <div className="flex items-center gap-6 mt-3">
                            <label className="flex items-center gap-2 text-sm">
                              <input type="checkbox" className="rounded border-slate-300 accent-accent-600" checked={form.family.parentUSCitizen} onChange={(e) => updateField("family", "parentUSCitizen", e.target.checked)} />
                              Either parent is a U.S. citizen
                            </label>
                            <Select label="Number of Siblings" options={[{ value: "0", label: "0" }, { value: "1", label: "1" }, { value: "2", label: "2" }, { value: "3", label: "3" }, { value: "4", label: "4" }, { value: "5+", label: "5+" }]} className="w-48" placeholder="Siblings..." value={form.family.siblingsCount} onChange={(e) => updateField("family", "siblingsCount", e.target.value)} />
                          </div>
                        </div>
                        <div className="border-t border-slate-200 pt-4">
                          <p className="text-sm font-medium text-slate-700 mb-3">Petitioner Information</p>
                          <Select label="Relationship to Petitioner" options={[{ value: "Spouse of U.S. Citizen", label: "Spouse of U.S. Citizen" }, { value: "Child of U.S. Citizen", label: "Child of U.S. Citizen" }, { value: "Parent of U.S. Citizen", label: "Parent of U.S. Citizen" }, { value: "Family-Based Preference", label: "Family-Based Preference" }, { value: "Employment-Based", label: "Employment-Based" }, { value: "Refugee/Asylee", label: "Refugee/Asylee" }, { value: "VAWA", label: "VAWA Self-Petitioner" }]} placeholder="Select..." value={form.family.petitionerRelationship} onChange={(e) => updateField("family", "petitionerRelationship", e.target.value)} />
                        </div>
                      </>
                    )}

                    {/* ===== EDUCATION ===== */}
                    {section.id === "education" && (
                      <>
                        <Select label="Highest Level of Education" options={[{ value: "No Formal Schooling", label: "No Formal Schooling" }, { value: "Elementary School", label: "Elementary School" }, { value: "Middle/Junior High", label: "Middle/Junior High" }, { value: "High School", label: "High School" }, { value: "Associate's Degree", label: "Associate's Degree" }, { value: "Bachelor's Degree", label: "Bachelor's Degree" }, { value: "Master's Degree", label: "Master's Degree" }, { value: "Doctorate", label: "Doctorate" }, { value: "Professional Degree", label: "Professional Degree" }]} placeholder="Select..." value={form.education.highestLevel} onChange={(e) => updateField("education", "highestLevel", e.target.value)} />
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="School or Institution Name" placeholder="School name" value={form.education.schoolName} onChange={(e) => updateField("education", "schoolName", e.target.value)} />
                          <Input label="School City/State/Country" placeholder="e.g., Los Angeles, CA, USA" value={form.education.schoolLocation} onChange={(e) => updateField("education", "schoolLocation", e.target.value)} />
                          <Input label="Degree or Certificate Earned" placeholder="e.g., B.S. Computer Science" value={form.education.degreeEarned} onChange={(e) => updateField("education", "degreeEarned", e.target.value)} />
                          <Input label="Date Attended From" type="date" value={form.education.attendedFrom} onChange={(e) => updateField("education", "attendedFrom", e.target.value)} />
                          <Input label="Date Attended To" type="date" value={form.education.attendedTo} onChange={(e) => updateField("education", "attendedTo", e.target.value)} />
                        </div>
                      </>
                    )}

                    {/* ===== EMPLOYMENT HISTORY ===== */}
                    {section.id === "employment" && (
                      <>
                        <p className="text-xs text-slate-500">Current or most recent employment (I-485 requires 5-year history)</p>
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="Current Employer Name" placeholder="Company name" value={form.employment.currentEmployer} onChange={(e) => updateField("employment", "currentEmployer", e.target.value)} />
                          <Input label="Job Title" placeholder="Your title" value={form.employment.currentTitle} onChange={(e) => updateField("employment", "currentTitle", e.target.value)} />
                          <Input label="Start Date" type="date" value={form.employment.currentStartDate} onChange={(e) => updateField("employment", "currentStartDate", e.target.value)} />
                          <Input label="Employer Street Address" placeholder="Street address" value={form.employment.currentAddress} onChange={(e) => updateField("employment", "currentAddress", e.target.value)} />
                          <Input label="Employer City" placeholder="City" value={form.employment.currentCity} onChange={(e) => updateField("employment", "currentCity", e.target.value)} />
                          <Select label="Employer State" options={US_STATES} placeholder="State" value={form.employment.currentState} onChange={(e) => updateField("employment", "currentState", e.target.value)} />
                        </div>
                        <Textarea label="Job Duties" placeholder="Brief description of your job duties and responsibilities" value={form.employment.currentDuties} onChange={(e) => updateField("employment", "currentDuties", e.target.value)} />
                        <div className="border-t border-slate-200 pt-4">
                          <p className="text-sm font-medium text-slate-700 mb-3">Previous Employment (if less than 5 years at current)</p>
                          <div className="grid grid-cols-2 gap-4">
                            <Input label="Previous Employer Name" placeholder="Company name" value={form.employment.prevEmployer} onChange={(e) => updateField("employment", "prevEmployer", e.target.value)} />
                            <Input label="Previous Job Title" placeholder="Your title" value={form.employment.prevTitle} onChange={(e) => updateField("employment", "prevTitle", e.target.value)} />
                            <Input label="Previous Start Date" type="date" value={form.employment.prevStartDate} onChange={(e) => updateField("employment", "prevStartDate", e.target.value)} />
                            <Input label="Previous End Date" type="date" value={form.employment.prevEndDate} onChange={(e) => updateField("employment", "prevEndDate", e.target.value)} />
                          </div>
                        </div>
                      </>
                    )}

                    {/* ===== IMMIGRATION HISTORY ===== */}
                    {section.id === "immigration" && (
                      <>
                        <Select label="Current Immigration Status" options={[{ value: "US Citizen", label: "U.S. Citizen" }, { value: "LPR", label: "Lawful Permanent Resident" }, { value: "F-1", label: "F-1 Student" }, { value: "H-1B", label: "H-1B Worker" }, { value: "DACA", label: "DACA" }, { value: "TPS", label: "TPS" }, { value: "Other", label: "Other" }]} placeholder="Select status..." value={form.immigration.immigrationStatus} onChange={(e) => updateField("immigration", "immigrationStatus", e.target.value)} />
                        <div className="grid grid-cols-2 gap-4">
                          <Input label="A-Number (USCIS Number)" placeholder="AXXX XXX XXX" value={form.immigration.aNumber} onChange={(e) => updateField("immigration", "aNumber", e.target.value)} />
                          <Input label="I-94 Number" placeholder="Admission number" value={form.immigration.i94Number} onChange={(e) => updateField("immigration", "i94Number", e.target.value)} />
                          <Input label="Date of Last Arrival in U.S." type="date" value={form.immigration.lastArrivalDate} onChange={(e) => updateField("immigration", "lastArrivalDate", e.target.value)} />
                          <Input label="Place of Last Arrival (City, State)" placeholder="e.g., Los Angeles, CA" value={form.immigration.lastArrivalPlace} onChange={(e) => updateField("immigration", "lastArrivalPlace", e.target.value)} />
                          <Input label="Status/Visa at Last Entry" placeholder="e.g., F-1, K-1, etc." value={form.immigration.statusAtEntry} onChange={(e) => updateField("immigration", "statusAtEntry", e.target.value)} />
                        </div>
                        <Textarea label="Departure History (last 5 years)" placeholder="List all trips outside the U.S. in the last 5 years, including dates and destinations" value={form.immigration.departureHistory} onChange={(e) => updateField("immigration", "departureHistory", e.target.value)} />
                        <div className="grid grid-cols-2 gap-3">
                          <label className="flex items-center gap-2 text-sm p-3 rounded-lg border border-slate-200">
                            <input type="checkbox" className="rounded border-slate-300 accent-accent-600" checked={form.immigration.statusExpired} onChange={(e) => updateField("immigration", "statusExpired", e.target.checked)} />
                            Has your status ever expired?
                          </label>
                          <label className="flex items-center gap-2 text-sm p-3 rounded-lg border border-slate-200">
                            <input type="checkbox" className="rounded border-slate-300 accent-accent-600" checked={form.immigration.waiverNeeded} onChange={(e) => updateField("immigration", "waiverNeeded", e.target.checked)} />
                            Are you seeking a waiver?
                          </label>
                          <label className="flex items-center gap-2 text-sm p-3 rounded-lg border border-slate-200">
                            <input type="checkbox" className="rounded border-slate-300 accent-accent-600" checked={form.immigration.removalProceedings} onChange={(e) => updateField("immigration", "removalProceedings", e.target.checked)} />
                            Ever in removal proceedings?
                          </label>
                          <label className="flex items-center gap-2 text-sm p-3 rounded-lg border border-slate-200">
                            <input type="checkbox" className="rounded border-slate-300 accent-accent-600" checked={form.immigration.unauthorizedWork} onChange={(e) => updateField("immigration", "unauthorizedWork", e.target.checked)} />
                            Ever worked without authorization?
                          </label>
                          <label className="flex items-center gap-2 text-sm p-3 rounded-lg border border-slate-200">
                            <input type="checkbox" className="rounded border-slate-300 accent-accent-600" checked={form.immigration.visaViolations} onChange={(e) => updateField("immigration", "visaViolations", e.target.checked)} />
                            Ever violated visa terms?
                          </label>
                          <label className="flex items-center gap-2 text-sm p-3 rounded-lg border border-slate-200">
                            <input type="checkbox" className="rounded border-slate-300 accent-accent-600" checked={form.immigration.publicBenefits} onChange={(e) => updateField("immigration", "publicBenefits", e.target.checked)} />
                            Ever received public benefits?
                          </label>
                          <label className="flex items-center gap-2 text-sm p-3 rounded-lg border border-slate-200">
                            <input type="checkbox" className="rounded border-slate-300 accent-accent-600" checked={form.immigration.militaryService} onChange={(e) => updateField("immigration", "militaryService", e.target.checked)} />
                            Ever served in U.S. military?
                          </label>
                        </div>
                      </>
                    )}

                    {/* ===== PRIOR FILINGS ===== */}
                    {section.id === "filings" && (
                      <>
                        <label className="flex items-center gap-2 text-sm mb-4">
                          <input type="checkbox" className="rounded border-slate-300 accent-accent-600" checked={form.priorFilings.hasPriorFilings} onChange={(e) => updateField("priorFilings", "hasPriorFilings", e.target.checked)} />
                          Client has previously filed immigration applications
                        </label>
                        {form.priorFilings.hasPriorFilings && (
                          <div className="grid grid-cols-2 gap-4">
                            <Input label="Prior Form Type" placeholder="e.g., I-129F, I-130" value={form.priorFilings.priorFormType} onChange={(e) => updateField("priorFilings", "priorFormType", e.target.value)} />
                            <Input label="Filing Date" type="date" value={form.priorFilings.priorFilingDate} onChange={(e) => updateField("priorFilings", "priorFilingDate", e.target.value)} />
                            <Input label="Receipt Number" placeholder="e.g., WACxxxxxxxxx" value={form.priorFilings.priorReceiptNumber} onChange={(e) => updateField("priorFilings", "priorReceiptNumber", e.target.value)} />
                          </div>
                        )}
                      </>
                    )}

                    {/* ===== CRIMINAL HISTORY ===== */}
                    {section.id === "criminal" && (
                      <>
                        <div className="space-y-4">
                          <div className="p-4 rounded-lg border border-slate-200">
                            <label className="flex items-center gap-2 text-sm mb-3">
                              <input type="checkbox" className="rounded border-slate-300 accent-accent-600" checked={form.criminalHistory.arrested} onChange={(e) => updateField("criminalHistory", "arrested", e.target.checked)} />
                              Has the client ever been arrested, cited, or detained?
                            </label>
                            {form.criminalHistory.arrested && (
                              <Textarea placeholder="Explain the circumstances, date, location, and outcome of each arrest..." value={form.criminalHistory.arrestExplanation} onChange={(e) => updateField("criminalHistory", "arrestExplanation", e.target.value)} />
                            )}
                          </div>
                          <div className="p-4 rounded-lg border border-slate-200">
                            <label className="flex items-center gap-2 text-sm mb-3">
                              <input type="checkbox" className="rounded border-slate-300 accent-accent-600" checked={form.criminalHistory.convicted} onChange={(e) => updateField("criminalHistory", "convicted", e.target.checked)} />
                              Has the client ever been convicted of any crime?
                            </label>
                            {form.criminalHistory.convicted && (
                              <Textarea placeholder="List each conviction, date, court, and sentence..." value={form.criminalHistory.convictionExplanation} onChange={(e) => updateField("criminalHistory", "convictionExplanation", e.target.value)} />
                            )}
                          </div>
                        </div>
                      </>
                    )}

                    {/* ===== INJURY CASE INFO ===== */}
                    {section.id === "injury" && (
                      <div className="text-center py-6 text-slate-400 text-sm">
                        <p>Complete this section for personal injury cases only.</p>
                        <Textarea placeholder="Describe injury case details, accident date, medical treatment..." className="mt-3" />
                      </div>
                    )}

                    {/* ===== ESTATE PLANNING ===== */}
                    {section.id === "estate" && (
                      <div className="text-center py-6 text-slate-400 text-sm">
                        <p>Complete this section for estate planning matters only.</p>
                        <Textarea placeholder="Describe estate planning needs..." className="mt-3" />
                      </div>
                    )}

                    {/* ===== DOCUMENTS ===== */}
                    {section.id === "documents" && (
                      <div className="space-y-3">
                        <p className="text-xs text-slate-500">Upload relevant identification and legal documents for the I-485 application</p>
                        <div className="grid grid-cols-2 gap-3">
                          {["Passport", "Birth Certificate", "Marriage Certificate", "I-94 Record", "Visa History", "Employment Letter", "Tax Returns (3 years)", "Medical Exam (I-693)", "Police Clearance", "Court Dispositions", "Green Card (if any)", "EAD (if any)"].map((doc) => (
                            <div key={doc} className="flex items-center gap-3 p-3 rounded-lg border border-dashed border-slate-300 hover:border-accent-400 cursor-pointer">
                              <Upload size={16} className="text-slate-400" />
                              <span className="text-sm text-slate-600">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* E-Sign Consent */}
          <div className="mt-6 p-4 rounded-lg border border-slate-200">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" className="mt-1 rounded border-slate-300 accent-accent-600" />
              <div>
                <p className="text-sm font-medium text-slate-800">E-Signature Consent</p>
                <p className="text-xs text-slate-500 mt-0.5">
                  I consent to receive and sign documents electronically. I understand that electronic signatures have the same legal effect as original signatures.
                </p>
              </div>
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <Button variant="secondary" size="lg">Save Draft</Button>
            <Button variant="primary" size="lg" onClick={handleSubmit}>
              <UserPlus size={16} /> Submit Intake
            </Button>
          </div>

          <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <p className="text-xs text-amber-700">
              <strong>Confidentiality Notice:</strong> The information provided is confidential and protected by attorney-client privilege.
              Data submitted here will flow into the I-485 form preparation system.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
