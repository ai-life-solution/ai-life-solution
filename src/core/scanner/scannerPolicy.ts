import type { AnnounceDecisionParams, GuideTimingConfig } from './types'

export const DEFAULT_GUIDE_TIMING: GuideTimingConfig = {
  moveHint: 5,
  distanceHint: 15,
  timeout: 25,
} as const

/**
 * 쿨다운 및 위치 변화 여부를 검사하여 음성 안내를 출력해야 하는지 판정합니다.
 * (Functional Core: 순수 함수)
 *
 * @param params - 판정에 필요한 입력값 (다음 위치, 이전 위치, 현재 시각, 이전 안내 시각, 쿨다운 시간)
 * @returns 음성 안내 출력 여부 boolean
 */
export function shouldAnnouncePosition({
  nextPosition,
  lastPosition,
  now,
  lastVoiceTime,
  cooldownMs,
}: AnnounceDecisionParams): boolean {
  // 1. 쿨다운 검사 (단, 최초 발화인 lastVoiceTime === 0인 경우는 쿨다운 대기 없음)
  if (lastVoiceTime > 0 && now - lastVoiceTime < cooldownMs) {
    return false
  }

  // 2. 동일 위치 중복 안내 방지
  if (lastPosition === nextPosition) {
    return false
  }

  return true
}

/**
 * 스캔 시작 후 경과 시간에 따라 사용자에게 제공할 음성 가이드 멘트를 결정합니다.
 * (Functional Core: 순수 함수)
 *
 * @param elapsedSeconds - 스캔 시작 후 경과된 시간 (초 단위)
 * @param timingConfig - 가이드 타이밍 설정 (기본값: DEFAULT_GUIDE_TIMING)
 * @returns 출력할 가이드 멘트 문자열 또는 안내가 불필요한 경우 null
 */
export function resolveScanGuidePrompt(
  elapsedSeconds: number,
  timingConfig: GuideTimingConfig = DEFAULT_GUIDE_TIMING
): string | null {
  if (elapsedSeconds > timingConfig.timeout) {
    return '바코드를 찾지 못했습니다. 다시 시도해주세요'
  }

  if (elapsedSeconds > timingConfig.distanceHint) {
    return '제품을 조금 더 가까이 또는 멀리 해보세요'
  }

  if (elapsedSeconds > timingConfig.moveHint) {
    return '천천히 움직여주세요'
  }

  return null
}
