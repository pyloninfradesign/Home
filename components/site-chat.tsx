'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const starterMessage: ChatMessage = {
  role: 'assistant',
  content:
    'Ask about Pylon Infra Design, projects, services, process, or contact details.',
}

const OPTIONAL_LEAD_PROMPT =
  "If you'd like, you can share your email or phone number here and the team can follow up. Totally optional."

function extractEmail(text: string) {
  return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? ''
}

function extractPhone(text: string) {
  return (
    text.match(/(?:\+?\d[\d\s().-]{7,}\d)/)?.[0]?.trim() ??
    ''
  )
}

function shouldOpenLeadForm(text: string) {
  const normalized = text.toLowerCase()
  return [
    'call me',
    'contact me',
    'reach me',
    'book a consultation',
    'book consultation',
    'schedule a consultation',
    'schedule consultation',
    'i have a project',
    'new project',
    'need a project',
    'want to discuss a project',
    'get in touch',
    'speak to someone',
  ].some((term) => normalized.includes(term))
}

export function SiteChat() {
  const pathname = usePathname()
  const [isMounted, setIsMounted] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([starterMessage])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isLeadFormOpen, setIsLeadFormOpen] = useState(false)
  const [isLeadSubmitting, setIsLeadSubmitting] = useState(false)
  const [leadError, setLeadError] = useState<string | null>(null)
  const [leadSuccess, setLeadSuccess] = useState<string | null>(null)
  const [leadName, setLeadName] = useState('')
  const [leadEmail, setLeadEmail] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [leadSubject, setLeadSubject] = useState('Chat inquiry')
  const [leadMessage, setLeadMessage] = useState('')
  const [hasPromptedForContact, setHasPromptedForContact] = useState(false)
  const [capturedContacts, setCapturedContacts] = useState<string[]>([])

  useEffect(() => {
    setIsMounted(true)
    const openChat = () => setIsOpen(true)
    ;(window as Window & { __pylonOpenChat?: () => void }).__pylonOpenChat = openChat
    window.addEventListener('pylon:open-chat', openChat)
    return () => {
      delete (window as Window & { __pylonOpenChat?: () => void }).__pylonOpenChat
      window.removeEventListener('pylon:open-chat', openChat)
    }
  }, [])

  if (pathname?.startsWith('/admin') || !isMounted) {
    return null
  }

  function openLeadForm() {
    setLeadMessage(input.trim() || leadMessage)
    setLeadError(null)
    setLeadSuccess(null)
    setIsLeadFormOpen(true)
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const question = input.trim()
    if (!question || isLoading) return
    const shouldPromptLeadForm = shouldOpenLeadForm(question)

    const nextMessages = [...messages, { role: 'user' as const, content: question }]
    setMessages(nextMessages)
    setInput('')
    setError(null)
    setLeadSuccess(null)
    setIsLoading(true)

    const sharedEmail = extractEmail(question)
    const sharedPhone = extractPhone(question)
    const contactKey = [sharedEmail, sharedPhone].filter(Boolean).join('|')

    if (shouldPromptLeadForm) {
      setLeadSubject('Consultation request')
      setLeadMessage(question)
      setLeadError(null)
      setLeadSuccess(null)
      setIsLeadFormOpen(true)
    }

    if (contactKey && !capturedContacts.includes(contactKey)) {
      try {
        const contactResponse = await fetch('/api/contact', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: sharedEmail,
            phone: sharedPhone,
            subject: 'Chat lead from shared contact details',
            message: `Visitor shared contact details in chat.\n\nMessage:\n${question}`,
            source: 'Chat assistant auto-capture',
          }),
        })

        if (contactResponse.ok) {
          setCapturedContacts((current) => [...current, contactKey])
          setLeadSuccess('Thanks. Your contact details were shared with the team.')
        }
      } catch {
        // Keep chat responsive even if background lead capture fails.
      }
    }

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages }),
      })

      const data = (await response.json()) as { message?: string; error?: string }
      if (!response.ok || !data.message) {
        throw new Error(data.error || 'Chat request failed.')
      }

      const assistantMessage = data.message
      setMessages((current) => {
        const updated = [
          ...current,
          { role: 'assistant' as const, content: assistantMessage },
        ]

        if (!hasPromptedForContact) {
          updated.push({
            role: 'assistant',
            content: OPTIONAL_LEAD_PROMPT,
          })
        }

        return updated
      })
      if (!hasPromptedForContact) {
        setHasPromptedForContact(true)
      }
    } catch (requestError) {
      setError(
        requestError instanceof Error ? requestError.message : 'Unable to send message.'
      )
    } finally {
      setIsLoading(false)
    }
  }

  async function handleLeadSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (isLeadSubmitting) return

    setLeadError(null)
    setLeadSuccess(null)
    setIsLeadSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadName,
          email: leadEmail,
          phone: leadPhone,
          subject: leadSubject,
          message: leadMessage,
          source: 'Chat assistant',
        }),
      })

      const data = (await response.json()) as { success?: boolean; error?: string }
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Unable to send your message.')
      }

      setLeadSuccess('Thanks. Your message has been sent to the team.')
      setMessages((current) => [
        ...current,
        {
          role: 'assistant',
          content:
            'Thanks for sharing your details. The Pylon team has received your inquiry and should follow up soon.',
        },
      ])
      setLeadName('')
      setLeadEmail('')
      setLeadPhone('')
      setLeadSubject('Chat inquiry')
      setLeadMessage('')
      setInput('')
      setIsLeadFormOpen(false)
    } catch (requestError) {
      setLeadError(
        requestError instanceof Error ? requestError.message : 'Unable to send your message.'
      )
    } finally {
      setIsLeadSubmitting(false)
    }
  }

  return createPortal(
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2147483647,
        pointerEvents: 'none',
      }}
    >
      {isOpen ? (
        <div
          style={{
            position: 'fixed',
            right: 16,
            bottom: 16,
            width: 'min(380px, calc(100vw - 24px))',
            height: 'min(560px, calc(100vh - 24px))',
            background: '#ffffff',
            border: '2px solid #111827',
            borderRadius: 16,
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            pointerEvents: 'auto',
            fontFamily: 'Montserrat, sans-serif',
          }}
        >
          <div
            style={{
              background: '#111827',
              color: '#ffffff',
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <div>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Pylon Assistant</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>Website knowledge only</div>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                border: '1px solid rgba(255,255,255,0.25)',
                background: '#ffffff',
                color: '#111827',
                borderRadius: 10,
                padding: '8px 12px',
                fontSize: 14,
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Close
            </button>
          </div>

          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              background: '#f8fafc',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 12,
            }}
          >
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                style={{
                  alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
                  maxWidth: '85%',
                  background: message.role === 'user' ? '#111827' : '#ffffff',
                  color: message.role === 'user' ? '#ffffff' : '#111827',
                  border: message.role === 'user' ? 'none' : '1px solid #d1d5db',
                  borderRadius: 14,
                  padding: '12px 14px',
                  fontSize: 14,
                  lineHeight: 1.5,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                }}
              >
                {message.content}
              </div>
            ))}

            {isLoading ? (
              <div
                style={{
                  maxWidth: '85%',
                  background: '#ffffff',
                  color: '#475569',
                  border: '1px solid #d1d5db',
                  borderRadius: 14,
                  padding: '12px 14px',
                  fontSize: 14,
                }}
              >
                Thinking...
              </div>
            ) : null}

            {error ? (
              <div
                style={{
                  background: '#fff1f2',
                  color: '#9f1239',
                  border: '1px solid #fecdd3',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                }}
              >
                {error}
              </div>
            ) : null}

            {leadSuccess ? (
              <div
                style={{
                  background: '#ecfdf5',
                  color: '#166534',
                  border: '1px solid #86efac',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                }}
              >
                {leadSuccess}
              </div>
            ) : null}
          </div>

          {isLeadFormOpen ? (
            <form
              onSubmit={handleLeadSubmit}
              style={{
                borderTop: '1px solid #e5e7eb',
                background: '#f8fafc',
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
              }}
            >
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#475569',
                }}
              >
                Share your project details
              </div>
              <input
                value={leadName}
                onChange={(event) => setLeadName(event.target.value)}
                placeholder="Full name"
                style={{
                  width: '100%',
                  border: '1px solid #cbd5e1',
                  borderRadius: 12,
                  padding: '10px 12px',
                  fontSize: 14,
                  color: '#111827',
                  background: '#ffffff',
                  outline: 'none',
                }}
              />
              <input
                value={leadEmail}
                onChange={(event) => setLeadEmail(event.target.value)}
                placeholder="Email address"
                type="email"
                style={{
                  width: '100%',
                  border: '1px solid #cbd5e1',
                  borderRadius: 12,
                  padding: '10px 12px',
                  fontSize: 14,
                  color: '#111827',
                  background: '#ffffff',
                  outline: 'none',
                }}
              />
              <input
                value={leadPhone}
                onChange={(event) => setLeadPhone(event.target.value)}
                placeholder="Phone number"
                style={{
                  width: '100%',
                  border: '1px solid #cbd5e1',
                  borderRadius: 12,
                  padding: '10px 12px',
                  fontSize: 14,
                  color: '#111827',
                  background: '#ffffff',
                  outline: 'none',
                }}
              />
              <input
                value={leadSubject}
                onChange={(event) => setLeadSubject(event.target.value)}
                placeholder="Project type or subject"
                style={{
                  width: '100%',
                  border: '1px solid #cbd5e1',
                  borderRadius: 12,
                  padding: '10px 12px',
                  fontSize: 14,
                  color: '#111827',
                  background: '#ffffff',
                  outline: 'none',
                }}
              />
              <textarea
                value={leadMessage}
                onChange={(event) => setLeadMessage(event.target.value)}
                rows={4}
                placeholder="Tell us about your project, site, timeline, or consultation request..."
                style={{
                  width: '100%',
                  resize: 'none',
                  border: '1px solid #cbd5e1',
                  borderRadius: 12,
                  padding: '12px 14px',
                  fontSize: 14,
                  color: '#111827',
                  background: '#ffffff',
                  outline: 'none',
                }}
              />
              {leadError ? (
                <div
                  style={{
                    background: '#fff1f2',
                    color: '#9f1239',
                    border: '1px solid #fecdd3',
                    borderRadius: 12,
                    padding: '12px 14px',
                    fontSize: 14,
                  }}
                >
                  {leadError}
                </div>
              ) : null}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: 10,
                }}
              >
                <button
                  type="button"
                  onClick={() => setIsLeadFormOpen(false)}
                  style={{
                    border: '1px solid #cbd5e1',
                    background: '#ffffff',
                    color: '#111827',
                    borderRadius: 12,
                    padding: '10px 14px',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Back to chat
                </button>
                <button
                  type="submit"
                  disabled={
                    isLeadSubmitting ||
                    !leadName.trim() ||
                    !leadEmail.trim() ||
                    !leadMessage.trim()
                  }
                  style={{
                    border: 'none',
                    background:
                      isLeadSubmitting ||
                      !leadName.trim() ||
                      !leadEmail.trim() ||
                      !leadMessage.trim()
                        ? '#94a3b8'
                        : '#111827',
                    color: '#ffffff',
                    borderRadius: 12,
                    padding: '10px 16px',
                    fontSize: 14,
                    fontWeight: 700,
                    cursor:
                      isLeadSubmitting ||
                      !leadName.trim() ||
                      !leadEmail.trim() ||
                      !leadMessage.trim()
                        ? 'not-allowed'
                        : 'pointer',
                  }}
                >
                  {isLeadSubmitting ? 'Sending...' : 'Send inquiry'}
                </button>
              </div>
            </form>
          ) : null}

          <form
            onSubmit={handleSubmit}
            style={{
              borderTop: '1px solid #e5e7eb',
              background: '#ffffff',
              padding: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            <textarea
              value={input}
              onChange={(event) => setInput(event.target.value)}
              rows={3}
              placeholder="Ask about services, projects, or process..."
              style={{
                width: '100%',
                resize: 'none',
                border: '1px solid #cbd5e1',
                borderRadius: 12,
                padding: '12px 14px',
                fontSize: 14,
                color: '#111827',
                background: '#ffffff',
                outline: 'none',
              }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
              <button
                type="button"
                onClick={openLeadForm}
                style={{
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  color: '#111827',
                  borderRadius: 12,
                  padding: '10px 14px',
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                Leave your details
              </button>
              <button
                type="submit"
                disabled={isLoading || input.trim().length === 0}
                style={{
                  border: 'none',
                  background: isLoading || input.trim().length === 0 ? '#94a3b8' : '#111827',
                  color: '#ffffff',
                  borderRadius: 12,
                  padding: '10px 16px',
                  fontSize: 14,
                  fontWeight: 700,
                  cursor:
                    isLoading || input.trim().length === 0 ? 'not-allowed' : 'pointer',
                }}
              >
                Send
              </button>
            </div>
          </form>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          style={{
            position: 'fixed',
            right: 16,
            bottom: 16,
            width: 'min(320px, calc(100vw - 24px))',
            background: '#ffffff',
            border: '2px solid #111827',
            borderRadius: 16,
            boxShadow: '0 24px 80px rgba(0, 0, 0, 0.35)',
            padding: '14px 16px',
            textAlign: 'left',
            pointerEvents: 'auto',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Ask Pylon AI</div>
          <div style={{ marginTop: 4, fontSize: 13, color: '#475569', lineHeight: 1.5 }}>
            Ask about services, projects, process, or contact details.
          </div>
        </button>
      )}
    </div>,
    document.body
  )
}
