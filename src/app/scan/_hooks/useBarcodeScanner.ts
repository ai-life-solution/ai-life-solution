import { useCallback, useEffect, useRef } from 'react'

import { Html5Qrcode } from 'html5-qrcode'

import { useTTSStore } from '@/store/ttsStore'

import { GUIDE_TIMING, SCANNER_CONFIG } from '../_constants/scanner'

import { getPositionMessage, usePositionTracking } from './usePositionTracking'
import { useVibrate } from './useVibrate'

import type { FacingMode } from '../_constants/scanner'

interface UseBarcodeScannnerProps {
  facingMode: FacingMode
  onScanSuccess: (barcode: string) => void
  scannerKey: number
}

export function useBarcodeScanner({
  facingMode,
  onScanSuccess,
  scannerKey,
}: UseBarcodeScannnerProps) {
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scanStartTimeRef = useRef<number>(0)
  const guideIntervalRef = useRef<NodeJS.Timeout | null>(null)

  const { speak, stopSpeak } = useTTSStore()
  const { vibrate } = useVibrate()

  const handlePositionDetected = useCallback(
    (position: string) => {
      stopSpeak()
      speak(getPositionMessage(position as 'left' | 'right' | 'up' | 'down' | 'center'))
      vibrate(100)
    },
    [speak, stopSpeak, vibrate]
  )

  const { startPositionTracking, clearPositionTracking } = usePositionTracking({
    onPositionDetected: handlePositionDetected,
  })

  const clearGuideInterval = useCallback(() => {
    if (guideIntervalRef.current) {
      clearInterval(guideIntervalRef.current)
      guideIntervalRef.current = null
    }
  }, [])

  const cleanupScanner = useCallback(async () => {
    clearGuideInterval()
    clearPositionTracking()
    stopSpeak()

    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState()
        if (state === 2) {
          await scannerRef.current.stop()
        }
      } catch {
        // 스캐너 정리 실패 무시
      }
    }
  }, [clearGuideInterval, clearPositionTracking, stopSpeak])

  const switchCamera = useCallback(async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState()
        if (state === 2) {
          await scannerRef.current.stop()
        }
      } catch {
        // 카메라 전환 실패
      }
    }
  }, [])

  useEffect(() => {
    const scanner = new Html5Qrcode('barcode-reader')
    scannerRef.current = scanner
    scanStartTimeRef.current = Date.now()

    const startScanner = async () => {
      try {
        speak('제품 뒷면의 바코드를 보여주세요')

        await scanner.start(
          { facingMode },
          {
            fps: SCANNER_CONFIG.FPS,
            qrbox: {
              width: SCANNER_CONFIG.QRBOX_WIDTH,
              height: SCANNER_CONFIG.QRBOX_HEIGHT,
            },
          },
          decodedText => {
            clearGuideInterval()
            clearPositionTracking()
            stopSpeak()
            speak('바코드를 찾았습니다!')
            vibrate([200, 100, 200])
            void scanner.stop()
            onScanSuccess(`0${decodedText}`)
          },
          () => {
            // 스캔 실패 시 무시
          }
        )

        startPositionTracking()

        guideIntervalRef.current = setInterval(() => {
          const elapsed = (Date.now() - scanStartTimeRef.current) / 1000

          if (elapsed > GUIDE_TIMING.TIMEOUT) {
            speak('바코드를 찾지 못했습니다. 다시 시도해주세요')
            clearGuideInterval()
          } else if (elapsed > GUIDE_TIMING.DISTANCE_HINT) {
            speak('제품을 조금 더 가까이 또는 멀리 해보세요')
          } else if (elapsed > GUIDE_TIMING.MOVE_HINT) {
            speak('바코드를 천천히 움직여주세요')
          }
        }, 3000)
      } catch {
        speak('카메라를 시작할 수 없습니다')
      }
    }

    void startScanner()

    return () => {
      void cleanupScanner()
    }
  }, [
    facingMode,
    speak,
    vibrate,
    clearGuideInterval,
    clearPositionTracking,
    stopSpeak,
    cleanupScanner,
    startPositionTracking,
    onScanSuccess,
    scannerKey,
  ])

  return {
    cleanupScanner,
    switchCamera,
  }
}
