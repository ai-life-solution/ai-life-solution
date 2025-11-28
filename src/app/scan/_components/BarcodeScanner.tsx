'use client'

import { useCallback, useState } from 'react'

import { useRouter } from 'next/navigation'

import ScanResultModal from '@/components/scan-result-modal/ScanResultModal'
import { useScanResultStore } from '@/store/scanResultStore'
import { useTTSStore } from '@/store/ttsStore'

import { SCANNER_CONTAINER_CLASS } from '../_constants/style'
import { useBarcodeScanner } from '../_hooks'

import ScannerControls from './ScannerControls'
import ScannerHeader from './ScannerHeader'

import type { FacingMode } from '../_constants/scanner'

export default function BarcodeScanner() {
  const router = useRouter()

  const [facingMode, setFacingMode] = useState<FacingMode>('environment')
  const [showModal, setShowModal] = useState(false)
  const [scannerKey, setScannerKey] = useState(0)

  const { isTTSEnabled, toggleTTS, stopSpeak, speak } = useTTSStore()
  const { scan } = useScanResultStore()

  const handleScanSuccess = useCallback(
    (barcode: string) => {
      setShowModal(true)
      scan(barcode)
    },
    [scan]
  )

  const { cleanupScanner, switchCamera } = useBarcodeScanner({
    facingMode,
    onScanSuccess: handleScanSuccess,
    scannerKey,
  })

  const handleRotateCamera = async () => {
    await switchCamera()
    setFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'))
    speak('카메라를 전환합니다')
  }

  const handleClose = async () => {
    await cleanupScanner()
    router.back()
  }

  const handleModalClose = () => {
    setShowModal(false)
    stopSpeak()
    setScannerKey(prev => prev + 1)
  }

  return (
    <>
      <div className={SCANNER_CONTAINER_CLASS}>
        <div className="relative w-full h-full">
          <ScannerHeader title="바코드 스캔하기" onClose={handleClose} />

          <div className="flex items-center justify-center h-full">
            <div id="barcode-reader" className="w-full" />
          </div>

          <ScannerControls
            isTTSEnabled={isTTSEnabled}
            onToggleTTS={toggleTTS}
            onRotateCamera={handleRotateCamera}
          />
        </div>
      </div>
      {showModal && <ScanResultModal open={showModal} onClose={handleModalClose} />}
    </>
  )
}
