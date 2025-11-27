'use client'

import { useRouter } from 'next/navigation'

import { ArrowLeft } from 'lucide-react'

import { STYLE } from '../_constants/style'

export default function GoBackButton() {
  const router = useRouter()
  return (
    <button className={STYLE.HEADER_BUTTON_CONTAINER.BUTTON} onClick={() => router.back()}>
      <ArrowLeft size={24} strokeWidth={1.5} color="var(--color-primary)" />
    </button>
  )
}
