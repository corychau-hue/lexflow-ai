"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/textarea";
import { mockCases, mockClients, practiceAreaLabels } from "@/lib/mock-data";
import { formatDate, getPracticeAreaColor, getStatusColor } from "@/lib/utils";

export default function CasesPage() {
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");
  const [filterPractice, setFilterPractice] = useState("");

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  const filtered = mockCases.filter((c) => {
    const matchesSearch = c.caseName.toLowerCase().includes(search.toLowerCase());
    const matchesPractice = !filterPractice || c.practiceArea === filterPractice;
    return matchesSearch && matchesPractice;
  });

  const getClientName = (clientId: string) => {
    const client = mockClients.find((c) => c.id === clientId);
    return client ? `${client.firstName} ${client.lastName}` : "Unknown";
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cases</h1>
          <p className="text-sm text-slate-500 mt-1">{mockCases.length} total cases</p>
        </div>
        <Button variant="primary" size="sm"><Plus size={16} /> New Case</Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <Input placeholder="Search cases..." className="pl-9" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <Select
              options={[
                { value: "IMMIGRATION", label: "Immigration" },
                { value: "PERSONAL_INJURY", label: "Personal Injury" },
                { value: "FAMILY_LAW", label: "Family Law" },
                { value: "PROBATE_ESTATE_PLANNING", label: "Estate Planning" },
                { value: "REAL_PROPERTY", label: "Real Property" },
                { value: "BUSINESS_TAX", label: "Business/Tax" },
                { value: "CIVIL_LITIGATION", label: "Civil Litigation" },
              ]}
              placeholder="All Practice Areas"
              value={filterPractice}
              onChange={(e) => setFilterPractice(e.target.value)}
              className="w-48"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Case Name</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Client</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Practice Area</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Type</th>
                  <th className="text-center text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Created</th>
                  <th className="text-right text-xs font-medium text-slate-500 uppercase tracking-wider px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <Link href={`/cases/${c.id}`} className="text-sm font-medium text-accent-600 hover:underline">
                        {c.caseName}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{getClientName(c.clientId)}</td>
                    <td className="px-6 py-4">
                      <Badge variant="status" status={c.practiceArea}>{(practiceAreaLabels as Record<string, string>)[c.practiceArea]}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{c.caseType}</td>
                    <td className="px-6 py-4 text-center"><Badge variant="status" status={c.status} /></td>
                    <td className="px-6 py-4 text-sm text-slate-500">{formatDate(c.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <Link href={`/cases/${c.id}`}><Button variant="ghost" size="xs">View</Button></Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
