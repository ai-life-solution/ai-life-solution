import { useCallback, useRef } from 'react'

import Quagga from '@ericblade/quagga2'

import { calculateBarcodePosition, getPositionMessage } from '@/core/scanner/positionCalculator'
import { shouldAnnouncePosition } from '@/core/scanner/scannerPolicy'
import type { Position } from '@/core/scanner/types'

import { SCANNER_CONFIG, VOICE_CONFIG } from '../_constants/scanner'

interface UsePositionTrackingProps {
  onPositionDetected: (position: Position) => void
}

export { getPositionMessage }

export function usePositionTracking({ onPositionDetected }: UsePositionTrackingProps) {
  const positionTrackingRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const lastVoiceTimeRef = useRef<number>(0)
  const lastPositionRef = useRef<Position | null>(null)

  const clearPositionTracking = useCallback(() => {
    if (startTimeoutRef.current) {
      clearTimeout(startTimeoutRef.current)
      startTimeoutRef.current = null
    }
    if (positionTrackingRef.current) {
      clearInterval(positionTrackingRef.current)
      positionTrackingRef.current = null
    }
  }, [])

  const speakPositionWithCooldown = useCallback(
    (position: Position) => {
      const now = Date.now()
      const shouldAnnounce = shouldAnnouncePosition({
        nextPosition: position,
        lastPosition: lastPositionRef.current,
        now,
        lastVoiceTime: lastVoiceTimeRef.current,
        cooldownMs: VOICE_CONFIG.COOLDOWN,
      })

      if (!shouldAnnounce) {
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
        startTimeoutRef.current = setTimeout(tryStartTracking, 300)
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

            const position = calculateBarcodePosition(
              box,
              { width: video.videoWidth, height: video.videoHeight },
              { width: video.clientWidth, height: video.clientHeight },
              { width: SCANNER_CONFIG.QRBOX_WIDTH, height: SCANNER_CONFIG.QRBOX_HEIGHT }
            )
            speakPositionWithCooldown(position)
          }
        )
      }, VOICE_CONFIG.TRACKING_INTERVAL)
    }

    startTimeoutRef.current = setTimeout(tryStartTracking, 1000)
  }, [speakPositionWithCooldown])

  return {
    startPositionTracking,
    clearPositionTracking,
  }
}
