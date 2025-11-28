'use client'

import { useRouter } from 'next/navigation'

import { Camera } from 'lucide-react'

import { useTTSStore } from '@/store/ttsStore'

import { SCAN_LINK_CLASS } from '../_constants/style'

/**
 * 바코드 스캔 페이지로 이동하는 링크 컴포넌트
 *
 * TTS 기능을 준비하고 스캔 페이지로 네비게이션합니다.
 * 다른 컴포넌트들과의 일관성을 위해 routerMoveWithTTSClose를 사용합니다.
 *
 * @returns 스캔 시작 버튼 엘리먼트
 *
 * @example
 * ```tsx
 * <ScanLink />
 * ```
 */
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
