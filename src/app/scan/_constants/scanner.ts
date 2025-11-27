// 스캐너 설정
export const SCANNER_CONFIG = {
  FPS: 10,
  QRBOX_WIDTH: 250,
  QRBOX_HEIGHT: 150,
} as const

// 음성 안내 설정
export const VOICE_CONFIG = {
  COOLDOWN: 2000,
  TRACKING_INTERVAL: 200,
} as const

// 가이드 타이밍 (초)
export const GUIDE_TIMING = {
  MOVE_HINT: 3,
  DISTANCE_HINT: 10,
  TIMEOUT: 20,
} as const

// 위치 메시지
export const POSITION_MESSAGES = {
  left: '왼쪽으로 이동하세요',
  right: '오른쪽으로 이동하세요',
  up: '위로 이동하세요',
  down: '아래로 이동하세요',
  center: '바코드가 중앙에 있습니다',
} as const

export type Position = keyof typeof POSITION_MESSAGES
export type FacingMode = 'environment' | 'user'
