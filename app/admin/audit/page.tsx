import { BackLink } from '@/components/admin/back-link'
import { Breadcrumb } from '@/components/admin/breadcrumb'
import {
  getAuditActionLabel,
  getAuditActionTone,
  getAuditEvents,
} from '@/lib/audit'

export default async function AuditPage() {
  const events = await getAuditEvents()

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 py-10">
      <div className="flex flex-col gap-3">
        <BackLink href="/admin" label="Back to admin" />
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Audit Logs' }]} />
      </div>
      <div>
        <p className="text-sm font-medium text-neutral-500">Admin</p>
        <h1 className="text-2xl font-semibold">Audit Logs</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Login activity, project changes, and user-management events. IP address is captured when the request exposes it.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-neutral-500">Login details</p>
          <p className="mt-2 text-2xl font-semibold text-neutral-900">
            {events.filter((event) => event.target?.type === 'auth').length}
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-neutral-500">Project changes</p>
          <p className="mt-2 text-2xl font-semibold text-neutral-900">
            {events.filter((event) => event.target?.type === 'project').length}
          </p>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-neutral-500">User events</p>
          <p className="mt-2 text-2xl font-semibold text-neutral-900">
            {events.filter((event) => event.target?.type === 'user').length}
          </p>
        </div>
      </div>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
        <div className="border-b border-neutral-200 px-6 py-4">
          <h2 className="text-base font-semibold text-neutral-900">Activity Feed</h2>
        </div>
        <div className="divide-y divide-neutral-200">
          {events.length === 0 ? (
            <div className="px-6 py-8 text-sm text-neutral-600">
              No audit events recorded yet.
            </div>
          ) : (
            events.map((event) => {
              const tone = getAuditActionTone(event.action)
              const badgeClass =
                tone === 'emerald'
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  : tone === 'rose'
                    ? 'bg-rose-50 text-rose-700 border-rose-200'
                    : 'bg-neutral-50 text-neutral-700 border-neutral-200'

              return (
                <div key={event.id} className="px-6 py-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className={`rounded-full border px-2.5 py-1 text-xs font-medium ${badgeClass}`}>
                          {getAuditActionLabel(event.action)}
                        </span>
                        <span className="text-xs text-neutral-500">
                          {new Intl.DateTimeFormat('en-US', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          }).format(new Date(event.timestamp))}
                        </span>
                      </div>
                      <div className="text-sm text-neutral-800">
                        <span className="font-medium">
                          {event.actor?.email ?? event.actor?.name ?? 'Unknown actor'}
                        </span>
                        {' '}
                        {event.target?.label ? `affected ${event.target.type} "${event.target.label}"` : 'performed an action'}
                      </div>
                      <div className="flex flex-wrap gap-4 text-xs text-neutral-500">
                        <span>Role: {event.actor?.role ?? '-'}</span>
                        <span>IP: {event.request?.ip ?? 'Unavailable'}</span>
                        <span>User-Agent: {event.request?.userAgent ?? 'Unavailable'}</span>
                      </div>
                      {event.details ? (
                        <div className="rounded-md bg-neutral-50 px-3 py-2 text-xs text-neutral-600">
                          {Object.entries(event.details).map(([key, value]) => (
                            <div key={key}>
                              <span className="font-medium text-neutral-700">{key}:</span>{' '}
                              {String(value)}
                            </div>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </main>
  )
}
