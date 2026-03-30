import { createJob } from "@/lib/actions/poster";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CountryCurrencySelect from "@/components/country-currency-select";
import Link from "next/link";

export default function NewJobPage() {
  return (
    <div className="min-h-screen bg-muted/40 flex items-start justify-center px-4 py-12">
      <div className="w-full max-w-2xl">

        <div className="mb-6">
          <Link
            href="/poster/dashboard"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to dashboard
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Post a new job</CardTitle>
            <p className="text-sm text-muted-foreground">
              Fill in the details below to create your listing
            </p>
          </CardHeader>
          <CardContent>
            <form action={createJob} className="space-y-6">

              <div className="space-y-2">
                <Label htmlFor="title">Job title</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="e.g. Senior React Developer"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Describe the role, responsibilities, and requirements..."
                  rows={4}
                  required
                />
              </div>

              <CountryCurrencySelect />
          <div className="flex justify-between gap-4">
              <div className="space-y-2 flex-1">
                <Label htmlFor="jobType">Job type</Label>
                <Select name="jobType" required>
                  <SelectTrigger className="w-full" id="jobType">
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="in-office">In-office</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 flex-1 items-center rounded-md ">
                <Label htmlFor="compensationAmount">Compensation per year</Label>
                <Input
                  id="compensationAmount"
                  name="compensationAmount"
                  type="number"
                  placeholder="e.g. 80000"
                  min={0}
                  required
                  className="w-full"
                  
                />
              </div>
            </div>


              <div className="space-y-2">
                <Label htmlFor="requiredSkills">Required skills</Label>
                <Input
                  id="requiredSkills"
                  name="requiredSkills"
                  placeholder="e.g. React, TypeScript, Node.js"
                  required
                />
                <p className="text-xs text-muted-foreground">Comma separated</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="requiredLanguages">Required languages</Label>
                <Input
                  id="requiredLanguages"
                  name="requiredLanguages"
                  placeholder="e.g. English, Hindi"
                  required
                  pattern="[a-zA-Z, ]+"
                  title="Only letters and commas allowed" />
                <p className="text-xs text-muted-foreground">Comma separated</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit" className="flex-1">
                  Post job
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/poster/dashboard">Cancel</Link>
                </Button>
              </div>

            </form>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}