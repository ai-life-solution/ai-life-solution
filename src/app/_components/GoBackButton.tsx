'use client'

import { useRouter } from 'next/navigation'

export default function GoBackButton() {
  const router = useRouter()
  return (
    <button onClick={() => router.back()} type="button">
      뒤로 가기
    </button>
  )
}
