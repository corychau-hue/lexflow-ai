"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Calendar as CalendarIcon, Clock, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { mockDeadlines, mockCases } from "@/lib/mock-data";
import { formatDate, daysUntil } from "@/lib/utils";

export default function CalendarPage() {
  const { data: session, status } = useSession();

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  const sorted = [...mockDeadlines].sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime());

  const getCaseName = (caseId: string) => {
    const c = mockCases.find((cs) => cs.id === caseId);
    return c?.caseName || "Unknown";
  };

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
            {sorted.map((d) => {
              const days = daysUntil(d.dueDate);
              return (
                <div key={d.id} className="flex items-center gap-4 p-4 rounded-lg border border-slate-200 hover:border-accent-200 transition-colors">
                  <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-slate-50 flex flex-col items-center justify-center border border-slate-200">
                    <span className="text-lg font-bold text-slate-800">{d.dueDate.getDate()}</span>
                    <span className="text-xs text-slate-500">{d.dueDate.toLocaleString("default", { month: "short" })}</span>
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-slate-800">{d.title}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{getCaseName(d.caseId)}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant="status" status={days <= 0 ? "OVERDUE" : days <= 7 ? "PENDING" : "ACTIVE"}>
                      {days <= 0 ? "Overdue" : `${days} days`}
                    </Badge>
                    <p className="text-xs text-slate-400 mt-1">{formatDate(d.dueDate)}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
