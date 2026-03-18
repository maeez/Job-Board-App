import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { job, seekerProfile } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/lib/session";

export async function GET() {
  const session = await getServerSession();

  if (!session || session.user.role !== "seeker") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await db
    .select()
    .from(seekerProfile)
    .where(eq(seekerProfile.userId, session.user.id))
    .limit(1);

  if (!profile[0]) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const seeker = profile[0];

  const allJobs = await db.select().from(job);

  const matchingJobs = allJobs.filter((j) => {
    const countryMatch = j.country === seeker.country;

    const languageMatch = j.requiredLanguages.every((lang) =>
      seeker.languages.map((l) => l.toLowerCase()).includes(lang.toLowerCase())
    );

    const compensationMatch =
      j.compensationCurrency === seeker.compensationCurrency
        ? Number(j.compensationAmount) >= seeker.expectedCompensation
        : false;

    return countryMatch && languageMatch && compensationMatch;
  });

  return NextResponse.json(matchingJobs);
}