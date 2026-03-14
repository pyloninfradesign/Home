'use client'

import { useActionState, useMemo, useState } from 'react'
import { useFormStatus } from 'react-dom'
import type { Project } from '@/lib/projects'

interface ProjectFormState {
  status: 'idle' | 'success' | 'error'
  message?: string
  createdProjectId?: string
}

interface ProjectFormProps {
  action: (
    state: ProjectFormState,
    formData: FormData
  ) => Promise<ProjectFormState>
  projectIdPreview: string
  mode?: 'create' | 'edit'
  initialProject?: Project
  deleteAction?: (formData: FormData) => Promise<void>
}

function SubmitButton({ mode }: { mode: 'create' | 'edit' }) {
  const { pending } = useFormStatus()

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-fit rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-400"
    >
      {pending ? (mode === 'edit' ? 'Saving changes...' : 'Creating project...') : mode === 'edit' ? 'Save Changes' : 'Submit'}
    </button>
  )
}

export function ProjectForm({
  action,
  projectIdPreview,
  mode = 'create',
  initialProject,
  deleteAction,
}: ProjectFormProps) {
  const [state, formAction] = useActionState(action, { status: 'idle' })
  const [featuredInHero, setFeaturedInHero] = useState(initialProject?.featuredInHero ?? false)
  const [projectName, setProjectName] = useState(initialProject?.title ?? '')
  const [projectOverview, setProjectOverview] = useState(initialProject?.projectDetails ?? initialProject?.description ?? '')
  const [heroTitle, setHeroTitle] = useState(initialProject?.heroTitle ?? 'Strength in Structure.')
  const [heroSubtitle, setHeroSubtitle] = useState(initialProject?.heroSubtitle ?? 'Vision in Design.')
  const [heroDetails, setHeroDetails] = useState(initialProject?.heroDetails ?? initialProject?.heroExcerpt ?? '')
  const [designIntent, setDesignIntent] = useState(initialProject?.designIntent ?? '')
  const [challenges, setChallenges] = useState(initialProject?.challenges ?? '')
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [planFiles, setPlanFiles] = useState<File[]>([])
  const [heroPhotoSource, setHeroPhotoSource] = useState<string | null>(
    initialProject?.heroImage ? `existing:${initialProject.heroImage}` : null
  )

  const existingPhotos = initialProject?.photos ?? []
  const existingPlans = initialProject?.plans ?? []

  const detailsHelper = useMemo(() => {
    if (projectOverview.length === 0) return 'Minimum 200 characters.'
    if (projectOverview.length >= 200) return 'Project Overview length is valid.'
    return `${200 - projectOverview.length} more characters required.`
  }, [projectOverview])

  return (
    <div className="space-y-6">
      <form
        action={formAction}
        className="space-y-6 rounded-lg border border-neutral-200 bg-white p-6 shadow-sm"
      >
        <input type="hidden" name="existingSlug" value={initialProject?.slug ?? ''} />

        {state.status === 'error' && state.message ? (
          <div className="rounded-md border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {state.message}
          </div>
        ) : null}
        {state.status === 'success' ? (
          <div className="rounded-md border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            {mode === 'edit'
              ? 'Project updated successfully.'
              : `Project created successfully with ID: ${state.createdProjectId}.`}
          </div>
        ) : null}

        <section className="space-y-4">
          <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-4">
            <label className="flex items-start gap-3">
              <input
                type="checkbox"
                name="featuredInHero"
                checked={featuredInHero}
                onChange={(event) => setFeaturedInHero(event.target.checked)}
                className="mt-1 h-4 w-4 rounded border-neutral-300"
              />
              <div className="space-y-1">
                <span className="text-sm font-medium text-neutral-900">
                  Feature this project in the Hero section of the home page?
                </span>
                <p className="text-sm text-neutral-600">
                  Featured projects require a Hero Photo plus hero content below.
                </p>
              </div>
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="projectName" className="text-sm font-medium text-neutral-800">
                Project Name *
              </label>
              <input
                id="projectName"
                name="projectName"
                type="text"
                required
                maxLength={100}
                value={projectName}
                onChange={(event) => setProjectName(event.target.value)}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
                placeholder="Downtown Residential Tower"
              />
              <p className="text-xs text-neutral-500">{projectName.length}/100 characters</p>
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="projectId" className="text-sm font-medium text-neutral-800">
                Project ID
              </label>
              <input
                id="projectId"
                value={projectIdPreview}
                readOnly
                disabled
                className="rounded-md border border-neutral-200 bg-neutral-100 px-3 py-2 text-sm text-neutral-500"
              />
              <input type="hidden" name="projectIdPreview" value={projectIdPreview} />
              <p className="text-xs text-neutral-500">
                Auto-generated and not editable.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="projectLocation" className="text-sm font-medium text-neutral-800">
              Project Location *
            </label>
            <input
              id="projectLocation"
              name="projectLocation"
              type="text"
              required
              defaultValue={initialProject?.location ?? ''}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
              placeholder="123 Main Street, Cityville, CA 90210"
            />
          </div>

        </section>

        <section className="space-y-4 border-t border-neutral-200 pt-6">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-neutral-900">Hero Section Content</h2>
            <p className="text-sm text-neutral-600">
              This content is shown on the home page hero slider when the project is featured.
            </p>
            <p className="text-xs text-neutral-500">
              Home page mapping: headline line 1, headline line 2, then the short supporting text below it.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex flex-col gap-1">
              <label htmlFor="heroTitle" className="text-sm font-medium text-neutral-800">
                Header Data Line 1
              </label>
              <p className="text-xs text-neutral-500">
                Home page hero headline, first line.
              </p>
              <input
                id="heroTitle"
                name="heroTitle"
                type="text"
                value={heroTitle}
                onChange={(event) => setHeroTitle(event.target.value)}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
                placeholder="Iconic Presence."
              />
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="heroSubtitle" className="text-sm font-medium text-neutral-800">
                Header Data Line 2
              </label>
              <p className="text-xs text-neutral-500">
                Home page hero headline, second line.
              </p>
              <input
                id="heroSubtitle"
                name="heroSubtitle"
                type="text"
                value={heroSubtitle}
                onChange={(event) => setHeroSubtitle(event.target.value)}
                className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
                placeholder="Institutional Clarity."
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="heroDetails" className="text-sm font-medium text-neutral-800">
              Details Data
            </label>
            <p className="text-xs text-neutral-500">
              Short home page summary under the hero headline.
            </p>
            <textarea
              id="heroDetails"
              name="heroDetails"
              rows={4}
              value={heroDetails}
              onChange={(event) => setHeroDetails(event.target.value)}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
              placeholder="A bold, contemporary gate structure for one of India's premier medical institutions, shaped to express structural confidence and institutional gravitas."
            />
          </div>
        </section>

        <section className="space-y-4 border-t border-neutral-200 pt-6">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-neutral-900">Project Detail Page Content</h2>
            <p className="text-sm text-neutral-600">
              These fields map directly to the sections on the individual project page.
            </p>
            <p className="text-xs text-neutral-500">
              Project page mapping: Overview, Design Intent, and Challenges & Solutions.
            </p>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="projectOverview" className="text-sm font-medium text-neutral-800">
              Overview *
            </label>
            <p className="text-xs text-neutral-500">
              This is the first long paragraph on the project detail page.
            </p>
            <textarea
              id="projectOverview"
              name="projectOverview"
              required
              minLength={200}
              rows={8}
              value={projectOverview}
              onChange={(event) => setProjectOverview(event.target.value)}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
              placeholder="A bold, contemporary gate structure for one of India's premier medical institutions. The design combines structural expressiveness with institutional gravitas."
            />
            <p className="text-xs text-neutral-500">{detailsHelper}</p>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="designIntent" className="text-sm font-medium text-neutral-800">
              Design Intent *
            </label>
            <p className="text-xs text-neutral-500">
              This appears in the dedicated Design Intent section.
            </p>
            <textarea
              id="designIntent"
              name="designIntent"
              required
              rows={5}
              value={designIntent}
              onChange={(event) => setDesignIntent(event.target.value)}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
              placeholder="To create an iconic entry point that reflects the prestige and modernity of the institution while supporting functional security and traffic management."
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="challenges" className="text-sm font-medium text-neutral-800">
              Challenges & Solutions *
            </label>
            <p className="text-xs text-neutral-500">
              This appears in the Challenges & Solutions section.
            </p>
            <textarea
              id="challenges"
              name="challenges"
              required
              rows={5}
              value={challenges}
              onChange={(event) => setChallenges(event.target.value)}
              className="rounded-md border border-neutral-300 px-3 py-2 text-sm shadow-sm focus:border-black focus:outline-none"
              placeholder="Designing a structurally expressive gate that meets security requirements, manages high traffic volumes, and remains a recognizable landmark."
            />
          </div>
        </section>

        <section className="space-y-4 border-t border-neutral-200 pt-6">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-neutral-900">Project Photos</h2>
            <p className="text-sm text-neutral-600">
              Upload up to 10 JPG, PNG, or GIF files. Maximum 5MB per photo.
            </p>
          </div>

          {existingPhotos.length > 0 ? (
            <div className="space-y-3 rounded-md border border-neutral-200 p-4">
              <p className="text-sm font-medium text-neutral-900">Current photos</p>
              <div className="space-y-2">
                {existingPhotos.map((photo) => (
                  <div
                    key={photo.url}
                    className="flex items-center justify-between gap-4 rounded-md border border-neutral-200 px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-neutral-800">{photo.name}</p>
                      <p className="truncate text-xs text-neutral-500">{photo.url}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 text-xs uppercase tracking-wide text-neutral-600">
                        <input
                          type="radio"
                          name="heroPhotoSource"
                          value={`existing:${photo.url}`}
                          checked={heroPhotoSource === `existing:${photo.url}`}
                          onChange={() => setHeroPhotoSource(`existing:${photo.url}`)}
                        />
                        Hero Photo
                      </label>
                      <label className="flex items-center gap-2 text-xs text-rose-700">
                        <input type="checkbox" name="removePhotoUrls" value={photo.url} />
                        Remove
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-2">
            <input
              id="projectPhotos"
              name="photos"
              type="file"
              accept=".jpg,.jpeg,.png,.gif,image/jpeg,image/png,image/gif"
              multiple
              onChange={(event) => {
                const files = Array.from(event.target.files ?? [])
                setPhotoFiles(files)
                if (files.length > 0 && !heroPhotoSource) {
                  setHeroPhotoSource('new:0')
                }
              }}
              className="rounded-md border border-dashed border-neutral-300 px-3 py-4 text-sm"
            />
            <p className="text-xs text-neutral-500">{photoFiles.length} new photos selected</p>
          </div>

          {photoFiles.length > 0 ? (
            <div className="space-y-3 rounded-md border border-neutral-200 p-4">
              <p className="text-sm font-medium text-neutral-900">New photos</p>
              <div className="space-y-2">
                {photoFiles.map((file, index) => (
                  <label
                    key={`${file.name}-${index}`}
                    className="flex items-center justify-between rounded-md border border-neutral-200 px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium text-neutral-800">{file.name}</p>
                      <p className="text-xs text-neutral-500">
                        {(file.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="heroPhotoSource"
                        value={`new:${index}`}
                        checked={heroPhotoSource === `new:${index}`}
                        onChange={() => setHeroPhotoSource(`new:${index}`)}
                      />
                      <span className="text-xs uppercase tracking-wide text-neutral-600">
                        Hero Photo
                      </span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          ) : null}
        </section>

        <section className="space-y-4 border-t border-neutral-200 pt-6">
          <div className="space-y-1">
            <h2 className="text-base font-semibold text-neutral-900">Project Plans</h2>
            <p className="text-sm text-neutral-600">
              Upload up to 5 PDF, DOCX, DOC, or TXT files.
            </p>
          </div>

          {existingPlans.length > 0 ? (
            <div className="space-y-3 rounded-md border border-neutral-200 p-4">
              <p className="text-sm font-medium text-neutral-900">Current plans</p>
              <div className="space-y-2">
                {existingPlans.map((plan) => (
                  <div
                    key={plan.url}
                    className="flex items-center justify-between gap-4 rounded-md border border-neutral-200 px-3 py-2 text-sm"
                  >
                    <div className="min-w-0">
                      <p className="truncate font-medium text-neutral-800">{plan.name}</p>
                      <p className="truncate text-xs text-neutral-500">{plan.url}</p>
                    </div>
                    <label className="flex items-center gap-2 text-xs text-rose-700">
                      <input type="checkbox" name="removePlanUrls" value={plan.url} />
                      Remove
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          <input
            id="projectPlans"
            name="plans"
            type="file"
            accept=".pdf,.doc,.docx,.txt,application/pdf,text/plain,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            multiple
            onChange={(event) => setPlanFiles(Array.from(event.target.files ?? []))}
            className="rounded-md border border-dashed border-neutral-300 px-3 py-4 text-sm"
          />

          {planFiles.length > 0 ? (
            <div className="rounded-md border border-neutral-200 p-4">
              <p className="text-sm font-medium text-neutral-900">{planFiles.length} new plans selected</p>
              <ul className="mt-3 space-y-2 text-sm text-neutral-600">
                {planFiles.map((file, index) => (
                  <li key={`${file.name}-${index}`}>{file.name}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </section>

        <div className="flex items-start justify-between gap-4 border-t border-neutral-200 pt-6">
          <p className="max-w-2xl text-xs text-neutral-500">
            All fields marked with an asterisk are required. The hero section uses the Hero
            Section Content fields, and the project detail page uses Overview, Design Intent,
            and Challenges & Solutions.
          </p>
          <SubmitButton mode={mode} />
        </div>
      </form>

      {mode === 'edit' && deleteAction ? (
        <form
          action={deleteAction}
          className="rounded-lg border border-rose-200 bg-rose-50 p-6 shadow-sm"
          onSubmit={(event) => {
            if (!window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
              event.preventDefault()
            }
          }}
        >
          <input type="hidden" name="slug" value={initialProject?.slug ?? ''} />
          <div className="flex items-start justify-between gap-4">
            <div>
              <h2 className="text-base font-semibold text-rose-900">Delete Project</h2>
              <p className="mt-1 text-sm text-rose-700">
                This removes the project from the projects list, hero section, and local project store.
              </p>
            </div>
            <button
              type="submit"
              className="rounded-md bg-rose-700 px-4 py-2 text-sm font-medium text-white transition hover:bg-rose-800"
            >
              Delete
            </button>
          </div>
        </form>
      ) : null}
    </div>
  )
}
