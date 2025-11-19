'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { ArrowLeft, HomeIcon } from 'lucide-react'

import { COMPONENTS_HEADER_BUTTON_CONTAINER } from '../_constants/style'

export default function HeaderButtonContainer() {
  const router = useRouter()
  return (
    <div className={COMPONENTS_HEADER_BUTTON_CONTAINER.CONTAINER}>
      <button className={COMPONENTS_HEADER_BUTTON_CONTAINER.LINK} onClick={() => router.back()}>
        <ArrowLeft size={24} strokeWidth={1.5} color="var(--color-primary)" />
      </button>
      <Link className={COMPONENTS_HEADER_BUTTON_CONTAINER.LINK} href="/">
        <HomeIcon size={24} strokeWidth={1.5} color="var(--color-primary)" />
      </Link>
    </div>
  )
}
