import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(date: Date | string): string {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function daysUntil(date: Date | string): number {
  const d = new Date(date);
  const now = new Date();
  const diff = d.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

export function isOverdue(date: Date | string): boolean {
  return daysUntil(date) < 0;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    ACTIVE: "bg-green-100 text-green-800",
    PENDING: "bg-yellow-100 text-yellow-800",
    CLOSED: "bg-gray-100 text-gray-800",
    ON_HOLD: "bg-orange-100 text-orange-800",
    ARCHIVED: "bg-slate-100 text-slate-800",
    NEW: "bg-blue-100 text-blue-800",
    CONTACTED: "bg-purple-100 text-purple-800",
    CONSULTATION_SCHEDULED: "bg-indigo-100 text-indigo-800",
    RETAINER_SENT: "bg-amber-100 text-amber-800",
    RETAINED: "bg-green-100 text-green-800",
    DECLINED: "bg-red-100 text-red-800",
    FOLLOW_UP_NEEDED: "bg-orange-100 text-orange-800",
    PENDING_REVIEW: "bg-amber-100 text-amber-800 border border-amber-300",
    APPROVED: "bg-green-100 text-green-800",
    REJECTED: "bg-red-100 text-red-800",
    IN_PROGRESS: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELLED: "bg-gray-100 text-gray-800",
  };
  return colors[status] || "bg-gray-100 text-gray-800";
}

export function truncate(str: string, len: number = 50): string {
  if (str.length <= len) return str;
  return str.slice(0, len) + "...";
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getPracticeAreaColor(area: string): string {
  const colors: Record<string, string> = {
    IMMIGRATION: "bg-blue-50 text-blue-700 border-blue-200",
    PERSONAL_INJURY: "bg-red-50 text-red-700 border-red-200",
    FAMILY_LAW: "bg-purple-50 text-purple-700 border-purple-200",
    PROBATE_ESTATE_PLANNING: "bg-green-50 text-green-700 border-green-200",
    REAL_PROPERTY: "bg-amber-50 text-amber-700 border-amber-200",
    BUSINESS_TAX: "bg-indigo-50 text-indigo-700 border-indigo-200",
    CIVIL_LITIGATION: "bg-slate-50 text-slate-700 border-slate-200",
  };
  return colors[area] || "bg-gray-50 text-gray-700 border-gray-200";
}
