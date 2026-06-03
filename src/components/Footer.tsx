"use client";

import Link from "next/link";
import { Twitter, Linkedin, Instagram, Github, ArrowUp } from "lucide-react";

const SOCIAL_LINKS = [
  { Icon: Twitter, label: "Twitter" },
  { Icon: Linkedin, label: "LinkedIn" },
  { Icon: Instagram, label: "Instagram" },
  { Icon: Github, label: "GitHub" },
];

export function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="border-t border-border/50 py-10 sm:py-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 mb-12">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight" aria-label="JOBRA Home">
              <span className="warm-text">JOBRA</span>
            </Link>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">AI-powered career intelligence platform. Land your dream job faster.</p>
            <div className="flex gap-3 mt-4">
              {SOCIAL_LINKS.map(({ Icon, label }) => (
                <a key={label} href="#" aria-label={`Follow us on ${label}`} className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Product</h4>
            <div className="space-y-2">
              {["Resume Analysis", "Resume Builder", "Job Matching", "Interview Prep"].map((item) => (
                <Link key={item} href={`/${item.toLowerCase().replace(/ /g, "-")}`} className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</Link>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Company</h4>
            <div className="space-y-2">
              {["About", "Careers", "Blog", "Press"].map((item) => (
                <a key={item} href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">Legal</h4>
            <div className="space-y-2">
              {["Privacy", "Terms", "Cookies", "Security"].map((item) => (
                <a key={item} href="#" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">{item}</a>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border/50">
          <p className="text-xs text-muted-foreground">© 2026 JOBRA. All rights reserved.</p>
          <button onClick={scrollToTop} aria-label="Scroll to top" className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300">
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
