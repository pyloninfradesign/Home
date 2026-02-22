'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CTASection() {
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
    <section
      ref={sectionRef}
      className="bg-foreground py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div
          className={cn(
            'flex flex-col items-center text-center transition-all duration-700',
            isVisible
              ? 'translate-y-0 opacity-100'
              : 'translate-y-8 opacity-0'
          )}
        >
          <div className="h-px w-16 bg-primary-foreground/20" />

          <h2 className="mt-10 text-3xl font-bold tracking-tight text-primary-foreground md:text-5xl lg:text-6xl text-balance">
            {"Let's Create Your Vision"}
          </h2>

          <p className="mt-6 max-w-md text-base text-primary-foreground/60">
            We are ready to bring your architectural vision to life.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="group flex items-center gap-2 bg-primary-foreground px-8 py-4 text-xs font-semibold tracking-[0.15em] uppercase text-foreground transition-all hover:bg-primary-foreground/90"
            >
              Contact Us
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 border border-primary-foreground/30 px-8 py-4 text-xs font-semibold tracking-[0.15em] uppercase text-primary-foreground transition-all hover:border-primary-foreground/60"
            >
              Book a Consultation
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
