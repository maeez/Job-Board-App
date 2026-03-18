import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";

export default async function PosterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) redirect("/login");
  if (session.user.role !== "poster") redirect("/seeker/feed");
  return <>{children}</>;
}