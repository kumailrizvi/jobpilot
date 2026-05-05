import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const DEMO_USER_EMAIL = "demo@jobpilot.ai";

async function createJob(formData: FormData) {
  "use server";
  const user = await prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {},
    create: { email: DEMO_USER_EMAIL, name: "Demo User" }
  });

  const job = await prisma.job.create({
    data: {
      userId: user.id,
      companyName: String(formData.get("companyName") || ""),
      title: String(formData.get("title") || ""),
      location: String(formData.get("location") || ""),
      sourceUrl: String(formData.get("sourceUrl") || ""),
      platform: String(formData.get("platform") || ""),
      description: String(formData.get("description") || "")
    }
  });

  const application = await prisma.application.create({
    data: {
      userId: user.id,
      jobId: job.id,
      status: "DRAFT"
    }
  });

  redirect(`/applications/${application.id}`);
}

export default function NewJobPage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Add Job</h1>
      <p className="mt-2 text-slate-600">Paste the job details. The AI will generate the application package.</p>

      <form action={createJob} className="mt-8 space-y-5 rounded-2xl border bg-white p-6 shadow-sm">
        <Field label="Company" name="companyName" />
        <Field label="Job title" name="title" />
        <Field label="Location" name="location" />
        <Field label="Source URL" name="sourceUrl" />
        <Field label="Platform" name="platform" placeholder="LinkedIn, Greenhouse, Lever, Workday, Dayforce..." />
        <Field label="Job description" name="description" textarea />
        <button className="rounded-xl bg-slate-900 px-5 py-3 text-white">Create Application</button>
      </form>
    </main>
  );
}

function Field({ label, name, textarea, placeholder }: any) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {textarea ? (
        <textarea name={name} rows={10} className="mt-2 w-full rounded-xl border p-3" placeholder={placeholder} />
      ) : (
        <input name={name} className="mt-2 w-full rounded-xl border p-3" placeholder={placeholder} />
      )}
    </label>
  );
}
