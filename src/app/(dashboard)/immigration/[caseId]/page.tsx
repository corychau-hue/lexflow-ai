"use client";

import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { FileText, Download, Shield, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/textarea";
import { getClientIntake, IntakeData } from "@/lib/intake-store";
import { addReviewItem } from "@/lib/review-store";
import { I485Form } from "@/components/immigration/i485-form";

const formTypes = [
  { value: "I-130", label: "I-130 Petition for Alien Relative" },
  { value: "I-130A", label: "I-130A Supplemental Information" },
  { value: "I-485", label: "I-485 Adjustment of Status" },
  { value: "I-765", label: "I-765 Employment Authorization" },
  { value: "I-131", label: "I-131 Travel Document" },
  { value: "I-864", label: "I-864 Affidavit of Support" },
  { value: "DS-260", label: "DS-260 Immigrant Visa Application" },
  { value: "N-400", label: "N-400 Naturalization" },
];

const countryByLanguage: Record<string, string> = {
  VIETNAMESE: "Vietnam",
  SPANISH: "Mexico",
  CHINESE: "China",
  ENGLISH: "United States",
};

interface CaseData {
  id: string;
  caseName: string;
  practiceArea: string;
}

interface ClientData {
  id: string;
  firstName: string;
  lastName: string;
  language: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressZip?: string;
  immigrationStatus?: string;
}

interface FormattedClientData {
  fullName: string;
  dateOfBirth: string;
  countryOfBirth: string;
  citizenship: string;
  aNumber: string;
  immigrationStatus: string;
  dateOfEntry: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  email: string;
  phone: string;
  gender?: string;
  maritalStatus?: string;
  otherNames?: string;
  ssn?: string;
  height?: string;
  weight?: string;
  hairColor?: string;
  eyeColor?: string;
  smsConsent?: boolean;
  spouseName?: string;
  spouseDOB?: string;
  spouseBirth?: string;
  spouseANumber?: string;
  spouseCitizen?: boolean;
  spouseStatus?: string;
  marriageDate?: string;
  marriagePlace?: string;
  priorMarriages?: string;
  priorMarriageEnd?: string;
  priorMarriageEndDate?: string;
  childrenCount?: string;
  childName?: string;
  childDOB?: string;
  childCitizen?: boolean;
  motherName?: string;
  motherCountry?: string;
  fatherName?: string;
  fatherCountry?: string;
  parentUSCitizen?: boolean;
  siblingsCount?: string;
  petitionerRelationship?: string;
  eduLevel?: string;
  eduSchool?: string;
  eduLocation?: string;
  eduDegree?: string;
  eduFrom?: string;
  eduTo?: string;
  employer?: string;
  jobTitle?: string;
  empStart?: string;
  empAddress?: string;
  empCity?: string;
  empState?: string;
  empDuties?: string;
  prevEmployer?: string;
  prevTitle?: string;
  prevStart?: string;
  prevEnd?: string;
  i94Number?: string;
  lastArrivalPlace?: string;
  statusAtEntry?: string;
  departureHistory?: string;
  statusExpired?: boolean;
  waiverNeeded?: boolean;
  removalProceedings?: boolean;
  unauthorizedWork?: boolean;
  visaViolations?: boolean;
  publicBenefits?: boolean;
  militaryService?: boolean;
  arrested?: boolean;
  arrestExplanation?: string;
  convicted?: boolean;
  convictionExplanation?: string;
  hasPriorFilings?: boolean;
  priorFormType?: string;
  priorFilingDate?: string;
  priorReceiptNumber?: string;
}

export default function ImmigrationWorkflowPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const [selectedForm, setSelectedForm] = useState("I-485");
  const [packetReady, setPacketReady] = useState(false);
  const [packetSubmitted, setPacketSubmitted] = useState(false);
  const [intakeData, setIntakeData] = useState<IntakeData | undefined>(undefined);
  const [intakeLoading, setIntakeLoading] = useState(true);
  const [caseItem, setCaseItem] = useState<CaseData | null>(null);
  const [client, setClient] = useState<ClientData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!params.caseId) return;
    fetch(`/api/cases/${params.caseId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCaseItem({ id: data.case.id, caseName: data.case.caseName, practiceArea: data.case.practiceArea });
          const c = data.case.client;
          setClient({
            id: c.id,
            firstName: c.firstName,
            lastName: c.lastName,
            language: c.language || "ENGLISH",
            dateOfBirth: c.dateOfBirth || "1988-01-01",
            email: c.email || "",
            phone: c.phone || "",
            addressStreet: c.addressStreet || "",
            addressCity: c.addressCity || "",
            addressState: c.addressState || "",
            addressZip: c.addressZip || "",
            immigrationStatus: c.immigrationStatus || "",
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.caseId]);

  // Load intake data from database (must be before any conditional return per React hooks rules)
  useEffect(() => {
    if (client?.id) {
      setIntakeLoading(true);
      getClientIntake(client.id).then((data) => {
        setIntakeData(data);
        setIntakeLoading(false);
      });
    } else {
      setIntakeLoading(false);
    }
  }, [client?.id]);

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;
  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading case...</p></div>;

  if (!caseItem || !client) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>Case or client not found</p>
      </div>
    );
  }

  const country = client.language ? countryByLanguage[client.language] || "United States" : "United States";
  const dob = client.dateOfBirth ? new Date(client.dateOfBirth).toISOString().split("T")[0] : "1988-01-01";

  const clientData: FormattedClientData = intakeData ? {
    fullName: `${intakeData.personal.lastName}, ${intakeData.personal.firstName}`,
    dateOfBirth: intakeData.personal.dateOfBirth || dob,
    countryOfBirth: intakeData.personal.countryOfBirth || country,
    citizenship: intakeData.personal.countryOfCitizenship || country,
    aNumber: intakeData.immigration.aNumber || "A123 456 789",
    immigrationStatus: intakeData.immigration.immigrationStatus || client.immigrationStatus || "N/A",
    dateOfEntry: intakeData.immigration.lastArrivalDate || "2022-06-20",
    address: intakeData.address.street || client.addressStreet || "N/A",
    city: intakeData.address.city || client.addressCity || "N/A",
    state: intakeData.address.state || client.addressState || "N/A",
    zip: intakeData.address.zip || client.addressZip || "N/A",
    email: intakeData.personal.email || client.email || "",
    phone: intakeData.personal.phone || client.phone || "",
    gender: intakeData.personal.gender,
    maritalStatus: intakeData.family.maritalStatus,
    otherNames: intakeData.personal.otherNames,
    ssn: intakeData.personal.ssn,
    height: intakeData.personal.height,
    weight: intakeData.personal.weight,
    hairColor: intakeData.personal.hairColor,
    eyeColor: intakeData.personal.eyeColor,
    smsConsent: intakeData.personal.smsConsent,
    spouseName: intakeData.family.spouseName,
    spouseDOB: intakeData.family.spouseDOB,
    spouseBirth: intakeData.family.spouseCountryBirth,
    spouseANumber: intakeData.family.spouseANumber,
    spouseCitizen: intakeData.family.spouseCitizen,
    spouseStatus: intakeData.family.spouseStatus,
    marriageDate: intakeData.family.marriageDate,
    marriagePlace: intakeData.family.marriagePlace,
    priorMarriages: intakeData.family.priorMarriages,
    priorMarriageEnd: intakeData.family.priorMarriageEnd,
    priorMarriageEndDate: intakeData.family.priorMarriageEndDate,
    childrenCount: intakeData.family.childrenCount,
    childName: intakeData.family.childName,
    childDOB: intakeData.family.childDOB,
    childCitizen: intakeData.family.childCitizen,
    motherName: intakeData.family.motherName,
    motherCountry: intakeData.family.motherCountry,
    fatherName: intakeData.family.fatherName,
    fatherCountry: intakeData.family.fatherCountry,
    parentUSCitizen: intakeData.family.parentUSCitizen,
    siblingsCount: intakeData.family.siblingsCount,
    petitionerRelationship: intakeData.family.petitionerRelationship,
    eduLevel: intakeData.education.highestLevel,
    eduSchool: intakeData.education.schoolName,
    eduLocation: intakeData.education.schoolLocation,
    eduDegree: intakeData.education.degreeEarned,
    eduFrom: intakeData.education.attendedFrom,
    eduTo: intakeData.education.attendedTo,
    employer: intakeData.employment.currentEmployer,
    jobTitle: intakeData.employment.currentTitle,
    empStart: intakeData.employment.currentStartDate,
    empAddress: intakeData.employment.currentAddress,
    empCity: intakeData.employment.currentCity,
    empState: intakeData.employment.currentState,
    empDuties: intakeData.employment.currentDuties,
    prevEmployer: intakeData.employment.prevEmployer,
    prevTitle: intakeData.employment.prevTitle,
    prevStart: intakeData.employment.prevStartDate,
    prevEnd: intakeData.employment.prevEndDate,
    i94Number: intakeData.immigration.i94Number,
    lastArrivalPlace: intakeData.immigration.lastArrivalPlace,
    statusAtEntry: intakeData.immigration.statusAtEntry,
    departureHistory: intakeData.immigration.departureHistory,
    statusExpired: intakeData.immigration.statusExpired,
    waiverNeeded: intakeData.immigration.waiverNeeded,
    removalProceedings: intakeData.immigration.removalProceedings,
    unauthorizedWork: intakeData.immigration.unauthorizedWork,
    visaViolations: intakeData.immigration.visaViolations,
    publicBenefits: intakeData.immigration.publicBenefits,
    militaryService: intakeData.immigration.militaryService,
    arrested: intakeData.criminalHistory.arrested,
    arrestExplanation: intakeData.criminalHistory.arrestExplanation,
    convicted: intakeData.criminalHistory.convicted,
    convictionExplanation: intakeData.criminalHistory.convictionExplanation,
    hasPriorFilings: intakeData.priorFilings.hasPriorFilings,
    priorFormType: intakeData.priorFilings.priorFormType,
    priorFilingDate: intakeData.priorFilings.priorFilingDate,
    priorReceiptNumber: intakeData.priorFilings.priorReceiptNumber,
  } : {
    fullName: `${client.lastName}, ${client.firstName}`,
    dateOfBirth: dob,
    countryOfBirth: country,
    citizenship: country,
    aNumber: "A123 456 789",
    immigrationStatus: client.immigrationStatus || "N/A",
    dateOfEntry: "2022-06-20",
    address: client.addressStreet || "N/A",
    city: client.addressCity || "N/A",
    state: client.addressState || "N/A",
    zip: client.addressZip || "N/A",
    email: client.email || "",
    phone: client.phone || "",
  };

  const intakeId = intakeData?.id;

  const handleGeneratePacket = () => {
    setPacketReady(true);
    setPacketSubmitted(false);
  };

  const handleSubmitForReview = async () => {
    await addReviewItem({
      id: `review-imm-${Date.now()}`,
      title: `${selectedForm} Form Data Packet — ${caseItem.caseName}`,
      type: "IMMIGRATION_PACKET",
      caseId: caseItem.id,
      clientName: `${client.firstName} ${client.lastName}`,
      status: "PENDING_REVIEW",
      createdAt: new Date(),
      details: `${selectedForm} form data packet generated for ${caseItem.caseName}. Ready for attorney review.`,
    });
    setPacketSubmitted(true);
  };

  const handleDownloadPdf = async () => {
    try {
      const res = await fetch("/api/forms/i485/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });
      if (!res.ok) throw new Error("PDF generation failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `i485-packet-${clientData.fullName?.replace(/[^a-zA-Z0-9]/g, "_") || "packet"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Failed to download PDF");
    }
  };

  const isI485 = selectedForm === "I-485";

  return (
    <div className="space-y-6 max-w-6xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Immigration Workflow</h1>
        <p className="text-sm text-slate-500 mt-1">
          {caseItem.caseName} &middot; {client.firstName} {client.lastName}
        </p>
      </div>

      {/* USCIS Disclaimer */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">Important Notice</p>
          <p className="text-xs text-amber-700">
            This system prepares Form Data Packets for attorney/staff review only. It does NOT file directly with USCIS.
            All forms must be reviewed, signed, and filed by an attorney or accredited representative.
          </p>
        </div>
      </div>

      {/* Success Message */}
      {packetSubmitted && (
        <div className="p-4 rounded-xl bg-green-50 border border-green-200 flex items-start gap-3">
          <CheckCircle size={20} className="text-green-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-green-800">Packet Submitted for Review</p>
            <p className="text-xs text-green-700">
              The {selectedForm} data packet has been sent to the <a href="/review-queue" className="underline font-medium">Attorney Review Queue</a>.
            </p>
          </div>
        </div>
      )}

      {/* Form Selection */}
      <Card>
        <CardHeader><CardTitle className="text-sm">Select USCIS Form Type</CardTitle></CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className="w-72">
              <Select
                options={formTypes}
                value={selectedForm}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => { setSelectedForm(e.target.value); setPacketReady(false); setPacketSubmitted(false); }}
              />
            </div>
            <Button variant="primary" onClick={handleGeneratePacket}>
              <FileText size={16} /> Generate Data Packet
            </Button>
            {packetReady && (
              <>
                <Button variant="secondary" onClick={handleDownloadPdf}>
                  <Download size={16} /> Download PDF
                </Button>
                <Button variant="secondary" onClick={handleSubmitForReview}>
                  <Shield size={16} /> Submit for Review
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Loading indicator for intake data */}
      {intakeLoading && (
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-sm text-slate-500">Loading intake data...</p>
          </CardContent>
        </Card>
      )}

      {/* I-485 Full Form */}
      {isI485 && packetReady && !intakeLoading && (
        <I485Form clientData={clientData} intakeId={intakeId} />
      )}

      {/* Generic Form for non-I-485 forms */}
      {!isI485 && packetReady && selectedForm && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText size={18} className="text-accent-600" />
                Form Data Packet — {selectedForm}
                <Badge variant="status" status="PENDING_REVIEW">Needs Attorney Review</Badge>
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { field: "Beneficiary Name", value: clientData.fullName },
                { field: "Date of Birth", value: clientData.dateOfBirth },
                { field: "Country of Birth", value: clientData.countryOfBirth },
                { field: "Country of Citizenship", value: clientData.citizenship },
                { field: "A-Number", value: clientData.aNumber },
                { field: "Current Status", value: clientData.immigrationStatus },
                { field: "Date of Last Entry", value: clientData.dateOfEntry },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-50">
                  <span className="text-sm text-slate-600">{item.field}</span>
                  <span className="text-sm font-medium text-slate-800">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 rounded-lg bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-700 flex items-center gap-1">
                <AlertTriangle size={12} />
                This data packet must be reviewed by an attorney before filing with USCIS. Do not submit without attorney approval.
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
