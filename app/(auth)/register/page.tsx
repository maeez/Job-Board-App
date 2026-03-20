"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserRole } from "@/types";
import Link from "next/link";
import Spinner from "@/components/spinner";

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole>("seeker");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget) ;
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    setLoading(true);
    setError(null);

    const { error } = await signUp.email({
      name,
      email,
      password,
      fetchOptions: { throw: false },
      role,
    } as Parameters<typeof signUp.email>[0]);

    setLoading(false);

    if (error) {
      setError(error.message ?? "Something went wrong");
      return;
    }

    router.push(role === "seeker" ? "/seeker/profile/setup" : "/poster/dashboard");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Create an account</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex rounded-lg border overflow-hidden mb-6">
            <button
              type="button"
              onClick={() => setRole("seeker")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                role === "seeker"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              Job Seeker
            </button>
            <button
              type="button"
              onClick={() => setRole("poster")}
              className={`flex-1 py-2 text-sm font-medium transition-colors ${
                role === "poster"
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground hover:bg-muted"
              }`}
            >
              Job Poster
            </button>
          </div>

          <form onSubmit={handleSubmit}
            className="space-y-4"
          >
            <div className=" bg space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input id="name" name="name" placeholder="Max Smith" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="you@example.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" placeholder="••••••••" required minLength={8} pattern="^(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$"
                title="Password must be at least 8 characters and include at least one uppercase letter, one number, and one symbol" />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button type="submit" className="w-full text-lg p-6" disabled={loading}>

                {loading ? (<span className="flex items-center gap-2">
                                  <Spinner />
                                 Creating account...
                                </span>
                              ) : (
                                "Create account"
                              )}


            </Button>
          </form>

          <p className=" font text-sm text-center text-muted-foreground mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}