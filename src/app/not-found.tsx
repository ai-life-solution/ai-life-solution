import Link from 'next/link'

import GoBackButton from './_components/GoBackButton'
import { BLACK_FILL_BUTTON_CLASS } from './_constants/style'

export default function NotFound() {
  return (
    <div className="max-w-[600px] mx-auto p-4 flex flex-col gap-2">
      <h2 className="text-2xl font-bold">페이지 찾지 못함</h2>
      <p className="text-gray-500">요청하신 페이지를 찾을 수 없습니다.</p>
      <div className="flex gap-2">
        <GoBackButton />
        <Link className={BLACK_FILL_BUTTON_CLASS} href="/">
          홈으로 돌아가기
        </Link>
      </div>
    </div>
  )
}
