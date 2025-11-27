'use client'

import { X } from 'lucide-react'

interface ScannerHeaderProps {
  title: string
  onClose: () => void
}

export default function ScannerHeader({ title, onClose }: ScannerHeaderProps) {
  return (
    <>
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={onClose}
          aria-label="닫기"
          className="flex items-center justify-center w-12 h-12 text-white"
        >
          <X size={24} />
        </button>
      </div>

      <div className="absolute top-6 left-0 right-0 z-10 text-center">
        <h1 className="text-lg font-semibold text-white">{title}</h1>
      </div>
    </>
  )
}
