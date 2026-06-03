"use client";

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Upload, CheckCircle, FileText, Shield, Clock, BarChart3, ArrowRight, Sparkles } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { ScrollFade } from "./ScrollFade";

const STEPS = [
  { num: 1, label: "Upload", desc: "Drop your resume", icon: Upload },
  { num: 2, label: "Analyze", desc: "AI scans your file", icon: Sparkles },
  { num: 3, label: "Optimize", desc: "Get actionable tips", icon: BarChart3 },
];

export function ScoreSection() {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (!file) { setActiveStep(0); return; }
    setActiveStep(1);
    const t1 = setTimeout(() => setActiveStep(2), 800);
    return () => { clearTimeout(t1); };
  }, [file]);

  const handleFile = (f: File) => {
    const ext = f.name.toLowerCase();
    if (!ext.endsWith(".pdf") && !ext.endsWith(".docx") && !ext.endsWith(".doc")) { setError("Only PDF or DOCX files are accepted"); return; }
    if (f.size > 2 * 1024 * 1024) { setError("File size must not exceed 2MB"); return; }
    setError(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (window as any).__pendingResumeFile = f;
    setFile(f);
  };

  return (
    <section className="py-14 px-4 md:px-10 lg:px-20 relative overflow-hidden">
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/score-section-bg.jpg" alt="" className="w-full h-full object-cover opacity-15" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background/80 to-background" />
      </div>
      <ScrollReveal>
        <div className="w-full mx-auto text-center">
          <ScrollFade>
            <span className="text-xs tracking-widest uppercase text-primary">✦ AI-Powered Analysis</span>
            <h2 className="section-heading mt-4">Get your resume score now!</h2>
            <p className="section-subheading mx-auto mt-4">
              Upload your resume and get instant ATS compatibility analysis with actionable improvement tips.
            </p>
          </ScrollFade>

          {/* Steps bar */}
          <div className="relative flex flex-row items-center justify-center gap-2 sm:gap-6 mt-10 mb-8 max-w-2xl mx-auto">
            {STEPS.map((step, i) => {
              const done = i < activeStep;
              const active = i === activeStep;
              const StepIcon = step.icon;
              return (
                <div key={i} className="flex flex-row items-center gap-2 sm:gap-6">
                  <div className="flex items-center gap-1.5 sm:gap-3 z-10">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all duration-500 shrink-0 ${
                      done
                        ? "bg-primary border-primary text-primary-foreground shadow-[0_0_16px_rgba(200,149,108,0.4)]"
                        : active && file
                        ? "border-primary/60 text-primary bg-primary/15 shadow-[0_0_12px_rgba(200,149,108,0.2)] animate-pulse"
                        : "border-border text-muted-foreground bg-secondary"
                    }`}>
                      {done ? <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5" /> : <StepIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                    </div>
                    <div className="text-left">
                      <p className={`text-xs sm:text-sm font-bold transition-colors duration-500 ${done ? "text-primary" : active && file ? "text-foreground" : "text-muted-foreground"}`}>{step.label}</p>
                      <p className={`text-[9px] sm:text-[11px] transition-colors duration-500 ${done ? "text-primary/60" : "text-muted-foreground/60"}`}>{step.desc}</p>
                    </div>
                  </div>
                  {i < STEPS.length - 1 && (
                    <div className="w-4 sm:w-16 h-[2px] rounded-full relative overflow-hidden" style={{ background: file ? "hsl(var(--border) / 0.4)" : "hsl(var(--border) / 0.2)" }}>
                      {file && (
                        <div
                          className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
                          style={{
                            width: done ? "100%" : (active && file) ? "50%" : "0%",
                            background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--warm-light)))",
                            boxShadow: done || active ? "0 0 8px hsl(var(--primary) / 0.5)" : "none",
                          }}
                        />
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <input ref={fileInputRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }} />
          <div
            className={`relative border-2 border-dashed rounded-2xl p-6 sm:p-12 cursor-pointer transition-all duration-500 mx-auto max-w-4xl overflow-hidden group ${
              isDragging ? "border-primary bg-primary/10 scale-[1.01] shadow-[0_0_30px_rgba(200,149,108,0.25)]" : file ? "border-primary/40 bg-primary/[0.05]" : "border-primary/35 bg-primary/[0.03] hover:border-primary/60 hover:bg-primary/[0.06] hover:shadow-[0_0_24px_rgba(200,149,108,0.12)]"
            }`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => { e.preventDefault(); setIsDragging(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            {!file && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] rounded-full bg-primary/[0.07] blur-[80px] group-hover:bg-primary/[0.12] transition-all duration-700" />
              </div>
            )}

            {file ? (
              <div className="flex flex-col items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-primary/15 border-2 border-primary/30 flex items-center justify-center shadow-[0_0_12px_rgba(200,149,108,0.15)]">
                  <FileText className="w-7 h-7 text-primary" />
                </div>
                <p className="text-sm text-foreground font-semibold truncate max-w-full">{file.name}</p>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5 text-primary" />
                  <span className="text-[12px] text-primary font-medium">Ready to analyze</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5">
                <div className="w-18 h-18 w-[72px] h-[72px] rounded-2xl border-2 border-dashed border-primary/40 flex items-center justify-center group-hover:border-primary/70 group-hover:bg-primary/[0.1] transition-all duration-500 shadow-[0_0_20px_rgba(200,149,108,0.1)] group-hover:shadow-[0_0_28px_rgba(200,149,108,0.2)]">
                  <Upload className="w-8 h-8 text-primary/70 group-hover:text-primary group-hover:scale-110 transition-all duration-500" />
                </div>
                <div>
                  <p className="text-base sm:text-lg text-foreground font-bold">Drop your resume here or <span className="text-primary underline underline-offset-4 decoration-2">browse</span></p>
                  <p className="text-sm text-muted-foreground/70 mt-2">Supports PDF, DOC, DOCX · Max 2MB</p>
                </div>
                <div className="flex items-center gap-6 mt-2">
                  {[
                    { icon: Shield, text: "Secure & Private" },
                    { icon: Clock, text: "30 Sec Analysis" },
                    { icon: Sparkles, text: "AI Powered" },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-muted-foreground/70">
                      <item.icon className="w-3.5 h-3.5 text-primary/60" />
                      {item.text}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-xs text-destructive mt-3">{error}</p>}

          {file && (
            <button
              onClick={() => { router.push("/resume-analysis"); }}
              className="mt-6 px-8 py-3 rounded-full bg-primary text-primary-foreground text-sm font-semibold inline-flex items-center gap-2 hover:opacity-90 hover:shadow-lg hover:shadow-primary/20 transition-all group active:scale-[0.98] animate-fade-in"
            >
              Analyze Now <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          )}


        </div>
      </ScrollReveal>
    </section>
  );
}

export default ScoreSection;
