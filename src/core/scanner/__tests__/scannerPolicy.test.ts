import { describe, expect, it } from 'bun:test'

import { resolveScanGuidePrompt, shouldAnnouncePosition } from '../scannerPolicy'

describe('scannerPolicy (Functional Core)', () => {
  describe('C-05: shouldAnnouncePosition', () => {
    const cooldownMs = 2500

    it('쿨다운 시간이 경과하지 않았으면 false를 반환해야 한다', () => {
      const result = shouldAnnouncePosition({
        nextPosition: 'left',
        lastPosition: 'right',
        now: 3000,
        lastVoiceTime: 1000, // 2000ms 경과 < 2500ms
        cooldownMs,
      })
      expect(result).toBe(false)
    })

    it('쿨다운이 경과했더라도 이전 안내 위치와 동일한 위치면 false를 반환해야 한다', () => {
      const result = shouldAnnouncePosition({
        nextPosition: 'left',
        lastPosition: 'left', // 동일 위치
        now: 5000,
        lastVoiceTime: 1000, // 4000ms 경과 > 2500ms
        cooldownMs,
      })
      expect(result).toBe(false)
    })

    it('쿨다운이 경과하고 위치가 달라졌으면 true를 반환해야 한다', () => {
      const result = shouldAnnouncePosition({
        nextPosition: 'left',
        lastPosition: 'right',
        now: 5000,
        lastVoiceTime: 1000,
        cooldownMs,
      })
      expect(result).toBe(true)
    })

    it('이전에 안내한 적이 없는 경우(lastPosition === null, lastVoiceTime === 0) true를 반환해야 한다', () => {
      const result = shouldAnnouncePosition({
        nextPosition: 'center',
        lastPosition: null,
        now: 100,
        lastVoiceTime: 0,
        cooldownMs,
      })
      expect(result).toBe(true)
    })
  })

  describe('C-06: resolveScanGuidePrompt', () => {
    // 기본 타이밍: MOVE_HINT: 5, DISTANCE_HINT: 15, TIMEOUT: 25
    it('TIMEOUT(25초) 초과 시 재시도 안내 멘트를 반환해야 한다', () => {
      expect(resolveScanGuidePrompt(26)).toBe('바코드를 찾지 못했습니다. 다시 시도해주세요')
      expect(resolveScanGuidePrompt(30)).toBe('바코드를 찾지 못했습니다. 다시 시도해주세요')
    })

    it('DISTANCE_HINT(15초) 초과 25초 이하 시 거리 조절 멘트를 반환해야 한다', () => {
      expect(resolveScanGuidePrompt(16)).toBe('제품을 조금 더 가까이 또는 멀리 해보세요')
      expect(resolveScanGuidePrompt(25)).toBe('제품을 조금 더 가까이 또는 멀리 해보세요')
    })

    it('MOVE_HINT(5초) 초과 15초 이하 시 이동 멘트를 반환해야 한다', () => {
      expect(resolveScanGuidePrompt(6)).toBe('천천히 움직여주세요')
      expect(resolveScanGuidePrompt(15)).toBe('천천히 움직여주세요')
    })

    it('MOVE_HINT(5초) 이하 시 안내 멘트가 없어야 한다(null)', () => {
      expect(resolveScanGuidePrompt(0)).toBeNull()
      expect(resolveScanGuidePrompt(3)).toBeNull()
      expect(resolveScanGuidePrompt(5)).toBeNull()
    })

    it('커스텀 timingConfig를 주입받아 동작할 수 있어야 한다', () => {
      const customConfig = {
        moveHint: 2,
        distanceHint: 4,
        timeout: 6,
      }
      expect(resolveScanGuidePrompt(1, customConfig)).toBeNull()
      expect(resolveScanGuidePrompt(3, customConfig)).toBe('천천히 움직여주세요')
      expect(resolveScanGuidePrompt(5, customConfig)).toBe(
        '제품을 조금 더 가까이 또는 멀리 해보세요'
      )
      expect(resolveScanGuidePrompt(7, customConfig)).toBe(
        '바코드를 찾지 못했습니다. 다시 시도해주세요'
      )
    })
  })
})
