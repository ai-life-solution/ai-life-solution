'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Html5Qrcode } from 'html5-qrcode'
import { SwitchCamera, Volume2, VolumeX, X } from 'lucide-react'

import ScanResultModal from '@/components/scan-result-modal/ScanResultModal'
import { useScanResultStore } from '@/store/scanResultStore'

import { SCANNER_CONTAINER_CLASS } from '../_constants/style'

// BarcodeDetector 타입 선언
interface BarcodeDetector {
  detect(image: HTMLVideoElement | HTMLImageElement): Promise<DetectedBarcode[]>
}

interface DetectedBarcode {
  boundingBox: {
    x: number
    y: number
    width: number
    height: number
  }
  rawValue: string
  format: string
}

type BarcodeDetectorConstructor = new (options?: { formats?: string[] }) => BarcodeDetector

declare global {
  interface Window {
    BarcodeDetector?: BarcodeDetectorConstructor
  }
}

// 위치 판단 임계값
const POSITION_THRESHOLD = 80

// 음성 안내
const VOICE_COOLDOWN = 2000

type Position = 'left' | 'right' | 'up' | 'down' | 'center'

export default function BarcodeScanner() {
  const router = useRouter()
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scanStartTimeRef = useRef<number>(0)
  const guideIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const positionTrackingRef = useRef<NodeJS.Timeout | null>(null)
  const lastVoiceTimeRef = useRef<number>(0)
  const isTTSEnabledRef = useRef(true)
  const barcodeDetectorRef = useRef<BarcodeDetector | null>(null)

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [showModal, setShowModal] = useState(false)
  const [scannerKey, setScannerKey] = useState(0)
  const [ttsIcon, setTtsIcon] = useState(true)
  const [isBarcodeDetectorSupported, setIsBarcodeDetectorSupported] = useState(false)

  const { scan } = useScanResultStore()

  const speak = useCallback((text: string) => {
    if (!isTTSEnabledRef.current) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ko-KR'
    utterance.rate = 1.0
    window.speechSynthesis.speak(utterance)
  }, [])

  const stopSpeak = useCallback(() => {
    window.speechSynthesis.cancel()
  }, [])

  const vibrate = useCallback((pattern: number | number[]) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern)
    }
  }, [])

  const clearGuideInterval = useCallback(() => {
    if (guideIntervalRef.current) {
      clearInterval(guideIntervalRef.current)
      guideIntervalRef.current = null
    }
  }, [])

  const clearPositionTracking = useCallback(() => {
    if (positionTrackingRef.current) {
      clearInterval(positionTrackingRef.current)
      positionTrackingRef.current = null
    }
  }, [])

  const getPositionMessage = (position: Position): string => {
    const messages: Record<Position, string> = {
      left: '휴대폰을 왼쪽으로 이동하세요',
      right: '휴대폰을 오른쪽으로 이동하세요',
      up: '휴대폰을 위로 이동하세요',
      down: '휴대폰을 아래로 이동하세요',
      center: '바코드가 중앙입니다',
    }
    return messages[position]
  }

  const speakPosition = useCallback(
    (position: Position) => {
      const now = Date.now()
      if (now - lastVoiceTimeRef.current < VOICE_COOLDOWN) {
        return
      }

      stopSpeak()
      lastVoiceTimeRef.current = now
      speak(getPositionMessage(position))
      vibrate(100)
    },
    [speak, vibrate, stopSpeak]
  )

  const startPositionTracking = useCallback(() => {
    if (!isBarcodeDetectorSupported || !barcodeDetectorRef.current) {
      return
    }

    const tryStartTracking = () => {
      const video = document.querySelector('#barcode-reader video') as HTMLVideoElement | null

      if (!video || video.readyState !== 4) {
        setTimeout(tryStartTracking, 300)
        return
      }

      positionTrackingRef.current = setInterval(() => {
        void (async () => {
          if (!barcodeDetectorRef.current || !video) return

          try {
            const barcodes = await barcodeDetectorRef.current.detect(video)

            if (barcodes.length === 0) return

            const barcode = barcodes[0]
            const { boundingBox } = barcode

            const barcodeCenterX = boundingBox.x + boundingBox.width / 2
            const barcodeCenterY = boundingBox.y + boundingBox.height / 2

            const screenCenterX = video.videoWidth / 2
            const screenCenterY = video.videoHeight / 2

            const dx = barcodeCenterX - screenCenterX
            const dy = barcodeCenterY - screenCenterY

            let position: Position

            if (Math.abs(dx) < POSITION_THRESHOLD && Math.abs(dy) < POSITION_THRESHOLD) {
              position = 'center'
            } else if (Math.abs(dx) > Math.abs(dy)) {
              // 바코드가 오른쪽에 있으면 휴대폰을 오른쪽으로 이동
              position = dx > 0 ? 'right' : 'left'
            } else {
              // 바코드가 아래에 있으면 휴대폰을 아래로 이동
              position = dy > 0 ? 'down' : 'up'
            }

            speakPosition(position)
          } catch (_error) {
            // BarcodeDetector 에러 무시
          }
        })()
      }, 500)
    }

    setTimeout(tryStartTracking, 1000)
  }, [isBarcodeDetectorSupported, speakPosition])

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
      } catch (_err) {
        // 스캐너 정리 실패 무시
      }
    }
  }, [clearGuideInterval, clearPositionTracking, stopSpeak])

  useEffect(() => {
    const checkBarcodeDetector = () => {
      if ('BarcodeDetector' in window && window.BarcodeDetector) {
        setIsBarcodeDetectorSupported(true)
        barcodeDetectorRef.current = new window.BarcodeDetector({
          formats: [
            'ean_13',
            'ean_8',
            'upc_a',
            'upc_e',
            'code_128',
            'code_39',
            'code_93',
            'codabar',
            'itf',
          ],
        })
      } else {
        setIsBarcodeDetectorSupported(false)
      }
    }

    checkBarcodeDetector()
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
            fps: 10,
            qrbox: { width: 250, height: 150 },
          },
          decodedText => {
            clearGuideInterval()
            clearPositionTracking()
            stopSpeak()
            speak('바코드를 찾았습니다!')
            vibrate([200, 100, 200])
            void scanner.stop()
            // console.log('바코드 스캔 성공:', decodedText)
            setShowModal(true)
            scan(`0${decodedText}`)
          },
          () => {
            // 스캔 실패 시 무시하고 계속 시도
          }
        )

        if (isBarcodeDetectorSupported) {
          startPositionTracking()
        }

        guideIntervalRef.current = setInterval(() => {
          const elapsed = (Date.now() - scanStartTimeRef.current) / 1000

          if (elapsed > 20) {
            speak('바코드를 찾지 못했습니다. 다시 시도해주세요')
            clearGuideInterval()
          } else if (elapsed > 10) {
            speak('제품을 조금 더 가까이 또는 멀리 해보세요')
          } else if (elapsed > 3) {
            speak('바코드를 천천히 움직여주세요')
          }
        }, 3000)
      } catch (_err) {
        speak('카메라를 시작할 수 없습니다')
      }
    }

    void startScanner()

    return () => {
      void cleanupScanner()
    }
  }, [
    facingMode,
    scan,
    speak,
    vibrate,
    clearGuideInterval,
    clearPositionTracking,
    stopSpeak,
    cleanupScanner,
    isBarcodeDetectorSupported,
    startPositionTracking,
    scannerKey,
  ])

  const handleRotateCamera = async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState()
        if (state === 2) {
          await scannerRef.current.stop()
        }
        setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'))
        speak('카메라를 전환합니다')
      } catch (_err) {
        // 카메라 전환 실패
      }
    }
  }

  const handleClose = async () => {
    await cleanupScanner()
    router.push('/')
  }

  const handleModalClose = () => {
    setShowModal(false)
    setScannerKey(prev => prev + 1)
  }

  const handleToggleTTS = () => {
    isTTSEnabledRef.current = !isTTSEnabledRef.current
    setTtsIcon(isTTSEnabledRef.current)
    if (!isTTSEnabledRef.current) {
      stopSpeak()
    }
  }

  return (
    <>
      <div className={SCANNER_CONTAINER_CLASS}>
        <div className="relative w-full h-full">
          <div className="absolute top-4 right-4 z-20">
            <button
              onClick={handleClose}
              aria-label="닫기"
              className="flex items-center justify-center w-12 h-12 text-white"
            >
              <X size={24} />
            </button>
          </div>

          <div className="absolute top-6 left-0 right-0 z-10 text-center">
            <h1 className="text-lg font-semibold text-white">바코드 스캔하기</h1>
          </div>

          <div className="flex items-center justify-center h-full">
            <div id="barcode-reader" className="w-full" />
          </div>

          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
            <button
              onClick={handleToggleTTS}
              aria-label={ttsIcon ? 'TTS 끄기' : 'TTS 켜기'}
              className="flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm text-white"
            >
              {ttsIcon ? <Volume2 size={28} /> : <VolumeX size={28} />}
            </button>
          </div>

          <div className="absolute bottom-8 right-4 z-10">
            <button
              onClick={handleRotateCamera}
              aria-label="카메라 전환"
              className="flex items-center justify-center w-12 h-12 text-white"
            >
              <SwitchCamera size={24} />
            </button>
          </div>
        </div>
      </div>
      {showModal && <ScanResultModal open={showModal} onClose={handleModalClose} />}
    </>
  )
}
