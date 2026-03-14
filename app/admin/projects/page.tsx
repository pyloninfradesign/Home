import Link from 'next/link'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { logAuditEvent } from '@/lib/audit'
import { BackLink } from '@/components/admin/back-link'
import { Breadcrumb } from '@/components/admin/breadcrumb'
import { deleteProject, getProjects } from '@/lib/projects'

const ADMIN_ROLES = new Set(['admin', 'manager'])

export default async function ProjectsAdminPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const params = await searchParams
  const projects = await getProjects()

  async function deleteProjectAction(formData: FormData) {
    'use server'

    const session = await auth()
    if (!session?.user || !ADMIN_ROLES.has(session.user.role ?? '')) {
      redirect('/api/auth/signin?callbackUrl=/admin/projects')
    }

    const slug = (formData.get('slug') as string) ?? ''
    const project = projects.find((item) => item.slug === slug)
    await deleteProject(slug)
    revalidatePath('/')
    revalidatePath('/projects')
    revalidatePath('/admin/projects')
    await logAuditEvent({
      action: 'PROJECT_DELETE',
      actor: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
        name: session.user.name,
      },
      target: {
        type: 'project',
        id: project?.projectId,
        label: project?.title ?? slug,
      },
      details: {
        slug,
      },
    })
    redirect('/admin/projects?deleted=1')
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 py-10">
      <div className="flex flex-col gap-3">
        <BackLink href="/admin" label="Back to admin" />
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Projects' }]} />
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-neutral-500">Admin</p>
          <h1 className="text-2xl font-semibold">Projects</h1>
        </div>
        <Link
          href="/admin/projects/new"
          className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          New Project
        </Link>
      </div>
      {params.deleted ? (
        <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Project deleted successfully.
        </div>
      ) : null}
      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-neutral-200 text-sm">
          <thead className="bg-neutral-50">
            <tr className="text-left text-neutral-500">
              <th className="px-4 py-3 font-medium">Project</th>
              <th className="px-4 py-3 font-medium">ID</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Hero</th>
              <th className="px-4 py-3 font-medium">Created</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {projects.map((project) => (
              <tr key={project.slug}>
                <td className="px-4 py-3">
                  <div className="font-medium text-neutral-900">{project.title}</div>
                  <div className="text-xs text-neutral-500">/{project.slug}</div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-neutral-600">
                  {project.projectId ?? 'Seed project'}
                </td>
                <td className="px-4 py-3 text-neutral-600">{project.location}</td>
                <td className="px-4 py-3 text-neutral-600">
                  {project.featuredInHero ? 'Featured' : 'Standard'}
                </td>
                <td className="px-4 py-3 text-neutral-600">
                  {project.createdAt
                    ? new Intl.DateTimeFormat('en-US', {
                        dateStyle: 'medium',
                        timeStyle: 'short',
                      }).format(new Date(project.createdAt))
                    : '-'}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/projects/${project.slug}`}
                      className="text-sm font-medium text-neutral-900 hover:text-black"
                    >
                      Edit
                    </Link>
                    <form
                      action={deleteProjectAction}
                    >
                      <input type="hidden" name="slug" value={project.slug} />
                      <button
                        type="submit"
                        className="rounded-md border border-rose-200 px-2.5 py-1 text-xs font-medium text-rose-700 transition hover:border-rose-300 hover:bg-rose-50"
                      >
                        Delete
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  )
}
