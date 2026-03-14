import 'server-only'

const EXCLUDED_PATH_SEGMENTS = ['/admin', '/login', '/private']

export interface CrawledPage {
  url: string
  pathname: string
  title: string
  text: string
}

function stripHtml(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
}

function extractTitle(html: string) {
  const match = html.match(/<title>(.*?)<\/title>/i)
  return match?.[1]?.trim() ?? ''
}

function extractInternalLinks(html: string, origin: string) {
  const links = new Set<string>()
  const hrefMatches = html.matchAll(/href="([^"]+)"/gi)

  for (const match of hrefMatches) {
    const href = match[1]
    if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) {
      continue
    }

    try {
      const url = new URL(href, origin)
      if (url.origin !== origin) continue
      if (!shouldCrawlPath(url.pathname)) continue
      links.add(url.pathname)
    } catch {
      continue
    }
  }

  return Array.from(links)
}

export function shouldCrawlPath(pathname: string) {
  const normalized = pathname.toLowerCase()
  return !EXCLUDED_PATH_SEGMENTS.some((segment) => normalized.includes(segment))
}

export async function crawlSite(origin: string, startPath = '/', maxPages = 20) {
  const visited = new Set<string>()
  const queue = [startPath]
  const pages: CrawledPage[] = []

  while (queue.length > 0 && pages.length < maxPages) {
    const pathname = queue.shift()
    if (!pathname || visited.has(pathname) || !shouldCrawlPath(pathname)) continue
    visited.add(pathname)

    const response = await fetch(`${origin}${pathname}`, {
      headers: { 'x-ai-crawler': 'pylon-site-chat' },
      cache: 'no-store',
    })

    if (!response.ok || !response.headers.get('content-type')?.includes('text/html')) {
      continue
    }

    const html = await response.text()
    const title = extractTitle(html)
    const text = stripHtml(html).slice(0, 5000)

    pages.push({
      url: `${origin}${pathname}`,
      pathname,
      title,
      text,
    })

    for (const link of extractInternalLinks(html, origin)) {
      if (!visited.has(link)) {
        queue.push(link)
      }
    }
  }

  return pages
}
