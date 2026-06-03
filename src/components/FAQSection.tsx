"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";
import { ScrollFade } from "./ScrollFade";

const faqs = [
  { q: "What is an ATS and why does it matter?", a: "An Applicant Tracking System (ATS) is software used by most large companies to filter resumes before a human ever sees them. If your resume isn't ATS-friendly, it gets rejected automatically. JOBRA ensures your resume passes these filters." },
  { q: "How does the AI resume analysis work?", a: "Upload your resume (PDF or DOCX), and our AI engine scans it for ATS compatibility, keyword density, formatting issues, and section structure. You get a detailed score breakdown plus actionable suggestions." },
  { q: "Is my data safe and private?", a: "Absolutely. All uploads are encrypted. Your resume data is auto-deleted within 24 hours. We never share your information with third parties." },
  { q: "What's the difference between General, Role, and JD analysis?", a: "General Analysis checks overall ATS formatting. Role-based Analysis matches your resume against a specific job title. JD Analysis compares against a specific job description for the most accurate match score." },
  { q: "How does the AI resume improvement work?", a: "After analysis, our AI rewrites your content by adding quantified achievements, industry keywords, action verbs, and proper formatting. The improved version loads into our resume builder." },
  { q: "Can I use JOBRA for free?", a: "Yes! The free plan includes 3 resume scans per month with general ATS scoring. Upgrade to Pro for unlimited features." },
  { q: "What file formats are supported?", a: "We support PDF, DOC, and DOCX files up to 2MB. Our resume builder exports in both PDF and DOCX formats." },
  { q: "How accurate is the ATS score?", a: "Our AI has been trained on data from major ATS systems. We maintain high accuracy in predicting ATS pass rates, validated against thousands of real submissions." },
];

function FAQItem({ faq, isOpen, onToggle }: { faq: typeof faqs[0]; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-border last:border-0">
      <button onClick={onToggle} className="w-full py-5 flex items-center justify-between text-left">
        <span className="text-sm font-medium text-foreground pr-4">{faq.q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? "max-h-40 pb-5" : "max-h-0"}`}>
        <p className="text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
      </div>
    </div>
  );
}

export function FAQSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <section className="py-14 px-4 sm:px-6">
      <ScrollReveal>
        <div className="max-w-3xl mx-auto">
          <ScrollFade>
            <div className="text-center mb-12">
              <span className="text-xs tracking-widest uppercase text-primary">✦ FAQ</span>
              <h2 className="section-heading mt-4">Frequently Asked Questions</h2>
              <p className="section-subheading mx-auto mt-4">Everything you need to know about JOBRA and how it works.</p>
            </div>
          </ScrollFade>
          <div className="glass-card rounded-2xl p-6 md:p-8">
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} isOpen={openIdx === i} onToggle={() => setOpenIdx(openIdx === i ? null : i)} />
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-8">
            Still have questions?{" "}
            <a href="mailto:support@jobra.ai" className="text-primary hover:underline">Contact our support team</a>
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default FAQSection;
