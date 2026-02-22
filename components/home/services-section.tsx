'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const services = [
  {
    number: '01',
    title: 'Architectural Design',
    description:
      'Comprehensive building design from concept through construction, integrating BIM workflows and 3D modeling for precision and clarity.',
  },
  {
    number: '02',
    title: 'Interior Design',
    description:
      'Thoughtful interior spaces that balance aesthetics with functionality, creating environments that inspire and perform.',
  },
  {
    number: '03',
    title: 'Structural Design',
    description:
      'Engineering excellence in structural systems, ensuring safety, durability, and material efficiency across all project types.',
  },
  {
    number: '04',
    title: 'Project Management',
    description:
      'End-to-end project oversight from planning to handover, ensuring quality, timeline adherence, and budget control.',
  },
  {
    number: '05',
    title: 'Quantity Survey & Estimation',
    description:
      'Detailed cost analysis and quantity surveying to deliver accurate budgets and optimize resource allocation.',
  },
]

export function ServicesSection() {
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
    <section ref={sectionRef} className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={cn(
            'transition-all duration-700',
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          )}
        >
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground">
            Services
          </p>
          <div className="mt-3 h-px w-16 bg-foreground" />
          <h2 className="mt-8 max-w-2xl text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Comprehensive Architectural & Design Services
          </h2>
        </div>

        {/* Services List */}
        <div className="mt-16">
          {services.map((service, index) => (
            <div
              key={service.number}
              className={cn(
                'group flex flex-col gap-6 border-t border-border py-8 transition-all duration-700 md:flex-row md:items-start md:gap-12 md:py-10',
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-6 opacity-0'
              )}
              style={{ transitionDelay: `${200 + index * 100}ms` }}
            >
              <span className="font-mono text-xs text-muted-foreground">
                {service.number}
              </span>
              <h3 className="min-w-64 text-lg font-semibold text-foreground transition-colors group-hover:text-muted-foreground md:text-xl">
                {service.title}
              </h3>
              <p className="max-w-lg text-sm leading-relaxed text-muted-foreground">
                {service.description}
              </p>
              <ArrowUpRight
                size={18}
                className="ml-auto hidden shrink-0 text-muted-foreground/0 transition-all group-hover:text-muted-foreground md:block"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
