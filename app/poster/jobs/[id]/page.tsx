"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Loading from "./loading";
import Link from "next/link";
import { getApplicantsForAJob } from "@/lib/actions/poster";

type Applicant = {
  applicationId: string;
  appliedAt: Date;
  seekerId: string;
  seekerName: string;
  seekerEmail: string;
  country: string;
  jobPreference: "in-office" | "remote" | "hybrid";
  compensationCurrency: string;
  expectedCompensation: number;
  languages: string[];
  skills: string[];
};

export default function JobApplicantsPage() {
  const { id } = useParams<{ id: string }>();

  const { data: applicants, isLoading, isError } = useQuery<Applicant[]>({
    queryKey: ["applicants", id],
    queryFn: () => getApplicantsForAJob(id),
  });

  if (isLoading) return <Loading />;

  if (isError) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 text-center text-destructive">
        <p>Failed to load applicants. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">
        Applicants{" "}
        {applicants && applicants.length > 0 && (
          <span className="text-muted-foreground text-lg font-normal">
            ({applicants.length})
          </span>
        )}
      </h1>

      {!applicants || applicants.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No applicants yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((applicant: Applicant) => (
            <Card key={applicant.applicationId}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{applicant.seekerName}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {applicant.seekerEmail}
                    </p>
                  </div>
                  <Badge variant="secondary">{applicant.jobPreference}</Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span> {applicant.country}</span>
                  <span>
                     {applicant.compensationCurrency}{" "}
                    {applicant.expectedCompensation.toLocaleString()}
                  </span>
                </div>

                <div className="flex flex-wrap gap-1.5 items-center">
                  <span className="text-xs font-medium text-muted-foreground">Skills:</span>
                  {applicant.skills.map((skill: string) => (
                    <Badge key={skill} variant="outline" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span className="text-xs font-medium text-muted-foreground">Languages:</span>
                    {applicant.languages.map((lang: string) => (
                      <Badge key={lang} variant="secondary" className="text-xs">
                        {lang}
                      </Badge>
                    ))}
                  </div>

                  <Button variant="default" size="sm" asChild className="shrink-0">
                    <Link href={`/poster/jobs/${id}/applicants/${applicant.seekerId}`}>
                      View profile →
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}