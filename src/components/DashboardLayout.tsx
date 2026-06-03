"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Search, FileText, Briefcase, MessageSquare, Users,
  User, Settings, LogOut, ChevronRight, Menu, X, Loader2,
} from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: Search, label: "Resume Analysis", href: "/resume-analysis" },
  { icon: FileText, label: "Resume Builder", href: "/resume-builder" },
  { icon: Briefcase, label: "Job Matches", href: "/job-matches" },
  { icon: MessageSquare, label: "AI Interview", href: "/interview" },
  { icon: Users, label: "Mentors", href: "/mentors" },
];

const bottomMenuItems = [
  { icon: User, label: "Profile", href: "/profile" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

interface DashboardLayoutProps {
  children: React.ReactNode;
  headerTitle?: string;
  hideHeader?: boolean;
}

export function DashboardLayout({ children, headerTitle, hideHeader }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, authenticated, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const userName = user?.name || "User";

  // useEffect(() => {
  //   if (!loading && !authenticated) {
  //     router.replace(`/login?redirect=${encodeURIComponent(pathname || "/dashboard")}`);
  //   }
  // }, [loading, authenticated, router, pathname]);

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  // if (!authenticated) return null;

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 md:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 z-50 w-[220px] bg-card border-r border-border flex flex-col shrink-0 transition-transform duration-300 md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Logo */}
        <div className="px-5 py-5 border-b border-border flex items-center justify-between">
          <div>
            <Link href="/" className="flex items-center gap-2 group">
              <span className="text-[15px] font-bold text-primary tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>Jobra AI</span>
            </Link>
            <p className="text-[9px] text-muted-foreground/60 mt-0.5 ml-0.5 font-medium uppercase tracking-wider">AI Career Platform</p>
          </div>
          <button className="md:hidden p-1.5 rounded-lg hover:bg-secondary" onClick={() => setSidebarOpen(false)}>
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname === item.href || (item.href === "/resume-builder" && pathname?.startsWith("/resume-builder"));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12.5px] font-medium transition-all duration-150 group ${
                  isActive
                    ? "bg-primary text-primary-foreground shadow-[0_2px_8px_hsl(25_55%_58%/0.3)]"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <item.icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"}`} />
                <span className="flex-1">{item.label}</span>
                {isActive && <ChevronRight className="w-3 h-3 text-primary-foreground/60" />}
              </Link>
            );
          })}
        </nav>

        {/* Admin section label */}
        <div className="px-5 pt-2 pb-1">
          <p className="text-[9px] font-bold text-muted-foreground/50 uppercase tracking-widest">Admin</p>
        </div>

        {/* Bottom */}
        <div className="px-3 pb-4 flex flex-col gap-0.5">
          {bottomMenuItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12.5px] font-medium transition-all duration-150 group text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <item.icon className="w-4 h-4 shrink-0 text-muted-foreground group-hover:text-foreground" />
              {item.label}
            </Link>
          ))}
          <button
            onClick={logout}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[12.5px] font-medium transition-all duration-150 group text-destructive/70 hover:bg-destructive/10 hover:text-destructive w-full text-left"
          >
            <LogOut className="w-4 h-4 shrink-0 text-destructive/70" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top header */}
        {!hideHeader && (
          <header className="bg-card border-b border-border px-4 sm:px-6 h-14 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <button className="md:hidden p-1.5 rounded-lg hover:bg-secondary" onClick={() => setSidebarOpen(true)}>
                <Menu className="w-5 h-5 text-muted-foreground" />
              </button>
              <h2 className="text-[14px] font-semibold text-foreground">
                {headerTitle || menuItems.find((item) => item.href === pathname)?.label || "Dashboard"}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Search bar */}
              <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary border border-border w-52">
                <Search className="w-3.5 h-3.5 text-muted-foreground" />
                <input
                  placeholder="Search candidates or jobs..."
                  className="bg-transparent text-[12px] text-foreground outline-none w-full placeholder:text-muted-foreground"
                />
              </div>

              {/* Avatar */}
              <div className="flex items-center gap-2 pl-2 border-l border-border">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-warm-dim flex items-center justify-center text-[11px] font-bold text-primary-foreground shadow-sm">
                  {userName.split(" ").map((n) => n[0]).join("")}
                </div>
                <div className="hidden md:block">
                  <p className="text-[12px] font-semibold text-foreground">{userName}</p>
                  <p className="text-[10px] text-muted-foreground">{user?.email || ""}</p>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar">{children}</main>

        {/* Footer */}
        <footer className="border-t border-border bg-card px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row justify-between items-center gap-1 shrink-0">
          <p className="text-[10px] text-muted-foreground/60">&copy; 2026 JOBRA Intelligence. All rights reserved.</p>
          <div className="flex gap-4 text-[10px] text-muted-foreground/60">
            <span className="hover:text-muted-foreground cursor-pointer transition-colors">Terms</span>
            <span className="hover:text-muted-foreground cursor-pointer transition-colors">Privacy</span>
            <span className="hover:text-muted-foreground cursor-pointer transition-colors">Status</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
