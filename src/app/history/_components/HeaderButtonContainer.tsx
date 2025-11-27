'use client'

import { useRouter } from 'next/navigation'

import { ArrowLeft, HomeIcon } from 'lucide-react'

import { useTTSStore } from '@/store/ttsStore'

import { STYLE } from '../_constants/style'

export default function HeaderButtonContainer() {
  const router = useRouter()
  const { routerMoveWithTTSClose } = useTTSStore()
  return (
    <div className={STYLE.HEADER_BUTTON_CONTAINER.CONTAINER}>
      <button
        className={STYLE.HEADER_BUTTON_CONTAINER.BUTTON}
        onClick={() => routerMoveWithTTSClose(() => router.back())}
      >
        <ArrowLeft size={24} strokeWidth={1.5} color="var(--color-primary)" />
      </button>
      <button
        className={STYLE.HEADER_BUTTON_CONTAINER.BUTTON}
        onClick={() => routerMoveWithTTSClose(() => router.push('/'))}
      >
        <HomeIcon size={24} strokeWidth={1.5} color="var(--color-primary)" />
      </button>
    </div>
  )
}
