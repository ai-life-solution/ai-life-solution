'use client' // 에러 바운더리는 클라이언트여야 합니다.

import { useEffect } from 'react'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

import { BLACK_FILL_BUTTON_CLASS } from './_constants/style'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="max-w-[600px] mx-auto p-4 flex flex-col gap-2">
      <h2 className="text-2xl font-bold text-red-500">에러 발생: {error.message}</h2>
      <div className="flex flex-col gap-2">
        <button className={BLACK_FILL_BUTTON_CLASS} onClick={() => reset()} type="button">
          다시 시도
        </button>
        <button className={BLACK_FILL_BUTTON_CLASS} onClick={() => router.back()} type="button">
          이전 페이지로 돌아가기
        </button>
        <Link className={BLACK_FILL_BUTTON_CLASS} href="/">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
