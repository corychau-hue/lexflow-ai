"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { ListChecks, CheckCircle, AlertTriangle, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/textarea";
import { checklistTemplates, practiceAreaLabels } from "@/lib/mock-data";

const practiceAreas = [
  { value: "IMMIGRATION", label: "Immigration" },
  { value: "PERSONAL_INJURY", label: "Personal Injury" },
  { value: "FAMILY_LAW", label: "Family Law" },
  { value: "PROBATE_ESTATE_PLANNING", label: "Estate Planning" },
];

const caseTypesByPractice: Record<string, string[]> = {
  IMMIGRATION: ["Adjustment of Status", "Naturalization"],
  PERSONAL_INJURY: ["Auto Accident"],
  FAMILY_LAW: ["Divorce"],
  PROBATE_ESTATE_PLANNING: ["Estate Planning"],
};

export default function ChecklistsPage() {
  const { data: session, status } = useSession();
  const [practiceArea, setPracticeArea] = useState("");
  const [caseType, setCaseType] = useState("");
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  const types = practiceArea ? caseTypesByPractice[practiceArea] || [] : [];
  const templateKey = practiceArea && caseType ? `${practiceArea}_${caseType}` : "";
  const items = templateKey ? checklistTemplates[templateKey] || [] : [];

  const toggleItem = (item: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(item)) newChecked.delete(item);
    else newChecked.add(item);
    setCheckedItems(newChecked);
  };

  const progress = items.length ? Math.round((checkedItems.size / items.length) * 100) : 0;

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Document Checklists</h1>
        <p className="text-sm text-slate-500 mt-1">Generate and track document checklists by practice area</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <Select
              label="Practice Area"
              options={[{ value: "", label: "Select..." }, ...practiceAreas]}
              value={practiceArea}
              onChange={(e) => { setPracticeArea(e.target.value); setCaseType(""); setCheckedItems(new Set()); }}
              className="flex-1"
            />
            <Select
              label="Case Type"
              options={[{ value: "", label: "Select..." }, ...types.map((t) => ({ value: t, label: t }))]}
              value={caseType}
              onChange={(e) => { setCaseType(e.target.value); setCheckedItems(new Set()); }}
              className="flex-1"
            />
          </div>
        </CardContent>
      </Card>

      {items.length > 0 && (
        <>
          {/* Progress */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <ListChecks size={18} className="text-accent-600" />
                  <span className="font-semibold text-slate-800">{practiceAreaLabels[practiceArea as keyof typeof practiceAreaLabels]} — {caseType}</span>
                </div>
                <span className="text-sm text-slate-500">{checkedItems.size}/{items.length} items received ({progress}%)</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-accent-500 rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
            </CardContent>
          </Card>

          {/* Checklist Items */}
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={checkedItems.has(item)}
                      onChange={() => toggleItem(item)}
                      className="rounded border-slate-300 accent-accent-600"
                    />
                    <span className={`text-sm flex-1 ${checkedItems.has(item) ? "line-through text-slate-400" : "text-slate-700"}`}>
                      {item}
                    </span>
                    {checkedItems.has(item) && <CheckCircle size={16} className="text-green-500" />}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-between">
            <Button variant="secondary" size="sm" onClick={() => setCheckedItems(new Set())}>Reset</Button>
            <Button variant="primary" size="sm"><FileText size={14} /> Export Checklist</Button>
          </div>
        </>
      )}

      {!practiceArea && (
        <div className="text-center py-12 text-slate-400">
          <ListChecks size={32} className="mx-auto mb-2 opacity-50" />
          <p className="text-sm">Select a practice area and case type to generate a checklist</p>
        </div>
      )}
    </div>
  );
}
