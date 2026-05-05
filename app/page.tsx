import Link from "next/link";
import { BriefcaseBusiness, FileText, Send, ShieldCheck } from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="rounded-3xl bg-white p-10 shadow-sm border">
          <p className="mb-4 text-sm font-semibold text-slate-500">JobPilot AI MVP</p>
          <h1 className="max-w-3xl text-5xl font-bold tracking-tight">
            Tailored resumes, cover letters, and job applications with user approval.
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-slate-600">
            Upload your profile, add a job description, generate a tailored application, review it, then approve submission.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/dashboard" className="rounded-xl bg-slate-900 px-5 py-3 text-white">
              Open Dashboard
            </Link>
            <Link href="/jobs/new" className="rounded-xl border px-5 py-3">
              Add Job
            </Link>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          {[
            ["Profile", "Candidate background and resume storage", FileText],
            ["Job Parser", "Paste any JD and save it", BriefcaseBusiness],
            ["AI Drafting", "Resume, cover letter, and answers", ShieldCheck],
            ["Apply Flow", "Review before submission", Send]
          ].map(([title, desc, Icon]: any) => (
            <div key={title} className="rounded-2xl bg-white p-6 border shadow-sm">
              <Icon className="mb-4 h-6 w-6" />
              <h3 className="font-semibold">{title}</h3>
              <p className="mt-2 text-sm text-slate-600">{desc}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
