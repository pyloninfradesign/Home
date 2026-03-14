import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { ProjectGrid } from '@/components/projects/project-grid'
import { getFilterCategories, getProjects } from '@/lib/projects'

export const metadata: Metadata = {
  title: 'Projects | Pylon Infra Design',
  description:
    'A curated selection of architectural, interior, structural, and urban design works by Pylon Infra Design.',
}

export default async function ProjectsPage() {
  const [projects, categories] = await Promise.all([
    getProjects(),
    getFilterCategories(),
  ])

  return (
    <>
      {/* Page Header */}
      <section className="bg-background pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground">
            Portfolio
          </p>
          <div className="mt-3 h-px w-16 bg-foreground" />
          <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Projects
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
            A curated selection of architectural, interior, structural, and
            urban design works that reflect our commitment to clarity,
            sustainability, and functional aesthetics.
          </p>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="bg-background pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <ProjectGrid projects={projects} categories={categories} />
        </div>
      </section>

      {/* CTA Footer */}
      <section className="bg-foreground py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl text-balance">
            {"Let's Build Something Exceptional"}
          </h2>
          <p className="mx-auto mt-4 max-w-md text-primary-foreground/60">
            We collaborate with clients to create architecture that is
            thoughtful, sustainable, and enduring.
          </p>
          <Link
            href="/contact"
            className="group mt-8 inline-flex items-center gap-2 bg-primary-foreground px-8 py-4 text-xs font-semibold tracking-[0.15em] uppercase text-foreground transition-all hover:bg-primary-foreground/90"
          >
            Start Your Project
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </section>
    </>
  )
}
