import { getClient, getModel, parseGroqResponse } from "./groq";

export interface Trip {
  from: string;
  to: string;
  days?: number;
}

export interface AbsenceSummary {
  totalDaysAbsent: number;
  breakdown: Trip[];
}

export interface ChecklistResult {
  checklist: string[];
  warnings: string[];
}

export interface ImmigrationAIResponse {
  coverLetter: string;
  summary: {
    route: string;
    topRisks: string[];
    nextSteps: string[];
  };
}

export interface PropertyAIResponse {
  verdict: string;
  keyPoints: string[];
  assumptions: string[];
  improvements: string[];
}

export interface ImmigrationPayload {
  input: any;
  baseLetter: string;
  checklist: string[];
  warnings: string[];
  absenceSummary: AbsenceSummary;
}

export interface PropertyPayload {
  [key: string]: any;
}

export function calculateAbsences(trips: Trip[] = []): AbsenceSummary {
  function daysBetweenInclusive(from: string, to: string): number {
    const a = new Date(from);
    const b = new Date(to);
    const ms = b.getTime() - a.getTime();
    const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(0, days);
  }
  let total = 0;
  const breakdown = trips.map((t) => {
    const d = daysBetweenInclusive(t.from, t.to);
    total += d;
    return { ...t, days: d };
  });
  return { totalDaysAbsent: total, breakdown };
}

export function generateImmigrationChecklist(route: string, answers: Record<string, any>): ChecklistResult {
  const base = [
    "Passport(s) + current status (BRP/eVisa if applicable)",
    "Proof of relationship (e.g., marriage certificate if relevant)",
    "Proof of accommodation (tenancy/mortgage + council tax/utility)",
    "Bank statements (typically 6 months) matching payslips",
    "Payslips (typically 6 months) + employer letter"
  ];
  const routeExtras: Record<string, string[]> = {
    spouse: ["Sponsor's British passport / settled status proof"],
    "flr-m": ["Previous UKVI decision letters (if any)"],
    ilr: ["Full travel history + absence calculation", "Life in the UK pass proof (if required)"]
  };
  const extras = routeExtras[(route || "").toLowerCase()] || [];
  const warnings: string[] = [];
  if (!answers?.incomeProof) warnings.push("Income proof details are missing (payslips/bank statements).");
  if (!answers?.addressProof) warnings.push("Accommodation evidence not specified (tenancy/mortgage + bills).");
  return { checklist: [...base, ...extras], warnings };
}

export function draftCoverLetter({
  route,
  applicantName,
  partnerName,
  answers,
  checklist,
  warnings,
  absenceSummary
}: {
  route: string;
  applicantName: string;
  partnerName?: string;
  answers: Record<string, any>;
  checklist: string[];
  warnings: string[];
  absenceSummary?: AbsenceSummary;
}): string {
  const parts: string[] = [];
  parts.push("To Whom It May Concern,");
  parts.push("");
  parts.push(`Re: ${String(route).toUpperCase()} application for ${applicantName}${partnerName ? ` (partner: ${partnerName})` : ""}.`);
  parts.push("");
  parts.push("I am submitting this application with the supporting evidence listed below. The information provided is true and accurate to the best of my knowledge.");
  parts.push("");
  parts.push("Key details provided:");
  for (const [k, v] of Object.entries(answers || {})) {
    const val = typeof v === "string" ? v : JSON.stringify(v);
    parts.push(`- ${k}: ${val}`);
  }
  parts.push("");
  if (absenceSummary?.totalDaysAbsent != null) {
    parts.push(`Travel/absence summary: total days absent = ${absenceSummary.totalDaysAbsent}.`);
    parts.push("");
  }
  parts.push("Documents included:");
  checklist.forEach((d) => parts.push(`- ${d}`));
  if (warnings?.length) {
    parts.push("");
    parts.push("Notes / items to double-check:");
    warnings.forEach((w) => parts.push(`- ${w}`));
  }
  parts.push("");
  parts.push("Yours faithfully,");
  parts.push(applicantName);
  return parts.join("\n");
}

export async function runImmigrationAI(payload: ImmigrationPayload): Promise<ImmigrationAIResponse> {
  const client = getClient();
  const model = getModel();

  const sys = `You are a UK immigration application assistant.
Rewrite the cover letter to be clear, professional, and concise.
Keep all facts. Do not invent documents. If something is missing, keep it as a "to be added" note.
Return JSON:
{
  "coverLetter": "...",
  "summary": {
    "route": "...",
    "topRisks": ["..."],
    "nextSteps": ["..."]
  }
}`;

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: sys },
      { role: "user", content: JSON.stringify(payload) }
    ]
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No content received from Groq");
  }
  return parseGroqResponse(content);
}

export function monthlyMortgagePayment(principal: number, annualRatePercent: number, termYears: number): number {
  const r = (annualRatePercent / 100) / 12;
  const n = termYears * 12;
  if (r === 0) return principal / n;
  return principal * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
}

export function round2(x: number): number {
  return Math.round((x + Number.EPSILON) * 100) / 100;
}

export async function runPropertyAI(payload: PropertyPayload): Promise<PropertyAIResponse> {
  const client = getClient();
  const model = getModel();

  const sys = `You are a UK property deal analyst.
Explain the deal numbers clearly and briefly.
Do not invent taxes/laws. If user didn't provide something, say it's not included.
Return JSON: { "verdict": "...", "keyPoints": ["..."], "assumptions": ["..."], "improvements": ["..."] }`;

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: "system", content: sys },
      { role: "user", content: JSON.stringify(payload) }
    ]
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error("No content received from Groq");
  }
  return parseGroqResponse(content);
}
