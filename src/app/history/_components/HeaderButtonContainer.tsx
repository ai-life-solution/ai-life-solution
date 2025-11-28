'use client'

import { useRouter } from 'next/navigation'

import { ArrowLeft, HomeIcon } from 'lucide-react'

import { useTTSStore } from '@/store/ttsStore'

import { STYLE } from '../_constants/style'

/**
 * HeaderButtonContainer 컴포넌트
 * 
 * 히스토리 페이지 헤더의 네비게이션 버튼 컨테이너입니다.
 * 뒤로가기 버튼과 홈 버튼을 포함하며, TTS 기능을 종료하고 네비게이션합니다.
 * 
 * @returns 뒤로가기 및 홈 버튼을 포함한 JSX 요소
 */
export default function HeaderButtonContainer() {
  const router = useRouter()
  const { routerMoveWithTTSClose } = useTTSStore()
  return (
    <div className={STYLE.HEADER_BUTTON_CONTAINER.CONTAINER}>
      <button
        className={STYLE.HEADER_BUTTON_CONTAINER.BUTTON}
        onClick={() => routerMoveWithTTSClose(() => router.back())}
        aria-label="이전 페이지로 돌아가기"
      >
        <ArrowLeft size={24} strokeWidth={1.5} color="var(--color-primary)" />
      </button>
      <button
        className={STYLE.HEADER_BUTTON_CONTAINER.BUTTON}
        onClick={() => routerMoveWithTTSClose(() => router.push('/'))}
        aria-label="홈으로 돌아가기"
      >
        <HomeIcon size={24} strokeWidth={1.5} color="var(--color-primary)" />
      </button>
    </div>
  )
}
