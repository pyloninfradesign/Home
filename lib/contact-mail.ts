import { Resend } from 'resend'

export interface ContactLeadInput {
  name?: string
  email?: string
  subject: string
  message: string
  phone?: string
  source?: string
}

const resend = new Resend(process.env.RESEND_API_KEY)
const CONTACT_EMAIL = 'info_pyloninfra@protonmail.com'

export async function deliverContactLead(formData: ContactLeadInput) {
  if (!process.env.RESEND_API_KEY) {
    return {
      success: false,
      error: 'Email service not configured.',
    }
  }

  try {
    const name = formData.name?.trim() || 'Chat visitor'
    const email = formData.email?.trim() || ''
    const phone = formData.phone?.trim() || ''
    const sourceLabel = formData.source ? `<p><strong>Source:</strong> ${formData.source}</p>` : ''

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: CONTACT_EMAIL,
      ...(email ? { replyTo: email } : {}),
      subject: `New Contact Form: ${formData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        ${sourceLabel}
        <p><strong>Name:</strong> ${name}</p>
        ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
        ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
        <p><strong>Project Type:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message.replace(/\n/g, '<br>')}</p>
      `,
    })

    if (response.error) {
      throw new Error(response.error.message || 'Failed to send email')
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to send email. Please try again later.',
    }
  }
}
