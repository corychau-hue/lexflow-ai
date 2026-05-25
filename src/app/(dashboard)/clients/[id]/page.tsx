"use client";

import { useSession } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Calendar, FileText, Briefcase, Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface Client {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: string;
  language: string;
  eSignatureConsent: boolean;
  immigrationStatus?: string;
  addressStreet?: string;
  addressCity?: string;
  addressState?: string;
  addressZip?: string;
  createdAt: string;
}

interface CaseItem {
  id: string;
  caseName: string;
  caseType: string;
  practiceArea: string;
  status: string;
  clientId: string;
}

export default function ClientDetailPage() {
  const { data: session, status } = useSession();
  const params = useParams();
  const [client, setClient] = useState<Client | null>(null);
  const [clientCases, setClientCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    Promise.all([
      fetch(`/api/clients/${params.id}`).then((r) => r.json()),
      fetch("/api/cases").then((r) => r.json()),
    ])
      .then(([clientData, casesData]) => {
        if (!clientData.success) throw new Error(clientData.message || "Client not found");
        setClient(clientData.client);
        setClientCases((casesData.cases || []).filter((c: CaseItem) => c.clientId === params.id));
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [params.id]);

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;
  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading client...</p></div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
  if (!client) return <div className="p-8 text-center text-slate-500">Client not found</div>;

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="flex items-center gap-4">
        <Link href="/clients">
          <Button variant="ghost" size="sm"><ArrowLeft size={16} /> Back</Button>
        </Link>
      </div>

      {/* Client Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-accent-100 flex items-center justify-center text-2xl font-bold text-accent-700">
                {client.firstName[0]}{client.lastName[0]}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">{client.firstName} {client.lastName}</h1>
                <div className="flex items-center gap-4 mt-2 text-sm text-slate-500">
                  {client.email && <span className="flex items-center gap-1"><Mail size={14} />{client.email}</span>}
                  {client.phone && <span className="flex items-center gap-1"><Phone size={14} />{client.phone}</span>}
                </div>
                <div className="flex items-center gap-4 mt-1 text-sm text-slate-500">
                  {(client.addressStreet || client.addressCity) && (
                    <span className="flex items-center gap-1"><MapPin size={14} />{client.addressStreet}, {client.addressCity}, {client.addressState} {client.addressZip}</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Link href={`/intake/${client.id}`}><Button variant="secondary" size="sm">Intake</Button></Link>
              <Link href={`/cases/new?clientId=${client.id}`}><Button variant="primary" size="sm">New Case</Button></Link>
            </div>
          </div>
          <div className="flex gap-4 mt-4 pt-4 border-t border-slate-100">
            {client.immigrationStatus && <Badge variant="status" status={client.immigrationStatus}>{client.immigrationStatus}</Badge>}
            <span className="text-xs text-slate-400 flex items-center gap-1"><Calendar size={12} />Client since {formatDate(new Date(client.createdAt))}</span>
            <span className="text-xs text-slate-400 flex items-center gap-1"><Globe size={12} />{client.language}</span>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cases */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Briefcase size={18} />Cases</CardTitle>
            </CardHeader>
            <CardContent>
              {clientCases.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-4">No cases yet</p>
              ) : (
                <div className="space-y-3">
                  {clientCases.map((c) => (
                    <Link key={c.id} href={`/cases/${c.id}`}>
                      <div className="p-4 rounded-lg border border-slate-200 hover:border-accent-300 hover:shadow-sm transition-all">
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-medium text-slate-800">{c.caseName}</p>
                            <p className="text-sm text-slate-500 mt-0.5">{c.caseType}</p>
                          </div>
                          <Badge variant="status" status={c.status}>{c.status}</Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <Badge variant="status" status={c.practiceArea}>{c.practiceArea.replace(/_/g, " ")}</Badge>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Client Info Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader><CardTitle className="text-sm">Client Information</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div><span className="text-slate-500">Date of Birth:</span> <span className="text-slate-800">{client.dateOfBirth ? formatDate(new Date(client.dateOfBirth)) : "N/A"}</span></div>
              <div><span className="text-slate-500">Language:</span> <span className="text-slate-800">{client.language}</span></div>
              <div><span className="text-slate-500">E-Sign Consent:</span> <span className={client.eSignatureConsent ? "text-green-600" : "text-amber-600"}>{client.eSignatureConsent ? "Yes" : "No"}</span></div>
              <div><span className="text-slate-500">Immigration Status:</span> <span className="text-slate-800">{client.immigrationStatus || "N/A"}</span></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-sm">Quick Actions</CardTitle></CardHeader>
            <CardContent className="space-y-2">
              <Link href={`/documents?clientId=${client.id}`}><Button variant="secondary" size="sm" className="w-full"><FileText size={14} />Documents</Button></Link>
              <Link href={`/cases/new?clientId=${client.id}`}><Button variant="secondary" size="sm" className="w-full"><Briefcase size={14} />New Case</Button></Link>
              <Link href={`/intake/${client.id}`}><Button variant="secondary" size="sm" className="w-full"><FileText size={14} />View Intake</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
