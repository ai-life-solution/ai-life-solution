'use client'

import { useRouter } from 'next/navigation'

import { Camera } from 'lucide-react'

import { useTTSStore } from '@/store/ttsStore'

import { SCAN_LINK_CLASS } from '../_constants/style'

export default function ScanLink() {
  const router = useRouter()
  const { warmup, routerMoveWithTTSClose } = useTTSStore()

  const handleClick = () => {
    warmup()
    routerMoveWithTTSClose(() => {
      router.push('/scan')
    })
  }

  return (
    <button className={SCAN_LINK_CLASS} onClick={handleClick} type="button">
      스캔시작
      <Camera size={24} />
    </button>
  )
}
