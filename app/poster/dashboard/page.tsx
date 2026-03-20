import { getPosterJobs } from "@/lib/actions/poster";
import { getServerSession } from "@/lib/session";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function PosterDashboard() {
  const [session, jobs] = await Promise.all([
    getServerSession(),
    getPosterJobs(),
  ]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Welcome back, {session?.user.name}
          </p>
        </div>
        <Button asChild>
          <Link href="/poster/jobs/new">Post a job</Link>
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-lg">No jobs posted yet</p>
          <p className="text-sm mt-1">Create your first job listing to get started</p>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => (
            <Card key={job.id}>
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{job.title}</CardTitle>
                  <Badge variant="secondary">{job.jobType}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span>{job.country}</span>
                  <span>{job.compensationCurrency} {job.compensationAmount.toLocaleString()}</span>
                  <span>{new Date(job.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex gap-2 flex-wrap mb-4">
                  {job.requiredSkills.map((skill) => (
                    <Badge key={skill} variant="outline">{skill}</Badge>
                  ))}
                </div>
                <Button className="bg-gray-950" asChild variant="default" size="sm">
                  <Link href={`/poster/jobs/${job.id}`}>View applicants</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}