export default async function AuditPage() {
  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 py-10">
      <div>
        <p className="text-sm font-medium text-neutral-500">Admin</p>
        <h1 className="text-2xl font-semibold">Audit Logs</h1>
      </div>
      <div className="rounded-lg border border-neutral-200 bg-white p-6 text-sm text-neutral-600">
        Audit feed placeholder. Wire this to `audit_logs` (action, actor, target, timestamp).
      </div>
    </main>
  );
}
