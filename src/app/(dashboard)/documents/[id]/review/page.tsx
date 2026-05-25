"use client";

import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Bot, Check, X, Edit3, AlertTriangle, RefreshCw, SaveAll } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatFileSize } from "@/lib/utils";
import { getAIService } from "@/lib/ai-service-core";
import type { ExtractedField } from "@/types";

interface DocumentData {
  id: string;
  originalName: string;
  documentType: string;
  fileSize: number;
  fileType: string;
}

export default function DocumentReviewPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const [doc, setDoc] = useState<DocumentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fields, setFields] = useState<ExtractedField[]>([]);
  const [extracting, setExtracting] = useState(false);
  const [extracted, setExtracted] = useState(false);
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/documents/${params.id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setDoc(data.document);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.id]);

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;
  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading document...</p></div>;
  if (!doc) return <div className="p-8 text-center text-slate-500">Document not found</div>;

  const handleExtract = async () => {
    setExtracting(true);
    try {
      const service = getAIService();
      const extractedFields = await service.extractFields({
        text: `Document: ${doc.originalName}\nType: ${doc.documentType}\nExtract all relevant fields.`,
        documentId: doc.id,
      });
      setFields(extractedFields);
      setExtracted(true);
    } catch {
      setFields([]);
      setExtracted(true);
    } finally {
      setExtracting(false);
    }
  };

  const toggleApprove = (fieldId: string) => {
    setFields(fields.map((f) =>
      f.id === fieldId ? { ...f, isApproved: !f.isApproved, isRejected: false } : f
    ));
  };

  const toggleReject = (fieldId: string) => {
    setFields(fields.map((f) =>
      f.id === fieldId ? { ...f, isRejected: !f.isRejected, isApproved: false } : f
    ));
  };

  const startEdit = (field: ExtractedField) => {
    setEditingField(field.id);
    setEditValue(field.editedValue || field.fieldValue);
  };

  const saveEdit = (fieldId: string) => {
    setFields(fields.map((f) =>
      f.id === fieldId ? { ...f, editedValue: editValue } : f
    ));
    setEditingField(null);
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href="/documents"><Button variant="ghost" size="sm"><ArrowLeft size={16} /> Back</Button></Link>
      </div>

      {/* Document Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xl font-bold text-slate-900">{doc.originalName}</h1>
              <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                <span>{doc.documentType.replace(/_/g, " ")}</span>
                <span>{formatFileSize(doc.fileSize)}</span>
                <Badge variant="status" status={doc.documentType}>{doc.documentType.replace(/_/g, " ")}</Badge>
              </div>
            </div>
            <div className="flex gap-2">
              {!extracted && (
                <Button variant="primary" onClick={handleExtract} disabled={extracting}>
                  {extracting ? <><RefreshCw size={16} className="animate-spin" /> Extracting...</> : <><Bot size={16} /> Run AI Extraction</>}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Warning */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">AI Extraction — Review Required</p>
          <p className="text-xs text-amber-700">AI-extracted data may contain errors. Review each field before saving to the client profile. Low-confidence values are flagged.</p>
        </div>
      </div>

      {/* Extracted Fields */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bot size={18} className="text-accent-600" />
              Extracted Fields
              {fields.length > 0 && <Badge>{fields.length} fields</Badge>}
            </CardTitle>
            {fields.length > 0 && (
              <div className="flex gap-2">
                <Button variant="ghost" size="xs" onClick={() => setFields(fields.map((f) => ({ ...f, isApproved: true, isRejected: false })))}>
                  <Check size={14} /> Approve All
                </Button>
                <Button variant="primary" size="xs"><SaveAll size={14} /> Save Approved</Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {!extracted ? (
            <div className="text-center py-12 text-slate-400">
              <Bot size={32} className="mx-auto mb-2 opacity-50" />
              <p className="text-sm">Click "Run AI Extraction" to extract fields from this document</p>
            </div>
          ) : fields.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No fields could be extracted from this document.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Field</th>
                    <th className="text-left text-xs font-medium text-slate-500 uppercase px-4 py-3">Value</th>
                    <th className="text-center text-xs font-medium text-slate-500 uppercase px-4 py-3">Confidence</th>
                    <th className="text-right text-xs font-medium text-slate-500 uppercase px-4 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fields.map((field) => (
                    <tr key={field.id} className={`hover:bg-slate-50 ${field.isApproved ? "bg-green-50/50" : field.isRejected ? "bg-red-50/50" : ""}`}>
                      <td className="px-4 py-3 text-sm font-medium text-slate-700">{field.fieldName}</td>
                      <td className="px-4 py-3">
                        {editingField === field.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              className="border border-slate-300 rounded px-2 py-1 text-sm w-full"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              autoFocus
                            />
                            <Button variant="primary" size="xs" onClick={() => saveEdit(field.id)}>Save</Button>
                            <Button variant="ghost" size="xs" onClick={() => setEditingField(null)}>Cancel</Button>
                          </div>
                        ) : (
                          <span className="text-sm text-slate-800">{field.editedValue || field.fieldValue}</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                          field.confidence >= 0.8 ? "bg-green-100 text-green-700" :
                          field.confidence >= 0.6 ? "bg-amber-100 text-amber-700" :
                          "bg-red-100 text-red-700"
                        }`}>
                          {Math.round(field.confidence * 100)}%
                          {field.confidence < 0.8 && <AlertTriangle size={10} className="ml-1" />}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => toggleApprove(field.id)} className={`p-1.5 rounded transition-colors ${field.isApproved ? "bg-green-100 text-green-700" : "hover:bg-green-50 text-slate-400"}`} title="Approve">
                            <Check size={14} />
                          </button>
                          <button onClick={() => toggleReject(field.id)} className={`p-1.5 rounded transition-colors ${field.isRejected ? "bg-red-100 text-red-700" : "hover:bg-red-50 text-slate-400"}`} title="Reject">
                            <X size={14} />
                          </button>
                          <button onClick={() => startEdit(field)} className="p-1.5 rounded hover:bg-slate-100 text-slate-400" title="Edit">
                            <Edit3 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
