"use server";

import { db } from "@/lib/db";
import { seekerProfile, job, application } from "@/lib/schema";
import { getServerSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";

export async function createOrUpdateSeekerProfile(formData: FormData) {
  const session = await getServerSession();
  if (!session || session.user.role !== "seeker") redirect("/login");

  const country = formData.get("country") as string;
  const jobPreference = formData.get("jobPreference") as "in-office" | "remote" | "hybrid";
  const compensationCurrency = formData.get("compensationCurrency") as string;
  const expectedCompensation = Number(formData.get("expectedCompensation") as string);
  const languages = (formData.get("languages") as string).split(",").map((l) => l.trim()).filter(Boolean);
  const skills = (formData.get("skills") as string).split(",").map((s) => s.trim()).filter(Boolean);

  const existing = await db
    .select()
    .from(seekerProfile)
    .where(eq(seekerProfile.userId, session.user.id))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(seekerProfile)
      .set({
        country,
        jobPreference,
        compensationCurrency,
        expectedCompensation,
        languages,
        skills,
        updatedAt: new Date(),
      })
      .where(eq(seekerProfile.userId, session.user.id));
  } else {
    await db.insert(seekerProfile).values({
      id: uuidv4(),
      userId: session.user.id,
      country,
      jobPreference,
      compensationCurrency,
      expectedCompensation,
      languages,
      skills,
    });
  }

revalidatePath("/seeker/feed");
revalidatePath("/seeker/profile/setup");
redirect("/seeker/feed");
}

export async function getSeekerProfile() {
  const session = await getServerSession();
  if (!session || session.user.role !== "seeker") redirect("/login");

  const profile = await db
    .select()
    .from(seekerProfile)
    .where(eq(seekerProfile.userId, session.user.id))
    .limit(1);

  return profile[0] ?? null;
}

export async function applyToJob(jobId: string) {
  const session = await getServerSession();
  if (!session || session.user.role !== "seeker") redirect("/login");

  const existing = await db
    .select()
    .from(application)
    .where(
      and(
        eq(application.jobId, jobId),
        eq(application.seekerId, session.user.id)
      )
    )
    .limit(1);

  if (existing.length > 0) return { error: "Already applied" };

  await db.insert(application).values({
    id: uuidv4(),
    jobId,
    seekerId: session.user.id,
  });

  revalidatePath("/seeker/feed");
  return { success: true };
}

export async function getAppliedJobIds() {
  const session = await getServerSession();
  if (!session) redirect("/login");

  const applications = await db
    .select({ jobId: application.jobId })
    .from(application)
    .where(eq(application.seekerId, session.user.id));

  return applications.map((a) => a.jobId);
}