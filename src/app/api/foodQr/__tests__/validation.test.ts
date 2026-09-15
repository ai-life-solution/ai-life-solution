import { describe, expect, it } from 'bun:test'

import { ALLOWED_SERVICE_PATHS, isValidServicePath } from '../route'

describe('Food QR Proxy Route Validation', () => {
  it('허용된 5대 Food QR API 경로는 유효성 검사를 통과해야 한다', () => {
    expect(ALLOWED_SERVICE_PATHS.size).toBe(5)
    expect(isValidServicePath('/qr1003/F003')).toBe(true)
    expect(isValidServicePath('/qr1007/F007')).toBe(true)
    expect(isValidServicePath('/qr1008/F008')).toBe(true)
    expect(isValidServicePath('/qr1009/F009')).toBe(true)
    expect(isValidServicePath('/qr1016/F016')).toBe(true)
  })

  it('비인가 경로, 외부 URL, 디렉터리 순회 시도는 거부해야 한다 (C-02)', () => {
    expect(isValidServicePath('/admin')).toBe(false)
    expect(isValidServicePath('https://attacker.com/leak')).toBe(false)
    expect(isValidServicePath('../../../etc/passwd')).toBe(false)
    expect(isValidServicePath('')).toBe(false)
    expect(isValidServicePath('/qr1003/F003/extra')).toBe(false)
  })
})
