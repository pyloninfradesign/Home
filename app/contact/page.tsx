import type { Metadata } from 'next'
import { Mail, Phone, MapPin, Clock } from 'lucide-react'
import { ContactForm } from '@/components/contact/contact-form'

export const metadata: Metadata = {
  title: 'Contact | Pylon Infra Design',
  description:
    'Get in touch with Pylon Infra Design. Schedule a consultation for your next architectural project.',
}

const contactInfo = [
  {
    icon: Mail,
    label: 'Email',
    value: 'info@pyloninfradesign.com',
    href: 'mailto:info@pyloninfradesign.com',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+91 674 XXX XXXX',
    href: 'tel:+91674XXXXXXX',
  },
  {
    icon: MapPin,
    label: 'Office',
    value: 'Bhubaneswar, Odisha, India',
    href: undefined,
  },
  {
    icon: Clock,
    label: 'Hours',
    value: 'Mon - Sat, 9:00 AM - 6:00 PM',
    href: undefined,
  },
]

export default function ContactPage() {
  return (
    <>
      {/* Page Header */}
      <section className="bg-background pt-32 pb-16 lg:pt-40 lg:pb-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <p className="text-xs font-medium tracking-[0.3em] uppercase text-muted-foreground">
            Get in Touch
          </p>
          <div className="mt-3 h-px w-16 bg-foreground" />
          <h1 className="mt-8 text-4xl font-bold tracking-tight text-foreground md:text-5xl lg:text-6xl">
            Contact
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted-foreground lg:text-lg">
            We are ready to bring your architectural vision to life. Reach out
            to start a conversation about your next project.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="bg-background pb-24 lg:pb-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">
            {/* Contact Form */}
            <div className="lg:col-span-8">
              <ContactForm />
            </div>

            {/* Contact Info Sidebar */}
            <div className="lg:col-span-4">
              <div className="border-t border-border bg-muted p-8">
                <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                  Contact Information
                </h3>

                <div className="mt-8 flex flex-col gap-8">
                  {contactInfo.map((item) => {
                    const Icon = item.icon
                    const content = (
                      <div className="flex items-start gap-4">
                        <Icon
                          size={18}
                          className="mt-0.5 shrink-0 text-muted-foreground"
                          strokeWidth={1.5}
                        />
                        <div>
                          <p className="text-xs tracking-[0.1em] uppercase text-muted-foreground">
                            {item.label}
                          </p>
                          <p className="mt-1 text-sm text-foreground">
                            {item.value}
                          </p>
                        </div>
                      </div>
                    )

                    if (item.href) {
                      return (
                        <a
                          key={item.label}
                          href={item.href}
                          className="transition-opacity hover:opacity-70"
                        >
                          {content}
                        </a>
                      )
                    }

                    return <div key={item.label}>{content}</div>
                  })}
                </div>

                <div className="mt-10 h-px bg-border" />

                <p className="mt-8 text-xs leading-relaxed text-muted-foreground">
                  For project inquiries, please include details about your
                  project type, location, approximate size, and timeline.
                  This helps us prepare for our initial consultation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation CTA */}
      <section className="bg-foreground py-24">
        <div className="mx-auto max-w-7xl px-6 text-center lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-primary-foreground md:text-4xl text-balance">
            Book a Consultation
          </h2>
          <p className="mx-auto mt-4 max-w-md text-primary-foreground/60">
            Prefer a direct conversation? Schedule a one-on-one consultation
            with our principal architect to discuss your project in detail.
          </p>
          <a
            href="mailto:info@pyloninfradesign.com?subject=Consultation%20Request"
            className="group mt-8 inline-flex items-center gap-2 bg-primary-foreground px-8 py-4 text-xs font-semibold tracking-[0.15em] uppercase text-foreground transition-all hover:bg-primary-foreground/90"
          >
            Request a Meeting
            <Mail size={14} />
          </a>
        </div>
      </section>
    </>
  )
}
