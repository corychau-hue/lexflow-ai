"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate, daysUntil } from "@/lib/utils";

interface DeadlineItem {
  id: string;
  title: string;
  description?: string;
  dueDate: string;
  caseId: string;
}

interface CaseItem {
  id: string;
  caseName: string;
}

export default function CalendarPage() {
  const { data: session, status } = useSession();
  const [deadlines, setDeadlines] = useState<DeadlineItem[]>([]);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/deadlines").then((r) => r.json()),
      fetch("/api/cases").then((r) => r.json()),
    ])
      .then(([dlData, casesData]) => {
        setDeadlines(dlData.deadlines || []);
        setCases(casesData.cases || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  const sorted = [...deadlines].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const getCaseName = (caseId: string) => {
    const c = cases.find((cs) => cs.id === caseId);
    return c?.caseName || "Unknown";
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading deadlines...</p></div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Calendar & Deadlines</h1>
        <p className="text-sm text-slate-500 mt-1">Track important deadlines and dates</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarIcon size={18} className="text-slate-500" />
            Upcoming Deadlines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {sorted.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No deadlines yet</p>
            ) : (
              sorted.map((d) => {
                const due = new Date(d.dueDate);
                const days = daysUntil(due);
                return (
                  <div key={d.id} className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-accent-200 transition-colors">
                    <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-slate-50 flex flex-col items-center justify-center border border-slate-200">
                      <span className="text-lg font-bold text-slate-800">{due.getDate()}</span>
                      <span className="text-xs text-slate-500">{due.toLocaleString("default", { month: "short" })}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-slate-800">{d.title}</p>
                      <p className="text-sm text-slate-500 mt-0.5">{getCaseName(d.caseId)}</p>
                    </div>
                    <div className="text-right">
                      <Badge variant="status" status={days <= 0 ? "OVERDUE" : days <= 7 ? "PENDING" : "ACTIVE"}>
                        {days <= 0 ? "Overdue" : `${days} days`}
                      </Badge>
                      <p className="text-xs text-slate-400 mt-1">{formatDate(due)}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
