import { NextResponse } from 'next/server'
import { getKnowledgeBase } from '@/lib/chat-knowledge'

interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const DEFAULT_MODEL = 'meta/llama-3.1-70b-instruct'
const OUT_OF_SCOPE_PATTERNS = [
  'not available in the knowledge base',
  'not in the knowledge base',
  'not provided in the knowledge base',
  'i do not have that information',
  'i don’t have that information',
  'i do not know',
  "i don't know",
  'cannot determine from the knowledge base',
]

const POLITICAL_OUT_OF_SCOPE_REPLIES = [
  'I stay in my lane: architecture, projects, and Pylon details. For world leaders, I am gloriously underqualified. Ask me about the firm, services, projects, or contact details instead.',
  'That question is a little outside the site plan. I am built for Pylon Infra Design, not world affairs. Try me on projects, services, process, or contact details.',
  'I can help design a conversation around Pylon, but not around geopolitics. Ask me about the studio, team, services, or current projects instead.',
  'Wrong blueprint. I know Pylon Infra Design far better than public figures. If you want, ask about the founder, office, services, or portfolio.',
]

const GENERAL_OUT_OF_SCOPE_REPLIES = [
  'That is outside my drawing set. I can help with Pylon Infra Design projects, services, process, team, and contact details if you want to keep the conversation on-site.',
  'I am tuned to this website, not the whole universe. If you want something useful here, ask about Pylon projects, services, process, or contact details.',
  'That one sits beyond my project boundary. I can still help with the firm, team, services, portfolio, or how to get in touch.',
  'I do my best work inside the Pylon brief. Ask me about the studio, its work, its process, or how to contact the team.',
]

interface ToolLikePayload {
  name?: string
  parameters?: Record<string, unknown>
}

function buildSystemPrompt(knowledgeBase: string) {
  return [
    'You are the website assistant for Pylon Infra Design.',
    'Answer only using the provided website knowledge base.',
    'Do not claim to browse the live internet.',
    'If the answer is not in the knowledge base, say so briefly and suggest contacting Pylon directly.',
    'Be concise, helpful, and grounded in the site content.',
    'Respond in plain natural language only.',
    'Do not return JSON, objects, tool names, function names, XML, markdown code fences, or schemas.',
    'Never simulate tool calling. Give the final answer directly to the visitor.',
    'When listing 3 or more items, format them as short bullet points using plain text with line breaks.',
    'When comparing structured details, use a compact plain-text table only if it improves clarity.',
    'Prefer short section headers followed by bullets for longer answers.',
    '',
    'Website knowledge base:',
    knowledgeBase,
  ].join('\n')
}

function extractFirstMatch(text: string, pattern: RegExp) {
  const match = text.match(pattern)
  return match?.[1]?.trim() ?? ''
}

function parseToolLikePayload(content: string): ToolLikePayload | null {
  try {
    const parsed = JSON.parse(content) as ToolLikePayload
    if (parsed && typeof parsed === 'object') {
      return parsed
    }
  } catch {
    return null
  }
  return null
}

function answerFromKnowledgeBase(question: string, knowledgeBase: string) {
  const normalized = question.toLowerCase()
  const email = extractFirstMatch(
    knowledgeBase,
    /\b([A-Z0-9._%+-]+@pyloninfradesign\.com)\b/i
  )
  const phone = extractFirstMatch(knowledgeBase, /(\+91\s*\d{3}\s*X{3}\s*X{4})/i)
  const office = extractFirstMatch(knowledgeBase, /Office\s+(Bhubaneswar,\s*Odisha,\s*India)/i)
  const founder = extractFirstMatch(
    knowledgeBase,
    /([A-Z][A-Za-z.\s]+?)\s+Founder\s+With over 15 years/i
  )

  if (
    normalized.includes('where') ||
    normalized.includes('location') ||
    normalized.includes('office')
  ) {
    if (office) {
      return `Pylon Infra Design is based in ${office}.`
    }
  }

  if (
    normalized.includes('contact') ||
    normalized.includes('email') ||
    normalized.includes('phone') ||
    normalized.includes('call')
  ) {
    if (email && phone) {
      return `You can contact Pylon Infra Design at ${email} or ${phone}.`
    }
    if (email) {
      return `You can contact Pylon Infra Design at ${email}.`
    }
  }

  if (
    normalized.includes('owner') ||
    normalized.includes('founder') ||
    normalized.includes('who runs') ||
    normalized.includes('who is behind')
  ) {
    if (founder) {
      return `${founder} is the founder of Pylon Infra Design.`
    }
  }

  if (
    normalized.includes('what can you do') ||
    normalized.includes('help') ||
    normalized.includes('can you do')
  ) {
    return 'I can answer questions about Pylon Infra Design, its projects, services, process, team, and contact details based on the public website.'
  }

  return null
}

function buildOutOfScopeReply(question: string) {
  const normalized = question.toLowerCase()
  const chooseReply = (options: string[]) => {
    const seed = question
      .split('')
      .reduce((total, character) => total + character.charCodeAt(0), 0)
    return options[seed % options.length]
  }

  if (
    normalized.includes('president') ||
    normalized.includes('donald') ||
    normalized.includes('trump') ||
    normalized.includes('biden') ||
    normalized.includes('prime minister') ||
    normalized.includes('government') ||
    normalized.includes('news')
  ) {
    return chooseReply(POLITICAL_OUT_OF_SCOPE_REPLIES)
  }

  return chooseReply(GENERAL_OUT_OF_SCOPE_REPLIES)
}

function isClearlyOutOfScope(question: string) {
  const normalized = question.toLowerCase()

  return [
    'president',
    'prime minister',
    'pm of india',
    'donald',
    'trump',
    'biden',
    'modi',
    'government',
    'news',
    'election',
    'politics',
  ].some((term) => normalized.includes(term))
}

function formatForChat(content: string) {
  let formatted = content.trim()

  formatted = formatted.replace(/\s+([1-9]\.)\s+/g, '\n$1 ')
  formatted = formatted.replace(/(^|\n)([1-9]\.\s+)/g, '$1- ')
  formatted = formatted.replace(/:\s+-\s+/g, ':\n- ')

  if (!formatted.includes('\n- ')) {
    formatted = formatted.replace(
      /\b(Residential projects|Institutional projects|Urban Design projects|Structural projects|Services|Projects):\s*/gi,
      '\n$1:\n- '
    )
  }

  return formatted.trim()
}

function normalizeAssistantReply(content: string, question: string, knowledgeBase: string) {
  const trimmed = content.trim()
  const directAnswer = answerFromKnowledgeBase(question, knowledgeBase)
  const toolPayload = parseToolLikePayload(trimmed)

  if (toolPayload) {
    return (
      directAnswer ??
      'I can help with Pylon Infra Design projects, services, process, team, and contact details. Please ask a specific question.'
    )
  }

  if (trimmed.startsWith('{') && trimmed.includes('"name"')) {
    return (
      directAnswer ??
      'I can help with Pylon Infra Design projects, services, process, team, and contact details. Please ask a specific question.'
    )
  }

  if (
    OUT_OF_SCOPE_PATTERNS.some((pattern) => trimmed.toLowerCase().includes(pattern))
  ) {
    return formatForChat(directAnswer ?? buildOutOfScopeReply(question))
  }

  return formatForChat(trimmed)
}

export async function POST(request: Request) {
  try {
    const nvidiaApiKey = process.env.NVIDIA_API_KEY
    if (!nvidiaApiKey) {
      return NextResponse.json(
        { error: 'Missing NVIDIA_API_KEY on the server.' },
        { status: 500 }
      )
    }

    const body = (await request.json()) as { messages?: ChatMessage[] }
    const messages = Array.isArray(body.messages) ? body.messages : []
    const sanitizedMessages = messages.filter(
      (message) =>
        (message.role === 'user' || message.role === 'assistant') &&
        typeof message.content === 'string' &&
        message.content.trim().length > 0
    )

    if (sanitizedMessages.length === 0) {
      return NextResponse.json(
        { error: 'At least one user message is required.' },
        { status: 400 }
      )
    }

    const origin = new URL(request.url).origin
    const knowledgeBase = await getKnowledgeBase(origin)
    const latestUserQuestion =
      [...sanitizedMessages].reverse().find((message) => message.role === 'user')?.content ?? ''

    if (isClearlyOutOfScope(latestUserQuestion)) {
      return NextResponse.json({ message: buildOutOfScopeReply(latestUserQuestion) })
    }

    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${nvidiaApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: process.env.NVIDIA_MODEL ?? DEFAULT_MODEL,
        messages: [
          {
            role: 'system',
            content: buildSystemPrompt(knowledgeBase),
          },
          ...sanitizedMessages,
        ],
        temperature: 0.2,
        max_tokens: 700,
        stream: false,
        tools: [],
        tool_choice: 'none',
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `NVIDIA request failed: ${errorText}` },
        { status: 502 }
      )
    }

    const data = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>
    }

    const content = data.choices?.[0]?.message?.content?.trim()
    if (!content) {
      return NextResponse.json(
        { error: 'NVIDIA returned an empty response.' },
        { status: 502 }
      )
    }

    const normalizedContent = normalizeAssistantReply(
      content,
      latestUserQuestion,
      knowledgeBase
    )

    return NextResponse.json({ message: normalizedContent })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'Unexpected chat server error.',
      },
      { status: 500 }
    )
  }
}
