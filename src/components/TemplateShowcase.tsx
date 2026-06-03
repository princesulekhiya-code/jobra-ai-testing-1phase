"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { templates } from "@/lib/templates";
import {
  ResumePreview,
  type ContactInfo,
  type ExpItem,
  type EduItem,
  type SkillGroup,
  type ProjectItem,
  type LanguageItem,
  type AwardItem,
} from "@/components/ResumeLayouts";

const sampleContact: ContactInfo = {
  name: "Marcus Vane",
  title: "Senior Product Designer",
  email: "marcus.vane@email.com",
  phone: "+1 (555) 123-4567",
  location: "San Francisco, CA",
  summary:
    "Senior product designer with 8+ years of experience driving user-centered design for high-growth SaaS platforms. Led design systems across 3 product lines serving 2M+ users, delivering a 40% increase in user engagement and 25% reduction in support tickets through intuitive UX patterns.",
};

const sampleExperience: ExpItem[] = [
  {
    title: "Senior Product Designer",
    company: "DesignFlow Systems",
    period: "2021 – Present",
    bullets: [
      "Led end-to-end design for cloud platform serving 500K+ enterprise users, increasing user satisfaction by 35%",
      "Built and maintained a design system with 120+ components, reducing dev handoff time by 60%",
      "Conducted 50+ user research sessions, translating insights into features that drove $2M ARR growth",
    ],
  },
  {
    title: "Product Designer",
    company: "TechCorp Industries",
    period: "2018 – 2021",
    bullets: [
      "Redesigned onboarding flow, improving activation rate from 23% to 67% within 3 months",
      "Collaborated with engineering team of 12 to ship 4 major product releases per quarter",
    ],
  },
];

const sampleEducation: EduItem[] = [
  {
    degree: "M.S. Human-Computer Interaction",
    school: "Stanford University",
    year: "2018",
  },
  {
    degree: "B.A. Visual Communication Design",
    school: "Rhode Island School of Design",
    year: "2016",
  },
];

const sampleSkills: SkillGroup[] = [
  { category: "Design", items: ["Figma", "Sketch", "Adobe XD", "Framer", "Principle"] },
  { category: "Research", items: ["User Testing", "A/B Testing", "Analytics", "Surveys"] },
  { category: "Technical", items: ["HTML/CSS", "React", "Tailwind", "Git"] },
];

const sampleProjects: ProjectItem[] = [
  {
    title: "DesignFlow Component Library",
    description: "Open-source design system for enterprise applications",
    technologies: ["Figma", "React", "Storybook"],
    bullets: [
      "Created 120+ reusable components adopted by 15 product teams",
      "Reduced design-to-dev handoff time by 60%",
    ],
  },
];

const sampleLanguages: LanguageItem[] = [
  { name: "English", level: "Native" },
  { name: "Spanish", level: "Professional" },
  { name: "French", level: "Intermediate" },
];

const sampleAwards: AwardItem[] = [
  { title: "Design Excellence Award", institution: "AIGA" },
  { title: "Best Product Design", institution: "ProductHunt Golden Kitty" },
];

const sampleCertificates: string[] = [
  "Google UX Design Professional Certificate",
  "Certified Usability Analyst (CUA)",
];

const sampleLinkedin = "linkedin.com/in/marcusvane";

function RealTemplateThumbnail({ tpl }: { tpl: (typeof templates)[0] }) {
  return (
    <div
      style={{
        width: 794,
        minHeight: 1123,
        transformOrigin: "top left",
        transform: "scale(var(--thumb-scale, 0.26))",
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      <ResumePreview
        contact={sampleContact}
        experience={sampleExperience}
        education={sampleEducation}
        skills={sampleSkills}
        tpl={tpl}
        linkedin={sampleLinkedin}
        projects={sampleProjects}
        languages={sampleLanguages}
        awards={sampleAwards}
        certificates={sampleCertificates}
      />
    </div>
  );
}

export function TemplateShowcase() {
  const [scrollIdx, setScrollIdx] = useState(0);
  const [autoplay, setAutoplay] = useState(true);
  const featured = templates.slice(0, 12);
  const visibleDesktop = 4;

  useEffect(() => {
    if (!autoplay) return;
    const timer = setInterval(() => {
      setScrollIdx((prev) => (prev + 1) % (featured.length - visibleDesktop + 1));
    }, 3500);
    return () => clearInterval(timer);
  }, [autoplay, featured.length]);

  const prev = () => {
    setAutoplay(false);
    setScrollIdx((p) => Math.max(0, p - 1));
  };
  const next = () => {
    setAutoplay(false);
    setScrollIdx((p) => Math.min(featured.length - visibleDesktop, p + 1));
  };

  return (
    <section className="py-14 px-6 cosmic-bg grid-bg relative overflow-hidden">
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-14">
          <p className="text-[11px] font-bold tracking-[0.3em] uppercase text-primary/70 mb-5">✦ 22 Professional Templates</p>
          <h2
            className="section-heading mt-4"
          >
            Beautiful templates for{" "}
            <span className="bg-gradient-to-r from-primary via-purple-400 to-purple-300 bg-clip-text text-transparent">
              every career
            </span>
          </h2>
          <p className="text-[15px] text-muted-foreground max-w-md mx-auto leading-relaxed">
            Simple, modern, and creative designs, all ATS-optimized and ready to fill with your data.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div className="overflow-hidden rounded-2xl">
            <div
              className="flex gap-4 transition-transform duration-500 ease-out"
              style={{
                transform: `translateX(-${scrollIdx * (100 / visibleDesktop + 1.4)}%)`,
              }}
              onMouseEnter={() => setAutoplay(false)}
              onMouseLeave={() => setAutoplay(true)}
            >
              {featured.map((tpl) => (
                <div
                  key={tpl.id}
                  className="flex-shrink-0 group cursor-pointer"
                  style={{ width: `calc(${100 / visibleDesktop}% - 12px)` }}
                >
                  <div className="glow-border-hover rounded-xl overflow-hidden">
                    <div className="relative bg-card border border-border rounded-xl overflow-hidden transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-[0_12px_40px_hsl(var(--primary)/0.08)]">
                      {/* Real template preview — scaled down */}
                      <div
                        className="relative overflow-hidden"
                        style={{
                          aspectRatio: "8.5 / 11",
                          ["--thumb-scale" as string]: 0.26,
                        }}
                      >
                        <RealTemplateThumbnail tpl={tpl} />
                      </div>

                      {/* Label */}
                      <div className="p-3 border-t border-border">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-[13px] font-semibold text-foreground">
                            {tpl.name}
                          </h4>
                          <span
                            className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                            style={{
                              color:
                                tpl.category === "simple"
                                  ? "hsl(var(--muted-foreground))"
                                  : tpl.category === "modern"
                                    ? "hsl(var(--accent))"
                                    : "hsl(var(--primary))",
                              background:
                                tpl.category === "simple"
                                  ? "hsl(var(--muted) / 0.5)"
                                  : tpl.category === "modern"
                                    ? "hsl(var(--accent) / 0.12)"
                                    : "hsl(var(--primary) / 0.12)",
                            }}
                          >
                            {tpl.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          {tpl.desc}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation arrows */}
          <button
            onClick={prev}
            disabled={scrollIdx === 0}
            className="absolute -left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg z-10"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={next}
            disabled={scrollIdx >= featured.length - visibleDesktop}
            className="absolute -right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-card border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-primary/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed shadow-lg z-10"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1.5 mt-6">
          {Array.from({ length: featured.length - visibleDesktop + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setAutoplay(false);
                setScrollIdx(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === scrollIdx
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-border hover:bg-muted-foreground/30"
              }`}
            />
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/resume-templates"
            className="group inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-secondary border border-border text-foreground text-sm font-semibold hover:border-primary/30 hover:bg-primary/5 transition-all duration-300"
          >
            Browse All 22 Templates
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </section>
  );
}
