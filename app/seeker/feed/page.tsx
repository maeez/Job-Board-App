"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAppliedJobIds } from "@/lib/actions/seeker";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import type { Job } from "@/types";

export default function SeekerFeedPage() {
  const queryClient = useQueryClient();
  const [appliedIds, setAppliedIds] = useState<string[]>([]);

  useEffect(() => {
    getAppliedJobIds().then(setAppliedIds);
  }, []);

  const { data: jobs, isError, isLoading } = useQuery({
    queryKey: ["seeker-jobs"],
    queryFn: async () => {
      const res = await fetch("/api/seeker/jobs");
      if (res.status === 404) throw new Error("NO_PROFILE");
      if (!res.ok) throw new Error("Failed to fetch jobs");
      return res.json() as Promise<Job[]>;
    },
  });

  const applyMutation = useMutation({
    mutationFn: async (jobId: string) => {
      const res = await fetch("/api/seeker/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobId }),
      });
      if (!res.ok) throw new Error("Failed to apply");
      return jobId;
    },
    onSuccess: (jobId) => {
      setAppliedIds((prev) => [...prev, jobId]);
      queryClient.invalidateQueries({ queryKey: ["seeker-jobs"] });
    },
  });

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="max-w-5xl mx-auto px-6 py-10">

        <div className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">Job feed</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Jobs matched to your profile
          </p>
        </div>

       
          {isError ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg font-medium mb-1">Profile not set up</p>
              <p className="text-sm text-muted-foreground mb-4">
                Complete your profile to start seeing matched jobs.
              </p>
              <Button asChild>
                <Link href="/seeker/profile/setup">Set up profile</Link>
              </Button>
            </CardContent>
          </Card>
        ) : isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-5 w-48" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-24 text-center">
              <p className="text-lg font-medium mb-1">No matching jobs</p>
              <p className="text-sm text-muted-foreground mb-4">
                No jobs match your profile yet. Try updating your profile.
              </p>
              <Button variant="outline" asChild>
                <Link href="/seeker/profile/setup">Update profile</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => {
              const hasApplied = appliedIds.includes(job.id);
              return (
                <Card key={job.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <CardTitle className="text-base">{job.title}</CardTitle>
                        {job.description && (
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {job.description}
                          </p>
                        )}
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {job.jobType}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-medium">
                        {job.compensationCurrency}{" "}
                        {Number(job.compensationAmount).toLocaleString()}
                      </span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground">{job.country}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="text-muted-foreground text-xs">
                        {new Date(job.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex gap-1.5 flex-wrap">
                      {job.requiredSkills.map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex gap-1.5 flex-wrap">
                      {job.requiredLanguages.map((lang) => (
                        <Badge key={lang} variant="secondary" className="text-xs">
                          {lang}
                        </Badge>
                      ))}
                    </div>

                    <div className="pt-1">
                      <Button
                        size="sm"
                        variant={hasApplied ? "secondary" : "default"}
                        disabled={hasApplied || applyMutation.isPending}
                        onClick={() => !hasApplied && applyMutation.mutate(job.id)}
                      >
                        {hasApplied
                          ? "Applied"
                          : applyMutation.isPending
                          ? "Applying..."
                          : "Apply now"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
