'use client'

import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sendEmail } from '@/app/actions/send-email'

const projectTypes = [
  'Architectural Design',
  'Interior Design',
  'Structural Design',
  'Urban Design',
  'Project Management',
  'Other',
]

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    const formData = new FormData(e.currentTarget)
    const formValues = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      subject: formData.get('projectType') as string,
      message: formData.get('message') as string,
      phone: formData.get('phone') as string,
    }

    console.log('📤 Form submitted with values:', formValues)
    
    const result = await sendEmail(formValues)

    console.log('📬 Send email result:', result)

    setIsSubmitting(false)

    if (result.success) {
      console.log('✅ Email sent successfully')
      setIsSubmitted(true)
      ;(e.target as HTMLFormElement).reset()
    } else {
      console.error('❌ Email send failed:', result.error)
      setError(result.error || 'Failed to send email. Please try again.')
    }
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <div className="h-px w-16 bg-foreground" />
        <h3 className="mt-8 text-2xl font-bold text-foreground">
          Thank You
        </h3>
        <p className="mt-4 max-w-sm text-sm text-muted-foreground">
          Your message has been received. Our team will review your inquiry
          and respond within 24-48 business hours.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="mt-8 text-xs font-medium tracking-[0.15em] uppercase text-foreground transition-opacity hover:opacity-70"
        >
          Send Another Message
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-8">
      {error && (
        <div className="rounded bg-red-50 p-4 text-sm text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Name */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground"
          >
            Full Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="border-b border-border bg-transparent py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground placeholder:text-muted-foreground/50"
            placeholder="Your full name"
          />
        </div>

        {/* Email */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground"
          >
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            className="border-b border-border bg-transparent py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground placeholder:text-muted-foreground/50"
            placeholder="your@email.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {/* Phone */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="phone"
            className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground"
          >
            Phone Number
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className="border-b border-border bg-transparent py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground placeholder:text-muted-foreground/50"
            placeholder="+91 XXX XXX XXXX"
          />
        </div>

        {/* Project Type */}
        <div className="flex flex-col gap-2">
          <label
            htmlFor="projectType"
            className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground"
          >
            Project Type
          </label>
          <select
            id="projectType"
            name="projectType"
            className="border-b border-border bg-transparent py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground"
          >
            <option value="">Select a service</option>
            {projectTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Message */}
      <div className="flex flex-col gap-2">
        <label
          htmlFor="message"
          className="text-xs font-medium tracking-[0.1em] uppercase text-muted-foreground"
        >
          Project Description *
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="resize-none border-b border-border bg-transparent py-3 text-sm text-foreground outline-none transition-colors focus:border-foreground placeholder:text-muted-foreground/50"
          placeholder="Tell us about your project, site, and vision..."
        />
      </div>

      {/* Submit */}
      <div>
        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'group flex items-center gap-2 bg-foreground px-8 py-4 text-xs font-semibold tracking-[0.15em] uppercase text-primary-foreground transition-all hover:bg-foreground/90',
            isSubmitting && 'cursor-not-allowed opacity-70'
          )}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
          {!isSubmitting && (
            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          )}
        </button>
      </div>
    </form>
  )
}
