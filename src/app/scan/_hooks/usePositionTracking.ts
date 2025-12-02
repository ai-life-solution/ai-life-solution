import { useCallback, useRef } from 'react'

import Quagga from '@ericblade/quagga2'

import {
  type Position,
  POSITION_MESSAGES,
  SCANNER_CONFIG,
  VOICE_CONFIG,
} from '../_constants/scanner'

interface UsePositionTrackingProps {
  onPositionDetected: (position: Position) => void
}

export function usePositionTracking({ onPositionDetected }: UsePositionTrackingProps) {
  const positionTrackingRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const lastVoiceTimeRef = useRef<number>(0)
  const lastPositionRef = useRef<Position | null>(null)

  const clearPositionTracking = useCallback(() => {
    if (positionTrackingRef.current) {
      clearInterval(positionTrackingRef.current)
      positionTrackingRef.current = null
    }
  }, [])

  const speakPositionWithCooldown = useCallback(
    (position: Position) => {
      const now = Date.now()

      // 쿨다운 체크
      if (now - lastVoiceTimeRef.current < VOICE_CONFIG.COOLDOWN) {
        return
      }

      // 같은 position이면 안내 안 함
      if (lastPositionRef.current === position) {
        return
      }

      lastPositionRef.current = position
      lastVoiceTimeRef.current = now
      onPositionDetected(position)
    },
    [onPositionDetected]
  )

  const startPositionTracking = useCallback(() => {
    const tryStartTracking = () => {
      const video = document.querySelector('#barcode-reader video') as HTMLVideoElement | null

      if (!video || video.readyState !== 4) {
        setTimeout(tryStartTracking, 300)
        return
      }

      if (!canvasRef.current) {
        canvasRef.current = document.createElement('canvas')
      }
      const canvas = canvasRef.current
      const ctx = canvas.getContext('2d')
      if (!ctx) return

      positionTrackingRef.current = setInterval(() => {
        if (!video || video.readyState !== 4) return

        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

        Quagga.decodeSingle(
          {
            src: canvas.toDataURL('image/png'),
            numOfWorkers: 0,
            locate: true,
            inputStream: { size: canvas.width },
            locator: { patchSize: 'medium', halfSample: false },
            decoder: {
              readers: [
                'ean_reader',
                'ean_8_reader',
                'code_128_reader',
                'code_39_reader',
                'upc_reader',
                'upc_e_reader',
              ],
            },
          },
          result => {
            if (!result) return

            // 실제로 디코딩된 바코드(result.box)만 사용!
            // result.boxes는 후보 영역이므로 사용하지 않음
            const box = result.box

            if (!box) return

            const position = calculatePosition(box, video)
            speakPositionWithCooldown(position)
          }
        )
      }, VOICE_CONFIG.TRACKING_INTERVAL)
    }

    setTimeout(tryStartTracking, 1000)
  }, [speakPositionWithCooldown])

  return {
    startPositionTracking,
    clearPositionTracking,
  }
}

function calculatePosition(box: number[][], video: HTMLVideoElement): Position {
  // 1. 바코드 중심점 (비디오 해상도 좌표)
  const barcodeCenterX = (box[0][0] + box[2][0]) / 2
  const barcodeCenterY = (box[0][1] + box[2][1]) / 2

  // 2. 비디오 실제 해상도
  const videoWidth = video.videoWidth
  const videoHeight = video.videoHeight

  // 3. 비디오 화면 표시 크기 (CSS)
  const displayWidth = video.clientWidth
  const displayHeight = video.clientHeight

  // 4. QRBox를 비디오 해상도로 변환
  const scaleX = videoWidth / displayWidth
  const scaleY = videoHeight / displayHeight

  const qrboxWidthInVideo = SCANNER_CONFIG.QRBOX_WIDTH * scaleX
  const qrboxHeightInVideo = SCANNER_CONFIG.QRBOX_HEIGHT * scaleY

  // 5. 비디오 중심점
  const videoCenterX = videoWidth / 2
  const videoCenterY = videoHeight / 2

  // 6. QRBox 영역 (비디오 해상도 기준)
  const qrLeft = videoCenterX - qrboxWidthInVideo / 2
  const qrRight = videoCenterX + qrboxWidthInVideo / 2
  const qrTop = videoCenterY - qrboxHeightInVideo / 2
  const qrBottom = videoCenterY + qrboxHeightInVideo / 2

  // 7. 위치 판정
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

export function getPositionMessage(position: Position): string {
  return POSITION_MESSAGES[position]
}
