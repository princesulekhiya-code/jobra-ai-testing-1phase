"use client";

import type { CSSProperties } from "react";
import { Github, Linkedin } from "lucide-react";
import type { ResumeTemplate } from "@/lib/templates";

export interface ContactInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  photo?: string;
  github?: string;
}

export interface ExpItem {
  title: string;
  company: string;
  period: string;
  bullets: string[];
}

export interface EduItem {
  degree: string;
  school: string;
  year: string;
}

export interface SkillGroup {
  category: string;
  items: string[];
}

export interface LanguageItem {
  name: string;
  level?: string;
}

export interface AwardItem {
  title: string;
  institution?: string;
}

export interface ProjectItem {
  title: string;
  description: string;
  technologies?: string[];
  bullets: string[];
}

export interface CustomSection {
  title: string;
  items: string[];
}

export interface ResumePreviewProps {
  contact: ContactInfo;
  experience: ExpItem[];
  education: EduItem[];
  skills: SkillGroup[];
  tpl: ResumeTemplate;
  linkedin?: string;
  languages?: LanguageItem[];
  awards?: AwardItem[];
  certificates?: string[];
  projects?: ProjectItem[];
  customSections?: CustomSection[];
  nationality?: string;
  dateOfBirth?: string;
  formatting?: {
    fontFamily?: "system" | "serif" | "mono" | "inter" | "playfair" | "helvetica" | "arial" | "montserrat";
    nameSize?: number;
    titleSize?: number;
    bodySize?: number;
    lineHeight?: number;
    sectionHeaderSize?: number;
    subHeaderSize?: number;
    topBottomMargin?: number;
    sideMargin?: number;
    sectionSpacing?: number;
    entrySpacing?: number;
      linkDisplay?: "text" | "icon" | "hidden";
  };
}

const A4_W = 794;
const A4_H = 1123;

const paper: CSSProperties = {
  width: A4_W,
  minHeight: A4_H,
  boxSizing: "border-box",
  padding: "28px 24px",
  overflow: "visible",
};

/** Use readable strip on right column when template accent is a light placeholder */
function sidebarSectionStripColor(accent: string, sidebarBg?: string): { bg: string; fg: string } {
  const a = accent.toLowerCase();
  if (a === "#f0f0f0" || (a.startsWith("#f") && a.length <= 7 && a !== "#ffffff")) {
    const bg = sidebarBg ?? "#1e293b";
    return { bg, fg: "#ffffff" };
  }
  return { bg: accent, fg: "#ffffff" };
}

const serif = { fontFamily: "Georgia, serif" } as const;
const sans = { fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif" } as const;

function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

type LinkDisplay = "text" | "icon" | "hidden";

function renderProfileLink(kind: "linkedin" | "github", raw: string | undefined, display: LinkDisplay) {
  if (!raw) return null;
  const isLinkedin = kind === "linkedin";
  const url = isLinkedin ? normalizeLinkedinUrl(raw) : normalizeGithubUrl(raw);
  const label = isLinkedin ? "LinkedIn" : "GitHub";
  const visibleText = isLinkedin ? displayLinkedinText(raw) : displayGithubText(raw);
  if (display === "hidden") {
    // visible label, no underline, still clickable
    return url ? (
      <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
        {label}
      </a>
    ) : (
      <span>{label}</span>
    );
  }
  if (display === "icon") {
    if (url) {
      return (
        <a href={url} target="_blank" rel="noopener noreferrer" aria-label={isLinkedin ? "LinkedIn" : "GitHub"}>
          {isLinkedin ? <Linkedin style={{ width: 14, height: 14 }} /> : <Github style={{ width: 14, height: 14 }} />}
        </a>
      );
    }
    return isLinkedin ? <Linkedin style={{ width: 14, height: 14 }} /> : <Github style={{ width: 14, height: 14 }} />;
  }
  // text
  if (url) return <a href={url} target="_blank" rel="noopener noreferrer" style={{ color: "#1155cc", textDecoration: "underline" }}>{label}: {visibleText} ↗</a>;
  return <span>{label}: {visibleText}</span>;
}

function dotRating(level?: string): string {
  if (!level) return "● ● ● ○ ○";
  const l = level.toLowerCase();
  if (l.includes("native") || l.includes("fluent")) return "● ● ● ● ●";
  if (l.includes("advanced") || l.includes("professional")) return "● ● ● ● ○";
  if (l.includes("intermediate")) return "● ● ● ○ ○";
  if (l.includes("basic") || l.includes("elementary")) return "● ● ○ ○ ○";
  return "● ● ● ○ ○";
}

function normalizeGithubUrl(raw?: string): string | undefined {
  if (!raw) return undefined;
  const v = raw.trim();
  if (!v) return undefined;
  let u = v;
  if (!/^https?:\/\//i.test(u)) {
    if (u.startsWith("github.com/")) u = "https://" + u;
    else if (u.includes("/")) {
      if (u.includes("github.com")) u = u.startsWith("github.com") ? "https://" + u : u;
    } else {
      u = "https://github.com/" + u.replace(/^@/, "");
    }
  }
  return u;
}

function displayGithubText(raw?: string): string {
  const u = normalizeGithubUrl(raw);
  if (!u) return raw ?? "";
  const m = u.match(/^https?:\/\/(?:www\.)?github\.com\/(.+)$/i);
  if (m) {
    const path = m[1].replace(/\/$/, "");
    const user = path.split("/")[0].replace(/^@/, "");
    return user || `github.com/${path}`;
  }
  return u;
}

function normalizeLinkedinUrl(raw?: string): string | undefined {
  if (!raw) return undefined;
  const v = raw.trim();
  if (!v) return undefined;
  let u = v;
  if (!/^https?:\/\//i.test(u)) {
    if (u.startsWith("linkedin.com/")) u = "https://" + u;
    else if (u.includes("/")) {
      if (u.includes("linkedin.com")) u = u.startsWith("linkedin.com") ? "https://" + u : u;
    } else {
      u = "https://www.linkedin.com/in/" + u.replace(/^@/, "");
    }
  }
  return u;
}

function displayLinkedinText(raw?: string): string {
  const u = normalizeLinkedinUrl(raw);
  if (!u) return raw ?? "";
  const m = u.match(/^https?:\/\/(?:www\.)?linkedin\.com\/(?:in|pub)\/(.+)$/i);
  if (m) {
    const path = m[1].replace(/\/$/, "");
    const user = path.split(/[\/]/)[0].replace(/^@/, "");
    return user || `linkedin.com/${path}`;
  }
  return u;
}

function visibleCustomSections(sections?: CustomSection[]): CustomSection[] {
  return (sections ?? [])
    .map((section) => ({
      title: section.title.trim(),
      items: section.items.map((item) => item.trim()).filter(Boolean),
    }))
    .filter((section) => section.title && section.items.length > 0);
}

function LayoutClassicCenter({
  contact,
  experience,
  education,
  skills,
  languages,
  awards,
  certificates,
  projects,
  customSections,
  linkedin,
  tpl,
  formatting,
}: Omit<ResumePreviewProps, "nationality" | "dateOfBirth">) {
  const fmt = formatting ?? {};
  const subSize = fmt.subHeaderSize ?? 13;
  const nameSize = fmt.nameSize ?? 26;
  const titleSize = fmt.titleSize ?? 16;
  const bodySize = fmt.bodySize ?? 16;
  const lh = fmt.lineHeight ?? 1.45;
  const sectionSpacing = fmt.sectionSpacing ?? 8;
  const entrySpacing = fmt.entrySpacing ?? 10;
  const fontMap: Record<string, CSSProperties> = {
    system: sans,
    inter: { fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial" },
    serif: { fontFamily: "'Times New Roman', Times, serif" },
    playfair: { fontFamily: "'Playfair Display', Georgia, serif" },
    helvetica: { fontFamily: "Helvetica, Arial, sans-serif" },
    arial: { fontFamily: "Arial, Helvetica, sans-serif" },
    montserrat: { fontFamily: "'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif" },
    mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Segoe UI Mono', monospace" },
  };
  const fontStyle = fontMap[fmt.fontFamily ?? "system"] ?? sans;
  const contactBits: React.ReactNode[] = [];
  if (contact.location) contactBits.push(<span key="loc">📍 {contact.location}</span>);
  if (contact.email) contactBits.push(<span key="email">✉ {contact.email}</span>);
  if (contact.phone) contactBits.push(<span key="phone">📞 {contact.phone}</span>);
  const linkDisplay: LinkDisplay = (formatting?.linkDisplay as LinkDisplay) ?? "text";
  if (linkedin) contactBits.push(<span key="linkedin">{renderProfileLink("linkedin", linkedin, linkDisplay)}</span>);
  if (contact.github) contactBits.push(<span key="gh">{renderProfileLink("github", contact.github, linkDisplay)}</span>);

  const tb = fmt.topBottomMargin ?? 18;
  const sm = fmt.sideMargin ?? 14;
  const custom = visibleCustomSections(customSections);
  return (
    <div style={{ ...paper, background: tpl.bg, color: "#000000", ...fontStyle, padding: `${tb}px ${sm}px` }}>
      <div style={{ textAlign: "center", ...fontStyle }}>
        <h1 style={{ margin: 0, fontSize: nameSize, fontWeight: 700, letterSpacing: 0.5 }}>{contact.name}</h1>
        {contact.title ? <p style={{ margin: "6px 0 0", fontSize: titleSize, fontStyle: "italic", fontWeight: 400 }}>{contact.title}</p> : null}
        <p style={{ margin: "10px 0 0", fontSize: bodySize, lineHeight: lh }}>
          {contactBits.map((b, i) => (
            <span key={i}>
              {b}
              {i < contactBits.length - 1 ? " | " : ""}
            </span>
          ))}
        </p>
      </div>
      <div style={{ borderBottom: "1px solid #000", margin: `${sectionSpacing}px 0 ${Math.max(4, sectionSpacing - 1)}px` }} />

      <SectionHeaderClassic text="PROFILE" />
      <p style={{ margin: `0 0 ${entrySpacing}px`, fontSize: bodySize, textAlign: "justify", lineHeight: lh }}>{contact.summary}</p>

      <SectionHeaderClassic text="PROFESSIONAL EXPERIENCE" />
      {experience.map((job, i) => (
        <div key={i} style={{ marginBottom: entrySpacing }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: subSize, fontWeight: 700 }}>{job.title}</span>
            <span style={{ fontSize: bodySize, whiteSpace: "nowrap" }}>{job.period}</span>
          </div>
          <div style={{ fontSize: bodySize, fontStyle: "italic", marginBottom: 5 }}>{job.company}</div>
          <ul style={{ margin: 0, paddingLeft: 26, fontSize: bodySize, lineHeight: lh }}>
            {job.bullets.map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
        </div>
      ))}

      <SectionHeaderClassic text="EDUCATION" size={fmt.sectionHeaderSize} />
      {education.map((ed, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 10 }}>
            <span style={{ fontSize: subSize, fontWeight: 700 }}>{ed.degree}</span>
            <span style={{ fontSize: 16 }}>{ed.year}</span>
          </div>
          <div style={{ fontSize: 16, fontStyle: "italic" }}>{ed.school}</div>
        </div>
      ))}

      <SectionHeaderClassic text="SKILLS" />
      <div style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 10 }}>
        {skills.map((g, gi) => (
          <div key={gi} style={{ marginBottom: 3 }}>
            {g.category && <strong>{g.category}: </strong>}
            {g.items.join(" · ")}
          </div>
        ))}
      </div>

      {languages && languages.length > 0 && (
        <>
          <SectionHeaderClassic text="LANGUAGES" />
          <p style={{ margin: 0, fontSize: 16, lineHeight: 1.5 }}>
            {languages.map((lang, i) => (
              <span key={i}>
                {i > 0 ? " · " : ""}
                <strong>{lang.name}</strong> {dotRating(lang.level)}
              </span>
            ))}
          </p>
        </>
      )}

      {projects && projects.length > 0 && (
        <>
          <SectionHeaderClassic text="PROJECTS" />
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
                <div style={{ fontSize: subSize, fontWeight: 700 }}>{p.title}</div>
              {p.technologies && p.technologies.length > 0 && (
                <div style={{ fontSize: 14, color: "#666", marginBottom: 2 }}>{p.technologies.join(" | ")}</div>
              )}
              {p.bullets.map((b, j) => (
                <p key={j} style={{ fontSize: 16, color: "#333", lineHeight: 1.6, paddingLeft: 8 }}>• {b}</p>
              ))}
              {p.description && p.bullets.length === 0 && (
                <p style={{ fontSize: 16, color: "#333", lineHeight: 1.6 }}>{p.description}</p>
              )}
            </div>
          ))}
        </>
      )}
      {certificates && certificates.length > 0 && (
        <>
          <SectionHeaderClassic text="CERTIFICATIONS" />
          {certificates.map((c, i) => (
            <p key={i} style={{ fontSize: 16, color: "#333", lineHeight: 1.7, paddingLeft: 8 }}>• {c}</p>
          ))}
        </>
      )}

      {awards && awards.length > 0 && (
        <>
          <SectionHeaderClassic text="AWARDS" />
          {awards.map((a, i) => (
              <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ fontSize: subSize, fontWeight: 700 }}>{a.title}</div>
              {a.institution && <div style={{ fontSize: 16, fontStyle: "italic" }}>{a.institution}</div>}
            </div>
          ))}
        </>
      )}
      {custom.map((section, i) => (
        <div key={i} style={{ marginBottom: entrySpacing }}>
          <SectionHeaderClassic text={section.title.toUpperCase()} size={fmt.sectionHeaderSize} />
          <ul style={{ margin: 0, paddingLeft: 26, fontSize: bodySize, lineHeight: lh }}>
            {section.items.map((item, j) => <li key={j}>{item}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}



function SectionHeaderClassic({ text, size }: { text: string; size?: number }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <span
        style={{
          display: "inline-block",
          fontSize: size ?? 13,
          fontWeight: 700,
          letterSpacing: 0.5,
          borderBottom: "2px solid #000",
          paddingBottom: 2,
        }}
      >
        {text}
      </span>
    </div>
  );
}

function LayoutSidebarDark({
  contact,
  experience,
  education,
  skills,
  languages,
  awards,
  certificates,
  projects,
  customSections,
  linkedin,
  tpl,
  formatting,
}: Omit<ResumePreviewProps, "nationality" | "dateOfBirth">) {
  const side = tpl.sidebarBg ?? "#1e293b";
  const fmt = formatting ?? {};
  const subSize = fmt.subHeaderSize ?? 13;
  const nameSize = fmt.nameSize ?? 21;
  const titleSize = fmt.titleSize ?? 13;
  const bodySize = fmt.bodySize ?? 14;
  const lh = fmt.lineHeight ?? 1.45;
  const sectionSpacing = fmt.sectionSpacing ?? 8;
  const entrySpacing = fmt.entrySpacing ?? 10;
  const fontMap: Record<string, CSSProperties> = {
    system: sans,
    serif,
    mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Segoe UI Mono', monospace" },
    inter: { fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial" },
    playfair: { fontFamily: "'Playfair Display', Georgia, serif" },
  };
  const fontStyle = fontMap[fmt.fontFamily ?? "system"] ?? sans;
  const linkDisplay: LinkDisplay = fmt.linkDisplay ?? "text";
  const strip = sidebarSectionStripColor(tpl.accent, tpl.sidebarBg);
  const custom = visibleCustomSections(customSections);

  return (
    <div style={{ ...paper, padding: 0, display: "flex", background: tpl.bg, ...sans }}>
      <div
        style={{
          width: "35%",
          minWidth: 0,
          background: side,
          color: "#ffffff",
          padding: "18px 14px",
          boxSizing: "border-box",
        }}
      >
        <div
          style={{
            width: 74,
            height: 74,
            borderRadius: "50%",
            border: "3px solid #fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: nameSize,
            fontWeight: 700,
            margin: "0 auto 12px",
            overflow: "hidden",
            ...fontStyle,
          }}
        >
          {contact.photo ? (
            // Show uploaded photo if provided
            // eslint-disable-next-line @next/next/no-img-element
            <img src={contact.photo} alt={contact.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            initials(contact.name)
          )}
        </div>
        <h1 style={{ margin: 0, fontSize: nameSize, fontWeight: 700, textAlign: "center", ...fontStyle }}>{contact.name}</h1>
        {contact.title ? <p style={{ margin: "6px 0 0", fontSize: titleSize, textAlign: "center", opacity: 0.95 }}>{contact.title}</p> : null}

        <div style={{ marginTop: 14, fontSize: bodySize, lineHeight: lh, ...fontStyle }}>
          <div>✉ {contact.email}</div>
          <div>📞 {contact.phone}</div>
          <div>📍 {contact.location}</div>
          {linkedin ? <div>{renderProfileLink("linkedin", linkedin, linkDisplay)}</div> : null}
          {contact.github ? <div>{renderProfileLink("github", contact.github, linkDisplay)}</div> : null}
        </div>

        <p style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1, margin: `${sectionSpacing}px 0 ${Math.max(4, sectionSpacing - 2)}px` }}>PROFILE</p>
        <p style={{ margin: 0, fontSize: 14, lineHeight: 1.45, opacity: 0.95 }}>{contact.summary}</p>

        {languages && languages.length > 0 && (
          <>
            <p style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1, margin: `${sectionSpacing}px 0 ${Math.max(4, sectionSpacing - 2)}px` }}>LANGUAGES</p>
            {languages.map((lang, i) => (
              <div key={i} style={{ fontSize: 14, marginBottom: Math.max(2, Math.floor(entrySpacing / 2)) }}>
                {lang.name} <span style={{ opacity: 0.85 }}>{dotRating(lang.level)}</span>
              </div>
            ))}
          </>
        )}

        {awards && awards.length > 0 && (
          <>
            <p style={{ fontSize: 16, fontWeight: 700, letterSpacing: 1, margin: `${sectionSpacing}px 0 ${Math.max(4, sectionSpacing - 2)}px` }}>AWARDS</p>
            {awards.map((a, i) => (
              <div key={i} style={{ marginBottom: entrySpacing, fontSize: 14 }}>
                <div style={{ fontWeight: 700 }}>{a.title}</div>
                {a.institution && <div style={{ fontStyle: "italic", opacity: 0.9 }}>{a.institution}</div>}
              </div>
            ))}
          </>
        )}
      </div>

      <div style={{ width: "65%", padding: "14px 12px", boxSizing: "border-box", color: tpl.textColor }}>
        <RightSectionHeader label="WORK EXPERIENCE" stripBg={strip.bg} stripFg={strip.fg} />
        {experience.map((job, i) => (
          <div key={i} style={{ marginBottom: entrySpacing }}>
            <div style={{ fontSize: subSize, fontWeight: 700 }}>{job.company}</div>
            <div style={{ fontSize: bodySize, color: tpl.mutedColor }}>
              {job.title} · {job.period}
            </div>
            <div style={{ fontSize: bodySize, color: tpl.mutedColor, marginBottom: 3 }}>{contact.location}</div>
            <ul style={{ margin: 0, paddingLeft: 22, fontSize: bodySize, lineHeight: Math.max(1.3, lh - 0.05) }}>
              {job.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </div>
        ))}

        <RightSectionHeader label="EDUCATION" stripBg={strip.bg} stripFg={strip.fg} />
        {education.map((ed, i) => (
          <div key={i} style={{ marginBottom: Math.max(4, entrySpacing - 2), fontSize: 16 }}>
            <strong>{ed.degree}</strong> — {ed.school} ({ed.year})
          </div>
        ))}

        <RightSectionHeader label="SKILLS" stripBg={strip.bg} stripFg={strip.fg} />
        <div style={{ fontSize: 16, lineHeight: 1.6 }}>
          {skills.map((g, gi) => (
            <div key={gi} style={{ marginBottom: 3 }}>
              {g.category && <strong>{g.category}: </strong>}
              {g.items.join(" · ")}
            </div>
          ))}
        </div>

        {projects && projects.length > 0 && (
          <>
            <RightSectionHeader label="PROJECTS" stripBg={strip.bg} stripFg={strip.fg} />
            {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: entrySpacing }}>
                <div style={{ fontSize: subSize, fontWeight: 700 }}>{p.title}</div>
                {p.technologies && p.technologies.length > 0 && (
                  <div style={{ fontSize: 14, color: tpl.mutedColor, marginBottom: 2 }}>{p.technologies.join(" | ")}</div>
                )}
                <ul style={{ margin: "2px 0 0", paddingLeft: 22, fontSize: 16, lineHeight: 1.3 }}>
                  {p.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            ))}
          </>
        )}

        {certificates && certificates.length > 0 && (
          <>
            <RightSectionHeader label="CERTIFICATIONS" stripBg={strip.bg} stripFg={strip.fg} />
            <ul style={{ margin: 0, paddingLeft: 22, fontSize: 16, lineHeight: 1.3 }}>
              {certificates.map((c, i) => <li key={i}>{c}</li>)}
            </ul>
          </>
        )}
        {custom.map((section, i) => (
          <div key={i}>
            <RightSectionHeader label={section.title.toUpperCase()} stripBg={strip.bg} stripFg={strip.fg} size={fmt.sectionHeaderSize} />
            <ul style={{ margin: 0, paddingLeft: 22, fontSize: bodySize, lineHeight: Math.max(1.3, lh - 0.05) }}>
              {section.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

function RightSectionHeader({ label, stripBg, stripFg, size }: { label: string; stripBg: string; stripFg: string; size?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        margin: "14px 0 8px",
        fontSize: size ?? 16,
        fontWeight: 700,
        letterSpacing: 0.5,
      }}
    >
      <span style={{ fontSize: Math.max(12, (size ?? 16) - 3) }}>▸</span>
      <span
        style={{
          background: stripBg,
          color: stripFg,
          padding: "3px 8px",
          flex: 1,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function LayoutHarvard({
  contact,
  experience,
  education,
  skills,
  languages,
  awards,
  certificates,
  projects,
  customSections,
  linkedin,
  tpl,
  formatting,
}: Omit<ResumePreviewProps, "nationality" | "dateOfBirth">) {
  const fmt = formatting ?? {};
  const subSize = fmt.subHeaderSize ?? 13;
  const nameSize = fmt.nameSize ?? 32;
  const titleSize = fmt.titleSize ?? 18;
  const bodySize = fmt.bodySize ?? 16;
  const lh = fmt.lineHeight ?? 1.45;
  const sectionSpacing = fmt.sectionSpacing ?? 8;
  const entrySpacing = fmt.entrySpacing ?? 10;
  const custom = visibleCustomSections(customSections);
  const fontMap: Record<string, CSSProperties> = {
    system: sans,
    serif: { fontFamily: "'Times New Roman', Times, serif" },
    mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Segoe UI Mono', monospace" },
    inter: { fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial" },
    playfair: { fontFamily: "'Playfair Display', Georgia, serif" },
    helvetica: { fontFamily: "Helvetica, Arial, sans-serif" },
    arial: { fontFamily: "Arial, Helvetica, sans-serif" },
    montserrat: { fontFamily: "'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif" },
  };
  const fontStyle = fontMap[fmt.fontFamily ?? "system"] ?? serif;
  const linkDisplay: LinkDisplay = fmt.linkDisplay ?? "text";
  const headerContactBits: React.ReactNode[] = [];
  if (contact.email) headerContactBits.push(<span key="e">✉ {contact.email}</span>);
  if (contact.phone) headerContactBits.push(<span key="p">📞 {contact.phone}</span>);
  if (linkedin) headerContactBits.push(<span key="li">{renderProfileLink("linkedin", linkedin, linkDisplay)}</span>);
  if (contact.github) headerContactBits.push(<span key="gh">{renderProfileLink("github", contact.github, linkDisplay)}</span>);
  if (false) {
    const url = "";
    const text = "";
    headerContactBits.push(url ? <a key="li" href={url} target="_blank" rel="noopener noreferrer">🔗 {text}</a> : <span key="li">🔗 {text}</span>);
  }

  return (
    <div style={{ ...paper, background: tpl.bg, color: "#000000", ...fontStyle }}>
      <div style={{ borderTop: "1px solid #000", borderBottom: "1px solid #000", textAlign: "center", padding: `${sectionSpacing}px 0 ${Math.max(4, sectionSpacing - 2)}px`, marginBottom: entrySpacing, ...fontStyle }}>
        <h1 style={{ margin: 0, fontSize: nameSize, fontWeight: 700 }}>{contact.name}</h1>
        {contact.title ? <p style={{ margin: "6px 0 0", fontSize: titleSize, fontStyle: "italic" }}>{contact.title}</p> : null}
        <p style={{ margin: "8px 0 0", fontSize: bodySize }}>
          {headerContactBits.map((b, i) => (
            <span key={i}>
              {b}
              {i < headerContactBits.length - 1 ? "  •  " : ""}
            </span>
          ))}
        </p>
      </div>

      <HarvardSection title="PROFILE" size={fmt.sectionHeaderSize} />
      <p style={{ margin: `0 0 ${entrySpacing}px`, fontSize: bodySize, textAlign: "justify", lineHeight: lh }}>{contact.summary}</p>

      <HarvardSection title="PROFESSIONAL EXPERIENCE" size={fmt.sectionHeaderSize} />
      {experience.map((job, i) => (
        <div key={i} style={{ marginBottom: entrySpacing }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <span style={{ fontSize: subSize, fontWeight: 700 }}>{job.title}</span>
            <span style={{ fontSize: 16 }}>{job.period}</span>
          </div>
          <div style={{ fontSize: 16, fontStyle: "italic", marginBottom: 5 }}>{job.company}</div>
          <ul style={{ margin: 0, paddingLeft: 26, fontSize: 16, lineHeight: 1.4 }}>
            {job.bullets.map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
        </div>
      ))}

      <HarvardSection title="EDUCATION" size={fmt.sectionHeaderSize} />
      {education.map((ed, i) => (
        <div key={i} style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
            <span style={{ fontSize: subSize, fontWeight: 700 }}>{ed.degree}</span>
            <span style={{ fontSize: 16 }}>{ed.year}</span>
          </div>
          <div style={{ fontSize: 16, fontStyle: "italic" }}>{ed.school}</div>
        </div>
      ))}

      <HarvardSection title="SKILLS" size={fmt.sectionHeaderSize} />
      <div style={{ fontSize: 16, lineHeight: 1.6, marginBottom: entrySpacing }}>
        {skills.map((g, gi) => (
          <div key={gi} style={{ marginBottom: 3 }}>
            {g.category && <strong>{g.category}: </strong>}
            {g.items.join(" · ")}
          </div>
        ))}
      </div>

      {projects && projects.length > 0 && (
        <>
          <HarvardSection title="PROJECTS" size={fmt.sectionHeaderSize} />
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: 13 }}>
              <div style={{ fontSize: subSize, fontWeight: 700 }}>{p.title}</div>
              {p.technologies && p.technologies.length > 0 && (
                <div style={{ fontSize: 14, fontStyle: "italic", color: "#555", marginBottom: 2 }}>{p.technologies.join(" | ")}</div>
              )}
              <ul style={{ margin: "2px 0 0", paddingLeft: 26, fontSize: 16, lineHeight: 1.4 }}>
                {p.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {certificates && certificates.length > 0 && (
        <>
          <HarvardSection title="CERTIFICATIONS" size={fmt.sectionHeaderSize} />
          <ul style={{ margin: `0 0 ${entrySpacing}px`, paddingLeft: 26, fontSize: 16, lineHeight: 1.35 }}>
            {certificates.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </>
      )}

      {languages && languages.length > 0 && (
        <>
          <HarvardSection title="LANGUAGES" size={fmt.sectionHeaderSize} />
          <p style={{ margin: `0 0 ${entrySpacing}px`, fontSize: 16 }}>
            {languages.map((lang, i) => (
              <span key={i}>
                {i > 0 ? " · " : ""}
                <strong>{lang.name}</strong> {dotRating(lang.level)}
              </span>
            ))}
          </p>
        </>
      )}

      {awards && awards.length > 0 && (
        <>
          <HarvardSection title="AWARDS" size={fmt.sectionHeaderSize} />
          {awards.map((a, i) => (
            <div key={i} style={{ marginBottom: entrySpacing }}>
              <div style={{ fontSize: subSize, fontWeight: 700 }}>{a.title}</div>
              {a.institution && <div style={{ fontSize: 16, fontStyle: "italic" }}>{a.institution}</div>}
            </div>
          ))}
        </>
      )}
      {custom.map((section, i) => (
        <div key={i}>
          <HarvardSection title={section.title.toUpperCase()} size={fmt.sectionHeaderSize} />
          <ul style={{ margin: 0, paddingLeft: 26, fontSize: bodySize, lineHeight: lh }}>
            {section.items.map((item, j) => <li key={j}>{item}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

function HarvardSection({ title, size }: { title: string; size?: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 10,
        margin: "16px 0 10px",
        fontSize: size ?? 13,
        fontWeight: 700,
        letterSpacing: 0.5,
        textTransform: "uppercase",
      }}
    >
      <span style={{ flex: 1, borderBottom: "1px solid #000", opacity: 0.85 }} />
      <span style={{ whiteSpace: "nowrap" }}>{title}</span>
      <span style={{ flex: 1, borderBottom: "1px solid #000", opacity: 0.85 }} />
    </div>
  );
}

function LayoutModernTeal({
  contact,
  experience,
  education,
  skills,
  languages,
  certificates,
  projects,
  awards,
  customSections,
  linkedin,
  nationality,
  dateOfBirth,
  tpl,
  formatting,
}: Omit<ResumePreviewProps, never>) {
  const a = tpl.accent;
  const fmt = formatting ?? {};
  const linkDisplay: LinkDisplay = fmt.linkDisplay ?? "text";

  const contactGrid = [
    { icon: "✉", text: contact.email },
    { icon: "📞", text: contact.phone },
    { node: renderProfileLink("linkedin", linkedin, linkDisplay) },
    { node: renderProfileLink("github", contact.github, linkDisplay) },
    { icon: "📍", text: contact.location },
    { icon: "🌐", text: nationality ?? "—" },
    { icon: "🎂", text: dateOfBirth ?? "—" },
  ];
  const subSize = fmt.subHeaderSize ?? 13;
  const custom = visibleCustomSections(customSections);
  const fontMap: Record<string, CSSProperties> = {
    system: sans,
    inter: { fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial" },
    serif: { fontFamily: "'Times New Roman', Times, serif" },
    playfair: { fontFamily: "'Playfair Display', Georgia, serif" },
    helvetica: { fontFamily: "Helvetica, Arial, sans-serif" },
    arial: { fontFamily: "Arial, Helvetica, sans-serif" },
    montserrat: { fontFamily: "'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif" },
    mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Segoe UI Mono', monospace" },
  };
  const fontStyle = fontMap[fmt.fontFamily ?? "system"] ?? sans;

  return (
    <div style={{ ...paper, background: tpl.bg, color: tpl.textColor, position: "relative", ...fontStyle }}>
      <div style={{ position: "absolute", top: 20, right: 22, width: 70, height: 70, borderRadius: "50%", background: tpl.mutedColor + "33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, fontWeight: 700, color: tpl.textColor, overflow: "hidden" }}>
        {contact.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={contact.photo} alt={contact.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          initials(contact.name)
        )}
      </div>

      <div style={{ paddingRight: 64 }}>
        <h1 style={{ margin: 0, fontSize: 29, fontWeight: 700, display: "inline" }}>{contact.name}</h1>
        <span style={{ marginLeft: 8, fontSize: 16, fontWeight: 400, color: tpl.mutedColor }}>{contact.title}</span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "5px 16px",
          marginTop: 10,
          fontSize: 14,
          color: tpl.mutedColor,
        }}
      >
        {contactGrid.filter((c) => c.node || c.text).map((c, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {c.node ? (
              c.node
            ) : false ? (
              <a href={(c as { href?: string }).href ?? ""} target="_blank" rel="noopener noreferrer" aria-label="contact-link" style={{ color: "#1155cc", textDecoration: "underline" }}>{c.text} ↗</a>
            ) : (
              <>
                <span>{c.icon}</span>
                <span>{c.text}</span>
              </>
            )}
          </div>
        ))}
      </div>

      <AccentBar title="SUMMARY" accent={a} size={fmt.sectionHeaderSize} />
      <p style={{ margin: "0 0 12px", fontSize: 16, lineHeight: 1.45 }}>{contact.summary}</p>

      <AccentBar title="PROFESSIONAL EXPERIENCE" accent={a} size={fmt.sectionHeaderSize} />
      {experience.map((job, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "28% 1fr", gap: 13, marginBottom: 21, fontSize: 16 }}>
          <div style={{ color: tpl.mutedColor, lineHeight: 1.35 }}>
            <div>{job.period}</div>
            <div>{contact.location}</div>
          </div>
          <div>
              <div style={{ fontWeight: 700 }}>{job.company}</div>
            <div style={{ marginBottom: 5, fontSize: subSize }}>{job.title}</div>
            <ul style={{ margin: 0, paddingLeft: 24, lineHeight: 1.35 }}>
              {job.bullets.map((b, j) => (
                <li key={j}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      <AccentBar title="EDUCATION" accent={a} size={fmt.sectionHeaderSize} />
      {education.map((ed, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "28% 1fr", gap: 13, marginBottom: 13, fontSize: 16 }}>
          <div style={{ color: tpl.mutedColor }}>{ed.year}</div>
          <div>
            <div style={{ fontWeight: 700 }}>{ed.degree}</div>
            <div>{ed.school}</div>
          </div>
        </div>
      ))}

      <AccentBar title="SKILLS" accent={a} size={fmt.sectionHeaderSize} />
      <div style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 13 }}>
        {skills.map((g, gi) => (
          <div key={gi} style={{ marginBottom: 3 }}>
            {g.category && <strong>{g.category}: </strong>}
            {g.items.join(" · ")}
          </div>
        ))}
      </div>

      {languages && languages.length > 0 && (
        <>
          <AccentBar title="LANGUAGES" accent={a} size={fmt.sectionHeaderSize} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, fontSize: 16, marginBottom: 13 }}>
            {languages.map((lang, i) => (
              <span key={i}>
                {lang.name}
                {lang.level ? ` (${lang.level})` : ""}
              </span>
            ))}
          </div>
        </>
      )}

      {projects && projects.length > 0 && (
        <>
          <AccentBar title="PROJECTS" accent={a} size={fmt.sectionHeaderSize} />
          {projects.map((p, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "28% 1fr", gap: 13, marginBottom: 13, fontSize: 16 }}>
              <div style={{ color: tpl.mutedColor }}>
                {p.technologies && p.technologies.length > 0 ? p.technologies.slice(0, 3).join(", ") : ""}
              </div>
              <div>
                <div style={{ fontWeight: 700 }}>{p.title}</div>
                <ul style={{ margin: "2px 0 0", paddingLeft: 24, lineHeight: 1.35 }}>
                  {p.bullets.map((b, j) => <li key={j}>{b}</li>)}
                </ul>
              </div>
            </div>
          ))}
        </>
      )}

      {certificates && certificates.length > 0 && (
        <>
          <AccentBar title="CERTIFICATIONS" accent={a} size={fmt.sectionHeaderSize} />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, fontSize: 16 }}>
            {certificates.map((c, i) => (
              <span key={i}>{c}</span>
            ))}
          </div>
        </>
      )}

      {awards && awards.length > 0 && (
        <>
          <AccentBar title="AWARDS" accent={a} size={fmt.sectionHeaderSize} />
          {awards.map((a2, i) => (
            <div key={i} style={{ marginBottom: 5, fontSize: 16 }}>
              <span style={{ fontWeight: 700 }}>{a2.title}</span>
              {a2.institution && <span style={{ color: tpl.mutedColor, fontStyle: "italic" }}> — {a2.institution}</span>}
            </div>
          ))}
        </>
      )}
      {custom.map((section, i) => (
        <div key={i}>
          <AccentBar title={section.title.toUpperCase()} accent={a} size={fmt.sectionHeaderSize} />
          <ul style={{ margin: 0, paddingLeft: 24, fontSize: 16, lineHeight: 1.35 }}>
            {section.items.map((item, j) => <li key={j}>{item}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

function AccentBar({ title, accent, size }: { title: string; accent: string; size?: number }) {
  return (
    <div
      style={{
        background: accent,
        color: "#fff",
        textAlign: "center",
        fontSize: size ?? 13,
        fontWeight: 700,
        letterSpacing: 0.5,
        padding: "5px 0",
        margin: "12px 0 8px",
      }}
    >
      {title}
    </div>
  );
}

function LayoutCorporateClean({
  contact,
  experience,
  education,
  skills,
  languages,
  certificates,
  projects,
  awards,
  customSections,
  linkedin,
  tpl,
  dense,
  formatting,
}: Omit<ResumePreviewProps, "nationality" | "dateOfBirth"> & { dense?: boolean }) {
  const a = tpl.accent;
  const fs = dense ? { name: 26, body: 14, head: 16, sub: 14 } : { name: 29, body: 16, head: 13, sub: 16 };
  const gap = dense ? 13 : 21;

  const fmt = formatting ?? {};
  const linkDisplay: LinkDisplay = fmt.linkDisplay ?? "text";
  const contactLineParts: React.ReactNode[] = [];
  if (contact.email) contactLineParts.push(<span key="e">{contact.email}</span>);
  if (contact.phone) contactLineParts.push(<span key="p">{contact.phone}</span>);
  if (contact.location) contactLineParts.push(<span key="l">{contact.location}</span>);
  if (linkedin) contactLineParts.push(renderProfileLink("linkedin", linkedin, linkDisplay));
  if (contact.github) contactLineParts.push(renderProfileLink("github", contact.github, linkDisplay));
  const fontMap: Record<string, CSSProperties> = {
    system: sans,
    inter: { fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial" },
    serif: { fontFamily: "'Times New Roman', Times, serif" },
    playfair: { fontFamily: "'Playfair Display', Georgia, serif" },
    helvetica: { fontFamily: "Helvetica, Arial, sans-serif" },
    arial: { fontFamily: "Arial, Helvetica, sans-serif" },
    montserrat: { fontFamily: "'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif" },
    mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Segoe UI Mono', monospace" },
  };
  const fontStyle = fontMap[fmt.fontFamily ?? "system"] ?? sans;
  const custom = visibleCustomSections(customSections);

  return (
    <div style={{ ...paper, background: tpl.bg, color: tpl.textColor, ...fontStyle }}>
      <h1 style={{ margin: 0, fontSize: fs.name, fontWeight: 700 }}>{contact.name}</h1>
      <p style={{ margin: "4px 0 0", fontSize: fs.sub, fontWeight: 600, color: a }}>{contact.title}</p>
      <p style={{ margin: "8px 0 0", fontSize: dense ? 12 : 14, color: a }}>
        {contactLineParts.map((part, i) => (
          <span key={i}>
            {part}
            {i < contactLineParts.length - 1 ? " | " : ""}
          </span>
        ))}
      </p>

      <CorpSection title="SUMMARY" accent={a} dense={dense} size={fmt.sectionHeaderSize} />
      <p style={{ margin: `0 0 ${gap}px`, fontSize: fs.body, lineHeight: 1.45, textAlign: "justify" }}>{contact.summary}</p>

      <CorpSection title="PROFESSIONAL EXPERIENCE" accent={a} dense={dense} size={fmt.sectionHeaderSize} />
      {experience.map((job, i) => (
        <div key={i} style={{ marginBottom: dense ? 13 : 21 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 10, flexWrap: "wrap" }}>
            <span style={{ fontSize: fs.sub, fontWeight: 700 }}>
              {job.title}
              <span style={{ fontWeight: 400, fontStyle: "italic" }}>, {job.company}</span>
            </span>
            <span style={{ fontSize: dense ? 12 : 14, textAlign: "right", whiteSpace: "nowrap" }}>
              {job.period}
              <br />
              <span style={{ color: tpl.mutedColor }}>{contact.location}</span>
            </span>
          </div>
          <ul style={{ margin: "4px 0 0", paddingLeft: 26, fontSize: fs.body, lineHeight: 1.35 }}>
            {job.bullets.map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
        </div>
      ))}

      <CorpSection title="EDUCATION" accent={a} dense={dense} size={fmt.sectionHeaderSize} />
      {education.map((ed, i) => (
        <div key={i} style={{ marginBottom: dense ? 10 : 13, display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <span style={{ fontSize: fs.sub, fontWeight: 700 }}>
            {ed.degree}
            <span style={{ fontWeight: 400, fontStyle: "italic" }}> — {ed.school}</span>
          </span>
          <span style={{ fontSize: dense ? 12 : 14, textAlign: "right", color: tpl.mutedColor }}>
            {ed.year}
            <br />
            {contact.location}
          </span>
        </div>
      ))}

      <CorpSection title="SKILLS" accent={a} dense={dense} size={fmt.sectionHeaderSize} />
      <div style={{ fontSize: fs.body, lineHeight: 1.6, marginBottom: gap }}>
        {skills.map((g, gi) => (
          <div key={gi} style={{ marginBottom: 2 }}>
            {g.category && <strong>{g.category}: </strong>}
            {g.items.join(" · ")}
          </div>
        ))}
      </div>

      {languages && languages.length > 0 && (
        <>
          <CorpSection title="LANGUAGES" accent={a} dense={dense} size={fmt.sectionHeaderSize} />
          <p style={{ margin: `0 0 ${gap}px`, fontSize: fs.body, lineHeight: 1.45 }}>
            {languages.map((lang, i) => (
              <span key={i}>
                {i > 0 ? " · " : ""}
                {lang.name}
                {lang.level ? ` (${lang.level})` : ""}
              </span>
            ))}
          </p>
        </>
      )}

      {projects && projects.length > 0 && (
        <>
          <CorpSection title="PROJECTS" accent={a} dense={dense} size={fmt.sectionHeaderSize} />
          {projects.map((p, i) => (
            <div key={i} style={{ marginBottom: dense ? 8 : 13 }}>
              <div style={{ fontSize: fs.sub, fontWeight: 700 }}>{p.title}</div>
              {p.technologies && p.technologies.length > 0 && (
                <div style={{ fontSize: dense ? 12 : 14, color: a, marginBottom: 2 }}>{p.technologies.join(" | ")}</div>
              )}
              <ul style={{ margin: "4px 0 0", paddingLeft: 26, fontSize: fs.body, lineHeight: 1.35 }}>
                {p.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
              {p.description && p.bullets.length === 0 && (
                <p style={{ fontSize: fs.body, lineHeight: 1.45 }}>{p.description}</p>
              )}
            </div>
          ))}
        </>
      )}

      {certificates && certificates.length > 0 && (
        <>
          <CorpSection title="CERTIFICATIONS" accent={a} dense={dense} size={fmt.sectionHeaderSize} />
          <div style={{ display: "grid", gridTemplateColumns: dense ? "repeat(3, 1fr)" : "repeat(2, 1fr)", gap: "2px 10px", fontSize: fs.body }}>
            {certificates.map((c, i) => (
              <div key={i} style={{ display: "flex", gap: 5 }}>
                <span>•</span>
                <span>{c}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {awards && awards.length > 0 && (
        <>
          <CorpSection title="AWARDS" accent={a} dense={dense} size={fmt.sectionHeaderSize} />
          {awards.map((a2, i) => (
            <div key={i} style={{ marginBottom: 5, fontSize: fs.body }}>
              <span style={{ fontWeight: 700 }}>{a2.title}</span>
              {a2.institution && <span style={{ fontStyle: "italic", color: tpl.mutedColor }}> — {a2.institution}</span>}
            </div>
          ))}
        </>
      )}
      {custom.map((section, i) => (
        <div key={i}>
          <CorpSection title={section.title.toUpperCase()} accent={a} dense={dense} size={fmt.sectionHeaderSize} />
          <ul style={{ margin: 0, paddingLeft: 26, fontSize: fs.body, lineHeight: 1.35 }}>
            {section.items.map((item, j) => <li key={j}>{item}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

function CorpSection({ title, accent, dense, size }: { title: string; accent: string; dense?: boolean; size?: number }) {
  return (
    <div
      style={{
        fontSize: size ?? (dense ? 16 : 13),
        fontWeight: 700,
        color: accent,
        borderBottom: `1px solid ${accent}`,
        paddingBottom: 3,
        margin: dense ? "10px 0 6px" : "14px 0 8px",
      }}
    >
      {title}
    </div>
  );
}

function LayoutSingleMinimal({
  contact,
  experience,
  education,
  skills,
  projects,
  certificates,
  awards,
  languages,
  customSections,
  linkedin,
  tpl,
  formatting,
}: Omit<ResumePreviewProps, "nationality" | "dateOfBirth">) {
  const fmt = formatting ?? {};
  const linkDisplay: LinkDisplay = fmt.linkDisplay ?? "text";
  const contactLineParts: React.ReactNode[] = [];
  if (contact.email) contactLineParts.push(<span key="e">{contact.email}</span>);
  if (contact.phone) contactLineParts.push(<span key="p">{contact.phone}</span>);
  if (contact.location) contactLineParts.push(<span key="l">{contact.location}</span>);
  if (linkedin) contactLineParts.push(renderProfileLink("linkedin", linkedin, linkDisplay));
  if (contact.github) contactLineParts.push(renderProfileLink("github", contact.github, linkDisplay));
  const subSize = fmt.subHeaderSize ?? 13;
  const fontMap: Record<string, CSSProperties> = {
    system: sans,
    inter: { fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial" },
    serif: { fontFamily: "'Times New Roman', Times, serif" },
    playfair: { fontFamily: "'Playfair Display', Georgia, serif" },
    helvetica: { fontFamily: "Helvetica, Arial, sans-serif" },
    arial: { fontFamily: "Arial, Helvetica, sans-serif" },
    montserrat: { fontFamily: "'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif" },
    mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Segoe UI Mono', monospace" },
  };
  const fontStyle = fontMap[fmt.fontFamily ?? "system"] ?? serif;
  const custom = visibleCustomSections(customSections);

  return (
    <div style={{ ...paper, background: tpl.bg, color: tpl.textColor, ...fontStyle }}>
      <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>{contact.name}</h1>
      <p style={{ margin: "6px 0 0", fontSize: 18, color: tpl.mutedColor }}>{contact.title}</p>
      <p style={{ margin: "10px 0 0", fontSize: 16, color: tpl.mutedColor }}>
        {contactLineParts.map((part, i) => (
          <span key={i}>
            {part}
            {i < contactLineParts.length - 1 ? " · " : ""}
          </span>
        ))}
      </p>

      <MinimalSection title="Profile" tpl={tpl} size={fmt.sectionHeaderSize} />
      <p style={{ margin: "0 0 20px", fontSize: 16, lineHeight: 1.55, textAlign: "justify" }}>{contact.summary}</p>

      <MinimalSection title="Experience" tpl={tpl} size={fmt.sectionHeaderSize} />
      {experience.map((job, i) => (
        <div key={i} style={{ marginBottom: 21 }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: subSize, fontWeight: 700 }}>
            <span>{job.title}</span>
            <span style={{ fontWeight: 400, color: tpl.mutedColor }}>{job.period}</span>
          </div>
          <div style={{ fontSize: 16, fontStyle: "italic", color: tpl.mutedColor, marginBottom: 8 }}>{job.company}</div>
          <ul style={{ margin: 0, paddingLeft: 32, fontSize: 16, lineHeight: 1.45 }}>
            {job.bullets.map((b, j) => (
              <li key={j}>{b}</li>
            ))}
          </ul>
        </div>
      ))}

      <MinimalSection title="Education" tpl={tpl} size={fmt.sectionHeaderSize} />
      {education.map((ed, i) => (
        <div key={i} style={{ marginBottom: 13, fontSize: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <span style={{ fontWeight: 700 }}>{ed.degree}</span>
            <span style={{ color: tpl.mutedColor }}>{ed.year}</span>
          </div>
          <div style={{ fontStyle: "italic", color: tpl.mutedColor }}>{ed.school}</div>
        </div>
      ))}

      <MinimalSection title="Skills" tpl={tpl} size={fmt.sectionHeaderSize} />
      <div style={{ fontSize: 16, lineHeight: 1.6, marginBottom: 10 }}>
        {skills.map((g, gi) => (
          <div key={gi} style={{ marginBottom: 3 }}>
            {g.category && <strong>{g.category}: </strong>}
            {g.items.join(" · ")}
          </div>
        ))}
      </div>

      {projects && projects.length > 0 && (
        <>
          <MinimalSection title="Projects" tpl={tpl} size={fmt.sectionHeaderSize} />
          {projects.map((p, i) => (
              <div key={i} style={{ marginBottom: 18 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontSize: subSize, fontWeight: 700 }}>
                <span>{p.title}</span>
              </div>
              {p.technologies && p.technologies.length > 0 && (
                <div style={{ fontSize: 14, fontStyle: "italic", color: tpl.mutedColor, marginBottom: 5 }}>{p.technologies.join(" | ")}</div>
              )}
              <ul style={{ margin: 0, paddingLeft: 32, fontSize: 16, lineHeight: 1.45 }}>
                {p.bullets.map((b, j) => <li key={j}>{b}</li>)}
              </ul>
            </div>
          ))}
        </>
      )}

      {certificates && certificates.length > 0 && (
        <>
          <MinimalSection title="Certifications" tpl={tpl} size={fmt.sectionHeaderSize} />
          <ul style={{ margin: 0, paddingLeft: 32, fontSize: 16, lineHeight: 1.45 }}>
            {certificates.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </>
      )}

      {awards && awards.length > 0 && (
        <>
          <MinimalSection title="Awards" tpl={tpl} size={fmt.sectionHeaderSize} />
          {awards.map((a, i) => (
            <div key={i} style={{ marginBottom: 8, fontSize: 16 }}>
              <span style={{ fontWeight: 700 }}>{a.title}</span>
              {a.institution && <span style={{ fontStyle: "italic", color: tpl.mutedColor }}> — {a.institution}</span>}
            </div>
          ))}
        </>
      )}

      {languages && languages.length > 0 && (
        <>
          <MinimalSection title="Languages" tpl={tpl} size={fmt.sectionHeaderSize} />
          <p style={{ margin: 0, fontSize: 16 }}>
            {languages.map((l, i) => (
              <span key={i}>{i > 0 ? " · " : ""}<strong>{l.name}</strong>{l.level ? ` (${l.level})` : ""}</span>
            ))}
          </p>
        </>
      )}
      {custom.map((section, i) => (
        <div key={i}>
          <MinimalSection title={section.title} tpl={tpl} size={fmt.sectionHeaderSize} />
          <ul style={{ margin: 0, paddingLeft: 32, fontSize: 16, lineHeight: 1.45 }}>
            {section.items.map((item, j) => <li key={j}>{item}</li>)}
          </ul>
        </div>
      ))}
    </div>
  );
}

function MinimalSection({ title, tpl, size }: { title: string; tpl: ResumeTemplate; size?: number }) {
  return (
    <div
      style={{
        fontSize: size ?? 13,
        fontWeight: 700,
        letterSpacing: 1,
        textTransform: "uppercase",
        borderBottom: `1px solid ${tpl.mutedColor}99`,
        paddingBottom: 4,
        margin: "22px 0 10px",
        color: tpl.textColor,
      }}
    >
      {title}
    </div>
  );
}

function LayoutTwoColAccent({
  contact,
  experience,
  education,
  skills,
  projects,
  certificates,
  awards,
  languages,
  customSections,
  linkedin,
  tpl,
  formatting,
}: Omit<ResumePreviewProps, "nationality" | "dateOfBirth">) {
  const a = tpl.accent;
  const fmt = formatting ?? {};
  const linkDisplay: LinkDisplay = fmt.linkDisplay ?? "text";
  const contactLineParts: React.ReactNode[] = [];
  if (contact.email) contactLineParts.push(<span key="e">{contact.email}</span>);
  if (contact.phone) contactLineParts.push(<span key="p">{contact.phone}</span>);
  if (linkedin) contactLineParts.push(renderProfileLink("linkedin", linkedin, linkDisplay));
  if (contact.github) contactLineParts.push(renderProfileLink("github", contact.github, linkDisplay));
  const fontMap: Record<string, CSSProperties> = {
    system: sans,
    inter: { fontFamily: "Inter, system-ui, -apple-system, 'Segoe UI', Roboto, Arial" },
    serif: { fontFamily: "'Times New Roman', Times, serif" },
    playfair: { fontFamily: "'Playfair Display', Georgia, serif" },
    helvetica: { fontFamily: "Helvetica, Arial, sans-serif" },
    arial: { fontFamily: "Arial, Helvetica, sans-serif" },
    montserrat: { fontFamily: "'Montserrat', 'Helvetica Neue', Helvetica, Arial, sans-serif" },
    mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, 'Roboto Mono', 'Segoe UI Mono', monospace" },
  };
  const fontStyle = fontMap[fmt.fontFamily ?? "system"] ?? sans;
  const custom = visibleCustomSections(customSections);

  return (
    <div style={{ ...paper, background: tpl.bg, color: tpl.textColor, ...fontStyle }}>
      <h1 style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>{contact.name}</h1>
      <p style={{ margin: "4px 0 0", fontSize: 18, fontWeight: 600, color: a }}>{contact.title}</p>
      <p style={{ margin: "8px 0 0", fontSize: 16, color: tpl.mutedColor }}>
        {contactLineParts.map((part, i) => (
          <span key={i}>
            {part}
            {i < contactLineParts.length - 1 ? " · " : ""}
          </span>
        ))}
      </p>

      <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
        <div style={{ width: "65%", minWidth: 0 }}>
          <TwoColHeader label="EXPERIENCE" accent={a} size={fmt.sectionHeaderSize} />
          {experience.map((job, i) => (
            <div key={i} style={{ marginBottom: 21, fontSize: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, fontWeight: 700 }}>
                <span>{job.title}</span>
                <span style={{ fontWeight: 400, color: tpl.mutedColor, whiteSpace: "nowrap" }}>{job.period}</span>
              </div>
              <div style={{ fontStyle: "italic", color: tpl.mutedColor, marginBottom: 5 }}>{job.company}</div>
              <ul style={{ margin: 0, paddingLeft: 24, lineHeight: 1.35 }}>
                {job.bullets.map((b, j) => (
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          ))}

          <TwoColHeader label="EDUCATION" accent={a} size={fmt.sectionHeaderSize} />
          {education.map((ed, i) => (
            <div key={i} style={{ marginBottom: 10, fontSize: 16 }}>
              <strong>{ed.degree}</strong>
              <div style={{ color: tpl.mutedColor }}>{ed.school} · {ed.year}</div>
            </div>
          ))}

          {projects && projects.length > 0 && (
            <>
              <TwoColHeader label="PROJECTS" accent={a} size={fmt.sectionHeaderSize} />
              {projects.map((p, i) => (
                <div key={i} style={{ marginBottom: 13, fontSize: 16 }}>
                  <div style={{ fontWeight: 700 }}>{p.title}</div>
                  {p.technologies && p.technologies.length > 0 && (
                    <div style={{ fontSize: 14, color: tpl.mutedColor, marginBottom: 2 }}>{p.technologies.join(" | ")}</div>
                  )}
                  <ul style={{ margin: "2px 0 0", paddingLeft: 24, lineHeight: 1.35 }}>
                    {p.bullets.map((b, j) => <li key={j}>{b}</li>)}
                  </ul>
                </div>
              ))}
            </>
          )}
          {custom.map((section, i) => (
            <div key={i}>
              <TwoColHeader label={section.title.toUpperCase()} accent={a} size={fmt.sectionHeaderSize} />
              <ul style={{ margin: "2px 0 0", paddingLeft: 24, fontSize: 16, lineHeight: 1.35 }}>
                {section.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>

        <div style={{ width: "35%", minWidth: 0 }}>
          <TwoColHeader label="SKILLS" accent={a} size={fmt.sectionHeaderSize} />
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 18 }}>
            {skills.flatMap((g) => g.items).map((s, i) => (
              <span
                key={i}
                style={{
                  fontSize: 12,
                  padding: "2px 6px",
                  borderRadius: 3,
                  background: a,
                  color: "#ffffff",
                }}
              >
                {s}
              </span>
            ))}
          </div>

          <TwoColHeader label="EDUCATION" accent={a} size={fmt.sectionHeaderSize} />
          {education.map((ed, i) => (
            <div key={i} style={{ marginBottom: 10, fontSize: 14, lineHeight: 1.35 }}>
              <div style={{ fontWeight: 700 }}>{ed.degree}</div>
              <div style={{ color: tpl.mutedColor }}>{ed.school}</div>
              <div style={{ color: tpl.mutedColor }}>{ed.year}</div>
            </div>
          ))}

          {certificates && certificates.length > 0 && (
            <>
              <TwoColHeader label="CERTIFICATIONS" accent={a} size={fmt.sectionHeaderSize} />
              {certificates.map((c, i) => (
                <div key={i} style={{ fontSize: 14, marginBottom: 5, color: tpl.mutedColor }}>• {c}</div>
              ))}
            </>
          )}

          {languages && languages.length > 0 && (
            <>
              <TwoColHeader label="LANGUAGES" accent={a} size={fmt.sectionHeaderSize} />
              {languages.map((l, i) => (
                <div key={i} style={{ fontSize: 14, marginBottom: 5 }}>
                  <strong>{l.name}</strong>{l.level ? <span style={{ color: tpl.mutedColor }}> ({l.level})</span> : ""}
                </div>
              ))}
            </>
          )}

          {awards && awards.length > 0 && (
            <>
              <TwoColHeader label="AWARDS" accent={a} size={fmt.sectionHeaderSize} />
              {awards.map((a2, i) => (
                <div key={i} style={{ fontSize: 14, marginBottom: 5 }}>
                  <strong>{a2.title}</strong>
                  {a2.institution && <div style={{ color: tpl.mutedColor }}>{a2.institution}</div>}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function TwoColHeader({ label, accent, size }: { label: string; accent: string; size?: number }) {
  return (
    <div
      style={{
        fontSize: size ?? 16,
        fontWeight: 700,
        letterSpacing: 0.5,
        color: accent,
        textTransform: "uppercase",
        borderBottom: `2px solid ${accent}`,
        paddingBottom: 4,
        marginBottom: 10,
      }}
    >
      {label}
    </div>
  );
}

export function ResumePreview({
  contact,
  experience,
  education,
  skills,
  tpl,
  linkedin,
  languages,
  awards,
  certificates,
  projects,
  customSections,
  nationality,
  dateOfBirth,
  formatting,
}: ResumePreviewProps) {
  const common = {
    contact,
    experience,
    education,
    skills,
    linkedin,
    languages,
    awards,
    certificates,
    projects,
    customSections,
    nationality,
    dateOfBirth,
    formatting,
  };

  switch (tpl.layout) {
    case "classic-center":
      return <LayoutClassicCenter {...common} tpl={tpl} />;
    case "sidebar-dark":
      return <LayoutSidebarDark {...common} tpl={tpl} />;
    case "harvard":
      return <LayoutHarvard {...common} tpl={tpl} />;
    case "modern-teal":
      return <LayoutModernTeal {...common} tpl={tpl} />;
    case "corporate-clean":
      return <LayoutCorporateClean {...common} tpl={tpl} dense={false} />;
    case "corporate-dense":
      return <LayoutCorporateClean {...common} tpl={tpl} dense />;
    case "single-minimal":
      return <LayoutSingleMinimal {...common} tpl={tpl} />;
    case "two-col-accent":
      return <LayoutTwoColAccent {...common} tpl={tpl} />;
    default:
      return <LayoutClassicCenter {...common} tpl={tpl} />;
  }
}
