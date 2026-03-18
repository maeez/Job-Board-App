import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { application, seekerProfile, user } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/lib/session";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession();

  if (!session || session.user.role !== "poster") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

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

  return NextResponse.json(applicants);
}