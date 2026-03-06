import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

const ADMIN_ROLES = new Set(["admin", "manager"]);

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/api/auth/signin?callbackUrl=/admin");
  }

  if (!ADMIN_ROLES.has(session.user.role ?? "")) {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-sm font-semibold">
              Admin
            </Link>
            <nav className="flex items-center gap-4 text-sm text-neutral-600">
              <Link href="/admin/projects" className="hover:text-black">
                Projects
              </Link>
              <Link href="/admin/users" className="hover:text-black">
                Users
              </Link>
              <Link href="/admin/audit" className="hover:text-black">
                Audit
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3 text-sm text-neutral-700">
            <span>{session.user.email}</span>
            <span className="rounded-full bg-neutral-200 px-2 py-1 text-xs uppercase tracking-wide text-neutral-700">
              {session.user.role}
            </span>
            <Link
              href="/api/auth/signout?callbackUrl=/"
              className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-black"
            >
              Sign out
            </Link>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-6xl px-4">{children}</div>
    </div>
  );
}
