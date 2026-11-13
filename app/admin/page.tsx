import { redirect } from "next/navigation";
import { auth } from "@/app/(auth)/auth";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { isAdminEmail } from "@/lib/admin";
import { getAllUsers, getRecentChatsForAdmin } from "@/lib/db/queries";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect("/");
  }

  const [users, recentChats] = await Promise.all([
    getAllUsers(),
    getRecentChatsForAdmin({ limit: 20 }),
  ]);

  return (
    <AdminDashboard
      recentChats={recentChats}
      stripeConfigured={Boolean(process.env.STRIPE_SECRET_KEY)}
      stripePublishableConfigured={Boolean(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)}
      users={users}
    />
  );
}
