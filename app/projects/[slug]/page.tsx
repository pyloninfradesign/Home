import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { projects, getProjectBySlug } from '@/lib/projects'

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  if (!project) return { title: 'Project Not Found' }
  return {
    title: `${project.title} | Pylon Infra Design`,
    description: project.description,
  }
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  const currentIndex = projects.findIndex((p) => p.slug === slug)
  const prevProject = currentIndex > 0 ? projects[currentIndex - 1] : null
  const nextProject =
    currentIndex < projects.length - 1 ? projects[currentIndex + 1] : null

  return (
    <>
      {/* Hero Image */}
      <section className="relative h-[60vh] w-full overflow-hidden bg-foreground lg:h-[70vh]">
        <Image
          src={project.image}
          alt={project.title}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-foreground/40" />

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="mx-auto w-full max-w-7xl px-6 pb-16 lg:px-8 lg:pb-20">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary-foreground/60">
              {project.category}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl">
              {project.title}
            </h1>
            <p className="mt-2 text-lg text-primary-foreground/80">
              {project.location}
            </p>
          </div>
        </div>
      </section>

      {/* Project Overview */}
      <section className="bg-background py-20 lg:py-28">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-5">
            {/* Left: Description */}
            <div className="lg:col-span-3">
              <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground">
                Overview
              </p>
              <div className="mt-3 h-px w-16 bg-foreground" />
              <p className="mt-8 text-lg leading-relaxed text-foreground/80">
                {project.description}
              </p>

              <h3 className="mt-12 text-sm font-semibold tracking-[0.1em] uppercase text-foreground">
                Design Intent
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {project.designIntent}
              </p>

              <h3 className="mt-10 text-sm font-semibold tracking-[0.1em] uppercase text-foreground">
                Challenges & Solutions
              </h3>
              <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                {project.challenges}
              </p>
            </div>

            {/* Right: Details */}
            <div className="lg:col-span-2">
              <div className="border-t border-border bg-muted p-8">
                <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                  Project Details
                </h3>

                <div className="mt-8 flex flex-col gap-6">
                  <div>
                    <p className="text-xs tracking-[0.1em] uppercase text-muted-foreground">
                      Type
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {project.details.type}
                    </p>
                  </div>
                  <div className="h-px bg-border" />
                  <div>
                    <p className="text-xs tracking-[0.1em] uppercase text-muted-foreground">
                      Area
                    </p>
                    <p className="mt-1 font-mono text-sm text-foreground">
                      {project.details.area}
                    </p>
                  </div>
                  <div className="h-px bg-border" />
                  <div>
                    <p className="text-xs tracking-[0.1em] uppercase text-muted-foreground">
                      Status
                    </p>
                    <p className="mt-1 text-sm font-medium text-foreground">
                      {project.details.status}
                    </p>
                  </div>
                  <div className="h-px bg-border" />
                  <div>
                    <p className="text-xs tracking-[0.1em] uppercase text-muted-foreground">
                      Services
                    </p>
                    <ul className="mt-2 flex flex-col gap-1">
                      {project.details.services.map((service) => (
                        <li
                          key={service}
                          className="text-sm text-foreground"
                        >
                          {service}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Project Navigation */}
      <section className="border-t border-border bg-background py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {prevProject ? (
              <Link
                href={`/projects/${prevProject.slug}`}
                className="group flex items-center gap-3 text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowLeft
                  size={16}
                  className="transition-transform group-hover:-translate-x-1"
                />
                <div>
                  <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                    Previous
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {prevProject.title}
                  </p>
                </div>
              </Link>
            ) : (
              <div />
            )}

            <Link
              href="/projects"
              className="text-xs font-medium tracking-[0.15em] uppercase text-muted-foreground transition-colors hover:text-foreground"
            >
              All Projects
            </Link>

            {nextProject ? (
              <Link
                href={`/projects/${nextProject.slug}`}
                className="group flex items-center gap-3 text-right text-muted-foreground transition-colors hover:text-foreground"
              >
                <div>
                  <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                    Next
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {nextProject.title}
                  </p>
                </div>
                <ArrowRight
                  size={16}
                  className="transition-transform group-hover:translate-x-1"
                />
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </section>
    </>
  )
}
