import type { Dimension, Position } from './types'

export const POSITION_MESSAGES: Record<Position, string> = {
  left: '카메라를 왼쪽으로 이동하세요',
  right: '카메라를 오른쪽으로 이동하세요',
  up: '카메라를 위로 이동하세요',
  down: '카메라를 아래로 이동하세요',
  center: '바코드가 중앙에 있습니다. 천천히 가까이 해보세요',
} as const

/**
 * 주어진 위치에 대응하는 한국어 음성 안내 문자열을 반환합니다.
 * (Functional Core: 순수 함수)
 */
export function getPositionMessage(position: Position): string {
  return POSITION_MESSAGES[position]
}

/**
 * 비디오 해상도, 표시 영역, QRBox 영역과 바코드 바운딩 박스를 비교하여
 * 바코드의 상대적 위치(left/right/up/down/center)를 기하학적으로 계산합니다.
 * (Functional Core: DOM 및 비디오 요소 의존성 없음, 순수 계산 함수)
 *
 * @param box - 바코드 바운딩 박스 4개 점 좌표 [[x1, y1], [x2, y2], [x3, y3], [x4, y4]]
 * @param frameResolution - 실제 비디오 해상도 { width, height }
 * @param displayDimension - 화면상 렌더링된 비디오 크기 { width, height }
 * @param qrBoxDimension - 화면상 QRBox 크기 { width, height }
 * @returns 판정된 상대 위치 Position
 */
export function calculateBarcodePosition(
  box: number[][],
  frameResolution: Dimension,
  displayDimension: Dimension,
  qrBoxDimension: Dimension
): Position {
  if (
    displayDimension.width <= 0 ||
    displayDimension.height <= 0 ||
    frameResolution.width <= 0 ||
    frameResolution.height <= 0 ||
    !box ||
    box.length < 3
  ) {
    return 'center'
  }

  // 1. 바코드 중심점 (비디오 해상도 기준 좌표)
  const barcodeCenterX = (box[0][0] + box[2][0]) / 2
  const barcodeCenterY = (box[0][1] + box[2][1]) / 2

  // 2. 화면 표시 크기 대비 실제 비디오 해상도 비율
  const scaleX = frameResolution.width / displayDimension.width
  const scaleY = frameResolution.height / displayDimension.height

  // 3. QRBox의 비디오 해상도 환산 크기
  const qrboxWidthInVideo = qrBoxDimension.width * scaleX
  const qrboxHeightInVideo = qrBoxDimension.height * scaleY

  // 4. 비디오 중심점
  const videoCenterX = frameResolution.width / 2
  const videoCenterY = frameResolution.height / 2

  // 5. QRBox 경계선 (비디오 해상도 기준)
  const qrLeft = videoCenterX - qrboxWidthInVideo / 2
  const qrRight = videoCenterX + qrboxWidthInVideo / 2
  const qrTop = videoCenterY - qrboxHeightInVideo / 2
  const qrBottom = videoCenterY + qrboxHeightInVideo / 2

  // 6. 위치 판정
  if (barcodeCenterX < qrLeft) {
    return 'left'
  }
  if (barcodeCenterX > qrRight) {
    return 'right'
  }
  if (barcodeCenterY < qrTop) {
    return 'up'
  }
  if (barcodeCenterY > qrBottom) {
    return 'down'
  }

  return 'center'
}
