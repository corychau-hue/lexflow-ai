"use client";

import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Plus, Clock, CheckCircle, FileText, MessageSquare, StickyNote, ListChecks, Bot, DollarSign, Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { mockCases, mockClients, mockTasks, mockDeadlines, mockDocuments, practiceAreaLabels } from "@/lib/mock-data";
import { formatDate, daysUntil } from "@/lib/utils";

type Tab = "overview" | "documents" | "tasks" | "deadlines" | "notes" | "ai-summaries" | "checklist";

export default function CaseDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const [activeTab, setActiveTab] = useState<Tab>("overview");
  const [newNote, setNewNote] = useState("");

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  const caseItem = mockCases.find((c) => c.id === params.id);
  if (!caseItem) return <div className="p-8 text-center text-slate-500">Case not found</div>;

  const client = mockClients.find((c) => c.id === caseItem.clientId);
  const tasks = mockTasks.filter((t) => t.caseId === caseItem.id);
  const deadlines = mockDeadlines.filter((d) => d.caseId === caseItem.id);
  const documents = mockDocuments.filter((d) => d.caseId === caseItem.id);

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: "overview", label: "Overview", icon: <FileText size={14} /> },
    { key: "documents", label: "Documents", icon: <FileText size={14} /> },
    { key: "tasks", label: "Tasks", icon: <CheckCircle size={14} /> },
    { key: "deadlines", label: "Deadlines", icon: <Clock size={14} /> },
    { key: "notes", label: "Notes", icon: <StickyNote size={14} /> },
    { key: "ai-summaries", label: "AI Summaries", icon: <Bot size={14} /> },
    { key: "checklist", label: "Checklist", icon: <ListChecks size={14} /> },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/cases"><Button variant="ghost" size="sm"><ArrowLeft size={16} /> Back</Button></Link>
        </div>
        <div className="flex gap-2">
          <Link href={`/documents/upload?caseId=${caseItem.id}`}><Button variant="secondary" size="sm"><FileText size={14} /> Upload</Button></Link>
          {caseItem.practiceArea === "IMMIGRATION" && (
            <Link href={`/immigration/${caseItem.id}`}><Button variant="secondary" size="sm"><Shield size={14} /> Immigration Forms</Button></Link>
          )}
          <Link href={`/ai-writing?caseId=${caseItem.id}`}><Button variant="primary" size="sm"><Bot size={14} /> AI Assist</Button></Link>
        </div>
      </div>

      {/* Case Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{caseItem.caseName}</h1>
              <p className="text-sm text-slate-500 mt-1">
                {client ? `${client.firstName} ${client.lastName}` : "Unknown Client"} &middot; {caseItem.caseType}
              </p>
              <div className="flex items-center gap-3 mt-3">
                <Badge variant="status" status={caseItem.practiceArea}>{(practiceAreaLabels as Record<string, string>)[caseItem.practiceArea]}</Badge>
                <Badge variant="status" status={caseItem.status} />
                {caseItem.assignedUserId && <span className="text-xs text-slate-500">Assigned to: Attorney</span>}
              </div>
            </div>
          </div>
          {caseItem.description && (
            <p className="text-sm text-slate-600 mt-4 p-3 bg-slate-50 rounded-lg">{caseItem.description}</p>
          )}
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
              activeTab === tab.key
                ? "border-accent-600 text-accent-600"
                : "border-transparent text-slate-500 hover:text-slate-700"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>Case Information</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex justify-between"><span className="text-slate-500">Client</span><span className="font-medium">{client?.firstName} {client?.lastName}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Practice Area</span><span>{(practiceAreaLabels as Record<string, string>)[caseItem.practiceArea]}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Case Type</span><span>{caseItem.caseType}</span></div>
              <div className="flex justify-between"><span className="text-slate-500">Status</span><Badge variant="status" status={caseItem.status} /></div>
              <div className="flex justify-between"><span className="text-slate-500">Created</span><span>{formatDate(caseItem.createdAt)}</span></div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle>Quick Stats</CardTitle></CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-slate-900">{documents.length}</p>
                  <p className="text-xs text-slate-500">Documents</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-slate-900">{tasks.filter(t => t.status === "COMPLETED").length}/{tasks.length}</p>
                  <p className="text-xs text-slate-500">Tasks Done</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-slate-900">{deadlines.length}</p>
                  <p className="text-xs text-slate-500">Deadlines</p>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-amber-600">{deadlines.filter(d => daysUntil(d.dueDate) <= 0).length}</p>
                  <p className="text-xs text-slate-500">Overdue</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "tasks" && (
        <Card>
          <CardHeader><CardTitle className="flex items-center justify-between"><span>Tasks</span><Button variant="primary" size="xs"><Plus size={14} /> Add Task</Button></CardTitle></CardHeader>
          <CardContent>
            {tasks.length === 0 ? <p className="text-sm text-slate-500 text-center py-4">No tasks yet</p> : (
              <div className="space-y-2">
                {tasks.map((t) => (
                  <div key={t.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" className="rounded border-slate-300" checked={t.status === "COMPLETED"} readOnly />
                      <div>
                        <p className={`text-sm font-medium ${t.status === "COMPLETED" ? "line-through text-slate-400" : "text-slate-800"}`}>{t.title}</p>
                        {t.dueDate && <p className="text-xs text-slate-500">Due: {formatDate(t.dueDate)}</p>}
                      </div>
                    </div>
                    <Badge variant="status" status={t.status} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "deadlines" && (
        <Card>
          <CardHeader><CardTitle className="flex items-center justify-between"><span>Deadlines</span><Button variant="primary" size="xs"><Plus size={14} /> Add</Button></CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {deadlines.map((d) => {
                const days = daysUntil(d.dueDate);
                return (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                    <div>
                      <p className="text-sm font-medium text-slate-800">{d.title}</p>
                      <p className="text-xs text-slate-500">Due: {formatDate(d.dueDate)}</p>
                    </div>
                    <Badge variant="status" status={days <= 0 ? "OVERDUE" : days <= 7 ? "PENDING" : "ACTIVE"}>
                      {days <= 0 ? "Overdue" : `${days} days`}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "notes" && (
        <Card>
          <CardHeader><CardTitle>Notes</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea placeholder="Add a note..." value={newNote} onChange={(e) => setNewNote(e.target.value)} />
              <Button variant="primary" size="sm">Add Note</Button>
            </div>
            <div className="space-y-3 pt-4 border-t border-slate-200">
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-700">Initial consultation completed. Client provided all required identification documents. Need to follow up on missing tax returns.</p>
                <p className="text-xs text-slate-400 mt-2">James Rodriguez &middot; 2 days ago</p>
              </div>
              <div className="p-3 rounded-lg bg-slate-50">
                <p className="text-sm text-slate-700">Reviewed case file. All initial pleadings ready for filing. Awaiting client signature on engagement letter.</p>
                <p className="text-xs text-slate-400 mt-2">Maria Kim &middot; 5 days ago</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "documents" && (
        <Card>
          <CardHeader><CardTitle className="flex items-center justify-between"><span>Documents</span><Link href={`/documents/upload?caseId=${caseItem.id}`}><Button variant="primary" size="xs"><Plus size={14} /> Upload</Button></Link></CardTitle></CardHeader>
          <CardContent>
            {documents.length === 0 ? <p className="text-sm text-slate-500 text-center py-4">No documents yet</p> : (
              <div className="space-y-2">
                {documents.map((d) => (
                  <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3">
                      <FileText size={16} className="text-slate-400" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">{d.originalName}</p>
                        <p className="text-xs text-slate-500">{d.documentType.replace(/_/g, " ")}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {!d.isProcessed && <Badge variant="status" status="PENDING">Not Processed</Badge>}
                      <Link href={`/documents/${d.id}/review`}><Button variant="ghost" size="xs">Review</Button></Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {activeTab === "ai-summaries" && (
        <Card>
          <CardHeader><CardTitle className="flex items-center justify-between"><span>AI Summaries</span><Button variant="primary" size="xs"><Bot size={14} /> Generate Summary</Button></CardTitle></CardHeader>
          <CardContent>
            <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 mb-4">
              <p className="text-xs text-amber-700"><strong>AI-Generated Content:</strong> All AI summaries require attorney review before use or filing.</p>
            </div>
            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
              <p className="text-sm font-medium text-slate-800 mb-2">Case Summary</p>
              <p className="text-sm text-slate-600">This case involves an immigration adjustment of status application. The client is a lawful permanent resident seeking to adjust status based on a family petition. Key documents have been reviewed and the case is proceeding toward filing.</p>
              <p className="text-xs text-slate-400 mt-2">Generated by AI &middot; Pending Review</p>
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "checklist" && (
        <Card>
          <CardHeader><CardTitle className="flex items-center justify-between"><span>Document Checklist</span><Link href={`/checklists?caseId=${caseItem.id}&practice=${caseItem.practiceArea}`}><Button variant="primary" size="xs"><ListChecks size={14} /> Generate</Button></Link></CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                "Passport-style photographs (2)",
                "Copy of passport (biographical page)",
                "Birth certificate (with English translation if needed)",
                "Marriage certificate",
                "Form I-864 Affidavit of Support",
                "Tax returns (last 3 years)",
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-2">
                  <input type="checkbox" className="rounded border-slate-300" checked={i < 2} readOnly />
                  <span className={`text-sm ${i < 2 ? "text-slate-400 line-through" : "text-slate-700"}`}>{item}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
