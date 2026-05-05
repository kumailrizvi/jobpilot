export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { applyToJob } from "@/lib/applicationAutomation";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const app = await prisma.application.findUniqueOrThrow({
    where: { id: params.id },
    include: { job: true }
  });

  if (app.status !== "APPROVED") {
    return NextResponse.json(
      { error: "User approval required before applying." },
      { status: 400 }
    );
  }

  const result = await applyToJob({
    jobUrl: app.job.sourceUrl || "",
    resumeText: app.tailoredResume || "",
    coverLetterText: app.coverLetter || "",
    answers: app.generatedAnswers || ""
  });

  const status = result.status === "SUBMITTED" ? "SUBMITTED" : "NEEDS_USER_ACTION";

  const updated = await prisma.application.update({
    where: { id: app.id },
    data: {
      status,
      applicationNotes: result.notes
    }
  });

  return NextResponse.json({ application: updated, result });
}
