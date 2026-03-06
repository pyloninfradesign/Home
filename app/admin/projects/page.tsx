export default async function ProjectsAdminPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 py-10">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">Admin</p>
          <h1 className="text-2xl font-semibold">Projects</h1>
        </div>
        <a
          href="/admin/projects/new"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          New Project
        </a>
      </div>
      <div className="rounded-lg border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
        Table coming next: title, status, public toggle, customer, last updated.
      </div>
    </main>
  );
}
