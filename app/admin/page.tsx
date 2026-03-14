import Link from "next/link";

const quickLinks = [
  { title: "New Project", href: "/admin/projects/new", desc: "Create a project and set public/employee/customer flags." },
  { title: "Projects", href: "/admin/projects", desc: "Edit status, assign customer, manage uploads." },
  { title: "Knowledge Base", href: "/admin/knowledge", desc: "Refresh crawled site knowledge and edit AI notes." },
  { title: "Users", href: "/admin/users", desc: "Invite or create customers, employees, and managers." },
  { title: "Audit Logs", href: "/admin/audit", desc: "See who changed what, and when." },
];

export default async function AdminHome() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-8 py-10">
      <section className="flex items-start justify-between rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium text-neutral-500">Admin</p>
          <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        </div>
        <a
          href="/api/auth/signout?callbackUrl=/"
          className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition hover:border-neutral-400 hover:text-black"
        >
          Sign out
        </a>
      </section>

      <section className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-semibold">Quick Actions</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group rounded-lg border border-neutral-200 px-4 py-3 transition hover:border-neutral-400 hover:shadow-sm"
            >
              <div className="flex items-center justify-between">
                <span className="text-base font-medium">{link.title}</span>
                <span className="text-neutral-400 transition group-hover:text-neutral-600">→</span>
              </div>
              <p className="mt-2 text-sm text-neutral-600">{link.desc}</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
