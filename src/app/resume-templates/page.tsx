"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Check } from "lucide-react";
import { templates, templateCategories, type ResumeTemplate } from "@/lib/templates";

const templateImages = [
  "/images/resume-samples.png",
  "/images/resume-sample.webp",
  "/images/hero-visual.png",
  "/images/resume-low-ats.webp",
  "/images/step-template.jpg",
  "/images/demo-video-frame-v3.jpg",
] as const;

function getTemplateImage(tpl: ResumeTemplate, index: number) {
  if (tpl.layout === "sidebar-dark") return "/images/hero-visual.png";
  if (tpl.layout === "two-col-accent") return "/images/resume-samples.png";
  return templateImages[index % templateImages.length];
}

function TemplateMiniPreview({ tpl, selected }: { tpl: ResumeTemplate; selected: boolean }) {
  const lineColor = "rgba(0,0,0,0.1)";
  const headColor = "rgba(0,0,0,0.72)";

  const renderClassicCenter = () => (
    <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ textAlign: "center", marginBottom: 2 }}>
        <div style={{ height: 8, width: "50%", backgroundColor: headColor, borderRadius: 1, margin: "0 auto 3px" }} />
        <div style={{ height: 3, width: "28%", backgroundColor: "#888", borderRadius: 1, margin: "0 auto 3px", fontStyle: "italic" }} />
        <div style={{ height: 2.5, width: "65%", backgroundColor: lineColor, borderRadius: 1, margin: "0 auto" }} />
      </div>
      <div style={{ height: 1.5, backgroundColor: "#000", margin: "2px 0" }} />
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <div style={{ height: 3.5, width: `${20 + i * 5}%`, backgroundColor: headColor, borderRadius: 1, marginBottom: 2, borderBottom: "1.5px solid #000", paddingBottom: 1 }} />
          <div style={{ height: 2.5, width: "90%", backgroundColor: lineColor, borderRadius: 1, marginBottom: 1.5 }} />
          <div style={{ height: 2.5, width: "75%", backgroundColor: lineColor, borderRadius: 1, marginBottom: 1.5 }} />
          <div style={{ height: 2.5, width: "60%", backgroundColor: lineColor, borderRadius: 1 }} />
        </div>
      ))}
    </div>
  );

  const renderHarvard = () => (
    <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ textAlign: "center", marginBottom: 2 }}>
        <div style={{ height: 8, width: "45%", backgroundColor: headColor, borderRadius: 1, margin: "0 auto 3px" }} />
        <div style={{ height: 2.5, width: "55%", backgroundColor: lineColor, borderRadius: 1, margin: "0 auto" }} />
      </div>
      <div style={{ height: 1, backgroundColor: "#aaa", margin: "1px 0" }} />
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <div style={{ display: "flex", alignItems: "center", gap: 3, marginBottom: 2 }}>
            <div style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
            <div style={{ height: 3, width: `${18 + i * 4}%`, backgroundColor: headColor, borderRadius: 1, flexShrink: 0 }} />
            <div style={{ flex: 1, height: 1, backgroundColor: "#ccc" }} />
          </div>
          <div style={{ height: 2.5, width: "88%", backgroundColor: lineColor, borderRadius: 1, marginBottom: 1.5 }} />
          <div style={{ height: 2.5, width: "72%", backgroundColor: lineColor, borderRadius: 1 }} />
        </div>
      ))}
    </div>
  );

  const renderSidebarDark = () => (
    <div style={{ display: "flex", height: "100%" }}>
      <div style={{ width: "35%", backgroundColor: tpl.sidebarBg || "#1e293b", padding: 6, display: "flex", flexDirection: "column", alignItems: "center", gap: 3 }}>
        <div style={{ width: 16, height: 16, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.2)", marginTop: 2 }} />
        <div style={{ height: 4, width: "70%", backgroundColor: "rgba(255,255,255,0.6)", borderRadius: 1 }} />
        <div style={{ height: 2.5, width: "55%", backgroundColor: "rgba(255,255,255,0.3)", borderRadius: 1, marginBottom: 3 }} />
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ width: "80%", marginBottom: 2 }}>
            <div style={{ height: 2, width: "100%", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 1 }} />
          </div>
        ))}
      </div>
      <div style={{ flex: 1, padding: 7 }}>
        {[1, 2, 3].map((i) => (
          <div key={i} style={{ marginBottom: 5 }}>
            <div style={{ height: 3.5, width: "50%", backgroundColor: tpl.sidebarBg || "#1e293b", borderRadius: 1, marginBottom: 2, padding: "1px 3px" }}>
              <div style={{ height: "100%", width: "100%", backgroundColor: tpl.sidebarBg || "#1e293b", borderRadius: 1 }} />
            </div>
            <div style={{ height: 2, width: "90%", backgroundColor: lineColor, borderRadius: 1, marginBottom: 1.5 }} />
            <div style={{ height: 2, width: "70%", backgroundColor: lineColor, borderRadius: 1 }} />
          </div>
        ))}
      </div>
    </div>
  );

  const renderModernTeal = () => (
    <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 3 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ height: 7, width: 55, backgroundColor: tpl.accent, borderRadius: 1, marginBottom: 2 }} />
          <div style={{ display: "flex", gap: 4 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} style={{ height: 2, width: 18, backgroundColor: lineColor, borderRadius: 1 }} />
            ))}
          </div>
        </div>
        <div style={{ width: 14, height: 14, borderRadius: "50%", backgroundColor: lineColor }} />
      </div>
      {[1, 2].map((i) => (
        <div key={i}>
          <div style={{ height: 4, width: "100%", backgroundColor: tpl.accent, borderRadius: 1, marginBottom: 2 }}>
            <div style={{ height: "100%", width: "100%", borderRadius: 1 }} />
          </div>
          <div style={{ height: 2, width: "85%", backgroundColor: lineColor, borderRadius: 1, marginBottom: 1.5 }} />
          <div style={{ height: 2, width: "65%", backgroundColor: lineColor, borderRadius: 1 }} />
        </div>
      ))}
    </div>
  );

  const renderCorporate = () => (
    <div style={{ padding: 9, display: "flex", flexDirection: "column", gap: 3 }}>
      <div>
        <div style={{ height: 7, width: "50%", backgroundColor: headColor, borderRadius: 1, marginBottom: 2 }} />
        <div style={{ height: 3, width: "30%", backgroundColor: tpl.accent, borderRadius: 1, marginBottom: 2 }} />
        <div style={{ height: 2, width: "70%", backgroundColor: tpl.accent, borderRadius: 1, opacity: 0.3 }} />
      </div>
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <div style={{ height: 3.5, width: `${22 + i * 5}%`, backgroundColor: tpl.accent, borderRadius: 1, marginBottom: 2, borderBottom: `1px solid ${tpl.accent}` }} />
          <div style={{ height: 2, width: "92%", backgroundColor: lineColor, borderRadius: 1, marginBottom: 1.5 }} />
          <div style={{ height: 2, width: "76%", backgroundColor: lineColor, borderRadius: 1 }} />
        </div>
      ))}
    </div>
  );

  const renderTwoColAccent = () => (
    <div style={{ padding: 9, display: "flex", flexDirection: "column", gap: 3 }}>
      <div>
        <div style={{ height: 7, width: "48%", backgroundColor: headColor, borderRadius: 1, marginBottom: 2 }} />
        <div style={{ height: 3, width: "28%", backgroundColor: tpl.accent, borderRadius: 1 }} />
      </div>
      <div style={{ height: 1, backgroundColor: lineColor, margin: "1px 0" }} />
      <div style={{ display: "flex", gap: 6, flex: 1 }}>
        <div style={{ flex: 1 }}>
          {[1, 2].map((i) => (
            <div key={i} style={{ marginBottom: 4 }}>
              <div style={{ height: 3, width: "50%", backgroundColor: tpl.accent, borderRadius: 1, marginBottom: 2 }} />
              <div style={{ height: 2, width: "92%", backgroundColor: lineColor, borderRadius: 1, marginBottom: 1.5 }} />
              <div style={{ height: 2, width: "75%", backgroundColor: lineColor, borderRadius: 1 }} />
            </div>
          ))}
        </div>
        <div style={{ width: "32%", padding: 3 }}>
          <div style={{ height: 3, width: "70%", backgroundColor: tpl.accent, borderRadius: 1, marginBottom: 3 }} />
          {[1, 2, 3, 4].map((i) => (
            <div key={i} style={{ height: 4, width: `${50 + i * 6}%`, backgroundColor: tpl.accent, borderRadius: 2, marginBottom: 2, opacity: 0.2 }} />
          ))}
        </div>
      </div>
    </div>
  );

  const renderSingleMinimal = () => (
    <div style={{ padding: 10, display: "flex", flexDirection: "column", gap: 4 }}>
      <div>
        <div style={{ height: 8, width: "50%", backgroundColor: headColor, borderRadius: 1, marginBottom: 3 }} />
        <div style={{ height: 3, width: "30%", backgroundColor: "#999", borderRadius: 1, marginBottom: 2 }} />
        <div style={{ height: 2, width: "55%", backgroundColor: lineColor, borderRadius: 1 }} />
      </div>
      <div style={{ height: 1, backgroundColor: lineColor, margin: "2px 0" }} />
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <div style={{ height: 3.5, width: `${22 + i * 5}%`, backgroundColor: headColor, borderRadius: 1, marginBottom: 2, opacity: 0.7 }} />
          <div style={{ height: 2.5, width: "88%", backgroundColor: lineColor, borderRadius: 1, marginBottom: 1.5 }} />
          <div style={{ height: 2.5, width: "72%", backgroundColor: lineColor, borderRadius: 1 }} />
        </div>
      ))}
    </div>
  );

  const renderLayout = () => {
    switch (tpl.layout) {
      case "classic-center": return renderClassicCenter();
      case "harvard": return renderHarvard();
      case "sidebar-dark": return renderSidebarDark();
      case "modern-teal": return renderModernTeal();
      case "corporate-clean":
      case "corporate-dense": return renderCorporate();
      case "two-col-accent": return renderTwoColAccent();
      case "single-minimal": return renderSingleMinimal();
      default: return renderCorporate();
    }
  };

  return (
    <div style={{
      width: "100%", aspectRatio: "8.5/11", backgroundColor: tpl.bg, borderRadius: 6,
      display: "flex", flexDirection: "column",
      position: "relative", overflow: "hidden",
    }}>
      {renderLayout()}

      {selected && (
        <div style={{
          position: "absolute", inset: 0, backgroundColor: "hsl(var(--primary) / 0.15)",
          display: "flex", alignItems: "center", justifyContent: "center",
          border: "3px solid hsl(var(--primary))", borderRadius: 6,
        }}>
          <div style={{
            width: 36, height: 36, borderRadius: "50%", backgroundColor: "hsl(var(--primary))",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Check style={{ width: 20, height: 20, color: "hsl(var(--primary-foreground))" }} />
          </div>
        </div>
      )}
    </div>
  );
}

export default function ResumeTemplatesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("all");

  const filtered = activeCategory === "all"
    ? templates
    : templates.filter((t) => t.category === activeCategory);

  const handleUseTemplate = () => {
    if (!selected) return;
    sessionStorage.setItem("selected_template", selected);
    router.push("/resume-builder");
  };

  return (
    <DashboardLayout headerTitle="Choose Template">
      <div style={{ padding: "32px 32px", maxWidth: 1060, margin: "0 auto" }}>

        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h1 style={{
            fontSize: 30, fontWeight: 700, color: "hsl(var(--foreground))",
            fontFamily: "var(--font-abhaya-libre)", marginBottom: 10,
          }}>
            Choose a Template for Your Resume
          </h1>
          <p style={{ fontSize: 13, color: "hsl(var(--muted-foreground))", maxWidth: 440, margin: "0 auto", lineHeight: 1.6 }}>
            Select a professional template. Your improved resume data will be automatically filled in.
          </p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", gap: 8, marginBottom: 32 }}>
          {templateCategories.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = cat.id === "all" ? templates.length : templates.filter((t) => t.category === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  padding: "8px 20px", borderRadius: 20, fontSize: 13, fontWeight: 500,
                  backgroundColor: isActive ? "hsl(var(--primary))" : "hsl(var(--secondary))",
                  border: isActive ? "1px solid hsl(var(--primary))" : "1px solid hsl(var(--border))",
                  color: isActive ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
                  cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
                  transition: "all 0.2s",
                }}
              >
                {cat.label}
                <span style={{
                  fontSize: 10, fontWeight: 600,
                  backgroundColor: isActive ? "hsl(var(--primary-foreground) / 0.2)" : "hsl(var(--foreground) / 0.06)",
                  padding: "2px 7px", borderRadius: 10,
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 40 }}>
          {filtered.map((tpl, index) => {
            const isSelected = selected === tpl.id;
            const imageSrc = getTemplateImage(tpl, index);
            return (
              <div
                key={tpl.id}
                onClick={() => setSelected(tpl.id)}
                style={{
                  cursor: "pointer", borderRadius: 12, overflow: "hidden",
                  border: isSelected ? "2px solid hsl(var(--primary))" : "2px solid hsl(var(--border))",
                  backgroundColor: "hsl(var(--card))",
                  transition: "border-color 0.2s, transform 0.2s",
                  transform: isSelected ? "scale(1.02)" : "scale(1)",
                }}
              >
                <div style={{ position: "relative", aspectRatio: "8.5 / 11", overflow: "hidden", background: "#0b1020" }}>
                  <Image
                    src={imageSrc}
                    alt={`${tpl.name} template preview`}
                    fill
                    sizes="(max-width: 1024px) 50vw, 25vw"
                    style={{ objectFit: "cover" }}
                    priority={index < 4}
                  />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.04) 0%, rgba(0,0,0,0.44) 100%)" }} />
                  <div style={{ position: "absolute", top: 10, left: 10, right: 10, display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#fff", backgroundColor: "rgba(0,0,0,0.35)", padding: "4px 8px", borderRadius: 999 }}>
                      Photo Preview
                    </span>
                    <span style={{ fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.6, color: "#fff", backgroundColor: tpl.category === "simple" ? "rgba(0,0,0,0.35)" : tpl.category === "modern" ? "rgba(15,118,110,0.62)" : "rgba(76,29,149,0.62)", padding: "4px 8px", borderRadius: 999 }}>
                      {tpl.category}
                    </span>
                  </div>
                  <div style={{ position: "absolute", bottom: 12, left: 12, right: 12, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
                      <div style={{ width: 34, height: 34, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.86)", border: "2px solid rgba(255,255,255,0.7)", flexShrink: 0 }} />
                      <div style={{ minWidth: 0 }}>
                        <div style={{ height: 9, width: 86, backgroundColor: "rgba(255,255,255,0.88)", borderRadius: 4, marginBottom: 4 }} />
                        <div style={{ height: 6, width: 120, backgroundColor: "rgba(255,255,255,0.62)", borderRadius: 4 }} />
                      </div>
                    </div>
                    <div style={{ fontSize: 9, color: "#fff", backgroundColor: "rgba(0,0,0,0.28)", padding: "4px 8px", borderRadius: 999, whiteSpace: "nowrap" }}>
                      {tpl.layout.replace(/-/g, " ")}
                    </div>
                  </div>
                </div>
                <div style={{ padding: 10, backgroundColor: "hsl(var(--card))", borderTop: "1px solid hsl(var(--border))" }}>
                  <TemplateMiniPreview tpl={tpl} selected={isSelected} />
                </div>
                <div style={{ padding: "10px 12px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 3 }}>
                    <h4 style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))" }}>{tpl.name}</h4>
                    <span style={{
                      fontSize: 9, fontWeight: 600, textTransform: "uppercase",
                      color: tpl.category === "simple" ? "hsl(var(--muted-foreground))" : tpl.category === "modern" ? "hsl(var(--accent))" : "hsl(var(--primary))",
                      backgroundColor: tpl.category === "simple" ? "hsl(var(--muted) / 0.5)" : tpl.category === "modern" ? "hsl(var(--accent) / 0.12)" : "hsl(var(--primary) / 0.12)",
                      padding: "2px 6px", borderRadius: 4,
                    }}>
                      {tpl.category}
                    </span>
                  </div>
                  <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", lineHeight: 1.4 }}>{tpl.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <div style={{ textAlign: "center", paddingBottom: 32 }}>
          <button
            onClick={handleUseTemplate}
            disabled={!selected}
            style={{
              padding: "14px 48px", borderRadius: 999, fontSize: 14, fontWeight: 600,
              backgroundColor: selected ? "hsl(var(--primary))" : "hsl(var(--border))",
              color: selected ? "hsl(var(--primary-foreground))" : "hsl(var(--muted-foreground))",
              border: "none", cursor: selected ? "pointer" : "not-allowed",
              transition: "all 0.2s",
            }}
          >
            {selected ? "Use This Template →" : "Select a Template"}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
