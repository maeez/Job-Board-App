import { NextRequest, NextResponse } from "next/server";
import { applyToJob } from "@/lib/actions/seeker";

export async function POST(req: NextRequest) {
  const { jobId } = await req.json();

  if (!jobId) {
    return NextResponse.json({ error: "Job ID required" }, { status: 400 });
  }

  const result = await applyToJob(jobId);

  if (result?.error) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ success: true });
}