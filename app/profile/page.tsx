import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const DEMO_USER_EMAIL = "demo@jobpilot.ai";

async function saveProfile(formData: FormData) {
  "use server";
  const user = await prisma.user.findUniqueOrThrow({ where: { email: DEMO_USER_EMAIL } });

  await prisma.candidateProfile.upsert({
    where: { userId: user.id },
    update: {
      background: String(formData.get("background") || ""),
      targetRoles: String(formData.get("targetRoles") || ""),
      locations: String(formData.get("locations") || ""),
      workAuthorization: String(formData.get("workAuthorization") || ""),
      genericAnswers: String(formData.get("genericAnswers") || "")
    },
    create: {
      userId: user.id,
      background: String(formData.get("background") || ""),
      targetRoles: String(formData.get("targetRoles") || ""),
      locations: String(formData.get("locations") || ""),
      workAuthorization: String(formData.get("workAuthorization") || ""),
      genericAnswers: String(formData.get("genericAnswers") || "")
    }
  });

  redirect("/dashboard");
}

export default async function ProfilePage() {
  const user = await prisma.user.findUnique({
    where: { email: DEMO_USER_EMAIL },
    include: { profile: true }
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <h1 className="text-3xl font-bold">Candidate Profile</h1>
      <p className="mt-2 text-slate-600">This powers tailored resumes, cover letters, and answers.</p>

      <form action={saveProfile} className="mt-8 space-y-5 rounded-2xl border bg-white p-6 shadow-sm">
        <Field label="Background" name="background" defaultValue={user?.profile?.background || ""} textarea />
        <Field label="Target roles" name="targetRoles" defaultValue={user?.profile?.targetRoles || ""} />
        <Field label="Locations" name="locations" defaultValue={user?.profile?.locations || ""} />
        <Field label="Work authorization" name="workAuthorization" defaultValue={user?.profile?.workAuthorization || ""} />
        <Field label="Generic application answers" name="genericAnswers" defaultValue={user?.profile?.genericAnswers || ""} textarea />
        <button className="rounded-xl bg-slate-900 px-5 py-3 text-white">Save Profile</button>
      </form>
    </main>
  );
}

function Field({ label, name, defaultValue, textarea }: any) {
  return (
    <label className="block">
      <span className="text-sm font-medium">{label}</span>
      {textarea ? (
        <textarea name={name} defaultValue={defaultValue} rows={6} className="mt-2 w-full rounded-xl border p-3" />
      ) : (
        <input name={name} defaultValue={defaultValue} className="mt-2 w-full rounded-xl border p-3" />
      )}
    </label>
  );
}
