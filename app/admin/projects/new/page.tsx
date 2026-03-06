export default async function NewProjectPage() {
  // Temporary stub UI
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 py-10">
      <h1 className="text-2xl font-semibold">Create Project</h1>
      <p className="text-neutral-600">
        This form will create a project with public/employee/customer flags and optional PDF/image uploads.
      </p>
      <div className="rounded-lg border border-dashed border-neutral-300 bg-neutral-50 p-6 text-sm text-neutral-600">
        Form UI coming next: title, description, internal_status, is_public, customer_id, uploads.
      </div>
    </main>
  );
}
