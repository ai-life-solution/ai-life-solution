// html 형식 원재료 json파일 parsing util함수

export function parseHtml(html: string): string[] {
  if (!html) return []

  let text = html.replace(/<[^>]+>/g, '')
  text = text.replace(/\s+/g, ' ').trim()
  return text.split(',').map(s => s.trim())
}
