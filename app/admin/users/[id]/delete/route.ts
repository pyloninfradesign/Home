import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ADMIN_ROLES = new Set(["admin", "manager"]);

export async function POST(_req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/api/auth/signin?callbackUrl=/admin/users", _req.url));
  }
  if (!ADMIN_ROLES.has(session.user.role ?? "")) {
    return NextResponse.redirect(new URL("/", _req.url));
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { id } = await context.params;
  const { error } = await supabaseAdmin.auth.admin.deleteUser(id);
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect(new URL("/admin/users", _req.url));
}
