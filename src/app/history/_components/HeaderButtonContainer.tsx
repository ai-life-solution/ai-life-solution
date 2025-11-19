'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { ArrowLeft, HomeIcon } from 'lucide-react'

import { STYLE } from '../_constants/style'

export default function HeaderButtonContainer() {
  const router = useRouter()
  return (
    <div className={STYLE.HEADER_BUTTON_CONTAINER.CONTAINER}>
      <button className={STYLE.HEADER_BUTTON_CONTAINER.BUTTON} onClick={() => router.back()}>
        <ArrowLeft size={24} strokeWidth={1.5} color="var(--color-primary)" />
      </button>
      <Link className={STYLE.HEADER_BUTTON_CONTAINER.BUTTON} href="/">
        <HomeIcon size={24} strokeWidth={1.5} color="var(--color-primary)" />
      </Link>
    </div>
  )
}
