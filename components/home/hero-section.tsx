'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

const heroSlides = [
  {
    image: '/images/circuit-house.jpg',
    title: 'Circuit House',
    location: 'Phulbani, Odisha',
    category: 'Government Architecture',
  },
  {
    image: '/images/hostel-kalahandi.jpg',
    title: '50-Bedded Hostel',
    location: 'Dumarpadar, Kalahandi',
    category: 'Institutional Architecture',
  },
  {
    image: '/images/beautification-airport.jpg',
    title: 'Airport Road Beautification',
    location: 'Jharsuguda, Odisha',
    category: 'Urban Design',
  },
]

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const goToSlide = useCallback(
    (index: number) => {
      if (isTransitioning) return
      setIsTransitioning(true)
      setCurrentSlide(index)
      setTimeout(() => setIsTransitioning(false), 700)
    },
    [isTransitioning]
  )

  const nextSlide = useCallback(() => {
    goToSlide((currentSlide + 1) % heroSlides.length)
  }, [currentSlide, goToSlide])

  const prevSlide = useCallback(() => {
    goToSlide(
      (currentSlide - 1 + heroSlides.length) % heroSlides.length
    )
  }, [currentSlide, goToSlide])

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000)
    return () => clearInterval(timer)
  }, [nextSlide])

  return (
    <section className="relative h-screen w-full overflow-hidden bg-foreground">
      {/* Slides */}
      {heroSlides.map((slide, index) => (
        <div
          key={slide.title}
          className={cn(
            'absolute inset-0 transition-opacity duration-700',
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          )}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 h-full w-full object-cover"
            fetchPriority={index === 0 ? 'high' : 'auto'}
          />
          <div className="absolute inset-0 bg-foreground/50" />
        </div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex h-full flex-col justify-end px-6 pb-24 lg:px-8">
        <div className="mx-auto w-full max-w-7xl">
          {/* Slide Info */}
          <div className="mb-8">
            <p className="text-xs font-medium tracking-[0.3em] uppercase text-primary-foreground/60">
              {heroSlides[currentSlide].category}
            </p>
            <h2 className="mt-2 text-2xl font-light tracking-wide text-primary-foreground md:text-3xl">
              {heroSlides[currentSlide].title}
            </h2>
            <p className="mt-1 text-sm text-primary-foreground/70">
              {heroSlides[currentSlide].location}
            </p>
          </div>

          {/* Divider */}
          <div className="mb-10 h-px w-full bg-primary-foreground/20" />

          {/* Headline */}
          <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-primary-foreground md:text-6xl lg:text-7xl">
            <span className="block">Strength in Structure.</span>
            <span className="block font-light italic text-primary-foreground/80">
              Vision in Design.
            </span>
          </h1>

          <p className="mt-6 max-w-lg text-sm leading-relaxed text-primary-foreground/70 md:text-base">
            Contemporary architecture shaped by clarity, sustainability, and
            technical precision.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap gap-4">
            <Link
              href="/projects"
              className="group flex items-center gap-2 bg-primary-foreground px-8 py-4 text-xs font-semibold tracking-[0.15em] uppercase text-foreground transition-all hover:bg-primary-foreground/90"
            >
              View Projects
              <ArrowRight
                size={14}
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
            <Link
              href="/contact"
              className="flex items-center gap-2 border border-primary-foreground/30 px-8 py-4 text-xs font-semibold tracking-[0.15em] uppercase text-primary-foreground transition-all hover:border-primary-foreground/60"
            >
              Schedule a Consultation
            </Link>
          </div>

          {/* Slide Controls */}
          <div className="mt-12 flex items-center gap-4">
            <button
              onClick={prevSlide}
              aria-label="Previous slide"
              className="flex h-10 w-10 items-center justify-center border border-primary-foreground/20 text-primary-foreground/60 transition-colors hover:border-primary-foreground/50 hover:text-primary-foreground"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex gap-2">
              {heroSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={cn(
                    'h-0.5 transition-all duration-500',
                    index === currentSlide
                      ? 'w-12 bg-primary-foreground'
                      : 'w-6 bg-primary-foreground/30'
                  )}
                />
              ))}
            </div>
            <button
              onClick={nextSlide}
              aria-label="Next slide"
              className="flex h-10 w-10 items-center justify-center border border-primary-foreground/20 text-primary-foreground/60 transition-colors hover:border-primary-foreground/50 hover:text-primary-foreground"
            >
              <ChevronRight size={16} />
            </button>
            <span className="ml-2 font-mono text-xs text-primary-foreground/40">
              {String(currentSlide + 1).padStart(2, '0')} / {String(heroSlides.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
