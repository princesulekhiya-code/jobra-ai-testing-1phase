"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, FileSearch, FileText, Mic, Briefcase, Zap, Crown, Building2, Users, Lightbulb, Award, LogOut } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";

const SERVICE_ITEMS = [
  { label: "Resume Analysis", href: "/resume-analysis", desc: "AI-powered ATS score & optimization", icon: FileSearch },
  { label: "Resume Builder", href: "/resume-builder", desc: "Build ATS-friendly professional resumes", icon: FileText },
  { label: "Interview Prep", href: "/interview", desc: "AI mock interview simulator", icon: Mic },
  { label: "Job Matching", href: "/job-matches", desc: "Smart role compatibility scoring", icon: Briefcase },
];

const PRICE_ITEMS = [
  { label: "Free", href: "#pricing", desc: "Basic ATS analysis, 3 scans/month", icon: Zap, tag: "Current" },
  { label: "Pro", href: "#pricing", desc: "Unlimited scans, AI resume builder", icon: Crown, tag: "$19/mo" },
  { label: "Enterprise", href: "#pricing", desc: "Team analytics, priority support", icon: Building2, tag: "Custom" },
];

const ABOUT_ITEMS = [
  { label: "About Us", href: "#about", desc: "Our mission to revolutionize hiring", icon: Users },
  { label: "How It Works", href: "#features", desc: "See JOBRA's AI engine in action", icon: Lightbulb },
  { label: "Success Stories", href: "#testimonials", desc: "Real results from real professionals", icon: Award },
];

function NavDropdown({ trigger, children }: { trigger: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(undefined);
  const enter = () => { clearTimeout(timeout.current); setOpen(true); };
  const leave = () => { timeout.current = setTimeout(() => setOpen(false), 120); };

  return (
    <div className="relative" onMouseEnter={enter} onMouseLeave={leave}>
      <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors" style={{ fontFamily: "'Inter', system-ui, sans-serif" }} aria-label={`Open ${trigger} menu`}>
        {trigger}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-300 ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-2 w-72 glass-card rounded-xl p-2 z-50">
          {children}
        </div>
      )}
    </div>
  );
}

function DropdownItem({ item }: { item: { label: string; href: string; desc: string; icon: React.ElementType<{ className?: string }>; tag?: string } }) {
  const Icon = item.icon;
  const isHash = item.href.startsWith("#");

  const handleClick = (e: React.MouseEvent) => {
    if (isHash) {
      e.preventDefault();
      const id = item.href.replace("#", "");
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const content = (
    <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
      <Icon className="w-5 h-5 text-primary mt-0.5 shrink-0" />
      <div>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>{item.label}</span>
          {item.tag && <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">{item.tag}</span>}
        </div>
        <p className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>{item.desc}</p>
      </div>
    </div>
  );
  return isHash ? <a href={item.href} onClick={handleClick}>{content}</a> : <Link href={item.href}>{content}</Link>;
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastScrollY = useRef(0);
  const { authenticated, user, logout } = useAuth();

  useEffect(() => {
    const h = () => {
      const y = window.scrollY;
      setScrolled(y > 20);
      setHidden(y > 100 && y > lastScrollY.current);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <header className={`fixed left-0 right-0 z-50 transition-all duration-500 ${hidden ? "-top-20" : "top-0"} ${scrolled ? "bg-background/90 backdrop-blur-xl border-b border-border/50 shadow-lg shadow-background/20" : "bg-background/60 backdrop-blur-md"}`}>
      <div className="w-full px-4 sm:px-8 md:px-16 lg:px-24 h-16 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold tracking-tight shrink-0" style={{ fontFamily: "'Playfair Display', serif" }}>
          <span className="warm-text">JOBRA</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <NavDropdown trigger="Services">
            {SERVICE_ITEMS.map((item) => <DropdownItem key={item.label} item={item} />)}
          </NavDropdown>
          <NavDropdown trigger="Pricing">
            {PRICE_ITEMS.map((item) => <DropdownItem key={item.label} item={item} />)}
          </NavDropdown>
          <NavDropdown trigger="About">
            {ABOUT_ITEMS.map((item) => <DropdownItem key={item.label} item={item} />)}
          </NavDropdown>
        </nav>

        <div className="hidden md:flex items-center">
          {authenticated ? (
            <div className="flex items-center gap-3" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              <Link
                href="/dashboard"
                className="text-sm font-medium bg-foreground text-background rounded-full px-5 py-2 hover:opacity-90 transition-opacity"
              >
                Dashboard
              </Link>
              <div className="flex items-center gap-2 pl-3 border-l border-border/60">
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-[11px] font-bold text-primary-foreground">
                  {user?.name?.charAt(0)?.toUpperCase() || "U"}
                </div>
                <span className="text-sm text-muted-foreground max-w-[120px] truncate">{user?.name || user?.email}</span>
                <button onClick={logout} className="p-1.5 rounded-lg hover:bg-secondary transition-colors" title="Logout">
                  <LogOut className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-0 rounded-full border border-border/60 bg-muted/30 backdrop-blur-sm" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
              <span className="text-sm text-muted-foreground px-5 py-2">AI-Powered Career Tools</span>
              <Link
                href="/login"
                aria-label="Get Started with JOBRA"
                className="text-sm font-medium bg-foreground text-background rounded-full px-5 py-2 hover:opacity-90 transition-opacity"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>

        <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)} aria-label={mobileOpen ? "Close menu" : "Open menu"}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-xl border-t border-border p-6 space-y-4">
          {SERVICE_ITEMS.map((item) => (
            <Link key={item.label} href={item.href} className="block text-sm text-muted-foreground hover:text-foreground py-2" onClick={() => setMobileOpen(false)}>
              {item.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-border">
            {authenticated ? (
              <div className="flex flex-col gap-2">
                <Link href="/dashboard" className="block px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold text-center" onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <button onClick={() => { setMobileOpen(false); logout(); }} className="px-4 py-2 rounded-full border border-border text-sm font-medium text-destructive text-center">Logout</button>
              </div>
            ) : (
              <Link href="/login" className="block px-4 py-2 rounded-full bg-foreground text-background text-sm font-semibold text-center" onClick={() => setMobileOpen(false)}>Get Started</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
