'use server'

import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail(formData: {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
}) {
  const contactEmail = process.env.CONTACT_EMAIL

  console.log('=== Resend Email Attempt ===')
  console.log('API Key exists:', !!process.env.RESEND_API_KEY)
  console.log('Contact Email:', contactEmail)
  console.log('Form Data:', formData)

  if (!process.env.RESEND_API_KEY) {
    console.error('❌ Missing RESEND_API_KEY')
    return {
      success: false,
      error: 'Email service not configured.',
    }
  }

  try {
    console.log('📧 Attempting to send email via Resend...')

    const response = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: contactEmail || 'info_pyloninfra@protonmail.com',
      replyTo: formData.email,
      subject: `New Contact Form: ${formData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        ${formData.phone ? `<p><strong>Phone:</strong> ${formData.phone}</p>` : ''}
        <p><strong>Project Type:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${formData.message.replace(/\n/g, '<br>')}</p>
      `,
    })

    console.log('Resend response:', response)

    if (response.error) {
      console.error('❌ Resend API error:', response.error)
      throw new Error(response.error.message || 'Failed to send email')
    }

    console.log('✅ Email sent successfully. ID:', response.data?.id)
    return { success: true }
  } catch (error) {
    console.error('❌ Catch block error:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to send email. Please try again later.',
    }
  }
}
