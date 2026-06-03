"use client";

import { useState } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { X, Check, Sparkles } from "lucide-react";

const beforePoints = [
  { text: "Managed a team of developers", issue: "Vague, no metrics" },
  { text: "Responsible for sales growth", issue: "Passive language" },
  { text: "Worked on various projects", issue: "No specifics" },
  { text: "Good communication skills", issue: "Generic filler" },
  { text: "Proficient in many tools", issue: "No keywords" },
];

const afterPoints = [
  { text: "Led a cross-functional team of 12 engineers, delivering 3 products on schedule", improved: "Quantified impact" },
  { text: "Drove 47% YoY revenue growth through strategic partnership development", improved: "Measurable results" },
  { text: "Architected microservices platform serving 2M+ daily active users", improved: "Specific & impressive" },
  { text: "Presented quarterly insights to C-suite, influencing $5M budget allocation", improved: "Action-oriented" },
  { text: "Expert in React, TypeScript, AWS, Docker, and CI/CD pipelines", improved: "ATS keywords" },
];

export function BeforeAfterResumeSection() {
  const [hoveredSide, setHoveredSide] = useState<"before" | "after" | null>(null);

  return (
    <section className="py-28 px-6 relative overflow-hidden">
      <ScrollReveal>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium">✦ AI Transformation</span>
            <h2 className="section-heading mt-4">
              See the difference AI makes
            </h2>
            <p className="text-muted-foreground mt-4 text-base max-w-lg mx-auto">
              Your resume before and after JOBRA&apos;s AI optimization.
            </p>
          </div>

          <div className="grid md:grid-cols-[1fr_auto_1fr] gap-6 items-stretch">
            <div
              onMouseEnter={() => setHoveredSide("before")}
              onMouseLeave={() => setHoveredSide(null)}
              className={`rounded-2xl border overflow-hidden relative transition-all duration-500 ${
                hoveredSide === "before"
                  ? "border-destructive/30"
                  : "border-border/40"
              }`}
            >
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/before-resume-bg.jpg"
                  alt=""
                  loading="lazy"
                  width={800}
                  height={900}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    hoveredSide === "before" ? "scale-105 opacity-15" : "opacity-10"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80" />
              </div>

              <div className="relative z-10 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-2 h-2 rounded-full bg-destructive/60" />
                  <span className="text-xs font-semibold text-destructive/70 uppercase tracking-[0.2em]">Before</span>
                </div>

                <div className="space-y-5">
                  {beforePoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <X className="w-4 h-4 text-destructive/40 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-muted-foreground/60 line-through decoration-destructive/15">{point.text}</p>
                        <span className="text-[10px] text-destructive/40 mt-1 block font-medium">{point.issue}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-5 border-t border-border/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-muted-foreground/40 uppercase tracking-widest">ATS Score</span>
                    <span className="text-2xl font-bold text-destructive/50 tabular-nums">32%</span>
                  </div>
                  <div className="w-full h-1 bg-secondary/50 rounded-full overflow-hidden">
                    <div className="h-full bg-destructive/25 rounded-full transition-all duration-1000" style={{ width: "32%" }} />
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex flex-col items-center justify-center gap-3 py-8">
              <div className="w-px h-20 bg-gradient-to-b from-transparent via-border/30 to-transparent" />
              <div className="w-10 h-10 rounded-full border border-primary/20 bg-primary/[0.05] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-primary/50" />
              </div>
              <div className="text-[10px] text-primary/30 font-semibold tracking-[0.2em] uppercase">AI</div>
              <div className="w-px h-20 bg-gradient-to-b from-transparent via-border/30 to-transparent" />
            </div>

            <div
              onMouseEnter={() => setHoveredSide("after")}
              onMouseLeave={() => setHoveredSide(null)}
              className={`rounded-2xl border overflow-hidden relative transition-all duration-500 ${
                hoveredSide === "after"
                  ? "border-primary/30"
                  : "border-border/40"
              }`}
            >
              <div className="absolute inset-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/after-resume-bg.jpg"
                  alt=""
                  loading="lazy"
                  width={800}
                  height={900}
                  className={`w-full h-full object-cover transition-all duration-700 ${
                    hoveredSide === "after" ? "scale-105 opacity-15" : "opacity-10"
                  }`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-background/80" />
              </div>

              <div className="relative z-10 p-6 md:p-8">
                <div className="flex items-center gap-2 mb-8">
                  <div className="w-2 h-2 rounded-full bg-primary/60" />
                  <span className="text-xs font-semibold text-primary/70 uppercase tracking-[0.2em]">After</span>
                </div>

                <div className="space-y-5">
                  {afterPoints.map((point, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-primary/50 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm text-foreground/80">{point.text}</p>
                        <span className="text-[10px] text-primary/35 mt-1 block font-medium">{point.improved}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 pt-5 border-t border-border/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] text-muted-foreground/40 uppercase tracking-widest">ATS Score</span>
                    <span className="text-2xl font-bold text-primary/70 tabular-nums">94%</span>
                  </div>
                  <div className="w-full h-1 bg-secondary/50 rounded-full overflow-hidden">
                    <div className="h-full bg-primary/35 rounded-full transition-all duration-1000" style={{ width: "94%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default BeforeAfterResumeSection;
