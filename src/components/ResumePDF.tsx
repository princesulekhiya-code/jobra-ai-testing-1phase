"use client";

import type { ReactNode } from "react";
import type { Style } from "@react-pdf/types";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
  Link,
} from "@react-pdf/renderer";

interface ContactInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  summary: string;
  linkedin: string;
  photo?: string;
  github?: string;
}
interface ExpItem { title: string; company: string; period: string; bullets: string[]; }
interface EduItem { degree: string; school: string; year: string; }
interface SkillGroup { category: string; items: string[]; }
interface ProjectItem { title: string; description: string; technologies?: string[]; bullets: string[]; }
interface AwardItem { title: string; institution?: string; }
interface LanguageItem { name: string; level?: string; }

type FormattingOptions = {
  fontFamily?: "system" | "serif" | "mono" | "inter" | "playfair" | "helvetica" | "arial" | "montserrat";
  nameSize?: number;
  titleSize?: number;
  bodySize?: number;
  lineHeight?: number;
  exportMode?: "compact" | "standard";
  linkDisplay?: "text" | "icon" | "hidden";
};

function SectionHeader({ title, style }: { title: string; style: Style | Style[] }) {
  return <Text style={style}>{title}</Text>;
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

interface CustomSectionPDF {
  title: string;
  items: string[];
}

interface ResumePDFProps {
  contact: ContactInfo;
  experience: ExpItem[];
  education: EduItem[];
  skills: SkillGroup[];
  projects: ProjectItem[];
  certifications: string[];
  achievements: AwardItem[];
  languages: LanguageItem[];
  customSections?: CustomSectionPDF[];
}
export async function generateResumePDF(props: ResumePDFProps, formatting?: FormattingOptions & { fitToOnePage?: boolean; scaleFactor?: number }): Promise<void> {
  const fmt = formatting ?? {};
  const linkDisplay: "text" | "icon" | "hidden" = fmt.linkDisplay ?? "text";
  const exportMode = fmt.exportMode ?? "compact";
  const fitToOnePage = Boolean(fmt.fitToOnePage);
  const compactness = exportMode === "compact" ? 0.9 : 1;
  const baseBodySize = (fmt.bodySize ?? 10) * compactness;
  const baseNameSize = (fmt.nameSize ?? 22) * compactness;
  const baseTitleSize = (fmt.titleSize ?? 11) * compactness;
  const baseLineHeight = (fmt.lineHeight ?? 1.5) * (exportMode === "compact" ? 0.95 : 1);
  const fontFamily = ((): string => {
    switch (fmt.fontFamily) {
      case "inter": return "Helvetica";
      case "serif": return "Times-Roman";
      case "playfair": return "Times-Roman";
      case "helvetica": return "Helvetica";
      case "arial": return "Helvetica";
      case "montserrat": return "Helvetica";
      case "mono": return "Courier";
      default: return "Helvetica";
    }
  })();

  const pagePad = (scale: number) => {
    const topBottom = exportMode === "compact" ? 8 : 10;
    const side = exportMode === "compact" ? 10 : 12;
    return `${Math.max(5, topBottom * scale)}mm ${Math.max(5, side * scale)}mm`;
  };

  const countPdfPages = async (blob: Blob): Promise<number> => {
    const bytes = await blob.arrayBuffer();
    const text = new TextDecoder("iso-8859-1").decode(bytes);
    const matches = text.match(/\/Type\s*\/Page\b/g);
    return matches ? matches.length : 1;
  };

  const buildDocument = (scale: number) => {
    const bodySize = Math.max(8, Math.round(baseBodySize * scale));
    const nameSize = Math.max(14, Math.round(baseNameSize * scale));
    const titleSize = Math.max(9, Math.round(baseTitleSize * scale));
    const lh = Math.max(1.1, Number((baseLineHeight * scale).toFixed(2)));

    const s = StyleSheet.create({
      page: { padding: pagePad(scale), fontFamily: fontFamily, fontSize: bodySize, color: "#222" },
      name: { fontSize: nameSize, fontWeight: "bold", fontFamily: fontFamily, marginBottom: Math.max(1, 2 * scale) },
      jobTitle: { fontSize: titleSize, color: "#555", marginBottom: Math.max(3, 6 * scale) },
      contactRow: { fontSize: Math.max(8, bodySize - 1), color: "#444", marginBottom: Math.max(6, 12 * scale), flexDirection: "row", flexWrap: "wrap", gap: Math.max(3, 6 * scale) },
      sectionTitle: {
        fontSize: Math.max(9, bodySize + 1), fontWeight: "bold", fontFamily: fontFamily,
        textTransform: "uppercase" as const, letterSpacing: 0.5,
        borderBottomWidth: 1, borderBottomColor: "#222", borderBottomStyle: "solid" as const,
        paddingBottom: Math.max(1, 2 * scale), marginTop: Math.max(4, 9 * scale), marginBottom: Math.max(2, 4 * scale),
      },
      summary: { fontSize: bodySize, lineHeight: lh, textAlign: "justify" as const, marginBottom: Math.max(1, 3 * scale) },
      expBlock: { marginBottom: Math.max(3, 6 * scale) },
      expHeader: { flexDirection: "row" as const, justifyContent: "space-between" as const, marginBottom: Math.max(1, 2 * scale) },
      expTitle: { fontSize: Math.max(9, bodySize), fontWeight: "bold", fontFamily: fontFamily },
      expPeriod: { fontSize: Math.max(8, bodySize - 1), color: "#555" },
      expCompany: { fontSize: Math.max(8, bodySize - 1), fontStyle: "italic" as const, color: "#555", marginBottom: Math.max(1, 3 * scale) },
      bullet: { fontSize: Math.max(8, bodySize - 1), lineHeight: Math.max(1.15, lh - 0.08), paddingLeft: Math.max(6, 10 * scale), marginBottom: Math.max(1, 2 * scale) },
      eduBlock: { marginBottom: Math.max(2, 4 * scale) },
      eduRow: { flexDirection: "row" as const, justifyContent: "space-between" as const },
      eduDegree: { fontSize: Math.max(9, bodySize), fontWeight: "bold", fontFamily: fontFamily },
      eduSchool: { fontSize: Math.max(8, bodySize - 1), fontStyle: "italic" as const, color: "#555" },
      eduYear: { fontSize: Math.max(8, bodySize - 1), color: "#555" },
      skillLine: { fontSize: Math.max(8, bodySize - 1), lineHeight: Math.max(1.1, lh), marginBottom: Math.max(0, 1 * scale) },
      skillCat: { fontWeight: "bold", fontFamily: fontFamily },
      projTitle: { fontSize: Math.max(9, bodySize), fontWeight: "bold", fontFamily: fontFamily },
      projTech: { fontSize: Math.max(7, bodySize - 2), color: "#555", marginBottom: Math.max(1, 2 * scale) },
      certItem: { fontSize: Math.max(8, bodySize - 1), lineHeight: Math.max(1.1, lh), marginBottom: 0 },
      awardTitle: { fontSize: Math.max(8, bodySize), fontWeight: "bold", fontFamily: fontFamily },
      awardInst: { fontSize: Math.max(8, bodySize - 1), color: "#555", fontStyle: "italic" as const },
      langItem: { fontSize: Math.max(8, bodySize - 1), lineHeight: Math.max(1.1, lh) },
      iconLink: { fontSize: Math.max(8, bodySize - 1), color: "#1155cc", marginRight: Math.max(4, 6 * scale), padding: 2, borderWidth: 0.3, borderColor: "#999", borderRadius: 2, textAlign: "center" as const },
    });

    function ResumePDFDocument(pdfProps: ResumePDFProps) {
      const { contact, experience, education, skills, projects, certifications, achievements, languages } = pdfProps;
      const customSections = (pdfProps.customSections ?? [])
        .map((section) => ({
          title: section.title.trim(),
          items: section.items.map((item) => item.trim()).filter(Boolean),
        }))
        .filter((section) => section.title && section.items.length > 0);
      const contactBits: ReactNode[] = [];
      if (contact.email) contactBits.push(<Text key="e">✉ {contact.email}</Text>);
      if (contact.phone) contactBits.push(<Text key="p">📞 {contact.phone}</Text>);
      if (contact.location) contactBits.push(<Text key="l">📍 {contact.location}</Text>);
      if (contact.linkedin) {
        const url = normalizeLinkedinUrl(contact.linkedin);
        if (linkDisplay === "hidden") {
          if (url) contactBits.push(<Link key="li" src={url} style={{ color: "#1155cc", textDecoration: "none" }}><Text>LinkedIn</Text></Link>);
          else contactBits.push(<Text key="li">LinkedIn</Text>);
        } else if (linkDisplay === "icon") {
          if (url) contactBits.push(<Link key="li" src={url} style={s.iconLink}><Text>in</Text></Link>);
          else contactBits.push(<Text key="li" style={s.iconLink}>in</Text>);
        } else {
          const text = displayLinkedinText(contact.linkedin);
          if (url) contactBits.push(<Link key="li" src={url} style={{ color: "#1155cc", textDecoration: "underline" }}><Text>LinkedIn: {text}</Text></Link>);
          else contactBits.push(<Text key="li">LinkedIn: {text}</Text>);
        }
      }
      if (contact.github) {
        const url = normalizeGithubUrl(contact.github);
        if (linkDisplay === "hidden") {
          if (url) contactBits.push(<Link key="gh" src={url} style={{ color: "#1155cc", textDecoration: "none" }}><Text>GitHub</Text></Link>);
          else contactBits.push(<Text key="gh">GitHub</Text>);
        } else if (linkDisplay === "icon") {
          if (url) contactBits.push(<Link key="gh" src={url} style={s.iconLink}><Text>gh</Text></Link>);
          else contactBits.push(<Text key="gh" style={s.iconLink}>gh</Text>);
        } else {
          const text = displayGithubText(contact.github);
          if (url) contactBits.push(<Link key="gh" src={url} style={{ color: "#1155cc", textDecoration: "underline" }}><Text>GitHub: {text}</Text></Link>);
          else contactBits.push(<Text key="gh">GitHub: {text}</Text>);
        }
      }

      return (
        <Document>
          <Page size="A4" style={s.page}>
            <Text style={s.name}>{contact.name}</Text>
            <Text style={s.jobTitle}>{contact.title}</Text>
            <View style={s.contactRow}>
              {contactBits.map((c, i) => (
                <View key={i} style={{ flexDirection: "row" as const, alignItems: "center" as const }}>
                  {c}
                  {i < contactBits.length - 1 ? <Text>  |  </Text> : null}
                </View>
              ))}
            </View>

            {contact.summary ? (
              <>
                <SectionHeader title="PROFILE" style={s.sectionTitle} />
                <Text style={s.summary}>{contact.summary}</Text>
              </>
            ) : null}

            {experience.length > 0 && (
              <>
                <SectionHeader title="PROFESSIONAL EXPERIENCE" style={s.sectionTitle} />
                {experience.map((job, i) => (
                  <View key={i} style={s.expBlock}>
                    <View style={s.expHeader}>
                      <Text style={s.expTitle}>{job.title}</Text>
                      <Text style={s.expPeriod}>{job.period}</Text>
                    </View>
                    <Text style={s.expCompany}>{job.company}</Text>
                    {job.bullets.map((b, j) => (
                      <Text key={j} style={s.bullet}>•  {b}</Text>
                    ))}
                  </View>
                ))}
              </>
            )}

            {education.length > 0 && (
              <>
                <SectionHeader title="EDUCATION" style={s.sectionTitle} />
                {education.map((ed, i) => (
                  <View key={i} style={s.eduBlock}>
                    <View style={s.eduRow}>
                      <Text style={s.eduDegree}>{ed.degree}</Text>
                      <Text style={s.eduYear}>{ed.year}</Text>
                    </View>
                    <Text style={s.eduSchool}>{ed.school}</Text>
                  </View>
                ))}
              </>
            )}

            {skills.length > 0 && (
              <>
                <SectionHeader title="SKILLS" style={s.sectionTitle} />
                {skills.map((g, i) => (
                  <Text key={i} style={s.skillLine}>
                    {g.category ? <Text style={s.skillCat}>{g.category}: </Text> : null}
                    {g.items.join(" · ")}
                  </Text>
                ))}
              </>
            )}

            {projects.length > 0 && (
              <>
                <SectionHeader title="PROJECTS" style={s.sectionTitle} />
                {projects.map((p, i) => (
                  <View key={i} style={s.expBlock}>
                    <Text style={s.projTitle}>{p.title}</Text>
                    {p.technologies && p.technologies.length > 0 && (
                      <Text style={s.projTech}>{p.technologies.join(" | ")}</Text>
                    )}
                    {p.bullets.map((b, j) => (
                      <Text key={j} style={s.bullet}>•  {b}</Text>
                    ))}
                    {p.description && p.bullets.length === 0 && (
                      <Text style={s.bullet}>{p.description}</Text>
                    )}
                  </View>
                ))}
              </>
            )}

            {certifications.length > 0 && (
              <>
                <SectionHeader title="CERTIFICATIONS" style={s.sectionTitle} />
                {certifications.map((c, i) => (
                  <Text key={i} style={s.certItem}>•  {c}</Text>
                ))}
              </>
            )}

            {achievements.length > 0 && (
              <>
                <SectionHeader title="AWARDS" style={s.sectionTitle} />
                {achievements.map((a, i) => (
                  <View key={i} style={{ marginBottom: Math.max(1, 3 * scale) }}>
                    <Text>
                      <Text style={s.awardTitle}>{a.title}</Text>
                      {a.institution ? <Text style={s.awardInst}>  —  {a.institution}</Text> : null}
                    </Text>
                  </View>
                ))}
              </>
            )}

            {languages.length > 0 && (
              <>
                <SectionHeader title="LANGUAGES" style={s.sectionTitle} />
                <Text style={s.langItem}>
                  {languages.map((l) => `${l.name}${l.level ? ` (${l.level})` : ""}`).join("  ·  ")}
                </Text>
              </>
            )}

            {customSections.map((sec, i) => (
              <View key={i} style={{ marginBottom: Math.max(3, 6 * scale) }}>
                <SectionHeader title={sec.title.toUpperCase()} style={s.sectionTitle} />
                {sec.items.map((it, j) => (
                  <Text key={j} style={s.bullet}>
                    •  {it}
                  </Text>
                ))}
              </View>
            ))}
          </Page>
        </Document>
      );
    }

    return { ResumePDFDocument };
  };
  const measurePages = async (scale: number): Promise<number> => {
    const { ResumePDFDocument } = buildDocument(scale);
    const blob = await pdf(<ResumePDFDocument {...props} />).toBlob();
    return countPdfPages(blob);
  };

  const renderFinal = async (scale: number): Promise<Blob> => {
    const { ResumePDFDocument } = buildDocument(scale);
    return pdf(<ResumePDFDocument {...props} />).toBlob();
  };

  let finalScale = 1;
  if (fitToOnePage) {
    let low = 0.05;
    let high = 1.0;
    let best = low;

    // First ensure the lower bound actually fits.
    let lowPages = await measurePages(low);
    while (lowPages > 1 && low > 0.01) {
      high = low;
      low = Math.max(0.01, low / 2);
      lowPages = await measurePages(low);
    }

    const targetPages = exportMode === "compact" ? 1 : 2;

    if (lowPages > targetPages) {
      finalScale = low;
    } else {
      for (let i = 0; i < 8; i++) {
        const mid = Number(((low + high) / 2).toFixed(4));
        const pages = await measurePages(mid);
        if (pages <= targetPages) {
          best = mid;
          low = mid;
        } else {
          high = mid;
        }
      }
      finalScale = best;

      // Safety fallback: if the final render still overflows, keep shrinking until it does not.
      for (let guard = 0; guard < 6; guard++) {
        const pages = await measurePages(finalScale);
        if (pages <= targetPages) break;
        finalScale = Math.max(0.01, Number((finalScale * (exportMode === "compact" ? 0.84 : 0.9)).toFixed(4)));
      }
    }
  }

  const blob = await renderFinal(finalScale);
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = props.contact.name && props.contact.name !== "Your Name"
    ? `${props.contact.name.replace(/\s+/g, "_")}_Resume.pdf`
    : "Resume.pdf";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
