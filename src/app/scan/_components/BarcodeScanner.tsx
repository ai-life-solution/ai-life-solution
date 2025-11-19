'use client'

import { useEffect, useRef, useState } from 'react'

import { useRouter } from 'next/navigation'

import { Html5Qrcode } from 'html5-qrcode'
import { X, SwitchCamera } from 'lucide-react'

import { SCANNER_CONTAINER_CLASS } from '../_constants/style'

export default function BarcodeScanner() {
  const router = useRouter()
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scanStartTimeRef = useRef<number>(0)
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment')

  // TTS 음성
  const speak = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'ko-KR'
    utterance.rate = 1.0
    window.speechSynthesis.speak(utterance)
  }

  // 진동
  const vibrate = (pattern: number | number[]) => {
    if (navigator.vibrate) {
      navigator.vibrate(pattern)
    }
  }

  // 바코드 스캐너 초기화 및 실행
  useEffect(() => {
    const scanner = new Html5Qrcode('barcode-reader')
    scannerRef.current = scanner
    scanStartTimeRef.current = Date.now()

    const startScanner = async () => {
      try {
        speak('제품 뒷면의 바코드를 보여주세요')

        // 카메라 시작
        await scanner.start(
          { facingMode },
          {
            fps: 10,
            qrbox: { width: 250, height: 150 },
          },
          decodedText => {
            // 스캔 성공 시 실행
            speak('바코드를 찾았습니다!')
            vibrate([200, 100, 200])
            scanner.stop().catch(console.error)

            console.error('스캔 성공! 바코드 번호:', decodedText)
          },
          _errorMessage => {
            // 스캔 실패 시 무시하고 계속 시도
          }
        )

        // 시간별 음성 가이드
        const guideInterval = setInterval(() => {
          const elapsed = (Date.now() - scanStartTimeRef.current) / 1000

          if (elapsed > 20) {
            speak('바코드를 찾지 못했습니다. 다시 시도해주세요')
            clearInterval(guideInterval)
          } else if (elapsed > 10) {
            speak('제품을 조금 더 가까이 또는 멀리 해보세요')
          } else if (elapsed > 3) {
            speak('바코드를 천천히 움직여주세요')
          }
        }, 3000)

        return () => clearInterval(guideInterval)
      } catch (err) {
        console.error('카메라 시작 실패:', err)
        speak('카메라를 시작할 수 없습니다')
      }
    }

    startScanner()

    // 다른 페이지 이동 시 카메라 종료
    return () => {
      if (scannerRef.current) {
        const state = scannerRef.current.getState()
        if (state === 2) {
          // 2 = 스캔 중 상태
          scannerRef.current.stop().catch(console.error)
        }
      }
    }
  }, [facingMode])

  // 카메라 전환 (전면 <-> 후면)
  const handleRotateCamera = async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState()
        if (state === 2) {
          // 2 = 스캔 중 상태
          await scannerRef.current.stop()
        }
        setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'))
        speak('카메라를 전환합니다')
      } catch (err) {
        console.error('카메라 전환 실패:', err)
      }
    }
  }

  const handleClose = () => {
    speak('스캔을 종료합니다')
    router.push('/')
  }

  return (
    <div className={SCANNER_CONTAINER_CLASS}>
      <div className="relative w-full h-full">
        {/* 닫기 버튼 */}
        <div className="absolute top-4 right-4 z-20">
          <button
            onClick={handleClose}
            aria-label="닫기"
            className="flex items-center justify-center w-12 h-12 text-white"
          >
            <X size={24} />
          </button>
        </div>

        {/* 제목 */}
        <div className="absolute top-6 left-0 right-0 z-10 text-center">
          <h1 className="text-lg font-semibold text-white">바코드 스캔하기</h1>
        </div>

        {/* 스캔 영역 */}
        <div className="flex items-center justify-center h-full">
          <div id="barcode-reader" className="w-full" />
        </div>

        {/* 카메라 전환 버튼 */}
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
  )
}
