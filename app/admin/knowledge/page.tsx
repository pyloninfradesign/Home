import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { logAuditEvent } from '@/lib/audit'
import { BackLink } from '@/components/admin/back-link'
import { Breadcrumb } from '@/components/admin/breadcrumb'
import {
  getKnowledgeBaseRecord,
  getRequestOrigin,
  refreshKnowledgeBase,
  updateKnowledgeBaseNotes,
} from '@/lib/chat-knowledge'

const ADMIN_ROLES = new Set(['admin', 'manager'])

export default async function KnowledgePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams
  const session = await auth()
  if (!session?.user) redirect('/api/auth/signin?callbackUrl=/admin/knowledge')
  if (!ADMIN_ROLES.has(session.user.role ?? '')) redirect('/')

  const knowledgeBase = await getKnowledgeBaseRecord()

  async function refreshKnowledgeAction() {
    'use server'

    const currentSession = await auth()
    if (!currentSession?.user || !ADMIN_ROLES.has(currentSession.user.role ?? '')) {
      redirect('/api/auth/signin?callbackUrl=/admin/knowledge')
    }

    const origin = await getRequestOrigin()
    const refreshed = await refreshKnowledgeBase(origin)
    await logAuditEvent({
      action: 'PROJECT_UPDATE',
      actor: {
        id: currentSession.user.id,
        email: currentSession.user.email,
        role: currentSession.user.role,
        name: currentSession.user.name,
      },
      target: {
        type: 'project',
        label: 'Knowledge base refresh',
      },
      details: {
        pages: refreshed.pages.length,
        sourceOrigin: refreshed.sourceOrigin,
      },
    })
    revalidatePath('/admin/knowledge')
    redirect('/admin/knowledge?refreshed=1')
  }

  async function saveNotesAction(formData: FormData) {
    'use server'

    const currentSession = await auth()
    if (!currentSession?.user || !ADMIN_ROLES.has(currentSession.user.role ?? '')) {
      redirect('/api/auth/signin?callbackUrl=/admin/knowledge')
    }

    const notes = ((formData.get('adminNotes') as string) ?? '').trim()
    await updateKnowledgeBaseNotes(notes)
    await logAuditEvent({
      action: 'PROJECT_UPDATE',
      actor: {
        id: currentSession.user.id,
        email: currentSession.user.email,
        role: currentSession.user.role,
        name: currentSession.user.name,
      },
      target: {
        type: 'project',
        label: 'Knowledge base notes',
      },
      details: {
        notesLength: notes.length,
      },
    })
    revalidatePath('/admin/knowledge')
    redirect('/admin/knowledge?saved=1')
  }

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-6 py-10">
      <div className="flex flex-col gap-3">
        <BackLink href="/admin" label="Back to admin" />
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Knowledge Base' }]} />
      </div>

      <div>
        <p className="text-sm font-medium text-neutral-500">Admin</p>
        <h1 className="text-2xl font-semibold">Knowledge Base</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Refresh the public-site crawl and maintain admin-only notes that the AI can use in answers.
        </p>
      </div>

      {params.refreshed ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Knowledge base refreshed from public pages.
        </div>
      ) : null}
      {params.saved ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Knowledge base notes saved.
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-neutral-500">Last refresh</p>
          <p className="mt-2 text-sm font-medium text-neutral-900">
            {knowledgeBase.updatedAt
              ? new Intl.DateTimeFormat('en-US', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                }).format(new Date(knowledgeBase.updatedAt))
              : 'Not refreshed yet'}
          </p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-neutral-500">Crawled pages</p>
          <p className="mt-2 text-2xl font-semibold text-neutral-900">{knowledgeBase.pages.length}</p>
        </div>
        <div className="rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
          <p className="text-xs uppercase tracking-wide text-neutral-500">Source origin</p>
          <p className="mt-2 break-all text-sm font-medium text-neutral-900">
            {knowledgeBase.sourceOrigin || 'Will be set on first refresh'}
          </p>
        </div>
      </div>

      <form action={refreshKnowledgeAction} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">Refresh Public Crawl</h2>
            <p className="mt-1 text-sm text-neutral-600">
              Crawls only public pages. Paths containing `/admin`, `/login`, or `/private` are excluded.
            </p>
          </div>
          <button
            type="submit"
            className="w-fit rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
          >
            Refresh Knowledge Base
          </button>
        </div>
      </form>

      <form action={saveNotesAction} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-neutral-900">Admin Notes</h2>
          <p className="text-sm text-neutral-600">
            Add extra guidance for the assistant, such as preferred phrasing, FAQs, or temporary notes not visible on the public site.
          </p>
        </div>

        <textarea
          name="adminNotes"
          defaultValue={knowledgeBase.adminNotes}
          rows={10}
          className="mt-4 w-full rounded-lg border border-neutral-300 px-4 py-3 text-sm shadow-sm outline-none transition focus:border-black"
          placeholder="Example: When users ask about consultations, recommend the contact page and mention that project scope, location, and approximate timeline help the team respond faster."
        />

        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="rounded-md border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:text-black"
          >
            Save Notes
          </button>
        </div>
      </form>

      <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-neutral-900">Crawled URLs</h2>
        <div className="mt-4 space-y-3">
          {knowledgeBase.pages.length === 0 ? (
            <p className="text-sm text-neutral-600">No public pages have been crawled yet.</p>
          ) : (
            knowledgeBase.pages.map((page) => (
              <div key={page.pathname} className="rounded-lg border border-neutral-200 px-4 py-3">
                <p className="text-sm font-medium text-neutral-900">{page.title || page.pathname}</p>
                <p className="mt-1 text-xs text-neutral-500">{page.pathname}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  )
}
