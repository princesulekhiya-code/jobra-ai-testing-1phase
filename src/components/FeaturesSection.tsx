"use client";

import { Scan, TrendingUp, Briefcase, Target, FileText, BarChart3 } from "lucide-react";
import { useState } from "react";
import { ScrollReveal } from "./ScrollReveal";
import { ScrollFade } from "./ScrollFade";
import { Magnetic } from "./Magnetic";
import { AmbientGlow } from "./AmbientGlow";

const features = [
  { icon: Scan, title: "Resume Scan", description: "Upload your resume and our AI will parse through, identifying key qualifications and providing insights.", num: "01", bg: "/images/feature-resume-scan.jpg" },
  { icon: TrendingUp, title: "Career Trajectory", description: "Get tailored career suggestions based on current skills and industry trends.", num: "02", bg: "/images/feature-career-trajectory.jpg" },
  { icon: Target, title: "Smart Matching", description: "Understand where your career could lead, get pathways curated from market data.", num: "03", bg: "/images/feature-smart-matching.jpg" },
  { icon: Briefcase, title: "Job Compatibility", description: "Match your skills with job listings, see compatibility scores for various roles.", num: "04", bg: "/images/feature-job-compatibility.jpg" },
  { icon: FileText, title: "Resume Builder", description: "Build a compelling resume. Let our AI help you craft impactful professional documents.", num: "05", bg: "/images/feature-resume-builder.jpg" },
  { icon: BarChart3, title: "Industry Analytics", description: "Stay informed about industry trends, explore which sectors are hiring and growing.", num: "06", bg: "/images/feature-industry-analytics.jpg" },
];

export function FeaturesSection() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <section id="features" className="py-14 px-4 sm:px-6 relative overflow-hidden">
      <AmbientGlow position="bottom-left" />
      <AmbientGlow position="top-right" />
      <ScrollReveal>
        <div className="max-w-6xl mx-auto">
          <ScrollFade>
            <div className="text-center mb-10 sm:mb-16">
              <span className="text-xs tracking-widest uppercase text-primary">✦ Powerful Tools</span>
              <h2 className="section-heading mt-4">Everything you need to land your dream job</h2>
              <p className="section-subheading mx-auto mt-4">Six powerful AI tools working together to analyze, optimize, and position your career for success.</p>
            </div>
          </ScrollFade>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const isActive = activeIndex === index;
              const Icon = feature.icon;
              return (
                <ScrollReveal key={index} delay={index * 80} direction="up">
                  <Magnetic strength={5} scale={1.05} glow>
                    <div
                      onClick={() => setActiveIndex(isActive ? null : index)}
                      onMouseEnter={() => setActiveIndex(index)}
                      onMouseLeave={() => setActiveIndex(null)}
                      className={`relative glow-border-hover glass-card rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 min-h-[240px] ${isActive ? "shadow-lg shadow-primary/10" : ""}`}
                    >
                      <div className="absolute inset-0 overflow-hidden">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={feature.bg}
                          alt=""
                          loading="lazy"
                          width={640}
                          height={512}
                          className={`w-full h-full object-cover transition-all duration-700 ${isActive ? "opacity-40 scale-110 brightness-125" : "opacity-20 scale-100 brightness-75"}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/30" />
                        <div className={`absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent transition-opacity duration-500 ${isActive ? "opacity-100" : "opacity-0"}`} />
                      </div>
                      <div className="relative z-10 p-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                            <Icon className="w-5 h-5 text-primary" />
                          </div>
                          <span className="text-xs text-muted-foreground font-mono">{feature.num}</span>
                        </div>
                        <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                      </div>
                    </div>
                  </Magnetic>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default FeaturesSection;
