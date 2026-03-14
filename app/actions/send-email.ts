'use server'

import { deliverContactLead } from '@/lib/contact-mail'

export async function sendEmail(formData: {
  name: string
  email: string
  subject: string
  message: string
  phone?: string
}) {
  return deliverContactLead({
    ...formData,
    source: 'Contact page form',
  })
}
