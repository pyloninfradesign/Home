import { NextResponse } from 'next/server'
import { deliverContactLead } from '@/lib/contact-mail'

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      name?: string
      email?: string
      subject?: string
      message?: string
      phone?: string
      source?: string
    }

    const name = body.name?.trim() ?? ''
    const email = body.email?.trim() ?? ''
    const subject = body.subject?.trim() ?? 'Chat inquiry'
    const message = body.message?.trim() ?? ''
    const phone = body.phone?.trim() ?? ''

    if ((!email && !phone) || !message) {
      return NextResponse.json(
        { error: 'A message and either an email or phone number are required.' },
        { status: 400 }
      )
    }

    const result = await deliverContactLead({
      name: name || 'Chat visitor',
      email,
      subject,
      message,
      phone,
      source: body.source?.trim() || 'Chat assistant',
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Failed to send message.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unexpected contact server error.',
      },
      { status: 500 }
    )
  }
}
