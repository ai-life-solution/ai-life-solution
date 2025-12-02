// 스캐너 설정
export const SCANNER_CONFIG = {
  FPS: 10,
  QRBOX_WIDTH: 250,
  QRBOX_HEIGHT: 150,
} as const

// 음성 안내 설정
export const VOICE_CONFIG = {
  COOLDOWN: 2500,
  TRACKING_INTERVAL: 200,
} as const

// 가이드 타이밍 (초)
export const GUIDE_TIMING = {
  MOVE_HINT: 5,
  DISTANCE_HINT: 15,
  TIMEOUT: 25,
} as const

// 위치 메시지
export const POSITION_MESSAGES = {
  left: '카메라를 왼쪽으로 이동하세요',
  right: '카메라를 오른쪽으로 이동하세요',
  up: '카메라를 위로 이동하세요',
  down: '카메라를 아래로 이동하세요',
  center: '바코드가 중앙에 있습니다. 천천히 가까이 해보세요',
} as const

export type Position = keyof typeof POSITION_MESSAGES
export type FacingMode = 'environment' | 'user'
