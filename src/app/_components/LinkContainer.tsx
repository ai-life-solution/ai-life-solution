import Link from 'next/link'

import ScanLink from './ScanLink'
/**
 * LinkContainer 컴포넌트
 * 
 * 앱의 주요 기능으로 이동하는 링크들을 포함하는 컨테이너 컴포넌트입니다.
 * 바코드 스캔 기능과 이전 스캔 기록 조회 기능으로의 링크를 제공합니다.
 * 
 * @returns 스캔 링크와 히스토리 링크를 포함한 JSX 요소
 */
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
