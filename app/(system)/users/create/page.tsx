import { redirect } from "next/navigation";
import { UserCreateForm } from "@/components/features/users/create/UserCreateForm";
import { getAuthUser } from "@/lib/auth/getAuthUser";

export default async function UserCreatePage() {
  // Check if user is admin on the server side
  const user = await getAuthUser();

  if (!user || user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <UserCreateForm />
      </div>
    </div>
  );
}
