'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { Project } from '@/lib/projects'

interface ProjectGridProps {
  projects: Project[]
  categories: string[]
}

export function ProjectGrid({ projects, categories }: ProjectGridProps) {
  const [activeFilter, setActiveFilter] = useState('All')

  const filteredProjects =
    activeFilter === 'All'
      ? projects
      : projects.filter((p) => p.filterCategory === activeFilter)

  return (
    <div>
      {/* Filter Bar */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveFilter(category)}
            className={cn(
              'px-5 py-2 text-xs font-medium tracking-[0.1em] uppercase transition-all duration-300',
              activeFilter === category
                ? 'bg-foreground text-primary-foreground'
                : 'bg-transparent text-muted-foreground hover:text-foreground'
            )}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Project Grid */}
      <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.map((project, index) => (
          <Link
            key={project.slug}
            href={`/projects/${project.slug}`}
            className="group"
            style={{
              animationDelay: `${index * 80}ms`,
            }}
          >
            <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
              <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/40" />

              {/* Hover Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <div className="translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                  <p className="text-xs tracking-[0.2em] uppercase text-primary-foreground/60">
                    {project.category}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-primary-foreground">
                    {project.title}
                  </h3>
                  <p className="text-sm text-primary-foreground/80">
                    {project.location}
                  </p>
                </div>
              </div>
            </div>

            {/* Below Image Info (always visible) */}
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-foreground">
                {project.title}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {project.location}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
