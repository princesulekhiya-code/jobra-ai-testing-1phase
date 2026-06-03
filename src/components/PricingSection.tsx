"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Zap, Crown, Building2 } from "lucide-react";
import { ScrollReveal } from "./ScrollReveal";

const plans = [
  { id: "free", name: "Free", icon: Zap, price: { monthly: 0, yearly: 0 }, desc: "Get started with basic ATS analysis", popular: false, features: ["3 resume scans / month", "General ATS score", "Basic keyword analysis", "1 resume template", "PDF export"], cta: "Get Started Free", href: "/resume-analysis" },
  { id: "pro", name: "Pro", icon: Crown, price: { monthly: 19, yearly: 15 }, desc: "Everything you need to land your dream job", popular: true, features: ["Unlimited resume scans", "Role-specific analysis", "Job description matching", "AI resume improvement", "All 22 templates", "PDF & DOCX export", "Interview prep", "Priority support"], cta: "Start Pro Trial", href: "/login" },
  { id: "enterprise", name: "Enterprise", icon: Building2, price: { monthly: -1, yearly: -1 }, desc: "For teams and recruitment agencies", popular: false, features: ["Everything in Pro", "Team analytics", "Bulk processing", "Custom branding", "API access", "Dedicated manager", "SSO & SAML", "SLA guarantee"], cta: "Contact Sales", href: "#" },
];

export function PricingSection() {
  const [yearly, setYearly] = useState(false);

  return (
    <section id="pricing" className="py-14 px-6">
      <ScrollReveal>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs tracking-widest uppercase text-primary">✦ Pricing</span>
            <h2 className="section-heading mt-4">Simple, transparent pricing</h2>
            <p className="section-subheading mx-auto mt-4">Choose the plan that fits your career goals.</p>
          </div>

          <div className="flex items-center justify-center gap-3 mb-12">
            <span className={`text-sm ${!yearly ? "text-foreground" : "text-muted-foreground"}`}>Monthly</span>
            <button onClick={() => setYearly(!yearly)} className={`relative w-11 h-6 rounded-full transition-colors ${yearly ? "bg-primary" : "bg-switch-background"}`}>
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-foreground transition-transform ${yearly ? "left-6" : "left-1"}`} />
            </button>
            <span className={`text-sm ${yearly ? "text-foreground" : "text-muted-foreground"}`}>Yearly <span className="text-primary text-xs">Save 20%</span></span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {plans.map((plan) => {
              const Icon = plan.icon;
              const price = yearly ? plan.price.yearly : plan.price.monthly;
              return (
                <div key={plan.id} className={`glass-card rounded-2xl p-8 relative ${plan.popular ? "border border-primary/30 scale-[1.02]" : ""}`}>
                  {plan.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">Most Popular</div>}
                  <div className="flex items-center gap-3 mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">{plan.name}</h3>
                  </div>
                  <p className="text-sm text-muted-foreground mb-6">{plan.desc}</p>
                  <div className="mb-6">
                    {price === -1 ? (
                      <span className="text-3xl font-bold text-foreground">Custom</span>
                    ) : price === 0 ? (
                      <span className="text-3xl font-bold text-foreground">Free</span>
                    ) : (
                      <span className="text-3xl font-bold text-foreground">${price}<span className="text-sm text-muted-foreground">/mo</span></span>
                    )}
                  </div>
                  <Link href={plan.href} className={`block text-center py-2.5 rounded-full text-sm font-semibold transition-all ${plan.popular ? "bg-primary text-primary-foreground hover:opacity-90" : "bg-secondary text-foreground hover:bg-accent"}`}>
                    {plan.cta}
                  </Link>
                  <div className="mt-6 space-y-3">
                    {plan.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check className="w-4 h-4 text-primary shrink-0" />
                        {f}
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </ScrollReveal>
    </section>
  );
}

export default PricingSection;
