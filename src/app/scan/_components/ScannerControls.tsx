'use client'

import { SwitchCamera, Volume2, VolumeX } from 'lucide-react'

interface ScannerControlsProps {
  isTTSEnabled: boolean
  onToggleTTS: () => void
  onRotateCamera: () => void
}

export default function ScannerControls({
  isTTSEnabled,
  onToggleTTS,
  onRotateCamera,
}: ScannerControlsProps) {
  return (
    <>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
        <button
          onClick={onToggleTTS}
          aria-label={isTTSEnabled ? 'TTS 끄기' : 'TTS 켜기'}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm text-white"
        >
          {isTTSEnabled ? <Volume2 size={28} /> : <VolumeX size={28} />}
        </button>
      </div>

      <div className="absolute bottom-8 right-4 z-10">
        <button
          onClick={onRotateCamera}
          aria-label="카메라 전환"
          className="flex items-center justify-center w-12 h-12 text-white"
        >
          <SwitchCamera size={24} />
        </button>
      </div>
    </>
  )
}
