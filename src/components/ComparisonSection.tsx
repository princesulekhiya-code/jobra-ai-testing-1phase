"use client";

import { ScrollReveal } from "./ScrollReveal";
import { Check, Minus } from "lucide-react";

const features = [
  "ATS Score Analysis",
  "AI Resume Rewriting",
  "22 Professional Templates",
  "Smart Job Matching",
  "Compatibility Scores",
  "AI Mock Interview",
  "Expert Mentorship",
  "One-Click Apply",
];

const competitors = [
  {
    name: "JOBRA",
    highlight: true,
    support: [true, true, true, true, true, true, true, true],
  },
  {
    name: "Zety",
    highlight: false,
    support: [false, false, true, false, false, false, false, false],
  },
  {
    name: "Resume.io",
    highlight: false,
    support: [true, false, true, false, false, false, false, false],
  },
  {
    name: "Kickresume",
    highlight: false,
    support: [false, false, true, false, false, false, false, false],
  },
];

export function ComparisonSection() {
  return (
    <section className="py-14 px-4 sm:px-6 relative overflow-hidden">
      <ScrollReveal>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-[11px] tracking-[0.3em] uppercase text-primary/70 font-medium">✦ Why JOBRA</span>
            <h2 className="section-heading mt-4">
              The complete career platform
            </h2>
            <p className="text-muted-foreground mt-4 text-base max-w-lg mx-auto">
              See how JOBRA compares to other resume tools.
            </p>
          </div>

          <div className="rounded-2xl border border-border/50 overflow-x-auto bg-card/30 backdrop-blur-sm">
            <div className="min-w-[520px]">
              <div className="grid grid-cols-5 border-b border-border/30">
                <div className="p-3 md:p-5 text-[10px] md:text-xs text-muted-foreground/50 uppercase tracking-widest font-medium">Features</div>
                {competitors.map((c, i) => (
                  <div
                    key={i}
                    className={`p-3 md:p-5 text-center text-xs md:text-sm font-semibold ${
                      c.highlight ? "text-primary bg-primary/[0.04]" : "text-muted-foreground"
                    }`}
                  >
                    {c.name}
                  </div>
                ))}
              </div>

              {features.map((feat, fi) => (
                <div
                  key={fi}
                  className={`grid grid-cols-5 transition-colors ${
                    fi < features.length - 1 ? "border-b border-border/20" : ""
                  } hover:bg-accent/10`}
                >
                  <div className="p-3 md:p-5 text-xs md:text-sm text-muted-foreground/80">{feat}</div>
                  {competitors.map((c, ci) => (
                    <div
                      key={ci}
                      className={`p-3 md:p-5 flex items-center justify-center ${
                        c.highlight ? "bg-primary/[0.02]" : ""
                      }`}
                    >
                      {c.support[fi] ? (
                        <Check className={`w-4 h-4 ${c.highlight ? "text-primary/70" : "text-muted-foreground/40"}`} />
                      ) : (
                        <Minus className="w-4 h-4 text-muted-foreground/20" />
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default ComparisonSection;
