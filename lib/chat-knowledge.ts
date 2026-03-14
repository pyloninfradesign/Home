import 'server-only'

import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { headers } from 'next/headers'
import { crawlSite } from '@/lib/site-crawler'

export interface KnowledgeBasePage {
  url: string
  pathname: string
  title: string
  text: string
}

export interface KnowledgeBaseRecord {
  sourceOrigin: string
  updatedAt: string | null
  adminNotes: string
  pages: KnowledgeBasePage[]
  content: string
}

const KNOWLEDGE_BASE_PATH = path.join(process.cwd(), 'data', 'knowledge-base.json')

const emptyKnowledgeBase: KnowledgeBaseRecord = {
  sourceOrigin: '',
  updatedAt: null,
  adminNotes: '',
  pages: [],
  content: '',
}

async function ensureKnowledgeBaseFile() {
  try {
    await readFile(KNOWLEDGE_BASE_PATH, 'utf8')
  } catch {
    await mkdir(path.dirname(KNOWLEDGE_BASE_PATH), { recursive: true })
    await writeFile(KNOWLEDGE_BASE_PATH, JSON.stringify(emptyKnowledgeBase, null, 2), 'utf8')
  }
}

async function saveKnowledgeBase(record: KnowledgeBaseRecord) {
  await ensureKnowledgeBaseFile()
  await writeFile(KNOWLEDGE_BASE_PATH, JSON.stringify(record, null, 2), 'utf8')
}

function buildKnowledgeText(pages: KnowledgeBasePage[], adminNotes: string) {
  const pageContent = pages
    .map((page) =>
      [`URL: ${page.pathname}`, `Title: ${page.title || 'Untitled'}`, `Content: ${page.text}`].join(
        '\n'
      )
    )
    .join('\n\n---\n\n')

  const sections = [
    'Pylon Infra Design knowledge base.',
    adminNotes.trim() ? `Admin notes:\n${adminNotes.trim()}` : '',
    pageContent,
  ].filter(Boolean)

  return sections.join('\n\n===\n\n').slice(0, 22000)
}

export async function getKnowledgeBaseRecord() {
  await ensureKnowledgeBaseFile()

  try {
    const raw = await readFile(KNOWLEDGE_BASE_PATH, 'utf8')
    const parsed = JSON.parse(raw) as Partial<KnowledgeBaseRecord>
    return {
      sourceOrigin: parsed.sourceOrigin ?? '',
      updatedAt: parsed.updatedAt ?? null,
      adminNotes: parsed.adminNotes ?? '',
      pages: Array.isArray(parsed.pages) ? parsed.pages : [],
      content: parsed.content ?? '',
    } satisfies KnowledgeBaseRecord
  } catch {
    return emptyKnowledgeBase
  }
}

export async function updateKnowledgeBaseNotes(adminNotes: string) {
  const existing = await getKnowledgeBaseRecord()
  const updated: KnowledgeBaseRecord = {
    ...existing,
    adminNotes,
    content: buildKnowledgeText(existing.pages, adminNotes),
  }
  await saveKnowledgeBase(updated)
  return updated
}

export async function refreshKnowledgeBase(origin: string) {
  const existing = await getKnowledgeBaseRecord()
  const pages = await crawlSite(origin)
  const record: KnowledgeBaseRecord = {
    sourceOrigin: origin,
    updatedAt: new Date().toISOString(),
    adminNotes: existing.adminNotes,
    pages,
    content: buildKnowledgeText(pages, existing.adminNotes),
  }
  await saveKnowledgeBase(record)
  return record
}

export async function getKnowledgeBase(origin?: string) {
  const record = await getKnowledgeBaseRecord()
  if (record.content.trim().length > 0) {
    return record.content
  }
  if (!origin) {
    return ''
  }
  const refreshed = await refreshKnowledgeBase(origin)
  return refreshed.content
}

export async function getRequestOrigin() {
  try {
    const requestHeaders = await headers()
    const host =
      requestHeaders.get('x-forwarded-host') ??
      requestHeaders.get('host') ??
      'localhost:3000'
    const protocol = requestHeaders.get('x-forwarded-proto') ?? 'http'
    return `${protocol}://${host}`
  } catch {
    return process.env.NEXTAUTH_URL ?? 'http://localhost:3000'
  }
}
