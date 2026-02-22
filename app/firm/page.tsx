import type { Metadata } from 'next'
import Image from 'next/image'
import { Users, Leaf, Ruler, Monitor, Building2, Lightbulb } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Firm | Pylon Infra Design',
  description:
    'Learn about Pylon Infra Design — a contemporary architectural practice built on strength, clarity, and purpose.',
}

const values = [
  {
    icon: Users,
    title: 'Client-Centered',
    description:
      'Every project begins with listening. We design around the unique needs and aspirations of our clients.',
  },
  {
    icon: Leaf,
    title: 'Sustainable',
    description:
      'Committed to environmentally responsible design that minimizes impact and maximizes longevity.',
  },
  {
    icon: Ruler,
    title: 'Precise',
    description:
      'Technical excellence through BIM workflows, 3D modeling, and meticulous construction documentation.',
  },
  {
    icon: Monitor,
    title: 'Technology-Driven',
    description:
      'We utilize BIM, 3Ds Max, and SketchUp to create detailed 3D models and visualizations.',
  },
  {
    icon: Building2,
    title: 'Contextual',
    description:
      'Architecture deeply responsive to site, climate, culture, and the communities we serve.',
  },
  {
    icon: Lightbulb,
    title: 'Innovative',
    description:
      'Pushing boundaries while respecting the fundamentals of good design and structural integrity.',
  },
]

const teamMembers = [
  {
    name: 'Payoswini Priyadarshini',
    role: 'Founder',
    image: '/images/team-founder.jpg',
    bio: 'With over 15 years of experience in architectural practice, Payoswini founded Pylon Infra Design with a vision to create architecture that bridges vision and reality. His expertise spans institutional, residential, and urban design.',
  },
  {
    name: 'Ar. Jyotsnamayee Sahoo',
    role: 'Head Architect',
    image: '/images/team-architect.jpg',
    bio: 'Jyotsnamayee brings a refined design sensibility and deep knowledge of sustainable building practices. She leads the design team in translating complex briefs into elegant architectural solutions.',
  },
  {
    name: 'Prabin Kumar Satapathy',
    role: 'Structural Engineer',
    image: '/images/team-engineer.jpg',
    bio: 'Prabin ensures every structure we design is built to last. His structural engineering expertise guarantees safety, durability, and material efficiency across all project types.',
  },
  {
    name: 'Puravi Mohapatra',
    role: 'Design Lead',
    image: '/images/team-designer.jpg',
    bio: 'Puravi leads our interior and visualization team, bringing spaces to life through thoughtful material selection, lighting design, and spatial planning.',
  },
  {
    name: 'Saptarsini Roul',
    role: 'Design Team',
    image: '/images/Sapt.jpg',
    bio: 'Saptarsini leads our interior and visualization team, bringing spaces to life through thoughtful material selection, lighting design, and spatial planning.',
  },
  {
    name: 'Sunita panigrahi',
    role: 'Design Team',
    image: '/images/Sunita.jpg',
    bio: 'Sunita leads our interior and visualization team, bringing spaces to life through thoughtful material selection, lighting design, and spatial planning.',
  },
]

export default function FirmPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-background pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground">
            About Us
          </p>
          <div className="mt-3 h-px w-16 bg-foreground" />
          <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            The Firm
          </h1>
        </div>
      </section>

      {/* Who We Are */}
      <section className="bg-background pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                Who We Are
              </h2>
              <div className="mt-8 flex flex-col gap-6">
                <p className="text-base leading-relaxed text-muted-foreground">
                  Pylon Infra Design is a new-generation architectural practice
                  built on strength, clarity, and purpose. Our work bridges
                  vision and reality — transforming ideas into sustainable,
                  functional, and enduring spaces.
                </p>
                <p className="text-base leading-relaxed text-muted-foreground">
                  Guided by client-centered design and supported by advanced BIM
                  and 3D modeling technologies, we deliver architecture that is
                  both innovative and deeply contextual. Our portfolio spans
                  government institutions, residential developments, urban
                  beautification, and structural engineering.
                </p>
                <blockquote className="border-l-2 border-foreground pl-6 text-lg font-medium italic text-foreground">
                  {'"Our work bridges vision and reality, transforming ideas into built forms that are thoughtful, sustainable, and enduring."'}
                </blockquote>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-px bg-border">
                {[
                  { number: '50+', label: 'Projects Completed' },
                  { number: '15+', label: 'Years Experience' },
                  { number: '12', label: 'Team Members' },
                  { number: '5', label: 'Service Verticals' },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="flex flex-col items-center bg-background p-8 text-center"
                  >
                    <span className="font-mono text-3xl font-bold text-foreground md:text-4xl">
                      {stat.number}
                    </span>
                    <span className="mt-2 text-xs tracking-[0.1em] uppercase text-muted-foreground">
                      {stat.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Design Philosophy */}
      <section className="bg-muted py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground">
            Design Philosophy
          </p>
          <div className="mt-3 h-px w-16 bg-foreground" />
          <h2 className="mt-8 text-3xl font-bold tracking-tight text-foreground md:text-4xl text-balance">
            Our Values Shape Every Project
          </h2>

          <div className="mt-16 grid grid-cols-1 gap-px bg-border md:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon
              return (
                <div key={value.title} className="bg-muted p-10">
                  <Icon
                    size={28}
                    className="text-muted-foreground"
                    strokeWidth={1.5}
                  />
                  <h3 className="mt-6 text-sm font-semibold tracking-[0.1em] uppercase text-foreground">
                    {value.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                    {value.description}
                  </p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="bg-background py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground">
            Leadership
          </p>
          <div className="mt-3 h-px w-16 bg-foreground" />
          <h2 className="mt-8 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Meet Our Team
          </h2>

          <div className="mt-16 grid grid-cols-1 gap-16 md:grid-cols-2">
            {teamMembers.map((member) => (
              <div key={member.name} className="flex flex-col gap-6 sm:flex-row">
                <div className="relative aspect-square w-32 shrink-0 overflow-hidden bg-secondary sm:w-40">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover grayscale"
                  />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-foreground">
                    {member.name}
                  </h3>
                  <p className="mt-1 text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground">
                    {member.role}
                  </p>
                  <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                    {member.bio}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
