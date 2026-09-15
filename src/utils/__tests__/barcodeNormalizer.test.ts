import { describe, expect, it } from 'bun:test'

import { normalizeBarcode } from '../barcodeNormalizer'

describe('normalizeBarcode', () => {
  it('13자리 EAN-13 바코드는 14자리 GTIN-14 규격(0 접두어)으로 정규화해야 한다', () => {
    expect(normalizeBarcode('8801043014854')).toBe('08801043014854')
  })

  it('이미 14자리인 GTIN-14 바코드는 추가 0 접두어 없이 그대로 유지해야 한다', () => {
    expect(normalizeBarcode('08801043014854')).toBe('08801043014854')
  })

  it('12자리 UPC-A 바코드는 14자리로 00 패딩해야 한다', () => {
    expect(normalizeBarcode('123456789012')).toBe('00123456789012')
  })

  it('8자리 EAN-8 바코드는 임의의 0 접두어 없이 원본 그대로 유지해야 한다', () => {
    expect(normalizeBarcode('12345670')).toBe('12345670')
  })

  it('QR 코드(URL, 텍스트) 또는 비숫자 데이터는 0 접두어 없이 원본 그대로 반환해야 한다', () => {
    expect(normalizeBarcode('https://foodqr.kr/item/123')).toBe('https://foodqr.kr/item/123')
    expect(normalizeBarcode('PROD-ABC-123')).toBe('PROD-ABC-123')
  })

  it('공백이 포함된 경우 앞뒤 공백을 제거해야 한다', () => {
    expect(normalizeBarcode('  8801043014854  ')).toBe('08801043014854')
  })
})
