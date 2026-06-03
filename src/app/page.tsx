import { Header } from "@/components/Header";
import { HeroSection } from "@/components/HeroSection";
import { TrustedBySection } from "@/components/TrustedBySection";
import { StatsSection } from "@/components/StatsSection";
import { ScoreSection } from "@/components/ScoreSection";
import { DemoVideoSection } from "@/components/DemoVideoSection";
import { FeaturesSection } from "@/components/FeaturesSection";
import { EvaluationSection } from "@/components/EvaluationSection";

import { HowItWorksSection } from "@/components/HowItWorksSection";
import { RoadmapSection } from "@/components/RoadmapSection";
import { WhoIsItForSection } from "@/components/WhoIsItForSection";
import { IntegrationPartnersSection } from "@/components/IntegrationPartnersSection";
import { ComparisonSection } from "@/components/ComparisonSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { FAQSection } from "@/components/FAQSection";
import { CTASection } from "@/components/CTASection";
import { Footer } from "@/components/Footer";
import { ScrollNavDots } from "@/components/ScrollNavDots";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <ScrollNavDots />
      <div id="hero"><HeroSection /></div>
      <TrustedBySection />
      <div id="stats"><StatsSection /></div>
      <div id="score"><ScoreSection /></div>
      <div id="demo"><DemoVideoSection /></div>
      <div id="features"><FeaturesSection /></div>
      <div id="evaluation"><EvaluationSection /></div>

      <div id="how-it-works"><HowItWorksSection /></div>
      <div id="roadmap"><RoadmapSection /></div>
      <div id="who-is-it-for"><WhoIsItForSection /></div>
      <IntegrationPartnersSection />
      <div id="comparison"><ComparisonSection /></div>
      <div id="testimonials"><TestimonialsSection /></div>
      <div id="faq"><FAQSection /></div>
      <div id="cta"><CTASection /></div>
      <Footer />
    </div>
  );
}
