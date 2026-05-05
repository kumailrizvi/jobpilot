import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

async function generatePackage(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  const res = await fetch(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/applications/${id}/generate`, {
    method: "POST"
  });
  if (!res.ok) throw new Error("Failed to generate package");
  redirect(`/applications/${id}`);
}

async function approveApplication(formData: FormData) {
  "use server";
  const id = String(formData.get("id"));
  await prisma.application.update({
    where: { id },
    data: { status: "APPROVED" }
  });
  redirect(`/applications/${id}`);
}

export default async function ApplicationPage({ params }: { params: { id: string } }) {
  const app = await prisma.application.findUniqueOrThrow({
    where: { id: params.id },
    include: { job: true, user: { include: { profile: true } } }
  });

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <Link href="/dashboard" className="text-sm text-slate-500">← Dashboard</Link>
      <div className="mt-4 flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{app.job.title}</h1>
          <p className="text-slate-600">{app.job.companyName} · {app.job.location}</p>
          <p className="mt-2 text-sm">Status: <b>{app.status}</b></p>
        </div>
        <div className="flex gap-2">
          <form action={generatePackage}>
            <input type="hidden" name="id" value={app.id} />
            <button className="rounded-xl bg-slate-900 px-4 py-2 text-white">Generate Package</button>
          </form>
          <form action={approveApplication}>
            <input type="hidden" name="id" value={app.id} />
            <button className="rounded-xl border bg-white px-4 py-2">Approve</button>
          </form>
          <a
            href={`/api/applications/${app.id}/package`}
            className="rounded-xl border bg-white px-4 py-2"
            target="_blank"
          >
            Export Package
          </a>
        </div>
      </div>

      <section className="mt-8 rounded-2xl border bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold">Apply flow</h2>
        <p className="mt-2 text-sm text-slate-600">
          After approval, export the package and paste it into the Chrome extension. The extension autofills Greenhouse, Lever, Ashby, Workday, Dayforce, and LinkedIn pages for user review before submit.
        </p>
      </section>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <Panel title="Tailored Resume" content={app.tailoredResume || "Not generated yet."} />
        <Panel title="Cover Letter" content={app.coverLetter || "Not generated yet."} />
        <Panel title="Application Answers" content={app.generatedAnswers || "Not generated yet."} />
        <Panel title="Job Description" content={app.job.description} />
      </div>
    </main>
  );
}

function Panel({ title, content }: { title: string; content: string }) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      <pre className="whitespace-pre-wrap text-sm leading-6 text-slate-700">{content}</pre>
    </section>
  );
}
