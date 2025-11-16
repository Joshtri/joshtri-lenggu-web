import { getAuthUser } from "@/lib/auth/getAuthUser";
import { UserDashboard } from "@/components/features/dashboard/UserDashboard";

// Force dynamic rendering (required for auth)
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const user = await getAuthUser();

  // Default to guest if not logged in
  const email = user?.email || "guest@example.com";

  // User profile/dashboard - no sidebar layout from (user)
  return <UserDashboard userEmail={email} />;
}
  