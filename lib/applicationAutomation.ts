import { routeApplication } from "@/lib/connectors";

export type ApplyResult = {
  status: "SUBMITTED" | "NEEDS_USER_ACTION" | "FAILED";
  notes: string;
  nextUrl?: string;
};

export async function applyToJob(input: {
  jobUrl: string;
  resumeText: string;
  coverLetterText: string;
  answers: string;
}): Promise<ApplyResult> {
  const result = await routeApplication({
    jobUrl: input.jobUrl,
    resumeText: input.resumeText,
    coverLetterText: input.coverLetterText,
    answers: input.answers
  });

  if (result.status === "SUBMITTED") {
    return { status: "SUBMITTED", notes: result.notes, nextUrl: result.nextUrl };
  }

  if (result.status === "FAILED") {
    return { status: "FAILED", notes: result.notes, nextUrl: result.nextUrl };
  }

  return {
    status: "NEEDS_USER_ACTION",
    notes: result.notes,
    nextUrl: result.nextUrl
  };
}
