"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { ScrollFade } from "./ScrollFade";
import { Magnetic } from "./Magnetic";

export function CTASection() {
  return (
    <section className="py-14 px-4 sm:px-6">
      <ScrollReveal>
        <div className="max-w-4xl mx-auto text-center">
          <ScrollFade>
            <span className="text-xs tracking-widest uppercase text-primary">✦ Start Free Today</span>
            <h2 className="section-heading mt-4">Ready to Engineer Your Next Career Move?</h2>
            <p className="section-subheading mx-auto mt-6">Stop guessing and start performing. Upload your resume today and let JOBRA&apos;s AI Intelligence handle the rest.</p>
          </ScrollFade>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <Magnetic strength={8} scale={1.05} className="inline-block">
              <Link href="/resume-analysis" className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:opacity-90 transition-all flex items-center gap-2">
                Analyze My Resume Now <ArrowRight className="w-4 h-4" />
              </Link>
            </Magnetic>
            <Magnetic strength={6} scale={1.05} className="inline-block">
              <a href="#features" className="px-6 py-3 rounded-full border border-border text-foreground font-semibold hover:bg-accent/50 transition-all">
                View Demo
              </a>
            </Magnetic>
          </div>
          <div className="flex items-center justify-center gap-8 mt-12">
            {[{ value: "FORTUNE 500", label: "Companies" }, { value: "TRUSTED", label: "AI Labs" }, { value: "ISO", label: "Certified" }].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-sm font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default CTASection;
