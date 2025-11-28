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

            let box = result.box
            if (!box && result.boxes && result.boxes.length > 0) {
              box = result.boxes.reduce((largest, current) => {
                const largestArea = Math.abs(
                  (largest[2][0] - largest[0][0]) * (largest[2][1] - largest[0][1])
                )
                const currentArea = Math.abs(
                  (current[2][0] - current[0][0]) * (current[2][1] - current[0][1])
                )
                return currentArea > largestArea ? current : largest
              })
            }

            if (!box) return

            const position = calculatePosition(box, canvas, video)
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

function calculatePosition(
  box: number[][],
  canvas: HTMLCanvasElement,
  video: HTMLVideoElement
): Position {
  const barcodeCenterX = (box[0][0] + box[2][0]) / 2
  const barcodeCenterY = (box[0][1] + box[2][1]) / 2

  const scaleX = canvas.width / video.clientWidth
  const scaleY = canvas.height / video.clientHeight

  const scaledQrboxWidth = SCANNER_CONFIG.QRBOX_WIDTH * scaleX
  const scaledQrboxHeight = SCANNER_CONFIG.QRBOX_HEIGHT * scaleY

  const screenCenterX = canvas.width / 2
  const screenCenterY = canvas.height / 2

  const qrLeft = screenCenterX - scaledQrboxWidth / 2
  const qrRight = screenCenterX + scaledQrboxWidth / 2
  const qrTop = screenCenterY - scaledQrboxHeight / 2
  const qrBottom = screenCenterY + scaledQrboxHeight / 2

  if (barcodeCenterX < qrLeft) return 'left'
  if (barcodeCenterX > qrRight) return 'right'
  if (barcodeCenterY < qrTop) return 'up'
  if (barcodeCenterY > qrBottom) return 'down'
  return 'center'
}

export function getPositionMessage(position: Position): string {
  return POSITION_MESSAGES[position]
}
