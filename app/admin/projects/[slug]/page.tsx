import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { logAuditEvent } from '@/lib/audit'
import { BackLink } from '@/components/admin/back-link'
import { Breadcrumb } from '@/components/admin/breadcrumb'
import { ProjectForm } from '@/components/admin/project-form'
import {
  createProjectIdPreview,
  deleteProject,
  getProjectBySlug,
  updateProject,
} from '@/lib/projects'

const ADMIN_ROLES = new Set(['admin', 'manager'])

interface ProjectFormState {
  status: 'idle' | 'success' | 'error'
  message?: string
  createdProjectId?: string
}

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const session = await auth()
  if (!session?.user) redirect('/api/auth/signin?callbackUrl=/admin/projects')
  if (!ADMIN_ROLES.has(session.user.role ?? '')) redirect('/')

  const { slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) notFound()

  async function updateProjectAction(
    _prevState: ProjectFormState,
    formData: FormData
  ): Promise<ProjectFormState> {
    'use server'

    const currentSession = await auth()
    if (!currentSession?.user || !ADMIN_ROLES.has(currentSession.user.role ?? '')) {
      redirect('/api/auth/signin?callbackUrl=/admin/projects')
    }

    try {
      const updated = await updateProject({
        slug: (formData.get('existingSlug') as string) ?? '',
        featuredInHero: formData.get('featuredInHero') === 'on',
        providedProjectId: (formData.get('projectIdPreview') as string) ?? undefined,
        name: (formData.get('projectName') as string) ?? '',
        overview: (formData.get('projectOverview') as string) ?? '',
        designIntent: (formData.get('designIntent') as string) ?? '',
        challenges: (formData.get('challenges') as string) ?? '',
        heroTitle: (formData.get('heroTitle') as string) ?? '',
        heroSubtitle: (formData.get('heroSubtitle') as string) ?? '',
        heroDetails: (formData.get('heroDetails') as string) ?? '',
        location: (formData.get('projectLocation') as string) ?? '',
        heroPhotoSource: (formData.get('heroPhotoSource') as string) ?? undefined,
        removePhotoUrls: formData.getAll('removePhotoUrls') as string[],
        removePlanUrls: formData.getAll('removePlanUrls') as string[],
        photos: formData.getAll('photos') as File[],
        plans: formData.getAll('plans') as File[],
      })

      revalidatePath('/')
      revalidatePath('/projects')
      revalidatePath(`/projects/${updated.slug}`)
      revalidatePath('/admin/projects')
      revalidatePath(`/admin/projects/${updated.slug}`)

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
          id: updated.projectId,
          label: updated.title,
        },
        details: {
          slug: updated.slug,
          featuredInHero: !!updated.featuredInHero,
        },
      })

      return { status: 'success' }
    } catch (error) {
      return {
        status: 'error',
        message: error instanceof Error ? error.message : 'Failed to update project.',
      }
    }
  }

  async function deleteProjectAction(formData: FormData) {
    'use server'

    const currentSession = await auth()
    if (!currentSession?.user || !ADMIN_ROLES.has(currentSession.user.role ?? '')) {
      redirect('/api/auth/signin?callbackUrl=/admin/projects')
    }

    const targetSlug = (formData.get('slug') as string) ?? ''
    const targetProject = await getProjectBySlug(targetSlug)
    await deleteProject(targetSlug)
    revalidatePath('/')
    revalidatePath('/projects')
    revalidatePath('/admin/projects')

    await logAuditEvent({
      action: 'PROJECT_DELETE',
      actor: {
        id: currentSession.user.id,
        email: currentSession.user.email,
        role: currentSession.user.role,
        name: currentSession.user.name,
      },
      target: {
        type: 'project',
        id: targetProject?.projectId,
        label: targetProject?.title ?? targetSlug,
      },
      details: {
        slug: targetSlug,
      },
    })
    redirect('/admin/projects?deleted=1')
  }

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 py-10">
      <div className="flex flex-col gap-3">
        <BackLink href="/admin/projects" label="Back to projects" />
        <Breadcrumb
          items={[
            { label: 'Admin', href: '/admin' },
            { label: 'Projects', href: '/admin/projects' },
            { label: project.title },
          ]}
        />
        <div>
          <p className="text-sm font-medium text-neutral-500">Admin</p>
          <h1 className="text-2xl font-semibold">Edit Project</h1>
          <p className="text-sm text-neutral-600">
            Update project content, files, and hero visibility. The project ID remains unchanged.
          </p>
        </div>
      </div>

      <ProjectForm
        action={updateProjectAction}
        projectIdPreview={project.projectId ?? createProjectIdPreview()}
        mode="edit"
        initialProject={project}
        deleteAction={deleteProjectAction}
      />
    </main>
  )
}
