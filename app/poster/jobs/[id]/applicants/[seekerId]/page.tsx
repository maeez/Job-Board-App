import { db } from "@/lib/db";
import { seekerProfile, user } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { getServerSession } from "@/lib/session";
import { redirect, notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function ApplicantProfilePage({
  params,
}: {
  params: Promise<{ id: string; seekerId: string }>;
}) {
  const session = await getServerSession();
  if (!session || session.user.role !== "poster") redirect("/login");

  const { id, seekerId } = await params;

  const [seekerUser, profile] = await Promise.all([
    db.select().from(user).where(eq(user.id, seekerId)).limit(1),
    db.select().from(seekerProfile).where(eq(seekerProfile.userId, seekerId)).limit(1),
  ]);

  if (!seekerUser[0] || !profile[0]) notFound();

  const applicant = seekerUser[0];
  const applicantProfile = profile[0];

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="max-w-2xl mx-auto px-4 py-10">

        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4 -ml-2">
            <Link href={`/poster/jobs/${id}`}>
              ← Back to applicants
            </Link>
          </Button>
          <p className="text-sm text-muted-foreground mb-1">Applicant profile</p>
          <h1 className="text-3xl font-bold tracking-tight">{applicant.name}</h1>
          <p className="text-muted-foreground mt-1">{applicant.email}</p>
        </div>

        <div className="space-y-4">

          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Personal details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0 divide-y">
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">Country</span>
                <span className="text-sm font-medium">{applicantProfile.country}</span>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">Job preference</span>
                <Badge variant="secondary" className="capitalize">
                  {applicantProfile.jobPreference}
                </Badge>
              </div>
              <div className="flex items-center justify-between py-3">
                <span className="text-sm text-muted-foreground">Expected compensation</span>
                <span className="text-sm font-medium">
                  {applicantProfile.compensationCurrency}{" "}
                  {Number(applicantProfile.expectedCompensation).toLocaleString()}
                  <span className="text-muted-foreground font-normal"> / year</span>
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Skills
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {applicantProfile.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-none">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Languages
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 flex-wrap">
                {applicantProfile.languages.map((lang) => (
                  <Badge key={lang} variant="secondary">
                    {lang}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}