export function parseHtml(html: string): string[] {
  if (!html) return []

  // 1) 태그 제거
  let text = html.replace(/<[^>]+>/g, '')

  // 2) 공백 정리
  text = text.replace(/\s+/g, ' ').trim()

  // 3) 괄호 안 콤마는 보호
  const protectedText = text.replace(/\([^()]*\)|\[[^[\]]*\]/g, match =>
    match.replace(/,/g, '<<COMMA>>')
  )

  // 4) 실제 분리
  const parts = protectedText.split(',').map(s => s.trim())

  // 5) 보호된 콤마 되돌리기
  return parts.map(p => p.replace(/<<COMMA>>/g, ','))
}
