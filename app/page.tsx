import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";

export default async function Home() {
  const session = await getServerSession();

  if (!session) redirect("/login");

  if (session.user.role === "poster") redirect("/poster/dashboard");

  redirect("/seeker/feed");
}