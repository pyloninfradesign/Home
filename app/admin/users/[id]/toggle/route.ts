import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ADMIN_ROLES = new Set(["admin", "manager"]);

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.redirect(new URL("/api/auth/signin?callbackUrl=/admin/users", req.url));
  }
  if (!ADMIN_ROLES.has(session.user.role ?? "")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: "Supabase not configured" }, { status: 500 });
  }

  const { id } = await context.params;
  const formData = await req.formData();
  const disabled = formData.get("disabled") === "true";

  const { error } = await supabaseAdmin.auth.admin.updateUserById(id, {
    user_metadata: { disabled },
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.redirect(new URL("/admin/users", req.url));
}
