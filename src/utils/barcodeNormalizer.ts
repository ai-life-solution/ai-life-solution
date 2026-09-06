/**
 * 스캔된 원본 바코드/QR 텍스트를 공공데이터 규격 및 형태에 맞게 정규화합니다.
 *
 * - 13자리 숫자(EAN-13): 14자리 GTIN-14 규격을 위해 앞자리에 '0' 패딩
 * - 12자리 숫자(UPC-A): 앞자리에 '00' 패딩
 * - 14자리 숫자(GTIN-14): 이미 14자리이므로 그대로 유지
 * - 기타 8자리(EAN-8) 또는 비숫자(QR 코드, URL, 영문 식별자 등): 원본 유지
 *
 * @param rawBarcode 스캔된 원본 텍스트
 * @returns 정규화된 바코드 문자열
 */
export function normalizeBarcode(rawBarcode: string): string {
  if (!rawBarcode) return ''

  const trimmed = rawBarcode.trim()
  const isPureDigits = /^\d+$/.test(trimmed)

  if (!isPureDigits) {
    return trimmed
  }

  switch (trimmed.length) {
    case 13:
      return `0${trimmed}`
    case 12:
      return `00${trimmed}`
    case 14:
    case 8:
    default:
      return trimmed
  }
}
