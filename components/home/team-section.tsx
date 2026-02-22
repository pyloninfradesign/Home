'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const teamMembers = [
  {
    name: 'Payoswini Priyadarshini',
    role: 'Founder ',
    image: '/images/team-founder.jpg',
  },
  {
    name: 'Ar. Jyotsnamayee Sahoo',
    role: 'Head Architect',
    image: '/images/team-architect.jpg',
  },
  {
    name: 'Prabin Kumar Satapathy',
    role: 'Structural Engineer',
    image: '/images/team-engineer.jpg',
  },
  {
    name: 'Puravi Mohapatra',
    role: 'Design Lead',
    image: '/images/team-designer.jpg',
  },
  {
    name: 'Saptarsini Roul',
    role: 'Design Team',
    image: '/images/Sapt.jpg',
  },
  {
    name: 'Sunita panigrahi',
    role: 'Design Team',
    image: '/images/Sunita.jpg',
  },
]

export function TeamSection() {
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
            Team
          </p>
          <div className="mt-3 h-px w-16 bg-foreground" />
          <h2 className="mt-8 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Our Strength Lies in Our People
          </h2>
        </div>

        {/* Team Grid */}
        <div className="mt-14 grid grid-cols-2 gap-6 lg:grid-cols-4">
          {teamMembers.map((member, index) => (
            <div
              key={member.name}
              className={cn(
                'group transition-all duration-700',
                isVisible
                  ? 'translate-y-0 opacity-100'
                  : 'translate-y-8 opacity-0'
              )}
              style={{ transitionDelay: `${300 + index * 100}ms` }}
            >
              <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
                <Image
                  src={member.image}
                  alt={member.name}
                  fill
                  className="object-cover grayscale transition-all duration-500 group-hover:scale-105 group-hover:grayscale-0"
                />
              </div>
              <h3 className="mt-4 text-sm font-semibold text-foreground">
                {member.name}
              </h3>
              <p className="mt-1 text-xs text-muted-foreground">
                {member.role}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div
          className={cn(
            'mt-14 transition-all delay-700 duration-700',
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          )}
        >
          <Link
            href="/firm"
            className="group inline-flex items-center gap-2 text-xs font-medium tracking-[0.15em] uppercase text-foreground transition-opacity hover:opacity-70"
          >
            Meet the Full Team
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </Link>
        </div>
      </div>
    </section>
  )
}
