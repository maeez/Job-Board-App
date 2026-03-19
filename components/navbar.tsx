import Link from "next/link";
import LogoutButton from "./logout-button";
import type { Session } from "@/lib/auth";


 

interface props{
  session: Session
}
export default async function Navbar({session}:props) {
  

  return (
    <nav className="border-b bg-background sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <Link
          href={
            session?.user.role === "poster"
              ? "/poster/dashboard"
              : "/seeker/feed"
          }
          className="text-sm font-medium hover:text-muted-foreground transition-colors"
        >
          Job Board
        </Link>

        <div className="flex items-center gap-6">
          {session?.user.role === "seeker" && (
            <Link
              href="/seeker/profile/setup"
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Profile
            </Link>
          )}
          <span className="text-sm text-muted-foreground">
            {session?.user.name}
          </span>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}