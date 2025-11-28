import { Bookmark, RotateCcw } from 'lucide-react'

import cn from '@/utils/cn'

import { GREEN_BUTTON_CLASS } from './_constants/style'

interface ButtonProps {
  className?: string
  onClick?: () => void
}

export function SaveButton({ className, onClick }: ButtonProps) {
  return (
    <button className={cn(GREEN_BUTTON_CLASS, className)} onClick={onClick}>
      <Bookmark />
      저장하기
    </button>
  )
}

export function RetryButton({ className, onClick }: ButtonProps) {
  return (
    <button className={cn(GREEN_BUTTON_CLASS, className)} onClick={onClick}>
      <RotateCcw />
      다시 스캔하기
    </button>
  )
}
