"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Applicant = {
  applicationId: string;
  appliedAt: string;
  seekerId: string;
  seekerName: string;
  seekerEmail: string;
  country: string;
  jobPreference: string;
  compensationCurrency: string;
  expectedCompensation: number;
  languages: string[];
  skills: string[];
};

export default function JobApplicantsPage() {
  const { id } = useParams<{ id: string }>();

  const { data: applicants, isLoading } = useQuery({
    queryKey: ["applicants", id],
    queryFn: async () => {
      const res = await fetch(`/api/poster/jobs/${id}/applicants`);
      if (!res.ok) throw new Error("Failed to fetch applicants");
      return res.json() as Promise<Applicant[]>;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-muted-foreground">Loading applicants...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-6">Applicants</h1>

      {!applicants || applicants.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No applicants yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applicants.map((applicant) => (
            <Card key={applicant.applicationId}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{applicant.seekerName}</CardTitle>
                  <Badge variant="secondary">{applicant.jobPreference}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{applicant.seekerEmail}</p>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                  <span>{applicant.country}</span>
                  <span>{applicant.compensationCurrency} {applicant.expectedCompensation.toLocaleString()}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs font-medium">Skills:</span>
                    {applicant.skills.map((skill) => (
                      <Badge key={skill} variant="outline">{skill}</Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 flex-wrap">
                    <span className="text-xs font-medium">Languages:</span>
                    {applicant.languages.map((lang) => (
                      <Badge key={lang} variant="secondary">{lang}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}