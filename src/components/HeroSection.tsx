"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Upload, FileText, CheckCircle2, X } from "lucide-react";
import { HeroResumeAnimation } from "./HeroResumeAnimation";

const JOB_TITLES = [
  "Frontend Developer", "Data Scientist", "Product Manager", "UX Designer",
  "Cloud Architect", "DevOps Engineer", "ML Engineer", "Full Stack Developer",
];

function RoleSwitcher() {
  const [activeIdx, setActiveIdx] = useState(0);
  const [displayed, setDisplayed] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (pause) { const t = setTimeout(() => { setDeleting(true); setPause(false); }, 1800); return () => clearTimeout(t); }
    const target = JOB_TITLES[activeIdx];
    if (!deleting) {
      if (displayed.length < target.length) { const t = setTimeout(() => setDisplayed(target.slice(0, displayed.length + 1)), 60); return () => clearTimeout(t); }
      else setPause(true);
    } else {
      if (displayed.length > 0) { const t = setTimeout(() => setDisplayed(displayed.slice(0, -1)), 35); return () => clearTimeout(t); }
      else { setDeleting(false); setActiveIdx((i) => (i + 1) % JOB_TITLES.length); }
    }
  }, [displayed, deleting, pause, activeIdx]);

  const prev = (activeIdx - 1 + JOB_TITLES.length) % JOB_TITLES.length;
  const next = (activeIdx + 1) % JOB_TITLES.length;

  return (
    <div className="flex flex-col gap-1 sm:gap-1.5 h-[5.5rem] sm:h-[7rem] overflow-hidden">
      <div className="text-muted-foreground/30 font-medium text-base sm:text-lg md:text-xl opacity-60 scale-95" style={{ fontFamily: "'Playfair Display', serif" }}>
        {JOB_TITLES[prev]}
      </div>
      <div className="warm-text font-bold text-xl sm:text-2xl md:text-3xl" style={{ fontFamily: "'Playfair Display', serif" }}>
        <span className="inline-block w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-primary/80 mr-2 sm:mr-3 align-middle" />
        {displayed}<span className="animate-pulse text-primary/60">|</span>
      </div>
      <div className="text-muted-foreground/30 font-medium text-base sm:text-lg md:text-xl opacity-60 scale-95" style={{ fontFamily: "'Playfair Display', serif" }}>
        {JOB_TITLES[next]}
      </div>
    </div>
  );
}

function ResumeDropZone({ visible }: { visible: boolean }) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((f: File) => {
    const ext = f.name.toLowerCase();
    if (!ext.endsWith(".pdf") && !ext.endsWith(".docx") && !ext.endsWith(".doc")) { setError("Only PDF or DOCX files accepted"); return; }
    if (f.size > 2 * 1024 * 1024) { setError("File must be under 2MB"); return; }
    setError(null); setFile(f); setProgress(0);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__pendingResumeFile = f;

    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100; clearInterval(iv);
        setTimeout(() => { router.push("/resume-analysis"); }, 400);
      }
      setProgress(p);
    }, 200);
  }, [router]);

  if (!visible) return null;

  return (
    <div className="mt-10 animate-fade-up-delay-2">
      <input ref={inputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
      {!file ? (
        <div className="max-w-xl">
          <div
            className={`group relative rounded-2xl border-2 border-dashed p-6 sm:p-10 text-center cursor-pointer transition-all duration-500 ${
              isDragging
                ? "border-primary bg-primary/10 scale-[1.01] shadow-[0_0_30px_rgba(200,149,108,0.25)]"
                : "border-primary/40 bg-primary/[0.04] hover:border-primary/70 hover:bg-primary/[0.08] hover:shadow-[0_0_24px_rgba(200,149,108,0.15)]"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
            onClick={() => inputRef.current?.click()}
          >
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/[0.06] to-transparent pointer-events-none" />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-xl bg-primary/15 border-2 border-primary/30 flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:bg-primary/25 group-hover:scale-110 group-hover:border-primary/50 shadow-[0_0_16px_rgba(200,149,108,0.15)]">
                <Upload className="w-6 h-6 text-primary" />
              </div>
              <p className="text-base text-foreground font-bold">Drop your resume here</p>
              <p className="text-sm text-muted-foreground/70 mt-2">PDF, DOC, DOCX · Max 2MB</p>
            </div>
          </div>

        </div>
      ) : (
        <div className="max-w-md rounded-2xl p-6 border border-border/50 bg-card/50">
          <div className="flex items-center gap-3 mb-3">
            <FileText className="w-5 h-5 text-primary" />
            <span className="text-sm text-foreground truncate flex-1">{file.name}</span>
            {progress >= 100 ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <button onClick={() => { setFile(null); setProgress(0); }}><X className="w-4 h-4 text-muted-foreground" /></button>}
          </div>
          <div className="w-full h-1 bg-secondary rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: "linear-gradient(90deg, hsl(var(--warm-dim)), hsl(var(--primary)))",
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">{progress >= 100 ? "Redirecting to analysis…" : "Uploading…"}</p>
        </div>
      )}
      {error && <p className="text-xs text-destructive mt-3">{error}</p>}
    </div>
  );
}

export function HeroSection() {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.1 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="relative min-h-[auto] lg:min-h-screen flex items-start pt-20 overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/hero-bg.jpg"
        alt=""
        width={1920}
        height={1080}
        loading="eager"
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-background/40" />

      <div className="relative z-10 w-full px-4 sm:px-6 md:px-12 lg:px-20 xl:px-28 pt-8 pb-10 lg:pb-16 flex flex-col lg:flex-row items-start gap-10 lg:gap-14">
        <div className="flex-1 text-left flex flex-col justify-center">
          <div className="mb-8 opacity-0 animate-[heroReveal_0.8s_ease-out_0.2s_forwards]">
            <span className="text-[10px] tracking-[0.35em] uppercase text-primary/50 font-medium">✦ Resume Checker</span>
          </div>

          <h1
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground leading-[1.05] opacity-0 animate-[heroReveal_0.9s_ease-out_0.5s_forwards]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Your career, at the
            <br />
            speed of <span className="warm-text">now</span>.
          </h1>

          <div className="mt-7 max-w-xl opacity-0 animate-[heroReveal_0.9s_ease-out_0.85s_forwards]">
            <p className="text-base md:text-lg text-muted-foreground/80 leading-relaxed">
              AI-powered resume analysis, job matching, and career intelligence.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground/50 mt-4 mb-2 tracking-wide uppercase">
              Land your next role as a
            </p>
            <RoleSwitcher />
          </div>

          <div className="opacity-0 animate-[heroReveal_0.9s_ease-out_1.15s_forwards]">
            <ResumeDropZone visible={visible} />
          </div>

        </div>

        <div className="flex-1 hidden lg:flex items-start justify-center pt-4 animate-fade-up-delay-2">
          <HeroResumeAnimation />
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
