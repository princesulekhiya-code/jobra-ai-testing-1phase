"use client";

import { useState, useEffect, useCallback, useRef, type TouchEvent as ReactTouchEvent } from "react";
import Link from "next/link";
import { FileSearch, FileText, Mic, Briefcase, Send, CheckCircle2, ArrowRight, Clock } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const phases = [
  {
    num: "01", label: "Phase 1", title: "Resume Analysis", subtitle: "Instant ATS Score & Feedback",
    icon: FileSearch, status: "Live",
    features: ["Upload resume with or without Job Description", "Select target Job Role for tailored analysis", "Generate ATS score & improvement suggestions"],
    href: "/resume-analysis", cta: "Try Now",
  },
  {
    num: "02", label: "Phase 2", title: "Resume Correction", subtitle: "AI-Powered Resume Rewriting",
    icon: FileText, status: "Live",
    features: ["Improve grammar, structure & formatting", "Auto-suggest power words & better descriptions", "Export as polished PDF"],
    href: "/resume-builder", cta: "Build Resume",
  },
  {
    num: "03", label: "Phase 3", title: "Job Suggestions", subtitle: "Smart Job Matching Engine",
    icon: Briefcase, status: "Live",
    features: ["Suggest jobs based on skills & experience", "Compatibility score for each job role", "Filter by location, salary & industry"],
    href: "/job-matches", cta: "Find Jobs",
  },
  {
    num: "04", label: "Phase 4", title: "Direct Job Apply", subtitle: "One-Click Apply & Auto-Fill",
    icon: Send, status: "Coming Soon",
    features: ["Allow one-click apply to jobs", "Auto-fill job applications from resume data", "Track application status in real-time"],
    href: "/job-matches", cta: "Explore",
  },
  {
    num: "05", label: "Phase 5", title: "Interview Prep", subtitle: "AI Interview Coach",
    icon: Mic, status: "Coming Soon",
    features: ["AI voice assistant for interview preparation", "Role-specific question generation", "Real-time scoring on answers & delivery"],
    href: "/interview", cta: "Practice",
  },
];

export function RoadmapSection() {
  const [activePhase, setActivePhase] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoplayRef = useRef<ReturnType<typeof setInterval>>(undefined);

  const phase = phases[activePhase];
  const isLive = phase.status === "Live";

  const touchStartX = useRef<number | null>(null);
  const handleTouchStart = (e: ReactTouchEvent) => { touchStartX.current = e.touches[0].clientX; };
  const handleTouchEnd = (e: ReactTouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0 && activePhase < phases.length - 1) goToPhase(activePhase + 1);
      else if (diff < 0 && activePhase > 0) goToPhase(activePhase - 1);
    }
    touchStartX.current = null;
  };

  const goToPhase = useCallback((idx: number) => {
    if (idx === activePhase) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActivePhase(idx);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 300);
  }, [activePhase]);

  useEffect(() => {
    autoplayRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActivePhase(prev => (prev + 1) % phases.length);
        setTimeout(() => setIsTransitioning(false), 50);
      }, 300);
    }, 6000);
    return () => clearInterval(autoplayRef.current);
  }, []);

  return (
    <section className="py-14 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.03] blur-[120px] pointer-events-none" />

      <ScrollReveal>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-20">
            <span className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium">Product Roadmap</span>
            <h2 className="section-heading mt-4">
              From resume to dream job
            </h2>
            <p className="text-muted-foreground mt-4 text-base max-w-lg mx-auto">5 powerful phases, from resume analysis to AI interview coaching.</p>
          </div>

          <div className="hidden md:flex items-center justify-between mb-16 relative px-4">
            <div className="absolute top-6 left-[60px] right-[60px] h-px bg-border" />
            <div
              className="absolute top-6 left-[60px] h-px bg-primary/40 transition-all duration-700 ease-out"
              style={{ width: `${(activePhase / (phases.length - 1)) * (100 - 10)}%` }}
            />

            {phases.map((p, i) => {
              const isActive = i === activePhase;
              const isPast = i < activePhase;
              return (
                <button
                  key={i}
                  onClick={() => goToPhase(i)}
                  className="relative z-10 flex flex-col items-center gap-3 group transition-all duration-500"
                >
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-500 border ${
                      isActive
                        ? "bg-primary/15 border-primary/40 text-primary scale-110 shadow-[0_0_20px_hsl(var(--primary)/0.15)]"
                        : isPast
                        ? "bg-primary/8 border-primary/20 text-primary/60"
                        : "bg-secondary/50 border-border text-muted-foreground group-hover:border-primary/20"
                    }`}
                  >
                    {p.num}
                  </div>
                  <span className={`text-xs transition-all duration-300 ${
                    isActive ? "text-foreground font-medium" : "text-muted-foreground"
                  }`}>
                    {p.title}
                  </span>
                </button>
              );
            })}
          </div>

          <div
            className={`rounded-2xl border border-border/60 bg-card/50 backdrop-blur-sm p-5 sm:p-8 md:p-10 transition-all duration-500 touch-pan-y ${isTransitioning ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"}`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <div className="grid md:grid-cols-[1fr_260px] gap-10">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <span className="text-xs text-muted-foreground font-medium tracking-wide">{phase.label}</span>
                  <span className={`text-[11px] px-2.5 py-1 rounded-full flex items-center gap-1.5 font-medium ${
                    isLive
                      ? "bg-primary/10 text-primary/80 border border-primary/15"
                      : "bg-secondary/80 text-muted-foreground border border-border/50"
                  }`}>
                    {isLive ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                    {phase.status}
                  </span>
                </div>

                <h3 className="text-2xl md:text-3xl font-semibold text-foreground tracking-tight">{phase.title}</h3>
                <p className="text-muted-foreground mt-2 mb-8 text-sm">{phase.subtitle}</p>

                <ul className="space-y-4">
                  {phase.features.map((feat, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-3 text-sm text-muted-foreground/80 transition-all duration-300"
                      style={{ animationDelay: `${i * 100}ms` }}
                    >
                      <CheckCircle2 className="w-4 h-4 text-primary/50 mt-0.5 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={phase.href}
                  className="inline-flex items-center gap-2 mt-10 px-6 py-2.5 rounded-full text-sm font-medium bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 hover:border-primary/30 transition-all duration-300"
                >
                  {phase.cta} <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="hidden md:block">
                <p className="text-[11px] text-muted-foreground/60 uppercase tracking-widest mb-5 font-medium">Platform Progress</p>
                <div className="space-y-1.5">
                  {phases.map((p, i) => {
                    const isActive = i === activePhase;
                    return (
                      <button
                        key={i}
                        onClick={() => goToPhase(i)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm transition-all duration-300 ${
                          isActive
                            ? "bg-primary/[0.06] border border-primary/15"
                            : "border border-transparent hover:bg-accent/20"
                        }`}
                      >
                        <span className={`transition-colors duration-300 ${isActive ? "text-foreground font-medium" : "text-muted-foreground"}`}>
                          {p.title}
                        </span>
                        <span className={`ml-auto text-[11px] ${isActive ? "text-primary/60" : "text-muted-foreground/50"}`}>
                          {p.status === "Live" ? "100%" : "Soon"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-border/30">
              <div className="flex gap-1.5">
                {phases.map((_, i) => (
                  <div
                    key={i}
                    className="h-0.5 rounded-full flex-1 transition-all duration-700 ease-out"
                    style={{
                      background: i < activePhase
                        ? "hsl(var(--primary) / 0.3)"
                        : i === activePhase
                        ? `linear-gradient(90deg, hsl(var(--primary) / 0.4), hsl(var(--primary) / 0.15))`
                        : "hsl(var(--border) / 0.3)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-2 mt-8 md:hidden">
            {phases.map((_, i) => (
              <button
                key={i}
                onClick={() => goToPhase(i)}
                className="rounded-full transition-all duration-500"
                style={{
                  width: i === activePhase ? "24px" : "6px",
                  height: "6px",
                  background: i === activePhase ? "hsl(var(--primary) / 0.5)" : "hsl(var(--border))",
                }}
              />
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default RoadmapSection;
