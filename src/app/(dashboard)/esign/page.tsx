"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Pen, FileText, Send, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

const esignDocs = [
  { id: "es-1", title: "Engagement Letter - Nguyen AOS", signer: "Tran Nguyen", status: "SIGNED", date: "2026-05-20" },
  { id: "es-2", title: "Retainer Agreement - Garcia PI", signer: "Maria Garcia", status: "SENT", date: "2026-05-22" },
  { id: "es-3", title: "Medical Records Release - Garcia PI", signer: "Maria Garcia", status: "PREPARED", date: "2026-05-23" },
];

export default function ESignPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">E-Signature Preparation</h1>
        <p className="text-sm text-slate-500 mt-1">Prepare documents for electronic signature</p>
      </div>

      <Card>
        <CardHeader><CardTitle className="text-sm">Prepare New Document for Signature</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Select
            label="Select Document"
            options={[
              { value: "doc-1", label: "Engagement Letter Template" },
              { value: "doc-2", label: "Retainer Agreement" },
              { value: "doc-3", label: "Medical Records Release" },
              { value: "doc-4", label: "Fee Agreement" },
            ]}
            placeholder="Choose a document..."
          />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Signer Full Name" placeholder="Full legal name" />
            <Input label="Signer Email" type="email" placeholder="signer@email.com" />
          </div>
          <div className="flex gap-4">
            <Button variant="primary"><Pen size={16} /> Add Signature Fields</Button>
            <Button variant="secondary"><Send size={16} /> Send for Signature</Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Signature Requests</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-3">
            {esignDocs.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 rounded-lg border border-slate-200">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    doc.status === "SIGNED" ? "bg-green-50" :
                    doc.status === "SENT" ? "bg-blue-50" : "bg-slate-50"
                  }`}>
                    {doc.status === "SIGNED" ? <CheckCircle size={18} className="text-green-600" /> :
                     doc.status === "SENT" ? <Send size={18} className="text-blue-600" /> :
                     <FileText size={18} className="text-slate-600" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{doc.title}</p>
                    <p className="text-xs text-slate-500">Signer: {doc.signer}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="status" status={doc.status === "SIGNED" ? "APPROVED" : doc.status === "SENT" ? "PENDING" : "DRAFT"}>{doc.status}</Badge>
                  <Button variant="ghost" size="xs">View</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
        <p className="text-xs text-slate-500">
          <strong>Note:</strong> This is a placeholder e-signature interface. Integration with DocuSign, Adobe Sign, or similar platform is required for production use.
        </p>
      </div>
    </div>
  );
}
