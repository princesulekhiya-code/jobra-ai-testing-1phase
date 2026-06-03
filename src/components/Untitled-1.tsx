"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/DashboardLayout";
import {
  ChevronLeft, ChevronRight, Plus, MoreVertical, X, Sparkles,
  Eye, Download, Wrench, GraduationCap, Briefcase, UserIcon,
  ZoomIn, ZoomOut, Printer, Loader2,
} from "lucide-react";
import { templates } from "@/lib/templates";
import { ResumePreview, type ProjectItem, type LanguageItem, type AwardItem, type CustomSection } from "@/components/ResumeLayouts";
import { generateResumePDF } from "@/components/ResumePDF";


type FormattingOptions = {
  fontFamily?: "system" | "serif" | "mono" | "inter" | "playfair";
  nameSize?: number; // px
  titleSize?: number; // px
  bodySize?: number; // px
  lineHeight?: number; // multiplier
  sectionHeaderSize?: number;
  subHeaderSize?: number;
  exportMode?: "compact" | "standard";
  linkDisplay?: "text" | "icon" | "hidden";
};

const A4_PREVIEW_W = 794;
const A4_PREVIEW_H = 1123;

const thumbnailContact = {
  name: "Aarav Mehta",
  title: "Product Designer",
  email: "aarav@example.com",
  phone: "+91 98765 43210",
  location: "Mumbai, India",
  summary: "Product designer building clean systems and polished user journeys.",
};

const thumbnailExperience = [
  {
    title: "Senior Product Designer",
    company: "Nova Studio",
    period: "2022 - Present",
    bullets: ["Led design for 3 product lines", "Improved conversion by 18%"],
  },
  {
    title: "UI Designer",
    company: "Bright Labs",
    period: "2019 - 2022",
    bullets: ["Built reusable UI systems"],
  },
];

const thumbnailEducation = [
  { degree: "B.Des. Visual Communication", school: "MIT Institute", year: "2019" },
];

const thumbnailSkills = [
  { category: "Design", items: ["Figma", "Adobe XD", "Design Systems"] },
];

const thumbnailProjects = [
  {
    title: "Portfolio Revamp",
    description: "Improved showcase for freelance clients",
    technologies: ["Figma", "Framer"],
    bullets: ["Introduced stronger hierarchy"],
  },
];

const thumbnailLanguages = [{ name: "English", level: "Native" }];
const thumbnailAwards = [{ title: "Design Excellence", institution: "AIGA" }];
const thumbnailCertificates = ["Google UX Design Certificate"];

function TemplateStripThumbnail({ tpl }: { tpl: (typeof templates)[number] }) {
  return (
    <div style={{ width: 794, minHeight: 1123, transformOrigin: "top left", transform: "scale(0.11)", pointerEvents: "none", userSelect: "none" }}>
      <ResumePreview
        contact={thumbnailContact}
        experience={thumbnailExperience}
        education={thumbnailEducation}
        skills={thumbnailSkills}
        tpl={tpl}
        projects={thumbnailProjects}
        languages={thumbnailLanguages}
        awards={thumbnailAwards}
        certificates={thumbnailCertificates}
      />
    </div>
  );
}

function extractField(data: Record<string, unknown>, ...keys: string[]): string {
  for (const k of keys) {
    for (const dk of Object.keys(data)) {
      if (dk.toLowerCase().replace(/[_\s]/g, "") === k.toLowerCase().replace(/[_\s]/g, "")) {
        const v = data[dk];
        if (typeof v === "string") return v;
        if (typeof v === "object" && v !== null) return JSON.stringify(v);
      }
    }
  }
  return "";
}

function normalizePhone(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return "";
  const hasPlus = trimmed.startsWith("+");
  const digits = trimmed.replace(/\D+/g, "");
  if (!digits) return trimmed;
  if (hasPlus) return `+${digits}`;
  return digits;
}

function extractObject(data: Record<string, unknown>, ...keys: string[]): Record<string, unknown> | null {
  for (const k of keys) {
    for (const dk of Object.keys(data)) {
      if (dk.toLowerCase().replace(/[_\s]/g, "") === k.toLowerCase().replace(/[_\s]/g, "")) {
        const v = data[dk];
        if (typeof v === "object" && v !== null && !Array.isArray(v)) return v as Record<string, unknown>;
      }
    }
  }
  return null;
}

function extractArray(data: Record<string, unknown>, ...keys: string[]): unknown[] {
  for (const k of keys) {
    for (const dk of Object.keys(data)) {
      if (dk.toLowerCase().replace(/[_\s]/g, "") === k.toLowerCase().replace(/[_\s]/g, "")) {
        const v = data[dk];
        if (Array.isArray(v)) return v;
      }
    }
  }
  return [];
}

interface ContactInfo { name: string; title: string; email: string; phone: string; location: string; summary: string; linkedin: string; photo?: string; github?: string; }
interface ExpItem { title: string; company: string; period: string; bullets: string[]; }
interface EduItem { degree: string; school: string; year: string; }
interface SkillGroup { category: string; items: string[]; }

interface ParsedResume {
  contact: ContactInfo;
  experience: ExpItem[];
  education: EduItem[];
  skills: SkillGroup[];
  projects: ProjectItem[];
  certifications: string[];
  achievements: AwardItem[];
  languages: LanguageItem[];
}

function parseImprovedResume(data: Record<string, unknown>): ParsedResume {
  const contactObj = extractObject(data, "Contact_Information", "ContactInformation", "Contact") || {};
  const co = contactObj as Record<string, unknown>;
  const expRaw = extractArray(data, "Work_Experience", "WorkExperience", "Experience", "Professional_Experience");

  const contact: ContactInfo = {
    name: extractField(co, "Name", "Full_Name", "FullName") || extractField(data, "Name", "Full_Name", "FullName") || "Your Name",
    // Do NOT auto-fill title from experience — only use explicit title fields from contact or top-level.
    title: extractField(co, "Title", "Job_Title", "JobTitle", "Position") || extractField(data, "Title", "Job_Title", "Role", "Position") || "",
    email: extractField(co, "Email", "Email_Address") || "",
    phone: normalizePhone(extractField(co, "Phone", "Phone_Number", "PhoneNumber", "Mobile", "Mobile_Number", "Contact_Number", "Telephone") || ""),
    location: extractField(co, "Location", "Address", "City") || "",
    summary: extractField(data, "Professional_Summary", "ProfessionalSummary", "Summary", "Bio", "Profile") || "",
    linkedin: extractField(co, "LinkedIn", "Linkedin", "LinkedIn_Url", "LinkedIn_Profile") || "",
  };

  const experience: ExpItem[] = expRaw.map((e) => {
    if (typeof e !== "object" || !e) return { title: "", company: "", period: "", bullets: [] };
    const obj = e as Record<string, unknown>;
    const title = extractField(obj, "Title", "Job_Title", "Position", "Role");
    const company = extractField(obj, "Company", "Organization", "Employer");
    const start = extractField(obj, "Start_Date", "StartDate", "From");
    const end = extractField(obj, "End_Date", "EndDate", "To");
    const period = start && end ? `${start} - ${end}` : extractField(obj, "Duration", "Period", "Dates");
    const bulletsRaw = extractArray(obj, "Responsibilities", "Achievements", "Bullets", "Description", "Key_Achievements", "Key_Responsibilities");
    const bullets = bulletsRaw.map((b) => (typeof b === "string" ? b : String(b)));
    return { title, company, period, bullets };
  }).filter((e) => e.title || e.company);

  const eduRaw = extractArray(data, "Education", "Academic_Background");
  const education: EduItem[] = eduRaw.map((e) => {
    if (typeof e !== "object" || !e) return { degree: "", school: "", year: "" };
    const obj = e as Record<string, unknown>;
    return {
      degree: extractField(obj, "Degree", "Qualification", "Program"),
      school: extractField(obj, "Institution", "School", "University", "College"),
      year: extractField(obj, "Graduation_Date", "Year", "GraduationDate", "Graduated", "Graduation_Year"),
    };
  }).filter((e) => e.degree || e.school);

  const skillsObj = extractObject(data, "Skills", "Technical_Skills", "Core_Skills");
  const skills: SkillGroup[] = [];
  if (skillsObj) {
    for (const [cat, val] of Object.entries(skillsObj)) {
      if (Array.isArray(val)) skills.push({ category: cat.replace(/_/g, " "), items: val.map(String) });
      else if (typeof val === "string") skills.push({ category: cat.replace(/_/g, " "), items: val.split(",").map((s) => s.trim()) });
    }
  }

  const projRaw = extractArray(data, "Projects", "Key_Projects", "Personal_Projects");
  const projects: ProjectItem[] = projRaw.map((p) => {
    if (typeof p !== "object" || !p) return { title: "", description: "", technologies: [], bullets: [] };
    const obj = p as Record<string, unknown>;
    const techRaw = extractArray(obj, "Technologies", "Tech_Stack", "Tools", "Technologies_Used");
    const bulletsRaw = extractArray(obj, "Description", "Bullets", "Key_Features", "Highlights", "Details");
    return {
      title: extractField(obj, "Title", "Project_Title", "Name", "Project_Name"),
      description: extractField(obj, "Description", "Summary", "Overview"),
      technologies: techRaw.map((t) => String(t)),
      bullets: bulletsRaw.map((b) => String(b)),
    };
  }).filter((p) => p.title);

  const certRaw = extractArray(data, "Certifications", "Certificates", "Professional_Certifications");
  const certifications: string[] = certRaw.map((c) => {
    if (typeof c === "string") return c;
    if (typeof c === "object" && c) {
      const obj = c as Record<string, unknown>;
      const name = extractField(obj, "Name", "Title", "Certification_Name", "Certificate_Name");
      const issuer = extractField(obj, "Issuer", "Organization", "Issued_By", "Institution");
      return issuer ? `${name} - ${issuer}` : name;
    }
    return String(c);
  }).filter(Boolean);

  const achRaw = extractArray(data, "Achievements", "Awards", "Honors", "Awards_And_Achievements");
  const achievements: AwardItem[] = achRaw.map((a) => {
    if (typeof a === "string") return { title: a };
    if (typeof a === "object" && a) {
      const obj = a as Record<string, unknown>;
      return {
        title: extractField(obj, "Title", "Name", "Award"),
        institution: extractField(obj, "Institution", "Organization", "Issuer", "Company") || undefined,
      };
    }
    return { title: String(a) };
  }).filter((a) => a.title);

  const langRaw = extractArray(data, "Languages", "Language_Skills");
  const languages: LanguageItem[] = langRaw.map((l) => {
    if (typeof l === "string") return { name: l };
    if (typeof l === "object" && l) {
      const obj = l as Record<string, unknown>;
      return {
        name: extractField(obj, "Name", "Language"),
        level: extractField(obj, "Level", "Proficiency", "Fluency") || undefined,
      };
    }
    return { name: String(l) };
  }).filter((l) => l.name);

  return { contact, experience, education, skills, projects, certifications, achievements, languages };
}

// ─── MAIN PAGE ─────────────────────────────────────────

export default function ResumeBuilderPage() {
  const router = useRouter();
  const [selectedTplIdx, setSelectedTplIdx] = useState(0);
  const [templateScroll, setTemplateScroll] = useState(0);
  const [showPreview, setShowPreview] = useState(false);
  const [previewZoom, setPreviewZoom] = useState(0.85);
  const [showDesign, setShowDesign] = useState(false);

  const [formatting, setFormatting] = useState<FormattingOptions>({
    fontFamily: "system",
    nameSize: 26,
    titleSize: 16,
    bodySize: 16,
    lineHeight: 1.45,
    sectionHeaderSize: 13,
    subHeaderSize: 11,
    exportMode: "compact",
    linkDisplay: "text",
  });
  const [fitToOnePage, setFitToOnePage] = useState(true);

  // Persist formatting to localStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("resume_formatting") || localStorage.getItem("resume_formatting");
      if (saved) setFormatting(JSON.parse(saved));
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("resume_formatting", JSON.stringify(formatting));
      sessionStorage.removeItem("resume_formatting");
    } catch (e) {
      // ignore
    }
  }, [formatting]);
  
  const printRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const previewModalRef = useRef<HTMLDivElement>(null);
  const previewSheetRef = useRef<HTMLDivElement>(null);

  const [liveScale, setLiveScale] = useState(0.58);
  const [previewPageCount, setPreviewPageCount] = useState(1);
  const [previewModalScale, setPreviewModalScale] = useState(0.85);

  // Live auto-fit: compute a scale so the resume preview fits a single page when requested.
  useEffect(() => {
    const pageWidthPx = 816; // 612pt * 1.333 = 816px (US Letter at 96dpi)
    const pageHeightPx = 1056; // 792pt * 1.333 = 1056px

    function recompute() {
      const cont = containerRef.current;
      const el = printRef.current;
      if (!cont || !el) return;

      const availW = cont.clientWidth || cont.getBoundingClientRect().width;
      const availH = cont.clientHeight || cont.getBoundingClientRect().height;

      const contentW = el.scrollWidth || el.getBoundingClientRect().width || pageWidthPx;
      const contentH = el.scrollHeight || el.getBoundingClientRect().height || pageHeightPx;

      if (fitToOnePage) {
        // Scale down so content height becomes <= single page height, also ensure it fits width
        const scaleByHeight = Math.min(1, pageHeightPx / Math.max(contentH, pageHeightPx));
        const scaleByWidth = Math.min(1, availW / Math.max(pageWidthPx, contentW));
        const final = Math.min(scaleByHeight, scaleByWidth);
        setLiveScale(final || 0.58);
      } else {
        // Default view scale to fit comfortably in available area (keeps a margin)
        const target = Math.min(0.9, availW / (pageWidthPx * 1.05));
        setLiveScale(target > 0.25 ? target : 0.58);
      }
    }

    recompute();
    const ro = new ResizeObserver(recompute);
    if (containerRef.current) ro.observe(containerRef.current);
    if (printRef.current) ro.observe(printRef.current);
    window.addEventListener("resize", recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [formatting, fitToOnePage]);

  const [contact, setContact] = useState<ContactInfo>({
    name: "Your Name", title: "Your Title",
    email: "", phone: "", location: "",
    summary: "", linkedin: "",
    photo: "",
    github: "",
  });
  const [experience, setExperience] = useState<ExpItem[]>([]);
  const [education, setEducation] = useState<EduItem[]>([]);
  const [skills, setSkills] = useState<SkillGroup[]>([]);
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [certifications, setCertifications] = useState<string[]>([]);
  const [achievements, setAchievements] = useState<AwardItem[]>([]);
  const [languages, setLanguages] = useState<LanguageItem[]>([]);
  const [customSections, setCustomSections] = useState<CustomSection[]>([]);
  const photoInputRef = useRef<HTMLInputElement>(null);


  useEffect(() => {
    const tplId = sessionStorage.getItem("selected_template");
    if (tplId) {
      const idx = templates.findIndex((t) => t.id === tplId);
      if (idx >= 0) setSelectedTplIdx(idx);
      sessionStorage.removeItem("selected_template");
    }

    const improvedRaw = sessionStorage.getItem("improved_resume") || sessionStorage.getItem("upgrade_result");
    if (improvedRaw) {
      try {
        const improved = JSON.parse(improvedRaw);
        const parsed = parseImprovedResume(improved);
        if (parsed.contact.name !== "Your Name") setContact(parsed.contact);
        if (parsed.experience.length > 0) setExperience(parsed.experience);
        if (parsed.education.length > 0) setEducation(parsed.education);
        if (parsed.skills.length > 0) setSkills(parsed.skills);
        if (parsed.projects.length > 0) setProjects(parsed.projects);
        if (parsed.certifications.length > 0) setCertifications(parsed.certifications);
        if (parsed.achievements.length > 0) setAchievements(parsed.achievements);
        if (parsed.languages.length > 0) setLanguages(parsed.languages);
        // custom sections (if your AI output includes them)
        type RawCustomSection = { title?: unknown; items?: unknown };
        const improvedAny = improved as Record<string, unknown>;
        const customRaw = (improvedAny.customSections ?? improvedAny.custom_sections) as unknown;
        if (Array.isArray(customRaw)) {
          const sanitized: CustomSection[] = (customRaw as unknown[])
            .map((entry) => {
              const s = entry as RawCustomSection;
              const title = typeof s?.title === "string" ? s.title.trim() : "";
              const items = Array.isArray(s?.items) ? s.items.map((x) => (typeof x === "string" ? x : String(x))).filter(Boolean) : [];
              return { title, items };
            })
            .filter((s) => s.title && s.items.length > 0);
          if (sanitized.length) setCustomSections(sanitized);
        }
      } catch { /* ignore */ }
    }

  }, []);

  const handlePhotoFile = (file?: File | null) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const data = String(reader.result || "");
      setContact((c) => ({ ...c, photo: data }));
    };
    reader.readAsDataURL(file);
  };

  // Modal A4/page counter + fit.
  useEffect(() => {
    if (!showPreview) return;

    function recompute() {
      const modal = previewModalRef.current;
      const sheet = previewSheetRef.current;
      if (!modal || !sheet) return;

      const modalWidth = modal.clientWidth || modal.getBoundingClientRect().width;
      const modalHeight = modal.clientHeight || modal.getBoundingClientRect().height;
      const sheetHeight = sheet.scrollHeight || sheet.getBoundingClientRect().height || A4_PREVIEW_H;

      const pageCount = Math.max(1, Math.ceil(sheetHeight / A4_PREVIEW_H));
      setPreviewPageCount(pageCount);

      const fitWidth = Math.min(1, (modalWidth - 48) / A4_PREVIEW_W);
      const fitHeight = Math.min(1, (modalHeight - 120) / (A4_PREVIEW_H * Math.min(pageCount, 2)));
      const targetScale = fitToOnePage ? Math.min(fitWidth, fitHeight) : Math.min(0.95, fitWidth, previewZoom);
      setPreviewModalScale(Math.max(0.35, targetScale || 0.85));
    }

    recompute();
    const ro = new ResizeObserver(recompute);
    if (previewModalRef.current) ro.observe(previewModalRef.current);
    if (previewSheetRef.current) ro.observe(previewSheetRef.current);
    window.addEventListener("resize", recompute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", recompute);
    };
  }, [showPreview, fitToOnePage, previewZoom]);

  const currentTpl = templates[selectedTplIdx];
  const visibleCount = 6;

  const removeSkill = (groupIdx: number, itemIdx: number) => {
    setSkills(skills.map((g, gi) => gi === groupIdx ? { ...g, items: g.items.filter((_, ii) => ii !== itemIdx) } : g));
  };

  const updateSkillGroup = (groupIdx: number, field: keyof SkillGroup, value: string | string[]) => {
    setSkills(skills.map((group, gi) => gi === groupIdx ? { ...group, [field]: value } : group));
  };

  const addSkillGroup = () => {
    setSkills([...skills, { category: "Technical Skills", items: [""] }]);
  };

  const addSkillItem = (groupIdx: number) => {
    setSkills(skills.map((group, gi) => gi === groupIdx ? { ...group, items: [...group.items, ""] } : group));
  };

  const updateSkillItem = (groupIdx: number, itemIdx: number, value: string) => {
    setSkills(skills.map((group, gi) => {
      if (gi !== groupIdx) return group;
      return {
        ...group,
        items: group.items.map((item, ii) => ii === itemIdx ? value : item),
      };
    }));
  };

  const removeSkillGroup = (groupIdx: number) => {
    setSkills(skills.filter((_, gi) => gi !== groupIdx));
  };

  const addEducation = () => {
    setEducation([...education, { degree: "", school: "", year: "" }]);
  };

  const updateEducation = (idx: number, field: keyof EduItem, value: string) => {
    setEducation(education.map((edu, i) => i === idx ? { ...edu, [field]: value } : edu));
  };

  const removeEducation = (idx: number) => {
    setEducation(education.filter((_, i) => i !== idx));
  };

  const updateExp = (idx: number, field: keyof ExpItem, value: string | string[]) => {
    setExperience(experience.map((e, i) => i === idx ? { ...e, [field]: value } : e));
  };

  const updateExpBullet = (expIdx: number, bulletIdx: number, value: string) => {
    setExperience(experience.map((exp, i) => {
      if (i !== expIdx) return exp;
      return {
        ...exp,
        bullets: exp.bullets.map((bullet, j) => (j === bulletIdx ? value : bullet)),
      };
    }));
  };

  const addExpBullet = (expIdx: number) => {
    setExperience(experience.map((exp, i) => i === expIdx ? { ...exp, bullets: [...exp.bullets, ""] } : exp));
  };

  const removeExpBullet = (expIdx: number, bulletIdx: number) => {
    setExperience(experience.map((exp, i) => {
      if (i !== expIdx) return exp;
      return { ...exp, bullets: exp.bullets.filter((_, j) => j !== bulletIdx) };
    }));
  };

  const addExperience = () => {
    setExperience([...experience, { title: "", company: "", period: "", bullets: [""] }]);
  };

  const updateProject = (idx: number, field: keyof ProjectItem, value: string | string[]) => {
    setProjects(projects.map((proj, i) => i === idx ? { ...proj, [field]: value } : proj));
  };

  const updateProjectBullet = (projIdx: number, bulletIdx: number, value: string) => {
    setProjects(projects.map((proj, i) => {
      if (i !== projIdx) return proj;
      return {
        ...proj,
        bullets: proj.bullets.map((bullet, j) => (j === bulletIdx ? value : bullet)),
      };
    }));
  };

  const addProjectBullet = (projIdx: number) => {
    setProjects(projects.map((proj, i) => i === projIdx ? { ...proj, bullets: [...proj.bullets, ""] } : proj));
  };

  const addProject = () => {
    setProjects([...projects, { title: "", description: "", technologies: [], bullets: [""] }]);
  };

  const removeProjectBullet = (projIdx: number, bulletIdx: number) => {
    setProjects(projects.map((proj, i) => {
      if (i !== projIdx) return proj;
      return { ...proj, bullets: proj.bullets.filter((_, j) => j !== bulletIdx) };
    }));
  };

  const updateCertification = (idx: number, value: string) => {
    setCertifications(certifications.map((cert, i) => (i === idx ? value : cert)));
  };

  const addCertification = () => {
    setCertifications([...certifications, ""]);
  };

  const updateAchievement = (idx: number, field: keyof AwardItem, value: string) => {
    setAchievements(achievements.map((ach, i) => i === idx ? { ...ach, [field]: value } : ach));
  };

  const addAchievement = () => {
    setAchievements([...achievements, { title: "", institution: "" }]);
  };

  const updateLanguage = (idx: number, field: keyof LanguageItem, value: string) => {
    setLanguages(languages.map((lang, i) => i === idx ? { ...lang, [field]: value } : lang));
  };

  const addLanguage = () => {
    setLanguages([...languages, { name: "", level: "" }]);
  };

  const updateCustomSectionTitle = (idx: number, title: string) => {
    setCustomSections(customSections.map((s, i) => i === idx ? { ...s, title } : s));
  };
  const addCustomSectionItem = (secIdx: number) => {
    setCustomSections(customSections.map((s, i) => i === secIdx ? { ...s, items: [...s.items, ""] } : s));
  };
  const updateCustomSectionItem = (secIdx: number, itemIdx: number, value: string) => {
    setCustomSections(customSections.map((s, i) => i === secIdx ? { ...s, items: s.items.map((item, j) => j === itemIdx ? value : item) } : s));
  };
  const removeCustomSectionItem = (secIdx: number, itemIdx: number) => {
    setCustomSections(customSections.map((s, i) => i === secIdx ? { ...s, items: s.items.filter((_, j) => j !== itemIdx) } : s));
  };
  const removeCustomSection = (idx: number) => {
    setCustomSections(customSections.filter((_, i) => i !== idx));
  };
  const addCustomSection = () => {
    setCustomSections([...customSections, { title: "New Section", items: [""] }]);
  };

  const [downloading, setDownloading] = useState(false);

  const handleDownloadPDF = useCallback(async () => {
    if (downloading) return;
    setDownloading(true);
    try {
      await generateResumePDF({
        contact, experience, education, skills,
        projects, certifications, achievements, languages,
      }, { ...formatting, fitToOnePage: true, exportMode: formatting.exportMode ?? "compact" });
    } catch (err) {
      console.error("PDF generation failed:", err);
    } finally {
      setDownloading(false);
    }
  }, [downloading, contact, experience, education, skills, projects, certifications, achievements, languages, formatting, fitToOnePage]);

  return (
    <DashboardLayout headerTitle="Resume Builder" hideHeader>
      <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>

        {/* Templates Carousel */}
        <div style={{ borderBottom: "1px solid hsl(var(--border))", padding: "14px 24px", backgroundColor: "hsl(var(--background))" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "hsl(var(--foreground))" }}>Visual Templates</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: "hsl(var(--primary))", backgroundColor: "hsl(var(--primary) / 0.1)", padding: "3px 10px", borderRadius: 10 }}>
                {templates.length} Designs
              </span>
            </div>
            <div style={{ display: "flex", gap: 6 }}>
              <button onClick={() => setTemplateScroll(Math.max(0, templateScroll - 1))} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChevronLeft style={{ width: 13, height: 13 }} />
              </button>
              <button onClick={() => setTemplateScroll(Math.min(templates.length - visibleCount, templateScroll + 1))} style={{ width: 26, height: 26, borderRadius: 6, border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChevronRight style={{ width: 13, height: 13 }} />
              </button>
            </div>
          </div>
          <div style={{ display: "flex", gap: 10, overflow: "hidden" }}>
            {templates.map((tpl, i) => {
              return (
                <div key={i} onClick={() => setSelectedTplIdx(i)} style={{
                  width: 110, height: 74, borderRadius: 8, cursor: "pointer", flexShrink: 0,
                  backgroundColor: tpl.bg, position: "relative", overflow: "hidden",
                  border: selectedTplIdx === i ? "2px solid hsl(var(--primary))" : "1px solid hsl(var(--border))",
                  transform: `translateX(-${templateScroll * 120}px)`, transition: "transform 0.3s",
                }}>
                  <TemplateStripThumbnail tpl={tpl} />
                  <button onClick={() => (document.getElementById("resume-photo-input") as HTMLInputElement | null)?.click()} title="Edit Photo" style={{ position: "absolute", top: 6, right: 6, width: 26, height: 26, borderRadius: 6, border: "1px solid hsl(var(--border))", background: "hsl(var(--secondary))", color: "hsl(var(--muted-foreground))", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>✎</button>
                  <div style={{ position: "absolute", inset: 0, background: tpl.layout === "sidebar-dark" ? "linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.22))" : "linear-gradient(180deg, rgba(255,255,255,0.02), rgba(0,0,0,0.08))" }} />
                  <div style={{ position: "absolute", top: 4, left: 4, right: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontSize: 7, fontWeight: 700, letterSpacing: 0.5, textTransform: "uppercase", color: "#fff", backgroundColor: "rgba(0,0,0,0.38)", padding: "2px 4px", borderRadius: 999 }}>
                      {tpl.category}
                    </span>
                    {tpl.layout === "sidebar-dark" || tpl.layout === "two-col-accent" ? (
                      <span style={{ width: 10, height: 10, borderRadius: "50%", backgroundColor: "rgba(255,255,255,0.85)", border: "1px solid rgba(255,255,255,0.4)" }} />
                    ) : null}
                  </div>
                  <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "4px 5px", backgroundColor: "hsl(var(--background) / 0.88)", fontSize: 7, color: "hsl(var(--foreground))", fontWeight: 600, textAlign: "center" }}>
                    {tpl.name}
                  </div>
                  {selectedTplIdx === i && (
                    <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "2px 4px", backgroundColor: "hsl(var(--background) / 0.85)", fontSize: 7, color: "hsl(var(--foreground))", fontWeight: 600, textAlign: "center" }}>
                      {tpl.name}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Main Editor + Preview */}
        <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

          {/* Left - Editor */}
          <div style={{ width: 380, borderRight: "1px solid hsl(var(--border))", overflowY: "auto", padding: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 18 }}>
              <div>
                <h3 style={{ fontSize: 15, fontWeight: 700, color: "hsl(var(--foreground))", marginBottom: 3 }}>Editor Workspace</h3>
                <p style={{ fontSize: 10, color: "hsl(var(--muted-foreground))" }}>Customize sections and content</p>
              </div>
              <span style={{ fontSize: 9, color: "hsl(var(--muted-foreground))", backgroundColor: "hsl(var(--secondary))", padding: "3px 8px", borderRadius: 4, height: "fit-content", border: "1px solid hsl(var(--border))" }}>Editor</span>
            </div>

            <EditorSection icon={<UserIcon style={{ width: 14, height: 14, color: "hsl(var(--primary))" }} />} title="Personal Information">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                <EditorInput label="Full Name" value={contact.name} onChange={(v) => setContact({ ...contact, name: v })} />
                <EditorInput label="Job Title" value={contact.title} onChange={(v) => setContact({ ...contact, title: v })} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                <EditorInput label="Email" value={contact.email} onChange={(v) => setContact({ ...contact, email: v })} />
                <EditorInput label="Phone" value={contact.phone} onChange={(v) => setContact({ ...contact, phone: normalizePhone(v) })} />
              </div>
              <EditorInput label="GitHub" value={contact.github ?? ""} onChange={(v) => setContact({ ...contact, github: v })} />
              <EditorInput label="LinkedIn" value={contact.linkedin} onChange={(v) => setContact({ ...contact, linkedin: v })} />
              <EditorTextArea label="Bio / Summary" value={contact.summary} onChange={(v) => setContact({ ...contact, summary: v })} />
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginTop: 10 }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", overflow: "hidden", border: "1px solid hsl(var(--border))", background: "hsl(var(--secondary))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {contact.photo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={contact.photo} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ fontSize: 18, fontWeight: 700, color: "hsl(var(--muted-foreground))" }}>{(contact.name || "?").split(" ").map(s => s[0] || "").slice(0,2).join("")}</div>
                  )}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <input id="resume-photo-input" ref={photoInputRef} type="file" accept="image/*" style={{ display: "none" }} onChange={(e) => handlePhotoFile(e.target.files?.[0] ?? null)} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => photoInputRef.current?.click()} style={{ padding: "7px 10px", borderRadius: 8, background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", cursor: "pointer" }}>Change Photo</button>
                    <button onClick={() => setContact((c) => ({ ...c, photo: "" }))} style={{ padding: "7px 10px", borderRadius: 8, background: "none", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))", cursor: "pointer" }}>Remove</button>
                  </div>
                  <div style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>Add a square headshot for templates that show photos.</div>
                </div>
              </div>
            </EditorSection>

            <EditorSection icon={<Briefcase style={{ width: 14, height: 14, color: "hsl(var(--primary))" }} />} title="Work Experience">
              {experience.map((exp, i) => (
                <div key={i} style={{ marginBottom: 12 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 8 }}>
                    <EditorInput label="Title" value={exp.title} onChange={(v) => updateExp(i, "title", v)} />
                    <EditorInput label="Company" value={exp.company} onChange={(v) => updateExp(i, "company", v)} />
                  </div>
                  <EditorInput label="Period" value={exp.period} onChange={(v) => updateExp(i, "period", v)} />
                  <div style={{ marginTop: 6 }}>
                    {exp.bullets.map((b, j) => (
                      <div key={j} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 6 }}>
                        <input
                          value={b}
                          onChange={(e) => updateExpBullet(i, j, e.target.value)}
                          placeholder="Experience bullet"
                          style={{
                            flex: 1,
                            padding: "7px 9px",
                            borderRadius: 5,
                            backgroundColor: "hsl(var(--secondary))",
                            border: "1px solid hsl(var(--border))",
                            color: "hsl(var(--foreground))",
                            fontSize: 11,
                            outline: "none",
                          }}
                        />
                        <button onClick={() => removeExpBullet(i, j)} style={{ background: "none", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))", cursor: "pointer", padding: "6px 8px", borderRadius: 6 }}>x</button>
                      </div>
                    ))}
                    <button onClick={() => addExpBullet(i)} style={{ marginTop: 6, width: "100%", padding: "7px 9px", borderRadius: 6, backgroundColor: "hsl(var(--card))", border: "1px dashed hsl(var(--border))", color: "hsl(var(--foreground))", fontSize: 10, cursor: "pointer" }}>
                      + Add Bullet
                    </button>
                  </div>
                </div>
              ))}
              <button onClick={addExperience} style={{
                width: "100%", padding: "9px", borderRadius: 8, backgroundColor: "hsl(var(--secondary))",
                border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontSize: 11, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
              }}>
                <Plus style={{ width: 11, height: 11 }} /> Add Experience
              </button>
            </EditorSection>

            <EditorSection icon={<Wrench style={{ width: 14, height: 14, color: "hsl(var(--primary))" }} />} title="Technical Skills" onAdd={addSkillGroup}>
              {skills.length === 0 ? (
                <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", lineHeight: 1.5 }}>
                  No skill groups yet. Click the plus icon to add one.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {skills.map((group, gi) => (
                    <div key={gi} style={{ border: "1px solid hsl(var(--border))", borderRadius: 8, padding: 10, backgroundColor: "hsl(var(--secondary) / 0.22)" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                        <div style={{ flex: 1 }}>
                          <EditorInput label="Category" value={group.category} onChange={(v) => updateSkillGroup(gi, "category", v)} />
                        </div>
                        <button
                          onClick={() => removeSkillGroup(gi)}
                          style={{
                            background: "none", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))",
                            cursor: "pointer", padding: "6px 8px", borderRadius: 6, alignSelf: "flex-end",
                          }}
                        >
                          <X style={{ width: 10, height: 10 }} />
                        </button>
                      </div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
                        {group.items.map((skill, si) => (
                          <div key={`${gi}-${si}`} style={{
                            display: "inline-flex", alignItems: "center", gap: 5,
                            padding: "4px 9px", borderRadius: 5,
                            backgroundColor: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))",
                          }}>
                            <input
                              value={skill}
                              onChange={(e) => updateSkillItem(gi, si, e.target.value)}
                              style={{
                                width: Math.max(70, skill.length * 8 + 24), minWidth: 70, background: "transparent",
                                border: "none", outline: "none", color: "hsl(var(--foreground))", fontSize: 10,
                              }}
                            />
                            <button onClick={() => removeSkill(gi, si)} style={{ background: "none", border: "none", color: "hsl(var(--muted-foreground))", cursor: "pointer", padding: 0, display: "flex" }}>
                              <X style={{ width: 9, height: 9 }} />
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        onClick={() => addSkillItem(gi)}
                        style={{
                          width: "100%", padding: "7px 9px", borderRadius: 6, backgroundColor: "hsl(var(--card))",
                          border: "1px dashed hsl(var(--border))", color: "hsl(var(--foreground))", fontSize: 10, cursor: "pointer",
                        }}
                      >
                        + Add Skill
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </EditorSection>

            <EditorSection icon={<GraduationCap style={{ width: 14, height: 14, color: "hsl(var(--primary))" }} />} title="Education" onAdd={addEducation}>
              {education.length === 0 ? (
                <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", lineHeight: 1.5 }}>
                  No education entries yet. Click the plus icon to add one.
                </p>
              ) : education.map((edu, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 10, paddingBottom: 10, borderBottom: i === education.length - 1 ? "none" : "1px solid hsl(var(--border))" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "start" }}>
                    <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                      <EditorInput label="Degree" value={edu.degree} onChange={(v) => updateEducation(i, "degree", v)} />
                      <EditorInput label="School" value={edu.school} onChange={(v) => updateEducation(i, "school", v)} />
                    </div>
                    <button
                      onClick={() => removeEducation(i)}
                      style={{
                        background: "none", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))",
                        cursor: "pointer", padding: "6px 8px", borderRadius: 6,
                      }}
                    >
                      <X style={{ width: 10, height: 10 }} />
                    </button>
                  </div>
                  <EditorInput label="Year" value={edu.year} onChange={(v) => updateEducation(i, "year", v)} />
                </div>
              ))}
            </EditorSection>

            <EditorSection icon={<Sparkles style={{ width: 14, height: 14, color: "hsl(var(--primary))" }} />} title="Projects" onAdd={addProject}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {projects.length === 0 ? (
                  <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", lineHeight: 1.5 }}>
                    No projects yet. Click the plus icon to add one.
                  </p>
                ) : projects.map((proj, i) => (
                  <div key={i} style={{ marginBottom: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "start" }}>
                      <div style={{ flex: 1 }}>
                        <EditorInput label="Project Title" value={proj.title} onChange={(v) => updateProject(i, "title", v)} />
                      </div>
                      <button onClick={() => setProjects(projects.filter((_, pi) => pi !== i))} style={{ background: "none", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))", cursor: "pointer", padding: "6px 8px", borderRadius: 6 }}>
                        <X style={{ width: 10, height: 10 }} />
                      </button>
                    </div>
                    <EditorInput label="Description" value={proj.description} onChange={(v) => updateProject(i, "description", v)} />
                    <EditorInput label="Technologies (comma separated)" value={(proj.technologies ?? []).join(", ")} onChange={(v) => updateProject(i, "technologies", v.split(",").map((item) => item.trim()).filter(Boolean))} />
                    {proj.bullets.map((b, j) => (
                      <div key={j} style={{ display: "flex", gap: 6, alignItems: "flex-start", marginBottom: 6 }}>
                        <input
                          value={b}
                          onChange={(e) => updateProjectBullet(i, j, e.target.value)}
                          placeholder="Project bullet"
                          style={{
                            flex: 1,
                            padding: "7px 9px",
                            borderRadius: 5,
                            backgroundColor: "hsl(var(--secondary))",
                            border: "1px solid hsl(var(--border))",
                            color: "hsl(var(--foreground))",
                            fontSize: 11,
                            outline: "none",
                          }}
                        />
                        <button onClick={() => removeProjectBullet(i, j)} style={{ background: "none", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))", cursor: "pointer", padding: "6px 8px", borderRadius: 6 }}>x</button>
                      </div>
                    ))}
                    <button onClick={() => addProjectBullet(i)} style={{ marginTop: 6, width: "100%", padding: "7px 9px", borderRadius: 6, backgroundColor: "hsl(var(--card))", border: "1px dashed hsl(var(--border))", color: "hsl(var(--foreground))", fontSize: 10, cursor: "pointer" }}>
                      + Add Bullet
                    </button>
                  </div>
                ))}
              </div>
            </EditorSection>

            <EditorSection icon={<GraduationCap style={{ width: 14, height: 14, color: "hsl(var(--primary))" }} />} title="Certifications" onAdd={addCertification}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {certifications.length === 0 ? (
                  <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", lineHeight: 1.5 }}>
                    No certifications yet. Click the plus icon to add one.
                  </p>
                ) : certifications.map((cert, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input
                      value={cert}
                      onChange={(e) => updateCertification(i, e.target.value)}
                      style={{
                        flex: 1,
                        padding: "7px 9px",
                        borderRadius: 5,
                        backgroundColor: "hsl(var(--secondary))",
                        border: "1px solid hsl(var(--border))",
                        color: "hsl(var(--foreground))",
                        fontSize: 11,
                        outline: "none",
                      }}
                    />
                    <button onClick={() => setCertifications(certifications.filter((_, ci) => ci !== i))} style={{ background: "none", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))", cursor: "pointer", padding: "6px 8px", borderRadius: 6 }}>
                      x
                    </button>
                  </div>
                ))}
              </div>
            </EditorSection>

            <EditorSection icon={<Sparkles style={{ width: 14, height: 14, color: "hsl(var(--primary))" }} />} title="Achievements & Awards" onAdd={addAchievement}>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                {achievements.length === 0 ? (
                  <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", lineHeight: 1.5 }}>
                    No awards yet. Click the plus icon to add one.
                  </p>
                ) : achievements.map((ach, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 6, alignItems: "center" }}>
                    <input value={ach.title} onChange={(e) => updateAchievement(i, "title", e.target.value)} placeholder="Achievement title" style={{ padding: "7px 9px", borderRadius: 5, backgroundColor: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontSize: 11, outline: "none" }} />
                    <input value={ach.institution ?? ""} onChange={(e) => updateAchievement(i, "institution", e.target.value)} placeholder="Institution" style={{ padding: "7px 9px", borderRadius: 5, backgroundColor: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontSize: 11, outline: "none" }} />
                    <button onClick={() => setAchievements(achievements.filter((_, ai) => ai !== i))} style={{ background: "none", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))", cursor: "pointer", padding: "6px 8px", borderRadius: 6 }}>
                      x
                    </button>
                  </div>
                ))}
              </div>
            </EditorSection>

            <EditorSection icon={<Sparkles style={{ width: 14, height: 14, color: "hsl(var(--primary))" }} />} title="Languages" onAdd={addLanguage}>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {languages.length === 0 ? (
                  <p style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", lineHeight: 1.5 }}>
                    No languages yet. Click the plus icon to add one.
                  </p>
                ) : languages.map((lang, i) => (
                  <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1fr auto", gap: 6, alignItems: "center" }}>
                    <input value={lang.name} onChange={(e) => updateLanguage(i, "name", e.target.value)} placeholder="Language" style={{ padding: "7px 9px", borderRadius: 5, backgroundColor: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontSize: 11, outline: "none" }} />
                    <input value={lang.level ?? ""} onChange={(e) => updateLanguage(i, "level", e.target.value)} placeholder="Level" style={{ padding: "7px 9px", borderRadius: 5, backgroundColor: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontSize: 11, outline: "none" }} />
                    <button onClick={() => setLanguages(languages.filter((_, li) => li !== i))} style={{ background: "none", border: "1px solid hsl(var(--border))", color: "hsl(var(--muted-foreground))", cursor: "pointer", padding: "6px 8px", borderRadius: 6 }}>
                      x
                    </button>
                  </div>
                ))}
              </div>
            </EditorSection>
          </div>

          {/* Right - Preview */}
          <div style={{ flex: 1, display: "flex", flexDirection: "column", backgroundColor: "hsl(var(--card))" }}>
            <div style={{ display: "flex", justifyContent: "flex-end", padding: "10px 20px", gap: 8, borderBottom: "1px solid hsl(var(--border))" }}>
              <button
                onClick={() => setShowPreview(true)}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 18, fontSize: 11, fontWeight: 500, backgroundColor: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", cursor: "pointer" }}
              >
                <Eye style={{ width: 12, height: 12 }} /> Preview
              </button>
              <button
                title="Design"
                onClick={() => setShowDesign((s) => !s)}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", borderRadius: 18, fontSize: 11, fontWeight: 500, backgroundColor: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", cursor: "pointer" }}
              >
                <Wrench style={{ width: 12, height: 12 }} /> Design
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 14px", borderRadius: 18, fontSize: 11, fontWeight: 500, backgroundColor: downloading ? "hsl(var(--border))" : "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", cursor: downloading ? "wait" : "pointer", opacity: downloading ? 0.7 : 1 }}
              >
                {downloading ? <Loader2 style={{ width: 12, height: 12, animation: "spin 1s linear infinite" }} /> : <Download style={{ width: 12, height: 12 }} />}
                {downloading ? "Generating..." : "Export PDF"}
              </button>
            </div>
            
            {showDesign && (
              <div style={{ padding: "10px 18px", borderTop: "1px dashed hsl(var(--border))", display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
                <label style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>Font</label>
                <select
                  value={formatting.fontFamily}
                  onChange={(e) => setFormatting({ ...formatting, fontFamily: e.target.value as FormattingOptions["fontFamily"] })}
                  style={{ padding: "6px 8px", borderRadius: 8, background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                >
                  <option value="system">System</option>
                  <option value="inter">Inter</option>
                  <option value="serif">Times New Roman</option>
                  <option value="playfair">Playfair</option>
                  <option value="helvetica">Helvetica</option>
                  <option value="arial">Arial</option>
                  <option value="montserrat">Montserrat</option>
                  <option value="mono">Monospace</option>
                </select>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <label style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>Name</label>
                  <input type="range" min={18} max={44} value={formatting.nameSize} onChange={(e) => setFormatting({ ...formatting, nameSize: Number(e.target.value) })} />
                  <span style={{ minWidth: 34, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "4px 8px", borderRadius: 6, background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontSize: 12, fontWeight: 700 }}>{formatting.nameSize}</span>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <label style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>Section Headers</label>
                  <select value={formatting.sectionHeaderSize} onChange={(e) => setFormatting({ ...formatting, sectionHeaderSize: Number(e.target.value) })} style={{ padding: "6px 8px", borderRadius: 8, background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}>
                    {[10,11,12,13,14,15,16,17,18].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <label style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>Title</label>
                  <input type="range" min={12} max={22} value={formatting.titleSize} onChange={(e) => setFormatting({ ...formatting, titleSize: Number(e.target.value) })} />
                  <span style={{ minWidth: 34, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "4px 8px", borderRadius: 6, background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontSize: 12, fontWeight: 700 }}>{formatting.titleSize}</span>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <label style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>Sub-Headers</label>
                  <select value={formatting.subHeaderSize} onChange={(e) => setFormatting({ ...formatting, subHeaderSize: Number(e.target.value) })} style={{ padding: "6px 8px", borderRadius: 8, background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}>
                    {[8,9,10,11,12,13,14].map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <label style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>Body</label>
                  <input type="range" min={12} max={20} value={formatting.bodySize} onChange={(e) => setFormatting({ ...formatting, bodySize: Number(e.target.value) })} />
                  <span style={{ minWidth: 34, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "4px 8px", borderRadius: 6, background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontSize: 12, fontWeight: 700 }}>{formatting.bodySize}</span>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <label style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>Line</label>
                  <input type="range" min={11} max={20} value={Math.round((formatting.lineHeight ?? 1.45) * 10)} onChange={(e) => setFormatting({ ...formatting, lineHeight: Number(e.target.value) / 10 })} />
                  <span style={{ minWidth: 44, display: "inline-flex", alignItems: "center", justifyContent: "center", padding: "4px 8px", borderRadius: 6, background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontSize: 12, fontWeight: 700 }}>{(formatting.lineHeight ?? 1.45).toFixed(2)}</span>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <label style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>Fit to one page</label>
                  <input type="checkbox" checked={fitToOnePage} onChange={(e) => setFitToOnePage(e.target.checked)} />
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <label style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>Export</label>
                  <div style={{ display: "inline-flex", gap: 4, padding: 4, borderRadius: 999, background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))" }}>
                    <button
                      onClick={() => setFormatting({ ...formatting, exportMode: "compact" })}
                      style={{ padding: "5px 10px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: (formatting.exportMode ?? "compact") === "compact" ? "hsl(var(--primary))" : "transparent", color: (formatting.exportMode ?? "compact") === "compact" ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))" }}
                    >
                      Compact
                    </button>
                    <button
                      onClick={() => setFormatting({ ...formatting, exportMode: "standard" })}
                      style={{ padding: "5px 10px", borderRadius: 999, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 600, background: (formatting.exportMode ?? "compact") === "standard" ? "hsl(var(--primary))" : "transparent", color: (formatting.exportMode ?? "compact") === "standard" ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))" }}
                    >
                      Standard
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <label style={{ fontSize: 11, color: "hsl(var(--muted-foreground))" }}>Link style</label>
                  <select
                    value={formatting.linkDisplay ?? "text"}
                    onChange={(e) => setFormatting({ ...formatting, linkDisplay: e.target.value as "text" | "icon" | "hidden" })}
                    style={{ padding: "6px 8px", borderRadius: 8, background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}
                  >
                    <option value="text">Visible text</option>
                    <option value="icon">Icon only</option>
                    <option value="hidden">Hidden background link</option>
                  </select>
                </div>

                <button onClick={() => { setFormatting({ fontFamily: "system", nameSize: 26, titleSize: 16, bodySize: 16, lineHeight: 1.45, exportMode: "compact", linkDisplay: "text" }); try { localStorage.removeItem("resume_formatting"); sessionStorage.removeItem("resume_formatting"); } catch(e){} }} style={{ marginLeft: 8, padding: "6px 10px", borderRadius: 8, background: "none", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))" }}>Reset</button>
              </div>
            )}
            <div ref={containerRef} style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "24px 12px", overflowY: "auto", overflowX: "hidden" }}>
              <div style={{ transform: `scale(${liveScale})`, transformOrigin: "top center", transition: "transform 160ms ease" }}>
                <div ref={printRef} id="resume-print-area" style={{ borderRadius: 4, boxShadow: "0 8px 40px hsl(var(--background) / 0.45)", overflow: "visible" }}>
                  <ResumePreview
                    contact={contact}
                    experience={experience}
                    education={education}
                    skills={skills}
                    tpl={currentTpl}
                    linkedin={contact.linkedin}
                    projects={projects}
                    certificates={certifications}
                    awards={achievements}
                    languages={languages}
                    formatting={formatting}
                  />
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid hsl(var(--border))", padding: "12px 24px", display: "flex", justifyContent: "center", gap: 12 }}>
              <button
                onClick={() => router.push("/resume-analysis")}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 22,
                  backgroundColor: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontSize: 12, fontWeight: 500, cursor: "pointer",
                }}
              >
                <Sparkles style={{ width: 14, height: 14, color: "hsl(var(--primary))" }} /> RE-RUN ATS CHECK
              </button>
              <button
                onClick={() => router.push("/job-matches")}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 22,
                  backgroundColor: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", color: "hsl(var(--foreground))", fontSize: 12, fontWeight: 500, cursor: "pointer",
                }}
              >
                <Sparkles style={{ width: 14, height: 14, color: "hsl(var(--primary))" }} /> JOB RECOMMENDATION
              </button>
            </div>
          </div>
        </div>
      </div>
      {showPreview && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            backgroundColor: "hsl(var(--background) / 0.92)",
            display: "flex", flexDirection: "column",
          }}
        >
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "12px 24px", borderBottom: "1px solid hsl(var(--border))",
          }}>
            <span style={{ fontSize: 14, fontWeight: 600, color: "hsl(var(--foreground))" }}>Resume Preview</span>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", backgroundColor: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", padding: "5px 10px", borderRadius: 999 }}>
                A4 • {previewPageCount} page{previewPageCount > 1 ? "s" : ""}
              </span>
              <button
                onClick={() => setPreviewZoom((z) => Math.max(0.3, z - 0.1))}
                style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", borderRadius: 8, padding: "6px 8px", color: "hsl(var(--foreground))", cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <ZoomOut style={{ width: 14, height: 14 }} />
              </button>
              <span style={{ fontSize: 11, color: "hsl(var(--muted-foreground))", minWidth: 40, textAlign: "center" }}>{Math.round(previewZoom * 100)}%</span>
              <button
                onClick={() => setPreviewZoom((z) => Math.min(1.5, z + 0.1))}
                style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", borderRadius: 8, padding: "6px 8px", color: "hsl(var(--foreground))", cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <ZoomIn style={{ width: 14, height: 14 }} />
              </button>
              <button
                onClick={() => window.print()}
                style={{ background: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))", borderRadius: 8, padding: "6px 10px", color: "hsl(var(--foreground))", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 11 }}
              >
                <Printer style={{ width: 13, height: 13 }} /> Print
              </button>
              <button
                onClick={() => { setShowPreview(false); setTimeout(() => handleDownloadPDF(), 200); }}
                style={{ background: "hsl(var(--primary))", border: "none", borderRadius: 8, padding: "6px 14px", color: "hsl(var(--primary-foreground))", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, fontSize: 11, fontWeight: 600 }}
              >
                <Download style={{ width: 13, height: 13 }} /> Download PDF
              </button>
              <button
                onClick={() => setShowPreview(false)}
                style={{ background: "none", border: "1px solid hsl(var(--border))", borderRadius: 8, padding: "6px 8px", color: "hsl(var(--foreground))", cursor: "pointer", display: "flex", alignItems: "center" }}
              >
                <X style={{ width: 16, height: 16 }} />
              </button>
            </div>
          </div>

          <div ref={previewModalRef} style={{ flex: 1, overflowY: "auto", display: "flex", justifyContent: "center", alignItems: "flex-start", padding: "24px 12px" }}>
            <div style={{ transform: `scale(${previewModalScale})`, transformOrigin: "top center" }}>
              <div style={{ margin: "0 auto 8px", width: A4_PREVIEW_W, textAlign: "right", fontSize: 11, color: "hsl(var(--muted-foreground))" }}>
                A4 {A4_PREVIEW_W} × {A4_PREVIEW_H}px
              </div>
              <div ref={previewSheetRef} style={{ width: A4_PREVIEW_W, minHeight: A4_PREVIEW_H, backgroundColor: "#fff", boxSizing: "border-box", boxShadow: "0 12px 60px hsl(var(--background) / 0.55)", borderRadius: 4, overflow: "visible" }}>
                <ResumePreview
                  contact={contact}
                  experience={experience}
                  education={education}
                  skills={skills}
                  tpl={currentTpl}
                  linkedin={contact.linkedin}
                  projects={projects}
                  certificates={certifications}
                  awards={achievements}
                  languages={languages}
                  formatting={formatting}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function EditorSection({ icon, title, children, onAdd }: { icon: React.ReactNode; title: string; children: React.ReactNode; onAdd?: () => void }) {
  return (
    <div style={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 10, padding: 14, marginBottom: 10 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
          {icon}
          <span style={{ fontSize: 12, fontWeight: 600, color: "hsl(var(--foreground))" }}>{title}</span>
        </div>
        <div style={{ display: "flex", gap: 5 }}>
          <button onClick={onAdd} style={{ background: "none", border: "none", color: "hsl(var(--muted-foreground))", cursor: onAdd ? "pointer" : "default", padding: 0 }}><Plus style={{ width: 13, height: 13 }} /></button>
          <button style={{ background: "none", border: "none", color: "hsl(var(--muted-foreground))", cursor: "pointer", padding: 0 }}><MoreVertical style={{ width: 13, height: 13 }} /></button>
        </div>
      </div>
      {children}
    </div>
  );
}

function EditorInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ fontSize: 8, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 3 }}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} style={{
        width: "100%", padding: "7px 9px", borderRadius: 5,
        backgroundColor: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))",
        color: "hsl(var(--foreground))", fontSize: 11, outline: "none",
      }} />
    </div>
  );
}

function EditorTextArea({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <label style={{ fontSize: 8, color: "hsl(var(--muted-foreground))", textTransform: "uppercase", letterSpacing: 0.5, display: "block", marginBottom: 3 }}>{label}</label>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} style={{
        width: "100%", padding: "7px 9px", borderRadius: 5,
        backgroundColor: "hsl(var(--secondary))", border: "1px solid hsl(var(--border))",
        color: "hsl(var(--foreground))", fontSize: 11, outline: "none", resize: "none", lineHeight: 1.5,
      }} />
    </div>
  );
}
