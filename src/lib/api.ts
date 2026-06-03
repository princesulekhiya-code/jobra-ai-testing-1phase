const API_BASE = "/api/backend";

function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 60000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  return fetch(url, { ...options, signal: controller.signal }).finally(() => clearTimeout(timer));
}

export interface ResumeHealth {
  Content_Percent: number;
  ATS_Parse_Rate: string;
  Quantifying_Impact: string;
  Repetition: string;
  Spelling_Grammar: string;
}

export interface ScoreBreakdown {
  FORMAT: number;
  SKILLS: number;
  EXPERIENCE: number;
  EDUCATION: number;
}

export interface ATSAnalysis {
  ATS_Score: number;
  Resume_Positioning?: string;
  Resume_Health_Label?: string;
  Summary: string;
  Resume_Health?: ResumeHealth;
  Suggestions_for_Improvement: string[];
  Score_Breakdown: ScoreBreakdown;
  Missing_Keywords: string[] | Record<string, number>;
  Achievements_or_Certifications: string[];
  Resume_Strength: string[];
  Key_Skills: string[];
  Repeated_Word_Frequency: Record<string, number>;
  Word_Replacement_Suggestions: string[];
}

export interface RoleItem {
  id: string;
  title: string;
  skills?: string[];
}

export interface RolesResponse {
  roles: RoleItem[];
}

export async function fetchRoles(): Promise<RolesResponse> {
  const res = await fetchWithTimeout(`${API_BASE}/roles`, {}, 30000);
  if (!res.ok) throw new Error("Failed to fetch roles");
  const data = await res.json();
  if (Array.isArray(data)) return { roles: data };
  return data;
}

export async function analyzeGeneral(file: File): Promise<ATSAnalysis> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("without_jd_engine", "default");
  console.log("[analyzeGeneral] POST", `${API_BASE}/analyse/general`, { fileName: file.name, size: file.size, type: file.type });
  const res = await fetchWithTimeout(`${API_BASE}/analyse/general`, { method: "POST", body: formData }, 180000);
  console.log("[analyzeGeneral] Response status:", res.status, res.statusText);
  if (!res.ok) {
    const text = await res.text();
    console.error("[analyzeGeneral] Error status:", res.status, "body:", text);
    let detail = "Analysis failed";
    try { detail = JSON.parse(text).detail || detail; } catch { detail = text || detail; }
    throw new Error(detail);
  }
  const raw = await res.json();
  console.log("[analyzeGeneral] Raw response:", raw);
  return normalizeAnalysis(raw);
}

export async function analyzeWithRole(file: File, roleId: string): Promise<ATSAnalysis> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("role", roleId);
  const res = await fetchWithTimeout(`${API_BASE}/analyse/with-role`, { method: "POST", body: formData }, 180000);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Analysis failed");
  }
  return normalizeAnalysis(await res.json());
}

export async function analyzeWithJD(file: File, jobDescription: string, roleId?: string): Promise<ATSAnalysis> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("job_description", jobDescription);
  if (roleId) formData.append("role", roleId);
  const res = await fetchWithTimeout(`${API_BASE}/analyse/with-jd`, { method: "POST", body: formData }, 180000);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Analysis failed");
  }
  return normalizeAnalysis(await res.json());
}

function parseBreakdownValue(v: unknown): number {
  if (typeof v === "number") return Math.max(0, Math.min(100, Math.round(v)));
  const s = String(v ?? "0").replace("%", "").trim();
  const n = parseInt(s, 10);
  return isNaN(n) ? 0 : Math.max(0, Math.min(100, n));
}

function normalizeAnalysis(raw: Record<string, unknown>): ATSAnalysis {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((raw as any)?.error) throw new Error((raw as any).error);
  if (!raw?.ATS_Score && raw?.ATS_Score !== 0) {
    throw new Error("Analysis failed. Invalid response from server");
  }

  const bd = (raw.Score_Breakdown ?? {}) as Record<string, unknown>;
  const normalizedBreakdown: ScoreBreakdown = {
    FORMAT: parseBreakdownValue(bd.FORMAT),
    SKILLS: parseBreakdownValue(bd.SKILLS),
    EXPERIENCE: parseBreakdownValue(bd.EXPERIENCE),
    EDUCATION: parseBreakdownValue(bd.EDUCATION ?? bd.COMPLETENESS),
  };

  let missingKeywords: string[];
  const mk = raw.Missing_Keywords;
  if (Array.isArray(mk)) {
    missingKeywords = mk.map(String);
  } else if (mk && typeof mk === "object") {
    missingKeywords = Object.entries(mk as Record<string, number>)
      .filter(([, count]) => count > 0)
      .map(([section, count]) => `You have about ${count} missing keywords in the ${section.toLowerCase()} section.`);
  } else {
    missingKeywords = [];
  }

  return {
    ATS_Score: Number(raw.ATS_Score) || 0,
    Resume_Positioning: raw.Resume_Positioning ? String(raw.Resume_Positioning) : undefined,
    Resume_Health_Label: raw.Resume_Health_Label ? String(raw.Resume_Health_Label) : undefined,
    Summary: String(raw.Summary ?? ""),
    Resume_Health: raw.Resume_Health as ResumeHealth | undefined,
    Suggestions_for_Improvement: toArray(raw.Suggestions_for_Improvement as string | string[]),
    Score_Breakdown: normalizedBreakdown,
    Missing_Keywords: missingKeywords,
    Achievements_or_Certifications: toArray(raw.Achievements_or_Certifications as string | string[]),
    Resume_Strength: toArray(raw.Resume_Strength as string | string[]),
    Key_Skills: toArray(raw.Key_Skills as string | string[]),
    Repeated_Word_Frequency: (raw.Repeated_Word_Frequency ?? {}) as Record<string, number>,
    Word_Replacement_Suggestions: toArray(raw.Word_Replacement_Suggestions as string | string[]),
  };
}

export function toArray(val: string | string[] | undefined): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return [val];
}

export interface WorkExperienceEntry {
  Job_Title: string;
  Company: string;
  Dates: string;
  Description: string;
}

export interface UpgradeResult {
  Professional_Summary: string;
  Work_Experience: WorkExperienceEntry[];
  Skills: Record<string, string[]>;
  Education: string[];
  Certifications: string[];
}

export async function upgradeResume(
  file: File,
  choiceId: 1 | 2 | 3 = 1,
  role?: string,
  jobDescription?: string,
): Promise<UpgradeResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("choice_id", String(choiceId));
  if (role) formData.append("role", role);
  if (jobDescription) formData.append("job_description", jobDescription);

  const res = await fetchWithTimeout(
    `${API_BASE}/analyse/upgrade`,
    { method: "POST", body: formData },
    180000,
  );
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Resume upgrade failed");
  }
  return res.json();
}

export interface JobItem {
  id: string;
  title: string;
  company: string;
  location?: string;
  salary?: string;
  posted?: string;
  match?: number;
  remote?: boolean;
  description?: string;
  skills?: string[];
}

export interface JobsResponse {
  jobs: JobItem[];
  total?: number;
}

export async function fetchJobs(params: { q?: string; page?: number; per_page?: number } = {}): Promise<JobsResponse> {
  const url = new URL(`${API_BASE}/jobs`);
  if (params.q) url.searchParams.set("q", params.q);
  if (params.page) url.searchParams.set("page", String(params.page));
  if (params.per_page) url.searchParams.set("per_page", String(params.per_page));

  const res = await fetchWithTimeout(url.toString(), {}, 30000);
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "Failed to fetch jobs");
  }
  const data = await res.json();
  // Normalize common shapes: either { jobs: [...] } or an array
  if (Array.isArray(data)) return { jobs: data } as JobsResponse;
  return data as JobsResponse;
}
