"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSession, signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  FileText,
  FileSpreadsheet,
  PenSquare,
  Languages,
  CheckSquare,
  Calendar,
  UserPlus,
  BarChart3,
  Settings,
  Shield,
  UserCheck,
  Clock,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Scale,
} from "lucide-react";
import { useState } from "react";
import { UserRole } from "@/types";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  roles?: UserRole[];
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
  { label: "Clients", href: "/clients", icon: <Users size={20} /> },
  { label: "Cases", href: "/cases", icon: <Briefcase size={20} /> },
  { label: "Intake Portal", href: "/intake/new", icon: <UserPlus size={20} />, roles: ["ADMIN", "ATTORNEY", "PARALEGAL", "INTAKE_STAFF"] },
  { label: "Documents", href: "/documents", icon: <FileText size={20} /> },
  { label: "AI Writing", href: "/ai-writing", icon: <PenSquare size={20} />, roles: ["ADMIN", "ATTORNEY", "PARALEGAL"] },
  { label: "Translation", href: "/translation", icon: <Languages size={20} />, roles: ["ADMIN", "ATTORNEY", "PARALEGAL"] },
  { label: "Checklists", href: "/checklists", icon: <CheckSquare size={20} /> },
  { label: "Tasks", href: "/tasks", icon: <Clock size={20} /> },
  { label: "Calendar", href: "/calendar", icon: <Calendar size={20} /> },
  { label: "CRM Leads", href: "/crm", icon: <UserCheck size={20} />, roles: ["ADMIN", "ATTORNEY", "PARALEGAL", "INTAKE_STAFF"] },
  { label: "Reports", href: "/reports", icon: <BarChart3 size={20} />, roles: ["ADMIN", "ATTORNEY"] },
  { label: "Review Queue", href: "/review-queue", icon: <Shield size={20} />, roles: ["ADMIN", "ATTORNEY"] },
  { label: "Settings", href: "/settings", icon: <Settings size={20} />, roles: ["ADMIN"] },
  { label: "User Roles", href: "/roles", icon: <Shield size={20} />, roles: ["ADMIN"] },
];

export function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role = (session?.user as any)?.role as UserRole;
  const [mobileOpen, setMobileOpen] = useState(false);

  const filteredItems = navItems.filter(
    (item) => !item.roles || item.roles.includes(role)
  );

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-lg bg-white border border-slate-200 shadow-sm"
      >
        {mobileOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-40 h-full w-64 bg-slate-900 text-white flex flex-col transition-transform duration-200 lg:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="p-5 border-b border-slate-700">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-accent-600 flex items-center justify-center">
              <Scale size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold leading-tight">LexFlow AI</h1>
              <p className="text-xs text-slate-400">Legal Workflow Platform</p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1">
          {filteredItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive
                    ? "bg-accent-600/20 text-accent-300 border border-accent-600/30"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                )}
              >
                {item.icon}
                <span>{item.label}</span>
                {isActive && <ChevronRight size={14} className="ml-auto text-accent-400" />}
              </Link>
            );
          })}
        </nav>

        {/* User info */}
        <div className="p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 rounded-full bg-accent-600 flex items-center justify-center text-xs font-bold">
              {session?.user?.name?.charAt(0) || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{session?.user?.name}</p>
              <p className="text-xs text-slate-400 truncate capitalize">{role?.toLowerCase().replace(/_/g, " ")}</p>
            </div>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="flex items-center gap-2 text-xs text-slate-400 hover:text-white w-full px-1 py-1.5 rounded transition-colors"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <div className="lg:pl-64 min-h-screen bg-slate-50">{children}</div>;
}

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 lg:px-8 py-3 flex items-center justify-between ml-0 lg:ml-64">
      <div className="flex items-center gap-3">
        {/* Mobile spacer for hamburger */}
        <div className="w-8 lg:hidden" />
        <h2 className="text-lg font-semibold text-slate-800">LexFlow AI</h2>
      </div>
      <div className="flex items-center gap-4">
        <div className="text-xs text-slate-400 hidden sm:block">LexFlow AI v1.0</div>
      </div>
    </header>
  );
}
