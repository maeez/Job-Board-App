"use server";

import { db } from "@/lib/db";
import { application, job, seekerProfile, user } from "@/lib/schema";
import { getServerSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";


export async function createJob(formData: FormData) {
  const session = await getServerSession();

  if (!session || session.user.role !== "poster") redirect("/login");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const country = formData.get("country") as string;
  const compensationCurrency = formData.get("compensationCurrency") as string;
  const compensationAmount = Number(formData.get("compensationAmount") as string);
  const jobType = formData.get("jobType") as "in-office" | "remote" | "hybrid";
  const requiredSkills = (formData.get("requiredSkills") as string).split(",").map(s => s.trim()).filter(Boolean);
  const requiredLanguages = (formData.get("requiredLanguages") as string).split(",").map(l => l.trim()).filter(Boolean);

  await db.insert(job).values({
    id: uuidv4(),
    posterId: session.user.id,
    title,
    description,
    country,
    compensationCurrency,
    compensationAmount,
    jobType,
    requiredSkills,
    requiredLanguages,
  });

  revalidatePath("/poster/dashboard");
  redirect("/poster/dashboard");
}

export async function getPosterJobs() {
  const session = await getServerSession();
  if (!session || session.user.role !== "poster") redirect("/login");

  const jobs = await db.select().from(job).where(eq(job.posterId, session.user.id)).orderBy(job.createdAt);

  return jobs;
}


export async function getApplicantsForAJob(id: string) {
  const session = await getServerSession();

  if (!session || session.user.role !== "poster") {
    throw new Error("Unauthorized");
  }

  const applicants = await db.select({
      applicationId: application.id,
      appliedAt: application.createdAt,
      seekerId: user.id,
      seekerName: user.name,
      seekerEmail: user.email,
      country: seekerProfile.country,
      jobPreference: seekerProfile.jobPreference,
      compensationCurrency: seekerProfile.compensationCurrency,
      expectedCompensation: seekerProfile.expectedCompensation,
      languages: seekerProfile.languages,
      skills: seekerProfile.skills,
    })
    .from(application)
    .innerJoin(user, eq(application.seekerId, user.id))
    .innerJoin(seekerProfile, eq(application.seekerId, seekerProfile.userId))
    .where(eq(application.jobId, id));

  return applicants;
}