'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Project } from '@/lib/projects'

interface FeaturedProjectsSectionProps {
  projects: Project[]
}

export function FeaturedProjectsSection({
  projects,
}: FeaturedProjectsSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="bg-muted py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={cn(
            'flex items-end justify-between transition-all duration-700',
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          )}
        >
          <div>
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground">
              Featured Work
            </p>
            <div className="mt-3 h-px w-16 bg-foreground" />
            <h2 className="mt-8 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              Selected Projects
            </h2>
          </div>
          <Link
            href="/projects"
            className="hidden items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase text-foreground transition-opacity hover:opacity-70 md:flex"
          >
            View All
            <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Projects Grid */}
        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-3">
          {projects.map((project, index) => (
            <Link
              key={project.slug}
              href={`/projects/${project.slug}`}
              className={cn(
                'group relative overflow-hidden transition-all duration-700',
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-12 opacity-0',
                index === 0 ? 'md:col-span-2 md:row-span-2' : ''
              )}
              style={{ transitionDelay: `${200 + index * 150}ms` }}
            >
              <div
                className={cn(
                  'relative overflow-hidden',
                  index === 0 ? 'aspect-[4/3]' : 'aspect-[3/2]'
                )}
              >
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-foreground/0 transition-colors duration-500 group-hover:bg-foreground/30" />

                {/* Overlay Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <div className="translate-y-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                    <p className="text-xs tracking-[0.2em] uppercase text-primary-foreground/70">
                      {project.category}
                    </p>
                  </div>
                  <h3 className="mt-2 text-lg font-semibold text-primary-foreground md:text-xl">
                    {project.title}
                  </h3>
                  <p className="text-sm text-primary-foreground/80">
                    {project.location}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile: View All */}
        <div className="mt-10 md:hidden">
          <Link
            href="/projects"
            className="flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase text-foreground"
          >
            View All Projects
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
