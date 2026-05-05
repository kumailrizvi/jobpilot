import Link from "next/link";
import { prisma } from "@/lib/prisma";

const DEMO_USER_EMAIL = "demo@jobpilot.ai";

async function getData() {
  const user = await prisma.user.upsert({
    where: { email: DEMO_USER_EMAIL },
    update: {},
    create: {
      email: DEMO_USER_EMAIL,
      name: "Demo User",
      profile: {
        create: {
          background: "Product manager with fintech, lending, AI, and payments experience.",
          targetRoles: "Product Manager, Senior Product Manager, Fintech PM",
          locations: "Toronto, Dubai, Remote"
        }
      }
    },
    include: {
      profile: true,
      jobs: { orderBy: { createdAt: "desc" } },
      applications: {
        include: { job: true },
        orderBy: { createdAt: "desc" }
      }
    }
  });

  return user;
}

export default async function DashboardPage() {
  const user = await getData();

  return (
    <main className="mx-auto max-w-6xl px-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Application Dashboard</h1>
          <p className="text-slate-600">Track jobs, generated documents, and submission status.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/profile" className="rounded-xl border bg-white px-4 py-2">Profile</Link>
          <Link href="/jobs/new" className="rounded-xl bg-slate-900 px-4 py-2 text-white">Add Job</Link>
        </div>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Stat label="Jobs" value={user.jobs.length} />
        <Stat label="Applications" value={user.applications.length} />
        <Stat label="Ready/Submitting" value={user.applications.filter((a: { status: string }) => ["READY_FOR_REVIEW", "APPROVED", "SUBMITTED"].includes(a.status)).length} />
      </div>

      <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Recent applications</h2>
        <div className="mt-4 space-y-3">
          {user.applications.length === 0 && <p className="text-slate-500">No applications yet. Add a job first.</p>}
          {user.applications.map(app => (
            <Link href={`/applications/${app.id}`} key={app.id} className="block rounded-xl border p-4 hover:bg-slate-50">
              <div className="flex justify-between">
                <div>
                  <p className="font-semibold">{app.job.title}</p>
                  <p className="text-sm text-slate-600">{app.job.companyName}</p>
                </div>
                <span className="text-sm text-slate-500">{app.status}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border bg-white p-6 shadow-sm">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}
