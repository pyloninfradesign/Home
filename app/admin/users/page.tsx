import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { UsersTable, UserRow } from "./_components/UsersTable";

const ADMIN_ROLES = new Set(["admin", "manager"]);

type UserRow = {
  id: string;
  email: string;
  name: string | null;
  role: string | null;
  created_at: string | null;
  last_sign_in_at: string | null;
  disabled: boolean | null;
};

async function getUsers(): Promise<UserRow[]> {
  if (!supabaseAdmin) return [];
  // Join auth.users (metadata: last_sign_in_at) with public.users table (role/name)
  const { data, error } = await supabaseAdmin.rpc("list_auth_users_with_role");
  if (error) {
    console.error("Failed to load users", error);
    return [];
  }
  return (data as UserRow[]) ?? [];
}

export default async function UsersPage() {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin?callbackUrl=/admin/users");
  if (!ADMIN_ROLES.has(session.user.role ?? "")) redirect("/");

  const users = await getUsers();

  return <UsersTable users={users} />;
}
