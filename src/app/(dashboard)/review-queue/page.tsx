"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Shield, AlertTriangle, Check, X, Eye, Bot, FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDateTime } from "@/lib/utils";
import { getReviewItems, updateReviewStatus, ReviewItem } from "@/lib/review-store";

interface CaseItem {
  id: string;
  caseName: string;
}

export default function ReviewQueuePage() {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<ReviewItem[]>([]);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadItems = useCallback(async () => {
    setLoading(true);
    const [allItems, casesData] = await Promise.all([
      getReviewItems(),
      fetch("/api/cases").then((r) => r.json()),
    ]);
    setItems(allItems);
    setCases((casesData.cases || []));
    setLoading(false);
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  const pendingItems = items.filter((i) => i.status === "PENDING_REVIEW");
  const approvedCount = items.filter((i) => i.status === "APPROVED").length;
  const rejectedCount = items.filter((i) => i.status === "REJECTED").length;

  const handleApprove = async (id: string) => {
    await updateReviewStatus(id, "APPROVED");
    await loadItems();
  };

  const handleReject = async (id: string) => {
    await updateReviewStatus(id, "REJECTED");
    await loadItems();
  };

  const getCaseName = (caseId?: string) => {
    if (!caseId) return "";
    const c = cases.find((cs) => cs.id === caseId);
    return c?.caseName || "";
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "IMMIGRATION_PACKET":
        return <FileText size={18} className="text-blue-600" />;
      default:
        return <Bot size={18} className="text-indigo-600" />;
    }
  };

  const getTypeBg = (type: string) => {
    switch (type) {
      case "IMMIGRATION_PACKET":
        return "bg-blue-50";
      default:
        return "bg-indigo-50";
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Attorney Review Queue</h1>
        <p className="text-sm text-slate-500 mt-1">{pendingItems.length} items pending attorney review</p>
      </div>

      {/* Warning Banner */}
      <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
        <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">All Items Require Attorney Review</p>
          <p className="text-xs text-amber-700">
            Per California ethical rules and firm policy, AI-generated content must be reviewed and approved by a licensed attorney
            before being used, sent to clients, or filed with any court or agency.
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-amber-600">{pendingItems.length}</p>
            <p className="text-xs text-slate-500">Pending Review</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            <p className="text-xs text-slate-500">Approved</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
            <p className="text-xs text-slate-500">Rejected</p>
          </CardContent>
        </Card>
      </div>

      {/* Review List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {loading ? (
              <p className="text-sm text-slate-500 text-center py-8">Loading review items...</p>
            ) : items.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-8">No review items yet</p>
            ) : (
              items.map((item) => (
                <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${getTypeBg(item.type)}`}>
                        {getTypeIcon(item.type)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-slate-800">{item.title}</p>
                          <Badge variant="status" status={item.status}>
                            {item.status === "PENDING_REVIEW" ? "Pending Review" : item.status === "APPROVED" ? "Approved" : "Rejected"}
                          </Badge>
                        </div>
                        {item.caseId && (
                          <p className="text-sm text-slate-500 mt-0.5">
                            Case: {getCaseName(item.caseId)}
                          </p>
                        )}
                        {item.clientName && (
                          <p className="text-sm text-slate-500">Client: {item.clientName}</p>
                        )}
                        {item.details && (
                          <p className="text-xs text-slate-400 mt-1">{item.details}</p>
                        )}
                        <p className="text-xs text-slate-400 mt-1">{formatDateTime(item.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.type === "IMMIGRATION_PACKET" && item.caseId && (
                        <Link href={`/immigration/${item.caseId}`}>
                          <Button variant="ghost" size="xs"><Eye size={14} /> View</Button>
                        </Link>
                      )}
                      {item.status === "PENDING_REVIEW" && (
                        <>
                          <Button variant="success" size="xs" onClick={() => handleApprove(item.id)}>
                            <Check size={14} /> Approve
                          </Button>
                          <Button variant="danger" size="xs" onClick={() => handleReject(item.id)}>
                            <X size={14} /> Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
