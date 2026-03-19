import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import Navbar from "@/components/navbar";

export default async function PosterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();

  if (!session) redirect("/login");
  if (session.user.role !== "poster") redirect("/seeker/feed");
  return <>
    <Navbar session={session} />
   {children}
   </>;
}