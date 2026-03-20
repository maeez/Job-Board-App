import { createOrUpdateSeekerProfile, getSeekerProfile } from "@/lib/actions/seeker";
import { getServerSession } from "@/lib/session";
import SeekerProfileForm from "@/components/seeker-profile-form";

export default async function ProfileSetupPage() {
  const [session, profile] = await Promise.all([
    getServerSession(),
    getSeekerProfile(),
  ]);

  return (
    <SeekerProfileForm profile={profile} userName={session?.user.name ?? ""}/>
    
  );
}