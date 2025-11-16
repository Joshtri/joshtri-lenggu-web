import { getAuthUser } from "@/lib/auth/getAuthUser";
import { UserRole } from "@/enums/common";
import { AdminDashboard } from "@/components/features/dashboard/AdminDashboard";
import { redirect } from "next/navigation";

// Force dynamic rendering (required for auth)
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await getAuthUser();

  // For now, no protection - default to ADMIN role if not logged in
  const role = user?.role || UserRole.ADMIN;
  const email = user?.email || "guest@example.com";

  // Redirect regular users to their profile page
  if (role !== UserRole.ADMIN) {
    redirect("/"); // if not admin, redirect to home
  }

  // Admin-only dashboard with sidebar layout
  return <AdminDashboard userEmail={email} />;
}
