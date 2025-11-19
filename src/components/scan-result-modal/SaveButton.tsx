import { Bookmark } from 'lucide-react'

import cn from '@/utils/cn'

import { SAVE_BUTTON_CLASS } from './_constants/style'

export default function SaveButton({ className }: { className?: string }) {
  return (
    <button className={cn(SAVE_BUTTON_CLASS, className)}>
      <Bookmark />
      저장하기
    </button>
  )
}
