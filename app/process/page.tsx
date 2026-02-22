import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, MessageSquare, PenTool, FileText, HardHat, CheckCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Process | Pylon Infra Design',
  description:
    'Our collaborative design process — from initial consultation through construction administration.',
}

const processSteps = [
  {
    number: '01',
    icon: MessageSquare,
    title: 'Initial Consultation',
    description:
      'Every project begins with a conversation. We listen to understand your vision, requirements, budget, and timeline. Through site visits and research, we establish the foundation for a successful project.',
    deliverables: [
      'Project brief documentation',
      'Site analysis report',
      'Preliminary budget framework',
      'Project timeline overview',
    ],
  },
  {
    number: '02',
    icon: PenTool,
    title: 'Design Development',
    description:
      'Our design team explores spatial solutions through iterative sketching, BIM modeling, and 3D visualization. We present multiple concepts, refining them through collaborative dialogue until the design fully embodies your vision.',
    deliverables: [
      'Conceptual design options',
      '3D visualizations & walkthroughs',
      'Material & finish selections',
      'Detailed floor plans & elevations',
    ],
  },
  {
    number: '03',
    icon: FileText,
    title: 'Construction Documentation',
    description:
      'We prepare comprehensive technical drawings and specifications that leave no detail to chance. Our BIM-driven documentation ensures accuracy, coordination, and clarity for the construction team.',
    deliverables: [
      'Complete working drawings',
      'Structural calculations',
      'MEP coordination documents',
      'Bill of quantities & estimates',
    ],
  },
  {
    number: '04',
    icon: HardHat,
    title: 'Construction Administration',
    description:
      'Our team provides on-site supervision and project management throughout the construction phase. We ensure design intent is faithfully translated into built reality while maintaining quality, budget, and schedule.',
    deliverables: [
      'Regular site inspections',
      'Quality assurance reports',
      'Progress monitoring',
      'Final handover documentation',
    ],
  },
]

const tools = [
  { name: 'AutoCAD', category: 'Drafting' },
  { name: 'Revit (BIM)', category: '3D Modeling' },
  { name: '3Ds Max', category: 'Visualization' },
  { name: 'SketchUp', category: 'Conceptual Design' },
  { name: 'V-Ray', category: 'Rendering' },
  { name: 'Lumion', category: 'Real-time Viz' },
]

export default function ProcessPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-background pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground">
            How We Work
          </p>
          <div className="mt-3 h-px w-16 bg-foreground" />
          <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Our Process
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
            A structured, collaborative approach that transforms your vision
            into built reality — with clarity at every stage.
          </p>
        </div>
      </section>

      {/* Process Steps */}
      <section className="bg-background pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {processSteps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.number}
                className="grid grid-cols-1 gap-10 border-t border-border py-16 lg:grid-cols-12 lg:gap-16 lg:py-20"
              >
                {/* Number + Icon */}
                <div className="lg:col-span-2">
                  <span className="font-mono text-5xl font-bold text-border">
                    {step.number}
                  </span>
                  <Icon
                    size={24}
                    className="mt-4 text-muted-foreground"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Content */}
                <div className="lg:col-span-6">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
                    {step.title}
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    {step.description}
                  </p>
                </div>

                {/* Deliverables */}
                <div className="lg:col-span-4">
                  <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                    Key Deliverables
                  </h3>
                  <ul className="mt-4 flex flex-col gap-3">
                    {step.deliverables.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 text-sm text-foreground"
                      >
                        <CheckCircle
                          size={14}
                          className="mt-0.5 shrink-0 text-muted-foreground"
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Progress Indicator */}
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:col-span-12 lg:block">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-px bg-foreground"
                        style={{
                          width: `${((index + 1) / processSteps.length) * 100}%`,
                        }}
                      />
                      <div
                        className="h-px bg-border"
                        style={{
                          width: `${((processSteps.length - index - 1) / processSteps.length) * 100}%`,
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Tools & Technology */}
      <section className="bg-muted py-24 lg:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground">
            Technology
          </p>
          <div className="mt-3 h-px w-16 bg-foreground" />
          <h2 className="mt-8 text-3xl font-bold tracking-tight text-foreground md:text-4xl">
            Tools We Use
          </h2>
          <p className="mt-4 max-w-lg text-base text-muted-foreground">
            Advanced BIM and 3D modeling technologies that enable precision,
            collaboration, and exceptional design outcomes.
          </p>

          <div className="mt-12 grid grid-cols-2 gap-px bg-border md:grid-cols-3 lg:grid-cols-6">
            {tools.map((tool) => (
              <div
                key={tool.name}
                className="flex flex-col items-center bg-muted p-8 text-center"
              >
                <p className="text-sm font-semibold text-foreground">
                  {tool.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {tool.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-foreground py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl text-balance">
            Ready to Start Your Project?
          </h2>
          <p className="mx-auto mt-4 max-w-md text-primary-foreground/60">
            Begin with a conversation. We will guide you through every step of the
            design and construction process.
          </p>
          <Link
            href="/contact"
            className="group mt-8 inline-flex items-center gap-2 bg-primary-foreground px-8 py-4 text-xs font-semibold tracking-[0.15em] uppercase text-foreground transition-all hover:bg-primary-foreground/90"
          >
            Schedule a Consultation
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
