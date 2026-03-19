import { redirect } from "next/navigation";
import { getServerSession } from "@/lib/session";
import Navbar from "@/components/navbar";


export default async function SeekerLayout({children}: {children: React.ReactNode}) {
  const session = await getServerSession();

  if (!session) redirect("/login");
  if (session.user.role !== "seeker") redirect("/poster/dashboard");

  return <>
  <Navbar/>
  {children}</>;
}