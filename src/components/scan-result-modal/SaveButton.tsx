import { Bookmark } from 'lucide-react'

import cn from '@/utils/cn'

import { SAVE_BUTTON_CLASS } from './_constants/style'

interface SaveButtonProps {
  className?: string
  onClick?: () => void
}

export default function SaveButton({ className, onClick }: SaveButtonProps) {
  return (
    <button className={cn(SAVE_BUTTON_CLASS, className)} onClick={onClick}>
      <Bookmark />
      저장하기
    </button>
  )
}
