"use client";

import { useEffect } from "react";
import { Briefcase, Building2, CalendarDays, ChevronRight, Clock3, Globe2, MapPin, Sparkles, X } from "lucide-react";
import MatchBadge from "@/components/MatchBadge";

export type JobListing = {
  id: string;
  title: string;
  company: string;
  location?: string;
  salary?: string;
  posted?: string;
  postedAt?: string;
  match?: number;
  confidence?: number;
  remote?: boolean;
  apply_url?: string;
  description?: string;
  skills?: string[];
  matchedSkills?: string[];
  missingSkills?: string[];
  benefits?: string[];
  experience?: string;
  type?: string;
  companySize?: string;
  matchNote?: string;
};

type JobDetailsModalProps = {
  job: JobListing | null;
  open: boolean;
  saved: boolean;
  onClose: () => void;
  onToggleSaved: (job: JobListing) => void;
  onApply: (job: JobListing) => void;
};

export default function JobDetailsModal({ job, open, saved, onClose, onToggleSaved, onApply }: JobDetailsModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);

  if (!open || !job) return null;

  const matchedSkills = job.matchedSkills?.length ? job.matchedSkills : job.skills?.slice(0, 4) ?? [];
  const missingSkills = job.missingSkills?.length ? job.missingSkills : ["Leadership", "System design", "Stakeholder management"].slice(0, 3);
  const confidence = Math.max(0, Math.min(100, Math.round(job.confidence ?? job.match ?? 0)));

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm px-3 py-4 sm:px-6 sm:py-8 flex items-end sm:items-center justify-center" onClick={onClose}>
      <div
        className="w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-[28px] border border-border bg-[color:var(--card)] shadow-[0_40px_120px_rgba(0,0,0,0.45)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 px-5 sm:px-7 py-5 border-b border-border/70 bg-gradient-to-r from-[color:var(--card)] to-[color:var(--secondary)]/30">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2 text-[11px] font-bold uppercase tracking-[0.28em] text-muted-foreground/70 mb-2">
              <span className="inline-flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" />{job.company}</span>
              {job.remote && <span className="inline-flex items-center gap-1.5"><Globe2 className="w-3.5 h-3.5" />Remote</span>}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-tight">
              {job.title}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1.5"><MapPin className="w-4 h-4" />{job.location || "Location flexible"}</span>
              <span className="inline-flex items-center gap-1.5"><Briefcase className="w-4 h-4" />{job.type || "Full time"}</span>
              <span className="inline-flex items-center gap-1.5"><Clock3 className="w-4 h-4" />{job.posted || "Recently posted"}</span>
              {job.salary && <span className="inline-flex items-center gap-1.5"><CalendarDays className="w-4 h-4" />{job.salary}</span>}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 w-10 h-10 rounded-full bg-card border border-border hover:border-primary/30 hover:bg-secondary/60 transition-colors flex items-center justify-center"
            aria-label="Close job details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,1.5fr)_360px] gap-0 max-h-[calc(92vh-88px)] overflow-y-auto">
          <div className="p-5 sm:p-7 space-y-6">
            <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2">Match score</p>
                <div className="flex items-center justify-between gap-3">
                  <MatchBadge match={confidence} onClick={onClose} />
                  <span className="text-xs text-muted-foreground">AI confidence</span>
                </div>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2">Experience</p>
                <p className="text-sm font-semibold text-foreground">{job.experience || "Mid to senior level"}</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4">
                <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2">Company size</p>
                <p className="text-sm font-semibold text-foreground">{job.companySize || "Growing team"}</p>
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-lg font-bold text-foreground">About this role</h3>
                {job.matchNote && <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full bg-primary/10 text-primary"><Sparkles className="w-3 h-3" />Match note</span>}
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                {job.description || "This role is a strong fit for your profile. The modal is ready for real-time API data, but works with raw data today."}
              </p>
              {job.matchNote && <p className="mt-4 text-sm leading-7 text-foreground/90 border-l-2 border-primary/40 pl-4">{job.matchNote}</p>}

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2">Matched skills</p>
                  <div className="flex flex-wrap gap-2">
                    {matchedSkills.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 text-[12px] font-semibold">{skill}</span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground mb-2">Missing skills</p>
                  <div className="flex flex-wrap gap-2">
                    {missingSkills.map((skill) => (
                      <span key={skill} className="px-3 py-1.5 rounded-full bg-amber-500/10 text-amber-200 border border-amber-500/20 text-[12px] font-semibold">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-border bg-card p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3 mb-4">
                <h3 className="text-lg font-bold text-foreground">What you get</h3>
                <span className="text-[11px] font-semibold text-muted-foreground">Benefits + extras</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {(job.benefits || ["Remote flexibility", "Health coverage", "Growth roadmap"]).map((benefit) => (
                  <span key={benefit} className="px-3 py-1.5 rounded-full bg-secondary border border-border text-[12px] font-semibold text-muted-foreground">
                    {benefit}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <aside className="border-t lg:border-t-0 lg:border-l border-border bg-[color:var(--secondary)]/20 p-5 sm:p-6 space-y-4">
            <div className="rounded-3xl border border-border bg-card p-5 space-y-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wide text-muted-foreground">Quick actions</p>
                  <h3 className="text-lg font-bold text-foreground mt-1">Apply or save later</h3>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>

              {job.apply_url ? (
                <a href={job.apply_url} target="_blank" rel="noreferrer" className="w-full inline-block text-center px-4 py-3 rounded-2xl bg-primary text-primary-foreground font-bold shadow-[0_12px_30px_hsl(25_55%_58%/0.25)] hover:opacity-95 transition-opacity">
                  Apply Now
                </a>
              ) : (
                <button type="button" onClick={() => onApply(job)} className="w-full px-4 py-3 rounded-2xl bg-primary text-primary-foreground font-bold shadow-[0_12px_30px_hsl(25_55%_58%/0.25)] hover:opacity-95 transition-opacity">
                  Apply Now
                </button>
              )}
              <button type="button" onClick={() => onToggleSaved(job)} className="w-full px-4 py-3 rounded-2xl border border-border bg-card font-semibold hover:border-primary/30 hover:bg-secondary/60 transition-colors">
                {saved ? "Saved" : "Save Job"}
              </button>
            </div>

            <div className="rounded-3xl border border-border bg-card p-5 space-y-4">
              <h4 className="text-sm font-bold text-foreground">Role snapshot</h4>
              <dl className="space-y-3 text-sm">
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Location</dt>
                  <dd className="font-semibold text-foreground text-right">{job.location || "Flexible"}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Salary</dt>
                  <dd className="font-semibold text-foreground text-right">{job.salary || "Shared in interview"}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Posted</dt>
                  <dd className="font-semibold text-foreground text-right">{job.posted || "Recently"}</dd>
                </div>
                <div className="flex items-center justify-between gap-3">
                  <dt className="text-muted-foreground">Remote</dt>
                  <dd className="font-semibold text-foreground text-right">{job.remote ? "Yes" : "No"}</dd>
                </div>
              </dl>
            </div>

            <p className="text-xs text-muted-foreground leading-6">
              Built to work with raw data today and ready for live API data later. Connect the backend endpoint, and the same modal will keep working without UI changes.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}