import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { openai } from "@/lib/openai";
import { resumePrompt, coverLetterPrompt, answersPrompt } from "@/lib/prompts";

export async function POST(_: Request, { params }: { params: { id: string } }) {
  const app = await prisma.application.findUniqueOrThrow({
    where: { id: params.id },
    include: {
      job: true,
      user: {
        include: {
          profile: true,
          resumes: { orderBy: { createdAt: "desc" }, take: 1 }
        }
      }
    }
  });

  const profile = app.user.profile;
  const currentResume = app.user.resumes[0]?.content || profile?.background || "";
  const candidateBackground = profile?.background || "";

  const [resume, coverLetter, answers] = await Promise.all([
    generateText(resumePrompt({
      candidateBackground,
      currentResume,
      jobDescription: app.job.description
    })),
    generateText(coverLetterPrompt({
      candidateBackground,
      currentResume,
      jobDescription: app.job.description,
      companyName: app.job.companyName
    })),
    generateText(answersPrompt({
      candidateBackground,
      currentResume,
      jobDescription: app.job.description,
      questions: profile?.genericAnswers || "Standard job application questions"
    }))
  ]);

  const updated = await prisma.application.update({
    where: { id: app.id },
    data: {
      tailoredResume: resume,
      coverLetter,
      generatedAnswers: answers,
      status: "READY_FOR_REVIEW"
    }
  });

  return NextResponse.json({ application: updated });
}

async function generateText(prompt: string) {
  if (!process.env.OPENAI_API_KEY) {
    return "OPENAI_API_KEY missing. Add it to .env and regenerate.";
  }

  const result = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a careful AI job application assistant. Never invent facts." },
      { role: "user", content: prompt }
    ],
    temperature: 0.4
  });

  return result.choices[0]?.message?.content || "";
}
