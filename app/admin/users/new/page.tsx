import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { logAuditEvent } from "@/lib/audit";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { Breadcrumb } from "@/components/admin/breadcrumb";
import { BackLink } from "@/components/admin/back-link";

const ADMIN_ROLES = new Set(["admin", "manager"]);
const ROLE_OPTIONS = ["admin", "manager", "employee", "customer"] as const;

export default async function NewUserPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const session = await auth();
  if (!session?.user) redirect("/api/auth/signin?callbackUrl=/admin/users/new");
  if (!ADMIN_ROLES.has(session.user.role ?? "")) redirect("/");

  async function createUserAction(formData: FormData) {
    "use server";

    try {
      const currentSession = await auth();
      if (!currentSession?.user || !ADMIN_ROLES.has(currentSession.user.role ?? "")) {
        redirect("/api/auth/signin?callbackUrl=/admin/users/new");
      }

      const email = (formData.get("email") as string)?.trim().toLowerCase();
      const name = (formData.get("name") as string)?.trim() || null;
      const role = (formData.get("role") as string) || "customer";

      const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
      if (!email || !emailRegex.test(email)) {
        redirect("/admin/users/new?error=Invalid%20email");
      }
      if (!ROLE_OPTIONS.includes(role as (typeof ROLE_OPTIONS)[number])) {
        redirect("/admin/users/new?error=Invalid%20role");
      }

      if (!supabaseAdmin) {
        redirect("/admin/users/new?error=Supabase%20not%20configured");
      }

      const { data: created, error: createError } = await supabaseAdmin!.auth.admin.createUser({
        email,
        email_confirm: false,
        user_metadata: { role, name, disabled: false },
      });
      if (createError) {
        redirect(`/admin/users/new?error=${encodeURIComponent(createError.message)}`);
      }

      const { error: upsertError } = await supabaseAdmin!.from("users").upsert({
        id: created?.user?.id,
        email,
        name,
        role,
      });
      if (upsertError) {
        redirect(`/admin/users/new?error=${encodeURIComponent(upsertError.message)}`);
      }
/*
      try {
        const signinLink = `${process.env.NEXTAUTH_URL ?? "http://127.0.0.1:4100"}/api/auth/signin?callbackUrl=/admin`;
        if (process.env.RESEND_API_KEY && process.env.EMAIL_FROM) {
          await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: process.env.EMAIL_FROM,
              to: email,
              subject: "You're invited to Pylon Admin",
              html: `
                <p>Hello${name ? ` ${name}` : ""},</p>
                <p>You’ve been invited to the Pylon admin portal with the role <strong>${role}</strong>.</p>
                <p>Click the link below to sign in:</p>
                <p><a href="${signinLink}">${signinLink}</a></p>
                <p>If you didn't expect this, you can ignore the message.</p>
              `,
            }),
          });
        }
      } catch (err) {
        console.error("Resend invite failed", err);
      }

      revalidatePath("/admin/users");
      await logAuditEvent({
        action: "USER_CREATE",
        actor: {
          id: currentSession.user.id,
          email: currentSession.user.email,
          role: currentSession.user.role,
          name: currentSession.user.name,
        },
        target: {
          type: "user",
          id: created?.user?.id,
          label: email,
        },
        details: {
          role,
          name: name ?? "",
        },
      });
      redirect("/admin/users?created=1");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create user";
      redirect(`/admin/users/new?error=${encodeURIComponent(message)}`);
    }
  }
*/
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 py-10">
      <div className="flex flex-col gap-3">
        <BackLink href="/admin/users" label="Back to users" />
        <Breadcrumb items={[{ label: "Admin", href: "/admin" }, { label: "Users", href: "/admin/users" }, { label: "New" }]} />
        <div>
          <p className="text-sm font-medium text-neutral-500">Admin</p>
          <h1 className="text-2xl font-semibold">Create User</h1>
          <p className="text-neutral-600 text-sm">Create staff or customer accounts with a predefined role.</p>
        </div>
      </div>

      {searchParams.error ? (
        <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {decodeURIComponent(searchParams.error)}
        </div>
      ) : null}
      {searchParams.created ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          User created and invite attempted (best effort).
        </div>
      ) : null}

      <form action={createUserAction} className="space-y-4 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="text-sm font-medium text-neutral-800">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
            placeholder="customer@example.com"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-sm font-medium text-neutral-800">
            Name (optional)
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
            placeholder="Jane Doe"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="role" className="text-sm font-medium text-neutral-800">
            Role
          </label>
          <select
            id="role"
            name="role"
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
            defaultValue="customer"
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs text-neutral-500">
          Creates a Supabase auth user with role metadata, then sends an invite email (best effort).
        </p>

        <button
          type="submit"
          className="w-fit rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Create user
        </button>
      </form>
    </main>
  );
}
