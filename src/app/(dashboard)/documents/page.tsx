"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Upload, FileText, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { formatDate, formatFileSize } from "@/lib/utils";

interface Document {
  id: string;
  fileName: string;
  originalName: string;
  fileType: string;
  fileSize: number;
  documentType: string;
  clientId: string;
  caseId: string | null;
  isProcessed: boolean;
  createdAt: string;
}

interface Client {
  id: string;
  firstName: string;
  lastName: string;
}

export default function DocumentsPage() {
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/documents").then((r) => r.json()),
      fetch("/api/clients").then((r) => r.json()),
    ])
      .then(([docsData, clientsData]) => {
        setDocuments(docsData.documents || []);
        setClients(clientsData.clients || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  const filtered = documents.filter((d) =>
    d.originalName.toLowerCase().includes(search.toLowerCase())
  );

  const getClientName = (clientId: string) => {
    const c = clients.find((cl) => cl.id === clientId);
    return c ? `${c.firstName} ${c.lastName}` : "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Documents</h1>
          <p className="text-sm text-slate-500 mt-1">{loading ? "Loading..." : `${documents.length} documents`}</p>
        </div>
        <Link href="/documents/upload">
          <Button variant="primary" size="sm"><Upload size={16} /> Upload</Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input placeholder="Search documents..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <p className="text-sm text-slate-500 text-center py-8">Loading documents...</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Name</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Client</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Type</th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Size</th>
                  <th className="text-center text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Processed</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Uploaded</th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center text-sm text-slate-500 py-8">No documents found</td>
                  </tr>
                ) : (
                  filtered.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <FileText size={16} className="text-slate-400" />
                          <span className="text-sm text-slate-800">{doc.originalName}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{getClientName(doc.clientId)}</td>
                      <td className="px-6 py-4"><Badge variant="status" status={doc.documentType}>{doc.documentType.replace(/_/g, " ")}</Badge></td>
                      <td className="px-6 py-4 text-sm text-slate-500 text-right">{formatFileSize(doc.fileSize)}</td>
                      <td className="px-6 py-4 text-center">{doc.isProcessed ? <Badge variant="status" status="COMPLETED">Done</Badge> : <Badge variant="status" status="PENDING">Pending</Badge>}</td>
                      <td className="px-6 py-4 text-sm text-slate-500">{formatDate(new Date(doc.createdAt))}</td>
                      <td className="px-6 py-4 text-right">
                        <Link href={`/documents/${doc.id}/review`}><Button variant="ghost" size="xs">Review</Button></Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
