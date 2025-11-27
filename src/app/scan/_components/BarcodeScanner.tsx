'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import Quagga from '@ericblade/quagga2'
import { Html5Qrcode } from 'html5-qrcode'
import { SwitchCamera, Volume2, VolumeX, X } from 'lucide-react'

import ScanResultModal from '@/components/scan-result-modal/ScanResultModal'
import { useScanResultStore } from '@/store/scanResultStore'
import { useTTSStore } from '@/store/ttsStore'

import { SCANNER_CONTAINER_CLASS } from '../_constants/style'

// 설정
const VOICE_COOLDOWN = 2000
const TRACKING_INTERVAL = 200

// qrbox 설정
const QRBOX_WIDTH = 250
const QRBOX_HEIGHT = 150

type Position = 'left' | 'right' | 'up' | 'down' | 'center'

export default function BarcodeScanner() {
  const router = useRouter()
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scanStartTimeRef = useRef<number>(0)
  const guideIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const positionTrackingRef = useRef<NodeJS.Timeout | null>(null)
  const lastVoiceTimeRef = useRef<number>(0)
  const isTTSEnabledRef = useRef(true)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [showModal, setShowModal] = useState(false)
  const [scannerKey, setScannerKey] = useState(0)
  const [ttsIcon, setTtsIcon] = useState(true)
  const { stopSpeak: stopSpeakGlobal } = useTTSStore()

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
      left: '왼쪽으로 이동하세요',
      right: '오른쪽으로 이동하세요',
      up: '위로 이동하세요',
      down: '아래로 이동하세요',
      center: '바코드가 중앙에 있습니다',
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
            inputStream: {
              size: canvas.width,
            },
            locator: {
              patchSize: 'large',
              halfSample: false,
            },
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

            // 바코드 중심점 계산
            const barcodeCenterX = (box[0][0] + box[2][0]) / 2
            const barcodeCenterY = (box[0][1] + box[2][1]) / 2

            // 스케일 비율 계산 (CSS 픽셀 → 비디오 해상도)
            const scaleX = canvas.width / video.clientWidth
            const scaleY = canvas.height / video.clientHeight

            // QRBOX 크기를 실제 비디오 해상도에 맞게 확대
            const scaledQrboxWidth = QRBOX_WIDTH * scaleX
            const scaledQrboxHeight = QRBOX_HEIGHT * scaleY

            // 화면 중앙 계산
            const screenCenterX = canvas.width / 2
            const screenCenterY = canvas.height / 2

            // 확대된 QRBOX 영역 계산
            const qrLeft = screenCenterX - scaledQrboxWidth / 2
            const qrRight = screenCenterX + scaledQrboxWidth / 2
            const qrTop = screenCenterY - scaledQrboxHeight / 2
            const qrBottom = screenCenterY + scaledQrboxHeight / 2

            let position: Position

            // QRBOX 영역 기준으로 위치 판단
            if (barcodeCenterX < qrLeft) {
              position = 'left'
            } else if (barcodeCenterX > qrRight) {
              position = 'right'
            } else if (barcodeCenterY < qrTop) {
              position = 'up'
            } else if (barcodeCenterY > qrBottom) {
              position = 'down'
            } else {
              // 바코드가 실제 QRBOX 안에 있음
              position = 'center'
            }

            speakPosition(position)
          }
        )
      }, TRACKING_INTERVAL)
    }

    setTimeout(tryStartTracking, 1000)
  }, [speakPosition])

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
            qrbox: { width: QRBOX_WIDTH, height: QRBOX_HEIGHT },
          },
          decodedText => {
            clearGuideInterval()
            clearPositionTracking()
            stopSpeak()
            speak('바코드를 찾았습니다!')
            vibrate([200, 100, 200])
            void scanner.stop()
            setShowModal(true)
            scan(`0${decodedText}`)
          },
          () => {
            // 스캔 실패 시 무시
          }
        )

        startPositionTracking()

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
    router.back()
  }

  const handleModalClose = () => {
    setShowModal(false)
    stopSpeakGlobal()
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
