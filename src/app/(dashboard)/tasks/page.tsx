"use client";

import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { useState, useEffect } from "react";
import { Plus, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface TaskItem {
  id: string;
  title: string;
  description?: string;
  status: string;
  dueDate?: string;
  priority?: string;
  caseId?: string;
}

interface CaseItem {
  id: string;
  caseName: string;
}

export default function TasksPage() {
  const { data: session, status } = useSession();
  const [filter, setFilter] = useState<string>("all");
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [cases, setCases] = useState<CaseItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/tasks").then((r) => r.json()),
      fetch("/api/cases").then((r) => r.json()),
    ])
      .then(([tasksData, casesData]) => {
        setTasks(tasksData.tasks || []);
        setCases(casesData.cases || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (status === "loading") return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading...</p></div>;
  if (status === "unauthenticated") redirect("/login");
  if (!session) return null;

  const filtered = filter === "all" ? tasks : tasks.filter((t) => t.status === filter.toUpperCase().replace(" ", "_"));

  const getCaseName = (caseId?: string | null) => {
    if (!caseId) return "General";
    const c = cases.find((cs) => cs.id === caseId);
    return c?.caseName || "Unknown";
  };

  if (loading) return <div className="flex items-center justify-center min-h-screen"><p className="text-slate-500">Loading tasks...</p></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tasks</h1>
          <p className="text-sm text-slate-500 mt-1">{tasks.length} total tasks</p>
        </div>
        <Button variant="primary" size="sm"><Plus size={16} /> Add Task</Button>
      </div>

      <div className="flex gap-2">
        {["all", "pending", "in_progress", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              filter === f ? "bg-slate-800 text-white" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
            }`}
          >
            {f.replace("_", " ").charAt(0).toUpperCase() + f.slice(1).replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((task) => (
          <Card key={task.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {task.status === "COMPLETED" ? (
                    <CheckCircle size={20} className="text-green-500" />
                  ) : task.status === "IN_PROGRESS" ? (
                    <Clock size={20} className="text-blue-500" />
                  ) : (
                    <AlertCircle size={20} className="text-amber-500" />
                  )}
                  <div>
                    <p className={`text-sm font-medium ${task.status === "COMPLETED" ? "line-through text-slate-400" : "text-slate-800"}`}>
                      {task.title}
                    </p>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-500">
                      <span>Case: {getCaseName(task.caseId)}</span>
                      {task.dueDate && <span>Due: {formatDate(new Date(task.dueDate))}</span>}
                      {task.priority && <Badge variant="status" status={task.priority}>{task.priority}</Badge>}
                    </div>
                  </div>
                </div>
                <Badge variant="status" status={task.status} />
              </div>
            </CardContent>
          </Card>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-slate-400">
            <p className="text-sm">No tasks found</p>
          </div>
        )}
      </div>
    </div>
  );
}
