import 'server-only'

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { headers } from 'next/headers'

export type AuditAction =
  | 'AUTH_SIGN_IN'
  | 'AUTH_SIGN_IN_FAILED'
  | 'AUTH_SIGN_OUT'
  | 'PROJECT_CREATE'
  | 'PROJECT_UPDATE'
  | 'PROJECT_DELETE'
  | 'USER_CREATE'
  | 'USER_UPDATE'
  | 'USER_DELETE'

export interface AuditEvent {
  id: string
  timestamp: string
  action: AuditAction
  actor?: {
    id?: string
    email?: string | null
    role?: string | null
    name?: string | null
  }
  target?: {
    type: 'auth' | 'project' | 'user'
    id?: string
    label?: string
  }
  request?: {
    ip?: string | null
    userAgent?: string | null
  }
  details?: Record<string, string | number | boolean | null | undefined>
}

interface AuditFile {
  events: AuditEvent[]
}

const AUDIT_DATA_PATH = path.join(process.cwd(), 'data', 'audit-log.json')

function makeId() {
  return `AUDIT-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

async function ensureAuditFile() {
  try {
    await readFile(AUDIT_DATA_PATH, 'utf8')
  } catch {
    await mkdir(path.dirname(AUDIT_DATA_PATH), { recursive: true })
    await writeFile(
      AUDIT_DATA_PATH,
      JSON.stringify({ events: [] } satisfies AuditFile, null, 2),
      'utf8'
    )
  }
}

async function loadAuditFile(): Promise<AuditFile> {
  await ensureAuditFile()

  try {
    const raw = await readFile(AUDIT_DATA_PATH, 'utf8')
    const parsed = JSON.parse(raw) as AuditFile
    return { events: Array.isArray(parsed.events) ? parsed.events : [] }
  } catch {
    return { events: [] }
  }
}

async function saveAuditFile(file: AuditFile) {
  await ensureAuditFile()
  await writeFile(AUDIT_DATA_PATH, JSON.stringify(file, null, 2), 'utf8')
}

export async function getRequestAuditMetadata() {
  try {
    const requestHeaders = await headers()
    const forwardedFor = requestHeaders.get('x-forwarded-for')
    const realIp = requestHeaders.get('x-real-ip')
    const ip = forwardedFor?.split(',')[0]?.trim() || realIp || null
    const userAgent = requestHeaders.get('user-agent')

    return { ip, userAgent }
  } catch {
    return { ip: null, userAgent: null }
  }
}

export async function logAuditEvent(event: Omit<AuditEvent, 'id' | 'timestamp' | 'request'> & {
  request?: AuditEvent['request']
}) {
  const file = await loadAuditFile()
  const request = event.request ?? (await getRequestAuditMetadata())

  file.events.unshift({
    id: makeId(),
    timestamp: new Date().toISOString(),
    ...event,
    request,
  })

  file.events = file.events.slice(0, 500)
  await saveAuditFile(file)
}

export async function getAuditEvents(limit = 200) {
  const file = await loadAuditFile()
  return file.events
    .slice()
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit)
}

export function getAuditActionLabel(action: AuditAction) {
  switch (action) {
    case 'AUTH_SIGN_IN':
      return 'Login success'
    case 'AUTH_SIGN_IN_FAILED':
      return 'Login failed'
    case 'AUTH_SIGN_OUT':
      return 'Logout'
    case 'PROJECT_CREATE':
      return 'Project created'
    case 'PROJECT_UPDATE':
      return 'Project updated'
    case 'PROJECT_DELETE':
      return 'Project deleted'
    case 'USER_CREATE':
      return 'User created'
    case 'USER_UPDATE':
      return 'User updated'
    case 'USER_DELETE':
      return 'User deleted'
    default:
      return action
  }
}

export function getAuditActionTone(action: AuditAction) {
  if (action === 'AUTH_SIGN_IN_FAILED' || action === 'PROJECT_DELETE' || action === 'USER_DELETE') {
    return 'rose'
  }
  if (action === 'PROJECT_CREATE' || action === 'USER_CREATE' || action === 'AUTH_SIGN_IN') {
    return 'emerald'
  }
  return 'neutral'
}
