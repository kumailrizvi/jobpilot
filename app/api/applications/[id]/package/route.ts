import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const app = await prisma.application.findUniqueOrThrow({
    where: { id: params.id },
    include: {
      job: true,
      user: { include: { profile: true } }
    }
  });

  return NextResponse.json({
    companyName: app.job.companyName,
    jobTitle: app.job.title,
    jobUrl: app.job.sourceUrl,
    coverLetter: app.coverLetter,
    answers: app.generatedAnswers,
    resume: app.tailoredResume,
    profile: {
      background: app.user.profile?.background,
      workAuthorization: app.user.profile?.workAuthorization,
      genericAnswers: app.user.profile?.genericAnswers
    }
  });
}
