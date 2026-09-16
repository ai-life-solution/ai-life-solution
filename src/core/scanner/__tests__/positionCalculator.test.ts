import { describe, expect, it } from 'bun:test'

import { calculateBarcodePosition, getPositionMessage } from '../positionCalculator'

describe('positionCalculator (Functional Core)', () => {
  // 비디오 해상도 1280x720, 화면 크기 640x360 (scale = 2)
  // QRBox 화면 크기: 250x150 -> 비디오 기준: 500x300
  // 비디오 중심: (640, 360)
  // QRBox 비디오 영역:
  //   Left: 640 - 250 = 390
  //   Right: 640 + 250 = 890
  //   Top: 360 - 150 = 210
  //   Bottom: 360 + 150 = 510
  const frameResolution = { width: 1280, height: 720 }
  const displayDimension = { width: 640, height: 360 }
  const qrBoxDimension = { width: 250, height: 150 }

  function makeBox(centerX: number, centerY: number, size = 40): number[][] {
    const half = size / 2
    return [
      [centerX - half, centerY - half],
      [centerX + half, centerY - half],
      [centerX + half, centerY + half],
      [centerX - half, centerY + half],
    ]
  }

  describe('C-03: calculateBarcodePosition', () => {
    it('바코드 중심점이 QRBox 좌측 바깥에 있으면 left를 반환해야 한다', () => {
      // centerX = 300 (< 390)
      const box = makeBox(300, 360)
      expect(calculateBarcodePosition(box, frameResolution, displayDimension, qrBoxDimension)).toBe(
        'left'
      )
    })

    it('바코드 중심점이 QRBox 우측 바깥에 있으면 right를 반환해야 한다', () => {
      // centerX = 950 (> 890)
      const box = makeBox(950, 360)
      expect(calculateBarcodePosition(box, frameResolution, displayDimension, qrBoxDimension)).toBe(
        'right'
      )
    })

    it('바코드 중심점이 QRBox 상단 바깥에 있으면 up을 반환해야 한다', () => {
      // centerY = 150 (< 210), centerX = 640 (390 <= x <= 890)
      const box = makeBox(640, 150)
      expect(calculateBarcodePosition(box, frameResolution, displayDimension, qrBoxDimension)).toBe(
        'up'
      )
    })

    it('바코드 중심점이 QRBox 하단 바깥에 있으면 down을 반환해야 한다', () => {
      // centerY = 550 (> 510), centerX = 640
      const box = makeBox(640, 550)
      expect(calculateBarcodePosition(box, frameResolution, displayDimension, qrBoxDimension)).toBe(
        'down'
      )
    })

    it('바코드 중심점이 QRBox 내부에 있으면 center를 반환해야 한다', () => {
      // centerX = 640, centerY = 360
      const box = makeBox(640, 360)
      expect(calculateBarcodePosition(box, frameResolution, displayDimension, qrBoxDimension)).toBe(
        'center'
      )
    })

    it('표시 영역(clientWidth/clientHeight)이 0 이하일 경우 안전하게 center를 반환해야 한다', () => {
      const box = makeBox(100, 100)
      expect(
        calculateBarcodePosition(box, frameResolution, { width: 0, height: 0 }, qrBoxDimension)
      ).toBe('center')
    })
  })

  describe('C-04: getPositionMessage', () => {
    it('각 위치별 지정된 음성 안내 메시지를 반환해야 한다', () => {
      expect(getPositionMessage('left')).toBe('카메라를 왼쪽으로 이동하세요')
      expect(getPositionMessage('right')).toBe('카메라를 오른쪽으로 이동하세요')
      expect(getPositionMessage('up')).toBe('카메라를 위로 이동하세요')
      expect(getPositionMessage('down')).toBe('카메라를 아래로 이동하세요')
      expect(getPositionMessage('center')).toBe('바코드가 중앙에 있습니다. 천천히 가까이 해보세요')
    })
  })
})
