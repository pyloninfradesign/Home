'use client'

import { useEffect, useRef, useState } from 'react'
import { Users, Leaf, Ruler } from 'lucide-react'
import { cn } from '@/lib/utils'

const pillars = [
  {
    icon: Users,
    title: 'Client-Centered Design',
    description:
      'Every project begins with listening. We craft architecture around the unique needs, aspirations, and contexts of those who will inhabit our spaces.',
  },
  {
    icon: Leaf,
    title: 'Sustainable Innovation',
    description:
      'We are committed to environmentally responsible design that minimizes impact while maximizing the quality and longevity of built environments.',
  },
  {
    icon: Ruler,
    title: 'Functional Aesthetics',
    description:
      'Beauty rooted in usability. Our designs achieve visual elegance through structural logic, material honesty, and spatial clarity.',
  },
]

export function PhilosophySection() {
  const sectionRef = useRef<HTMLElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} className="bg-background py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Section Label */}
        <div
          className={cn(
            'transition-all duration-700',
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          )}
        >
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground">
            Philosophy
          </p>
          <div className="mt-3 h-px w-16 bg-foreground" />
        </div>

        {/* Title + Text */}
        <div
          className={cn(
            'mt-10 grid grid-cols-1 gap-12 transition-all delay-200 duration-700 lg:grid-cols-2',
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          )}
        >
          <h2 className="text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl lg:text-5xl text-balance">
            Design Rooted in Purpose
          </h2>
          <p className="text-base leading-relaxed text-muted-foreground lg:text-lg">
            Pylon Infra Design is a contemporary practice built on stability,
            connection, and support. We create architecture that is thoughtful,
            sustainable, and enduring — guided by client-centered design and
            technical excellence.
          </p>
        </div>

        {/* 3 Pillars */}
        <div className="mt-20 grid grid-cols-1 gap-px bg-border md:grid-cols-3">
          {pillars.map((pillar, index) => {
            const Icon = pillar.icon
            return (
              <div
                key={pillar.title}
                className={cn(
                  'bg-background p-10 transition-all duration-700',
                  isVisible
                    ? 'translate-y-0 opacity-100'
                    : 'translate-y-8 opacity-0'
                )}
                style={{ transitionDelay: `${400 + index * 150}ms` }}
              >
                <Icon size={28} className="text-muted-foreground" strokeWidth={1.5} />
                <h3 className="mt-6 text-sm font-semibold tracking-[0.1em] uppercase text-foreground">
                  {pillar.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  {pillar.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
