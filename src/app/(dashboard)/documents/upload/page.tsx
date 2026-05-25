"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Upload, FileText, X, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/textarea";
import { formatFileSize } from "@/lib/utils";

const DOCUMENT_TYPES = [
  { value: "PASSPORT", label: "Passport" },
  { value: "VISA", label: "Visa" },
  { value: "GREEN_CARD", label: "Green Card" },
  { value: "EAD", label: "EAD" },
  { value: "I94", label: "I-94 Record" },
  { value: "BIRTH_CERTIFICATE", label: "Birth Certificate" },
  { value: "MARRIAGE_CERTIFICATE", label: "Marriage Certificate" },
  { value: "DIVORCE_DECREE", label: "Divorce Decree" },
  { value: "COURT_DOCUMENT", label: "Court Document" },
  { value: "MEDICAL_BILL", label: "Medical Bill" },
  { value: "POLICE_REPORT", label: "Police Report" },
  { value: "TAX_RETURN", label: "Tax Return" },
  { value: "PAY_STUB", label: "Pay Stub" },
  { value: "OTHER", label: "Other" },
];

interface ClientOption {
  value: string;
  label: string;
}

interface CaseOption {
  value: string;
  label: string;
}

export default function DocumentUploadPage() {
  const { data: session, status } = useSession();
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const [clientId, setClientId] = useState("");
  const [caseId, setCaseId] = useState("");
  const [documentType, setDocumentType] = useState("OTHER");
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);
  const [clients, setClients] = useState<ClientOption[]>([]);
  const [cases, setCases] = useState<CaseOption[]>([]);
  const [clientCases, setClientCases] = useState<CaseOption[]>([]);

  useEffect(() => {
    fetch("/api/clients")
      .then((r) => r.json())
      .then((data) => {
        const opts = (data.clients || []).map((c: { id: string; firstName: string; lastName: string }) => ({
          value: c.id,
          label: `${c.firstName} ${c.lastName}`,
        }));
        setClients(opts);
      })
      .catch(() => {});

    fetch("/api/cases")
      .then((r) => r.json())
      .then((data) => {
        const opts = (data.cases || []).map((c: { id: string; caseName: string }) => ({
          value: c.id,
          label: c.caseName,
        }));
        setCases(opts);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (clientId) {
      setClientCases(cases);
      // In a full implementation, filter by clientId via API
    } else {
      setClientCases([]);
    }
  }, [clientId, cases]);

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles((prev) => [...prev, ...droppedFiles]);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0 || !clientId) return;
    setUploading(true);

    try {
      for (const file of files) {
        const fd = new FormData();
        fd.append("file", file);
        fd.append("clientId", clientId);
        fd.append("documentType", documentType);
        if (caseId) fd.append("caseId", caseId);

        const res = await fetch("/api/documents", { method: "POST", body: fd });
        if (!res.ok) {
          const err = await res.json();
          throw new Error(err.message || "Upload failed");
        }
      }
      setUploaded(true);
    } catch (e) {
      alert(e instanceof Error ? e.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  if (uploaded) {
    return (
      <div className="max-w-2xl mx-auto text-center py-16">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Upload Complete</h1>
        <p className="text-slate-500 mt-2">{files.length} file(s) uploaded successfully.</p>
        <div className="flex gap-3 justify-center mt-6">
          <Button variant="primary" onClick={() => { setFiles([]); setUploaded(false); setUploading(false); }}>Upload More</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Upload Documents</h1>
        <p className="text-sm text-slate-500 mt-1">Upload legal documents for AI processing and case filing</p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-4">
          <Select
            label="Select Client"
            options={clients}
            placeholder="Select a client..."
            value={clientId}
            onChange={(e) => setClientId(e.target.value)}
          />
          <Select
            label="Document Type"
            options={DOCUMENT_TYPES}
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
          />
          <Select
            label="Associate with Case (optional)"
            options={clientCases}
            placeholder="Select a case..."
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Upload Zone */}
      <Card>
        <CardContent className="p-6">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              dragging ? "border-accent-400 bg-accent-50" : "border-slate-300 hover:border-slate-400"
            }`}
          >
            <Upload size={40} className="mx-auto mb-4 text-slate-300" />
            <p className="text-sm font-medium text-slate-700">Drag & drop files here</p>
            <p className="text-xs text-slate-500 mt-1">or click to browse</p>
            <p className="text-xs text-slate-400 mt-4">Supported: PDF, Word, JPG, PNG (Max 10MB)</p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              className="hidden"
              id="file-input"
              onChange={(e) => {
                if (e.target.files) setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
              }}
            />
            <Button variant="primary" className="mt-4" onClick={() => document.getElementById("file-input")?.click()}>
              <Upload size={16} /> Select Files
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* File List */}
      {files.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Selected Files ({files.length})</CardTitle></CardHeader>
          <CardContent className="space-y-2">
            {files.map((file, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <FileText size={16} className="text-slate-400" />
                  <div>
                    <p className="text-sm font-medium text-slate-800">{file.name}</p>
                    <p className="text-xs text-slate-500">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <button onClick={() => removeFile(i)} className="p-1 hover:bg-slate-100 rounded">
                  <X size={16} className="text-slate-400" />
                </button>
              </div>
            ))}
            <Button
              variant="primary"
              className="w-full mt-4"
              onClick={handleUpload}
              disabled={uploading || !clientId}
            >
              <Upload size={16} /> {uploading ? "Uploading..." : `Upload ${files.length} File(s)`}
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
        <p className="text-xs text-slate-500">
          <strong>Confidentiality Notice:</strong> Uploaded documents are encrypted and stored securely.
          Access is restricted to authorized case personnel only.
        </p>
      </div>
    </div>
  );
}
