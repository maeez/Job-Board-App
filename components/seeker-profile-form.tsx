"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CountryCurrencySelect from "@/components/country-currency-select";
import { createOrUpdateSeekerProfile } from "@/lib/actions/seeker";
import type { SeekerProfile } from "@/types";
import { useState } from "react";
import Spinner from "./spinner";

interface Props  {
  profile: SeekerProfile | null;
  userName: string;
}

export default function SeekerProfileForm({ profile, userName }: Props) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);

  async function handleSubmit( e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new  FormData(e.currentTarget)
    await createOrUpdateSeekerProfile(formData);
    queryClient.removeQueries({ queryKey: ["seeker-jobs"] });
    router.push("/seeker/feed");
    router.refresh();
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-muted/40 flex items-start justify-center px-4 py-12">
          <div className="w-full max-w-2xl">
    
            <div className="mb-6">
              <p className="text-sm text-muted-foreground">
                {profile ? "Update your profile" : "Welcome! Let's set up your profile"}
              </p>
              <h1 className="text-2xl font-semibold tracking-tight mt-1">
                {userName}
              </h1>
            </div>
    
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Your profile</CardTitle>
                <p className="text-sm text-muted-foreground">
                  This information is used to match you with relevant jobs
                </p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
    
                  <CountryCurrencySelect  key={`${profile?.country}-${profile?.compensationCurrency}`} defaultCountry={profile?.country} defaultCurrency={profile?.compensationCurrency}/>
    
                  <div className="space-y-2">
                    <Label htmlFor="jobPreference">Job preference</Label>
                    <select
                      name="jobPreference"
                      required
                      defaultValue={profile?.jobPreference ?? "remote"}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="remote">Remote</option>
                      <option value="in-office">In-office</option>
                      <option value="hybrid">Hybrid</option>
                    </select>
                  </div>
    
                  <div className="space-y-2">
                    <Label htmlFor="expectedCompensation">Expected compensation per year</Label>
                    <Input
                      id="expectedCompensation"
                      name="expectedCompensation"
                      type="number"
                      placeholder="e.g. 80000"
                      min={0}
                      defaultValue={profile?.expectedCompensation}
                      required
                    />
                  </div>
    
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    <Input
                      id="skills"
                      name="skills"
                      placeholder="e.g. React, TypeScript, Node.js"
                      defaultValue={profile?.skills.join(", ")}
                      required
                    />
                    <p className="text-xs text-muted-foreground">Comma separated</p>
                  </div>
    
                  <div className="space-y-2">
                    <Label htmlFor="languages">Languages spoken</Label>
                    <Input
                      id="languages"
                      name="languages"
                      placeholder="e.g. English, Hindi"
                      defaultValue={profile?.languages.join(", ")}
                      required
                      pattern="[a-zA-Z, ]+"
                      title="Only letters and commas allowed"
                    />
                    <p className="text-xs text-muted-foreground">Comma separated</p>
                  </div>
    
            <Button type="submit" className="w-full p-6" disabled={loading}>
                    {loading ? (
                  <span className="flex items-center gap-2">
                    <Spinner />
                    Saving...
                  </span>
                    ) : (
                  profile ? "Update profile" : "Save and continue →"
                  )}
            </Button>
    
                </form>
              </CardContent>
            </Card>
    
          </div>
        </div>
    
  );
}