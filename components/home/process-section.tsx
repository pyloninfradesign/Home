'use client'

import { useEffect, useRef, useState } from 'react'
import { cn } from '@/lib/utils'

const processSteps = [
  {
    number: '01',
    title: 'Initial Consultation',
    description:
      'We begin with understanding your vision, requirements, site context, and aspirations through in-depth dialogue.',
  },
  {
    number: '02',
    title: 'Design Development',
    description:
      'Iterative design exploration using BIM, 3Ds Max, and SketchUp to create detailed 3D models and spatial solutions.',
  },
  {
    number: '03',
    title: 'Construction Documentation',
    description:
      'Comprehensive technical drawings, specifications, and documentation ready for precise construction execution.',
  },
  {
    number: '04',
    title: 'Construction Administration',
    description:
      'On-site oversight and project management ensuring design intent is faithfully translated into built reality.',
  },
]

export function ProcessSection() {
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
            'transition-all duration-700',
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          )}
        >
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground">
            Process
          </p>
          <div className="mt-3 h-px w-16 bg-foreground" />
          <h2 className="mt-8 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Our Collaborative Design Process
          </h2>
        </div>

        {/* Steps */}
        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          {processSteps.map((step, index) => (
            <div
              key={step.number}
              className={cn(
                'relative transition-all duration-700',
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              )}
              style={{ transitionDelay: `${300 + index * 150}ms` }}
            >
              {/* Connector Line */}
              {index < processSteps.length - 1 && (
                <div className="absolute top-8 left-16 hidden h-px w-full bg-border lg:block" />
              )}

              <span className="block font-mono text-4xl font-bold text-border">
                {step.number}
              </span>
              <h3 className="mt-4 text-sm font-semibold tracking-[0.1em] uppercase text-foreground">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
