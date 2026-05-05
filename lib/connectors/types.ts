export type ConnectorInput = {
  jobUrl: string;
  fullName?: string;
  email?: string;
  phone?: string;
  resumeText: string;
  coverLetterText: string;
  answers: string;
};

export type ConnectorResult = {
  status: "SUBMITTED" | "NEEDS_USER_ACTION" | "UNSUPPORTED" | "FAILED";
  platform: "greenhouse" | "lever" | "ashby" | "workday" | "dayforce" | "linkedin" | "unknown";
  notes: string;
  nextUrl?: string;
};

export function detectPlatform(url: string): ConnectorResult["platform"] {
  const lower = url.toLowerCase();
  if (lower.includes("greenhouse.io")) return "greenhouse";
  if (lower.includes("lever.co")) return "lever";
  if (lower.includes("ashbyhq.com")) return "ashby";
  if (lower.includes("workdayjobs.com") || lower.includes("myworkdayjobs.com")) return "workday";
  if (lower.includes("dayforcehcm.com")) return "dayforce";
  if (lower.includes("linkedin.com")) return "linkedin";
  return "unknown";
}
