"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/textarea";
import { practiceAreaLabels } from "@/lib/mock-data";
import { formatDate } from "@/lib/utils";

interface CaseItem {
  id: string;
  caseName: string;
  caseType: string;
  practiceArea: string;
  status: string;
  clientId: string;
  createdAt: string;
}

export default function CasesPage() {
  const { data: session, status } = useSession();
  const [search, setSearch] = useState("");
  const [filterPractice, setFilterPractice] = useState("");
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/cases")
      .then((res) => res.json())
      .then((data) => {
        setCases(data.cases || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  const filtered = cases.filter((c) => {
    const matchesSearch = c.caseName.toLowerCase().includes(search.toLowerCase());
    const matchesPractice = !filterPractice || c.practiceArea === filterPractice;
    return matchesSearch && matchesPractice;
  });

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading cases...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Cases</h1>
          <p className="text-sm text-slate-500 mt-1">{cases.length} total cases</p>
        </div>
        <Link href="/cases/new">
          <Button variant="primary" size="sm"><Plus size={16} /> New Case</Button>
        </Link>
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
                    <td className="px-6 py-4 text-sm text-slate-600">{c.clientId}</td>
                    <td className="px-6 py-4">
                      <Badge variant="status" status={c.practiceArea}>{(practiceAreaLabels as Record<string, string>)[c.practiceArea]}</Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{c.caseType}</td>
                    <td className="px-6 py-4 text-center"><Badge variant="status" status={c.status} /></td>
                    <td className="px-6 py-4 text-sm text-slate-500">{formatDate(new Date(c.createdAt))}</td>
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
