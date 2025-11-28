'use client'

import { useRouter } from 'next/navigation'

import { ArrowLeft } from 'lucide-react'

import { useTTSStore } from '@/store/ttsStore'

/**
 * 이전 페이지로 돌아가는 버튼 컴포넌트
 *
 * TTS 기능을 종료하고 이전 페이지로 네비게이션합니다.
 * 다른 컴포넌트들과의 일관성을 위해 routerMoveWithTTSClose를 사용합니다.
 *
 * @returns 이전 페이지로 돌아가는 버튼 엘리먼트
 *
 * @example
 * ```tsx
 * <GoBackButton />
 * ```
 */
export default function GoBackButton() {
  const router = useRouter()
  const { routerMoveWithTTSClose } = useTTSStore()

  return (
    <button
      onClick={() => routerMoveWithTTSClose(() => router.back())}
      type="button"
      aria-label="이전 페이지로 돌아가기"
    >
      <ArrowLeft size={24} strokeWidth={1.5} color="var(--color-primary)" />
    </button>
  )
}
