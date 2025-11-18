import Link from 'next/link'

import ScanLink from './ScanLink'

export default function LinkContainer() {
  return (
    <div className="flex flex-col gap-4 items-center">
      <ScanLink />
      <Link href="/history" className="font-semibold text-gray-500 px-4 py-2">
        이전 기록 보기
      </Link>
    </div>
  )
}
