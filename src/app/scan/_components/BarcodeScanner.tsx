'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Html5Qrcode } from 'html5-qrcode'
import { SwitchCamera, Volume2, VolumeX, X } from 'lucide-react'

import ScanResultModal from '@/components/scan-result-modal/ScanResultModal'
import { useScanResultStore } from '@/store/scanResultStore'

import { SCANNER_CONTAINER_CLASS } from '../_constants/style'

export default function BarcodeScanner() {
  const router = useRouter()
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scanStartTimeRef = useRef<number>(0)
  const guideIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const isTTSEnabledRef = useRef(true)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')
  const [showModal, setShowModal] = useState(false)
  const [scannerKey, setScannerKey] = useState(0)
  const [ttsIcon, setTtsIcon] = useState(true)

  const { scan } = useScanResultStore()

  const speak = (text: string) => {
    if (!isTTSEnabledRef.current) return

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ko-KR'
    utterance.rate = 1.0
    window.speechSynthesis.speak(utterance)
  }

  const stopSpeak = () => {
    window.speechSynthesis.cancel()
  }

  const vibrate = (pattern: number | number[]) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern)
    }
  }

  const clearGuideInterval = () => {
    if (guideIntervalRef.current) {
      clearInterval(guideIntervalRef.current)
      guideIntervalRef.current = null
    }
  }

  const cleanupScanner = useCallback(async () => {
    clearGuideInterval()
    stopSpeak()

    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState()
        if (state === 2) {
          await scannerRef.current.stop()
        }
      } catch (err) {
        console.error('스캐너 정리 실패:', err)
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
            fps: 10,
            qrbox: { width: 250, height: 150 },
          },
          decodedText => {
            clearGuideInterval()
            stopSpeak()
            speak('바코드를 찾았습니다!')
            vibrate([200, 100, 200])
            scanner.stop().catch(console.error)

            // console.log('바코드 스캔 성공:', decodedText)

            setShowModal(true)
            scan(decodedText)
          },
          () => {
            // 스캔 실패 시 무시하고 계속 시도
          }
        )

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
      } catch (err) {
        console.error('카메라 시작 실패:', err)
        speak('카메라를 시작할 수 없습니다')
      }
    }

    startScanner()

    return () => {
      cleanupScanner()
    }
  }, [facingMode, scan, cleanupScanner, scannerKey])

  const handleRotateCamera = async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState()
        if (state === 2) {
          await scannerRef.current.stop()
        }
        setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'))
        speak('카메라를 전환합니다')
      } catch (err) {
        console.error('카메라 전환 실패:', err)
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
